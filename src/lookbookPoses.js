/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * VIRTUAL PHOTOSHOOT: MASTER FASHION CROQUIS & BEZIER CURVE ENGINE
 * Chuẩn mực Vẽ Thời Trang Cao Cấp (High-End Fashion Croquis):
 * 1. Thân hình & Vòng eo: Vai vuốt xuôi Bezier (C/Q), nách đánh cong sâu tạo eo thắt hình chữ S, lượn nhẹ ra ở hông.
 * 2. Cánh tay hữu cơ: Khớp vai tròn, thuôn nhỏ DẦN từ bắp tay (24px) -> khuỷu tay (18px) -> cổ tay (12px).
 * 3. Bàn tay giọt nước kéo dài (Tapered Tear-Drop Shape): Khối thuôn nhọn thanh lịch khép ngón.
 * 4. Độ rủ vải lụa: Tà áo 1/3 dưới cùng lượn sóng loe nhẹ nhàng như lụa bay.
 * 5. Mấn cung đình: Ôm khít vòm đầu và tai, không lơ lửng hay bè ngang.
 * 6. TUYỆT ĐỐI KHÔNG DÙNG: <rect>, <polygon>, <line>. 100% CẤU TRÚC BẰNG <path> VỚI C, S, Q.
 */

export const FASHION_PALETTE = {
  skin: '#F4DAC8',
  skinShadow: '#E5C0A7',
  hair: '#231C18',
  hairHighlight: '#3D312A',
  gold: '#D4AF37',
  goldLight: '#F5DC76',
  goldDark: '#AA820A',
  ruby: '#BA181B',
  shadowRobe: 'rgba(0,0,0,0.14)',
  shadowPants: 'rgba(0,0,0,0.20)'
};

// 1. Defs dùng chung cho toàn bộ hệ thống SVG
export function getUnifiedSvgDefs() {
  return `
    <defs>
      <!-- Gradient Mấn Cung Đình U Úp Ngược Ôm Sát Đầu -->
      <linearGradient id="unifiedManGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#BA181B" />
        <stop offset="65%" stop-color="#8B1518" />
        <stop offset="100%" stop-color="#5E0D0F" />
      </linearGradient>

      <!-- Gradient Viền Hoàng Kim Dệt Gấm -->
      <linearGradient id="unifiedGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCE588" />
        <stop offset="60%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#9C7708" />
      </linearGradient>

      <!-- Nẹp Cổ Nhật Bình Ngũ Sắc Flat -->
      <linearGradient id="unifiedNhatBinhStripe" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#BA181B" />
        <stop offset="20%" stop-color="#D4AF37" />
        <stop offset="40%" stop-color="#1D3557" />
        <stop offset="60%" stop-color="#2D6A4F" />
        <stop offset="80%" stop-color="#FAF7F0" />
        <stop offset="100%" stop-color="#BA181B" />
      </linearGradient>

      <!-- Quạt Nan Tre Lụa Bán Nguyệt -->
      <linearGradient id="unifiedFanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFDF5" />
        <stop offset="60%" stop-color="#F2E6CE" />
        <stop offset="100%" stop-color="#DECBB0" />
      </linearGradient>

      <!-- Bóng đổ gót chân mềm mại -->
      <filter id="unifiedFloorShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4.5" />
      </filter>
    </defs>
  `;
}

// 2. Nhóm Đầu, Cổ & Khuôn Mặt Faceless Croquis (Đáy Cổ Kết Thúc Chính Xác Tại y=200)
export function renderUnifiedHead(cx = 200, neckY = 200) {
  return `
    <!-- NHÓM ĐẦU & CỔ BEZIER HỮU CƠ (ĐÁY CỔ KẾT THÚC CHÍNH XÁC TẠI Y=200) -->
    <g id="unified-head-group">
      <!-- Cổ vuốt cong mềm mại từ cằm (132) xuống đáy cổ tại y=200, chia sẻ mốc (190,200) và (210,200) -->
      <path 
        d="M ${cx - 10},200 C ${cx - 11},175 ${cx - 10},150 ${cx - 9},132 C ${cx - 4},134 ${cx + 4},134 ${cx + 9},132 C ${cx + 10},150 ${cx + 11},175 ${cx + 10},200 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <!-- Mảng bóng đổ hốc cổ thanh mảnh -->
      <path 
        d="M ${cx - 7},136 C ${cx - 3},152 ${cx + 3},152 ${cx + 7},136 C ${cx + 5},146 ${cx - 1},150 ${cx - 7},136 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
      />

      <!-- Búi tóc Chignon uốn lượn mềm mại phía sau đầu -->
      <path 
        d="M ${cx - 22},94 C ${cx - 34},82 ${cx - 34},60 ${cx - 18},48 C ${cx - 3},37 ${cx + 18},37 ${cx + 34},48 C ${cx + 48},60 ${cx + 48},82 ${cx + 26},94 C ${cx + 8},81 ${cx - 10},81 ${cx - 22},94 Z" 
        fill="${FASHION_PALETTE.hair}" 
      />
      <path 
        d="M ${cx - 12},54 C ${cx - 1},45 ${cx + 12},45 ${cx + 23},54 C ${cx + 15},50 ${cx - 5},50 ${cx - 12},54 Z" 
        fill="${FASHION_PALETTE.hairHighlight}" 
      />

      <!-- Khuôn mặt Oval thanh tú Faceless Croquis (Cao 85px, Rộng 48px) -->
      <path 
        d="M ${cx},52 C ${cx + 24},52 ${cx + 24},74 ${cx + 24},98 C ${cx + 24},123 ${cx + 13},134 ${cx},134 C ${cx - 13},134 ${cx - 24},123 ${cx - 24},98 C ${cx - 24},74 ${cx - 24},52 ${cx},52 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <!-- Mảng bóng nửa khuôn mặt 3/4 -->
      <path 
        d="M ${cx},52 C ${cx + 24},52 ${cx + 24},74 ${cx + 24},98 C ${cx + 24},123 ${cx + 13},134 ${cx},134 C ${cx + 5},121 ${cx + 7},92 ${cx + 4},70 C ${cx + 2},58 ${cx - 2},54 ${cx},52 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.55" 
      />

      <!-- Tóc mái vuốt ngôi thanh lịch -->
      <path 
        d="M ${cx - 24},74 C ${cx - 17},61 ${cx - 5},54 ${cx},54 C ${cx + 5},54 ${cx + 17},61 ${cx + 24},74 C ${cx + 19},64 ${cx + 9},57 ${cx},57 C ${cx - 9},57 ${cx - 19},64 ${cx - 24},74 Z" 
        fill="${FASHION_PALETTE.hair}" 
      />
    </g>
  `;
}

