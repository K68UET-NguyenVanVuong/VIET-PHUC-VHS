/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SERVER-SIDE BACKEND: Express + Vite Middleware + Google GenAI
 * Phục vụ API Cố vấn Văn hóa Lịch sử cho ứng dụng "Việt phục Remix"
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

process.env.DISABLE_HMR = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Helper: lấy ngày hiện tại theo giờ Việt Nam (UTC+7) để nhồi vào prompt
// ---------------------------------------------------------------------------
function getVietnamDateContext(): string {
  const now = new Date();
  // Đổi sang giờ VN
  const vnTime = new Date(now.getTime() + (7 * 60 - now.getTimezoneOffset()) * 60 * 1000);

  const weekdays = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dd = String(vnTime.getDate()).padStart(2, '0');
  const mm = String(vnTime.getMonth() + 1).padStart(2, '0');
  const yyyy = vnTime.getFullYear();
  const weekday = weekdays[vnTime.getDay()];

  // Ước lượng âm lịch (chỉ để tham khảo — không chính xác 100%, nhưng đủ để AI không bịa)
  // Nếu cần chính xác tuyệt đối, tích hợp thư viện `amlich` hoặc gọi API.
  const amLichHint = '(Nếu không chắc âm lịch, KHÔNG được bịa. Chỉ trả lời dương lịch.)';

  return `[Mốc thời gian thực tế của hệ thống — BẮT BUỘC dùng làm chuẩn]:
- Hôm nay là: ${weekday}, ngày ${dd}/${mm}/${yyyy} (Dương lịch, giờ Việt Nam UTC+7).
- ${amLichHint}
- TUYỆT ĐỐI KHÔNG được tự bịa ngày tháng. Nếu được hỏi "hôm nay là ngày mấy", CHỈ trả lời đúng mốc dương lịch ở trên, KHÔNG thêm âm lịch, KHÔNG thêm lời khuyên trang phục, KHÔNG chào hỏi dài dòng.`;
}

