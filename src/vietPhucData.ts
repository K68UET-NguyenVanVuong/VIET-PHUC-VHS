/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DỮ LIỆU CỔ PHỤC VIỆT NAM & BỘ QUY TẮC VĂN HÓA (VIETNAMESE HERITAGE COSTUMES DATA)
 * Nền tảng: Việt phục Remix - Dành cho Gen Z & Yêu thích Di sản
 */

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  borderHex?: string;
  meaning: string;
  isRoyalOnly?: boolean;
}

export interface BottomOption {
  id: string;
  name: string;
  hex: string;
  type: 'quan_dai_lua' | 'quan_dai_den' | 'quan_ngu_than' | 'quan_dui' | 'vay_ngan' | 'vay_xoe_dong_mau';
  desc: string;
}

export interface HeadwearOption {
  id: string;
  name: string;
  type: 'khan_vanh_day' | 'khan_van' | 'khan_dong' | 'non_la' | 'non_ba_tam' | 'kim_uoc_phat' | 'man_nhung_cach_tan' | 'khong_doi';
  desc: string;
}

export interface FootwearOption {
  id: string;
  name: string;
  type: 'guoc_moc' | 'hai_theu' | 'sneaker_retro' | 'giay_mary_jane' | 'dep_lao' | 'chan_dat';
  desc: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  category: 'quat' | 'trang_suc' | 'tui' | 'hien_dai';
  desc: string;
  tag: string;
}

export interface CostumeItem {
  id: string;
  name: string;
  subTitle: string;
  era: string; // Niên đại / Triều đại
  origin: string; // Nguồn gốc
  meaning: string; // Ý nghĩa văn hóa & triết lý
  silhouetteType: 'nhat_binh' | 'ao_tac' | 'ngu_than_chen' | 'ao_dai' | 'giao_linh';
  validColors: ColorOption[];
  validBottoms: BottomOption[];
  validHeadwears: HeadwearOption[];
  validFootwears: FootwearOption[];
  validAccessories: AccessoryOption[];
  prohibitedRules: string[]; // Danh sách mã quy tắc cấm kỵ áp dụng cho trang phục này
  recommendedLocations: string[]; // Bối cảnh chụp ảnh đề xuất
  culturalTip: string; // Lời khuyên giữ gìn bản sắc
}

export interface CulturalRule {
  id: string;
  title: string;
  severity: 'danger' | 'warning' | 'tip';
  check: (state: OutfitState) => boolean;
  message: string;
  historicalContext: string;
  solution: string;
}

export interface OutfitState {
  costumeId: string;
  colorId: string;
  bottomId: string;
  headwearId: string;
  footwearId: string;
  accessoryIds: string[];
  locationId: string;
  eventId: string;
  isCasualStyling: boolean;
}

export interface LocationItem {
  id: string;
  name: string;
  city: string;
  description: string;
  vibe: string;
  suggestedWeather: string;
  photoSpots: string[];
  idealCostumes: string[];
  backdropUrl: string;
  ambientColor: string;
  lightingType: 'morning' | 'golden_hour' | 'night' | 'misty';
  particleType: 'lotus' | 'leaves' | 'lanterns' | 'petals' | 'sparkles';
}

export interface EventItem {
  id: string;
  name: string;
  iconName: string;
  recommendedTag: string;
}