// 3. Mấn Cung Đình Ôm Sát Khít Vòm Đầu & Tai (Không Lơ Lửng, Không Bè Ngang)
export function renderUnifiedRoyalHeadpiece(cx = 200, hasHeadwear = true) {
  if (!hasHeadwear) return '';

  // Hạt ngọc trai vàng đính khít theo đường cong mấn
  const pearlDots = [
    { x: cx - 44, y: 114 }, { x: cx - 41, y: 90 }, { x: cx - 32, y: 66 }, { x: cx - 17, y: 48 },
    { x: cx, y: 42 }, { x: cx + 17, y: 48 }, { x: cx + 32, y: 66 }, { x: cx + 41, y: 90 }, { x: cx + 44, y: 114 }
  ].map(p => `
    <g>
      <path d="M ${p.x - 3.8},${p.y} C ${p.x - 3.8},${p.y - 3.8} ${p.x + 3.8},${p.y - 3.8} ${p.x + 3.8},${p.y} C ${p.x + 3.8},${p.y + 3.8} ${p.x - 3.8},${p.y + 3.8} ${p.x - 3.8},${p.y} Z" fill="${FASHION_PALETTE.gold}" />
      <path d="M ${p.x - 1.8},${p.y - 1} C ${p.x - 1.8},${p.y - 2.5} ${p.x + 0.2},${p.y - 2.5} ${p.x + 0.2},${p.y - 1} C ${p.x + 0.2},${p.y + 0.5} ${p.x - 1.8},${p.y + 0.5} ${p.x - 1.8},${p.y - 1} Z" fill="${FASHION_PALETTE.goldLight}" />
    </g>
  `).join('');

  return `
    <!-- MẤN CUNG ĐÌNH ÔM SÁT KHÍT VÒM ĐẦU -->
    <g id="unified-royal-headpiece">
      <!-- Khối mấn chính chữ U úp ngược ôm khít đầu (X: cx-48 đến cx+48, đỉnh y: 32) -->
      <path 
        d="M ${cx - 48},126 C ${cx - 56},78 ${cx - 36},32 ${cx},32 C ${cx + 36},32 ${cx + 56},78 ${cx + 48},126 C ${cx + 38},82 ${cx + 26},48 ${cx},48 C ${cx - 26},48 ${cx - 38},82 ${cx - 48},126 Z" 
        fill="url(#unifiedManGrad)" 
      />
      <!-- Vành viền vàng gấm dệt uốn lượn ôm sát -->
      <path 
        d="M ${cx - 48},126 C ${cx - 56},78 ${cx - 36},32 ${cx},32 C ${cx + 36},32 ${cx + 56},78 ${cx + 48},126 C ${cx + 44},80 ${cx + 28},38 ${cx},38 C ${cx - 28},38 ${cx - 44},80 ${cx - 48},126 Z" 
        fill="url(#unifiedGoldGrad)" 
      />
      <!-- Vành trong ôm khít trán -->
      <path 
        d="M ${cx - 34},116 C ${cx - 42},80 ${cx - 24},52 ${cx},52 C ${cx + 24},52 ${cx + 42},80 ${cx + 34},116 C ${cx + 28},84 ${cx + 18},59 ${cx},59 C ${cx - 18},59 ${cx - 28},84 ${cx - 34},116 Z" 
        fill="url(#unifiedGoldGrad)" 
      />

      <!-- Hàng ngọc trai vàng đính dọc theo mấn -->
      ${pearlDots}

      <!-- Biểu tượng hoa sen vàng đính ruby ở đỉnh mấn -->
      <g transform="translate(${cx}, 29)">
        <path d="M 0,-7 C 3,-4 5,0 0,6 C -5,0 -3,-4 0,-7 Z" fill="${FASHION_PALETTE.goldLight}" />
        <path d="M -2,0 C -2,-2 2,-2 2,0 C 2,2 -2,2 -2,0 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    </g>
  `;
}

/**
 * =========================================================================
 * 1. UNIFIED COMPONENT: ÁO DÀI TRUYỀN THỐNG (TRADITIONAL ÁO DÀI)
 * - Bờ vai vuốt dốc mềm mại bằng Bezier (C).
 * - Nách đánh cong sâu vào trong tạo eo thắt đồng hồ cát (66px), lượn nhẹ ra ở hông.
 * - Cánh tay thuôn nhỏ dần từ bắp tay (24px) -> khuỷu tay (18px) -> cổ tay (12px).
 * - Bàn tay hình giọt nước kéo dài (Tapered Tear-Drop Shape) khép ngón thanh lịch.
 * - Tà áo 1/3 dưới cùng loe nhẹ nhàng lượn sóng như lụa bay.
 * - Bàn tay xách túi nằm ĐÈ LÊN đỉnh quai túi chữ U úp ngược.
 * =========================================================================
 */
