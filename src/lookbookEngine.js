/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * VIRTUAL PHOTOSHOOT: IMAGE-BASED COMPOSITING ENGINE
 * Hệ thống ghép ảnh thực tế: Phông nền thật (Background) + Ảnh Model PNG tách nền (Transparent PNG)
 * Tuyệt đối không vẽ SVG người.
 */

export const COMPOSITING_SCENES = {
  // SCENE 1: Hồ Gươm
  hoguom: {
    id: 'hoguom',
    name: 'Hồ Gươm',
    subTitle: 'Medium-Full Shot (60% Chiều cao)',
    bgUrl: './HoGuom1.jpg',
    defaultModelSrc: 'https://dummyimage.com/400x800/ffffff/000000.png&text=Anh+Model+Chup+Ho+Guom+.PNG',
    css: {
      height: '60%',
      left: '30%',
      bottom: '5%',
      transform: 'none'
    },
    location: 'Đường dạo ven hồ Hoàn Kiếm, Hà Nội',
    desc: 'Đường dạo bộ ven hồ Hoàn Kiếm có hàng cây và ghế đá. Model chiếm 60% chiều cao khung hình, nằm hơi lệch sang trái (left: 30%, bottom: 5%) để gót chân chạm đúng phần gạch lát đường, tránh bị đè lên chiếc ghế đá ở góc phải.'
  },

  // SCENE 2: Hoàng Thành Thăng Long
  hoangthanh: {
    id: 'hoangthanh',
    name: 'Hoàng Thành Thăng Long',
    subTitle: 'Cinematic Wide Shot (45% Chiều cao)',
    bgUrl: './HoangThanhThangLong2.jpg',
    defaultModelSrc: 'https://dummyimage.com/400x800/ffffff/000000.png&text=Anh+Model+Chup+Hoang+Thanh+.PNG',
    css: {
      height: '45%',
      left: '50%',
      bottom: '12%',
      transform: 'translateX(-50%)'
    },
    location: 'Cổng Đoan Môn, Hoàng Thành Thăng Long',
    desc: 'Cổng thành đá Đoan Môn đồ sộ, góc máy rộng, đối xứng, nền gạch nung phản chiếu ánh hoàng hôn. Model thu nhỏ lại chiếm 45% chiều cao, nằm chính giữa (left: 50%, transform: translateX(-50%)), gót chân chạm vào hàng gạch sân (bottom: 12%).'
  }
};