// -------------------------------------------------------------
// 1. TẬP DỮ LIỆU CÁC LOẠI CỔ PHỤC TRỌNG TÂM
// -------------------------------------------------------------
export const VIET_PHUC_CATALOG: CostumeItem[] = [
  {
    id: 'nhat_binh',
    name: 'Áo Nhật Bình',
    subTitle: 'Thường phục Hoàng Hậu, Công chúa & Mệnh phụ Triều Nguyễn',
    era: 'Triều Nguyễn (1802 - 1945)',
    origin: 'Có nguồn gốc từ áo Phi Phong thời nhà Minh, sang thời Nguyễn được định chế thành y quan tôn quý của bậc Hoàng tộc và Mệnh phụ quý tộc.',
    meaning: 'Cổ áo hình chữ nhật viền bản lớn thêu hoa văn ngũ phúc, phụng loan và bát bửu. Tay áo trang trí dải ngũ sắc (xanh, vàng, trắng, đỏ, lục) biểu trưng cho ngũ hành tương sinh, càn khôn hội tụ.',
    silhouetteType: 'nhat_binh',
    validColors: [
      { id: 'nb_hoang_kim', name: 'Hoàng Kim (Vàng hoàng hậu)', hex: '#D4AF37', meaning: 'Chính sắc của bậc Mẫu nghi thiên hạ (Hoàng Hậu/Hoàng Thái Hậu)' },
      { id: 'nb_xich_dao', name: 'Xích Đào (Đỏ thắm)', hex: '#C93B3B', meaning: 'Sắc phục cao quý của Công Chúa triều Nguyễn' },
      { id: 'nb_hoa_ca', name: 'Tím Hoa Cà (Huế cổ)', hex: '#7D4F7C', meaning: 'Sắc tím cung đình thanh nhã của Cung tần Nhị phẩm' },
      { id: 'nb_thien_thanh', name: 'Thiên Thanh (Xanh lam ngọc)', hex: '#2F6690', meaning: 'Sắc xanh trong trẻo của Cung phi Tam phẩm' },
      { id: 'nb_bach_ngoc', name: 'Bạch Ngọc (Trắng ngà gấm)', hex: '#F4EBD9', meaning: 'Gam màu hiện đại tinh khôi, thường được Gen Z chụp ảnh ngoại cảnh' },
      { id: 'nb_luc_ngoc', name: 'Lục Bảo (Xanh lá vương giả)', hex: '#2D6A4F', meaning: 'Màu của sinh sôi nảy nở, thuộc tính Mộc nhã nhặn' },
    ],
    validBottoms: [
      { id: 'bot_bach_lap', name: 'Quần lụa trắng (Bạch lạp)', hex: '#FAF7F0', type: 'quan_dai_lua', desc: 'Quy chuẩn lễ phục triều Nguyễn, suông rộng tha thướt' },
      { id: 'bot_den_tuyen', name: 'Quần lụa đen tuyền', hex: '#1C1917', type: 'quan_dai_den', desc: 'Trang nhã, tôn lên sắc rực rỡ của tà áo' },
      { id: 'bot_short_modern', name: 'Quần short / Váy ngắn (Gen Z remix)', hex: '#3B82F6', type: 'quan_dui', desc: 'Phối ngẫu hứng hiện đại (Lưu ý quy tắc cấm kỵ)' },
    ],
    validHeadwears: [
      { id: 'head_khan_vanh', name: 'Khăn Vành Dây (Ngũ sắc hoàng tộc)', type: 'khan_vanh_day', desc: 'Khăn vải quấn nhiều vòng phủ kín tóc, chuẩn mực cao nhất của Nhật Bình' },
      { id: 'head_kim_uoc', name: 'Kim Ước Phát & Trâm ngọc', type: 'kim_uoc_phat', desc: 'Trang sức búi tóc dát vàng/ngọc tinh xảo của quý phi' },
      { id: 'head_man_nhung', name: 'Mấn nhung đính ngọc trai (Cách tân)', type: 'man_nhung_cach_tan', desc: 'Biến tấu gọn nhẹ cho giới trẻ chụp ảnh kỷ yếu' },
      { id: 'head_non_la', name: 'Nón lá truyền thống', type: 'non_la', desc: 'Nón chóp bài thơ lá gồi nón Huế' },
      { id: 'head_khong', name: 'Để tóc tự nhiên cài hoa', type: 'khong_doi', desc: 'Xõa tóc nhẹ nhàng kiểu thiếu nữ đương đại' },
    ],
    validFootwears: [
      { id: 'foot_hai_theu', name: 'Hài thêu chim Phụng / Hoa sen', type: 'hai_theu', desc: 'Mũi cong cổ điển, mũi hài thêu chỉ kim tuyến' },
      { id: 'foot_guoc_moc', name: 'Guốc mộc truyền thống quai nhung', type: 'guoc_moc', desc: 'Âm thanh lốc cốc mộc mạc đậm hồn dân tộc' },
      { id: 'foot_sneaker_white', name: 'Sneaker trắng tối giản (Remix)', type: 'sneaker_retro', desc: 'Phối phá cách trẻ trung, năng động khi di chuyển' },
      { id: 'foot_dep_lao', name: 'Dép lê xỏ ngón / Dép cao su', type: 'dep_lao', desc: 'Dép thường nhật mang tính tạm bợ' },
    ],
    validAccessories: [
      { id: 'acc_quat_long', name: 'Quạt lông chim phụng hoàng thất', category: 'quat', desc: 'Phụ kiện cầm tay vương giả', tag: 'Cung đình' },
      { id: 'acc_quat_tram', name: 'Quạt nan gỗ trầm hương chạm lộng', category: 'quat', desc: 'Hương thơm thoang thoảng quý phái', tag: 'Truyền thống' },
      { id: 'acc_chuoi_ngoc', name: 'Chuỗi chuỗi ngọc trai đeo cổ', category: 'trang_suc', desc: 'Tôn lên viền cổ vuông chữ nhật sắc sảo', tag: 'Quý phái' },
      { id: 'acc_the_bai', name: 'Thẻ bài / Kim khánh khảm xà cừ', category: 'trang_suc', desc: 'Biểu trưng phẩm trật cung quy triều Nguyễn', tag: 'Điển lễ' },
      { id: 'acc_tui_gam', name: 'Túi gấm thêu tay hoa sen', category: 'tui', desc: 'Túi đựng đồ nhỏ xinh chụp ảnh sống ảo', tag: 'Vintage' },
      { id: 'acc_kinh_ram', name: 'Kính râm gọng phi công retro (Remix)', category: 'hien_dai', desc: 'Tạo nét thần thái Gen Z cool ngầu khi chụp ngoại cảnh', tag: 'Gen Z Remix' },
      { id: 'acc_may_film', name: 'Máy ảnh film Vintage', category: 'hien_dai', desc: 'Phụ kiện check-in đậm chất lãng tử Hà Nội/Huế', tag: 'Gen Z Remix' },
    ],
    prohibitedRules: ['RULE_NO_SHORTS_MINISKIRT', 'RULE_NO_NON_LA_NHAT_BINH', 'RULE_NO_FLIP_FLOPS', 'RULE_SANCTUARY_RESPECT'],
    recommendedLocations: ['loc_hue', 'loc_hoang_thanh', 'loc_van_mieu'],
    culturalTip: 'Khi mặc Nhật Bình, điểm nhấn đắt giá nhất là hoa văn cổ áo và dải ngũ hành ở tay áo. Hãy đứng thẳng lưng, giữ tay khép nhẹ trước ngực để tôn lên trọn vẹn dải ngũ sắc ngũ hành.',
  },
  {
    id: 'ao_tac',
    name: 'Áo Tấc (Ngũ Thân Tay Thụng)',
    subTitle: 'Đại lễ phục trang trọng bậc nhất của người Việt triều Nguyễn',
    era: 'Thời chúa Nguyễn Vũ Vương (1744) - Triều Nguyễn',
    origin: 'Là dạng thức áo ngũ thân có tay thụng dài rộng (1 tấc = 4cm, vạt tay rộng khoảng hơn 30cm-40cm). Dành cho cả nam lẫn nữ trong các dịp đại lễ: Tế tự, cưới hỏi, cúng bái tổ tiên, Tết Nguyên Đán.',
    meaning: 'Kết cấu 5 thân áo: 4 thân ngoài tượng trưng cho "Tứ thân phụ mẫu" (cha mẹ ruột và cha mẹ vợ/chồng), thân thứ 5 bên trong tượng trưng cho chính bản thân người mặc được gia đình chở che. Cổ đứng 5 cúc tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    silhouetteType: 'ao_tac',
    validColors: [
      { id: 'tac_xanh_tram', name: 'Lam Tràm (Xanh đậm quý phái)', hex: '#1D3557', meaning: 'Sắc lam cổ điển sâu lắng, được giới Nho sĩ và sĩ tử ưa chuộng' },
      { id: 'tac_do_dieu', name: 'Đỏ Điều (Đỏ son lễ hội)', hex: '#BA181B', meaning: 'Màu của may mắn, hỷ sự, lễ tết và đại cát đại lợi' },
      { id: 'tac_vang_mo', name: 'Vàng Hoàng Cúc (Vàng mơ)', hex: '#E0A96D', meaning: 'Màu vàng dịu dàng của hoa cúc mùa thu Hà Nội' },
      { id: 'tac_den_muc', name: 'Hắc Sa (Đen mực truyền thống)', hex: '#1A1A1A', meaning: 'Trầm mặc, uy nghiêm, thể hiện khí chất cương trực của nam nhân' },
      { id: 'tac_xanh_reu', name: 'Lục Trúc (Xanh rêu cổ kính)', hex: '#386641', meaning: 'Hài hòa cùng không gian rêu phong Văn Miếu, Hoàng Thành' },
      { id: 'tac_hong_sen', name: 'Hồng Sen Nhạt (Nữ tính thanh thoát)', hex: '#DDA15E', meaning: 'Màu sắc ngọt ngào được các bạn nữ Gen Z cực kỳ yêu thích mùa kỷ yếu' },
    ],
    validBottoms: [
      { id: 'bot_tac_trang', name: 'Quần lụa trắng tuyết sa', hex: '#FDFBF7', type: 'quan_dai_lua', desc: 'Quy chuẩn bắt buộc của áo Tấc, tạo nét đối lập tôn dáng' },
      { id: 'bot_tac_den', name: 'Quần lụa đen bóng', hex: '#1C1917', type: 'quan_dai_den', desc: 'Lịch lãm, thường phối cùng áo Tấc màu tối của nam' },
      { id: 'bot_short_modern', name: 'Quần ngố / Quần short', hex: '#3B82F6', type: 'quan_dui', desc: 'Cách phối sai lệch văn hóa nghiêm trọng' },
    ],
    validHeadwears: [
      { id: 'head_khan_dong', name: 'Khăn đóng nam (7 nếp / 9 nếp)', type: 'khan_dong', desc: 'Đội ngay ngắn trước trán hình chữ Nhất (一) đoan chính' },
      { id: 'head_khan_van_nu', name: 'Khăn vấn nhung đen / xanh (Nữ)', type: 'khan_van', desc: 'Khăn vấn ôm gọn tóc, tạo nét đài các của thiếu nữ kinh kỳ' },
      { id: 'head_non_la_hue', name: 'Nón lá chóp bài thơ', type: 'non_la', desc: 'Phù hợp khi chụp ảnh dạo phố ngoại cảnh' },
      { id: 'head_khong', name: 'Tóc búi gọn / Tóc undercut hiện đại', type: 'khong_doi', desc: 'Nét tự nhiên phóng khoáng của bạn trẻ ngày nay' },
    ],
    validFootwears: [
      { id: 'foot_guoc_moc_nam', name: 'Guốc mộc quai da bò / quai nhung', type: 'guoc_moc', desc: 'Chuẩn phong vị xưa, vững chãi và mộc mạc' },
      { id: 'foot_hai_vai', name: 'Hài vải thêu sen / Hài đen', type: 'hai_theu', desc: 'Bước đi thanh thoát êm ái trên thềm đá cổ' },
      { id: 'foot_sneaker_white', name: 'Sneaker trắng Vintage', type: 'sneaker_retro', desc: 'Chấm phá Gen Z sành điệu, tiện di chuyển cả ngày' },
      { id: 'foot_dep_lao', name: 'Dép lê xỏ ngón', type: 'dep_lao', desc: 'Mất vẻ trang nghiêm của lễ phục' },
    ],
    validAccessories: [
      { id: 'acc_quat_tram', name: 'Quạt nan trầm hương / quạt giấy Điệp', category: 'quat', desc: 'Dụng cụ xua tan oi bức, che duyên khi chụp ảnh', tag: 'Cổ điển' },
      { id: 'acc_sach_nho', name: 'Quyển sách cổ / Ống bút thi cử', category: 'trang_suc', desc: 'Đạo cụ cực hợp concept sĩ tử tại Văn Miếu', tag: 'Sĩ tử' },
      { id: 'acc_tui_gam', name: 'Túi gấm đeo thắt lưng', category: 'tui', desc: 'Hoa văn mây ngũ sắc thêu tay', tag: 'Vintage' },
      { id: 'acc_chuoi_ngoc_tay', name: 'Chuỗi hạt bồ đề / Hạt gỗ đeo cổ tay', category: 'trang_suc', desc: 'Tĩnh tâm an nhiên, đậm nét phương Đông', tag: 'Tâm linh' },
      { id: 'acc_may_film', name: 'Máy ảnh Film cơ', category: 'hien_dai', desc: 'Tạo nên concept "Chàng sĩ tử du hành thời gian"', tag: 'Gen Z Remix' },
      { id: 'acc_kinh_ram', name: 'Kính râm gọng tròn Thầy bói', category: 'hien_dai', desc: 'Nét dí dỏm, thời thượng nhưng vẫn phảng phất chất hoài cổ', tag: 'Gen Z Remix' },
    ],
    prohibitedRules: ['RULE_NO_SHORTS_MINISKIRT', 'RULE_NO_FLIP_FLOPS', 'RULE_UNBUTTONED_COLLAR', 'RULE_ROLLED_SLEEVES'],
    recommendedLocations: ['loc_van_mieu', 'loc_hoang_thanh', 'loc_hoan_kiem', 'loc_hue'],
    culturalTip: 'Tay áo Áo Tấc dài qua đầu ngón tay là dụng ý khiêm tốn của tiền nhân: khi đứng chắp tay vái chào, hai tà tay áo buông thõng phủ kín bàn tay thể hiện sự cung kính tột bậc. Tránh xắn tay áo lên cao!',
  },
  {
    id: 'ngu_than_chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    subTitle: 'Tiền thân của Áo Dài hiện đại - Năng động & Thanh thoát',
    era: 'Định hình từ năm 1744 đến thời vua Minh Mạng (1837)',
    origin: 'Cùng chung phom dáng 5 thân với Áo Tấc, nhưng phần ống tay được may thu nhỏ ôm sát cổ tay để người mặc thuận tiện trong sinh hoạt thường nhật, đi lại và làm việc.',
    meaning: 'Biểu trưng cho nếp sống phong nhã, kỷ luật của người Việt. Phom áo đứng dáng che khuyết điểm cơ thể rất tốt, tạo phong thái đĩnh đạc tự tin cho cả nam lẫn nữ.',
    silhouetteType: 'ngu_than_chen',
    validColors: [
      { id: 'chen_xanh_com', name: 'Xanh Cốm Mới (Hà Nội)', hex: '#588157', meaning: 'Hương cốm đầu thu se lạnh của phố cổ Hà Nội' },
      { id: 'chen_vang_nghe', name: 'Vàng Nghệ Hội An', hex: '#E9C46A', meaning: 'Nắng vàng trên những bức tường rêu phong phố Hoài' },
      { id: 'chen_do_ba_trau', name: 'Đỏ Bã Trầu', hex: '#800E13', meaning: 'Màu đỏ nồng nàn truyền thống, tôn da cực kỳ tốt' },
      { id: 'chen_be_sua', name: 'Be Sữa / Nâu Tây', hex: '#D4A373', meaning: 'Tone màu ấm cúng chuẩn aesthetic Gen Z Hàn/Nhật remix' },
      { id: 'chen_xanh_navy', name: 'Xanh Navy Sâu Thẳm', hex: '#1E3A5F', meaning: 'Hiện đại, thanh lịch, dễ phối đồ phụ kiện' },
    ],
    validBottoms: [
      { id: 'bot_quan_trang', name: 'Quần lụa trắng suông rộng', hex: '#FAF7F0', type: 'quan_dai_lua', desc: 'Thanh lịch chuẩn chỉnh theo lối xưa' },
      { id: 'bot_quan_den', name: 'Quần lụa hoặc quần âu đen ống đứng', hex: '#262626', type: 'quan_dai_den', desc: 'Phối phá cách dạng Smart-Casual đương đại' },
      { id: 'bot_short_modern', name: 'Quần short jeans rách', hex: '#3B82F6', type: 'quan_dui', desc: 'Không tôn trọng phom áo truyền thống' },
    ],
    validHeadwears: [
      { id: 'head_khan_dong_chen', name: 'Khăn đóng bọc vải đũi', type: 'khan_dong', desc: 'Phong cách nho sinh tân thời' },
      { id: 'head_non_la', name: 'Nón lá chóp bài thơ', type: 'non_la', desc: 'Rất duyên dáng khi chụp ảnh dạo phố Hội An hay Hồ Gươm' },
      { id: 'head_khong', name: 'Tóc vuốt pomade / uốn sóng lơi', type: 'khong_doi', desc: 'Thời trang thanh xuân trẻ trung' },
    ],
    validFootwears: [
      { id: 'foot_sneaker_white', name: 'Sneaker trắng da cổ thấp (Retro)', type: 'sneaker_retro', desc: 'Sự kết hợp hoàn hảo giữa nét cổ phong và đường phố hiện đại' },
      { id: 'foot_guoc_moc', name: 'Guốc mộc mài mộc', type: 'guoc_moc', desc: 'Vẻ đẹp chân phương mộc mạc' },
      { id: 'foot_mary_jane', name: 'Giày Mary Jane / Oxford cổ điển', type: 'giay_mary_jane', desc: 'Hơi thở Vintage thanh lịch những năm 70' },
      { id: 'foot_dep_lao', name: 'Dép kẹp bãi biển', type: 'dep_lao', desc: 'Lạc điệu với tinh thần cổ phục' },
    ],
    validAccessories: [
      { id: 'acc_tui_da_vintage', name: 'Túi da đeo chéo vintage', category: 'tui', desc: 'Phối phong cách ký giả trẻ du hành', tag: 'Gen Z Remix' },
      { id: 'acc_quat_nan_tre', name: 'Quạt nan tre xếp giấy gió', category: 'quat', desc: 'Dụng cụ tạo dáng tự nhiên không bị đơ tay', tag: 'Truyền thống' },
      { id: 'acc_kinh_ram', name: 'Kính mắt mèo / Kính tròn gọng kim loại', category: 'hien_dai', desc: 'Tôn cá tính độc đáo của người mặc', tag: 'Gen Z Remix' },
      { id: 'acc_hoa_sen', name: 'Bó hoa sen trắng / Cành đào Tết', category: 'trang_suc', desc: 'Đạo cụ "quốc dân" mùa chụp ảnh lễ hội', tag: 'Lễ Tết' },
    ],
    prohibitedRules: ['RULE_NO_SHORTS_MINISKIRT', 'RULE_NO_FLIP_FLOPS', 'RULE_UNBUTTONED_COLLAR'],
    recommendedLocations: ['loc_hoi_an', 'loc_hoan_kiem', 'loc_dinh_doc_lap'],
    culturalTip: 'Áo Ngũ Thân tay chẽn là mẫu áo lý tưởng nhất để các bạn trẻ ứng dụng vào đời sống hàng ngày (đi cafe, dạo phố Tết, dự lễ tốt nghiệp) vì tính năng động và độ vừa vặn của tay áo.',
  },
  {
    id: 'ao_dai_lemur',
    name: 'Áo Dài Lemur & Tân Thời',
    subTitle: 'Cuộc cách mạng thời trang phụ nữ Việt Nam thế kỷ 20',
    era: 'Thập niên 1930 - 1960 (Thời kỳ Phong Hóa, Ngày Nay & Cô Ba Sài Gòn)',
    origin: 'Họa sĩ Cát Tường (Lemur) cùng nhóm Tự Lực Văn Đoàn đã cách tân chiếc áo ngũ thân truyền thống, bỏ đi thân thứ năm, làm eo thon gọn, cổ lá sen hoặc cổ khoét tròn, mở ra thời kỳ rực rỡ của Áo Dài hiện đại.',
    meaning: 'Biểu tượng của sự giải phóng hình thể phụ nữ Việt, tôn vinh nét cong quyến rũ tự nhiên nhưng vẫn giữ được sự đoan trang, kín đáo và duyên dáng.',
    silhouetteType: 'ao_dai',
    validColors: [
      { id: 'lemur_hong_phan', name: 'Hồng Phấn Tiểu Thư', hex: '#FFAFCC', meaning: 'Nét kiêu sa, e ấp của thiếu nữ Hà Thành xưa' },
      { id: 'lemur_xanh_ngoc', name: 'Xanh Ngọc Bích', hex: '#2A9D8F', meaning: 'Thanh tao, tươi mát ngập tràn sắc xuân' },
      { id: 'lemur_trang_sua', name: 'Trắng Sữa Tơ Tằm', hex: '#FAF9F6', meaning: 'Vẻ đẹp trong trẻo tinh khôi của tà áo nữ sinh' },
      { id: 'lemur_vang_hoang_yen', name: 'Vàng Hoàng Yến', hex: '#F4A261', meaning: 'Ấm áp, rực rỡ dưới nắng xuân' },
    ],
    validBottoms: [
      { id: 'bot_quan_lua_rong', name: 'Quần lụa ống xòe trắng/đen', hex: '#FAF7F0', type: 'quan_dai_lua', desc: 'Bước đi lượn sóng tha thướt theo tà áo dài' },
      { id: 'bot_vay_ngan', name: 'Chân váy ngắn đụp', hex: '#1E293B', type: 'vay_ngan', desc: 'Phá vỡ tỷ lệ thanh thoát của tà áo dài' },
    ],
    validHeadwears: [
      { id: 'head_non_la_bai_tho', name: 'Nón lá bài thơ thêu cành trúc', type: 'non_la', desc: 'Cặp đôi hoàn hảo cùng áo dài Việt Nam' },
      { id: 'head_bang_do_nhung', name: 'Băng đô nhung tết tóc', type: 'man_nhung_cach_tan', desc: 'Phong cách retro Sài Gòn thập niên 60' },
      { id: 'head_khong', name: 'Tóc uốn sóng lọn to / Tóc thề ngang vai', type: 'khong_doi', desc: 'Quyến rũ, đậm chất điện ảnh' },
    ],
    validFootwears: [
      { id: 'foot_guoc_cao_got', name: 'Guốc mộc cao gót sơn son', type: 'guoc_moc', desc: 'Tôn chiều cao và bước đi uyển chuyển' },
      { id: 'foot_mary_jane', name: 'Giày Mary Jane da bóng', type: 'giay_mary_jane', desc: 'Tiểu thư tân thời quý phái' },
      { id: 'foot_sneaker_white', name: 'Sneaker trắng canvas', type: 'sneaker_retro', desc: 'Phong cách nữ sinh Gen Z năng động' },
      { id: 'foot_dep_lao', name: 'Dép lê nhựa xỏ ngón', type: 'dep_lao', desc: 'Mất hẳn thần thái thanh lịch của tà áo dài' },
    ],
    validAccessories: [
      { id: 'acc_kieng_bac', name: 'Kiềng bạc tròn chạm khắc hoa văn', category: 'trang_suc', desc: 'Trang sức cổ điển không bao giờ lỗi mốt', tag: 'Cổ điển' },
      { id: 'acc_chuoi_ngoc_trai', name: 'Vòng ngọc trai nhiều tầng (Audrey Hepburn vibe)', category: 'trang_suc', desc: 'Sự giao thoa Đông - Tây hoàn hảo', tag: 'Tân thời' },
      { id: 'acc_canh_dao', name: 'Cành hoa đào Nhật Tân / Hoa Lay-ơn', category: 'trang_suc', desc: 'Mang cả không khí Tết miền Bắc vào khung hình', tag: 'Lễ Tết' },
      { id: 'acc_tui_coi', name: 'Túi cói đan tay đính ngọc', category: 'tui', desc: 'Nhẹ nhàng và thân thiện môi trường', tag: 'Gen Z' },
    ],
    prohibitedRules: ['RULE_NO_SHORTS_MINISKIRT', 'RULE_NO_FLIP_FLOPS'],
    recommendedLocations: ['loc_hoan_kiem', 'loc_dinh_doc_lap', 'loc_hoi_an'],
    culturalTip: 'Áo dài đẹp nhất ở sự thướt tha của hai tà áo khi chuyển động. Hãy để tà áo bay nhẹ tự nhiên trong gió và giữ lưng thẳng thon thả.',
  }
];