export function renderUnifiedAoDaiTruyenThong(sceneId = 'hoguom', hasBag = true, hasFan = true, hasHeadwear = true) {
  const isScene2 = (sceneId === 'hoangthanh');
  const cx = isScene2 ? 203 : 200;

  // LỚP 1: BÓNG SÀN TIẾP ĐẤT (PATH KHÉP KÍN)
  const floorShadow = `
    <path 
      d="M ${cx - 58},770 C ${cx - 58},765 ${cx + 58},765 ${cx + 58},770 C ${cx + 58},775 ${cx - 58},775 ${cx - 58},770 Z" 
      fill="rgba(0,0,0,0.38)" 
      filter="url(#unifiedFloorShadow)" 
    />
  `;

  // LỚP 2: QUẦN LỤA ỐNG RỘNG (HOÀN TOÀN DÙNG PATH VỚI BEZIER C)
  const pants = `
    <g id="unified-silk-pants">
      <!-- Ống quần trái loe rộng mềm mại rủ xuống mu bàn chân -->
      <path 
        d="${isScene2 
          ? 'M 174,288 C 165,410 152,560 140,758 C 158,764 186,764 198,758 C 194,580 191,420 188,288 Z' 
          : 'M 172,288 C 162,410 148,560 138,758 C 156,764 184,764 196,758 C 192,580 189,420 186,288 Z'}" 
        class="costume-pant-element" 
      />
      <!-- Mảng bóng nếp vải quần trái -->
      <path 
        d="${isScene2 
          ? 'M 174,288 C 165,410 152,560 140,758 C 148,760 156,760 162,758 C 172,570 178,420 182,288 Z' 
          : 'M 172,288 C 162,410 148,560 138,758 C 146,760 154,760 160,758 C 170,570 176,420 180,288 Z'}" 
        fill="${FASHION_PALETTE.shadowPants}" 
      />

      <!-- Ống quần phải loe rộng mềm mại -->
      <path 
        d="${isScene2 
          ? 'M 214,288 C 215,420 218,580 216,758 C 232,764 260,764 272,758 C 262,580 248,420 230,288 Z' 
          : 'M 212,288 C 214,420 216,580 215,758 C 230,764 258,764 270,758 C 260,580 246,420 228,288 Z'}" 
        class="costume-pant-element" 
      />
      <path 
        d="${isScene2 
          ? 'M 230,288 C 248,420 262,580 272,758 C 264,760 256,760 248,758 C 238,580 228,420 222,288 Z' 
          : 'M 228,288 C 246,420 260,580 270,758 C 262,760 254,760 246,758 C 236,580 226,420 220,288 Z'}" 
        fill="${FASHION_PALETTE.shadowPants}" 
      />
    </g>
  `;

  // LỚP 3: THÂN ÁO DÀI, BỜ VAI, CÁNH TAY & TÀ ÁO LƯỢN SÓNG (BEZIER HOÀN TOÀN)
  let robeAndArms = '';
  let hands = '';
  let toteSvg = '';
  let fanSvg = '';

  if (sceneId === 'hoguom') {
    // SCENE 1: DÁNG SẢI BƯỚC HỒ GƯƠM
    robeAndArms = `
      <g id="unified-aodai-body-arms">
        <!-- CÁNH TAY TRÁI THUÔN HỮU CƠ: NỐI TỪ VAI (240,210) XUỐNG CỔ TAY (242..254, Y=450) -->
        <path 
          d="M 210,200 L 240,210 C 255,230 262,280 258,335 C 256,380 254,420 254,450 L 242,450 C 242,420 244,380 244,335 C 244,280 236,240 226,220 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 240,210 C 255,230 262,280 258,335 C 256,380 254,420 254,450 L 250,450 C 252,420 254,380 252,335 C 252,280 244,240 234,215 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />

        <!-- CÁNH TAY PHẢI THUÔN HỮU CƠ: NỐI TỪ VAI (160,210) XUỐNG CỔ TAY (146..158, Y=450) -->
        <path 
          d="M 190,200 L 160,210 C 145,230 138,280 142,335 C 144,380 146,420 146,450 L 158,450 C 158,420 156,380 156,335 C 156,280 164,240 174,220 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 160,210 C 145,230 138,280 142,335 C 144,380 146,420 146,450 L 150,450 C 148,420 146,380 148,335 C 148,280 156,240 166,215 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />

        <!-- THÂN ÁO DÀI: ĐỈNH CỔ ÁO BẮT ĐẦU CHÍNH XÁC TẠI Y=200 CHIA SẺ (190,200) VÀ (210,200) -->
        <path 
          d="M 190,200 L 160,210 C 156,245 165,275 168,280 C 170,305 172,330 174,335 C 172,365 170,390 170,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 200,200 L 200,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />

        <!-- CỔ LÃNH TỤ CAO 3CM ÔM KHÍT CHÂN CỔ (TỪ Y=200 LÊN Y=182) -->
        <path 
          d="M 189,182 C 196,180 204,180 211,182 L 210,200 L 190,200 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 189,182 C 196,180 204,180 211,182 L 210,185 C 204,183 196,183 189,185 Z" 
          fill="${FASHION_PALETTE.gold}" 
        />
        <path d="M 207,188 C 207,187 209,187 209,188 C 209,189 207,189 207,188 Z" fill="${FASHION_PALETTE.goldLight}" />
        <path d="M 213,198 C 213,197 215,197 215,198 C 215,199 213,199 213,198 Z" fill="${FASHION_PALETTE.goldLight}" />

        <!-- TÀ ÁO DÀI TRƯỚC: XẺ CAO NGANG EO, LƯỢN SÓNG LỤA RỦ THƯỚT THA -->
        <path 
          d="M 170,410 C 166,490 160,580 152,740 C 175,746 205,748 230,745 C 248,743 256,741 258,738 C 250,580 244,490 230,410 Z" 
          class="costume-robe-element" 
        />
        <!-- Mảng bóng nếp lụa tà trước -->
        <path 
          d="M 200,410 L 230,410 C 244,490 250,580 258,738 C 242,742 222,745 200,746 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />
        <path 
          d="M 185,580 C 182,635 178,690 172,742 C 176,743 180,744 184,744 C 190,690 194,635 197,580 Z" 
          fill="rgba(255,255,255,0.18)" 
        />
      </g>
    `;

    // BÀN TAY HÌNH THOI THUÔN DÀI BO GÓC NỐI TỪ CỔ TAY (Y=450)
    hands = `
      <g id="unified-hands-rhombus-stride">
        <path 
          d="M 146,450 C 141,460 142,470 152,484 C 162,470 163,460 158,450 Z" 
          fill="${FASHION_PALETTE.skin}" 
        />
        <path 
          d="M 150,458 C 150,468 152,478 152,484 C 158,474 160,464 157,452 Z" 
          fill="${FASHION_PALETTE.skinShadow}" 
          opacity="0.35" 
        />

        <path 
          d="M 242,450 C 237,460 238,470 248,484 C 258,470 259,460 254,450 Z" 
          fill="${FASHION_PALETTE.skin}" 
        />
        <path 
          d="M 246,458 C 246,468 248,478 248,484 C 254,474 256,464 253,452 Z" 
          fill="${FASHION_PALETTE.skinShadow}" 
          opacity="0.35" 
        />
      </g>
    `;

    // TÚI TOTE CANVAS: QUAI VẼ ĐÈ LÊN BÀN TAY
    if (hasBag) {
      toteSvg = `
        <g id="unified-tote-group">
          <path 
            d="M 136,505 C 136,445 144,438 152,438 C 160,438 168,445 168,505" 
            stroke="#3D2E24" 
            stroke-width="4.5" 
            stroke-linecap="round" 
            fill="none" 
          />
          <path 
            d="M 120,505 C 120,500 184,500 184,505 C 184,545 182,595 180,630 C 180,634 124,634 124,630 C 122,595 120,545 120,505 Z" 
            fill="#F4EFE6" 
          />
          <path 
            d="M 120,505 C 120,500 136,500 136,505 C 136,545 134,595 132,630 C 128,632 124,634 124,630 C 122,595 120,545 120,505 Z" 
            fill="#E2DAC9" 
          />
          <path d="M 152,560 C 148,568 149,576 152,580 C 155,576 156,568 152,560 Z" fill="${FASHION_PALETTE.ruby}" />
        </g>
      `;
    }

  } else {
    // SCENE 2: DÁNG S-LINE HOÀNG THÀNH
    robeAndArms = `
      <g id="unified-aodai-body-arms-sline">
        <!-- CÁNH TAY TRÁI THUÔN NỐI TỪ VAI (240,210) XUỐNG CỔ TAY (242..254, Y=450) -->
        <path 
          d="M 210,200 L 240,210 C 255,230 262,280 258,335 C 256,380 254,420 254,450 L 242,450 C 242,420 244,380 244,335 C 244,280 236,240 226,220 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 240,210 C 255,230 262,280 258,335 C 256,380 254,420 254,450 L 250,450 C 252,420 254,380 252,335 C 252,280 244,240 234,215 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />

        <!-- CÁNH TAY PHẢI GẬP TÙ MỀM MẠI CẦM QUẠT: VAI (160,210) -> KHUỶU (138,285) -> CỔ TAY (166,280) -->
        <path 
          d="M 190,200 L 160,210 C 142,230 132,260 138,285 C 142,306 158,308 174,286 L 164,280 C 152,295 144,285 142,274 C 140,250 148,225 166,215 Z" 
          class="costume-robe-element" 
        />

        <!-- THÂN ÁO DÀI S-LINE: ĐỈNH CỔ ÁO BẮT ĐẦU CHÍNH XÁC TẠI Y=200 CHIA SẺ (190,200) VÀ (210,200) -->
        <path 
          d="M 190,200 L 160,210 C 156,245 165,275 168,280 C 170,305 172,330 174,335 C 172,365 170,390 170,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 203,200 L 203,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />

        <!-- CỔ LÃNH TỤ CAO 3CM -->
        <path 
          d="M 189,182 C 196,180 204,180 211,182 L 210,200 L 190,200 Z" 
          class="costume-robe-element" 
        />
        <path d="M 189,182 C 196,180 204,180 211,182 L 210,185 C 204,183 196,183 189,185 Z" fill="${FASHION_PALETTE.gold}" />

        <!-- TÀ ÁO DÀI TRƯỚC S-LINE: THƯỚT THA CHẤM GÓT -->
        <path 
          d="M 170,410 C 166,490 160,580 152,740 C 175,746 205,748 230,745 C 248,743 256,741 258,738 C 250,580 244,490 230,410 Z" 
          class="costume-robe-element" 
        />
        <path 
          d="M 203,410 L 230,410 C 244,490 250,580 258,738 C 242,742 222,745 203,746 Z" 
          fill="${FASHION_PALETTE.shadowRobe}" 
        />
      </g>
    `;

    if (hasFan) {
      fanSvg = `
        <g id="unified-folding-fan">
          <path d="M 175,282 L 136,228 C 160,202 200,202 225,226 Z" fill="url(#unifiedFanGrad)" />
          <path d="M 175,282 C 164,256 152,232 148,222" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
          <path d="M 175,282 C 172,252 170,224 168,212" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
          <path d="M 175,282 C 182,252 186,224 190,212" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
          <path d="M 175,282 C 190,256 204,232 210,222" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
          <path d="M 172,284 C 172,282 178,282 178,284 C 178,286 172,286 172,284 Z" fill="${FASHION_PALETTE.gold}" />
          <path d="M 175,286 C 173,300 173,315 175,322 C 176,315 176,300 175,286 Z" fill="${FASHION_PALETTE.ruby}" />
        </g>
      `;
    }

    // BÀN TAY S-LINE
    hands = `
      <g id="unified-hands-sline">
        <!-- BÀN TAY TRÁI NỐI TỪ CỔ TAY (242..254, Y=450) -->
        <path 
          d="M 242,450 C 237,460 238,470 248,484 C 258,470 259,460 254,450 Z" 
          fill="${FASHION_PALETTE.skin}" 
        />
        <path 
          d="M 246,458 C 246,468 248,478 248,484 C 254,474 256,464 253,452 Z" 
          fill="${FASHION_PALETTE.skinShadow}" 
          opacity="0.35" 
        />

        <!-- BÀN TAY PHẢI CẦM QUẠT -->
        <path 
          d="M 166,278 C 171,282 178,284 183,282 C 186,281 186,277 182,275 C 175,273 169,273 165,275 Z" 
          fill="${FASHION_PALETTE.skin}" 
        />
      </g>
    `;
  }

  const head = renderUnifiedHead(cx, 200);
  const headpiece = renderUnifiedRoyalHeadpiece(cx, hasHeadwear);

  return `
    <g id="unified-outfit-ao-dai-truyen-thong">
      ${floorShadow}
      ${pants}
      ${robeAndArms}
      ${hands}
      ${toteSvg}
      ${fanSvg}
      ${head}
      ${headpiece}
    </g>
  `;
}

