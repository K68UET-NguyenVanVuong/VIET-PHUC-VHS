#!/usr/bin/env python3
import math
import subprocess
import os

def clamp(v, min_v=0, max_v=255):
    return max(min_v, min(max_v, int(v)))

def create_hoguom1(width=900, height=1200):
    """
    Scene 1: Dạo bước ven Hồ Gươm (HoGuom1.jpg)
    - Đường dạo bộ ven hồ lát đá hoa cương
    - Hàng cây liễu cổ thụ bên trái soi bóng hồ
    - Ghế đá / ghế sắt công viên cổ điển bên phải
    - Mặt hồ xanh lục thủy và Tháp Rùa ẩn hiện trong sương sớm
    """
    pixels = bytearray(width * height * 3)
    
    for y in range(height):
        # Y ratio: 0.0 (top) to 1.0 (bottom)
        ty = y / height
        
        for x in range(width):
            tx = x / width
            idx = (y * width + x) * 3
            
            # --- 1. SKY & DISTANT MIST (Top 0% - 45%) ---
            if ty < 0.42:
                # Morning mist gradient: soft blue-grey to warm haze
                t_sky = ty / 0.42
                r = 195 + t_sky * 35
                g = 210 + t_sky * 25
                b = 218 + t_sky * 18
                
                # Distant Turtle Tower (around tx=0.45..0.55, ty=0.28..0.38)
                if 0.44 < tx < 0.54 and 0.26 < ty < 0.38:
                    # Tower silhouette in mist
                    tower_fade = 0.55
                    tw_r, tw_g, tw_b = 135, 140, 138
                    if 0.46 < tx < 0.52 and 0.28 < ty < 0.32: # Top tier
                        tw_r, tw_g, tw_b = 120, 125, 122
                    r = r * (1 - tower_fade) + tw_r * tower_fade
                    g = g * (1 - tower_fade) + tw_g * tower_fade
                    b = b * (1 - tower_fade) + tw_b * tower_fade

                # Soft clouds / haze
                haze = math.sin(tx * 8) * 4 + math.cos(ty * 12) * 5
                r += haze; g += haze; b += haze

            # --- 2. EMERALD LAKE (Ty: 0.38 - 0.70, Tx: 0.0 - 0.65) ---
            elif ty < 0.68 and (tx < 0.68 - (ty - 0.38) * 0.4):
                t_lake = (ty - 0.38) / 0.30
                # Iconic emerald jade green water of Hoan Kiem
                r = 65 + t_lake * 30
                g = 125 + t_lake * 25
                b = 110 + t_lake * 15
                
                # Subtle water ripples
                ripple = math.sin(x * 0.15 + y * 0.35) * math.cos(x * 0.08) * 6
                r += ripple; g += ripple * 1.2; b += ripple * 0.8
                
                # Soft reflections of distant foliage
                if tx < 0.35:
                    r *= 0.85; g *= 0.92; b *= 0.82

            # --- 3. STONE PAVED PEDESTRIAN WALKWAY (Bottom ground) ---
            else:
                t_ground = (ty - 0.55) / 0.45
                # Grey-beige granite pavers with warmth
                r = 138 + t_ground * 40
                g = 132 + t_ground * 38
                b = 122 + t_ground * 32
                
                # Perspective stone paving pattern
                tile_u = (x - width * 0.45) / (y * 0.003 + 0.1)
                tile_v = 1.0 / (ty - 0.48 + 0.05)
                
                grid_u = int(tile_u * 0.08) % 2
                grid_v = int(tile_v * 0.8) % 2
                if grid_u ^ grid_v:
                    r += 8; g += 8; b += 6
                else:
                    r -= 6; g -= 6; b -= 8
                    
                # Walkway granite texture noise
                noise = (math.sin(x * 1.8 + y * 0.9) * 4 + math.cos(x * 0.6 - y * 1.5) * 4)
                r += noise; g += noise; b += noise

            # --- 4. WILLOW & ANCIENT TREE CANOPY (Left upper side) ---
            # Ancient tree branches dropping from top left
            dist_left_canopy = math.hypot(tx - 0.08, ty - 0.12)
            if dist_left_canopy < 0.42:
                leaf_density = (0.42 - dist_left_canopy) / 0.42
                leaf_noise = (math.sin(x * 0.09) * math.cos(y * 0.11) + math.sin(x * 0.18 + y * 0.15)) * 0.5
                if leaf_density + leaf_noise * 0.35 > 0.18:
                    tree_r = 42 + leaf_noise * 15
                    tree_g = 78 + leaf_noise * 25
                    tree_b = 40 + leaf_noise * 12
                    blend = min(1.0, (leaf_density + leaf_noise * 0.35) * 2.2)
                    r = r * (1 - blend) + tree_r * blend
                    g = g * (1 - blend) + tree_g * blend
                    b = b * (1 - blend) + tree_b * blend

            # --- 5. TALL TREE TRUNK & PARK BENCH (Right side: tx > 0.72) ---
            # Tree trunk on the far right (tx=0.86..0.94)
            if 0.84 < tx < 0.95 and ty > 0.15:
                trunk_r = 55 + math.sin(y * 0.2) * 10
                trunk_g = 45 + math.cos(y * 0.2) * 8
                trunk_b = 38
                r = r * 0.2 + trunk_r * 0.8
                g = g * 0.2 + trunk_g * 0.8
                b = b * 0.2 + trunk_b * 0.8
                
            # Classic wrought-iron park bench (around tx=0.74..0.92, ty=0.68..0.82)
            # The prompt notes: "đường dạo bộ ven hồ có hàng cây bên trái và ghế đá bên phải"
            # And character stands at left: 30%, bottom: 5% to avoid overlapping this bench!
            if 0.72 < tx < 0.92 and 0.70 < ty < 0.82:
                bench_x = (tx - 0.72) / 0.20
                bench_y = (ty - 0.70) / 0.12
                # Slats of the bench backrest & seat
                is_slat = (0.1 < bench_y < 0.45 and (int(bench_y * 14) % 2 == 0)) or \
                         (0.50 < bench_y < 0.68 and (int(bench_y * 16) % 2 == 0))
                # Legs of the bench
                is_leg = (0.15 < bench_x < 0.22 or 0.78 < bench_x < 0.85) and bench_y > 0.50
                
                if is_slat:
                    # Warm wood slats
                    br, bg, bb = 135, 78, 45
                    r = br; g = bg; b = bb
                elif is_leg:
                    # Dark green/black cast iron legs
                    br, bg, bb = 28, 38, 32
                    r = br; g = bg; b = bb

            # Vignette for professional photography aesthetic
            diag_dist = math.hypot(tx - 0.5, ty - 0.5)
            vignette = max(0.72, 1.0 - (diag_dist * 0.35))
            r *= vignette; g *= vignette; b *= vignette

            pixels[idx] = clamp(r)
            pixels[idx + 1] = clamp(g)
            pixels[idx + 2] = clamp(b)
            
    return pixels