// -------------------------------------------------------------
// 2. DANH SÁCH BỐI CẢNH & ĐỊA ĐIỂM CHỤP ẢNH TẠI VIỆT NAM
// -------------------------------------------------------------
export const CHECK_IN_LOCATIONS: LocationItem[] = [
  {
    id: 'loc_van_mieu',
    name: 'Văn Miếu - Quốc Tử Giám',
    city: 'Hà Nội',
    description: 'Trường đại học đầu tiên của Việt Nam, chốn tôn nghiêm lưu giữ truyền thống hiếu học nghìn năm với Khuê Văn Các cổ kính và hồ Thiên Quang Tỉnh.',
    vibe: 'Trang nghiêm, Nho nhã, Đậm chất sĩ tử hiếu học',
    suggestedWeather: 'Mát mẻ 20°C - 23°C hoặc Se lạnh đầu xuân 16°C',
    photoSpots: ['Khuê Văn Các', 'Giếng Thiên Quang', 'Vườn bia Tiến Sĩ', 'Sân Đại Thành'],
    idealCostumes: ['ao_tac', 'ngu_than_chen', 'nhat_binh'],
    backdropUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#3a2012]/80 via-[#1e130c]/70 to-[#0e0a08]/90',
    lightingType: 'morning',
    particleType: 'leaves',
  },
  {
    id: 'loc_hoang_thanh',
    name: 'Hoàng Thành Thăng Long',
    city: 'Hà Nội',
    description: 'Quần thể di tích lịch sử cung điện nguy nga qua các triều đại Lý, Trần, Lê, Mạc, Nguyễn với Cổng Đoan Môn đồ sộ và thềm rồng Điện Kính Thiên.',
    vibe: 'Cổ kính, Hùng vĩ, Trầm mặc, Vương triều',
    suggestedWeather: 'Nắng thu dịu nhẹ 24°C, trời quang mây tạnh',
    photoSpots: ['Cổng Đoan Môn', 'Kỳ Đài (Cột cờ Hà Nội)', 'Hậu Lâu', 'Thềm rồng Điện Kính Thiên'],
    idealCostumes: ['nhat_binh', 'ao_tac'],
    backdropUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#2e1d14]/80 via-[#1c120c]/70 to-[#0c0806]/90',
    lightingType: 'golden_hour',
    particleType: 'petals',
  },
  {
    id: 'loc_hoan_kiem',
    name: 'Hồ Hoàn Kiếm & Phố Cổ',
    city: 'Hà Nội',
    description: 'Trái tim của Thủ đô với tháp Rùa rêu phong, cầu Thê Húc đỏ son lượn sóng và rặng liễu rủ thơ mộng nghiêng mình soi bóng nước hồ xanh ngọc.',
    vibe: 'Lãng mạn, Thơ mộng, Hoài niệm, Nhịp sống giao thoa',
    suggestedWeather: 'Se lạnh mùa thu lá vàng rơi hoặc gió xuân phơi phới 18°C',
    photoSpots: ['Cầu Thê Húc đỏ son', 'Đền Ngọc Sơn', 'Phố Hàng Mã mùa lễ hội', 'Ô Quan Chưởng'],
    idealCostumes: ['ao_dai_lemur', 'ngu_than_chen', 'ao_tac'],
    backdropUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#1a2e26]/80 via-[#101e18]/70 to-[#080f0c]/90',
    lightingType: 'misty',
    particleType: 'leaves',
  },
  {
    id: 'loc_hue',
    name: 'Đại Nội & Cố Đô Huế',
    city: 'Thừa Thiên Huế',
    description: 'Kinh đô triều Nguyễn với Ngọ Môn lầu Ngũ Phụng, cung Diên Thọ và điện Thái Hòa tráng lệ bên dòng sông Hương mộng mơ xứ thần kinh.',
    vibe: 'Đài các, Quý tộc, Mộng mơ, Cung đình hoàng gia',
    suggestedWeather: 'Mưa phùn bay bay lãng đãng hoặc nắng vàng rọi tường hoàng thành',
    photoSpots: ['Cổng Ngọ Môn lầu Ngũ Phụng', 'Cung Diên Thọ', 'Điện Thái Hòa', 'Lăng Khải Định'],
    idealCostumes: ['nhat_binh', 'ao_tac'],
    backdropUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#381a28]/80 via-[#221019]/70 to-[#0e070a]/90',
    lightingType: 'golden_hour',
    particleType: 'lotus',
  },
  {
    id: 'loc_hoi_an',
    name: 'Phố Cổ Hội An',
    city: 'Quảng Nam',
    description: 'Thương cảng cổ thế kỷ 17 với những mảng tường vàng nghệ rêu phong, giàn hoa giấy rực hồng và phố đèn lồng lung linh soi bóng sông Hoài.',
    vibe: 'Ấm áp, Rực rỡ, Đậm phong vị hoài cổ phương Đông',
    suggestedWeather: 'Nắng ấm 27°C - 30°C, lung linh ánh đèn hoa đăng buổi chiều tối',
    photoSpots: ['Chùa Cầu ngói âm dương', 'Bức tường vàng hoa giấy Hoàng Văn Thụ', 'Bến thuyền sông Hoài'],
    idealCostumes: ['ngu_than_chen', 'ao_dai_lemur'],
    backdropUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#3b2b11]/80 via-[#241a0b]/70 to-[#100b05]/90',
    lightingType: 'night',
    particleType: 'lanterns',
  },
  {
    id: 'loc_dinh_doc_lap',
    name: 'Dinh Độc Lập & Sài Gòn Retro',
    city: 'TP. Hồ Chí Minh',
    description: 'Kiến trúc hiện đại kết hợp triết lý phương Đông, thảm cỏ xanh mướt ngập tràn nắng vàng phương Nam và phong cách tân thời Sài Gòn thập niên 60.',
    vibe: 'Năng động, Tân thời, Retro thập niên 60, Phóng khoáng',
    suggestedWeather: 'Nắng vàng phương Nam 31°C, trời xanh ngắt',
    photoSpots: ['Bãi cỏ Dinh Độc Lập', 'Bưu điện Trung tâm Thành phố', 'Bảo tàng Mỹ thuật TP.HCM'],
    idealCostumes: ['ao_dai_lemur', 'ngu_than_chen'],
    backdropUrl: 'https://images.unsplash.com/photo-1583417657209-d3dd44535c5c?q=80&w=1600&auto=format&fit=crop',
    ambientColor: 'from-[#142838]/80 via-[#0d1a24]/70 to-[#060c12]/90',
    lightingType: 'morning',
    particleType: 'sparkles',
  },
];