/**
 * =========================================================================
 * 2. UNIFIED COMPONENT: ÁO TẤC (ĐẠI LỄ TAY THỤNG)
 * Tay thụng to rộng rủ tự nhiên bằng Bezier, không đường thẳng que củi.
 * =========================================================================
 */
export function renderUnifiedAoTac(sceneId = 'hoguom', hasBag = true, hasFan = true, hasHeadwear = true) {
  const isScene2 = (sceneId === 'hoangthanh');
  const cx = isScene2 ? 203 : 200;

  const floorShadow = `
    <path 
      d="M ${cx - 58},770 C ${cx - 58},765 ${cx + 58},765 ${cx + 58},770 C ${cx + 58},775 ${cx - 58},775 ${cx - 58},770 Z" 
      fill="rgba(0,0,0,0.38)" 
      filter="url(#unifiedFloorShadow)" 
    />
  `;

  const pants = `
    <g id="unified-aotac-pants">
      <path 
        d="${isScene2 
          ? 'M 172,520 C 165,600 156,680 152,764 C 168,768 192,768 200,764 C 196,680 195,600 195,520 Z' 
          : 'M 168,520 C 162,600 154,680 150,764 C 166,768 190,768 198,764 C 194,680 193,600 193,520 Z'}" 
        class="costume-pant-element" 
      />
      <path 
        d="${isScene2 
          ? 'M 198,520 C 198,600 200,680 202,764 C 218,768 244,768 250,764 C 242,680 234,600 230,520 Z' 
          : 'M 195,520 C 195,600 197,680 199,764 C 215,768 241,768 247,764 C 239,680 230,600 226,520 Z'}" 
        class="costume-pant-element" 
      />
    </g>
  `;

  const robeAndArms = `
    <g id="unified-aotac-robe-and-arms">
      <!-- CÁNH TAY THỤNG TRÁI: NỐI TỪ VAI (240,210) RỦ XÒE RỘNG TỰ NHIÊN XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 210,200 L 240,210 C 275,225 304,265 298,335 C 292,395 272,445 254,450 L 242,450 C 244,395 240,335 236,285 C 235,245 230,220 210,200 Z" 
        class="costume-robe-element" 
      />
      <!-- CÁNH TAY THỤNG PHẢI: NỐI TỪ VAI (160,210) RỦ XÒE RỘNG TỰ NHIÊN XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 190,200 L 160,210 C 125,225 96,265 102,335 C 108,395 128,445 146,450 L 158,450 C 156,395 160,335 164,285 C 165,245 170,220 190,200 Z" 
        class="costume-robe-element" 
      />

      <!-- THÂN ÁO TẤC NGŨ THÂN DÀI QUA ĐẦU GỐI: ĐỈNH CỔ ÁO TẠI Y=200 CHIA SẺ (190,200) VÀ (210,200) -->
      <path 
        d="M 190,200 L 160,210 C 152,245 150,340 146,450 C 142,540 140,590 136,600 C 175,612 235,612 270,600 C 266,590 264,540 260,450 C 256,340 248,245 240,210 L 210,200 Z" 
        class="costume-robe-element" 
      />
      <path 
        d="M 200,200 L 200,606 C 225,606 250,604 270,600 C 266,590 264,540 260,450 C 256,340 248,245 240,210 L 210,200 Z" 
        fill="${FASHION_PALETTE.shadowRobe}" 
      />

      <!-- Nẹp cổ đứng cài khuy bên phải & hàng cúc vàng -->
      <path 
        d="M 188,182 C 196,180 204,180 212,182 L 210,200 L 190,200 Z" 
        fill="${FASHION_PALETTE.gold}" 
      />
      <path d="M 216,212 C 216,210 218,210 218,212 C 218,214 216,214 216,212 Z" fill="${FASHION_PALETTE.goldLight}" />
      <path d="M 221,230 C 221,228 223,228 223,230 C 223,232 221,232 221,230 Z" fill="${FASHION_PALETTE.goldLight}" />
      <path d="M 226,248 C 226,246 228,246 228,248 C 228,250 226,250 226,248 Z" fill="${FASHION_PALETTE.goldLight}" />

      <!-- Viền gấu áo Tấc vàng uốn lượn -->
      <path 
        d="${isScene2 ? 'M 136,600 C 175,612 235,612 270,600 C 268,604 235,616 136,604 Z' : 'M 134,600 C 170,612 230,612 268,600 C 266,604 230,616 134,604 Z'}" 
        fill="${FASHION_PALETTE.gold}" 
      />
    </g>
  `;

  // BÀN TAY HÌNH THOI THUÔN DÀI BO GÓC
  const hands = `
    <g id="unified-hands-aotac">
      <path 
        d="M 146,450 C 141,460 142,470 152,484 C 162,470 163,460 158,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 150,458 C 150,468 152,478 152,484 C 158,474 160,464 157,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />

      <path 
        d="M 242,450 C 237,460 238,470 248,484 C 258,470 259,460 254,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 246,458 C 246,468 248,478 248,484 C 254,474 256,464 253,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />
    </g>
  `;

  let toteSvg = '';
  if (sceneId === 'hoguom' && hasBag) {
    toteSvg = `
      <g id="unified-tote-group">
        <path 
          d="M 136,505 C 136,445 144,438 152,438 C 160,438 168,445 168,505" 
          stroke="#3D2E24" 
          stroke-width="4.5" 
          stroke-linecap="round" 
          fill="none" 
        />
        <path 
          d="M 120,505 C 120,500 184,500 184,505 C 184,545 182,595 180,630 C 180,634 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#F4EFE6" 
        />
        <path 
          d="M 120,505 C 120,500 136,500 136,505 C 136,545 134,595 132,630 C 128,632 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#E2DAC9" 
        />
        <path d="M 152,560 C 148,568 149,576 152,580 C 155,576 156,568 152,560 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    `;
  }

  let fanSvg = '';
  if (isScene2 && hasFan) {
    fanSvg = `
      <g id="unified-folding-fan">
        <path d="M 248,460 L 210,405 C 235,380 275,380 300,405 Z" fill="url(#unifiedFanGrad)" />
        <path d="M 248,460 C 236,435 224,410 220,400" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
        <path d="M 245,462 C 245,460 251,460 251,462 C 251,464 245,464 245,462 Z" fill="${FASHION_PALETTE.gold}" />
        <path d="M 248,464 C 246,478 246,492 248,500 C 249,492 249,478 248,464 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    `;
  }

  const head = renderUnifiedHead(cx, 200);
  const headpiece = renderUnifiedRoyalHeadpiece(cx, hasHeadwear);

  return `
    <g id="unified-outfit-ao-tac">
      ${floorShadow}
      ${pants}
      ${robeAndArms}
      ${hands}
      ${toteSvg}
      ${fanSvg}
      ${head}
      ${headpiece}
    </g>
  `;
}

