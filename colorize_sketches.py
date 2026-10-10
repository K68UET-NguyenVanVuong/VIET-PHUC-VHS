#!/usr/bin/env python3
"""
Tô màu da thịt (#fcdbb6) và nền trắng cho áo quần (#ffffff),
giữ nền ngoài trong suốt cho 3 file sketch gốc:
- ao_nhat_binh.png
- ao_tac.png
- ao_dai_truyen_thong.png
"""
import subprocess
import os

SKIN_RGB = (252, 219, 182) # #fcdbb6 (Màu da người tự nhiên)
HAIR_RGB = (43, 29, 20)    # #2b1d14 (Màu tóc đen tự nhiên)
WHITE_RGB = (255, 255, 255) # #ffffff (Nền trắng cho áo/quần)

def process_nhatbinh():
    print("Processing ao_nhat_binh.png (1696x2528)...")
    w, h = 1696, 2528
    
    # 1. Convert files to PPM/PGM
    subprocess.run(['convert', 'ao_nhat_binh.png', '/tmp/nb_sketch.ppm'], check=True)
    subprocess.run(['convert', 'ao_nhat_binh_ao_mask.png', '-channel', 'A', '-separate', '/tmp/nb_shirt_alpha.pgm'], check=True)
    subprocess.run(['convert', 'ao_nhat_binh_quan_mask.jpg', '-resize', f'{w}x{h}!', '-channel', 'A', '-separate', '/tmp/nb_pant_alpha.pgm'], check=True)

    with open('/tmp/nb_sketch.ppm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        sketch_raw = f.read()

    with open('/tmp/nb_shirt_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        shirt_alpha = f.read()

    with open('/tmp/nb_pant_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        pant_alpha = f.read()

    # Precompute head/face profile for y=45..390
    head_profile = {}
    for y in range(45, 390):
        # Default smooth bounds
        # Interpolate based on key points:
        # y=45..100: apex 840..880 to 730..975
        # y=100..200: 710..1005
        # y=200..300: 710..990 tapering to 760..950
        # y=300..390: neck 780..930 to 800..915
        if y < 100:
            frac = (y - 45) / 55.0
            x1 = int(840 - frac * 110)
            x2 = int(880 + frac * 95)
        elif y < 200:
            frac = (y - 100) / 100.0
            x1 = int(730 - frac * 24)
            x2 = int(975 + frac * 30)
        elif y < 290:
            frac = (y - 200) / 90.0
            x1 = int(706 + frac * 50)
            x2 = int(1005 - frac * 50)
        else:
            frac = (y - 290) / 100.0
            x1 = int(756 + frac * 50)
            x2 = int(955 - frac * 45)
        head_profile[y] = (x1, x2)

    # Feet profile around y=2320..2475
    feet_profile = {}
    for y in range(2320, 2475):
        frac = (y - 2320) / 155.0
        # Left shoe and right shoe
        feet_profile[y] = [(int(680 - frac * 30), int(760 + frac * 20)), (int(980 - frac * 20), int(1060 + frac * 30))]

    out_rgba = bytearray(w * h * 4)

    for y in range(h):
        for x in range(w):
            idx_pix = y * w + x
            idx_rgba = idx_pix * 4
            idx_rgb = idx_pix * 3

            # Sketch pixel
            sr = sketch_raw[idx_rgb]
            sg = sketch_raw[idx_rgb + 1]
            sb = sketch_raw[idx_rgb + 2]
            # normalized luminance
            lum_r = sr / 255.0
            lum_g = sg / 255.0
            lum_b = sb / 255.0

            is_shirt = shirt_alpha[idx_pix] > 128
            is_pant = pant_alpha[idx_pix] > 128

            if is_shirt or is_pant:
                # Vùng áo và quần: Nền trắng tinh #FFFFFF với nét vẽ chì
                out_rgba[idx_rgba] = int(WHITE_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(WHITE_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(WHITE_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255 # Opaque
            elif 45 <= y < 390 and head_profile[y][0] <= x <= head_profile[y][1]:
                # Vùng đầu, khuôn mặt và cổ
                # Tóc ở đỉnh đầu/hai bên (y < 160 và rìa)
                is_hair = (y < 160) or (x < head_profile[y][0] + 35) or (x > head_profile[y][1] - 35)
                base = HAIR_RGB if (is_hair and y < 220) else SKIN_RGB
                out_rgba[idx_rgba] = int(base[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(base[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(base[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            elif y in feet_profile and any(f[0] <= x <= f[1] for f in feet_profile[y]):
                # Bàn chân / Giày
                out_rgba[idx_rgba] = int(SKIN_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(SKIN_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(SKIN_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            else:
                # Nền bên ngoài: Trong suốt 100%
                out_rgba[idx_rgba] = 0
                out_rgba[idx_rgba + 1] = 0
                out_rgba[idx_rgba + 2] = 0
                out_rgba[idx_rgba + 3] = 0

    # Write PAM and convert to PNG
    pam_header = f"P7\nWIDTH {w}\nHEIGHT {h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n".encode('ascii')
    with open('/tmp/nb_out.pam', 'wb') as f:
        f.write(pam_header + out_rgba)
    
    subprocess.run(['convert', '/tmp/nb_out.pam', 'ao_nhat_binh.png'], check=True)
    subprocess.run(['cp', 'ao_nhat_binh.png', 'public/ao_nhat_binh.png'], check=True)
    print("✅ Finished ao_nhat_binh.png!")

def process_aotac():
    print("Processing ao_tac.png (2752x1536)...")
    w, h = 2752, 1536
    
    subprocess.run(['convert', 'ao_tac.png', '/tmp/tac_sketch.ppm'], check=True)
    subprocess.run(['convert', 'ao_tac_ao_mask.png', '-channel', 'A', '-separate', '/tmp/tac_shirt_alpha.pgm'], check=True)
    subprocess.run(['convert', 'ao_tac_quan_mask.png', '-resize', f'{w}x{h}!', '-channel', 'A', '-separate', '/tmp/tac_pant_alpha.pgm'], check=True)

    with open('/tmp/tac_sketch.ppm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        sketch_raw = f.read()

    with open('/tmp/tac_shirt_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        shirt_alpha = f.read()

    with open('/tmp/tac_pant_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        pant_alpha = f.read()

    # Head/face profile for ao_tac: y=45..270
    head_profile = {}
    for y in range(45, 270):
        if y < 110:
            frac = (y - 45) / 65.0
            x1 = int(1400 - frac * 100)
            x2 = int(1470 + frac * 90)
        elif y < 190:
            frac = (y - 110) / 80.0
            x1 = int(1300 + frac * 20)
            x2 = int(1560 - frac * 20)
        else:
            frac = (y - 190) / 80.0
            x1 = int(1320 + frac * 40)
            x2 = int(1540 - frac * 40)
        head_profile[y] = (x1, x2)

    feet_profile = {}
    for y in range(1430, 1530):
        feet_profile[y] = [(1250, 1380), (1450, 1580)]

    out_rgba = bytearray(w * h * 4)

    for y in range(h):
        for x in range(w):
            idx_pix = y * w + x
            idx_rgba = idx_pix * 4
            idx_rgb = idx_pix * 3

            sr = sketch_raw[idx_rgb]
            sg = sketch_raw[idx_rgb + 1]
            sb = sketch_raw[idx_rgb + 2]
            lum_r = sr / 255.0
            lum_g = sg / 255.0
            lum_b = sb / 255.0

            is_shirt = shirt_alpha[idx_pix] > 128
            is_pant = pant_alpha[idx_pix] > 128

            if is_shirt or is_pant:
                out_rgba[idx_rgba] = int(WHITE_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(WHITE_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(WHITE_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            elif 45 <= y < 270 and head_profile[y][0] <= x <= head_profile[y][1]:
                is_hair = (y < 125) or (x < head_profile[y][0] + 30) or (x > head_profile[y][1] - 30)
                base = HAIR_RGB if (is_hair and y < 160) else SKIN_RGB
                out_rgba[idx_rgba] = int(base[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(base[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(base[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            elif y in feet_profile and any(f[0] <= x <= f[1] for f in feet_profile[y]):
                out_rgba[idx_rgba] = int(SKIN_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(SKIN_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(SKIN_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            else:
                out_rgba[idx_rgba] = 0
                out_rgba[idx_rgba + 1] = 0
                out_rgba[idx_rgba + 2] = 0
                out_rgba[idx_rgba + 3] = 0

    pam_header = f"P7\nWIDTH {w}\nHEIGHT {h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n".encode('ascii')
    with open('/tmp/tac_out.pam', 'wb') as f:
        f.write(pam_header + out_rgba)
    
    subprocess.run(['convert', '/tmp/tac_out.pam', 'ao_tac.png'], check=True)
    subprocess.run(['cp', 'ao_tac.png', 'public/ao_tac.png'], check=True)
    print("✅ Finished ao_tac.png!")

def process_aodai():
    print("Processing ao_dai_truyen_thong.png (2752x1536)...")
    w, h = 2752, 1536
    
    subprocess.run(['convert', 'ao_dai_truyen_thong.png', '/tmp/dai_sketch.ppm'], check=True)
    subprocess.run(['convert', 'ao_dai_truyen_thong_ao_mask.png', '-resize', f'{w}x{h}!', '-channel', 'A', '-separate', '/tmp/dai_shirt_alpha.pgm'], check=True)
    subprocess.run(['convert', 'ao_dai_truyen_thong_quan_mask.jpg', '-resize', f'{w}x{h}!', '-channel', 'A', '-separate', '/tmp/dai_pant_alpha.pgm'], check=True)

    with open('/tmp/dai_sketch.ppm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        sketch_raw = f.read()

    with open('/tmp/dai_shirt_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        shirt_alpha = f.read()

    with open('/tmp/dai_pant_alpha.pgm', 'rb') as f:
        f.readline(); f.readline(); f.readline()
        pant_alpha = f.read()

    # Head and Nón Lá for Áo Dài
    # y=35..250, x=1250..1550 (apex to base of conical hat and face)
    head_profile = {}
    for y in range(35, 250):
        if y < 110:
            frac = (y - 35) / 75.0
            x1 = int(1360 - frac * 110)
            x2 = int(1440 + frac * 110)
        elif y < 180:
            frac = (y - 110) / 70.0
            x1 = int(1250 + frac * 40)
            x2 = int(1550 - frac * 40)
        else:
            frac = (y - 180) / 70.0
            x1 = int(1290 + frac * 40)
            x2 = int(1510 - frac * 40)
        head_profile[y] = (x1, x2)

    feet_profile = {}
    for y in range(1440, 1530):
        feet_profile[y] = [(1250, 1370), (1450, 1570)]

    out_rgba = bytearray(w * h * 4)

    for y in range(h):
        for x in range(w):
            idx_pix = y * w + x
            idx_rgba = idx_pix * 4
            idx_rgb = idx_pix * 3

            sr = sketch_raw[idx_rgb]
            sg = sketch_raw[idx_rgb + 1]
            sb = sketch_raw[idx_rgb + 2]
            lum_r = sr / 255.0
            lum_g = sg / 255.0
            lum_b = sb / 255.0

            is_shirt = shirt_alpha[idx_pix] > 128
            is_pant = pant_alpha[idx_pix] > 128

            if is_shirt or is_pant:
                out_rgba[idx_rgba] = int(WHITE_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(WHITE_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(WHITE_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            elif 35 <= y < 250 and head_profile[y][0] <= x <= head_profile[y][1]:
                # Face, hat and neck
                is_hat = y < 110
                base = (245, 230, 200) if is_hat else SKIN_RGB
                out_rgba[idx_rgba] = int(base[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(base[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(base[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            elif y in feet_profile and any(f[0] <= x <= f[1] for f in feet_profile[y]):
                out_rgba[idx_rgba] = int(SKIN_RGB[0] * lum_r)
                out_rgba[idx_rgba + 1] = int(SKIN_RGB[1] * lum_g)
                out_rgba[idx_rgba + 2] = int(SKIN_RGB[2] * lum_b)
                out_rgba[idx_rgba + 3] = 255
            else:
                out_rgba[idx_rgba] = 0
                out_rgba[idx_rgba + 1] = 0
                out_rgba[idx_rgba + 2] = 0
                out_rgba[idx_rgba + 3] = 0

    pam_header = f"P7\nWIDTH {w}\nHEIGHT {h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n".encode('ascii')
    with open('/tmp/dai_out.pam', 'wb') as f:
        f.write(pam_header + out_rgba)
    
    subprocess.run(['convert', '/tmp/dai_out.pam', 'ao_dai_truyen_thong.png'], check=True)
    subprocess.run(['cp', 'ao_dai_truyen_thong.png', 'public/ao_dai_truyen_thong.png'], check=True)
    print("✅ Finished ao_dai_truyen_thong.png!")

def main():
    process_nhatbinh()
    process_aotac()
    process_aodai()
    print("🎉 Tất cả 3 file sketch đã được tô màu da thịt (#fcdbb6) và nền trắng áo quần, nền ngoài trong suốt 100%!")

if __name__ == '__main__':
    main()