// -------------------------------------------------------------
// 3. SỰ KIỆN & MỤC ĐÍCH SỬ DỤNG
// -------------------------------------------------------------
export const CULTURAL_EVENTS: EventItem[] = [
  { id: 'ev_tet', name: 'Du Xuân & Chụp Ảnh Tết', iconName: 'Sparkles', recommendedTag: 'Đại cát, Rực rỡ' },
  { id: 'ev_tot_nghiep', name: 'Lễ Tốt Nghiệp / Kỷ Yếu', iconName: 'GraduationCap', recommendedTag: 'Nho nhã, Trang nghiêm' },
  { id: 'ev_cuoi_hoi', name: 'Đám Cưới / Lễ Hỏi Truyền Thống', iconName: 'HeartHandshake', recommendedTag: 'Quý phái, Hỷ sự' },
  { id: 'ev_dao_pho', name: 'Dạo Phố & Check-in Gen Z', iconName: 'Camera', recommendedTag: 'Năng động, Phong cách' },
  { id: 'ev_den_chua', name: 'Đi Lễ Đền Chùa / Danh Thắng Tôn Nghiêm', iconName: 'Landmark', recommendedTag: 'Khiêm nhường, Kín đáo' },
];

// -------------------------------------------------------------
// 4. BỘ QUY TẮC VĂN HÓA & CẢNH BÁO SAI LỆCH (CULTURAL RULES)
// -------------------------------------------------------------
export const CULTURAL_RULES: CulturalRule[] = [
  {
    id: 'RULE_NO_SHORTS_MINISKIRT',
    title: 'Sai lệch: Phối Cổ phục trang trọng với Quần đùi / Váy ngắn',
    severity: 'danger',
    check: (state: OutfitState) => {
      return state.bottomId === 'bot_short_modern' || state.bottomId === 'bot_vay_ngan';
    },
    message: 'Cổ phục Việt Nam (Áo Tấc, Nhật Bình, Ngũ Thân) đại diện cho nền nếp đoan chính và cấu trúc "Tứ thân phụ mẫu". Việc mặc quần ngắn/váy đùi làm lộ chân phá vỡ hoàn toàn tỷ lệ và giá trị tôn nghiêm của trang phục.',
    historicalContext: 'Từ thời chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng (1837), triều đình đã ban lệnh thống nhất y phục toàn quốc bắt buộc phải mặc "quần không đáy có đáy kín đáo bên trong tà áo" để biểu thị quốc phong văn minh.',
    solution: 'Hãy chuyển sang Quần lụa trắng (bạch lạp) suông rộng hoặc Quần lụa đen truyền thống để có bước đi tha thướt, đúng lễ.',
  },
  {
    id: 'RULE_NO_NON_LA_NHAT_BINH',
    title: 'Sai lệch điển chế: Đội nón lá với Áo Nhật Bình cung đình',
    severity: 'danger',
    check: (state: OutfitState) => {
      return state.costumeId === 'nhat_binh' && (state.headwearId === 'head_non_la' || state.headwearId === 'head_non_la_hue');
    },
    message: 'Áo Nhật Bình là thường phục cao quý của bậc Hoàng tộc và Mệnh phụ triều đình. Nón lá là vật dụng che mưa nắng bình dị của thứ dân trong nông nghiệp và chợ búa.',
    historicalContext: 'Trong Khâm định Đại Nam hội điển sự lệ, Nhật Bình bắt buộc đi kèm Khăn vành dây ngũ sắc (hoặc Kim ước phát dát vàng cài trâm). Đội nón lá cùng Nhật Bình là sự nhầm lẫn phổ biến giữa trang phục thứ dân và lễ phục hoàng gia trên mạng xã hội.',
    solution: 'Nên kết hợp Áo Nhật Bình với Khăn Vành Dây (quấn nhiều vòng) hoặc dùng trâm cài, búi tóc gọn đính hoa. (Nếu muốn đội nón lá, hãy chọn Áo Dài hoặc Áo Ngũ Thân tay chẽn!).',
  },
  {
    id: 'RULE_NO_FLIP_FLOPS',
    title: 'Cảnh báo phong thái: Đi dép lê / dép tông xỏ ngón với Lễ phục',
    severity: 'warning',
    check: (state: OutfitState) => {
      return state.footwearId === 'foot_dep_lao';
    },
    message: 'Dép lê nhựa xỏ ngón tạo cảm giác cẩu thả, làm mất đi khí chất tôn nghiêm và vẻ đẹp đài các của bộ cổ phục dân tộc.',
    historicalContext: 'Người Việt xưa khi mang lễ phục thường đi hài vải có thêu hoa văn hoặc mang guốc mộc mài tinh xảo có quai nhung để giữ tiếng bước đi khoan thai, điềm đạm.',
    solution: 'Nên chọn Guốc mộc quai nhung truyền thống, Hài thêu chim phụng, hoặc nếu muốn remix theo gu Gen Z, hãy mang một đôi Sneaker trắng da cổ thấp sạch sẽ!',
  },
  {
    id: 'RULE_UNBUTTONED_COLLAR',
    title: 'Lưu ý đoan trang: Cổ đứng lập lĩnh cần cài đủ 5 cúc',
    severity: 'warning',
    check: (state: OutfitState) => {
      // Khi chọn sự kiện trang nghiêm nhưng lại kích hoạt chế độ buông lơi
      return (state.eventId === 'ev_den_chua' || state.eventId === 'ev_tot_nghiep') && state.isCasualStyling;
    },
    message: 'Cổ áo ngũ thân có 5 cúc cài tượng trưng cho Ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín). Ở nơi tôn nghiêm như Văn Miếu hay Đền Chùa, việc cởi bung cúc cổ áo làm giảm đi tính trang trọng.',
    historicalContext: 'Cúc cổ thứ nhất tượng trưng cho chữ "Nhân" - phẩm đức đầu tiên của con người. Người xưa khi bước vào cửa Khổng sân Trình luôn cài trọn vẹn cúc áo để biểu thị sự kính trọng với tiền hiền.',
    solution: 'Hãy cài đủ cúc cổ khi chụp ảnh tại chốn tôn miếu. Bạn có thể mở nhẹ cúc trên cùng khi dạo phố cafe dã ngoại cùng bạn bè.',
  },
  {
    id: 'RULE_ROLLED_SLEEVES',
    title: 'Mẹo tay áo: Không xắn tay áo Tấc lên quá cao',
    severity: 'tip',
    check: (state: OutfitState) => {
      return state.costumeId === 'ao_tac' && state.isCasualStyling;
    },
    message: 'Áo Tấc có tên gọi gắn liền với phần tay thụng rộng và dài quá ngón tay (khoảng 1 tấc dài hơn tay áo thường). Xắn tay áo lên gập gãy nếp vải sẽ làm mất đi ý nghĩa khiêm cung của chiếc áo.',
    historicalContext: 'Tay thụng dài thể hiện người mặc trong giờ phút đại lễ không phải lao động nặng nhọc, đôi tay giấu sau tà áo tượng trưng cho sự khiêm nhường, tĩnh tại.',
    solution: 'Hãy để tà tay áo buông thõng tự nhiên hoặc khoanh hai tay nhẹ trước bụng (tư thế Chấp thủ) để khoe trọn vẻ đẹp tha thướt.',
  },
  {
    id: 'RULE_SANCTUARY_RESPECT',
    title: 'Lưu ý phụ kiện: Phối kính râm / tạo dáng quẩy tại chốn Tôn miếu',
    severity: 'tip',
    check: (state: OutfitState) => {
      const hasSunGlasses = state.accessoryIds.includes('acc_kinh_ram');
      const isSanctuary = state.locationId === 'loc_van_mieu' || state.eventId === 'ev_den_chua';
      return hasSunGlasses && isSanctuary;
    },
    message: 'Kính râm gọng retro tạo phong cách Gen Z rất chất khi chụp ngoài phố, nhưng khi bước vào sân Đại Thành Văn Miếu hay cổng Đền miếu, bạn nên tháo kính râm để ánh nhìn chân thành, cung kính.',
    historicalContext: 'Chốn tôn miếu đòi hỏi "Tâm chính tắc Dung đoan" (Lòng ngay thẳng thì dung mạo đoan trang).',
    solution: 'Tạm cất kính râm vào túi gấm khi chụp tại khu vực thờ tự; đeo lại khi chụp ở sân vườn, cổng phụ hoặc đường phố xung quanh.',
  },
];