def create_hoangthanh2(width=900, height=1200):
    """
    Scene 2: Hoàng hôn Hoàng Thành (HoangThanhThangLong2.jpg)
    - Cổng thành đá Đoan Môn đồ sộ, góc máy rộng đối xứng
    - Nền gạch nung đỏ rực phản chiếu ánh hoàng hôn vàng cam
    - 5 vòm cổng thành đá cổ kính
    """
    pixels = bytearray(width * height * 3)
    
    for y in range(height):
        ty = y / height
        
        for x in range(width):
            tx = x / width
            idx = (y * width + x) * 3
            
            # --- 1. GOLDEN HOUR SUNSET SKY (Top 0% - 46%) ---
            if ty < 0.44:
                t_sky = ty / 0.44
                # Sunset gradient: warm golden amber to radiant apricot
                r = 245 - t_sky * 25
                g = 175 - t_sky * 45
                b = 95 - t_sky * 40
                
                # Sunset sun glow behind the gatehouse
                sun_dist = math.hypot(tx - 0.50, ty - 0.36)
                if sun_dist < 0.35:
                    glow = (0.35 - sun_dist) / 0.35
                    r += glow * 45
                    g += glow * 35
                    b += glow * 10
            
            # --- 2. DOAN MON GATE FORTRESS ARCHITECTURE (ty: 0.22 - 0.60) ---
            # Watchtower pavilion on top (ty: 0.20 - 0.36, tx: 0.32 - 0.68)
            in_pavilion = (0.20 < ty < 0.36) and (0.32 < tx < 0.68)
            # Main fortress stone rampart wall (ty: 0.36 - 0.62, tx: 0.08 - 0.92)
            in_rampart = (0.36 <= ty < 0.62) and (0.06 < tx < 0.94)
            
            if in_pavilion:
                # Traditional Vietnamese curved tile roof
                roof_t = (ty - 0.20) / 0.16
                roof_width = 0.36 + roof_t * 0.06
                if abs(tx - 0.50) < roof_width / 2:
                    # Antique red terracotta curved tile roof
                    r = 165 - roof_t * 30
                    g = 72 - roof_t * 15
                    b = 48 - roof_t * 10
                    # Wooden balustrades and pillars
                    if ty > 0.28:
                        r = 105; g = 52; b = 35
                        if int(x / 14) % 2 == 0:
                            r += 15; g += 8; b += 6
                else:
                    # Sky behind roof edges
                    r = 230; g = 150; b = 80

            elif in_rampart:
                # Ancient monumental stone gate wall with 5 arches
                t_wall = (ty - 0.36) / 0.26
                # Ancient grey stone warmed by golden sunset light
                r = 160 + t_wall * 20
                g = 135 + t_wall * 15
                b = 110 + t_wall * 8
                
                # Stone brick courses
                brick_y = int(y / 10)
                brick_x = int((x + (brick_y % 2) * 15) / 30)
                if (y % 10 == 0) or ((x + (brick_y % 2) * 15) % 30 == 0):
                    r -= 20; g -= 20; b -= 18
                    
                # 5 Portals (Arches) of Doan Mon:
                # Center arch (largest): tx = 0.50, width ~ 0.11, ty: 0.44 - 0.62
                # Inner arches (left/right): tx = 0.37, 0.63, width ~ 0.08
                # Outer arches (left/right): tx = 0.25, 0.75, width ~ 0.07
                arch_centers = [0.25, 0.37, 0.50, 0.63, 0.75]
                arch_widths = [0.065, 0.08, 0.11, 0.08, 0.065]
                arch_top_ys = [0.49, 0.46, 0.43, 0.46, 0.49]
                
                for ac, aw, aty in zip(arch_centers, arch_widths, arch_top_ys):
                    dx = abs(tx - ac)
                    if dx < aw / 2 and ty >= aty:
                        # Semi-circular arch top
                        norm_dx = dx / (aw / 2)
                        arch_arch_y = aty + (1.0 - math.sqrt(max(0.0, 1.0 - norm_dx * norm_dx))) * 0.035
                        if ty >= arch_arch_y:
                            # Inside dark portal tunnel with sunset light spill
                            tunnel_depth = (ty - arch_arch_y) / (0.62 - arch_arch_y + 0.001)
                            r = 45 + tunnel_depth * 25
                            g = 30 + tunnel_depth * 18
                            b = 25 + tunnel_depth * 15
                            break

            # --- 3. RED TERRACOTTA BRICK PLAZA (Ground: ty >= 0.60) ---
            elif ty >= 0.60:
                t_plaza = (ty - 0.60) / 0.40
                # Imperial red terracotta bricks reflecting golden sunset
                r = 185 + t_plaza * 25
                g = 95 + t_plaza * 20
                b = 65 + t_plaza * 15
                
                # Perspective red tile floor grid
                ground_v = 1.0 / (ty - 0.57)
                ground_u = (tx - 0.50) * ground_v * 1.8
                
                u_line = abs(ground_u - round(ground_u))
                v_line = abs(ground_v * 0.25 - round(ground_v * 0.25))
                
                if u_line < 0.05 or v_line < 0.06:
                    # Grout lines between ancient bricks
                    r -= 25; g -= 18; b -= 15
                else:
                    # Warm brick reflection in sunset
                    refl = math.sin(ground_u * 3.14) * 8
                    r += refl; g += refl * 0.6; b += refl * 0.3
                    
                # Center line axis (Trục thần đạo leading to center arch)
                if abs(tx - 0.50) < 0.045:
                    r += 12; g += 8; b += 5

            # Golden sunset atmosphere color grading
            r = min(255, r * 1.05)
            g = min(255, g * 0.98)
            b = min(255, b * 0.90)

            # Vignette
            diag_dist = math.hypot(tx - 0.5, ty - 0.5)
            vignette = max(0.70, 1.0 - (diag_dist * 0.36))
            r *= vignette; g *= vignette; b *= vignette

            pixels[idx] = clamp(r)
            pixels[idx + 1] = clamp(g)
            pixels[idx + 2] = clamp(b)
            
    return pixels