/**
 * =========================================================================
 * 3. UNIFIED COMPONENT: ÁO NHẬT BÌNH (CỔ CHỮ Y NGŨ SẮC)
 * Nẹp chữ Y ngũ sắc uốn cong Bezier, cánh tay liền vai viền thủy ba cổ tay.
 * =========================================================================
 */
export function renderUnifiedNhatBinh(sceneId = 'hoguom', hasBag = true, hasFan = true, hasHeadwear = true) {
  const isScene2 = (sceneId === 'hoangthanh');
  const cx = isScene2 ? 203 : 200;

  const floorShadow = `
    <path 
      d="M ${cx - 58},770 C ${cx - 58},765 ${cx + 58},765 ${cx + 58},770 C ${cx + 58},775 ${cx - 58},775 ${cx - 58},770 Z" 
      fill="rgba(0,0,0,0.38)" 
      filter="url(#unifiedFloorShadow)" 
    />
  `;

  const pants = `
    <g id="unified-nhatbinh-pants">
      <path 
        d="${isScene2 
          ? 'M 172,520 C 165,600 156,680 152,764 C 168,768 192,768 200,764 C 196,680 195,600 195,520 Z' 
          : 'M 168,520 C 162,600 154,680 150,764 C 166,768 190,768 198,764 C 194,680 193,600 193,520 Z'}" 
        class="costume-pant-element" 
      />
      <path 
        d="${isScene2 
          ? 'M 198,520 C 198,600 200,680 202,764 C 218,768 244,768 250,764 C 242,680 234,600 230,520 Z' 
          : 'M 195,520 C 195,600 197,680 199,764 C 215,768 241,768 247,764 C 239,680 230,600 226,520 Z'}" 
        class="costume-pant-element" 
      />
    </g>
  `;

  const robeAndArms = `
    <g id="unified-nhatbinh-robe-and-arms">
      <!-- TAY ÁO TRÁI NỐI LIỀN VAI (240,210) XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 210,200 L 240,210 C 270,225 292,265 288,335 C 284,395 268,445 254,450 L 242,450 C 242,395 238,335 236,285 C 235,245 230,220 210,200 Z" 
        class="costume-robe-element" 
      />
      <!-- TAY ÁO PHẢI NỐI LIỀN VAI (160,210) XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 190,200 L 160,210 C 130,225 108,265 112,335 C 116,395 132,445 146,450 L 158,450 C 158,395 162,335 164,285 C 165,245 170,220 190,200 Z" 
        class="costume-robe-element" 
      />
      <!-- Viền thủy ba ngũ sắc cổ tay -->
      <path d="M 242,444 L 254,444 L 254,450 L 242,450 Z" fill="url(#unifiedNhatBinhStripe)" />
      <path d="M 146,444 L 158,444 L 158,450 L 146,450 Z" fill="url(#unifiedNhatBinhStripe)" />

      <!-- THÂN ÁO NHẬT BÌNH: ĐỈNH CỔ ÁO TẠI Y=200 CHIA SẺ (190,200) VÀ (210,200) -->
      <path 
        d="M 190,200 L 160,210 C 152,245 150,335 146,440 C 142,530 140,580 136,590 C 175,600 235,600 270,590 C 266,580 264,530 260,440 C 256,335 248,245 240,210 L 210,200 Z" 
        class="costume-robe-element" 
      />
      <path 
        d="M 200,200 L 200,596 C 225,596 250,594 270,590 C 266,580 264,530 260,440 C 256,335 248,245 240,210 L 210,200 Z" 
        fill="${FASHION_PALETTE.shadowRobe}" 
      />

      <!-- NẸP CỔ CHỮ Y NGŨ SẮC TO BẢN: ĐỈNH BẮT ĐẦU CHÍNH XÁC TẠI (190,200) VÀ (210,200) -->
      <path 
        d="M 190,200 C 193,212 195,225 195,235 L 195,594 L 205,594 L 205,235 C 205,225 207,212 210,200 Z" 
        fill="url(#unifiedNhatBinhStripe)" 
      />
      <!-- Dải ngọc bội -->
      <path d="M ${cx - 4.5},240 C ${cx - 4.5},235 ${cx + 4.5},235 ${cx + 4.5},240 C ${cx + 4.5},245 ${cx - 4.5},245 ${cx - 4.5},240 Z" fill="${FASHION_PALETTE.gold}" />
      <path d="M ${cx - 1.5},245 L ${cx + 1.5},245 L ${cx + 1.5},295 L ${cx - 1.5},295 Z" fill="${FASHION_PALETTE.ruby}" />
      <path d="M ${cx},295 L ${cx + 5},305 L ${cx},313 L ${cx - 5},305 Z" fill="#2E8B57" />
    </g>
  `;

  // BÀN TAY HÌNH THOI THUÔN DÀI BO GÓC
  const hands = `
    <g id="unified-hands-nhatbinh">
      <path 
        d="M 146,450 C 141,460 142,470 152,484 C 162,470 163,460 158,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 150,458 C 150,468 152,478 152,484 C 158,474 160,464 157,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />

      <path 
        d="M 242,450 C 237,460 238,470 248,484 C 258,470 259,460 254,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 246,458 C 246,468 248,478 248,484 C 254,474 256,464 253,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />
    </g>
  `;

  let toteSvg = '';
  if (sceneId === 'hoguom' && hasBag) {
    toteSvg = `
      <g id="unified-tote-group">
        <path 
          d="M 136,505 C 136,445 144,438 152,438 C 160,438 168,445 168,505" 
          stroke="#3D2E24" 
          stroke-width="4.5" 
          stroke-linecap="round" 
          fill="none" 
        />
        <path 
          d="M 120,505 C 120,500 184,500 184,505 C 184,545 182,595 180,630 C 180,634 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#F4EFE6" 
        />
        <path 
          d="M 120,505 C 120,500 136,500 136,505 C 136,545 134,595 132,630 C 128,632 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#E2DAC9" 
        />
        <path d="M 152,560 C 148,568 149,576 152,580 C 155,576 156,568 152,560 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    `;
  }

  let fanSvg = '';
  if (isScene2 && hasFan) {
    fanSvg = `
      <g id="unified-folding-fan">
        <path d="M 248,460 L 210,405 C 235,380 275,380 300,405 Z" fill="url(#unifiedFanGrad)" />
        <path d="M 248,460 C 236,435 224,410 220,400" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
        <path d="M 245,462 C 245,460 251,460 251,462 C 251,464 245,464 245,462 Z" fill="${FASHION_PALETTE.gold}" />
        <path d="M 248,464 C 246,478 246,492 248,500 C 249,492 249,478 248,464 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    `;
  }

  const head = renderUnifiedHead(cx, 200);
  const headpiece = renderUnifiedRoyalHeadpiece(cx, hasHeadwear);

  return `
    <g id="unified-outfit-nhat-binh">
      ${floorShadow}
      ${pants}
      ${robeAndArms}
      ${hands}
      ${toteSvg}
      ${fanSvg}
      ${head}
      ${headpiece}
    </g>
  `;
}