async function startServer() {
  const app = express();
  // In AI Studio / Cloud Run with Nginx reverse proxy:
  // Nginx binds to 8080 (PORT) and proxies to localhost:3000.
  // Express must always bind to 3000 (DEFAULT_APP_PORT), never to Nginx's port (8080).
  const PORT = (process.env.DEFAULT_APP_PORT ? Number(process.env.DEFAULT_APP_PORT) : null)
    || (process.env.PORT && process.env.PORT !== '8080' ? Number(process.env.PORT) : 3000);

  app.use(express.json());

  // Health check routes for Cloud Run / load balancers
  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }

  // -------------------------------------------------------------
  // API: Cố vấn Văn hóa & Giải đáp Lịch sử Cổ phục
  // -------------------------------------------------------------
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], currentOutfit } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
        return;
      }

      const outfitInfo = currentOutfit ? `
[Bộ đồ người dùng đang phối trong Studio — CHỈ tham khảo, KHÔNG tự đề cập nếu người dùng không hỏi]:
- Loại trang phục: ${currentOutfit.costumeName || 'Chưa chọn'}
- Màu sắc: ${currentOutfit.colorName || 'Mặc định'}
- Quần/Thường: ${currentOutfit.bottomName || 'Lụa trắng'}
- Khăn/Mũ: ${currentOutfit.headwearName || 'Tự nhiên'}
- Giày dép: ${currentOutfit.footwearName || 'Guốc mộc'}
- Phụ kiện đi kèm: ${(currentOutfit.accessoryNames || []).join(', ') || 'Chưa chọn'}
- Địa điểm check-in: ${currentOutfit.locationName || 'Hà Nội'}
- Sự kiện: ${currentOutfit.eventName || 'Dạo xuân'}
` : '';

      const systemInstruction = `Bạn là "Cố vấn Văn hóa Di sản & Phong cách Việt phục Remix" — chuyên gia về lịch sử trang phục Việt Nam (triều Nguyễn, triều Lê, phong trào Lemur tân thời thế kỷ 20) kết hợp gu thời trang hiện đại.

NGUYÊN TẮC BẮT BUỘC:
1. TRẢ LỜI ĐÚNG TRỌNG TÂM. Hỏi gì đáp nấy. KHÔNG tự thêm mục không được hỏi (không tự chèn pose chụp ảnh, phối đồ, gợi ý địa điểm... nếu người dùng không yêu cầu).
2. KHÔNG BỊA. Nếu không chắc, nói thẳng "Mình chưa có thông tin chắc chắn về điểm này". Đặc biệt TUYỆT ĐỐI KHÔNG bịa: ngày tháng, âm lịch, số liệu lịch sử, tên hiện vật.
3. VỀ NGÀY THÁNG: Chỉ dùng mốc thời gian ở [Mốc thời gian thực tế] phía dưới. KHÔNG suy diễn "sắp Tết", "đang mùa xuân"... nếu người dùng chỉ hỏi ngày.
4. KHI NGƯỜI DÙNG HỎI NGOÀI LĨNH VỰC (toán, thời tiết, thời sự, ngày giờ...): trả lời ngắn, trung thực, KHÔNG cố gắng gắn với cổ phục.
5. ĐỘ DÀI: Câu hỏi ngắn → 1-3 câu. Câu hỏi chuyên sâu → có thể dài nhưng phải đúng chủ đề. Không lan man.
6. XƯNG HÔ: "mình" - "bạn". KHÔNG dùng "bạn trẻ", KHÔNG lên giọng dạy đời.
7. Nếu có [Bộ đồ đang phối], chỉ nhắc tới khi người dùng hỏi về phối đồ / bộ đồ / check-in. Không tự tiện nhắc.

KIẾN THỨC NỀN (dùng khi được hỏi):
- Áo Nhật Bình: thường phục hậu phi, công chúa triều Nguyễn (từ 1807); viền cổ hình chữ nhật; dải ngũ sắc ở tay áo.
- Áo Tấc (Ngũ Thân tay thụng): đại lễ phục; 4 thân ngoài = Tứ thân phụ mẫu, thân thứ 5 = thân con; 5 cúc = Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín).
- Áo Ngũ Thân tay chẽn (1837): tiền thân trực tiếp của Áo Dài hiện đại.
- Áo Dài Lemur (Cát Tường, 1930s), Lê Phổ (1934), Raglan (1960s).
- Remix hợp lý: sneaker trắng tối giản, kính retro, túi cói, máy film. Tránh: quần đùi, cởi bung vạt, giày hầm hố.

${getVietnamDateContext()}`;

      if (ai) {
        try {
          const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

          if (Array.isArray(history) && history.length > 0) {
            for (const item of history.slice(-8)) {
              if (item && item.text && (item.role === 'user' || item.role === 'model')) {
                contents.push({ role: item.role, parts: [{ text: item.text }] });
              }
            }
          }

          const promptText = outfitInfo
            ? `${outfitInfo}\n\n[Câu hỏi của người dùng]:\n${message}`
            : message;
          contents.push({ role: 'user', parts: [{ text: promptText }] });

          // ✅ SỬA: dùng đúng tên model Gemini tồn tại thực tế
          const candidateModels = [
            'gemini-2.5-flash',
            'gemini-2.5-pro',
          ];
          let responseText = '';

          for (const modelName of candidateModels) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents,
                config: {
                  systemInstruction,
                  temperature: 0.4,          // ✅ giảm từ 0.7 → 0.4 để bớt bịa
                  maxOutputTokens: 800,      // ✅ chặn lan man
                  topP: 0.9,
                },
              });
              if (response && response.text) {
                responseText = response.text;
                break;
              }
            } catch (modelError: any) {
              console.warn(
                `Model ${modelName} call failed (${modelError?.status || modelError?.message}), trying next...`
              );
            }
          }

          if (responseText) {
            res.json({ reply: responseText, source: 'gemini' });
            return;
          }
        } catch (apiError: any) {
          console.error('All Gemini API calls failed, using fallback:', apiError);
        }
      }

      const fallbackReply = generateCulturalFallback(message, currentOutfit);
      res.json({ reply: fallbackReply, source: 'vietphuc-heritage-knowledgebase' });
    } catch (err: any) {
      console.error('Error handling /api/chat:', err);
      res.status(500).json({ error: 'Đã xảy ra lỗi nội bộ máy chủ.' });
    }
  });

  app.use(express.static(__dirname));
  app.use(express.static(path.join(__dirname, 'public')));

  const distPath = path.join(__dirname, 'dist');
  const distExists = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || (distExists && process.env.NODE_ENV !== 'development')) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite dev server failed to start, falling back to dist static files:', viteErr);
      if (distExists) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇻🇳 Việt phục Remix Server đang chạy tại http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('❌ Lỗi khởi động máy chủ:', err);
    process.exit(1);
  });

  const handleShutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