def save_image(pixels, width, height, output_ppm, output_destinations):
    header = f"P6\n{width} {height}\n255\n".encode('ascii')
    with open(output_ppm, 'wb') as f:
        f.write(header)
        f.write(pixels)
        
    for dest in output_destinations:
        subprocess.run(['convert', output_ppm, dest], check=True)
        print(f"✅ Generated clean plate: {dest}")

def main():
    os.makedirs('public', exist_ok=True)
    w, h = 900, 1200
    
    print("🎨 Rendering Scene 1: HoGuom1.jpg (Dạo bước ven Hồ Gươm)...")
    hg1_pixels = create_hoguom1(w, h)
    save_image(hg1_pixels, w, h, '/tmp/hg1.ppm', ['HoGuom1.jpg', 'public/HoGuom1.jpg'])
    
    print("🎨 Rendering Scene 2: HoangThanhThangLong2.jpg (Hoàng hôn Hoàng Thành)...")
    ht2_pixels = create_hoangthanh2(w, h)
    save_image(ht2_pixels, w, h, '/tmp/ht2.ppm', ['HoangThanhThangLong2.jpg', 'public/HoangThanhThangLong2.jpg'])

    # Auxiliary scenes
    print("🎨 Generating auxiliary HoGuom2.jpg & HoangThanhThangLong1.png...")
    subprocess.run(['convert', 'HoGuom1.jpg', '-modulate', '95,120,95', 'HoGuom2.jpg'], check=True)
    subprocess.run(['convert', 'HoGuom2.jpg', 'public/HoGuom2.jpg'], check=True)

    subprocess.run(['convert', 'HoangThanhThangLong2.jpg', '-modulate', '105,75,100', 'HoangThanhThangLong1.png'], check=True)
    subprocess.run(['convert', 'HoangThanhThangLong1.png', 'public/HoangThanhThangLong1.png'], check=True)
    print("🎉 All 4 local background assets successfully created!")

if __name__ == '__main__':
    main()