/**
 * =========================================================================
 * 4. UNIFIED COMPONENT: ÁO DÀI CÁCH TÂN GEN Z (MODERN PUFFED SLEEVE)
 * - Khối tay bồng nụ hoa tròn trịa bám sát khớp vai ôm chặt bắp tay.
 * - Cổ vuông thanh thoát, tà áo lửng loe nhẹ bằng Bezier.
 * - Cẳng tay da thon mịn màng nối vào bàn tay giọt nước.
 * =========================================================================
 */
export function renderUnifiedAoDaiCachTan(sceneId = 'hoguom', hasBag = true, hasFan = true, hasHeadwear = true) {
  const isScene2 = (sceneId === 'hoangthanh');
  const cx = isScene2 ? 203 : 200;

  const floorShadow = `
    <path 
      d="M ${cx - 58},770 C ${cx - 58},765 ${cx + 58},765 ${cx + 58},770 C ${cx + 58},775 ${cx - 58},775 ${cx - 58},770 Z" 
      fill="rgba(0,0,0,0.38)" 
      filter="url(#unifiedFloorShadow)" 
    />
  `;

  const pants = `
    <g id="unified-cachtan-pants">
      <path 
        d="${isScene2 
          ? 'M 172,430 C 160,540 148,650 140,758 C 158,764 186,764 198,758 C 195,650 193,540 192,430 Z' 
          : 'M 168,430 C 156,540 144,650 136,758 C 154,764 182,764 195,758 C 192,650 191,540 190,430 Z'}" 
        class="costume-pant-element" 
      />
      <path 
        d="${isScene2 
          ? 'M 198,430 C 199,540 200,650 202,758 C 220,764 250,764 265,758 C 255,650 245,540 235,430 Z' 
          : 'M 195,430 C 196,540 197,650 198,758 C 218,764 248,764 262,758 C 252,650 242,540 230,430 Z'}" 
        class="costume-pant-element" 
      />
    </g>
  `;

  // 1. THÂN ÁO & TAY ÁO BỒNG (CHUẨN TOÁN HỌC KHÔNG GÃY ĐỨT KHỚP NỐI)
  const robeAndArms = `
    <g id="unified-cachtan-robe-and-arms">
      <!-- THÂN ÁO DÀI CÁCH TÂN: ĐỈNH CỔ ÁO BẮT ĐẦU CHÍNH XÁC TẠI Y=200 CHIA SẺ (190,200) VÀ (210,200) -->
      <path 
        d="M 190,200 L 160,210 C 156,245 165,275 168,280 C 170,305 172,330 174,335 C 172,365 170,390 170,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
        class="costume-robe-element" 
      />
      <!-- Mảng bóng nửa thân áo -->
      <path 
        d="M 200,200 L 200,410 L 230,410 C 230,390 228,365 226,335 C 228,330 230,305 232,280 C 235,275 244,245 240,210 L 210,200 Z" 
        fill="${FASHION_PALETTE.shadowRobe}" 
      />

      <!-- VIỀN CỔ VUÔNG HIỆN ĐẠI (CHIA SẺ CHÍNH XÁC MỐC 190,200 VÀ 210,200) -->
      <path 
        d="M 190,200 L 192,218 L 208,218 L 210,200 L 207,200 L 206,215 L 194,215 L 193,200 Z" 
        fill="${FASHION_PALETTE.gold}" 
      />

      <!-- TÀ ÁO LỬNG TRẺ TRUNG NGANG BẮP CHÂN, LOE NHẸ BEZIER -->
      <path 
        d="${isScene2 
          ? 'M 170,410 C 166,455 162,495 158,540 C 188,550 222,550 250,540 C 246,495 242,455 230,410 Z' 
          : 'M 170,410 C 166,455 162,495 158,540 C 188,550 222,550 250,540 C 246,495 242,455 230,410 Z'}" 
        class="costume-robe-element" 
      />
      <path 
        d="${isScene2 ? 'M 158,540 C 188,550 222,550 250,540 C 248,544 222,554 158,544 Z' : 'M 158,540 C 188,550 222,550 250,540 C 248,544 222,554 158,544 Z'}" 
        fill="${FASHION_PALETTE.gold}" 
      />

      <!-- TAY ÁO BỒNG TRÁI: NỐI TỪ VAI (160,210) PHÌNH TO RA VÀ TÚM BÓ LẠI Ở BẮP TAY (Y=280) -->
      <path 
        d="M 160,210 C 136,202 122,230 126,252 C 128,268 136,278 142,280 L 162,280 C 166,270 166,245 160,210 Z" 
        class="costume-robe-element" 
      />
      <!-- Đai bo bắp tay vàng trái tại y=280 -->
      <path d="M 140,278 L 164,278 L 164,282 L 140,282 Z" fill="${FASHION_PALETTE.gold}" />

      <!-- TAY ÁO BỒNG PHẢI: NỐI TỪ VAI (240,210) PHÌNH TO RA VÀ TÚM BÓ LẠI Ở BẮP TAY (Y=280) -->
      <path 
        d="M 240,210 C 264,202 278,230 274,252 C 272,268 264,278 258,280 L 238,280 C 234,270 234,245 240,210 Z" 
        class="costume-robe-element" 
      />
      <!-- Đai bo bắp tay vàng phải tại y=280 -->
      <path d="M 236,278 L 260,278 L 260,282 L 236,282 Z" fill="${FASHION_PALETTE.gold}" />

      <!-- CÁNH TAY DƯỚI TRÁI: NỐI TIẾP TỤC TỪ ĐIỂM TÚM BẮP TAY (Y=280) THUÔN DÀI XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 142,280 C 142,335 144,395 146,450 L 158,450 C 160,395 162,335 162,280 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 152,280 C 154,335 156,395 158,450 L 158,450 C 160,395 162,335 162,280 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.3" 
      />

      <!-- CÁNH TAY DƯỚI PHẢI: NỐI TIẾP TỤC TỪ ĐIỂM TÚM BẮP TAY (Y=280) THUÔN DÀI XUỐNG CỔ TAY (Y=450) -->
      <path 
        d="M 238,280 C 238,335 240,395 242,450 L 254,450 C 256,395 258,335 258,280 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 238,280 C 238,335 240,395 242,450 L 244,450 C 242,395 240,335 240,280 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.3" 
      />
    </g>
  `;

  // 2. BÀN TAY HÌNH THOI THUÔN DÀI BO GÓC (TAPERED ROUNDED RHOMBUS) NỐI TỪ CỔ TAY (Y=450)
  const hands = `
    <g id="unified-hands-rhombus">
      <!-- BÀN TAY TRÁI: NỐI LIỀN TỪ CỔ TAY (146..158, Y=450) XUỐNG (Y=484) -->
      <path 
        d="M 146,450 C 141,460 142,470 152,484 C 162,470 163,460 158,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 150,458 C 150,468 152,478 152,484 C 158,474 160,464 157,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />

      <!-- BÀN TAY PHẢI: NỐI LIỀN TỪ CỔ TAY (242..254, Y=450) XUỐNG (Y=484) -->
      <path 
        d="M 242,450 C 237,460 238,470 248,484 C 258,470 259,460 254,450 Z" 
        fill="${FASHION_PALETTE.skin}" 
      />
      <path 
        d="M 246,458 C 246,468 248,478 248,484 C 254,474 256,464 253,452 Z" 
        fill="${FASHION_PALETTE.skinShadow}" 
        opacity="0.35" 
      />
    </g>
  `;

  // 3. TÚI XÁCH & QUAI TÚI: QUAI TÚI VẼ SAU BÀN TAY -> BÀN TAY LÙI RA SAU QUAI TÚI THEO CHUẨN Z-INDEX SVG!
  let toteSvg = '';
  if (sceneId === 'hoguom' && hasBag) {
    toteSvg = `
      <g id="unified-tote-bag-group">
        <!-- QUAI TÚI XÁCH CHỮ U LỘN NGƯỢC (VẼ ĐÈ LÊN BÀN TAY -> BÀN TAY NẰM PHÍA SAU QUAI TÚI) -->
        <path 
          d="M 136,505 C 136,445 144,438 152,438 C 160,438 168,445 168,505" 
          stroke="#3D2E24" 
          stroke-width="4.5" 
          stroke-linecap="round" 
          fill="none" 
        />
        <!-- THÂN TÚI TOTE CANVAS -->
        <path 
          d="M 120,505 C 120,500 184,500 184,505 C 184,545 182,595 180,630 C 180,634 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#F4EFE6" 
        />
        <path 
          d="M 120,505 C 120,500 136,500 136,505 C 136,545 134,595 132,630 C 128,632 124,634 124,630 C 122,595 120,545 120,505 Z" 
          fill="#E2DAC9" 
        />
        <path 
          d="M 152,560 C 148,568 149,576 152,580 C 155,576 156,568 152,560 Z" 
          fill="${FASHION_PALETTE.ruby}" 
        />
      </g>
    `;
  }

  let fanSvg = '';
  if (isScene2 && hasFan) {
    fanSvg = `
      <g id="unified-folding-fan">
        <path d="M 248,460 L 210,405 C 235,380 275,380 300,405 Z" fill="url(#unifiedFanGrad)" />
        <path d="M 248,460 C 236,435 224,410 220,400" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
        <path d="M 248,460 C 255,430 260,400 264,390" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
        <path d="M 248,460 C 264,435 278,410 284,400" stroke="${FASHION_PALETTE.goldDark}" stroke-width="1.2" fill="none" />
        <path d="M 245,462 C 245,460 251,460 251,462 C 251,464 245,464 245,462 Z" fill="${FASHION_PALETTE.gold}" />
        <path d="M 248,464 C 246,478 246,492 248,500 C 249,492 249,478 248,464 Z" fill="${FASHION_PALETTE.ruby}" />
      </g>
    `;
  }

  const head = renderUnifiedHead(cx, 200);
  const headpiece = renderUnifiedRoyalHeadpiece(cx, hasHeadwear);

  return `
    <g id="unified-outfit-cachtan">
      ${floorShadow}
      ${pants}
      ${robeAndArms}
      ${hands}
      ${toteSvg}
      ${fanSvg}
      ${head}
      ${headpiece}
    </g>
  `;
}

/**
 * HÀM RENDER TỔNG HỢP: TỰ ĐỘNG CHỌN COMPONENT HỢP NHẤT TƯƠNG ỨNG
 */
export function renderUnifiedOutfitSvg({
  sceneId = 'hoguom',
  costumeId = 'ao_tac',
  hasHeadpiece = true,
  hasBag = true,
  hasFan = true
}) {
  const defs = getUnifiedSvgDefs();
  let content = '';

  switch (costumeId) {
    case 'ao_dai_truyen_thong':
      content = renderUnifiedAoDaiTruyenThong(sceneId, hasBag, hasFan, hasHeadpiece);
      break;
    case 'nhat_binh':
      content = renderUnifiedNhatBinh(sceneId, hasBag, hasFan, hasHeadpiece);
      break;
    case 'ao_dai_cach_tan':
      content = renderUnifiedAoDaiCachTan(sceneId, hasBag, hasFan, hasHeadpiece);
      break;
    case 'ao_tac':
    default:
      content = renderUnifiedAoTac(sceneId, hasBag, hasFan, hasHeadpiece);
      break;
  }

  return `
    ${defs}
    <g id="unified-croquis-root">
      ${content}
    </g>
  `;
}