// -------------------------------------------------------------
// BỘ TRI THỨC DỰ PHÒNG (chỉ chạy khi Gemini lỗi / không có API key)
// -------------------------------------------------------------
function generateCulturalFallback(query: string, currentOutfit?: any): string {
  const q = query.toLowerCase().trim();

  // Ưu tiên 1: câu hỏi về ngày tháng → trả lời bằng ngày hệ thống, KHÔNG bịa
  if (
    q.includes('hôm nay') ||
    q.includes('ngày mấy') ||
    q.includes('thứ mấy') ||
    q.includes('hôm nay là') ||
    /ngày\s*\d/.test(q)
  ) {
    const now = new Date();
    const vn = new Date(now.getTime() + (7 * 60 - now.getTimezoneOffset()) * 60 * 1000);
    const weekdays = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dd = String(vn.getDate()).padStart(2, '0');
    const mm = String(vn.getMonth() + 1).padStart(2, '0');
    const yyyy = vn.getFullYear();
    return `Hôm nay là ${weekdays[vn.getDay()]}, ngày ${dd}/${mm}/${yyyy} (giờ Việt Nam).`;
  }

  // Ưu tiên 2: 3 câu hỏi stylist cốt lõi theo đề bài Hackathon
  if (q.includes('da ngăm') || q.includes('tôn dáng') || q.includes('da banh mat')) {
    return (
      `✨ **Gợi ý Stylist cho làn da ngăm / bánh mật:**\n\n` +
      `- **Gam màu tôn da:** Ưu tiên các tông đất nung trầm ấm như **Đỏ Điều Son (#BA181B)**, **Đất Nung Hỏa Biến (#B85D3B)**, **Cam Hổ Phách (#EA580C)** hoặc **Lam Tràm Cung Đình (#1D3557)**.\n` +
      `- **Mẹo phối:** Tránh các màu neon gắt chói hay trắng tinh huỳnh quang. Quần nên đi kèm lụa cát kem (#FAF7F0) hoặc đen mun để tạo độ tương phản mượt mà, tôn làn da khỏe khoắn mà cực sang trọng!`
    );
  }

  if (q.includes('bê tráp') || q.includes('be trap') || (q.includes('nhật bình') && q.includes('cưới'))) {
    return (
      `💍 **Quy tắc khi đi bê tráp / phụ dâu với Áo Nhật Bình:**\n\n` +
      `- **Quy tắc lịch sự:** Đội bê tráp **KHÔNG NÊN** mặc Áo Nhật Bình quá lộng lẫy (nhất là sắc Vàng Kim hoặc Đỏ Son thêu phượng), vì Nhật Bình vốn là áo cô dâu chính. Mặc nổi bật hơn sẽ "chiếm spotlight" của cô dâu.\n` +
      `- **Lựa chọn chuẩn mực:** Đội bê tráp nên chọn **Áo Dài ngũ thân** hoặc **Áo Tấc nhạt màu** (hồng phấn, lam ngọc, xanh rêu phong) trang nhã để tôn cô dâu làm tâm điểm hỷ sự!`
    );
  }

  if ((q.includes('áo tấc') || q.includes('ao tac')) && (q.includes('trẻ trung') || q.includes('sự kiện') || q.includes('tre trung'))) {
    return (
      `👘 **Cách phối Áo Tấc đi sự kiện trẻ trung, năng động (Gen Z Remix):**\n\n` +
      `1. **Chọn bảng màu tươi mới:** Phối màu tà áo **Lam Tràm (#1D3557)** hoặc **Lục Trúc (#2D6A4F)** đi cùng quần lụa trắng sa mỏng nhẹ.\n` +
      `2. **Phụ kiện remix tinh tế:** Đi cùng **sneaker trắng phom gọn (vintage tennis/samba)** thay vì giày tây cứng nhắc, đeo kính mắt râm gọng tròn kim loại.\n` +
      `3. **Túi xách:** Cầm clutch gấm hoặc túi cói thủ công, đeo đồng hồ da cổ điển — vừa giữ nét khiêm cung của tay thụng vừa cực kỳ thời thượng!`
    );
  }

  // Ưu tiên 3: kiến thức cổ phục
  if (q.includes('nhật bình') || q.includes('nhat binh')) {
    return (
      `🌸 **Áo Nhật Bình triều Nguyễn:**\n\n` +
      `- Thường phục cao quý của hậu phi, công chúa, mệnh phụ (từ 1807).\n` +
      `- Viền cổ ghép thành hình chữ nhật trước ngực — nguồn gốc tên gọi.\n` +
      `- Dải ngũ sắc ở hai đầu tay áo tượng trưng Ngũ hành.\n` +
      `- Phối chuẩn: khăn vành dây ngũ sắc hoặc trâm ngọc; tránh đội nón lá.`
    );
  }

  if (q.includes('áo tấc') || q.includes('ao tac') || q.includes('tay thụng')) {
    return (
      `👘 **Áo Tấc (Ngũ Thân tay thụng):**\n\n` +
      `- Đại lễ phục dùng trong tế tự, hôn lễ, cúng tổ tiên, Tết.\n` +
      `- 4 thân ngoài = Tứ thân phụ mẫu; thân thứ 5 = thân con.\n` +
      `- 5 cúc = Ngũ thường: Nhân - Lễ - Nghĩa - Trí - Tín.`
    );
  }

  if (q.includes('ngũ thân') || q.includes('tay chẽn')) {
    return (
      `🌿 **Áo Ngũ Thân tay chẽn:**\n\n` +
      `- Hoàn thiện dưới thời chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng (1837).\n` +
      `- Tay ôm sát cổ tay → năng động, là tiền thân trực tiếp của Áo Dài hiện đại.`
    );
  }

  if (q.includes('áo dài') || q.includes('ao dai')) {
    return (
      `📜 **Các loại Áo Dài tiêu biểu:**\n\n` +
      `1. Giao Lĩnh / Viên Lĩnh (Lý - Trần - Lê)\n` +
      `2. Ngũ Thân tay thụng — Áo Tấc (1744)\n` +
      `3. Ngũ Thân tay chẽn (1837)\n` +
      `4. Lemur — Cát Tường (1930s)\n` +
      `5. Lê Phổ (1934)\n` +
      `6. Raglan (1960s)\n` +
      `7. Cách tân / Gen Z Remix (hiện đại)`
    );
  }

  if (q.includes('văn miếu') || q.includes('chụp ở đâu') || q.includes('địa điểm') || q.includes('hoàng thành')) {
    return (
      `📸 **Gợi ý bối cảnh check-in:**\n\n` +
      `- Văn Miếu: hợp Áo Tấc, Ngũ Thân tay chẽn.\n` +
      `- Hoàng Thành Thăng Long: hợp Nhật Bình, Áo Tấc đỏ/lam.\n` +
      `- Vào khu thờ tự: cài đủ cúc cổ, tháo kính râm.`
    );
  }

  if (q.includes('remix') || q.includes('sneaker') || q.includes('phá cách')) {
    return (
      `✨ **Remix cổ phục không phạm quy:**\n\n` +
      `1. Sneaker trắng tối giản — OK khi dạo phố ngoại cảnh.\n` +
      `2. Kính retro, túi cói, máy film — tạo chất vintage.\n` +
      `3. Tránh: quần đùi, cởi bung vạt, giày hầm hố lòe loẹt.`
    );
  }

  return (
    `Mình là Cố vấn Văn hóa của "Việt phục Remix". ` +
    `Bạn có thể hỏi mình về: nguồn gốc & ý nghĩa các loại cổ phục (Nhật Bình, Áo Tấc, Ngũ Thân, Áo Dài), ` +
    `quy tắc phối màu & phụ kiện, cách remix hiện đại, hoặc gợi ý bối cảnh check-in.`
  );
}

startServer().catch((err) => {
  console.error('Không thể khởi động server:', err);
});