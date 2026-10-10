/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ỨNG DỤNG "VIỆT PHỤC REMIX" - DEVELOPMENT & PREVIEW WORKSTATION
 * Giao diện làm việc kết hợp song song:
 * 1. Chế độ xem 3D tương tác (Three.js 3D View & 3D Assets Manager)
 * 2. Chế độ xem 2D (Gen Z Lookbook Preview)
 * 3. Đồng bộ dữ liệu hai chiều: Thay đổi 3D cập nhật 2D và ngược lại
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Search,
  Box,
  Layers,
  Sparkles,
  Sliders,
  Check,
  RotateCw,
  RefreshCw,
  Tag,
  Palette as PaletteIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

// Danh mục 3D Assets có sẵn trong hệ thống
interface Asset3DItem {
  id: string;
  name: string;
  category: 'character' | 'costume' | 'accessory';
  type: 'male' | 'female' | 'ao_tac' | 'ngu_than' | 'non_la';
  filename: string;
  icon: string;
  description: string;
}

const AVAILABLE_3D_ASSETS: Asset3DItem[] = [
  { id: 'asset_male', name: 'Humanoid_Male.glb', category: 'character', type: 'male', filename: 'Humanoid_Male.glb', icon: '👤', description: 'Mô hình nam giới chuẩn phom Á Đông' },
  { id: 'asset_female', name: 'Humanoid_Female.glb', category: 'character', type: 'female', filename: 'Humanoid_Female.glb', icon: '👩', description: 'Mô hình nữ giới thon thả thanh thoát' },
  { id: 'asset_ao_tac', name: 'Áo Tấc_3D', category: 'costume', type: 'ao_tac', filename: 'Ao_Tac_HighPoly.mesh', icon: '👘', description: 'Đại lễ phục tay thụng rộng 1 tấc triều Nguyễn' },
  { id: 'asset_ngu_than', name: 'Áo Ngũ Thân_3D', category: 'costume', type: 'ngu_than', filename: 'Ao_Ngu_Than_GenZ.mesh', icon: '👘', description: 'Áo ngũ thân tay chẽn năng động dạo phố' },
  { id: 'asset_non_la', name: 'Nón Lá_3D', category: 'accessory', type: 'non_la', filename: 'Non_La_BaiTho.obj', icon: '👒', description: 'Nón chóp bài thơ lá gồi truyền thống' },
];

// Bảng màu Palette phối đồ Gen Z
const LOOKBOOK_PALETTES = [
  { id: 'pal_sand', hex: '#D2A06E', name: 'Be Cát Sa Mạc', pantsHex: '#2B2B2E', tag: 'Dạo phố' },
  { id: 'pal_terracotta', hex: '#C05A3E', name: 'Đất Nung Nồng Ấm', pantsHex: '#1E1E24', tag: 'Tết du xuân' },
  { id: 'pal_sage', hex: '#8A9A86', name: 'Xanh Tràm Lục Trúc', pantsHex: '#FAF7F0', tag: 'Văn Miếu' },
  { id: 'pal_ruby', hex: '#A82B35', name: 'Đỏ Điều Son Cổ', pantsHex: '#FAF7F0', tag: 'Lễ hội' },
  { id: 'pal_navy', hex: '#264653', name: 'Lam Tràm Cung Đình', pantsHex: '#FAF7F0', tag: 'Trang trọng' },
  { id: 'pal_mustard', hex: '#E9C46A', name: 'Vàng Hoàng Cúc', pantsHex: '#2B2B2E', tag: 'Hội An' },
];

// Hoa văn vải Fabric Pattern
const FABRIC_PATTERNS = [
  { id: 'pat_woven', name: 'Vải đũi tơ tằm dệt thô', previewBg: 'radial-gradient(#c28f58 2px, #d2a06e 2px)' },
  { id: 'pat_brocade', name: 'Gấm hoa văn mây ngũ phúc', previewBg: 'repeating-linear-gradient(45deg, #b88650, #b88650 4px, #a2723c 4px, #a2723c 8px)' },
  { id: 'pat_striped', name: 'Lụa tơ sống kẻ chỉ chìm', previewBg: 'linear-gradient(90deg, #d2a06e 50%, #b88650 50%)' },
];

export default function App() {
  // ---------------------------------------------------------------------------
  // 1. TRẠNG THÁI CHÍNH CỦA BẢN PHỐI ĐỒ (3D & 2D LINKED STATE)
  // ---------------------------------------------------------------------------
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset_ngu_than');
  const [appliedCostumeType, setAppliedCostumeType] = useState<'ao_tac' | 'ngu_than'>('ngu_than');
  const [appliedGender, setAppliedGender] = useState<'male' | 'female'>('male');
  const [hasNonLa, setHasNonLa] = useState<boolean>(true);

  // Màu sắc tà áo và quần (Được đồng bộ 2 chiều giữa 3D và 2D)
  const [robeColor, setRobeColor] = useState<string>('#D2A06E');
  const [pantsColor, setPantsColor] = useState<string>('#2B2B2E');
  const [activePattern, setActivePattern] = useState<string>('pat_woven');

  // Điều khiển thuộc tính nhân vật 3D (Character Controls)
  const [charRotation, setCharRotation] = useState<number>(0);
  const [charHeight, setCharHeight] = useState<number>(1.0);
  const [charWeight, setCharWeight] = useState<number>(1.0);
  const [charPoseIndex, setCharPoseIndex] = useState<number>(0);

  // Trạng thái tìm kiếm & loading mô phỏng AI
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isApplying3D, setIsApplying3D] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [is2DModeSwitch, setIs2DModeSwitch] = useState<boolean>(true);

  // Three.js Canvas Reference
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const robeMeshRef = useRef<THREE.Mesh | null>(null);
  const frontFlapMeshRef = useRef<THREE.Mesh | null>(null);
  const backFlapMeshRef = useRef<THREE.Mesh | null>(null);
  const leftSleeveMeshRef = useRef<THREE.Mesh | null>(null);
  const rightSleeveMeshRef = useRef<THREE.Mesh | null>(null);
  const pantsMeshRef = useRef<THREE.Mesh | null>(null);
  const nonLaMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // ---------------------------------------------------------------------------
  // 2. KHỞI TẠO MÔ HÌNH 3D VỚI THREE.JS (T-POSE / A-POSE MANNEQUIN & WIREFRAME)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Tạo Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#16141a');

    // Camera góc nhìn 3/4 chụp toàn thân
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Ánh sáng Ambient & Directional
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.3);
    dirLight.position.set(2.5, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backRimLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    backRimLight.position.set(-2, 2.5, -3);
    scene.add(backRimLight);

    // Lưới Grid sàn làm việc 3D (Workstation Grid)
    const gridHelper = new THREE.GridHelper(6, 20, 0x4a3b2c, 0x241d24);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Gom toàn bộ nhân vật 3D vào Group
    const characterGroup = new THREE.Group();
    characterGroupRef.current = characterGroup;
    scene.add(characterGroup);

    // Vật liệu chung
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xdec0a9,
      roughness: 0.6,
      metalness: 0.05
    });

    const robeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(robeColor),
      roughness: 0.45,
      metalness: 0.15,
      wireframe: false
    });

    const pantsMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(pantsColor),
      roughness: 0.5,
      metalness: 0.1
    });

    const nonLaMaterial = new THREE.MeshStandardMaterial({
      color: 0xead1a0,
      roughness: 0.7,
      metalness: 0.05
    });

    // Wireframe Overlay Material
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x221a14,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    wireframeMaterialRef.current = wireMat;

    // --- DỰNG THÂN NGƯỜI (HUMANOID MANNEQUIN IN A-POSE) ---
    // Đầu & Tóc
    const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.y = 1.95;
    characterGroup.add(headMesh);

    // Tóc vuốt cổ điển
    const hairGeo = new THREE.SphereGeometry(0.185, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f1917, roughness: 0.9 });
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 1.98;
    characterGroup.add(hairMesh);

    // Cổ
    const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.15, 20);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.y = 1.82;
    characterGroup.add(neckMesh);

    // Cổ áo đứng 5 cúc lập lĩnh
    const collarGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.1, 20);
    const collarMesh = new THREE.Mesh(collarGeo, robeMaterial);
    collarMesh.position.y = 1.81;
    characterGroup.add(collarMesh);

    // Nón Lá 3D (Gắn trên đầu)
    const hatGeo = new THREE.ConeGeometry(0.42, 0.22, 32);
    const hatMesh = new THREE.Mesh(hatGeo, nonLaMaterial);
    hatMesh.position.set(0, 2.16, 0.02);
    hatMesh.rotation.x = 0.05;
    hatMesh.visible = hasNonLa;
    nonLaMeshRef.current = hatMesh;
    characterGroup.add(hatMesh);

    // Thân áo chính (Torso Robe)
    const robeGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.85, 28);
    const robeMesh = new THREE.Mesh(robeGeo, robeMaterial);
    robeMesh.position.y = 1.4;
    robeMeshRef.current = robeMesh;
    characterGroup.add(robeMesh);

    // Wireframe overlay thân áo
    const robeWire = new THREE.Mesh(robeGeo, wireMat);
    robeWire.position.y = 1.4;
    characterGroup.add(robeWire);

    // Tay áo trái (A-pose dang nhẹ)
    const leftSleeveGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.72, 20);
    const leftSleeveMesh = new THREE.Mesh(leftSleeveGeo, robeMaterial);
    leftSleeveMesh.position.set(0.38, 1.48, 0);
    leftSleeveMesh.rotation.z = -0.7; // A-pose angle
    leftSleeveMeshRef.current = leftSleeveMesh;
    characterGroup.add(leftSleeveMesh);

    const leftSleeveWire = new THREE.Mesh(leftSleeveGeo, wireMat);
    leftSleeveWire.position.set(0.38, 1.48, 0);
    leftSleeveWire.rotation.z = -0.7;
    characterGroup.add(leftSleeveWire);

    // Bàn tay trái
    const handGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const leftHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    leftHandMesh.position.set(0.68, 1.2, 0);
    characterGroup.add(leftHandMesh);

    // Tay áo phải
    const rightSleeveGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.72, 20);
    const rightSleeveMesh = new THREE.Mesh(rightSleeveGeo, robeMaterial);
    rightSleeveMesh.position.set(-0.38, 1.48, 0);
    rightSleeveMesh.rotation.z = 0.7;
    rightSleeveMeshRef.current = rightSleeveMesh;
    characterGroup.add(rightSleeveMesh);

    const rightSleeveWire = new THREE.Mesh(rightSleeveGeo, wireMat);
    rightSleeveWire.position.set(-0.38, 1.48, 0);
    rightSleeveWire.rotation.z = 0.7;
    characterGroup.add(rightSleeveWire);

    // Bàn tay phải
    const rightHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    rightHandMesh.position.set(-0.68, 1.2, 0);
    characterGroup.add(rightHandMesh);

    // Tà trước (Front Flap) kéo dài từ eo xuống đầu gối/bắp chân
    const flapGeo = new THREE.BoxGeometry(0.42, 0.9, 0.02, 16, 16);
    const frontFlapMesh = new THREE.Mesh(flapGeo, robeMaterial);
    frontFlapMesh.position.set(0, 0.75, 0.12);
    frontFlapMeshRef.current = frontFlapMesh;
    characterGroup.add(frontFlapMesh);

    const frontFlapWire = new THREE.Mesh(flapGeo, wireMat);
    frontFlapWire.position.set(0, 0.75, 0.12);
    characterGroup.add(frontFlapWire);

    // Tà sau (Back Flap)
    const backFlapMesh = new THREE.Mesh(flapGeo, robeMaterial);
    backFlapMesh.position.set(0, 0.75, -0.12);
    backFlapMeshRef.current = backFlapMesh;
    characterGroup.add(backFlapMesh);

    // Quần lụa hai ống dáng suông
    const pantsGroup = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.95, 20);

    const leftLeg = new THREE.Mesh(legGeo, pantsMaterial);
    leftLeg.position.set(0.13, 0.48, 0);
    pantsGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMaterial);
    rightLeg.position.set(-0.13, 0.48, 0);
    pantsGroup.add(rightLeg);

    const leftLegWire = new THREE.Mesh(legGeo, wireMat);
    leftLegWire.position.set(0.13, 0.48, 0);
    pantsGroup.add(leftLegWire);

    const rightLegWire = new THREE.Mesh(legGeo, wireMat);
    rightLegWire.position.set(-0.13, 0.48, 0);
    pantsGroup.add(rightLegWire);

    pantsMeshRef.current = leftLeg; // giữ ref vật liệu
    characterGroup.add(pantsGroup);

    // Đôi guốc mộc / giày dạo phố
    const shoeGeo = new THREE.BoxGeometry(0.11, 0.05, 0.22);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.4 });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0.13, 0.025, 0.03);
    characterGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(-0.13, 0.025, 0.03);
    characterGroup.add(rightShoe);

    // Đai lưng vải (Sash belt)
    const beltGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.09, 28);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x933b2e, roughness: 0.5 });
    const beltMesh = new THREE.Mesh(beltGeo, beltMat);
    beltMesh.position.y = 1.18;
    characterGroup.add(beltMesh);

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !characterGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      characterGroupRef.current.rotation.y += deltaX * 0.01;
      setCharRotation(Math.round((characterGroupRef.current.rotation.y * 180) / Math.PI) % 360);
      prevMouseX = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. LOGIC LIÊN KẾT 3D -> 2D (CẬP NHẬT MÀU VÀ TỶ LỆ KHI ĐỔI STATE)
  // ---------------------------------------------------------------------------
  // Cập nhật màu áo trên mô hình 3D
  useEffect(() => {
    if (robeMeshRef.current) {
      (robeMeshRef.current.material as THREE.MeshStandardMaterial).color.set(robeColor);
    }
  }, [robeColor]);

  // Cập nhật màu quần trên mô hình 3D
  useEffect(() => {
    if (pantsMeshRef.current) {
      (pantsMeshRef.current.material as THREE.MeshStandardMaterial).color.set(pantsColor);
    }
  }, [pantsColor]);

  // Cập nhật góc xoay từ slider
  useEffect(() => {
    if (characterGroupRef.current) {
      characterGroupRef.current.rotation.y = (charRotation * Math.PI) / 180;
    }
  }, [charRotation]);

  // Cập nhật tỷ lệ chiều cao và độ đậm người
  useEffect(() => {
    if (characterGroupRef.current) {
      characterGroupRef.current.scale.set(charWeight, charHeight, charWeight);
    }
  }, [charHeight, charWeight]);

  // Cập nhật hiển thị Nón Lá
  useEffect(() => {
    if (nonLaMeshRef.current) {
      nonLaMeshRef.current.visible = hasNonLa;
    }
  }, [hasNonLa]);

  // Bật/tắt Wireframe Overlay
  useEffect(() => {
    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.visible = showWireframe;
    }
  }, [showWireframe]);

  // ---------------------------------------------------------------------------
  // 4. HÀM XỬ LÝ: "APPLY SELECTED ASSET" (MÔ PHỎNG TẢI & ÁP DỤNG MÔ HÌNH)
  // ---------------------------------------------------------------------------
  const handleApplySelectedAsset = () => {
    setIsApplying3D(true);
    setNotificationMsg('Đang tải và áp dụng mô hình 3D...');

    setTimeout(() => {
      const selected = AVAILABLE_3D_ASSETS.find((a) => a.id === selectedAssetId);
      if (selected) {
        if (selected.type === 'ao_tac') {
          setAppliedCostumeType('ao_tac');
          // Áo Tấc tay thụng rộng hơn
          if (leftSleeveMeshRef.current && rightSleeveMeshRef.current) {
            leftSleeveMeshRef.current.scale.set(1.4, 1.1, 1.4);
            rightSleeveMeshRef.current.scale.set(1.4, 1.1, 1.4);
          }
        } else if (selected.type === 'ngu_than') {
          setAppliedCostumeType('ngu_than');
          // Áo Ngũ Thân tay chẽn gọn gàng
          if (leftSleeveMeshRef.current && rightSleeveMeshRef.current) {
            leftSleeveMeshRef.current.scale.set(1.0, 1.0, 1.0);
            rightSleeveMeshRef.current.scale.set(1.0, 1.0, 1.0);
          }
        } else if (selected.type === 'non_la') {
          setHasNonLa((prev) => !prev);
        } else if (selected.type === 'male') {
          setAppliedGender('male');
        } else if (selected.type === 'female') {
          setAppliedGender('female');
        }
      }

      setIsApplying3D(false);
      setNotificationMsg('✅ Đã đồng bộ hóa dữ liệu 3D và cập nhật Lookbook 2D thành công!');
      setTimeout(() => setNotificationMsg(''), 3500);
    }, 700);
  };

  // ---------------------------------------------------------------------------
  // 5. HÀM ĐỔI MÀU TỪ LOOKBOOK 2D NGƯỢC VỀ 3D (BI-DIRECTIONAL SYNC)
  // ---------------------------------------------------------------------------
  const handleSelectPaletteFrom2D = (pal: typeof LOOKBOOK_PALETTES[0]) => {
    setRobeColor(pal.hex);
    setPantsColor(pal.pantsHex);
  };

  // Lọc asset theo thanh tìm kiếm
  const filteredAssets = AVAILABLE_3D_ASSETS.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0905] text-[#f5efe6] font-['Be_Vietnam_Pro',sans-serif] p-2 sm:p-5 flex flex-col justify-center items-center select-none relative overflow-hidden">
      {/* Background Code Editor Decor (như trong ảnh mẫu) */}
      <div className="absolute inset-0 pointer-events-none opacity-15 font-mono text-[11px] leading-relaxed p-6 text-[#d4af37] overflow-hidden">
        <div>16  import React, &#123; useState, useEffect &#125; from 'react';</div>
        <div>17  import * as THREE from 'three';</div>
        <div>18  // Việt phục Remix - 3D/2D Linked Assets Runtime</div>
        <div>19  function renderCostumeMesh(characterId, textureMap) &#123;</div>
        <div>20    const material = new THREE.MeshStandardMaterial(&#123; color: textureMap.hex &#125;);</div>
        <div>21    return action = $hss.mangte(ud;p.sp * Humanoid!);</div>
        <div>22  &#125;</div>
        <div>23  // Synchronizing Lookbook Visuals</div>
      </div>

      {/* WORKSTATION MACOS WINDOW CONTAINER */}
      <div className="w-full max-w-[1360px] bg-[#1a1720]/95 backdrop-blur-2xl border border-[#3d3248] rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden relative z-10">
        
        {/* MACOS WINDOW HEADER & MENU BAR */}
        <div className="px-4 py-2.5 bg-[#14111a] border-b border-[#2e263a] flex items-center justify-between text-xs text-[#a89ea8]">
          <div className="flex items-center gap-4">
            {/* macOS Traffic Lights */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-inner" />
            </div>

            {/* Menu Items */}
            <div className="flex items-center gap-3.5 text-[#cfc5d4] font-medium text-[11px] ml-2">
              <span className="hover:text-white cursor-pointer">Mode</span>
              <span className="hover:text-white cursor-pointer">Character</span>
              <span className="hover:text-white cursor-pointer">View</span>
              <span className="hover:text-white cursor-pointer">Tab</span>
              <span className="hover:text-white cursor-pointer">Help</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#271f30] text-[#d4af37] border border-[#3e3250] font-mono">
              &lt;&gt; index.hts
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#271f30] text-stone-300 border border-[#3e3250] font-mono flex items-center gap-1">
              Coding app <span className="text-[#a89ea8]">✕</span>
            </span>
          </div>
        </div>

        {/* WORKSTATION SPLIT VIEWPORT (3D VIEW + 3D ASSETS + 2D VIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative">
          
          {/* ================================================================= */}
          {/* 1. KHUNG HIỂN THỊ 3D (3D VIEWPORT) - CỘT TRÁI (5 CỘT)            */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 relative bg-gradient-to-b from-[#1b1722] via-[#14121a] to-[#0d0c12] border-r border-[#2d2538] flex flex-col overflow-hidden">
            {/* 3D View Tag */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="font-semibold text-xs text-white px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                3D View
              </span>
              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`text-[10px] px-2 py-1 rounded-lg border backdrop-blur-md transition-all ${
                  showWireframe ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-black/60 border-white/10 text-stone-400'
                }`}
                title="Bật/Tắt đường lưới đa giác Wireframe"
              >
                Wireframe
              </button>
            </div>

            {/* Three.js Interactive Canvas Container */}
            <div
              ref={mountRef}
              className="w-full h-[640px] cursor-grab active:cursor-grabbing flex items-center justify-center relative"
              title="Kéo chuột để xoay mô hình 3D quanh trục"
            />

            {/* Drag hint under 3D Canvas */}
            <div className="absolute bottom-3 left-4 z-20 text-[10px] text-[#867b8c] flex items-center gap-1.5 pointer-events-none">
              <RotateCw className="w-3 h-3 text-[#d4af37]" />
              <span>Giữ và kéo chuột ngang để xoay 360°</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. BẢNG ĐIỀU KHIỂN "3D ASSETS MANAGER" (CỘT GIỮA - 3 CỘT)        */}
          {/* ================================================================= */}
          <div className="lg:col-span-3 bg-[#17141e] border-r border-[#2d2538] p-4 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[640px]">
            <div className="space-y-3.5">
              {/* Header 3D Assets */}
              <div className="flex items-center justify-between border-b border-[#282136] pb-2">
                <div>
                  <h3 className="font-semibold text-xs text-white">3D Assets</h3>
                  <p className="text-[10px] text-[#9a8e9e]">Download the mesh models.</p>
                </div>
                <button className="text-stone-400 hover:text-white text-xs">✕</button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#110e17] border border-[#2b2338] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Horizontal Asset Cards Preview (như trong ảnh mẫu) */}
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_3D_ASSETS.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAssetId(item.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedAssetId === item.id
                        ? 'bg-[#291f33] border-[#d4af37] text-white shadow-md'
                        : 'bg-[#1b1724] border-[#2a2236] text-stone-400 hover:border-stone-500'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[9px] font-mono text-center truncate w-full">{item.name.split('.')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Asset List Item Selectors */}
              <div className="space-y-1">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-all ${
                      selectedAssetId === asset.id
                        ? 'bg-[#2a2036] text-white font-medium border border-[#d4af37]/40 shadow-sm'
                        : 'text-stone-300 hover:bg-[#201a2c]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{asset.icon}</span>
                      <span className="font-mono text-[11px]">{asset.name}</span>
                    </div>
                    {selectedAssetId === asset.id && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />}
                  </div>
                ))}
              </div>

              {/* Character Controls (Sliders: Rotate, Height, Weight, Pose) */}
              <div className="space-y-2 pt-2 border-t border-[#261f33]">
                <span className="text-[11px] font-semibold text-[#d4af37] block">Character Controls</span>
                
                {/* Rotate Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Rotate</span>
                    <span>{charRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={charRotation}
                    onChange={(e) => setCharRotation(Number(e.target.value))}
                    className="w-full h-1 bg-[#2b233a] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
                  />
                </div>

                {/* Height Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Height</span>
                    <span>{Math.round(charHeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.15"
                    step="0.01"
                    value={charHeight}
                    onChange={(e) => setCharHeight(Number(e.target.value))}
                    className="w-full h-1 bg-[#2b233a] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
                  />
                </div>

                {/* Weight Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Weight</span>
                    <span>{Math.round(charWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.2"
                    step="0.01"
                    value={charWeight}
                    onChange={(e) => setCharWeight(Number(e.target.value))}
                    className="w-full h-1 bg-[#2b233a] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
                  />
                </div>

                {/* Pose Selector */}
                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                  <span>Pose</span>
                  <div className="flex items-center gap-1.5 font-medium text-white">
                    <button
                      onClick={() => setCharPoseIndex((p) => (p > 0 ? p - 1 : 2))}
                      className="hover:text-[#d4af37]"
                    >
                      &lt;
                    </button>
                    <span>{charPoseIndex === 0 ? 'All (A-Pose)' : charPoseIndex === 1 ? 'Holding Hat' : 'Walking'}</span>
                    <button
                      onClick={() => setCharPoseIndex((p) => (p < 2 ? p + 1 : 0))}
                      className="hover:text-[#d4af37]"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>

              {/* Cổ Phục 3D Apply (Color Swatches) */}
              <div className="space-y-2 pt-2 border-t border-[#261f33]">
                <span className="text-[11px] font-semibold text-[#d4af37] block">Cổ Phục 3D Apply</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Áo */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#110e17] border border-[#292136]">
                    <span className="text-stone-300 text-[11px]">Áo</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={robeColor}
                        onChange={(e) => setRobeColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: robeColor }} />
                    </div>
                  </div>

                  {/* Quần */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#110e17] border border-[#292136]">
                    <span className="text-stone-300 text-[11px]">Quần</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={pantsColor}
                        onChange={(e) => setPantsColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: pantsColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setSelectedAssetId('asset_ngu_than')}
                className="w-full py-2 rounded-xl bg-[#261e33] hover:bg-[#342945] text-xs font-semibold text-[#cfc5d6] border border-[#3b2e4d] transition-all"
              >
                SELECT ASSET
              </button>

              <button
                onClick={handleApplySelectedAsset}
                disabled={isApplying3D}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isApplying3D ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang áp dụng 3D...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>APPLY selected 3D asset</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. KHUNG HIỂN THỊ 2D VIEW & GEN Z LOOKBOOK (CỘT PHẢI - 4 CỘT)      */}
          {/* ================================================================= */}
          <div className="lg:col-span-4 bg-[#14111a] p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[640px]">
            {/* Header 2D View */}
            <div className="flex items-center justify-between border-b border-[#282136] pb-3">
              <span className="font-semibold text-xs text-white">2D View</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400">Switch to 2D Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={is2DModeSwitch}
                    onChange={(e) => setIs2DModeSwitch(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#2a2436] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
                </label>
              </div>
            </div>

            {/* Split Lookbook Card & Palette Controller */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              {/* WHITE FRAMED "GEN Z LOOKBOOK" POSTER CARD (8 Cột) */}
              <div className="md:col-span-8 bg-white rounded-xl p-3 text-black shadow-2xl relative overflow-hidden flex flex-col items-center">
                {/* Vertical Side Tag "GEN Z LOOKBOOK" */}
                <div className="absolute top-4 left-2.5 z-10 [writing-mode:vertical-rl] rotate-180 text-[9px] font-black tracking-widest uppercase bg-black text-white px-1.5 py-2.5 rounded-sm">
                  GEN Z LOOKBOOK
                </div>

                {/* Bottom Left Tag "LOOKBOOK" */}
                <div className="absolute bottom-4 left-2.5 z-10 [writing-mode:vertical-rl] rotate-180 text-[8px] font-bold tracking-widest uppercase text-stone-400">
                  LOOKBOOK
                </div>

                {/* 2D Vector Illustration Art of Outfit (Dynamic Colors) */}
                <div className="w-full flex flex-col items-center pt-2 pb-1 pl-4">
                  <svg
                    viewBox="0 0 240 320"
                    className="w-44 h-64 drop-shadow-md transition-all duration-300"
                  >
                    {/* Background shadow */}
                    <ellipse cx="120" cy="305" rx="55" ry="8" fill="#e5e5e5" />

                    {/* Sneaker Shoes (Gen Z modern styling) */}
                    <g>
                      <path d="M92 295 L112 295 L114 304 L88 304 Z" fill="#e29578" />
                      <path d="M88 304 L116 304 L116 308 L86 308 Z" fill="#ffffff" stroke="#333" strokeWidth="1" />
                      <path d="M128 295 L148 295 L152 304 L126 304 Z" fill="#e29578" />
                      <path d="M124 304 L154 304 L154 308 L124 308 Z" fill="#ffffff" stroke="#333" strokeWidth="1" />
                    </g>

                    {/* Silk Pants (Quần lụa dáng suông) */}
                    <g fill={pantsColor} stroke="#222" strokeWidth="1.5">
                      <path d="M90 220 L115 220 L112 295 L88 295 Z" />
                      <path d="M125 220 L150 220 L152 295 L128 295 Z" />
                    </g>

                    {/* Backpack straps (Balo dạo phố Gen Z) */}
                    <path d="M142 110 Q160 145 152 175" stroke="#4a4e69" strokeWidth="5" fill="none" />
                    <circle cx="155" cy="150" r="14" fill="#3d405b" />

                    {/* Main Robe / Áo Ngũ Thân hoặc Áo Tấc (Dynamic Color) */}
                    <g fill={robeColor} stroke="#222" strokeWidth="1.8">
                      {/* Thân áo */}
                      <path d="M96 100 L144 100 L155 240 L85 240 Z" />
                      {/* Vạt chéo lập lĩnh 5 cúc */}
                      <path d="M110 95 L132 120 L125 150 L118 240" fill="none" stroke="#222" strokeWidth="1.2" />
                      {/* Cúc áo vàng */}
                      <circle cx="122" cy="108" r="2" fill="#d4af37" />
                      <circle cx="126" cy="120" r="2" fill="#d4af37" />
                      <circle cx="124" cy="132" r="2" fill="#d4af37" />

                      {/* Tay áo trái */}
                      <path d="M96 100 L76 170 L92 175 L106 120 Z" />
                      {/* Tay áo phải */}
                      <path d="M144 100 L164 170 L148 175 L134 120 Z" />
                    </g>

                    {/* Belt Sash (Đai thắt lưng lụa ngũ sắc) */}
                    <g>
                      <rect x="94" y="148" width="52" height="12" fill="#b02a37" stroke="#222" strokeWidth="1" />
                      {/* Tà dải đai rủ xuống */}
                      <path d="M102 160 L108 230 L118 228 L112 160 Z" fill="#2a6f97" stroke="#222" strokeWidth="1" />
                      <path d="M114 160 L120 220 L128 218 L122 160 Z" fill="#e76f51" stroke="#222" strokeWidth="1" />
                    </g>

                    {/* Bàn tay */}
                    <circle cx="84" cy="173" r="5" fill="#f8d5c2" stroke="#222" strokeWidth="1" />
                    <circle cx="156" cy="173" r="5" fill="#f8d5c2" stroke="#222" strokeWidth="1" />

                    {/* Cổ & Khuôn mặt nhân vật Gen Z */}
                    <rect x="115" y="85" width="10" height="15" fill="#f8d5c2" stroke="#222" strokeWidth="1" />
                    <ellipse cx="120" cy="74" rx="16" ry="19" fill="#f8d5c2" stroke="#222" strokeWidth="1.5" />
                    {/* Tóc */}
                    <path d="M104 74 Q120 52 136 74 Q130 92 120 85 Q110 92 104 74 Z" fill="#222222" />
                    {/* Nụ cười & Mắt */}
                    <ellipse cx="114" cy="73" rx="2" ry="1.5" fill="#222" />
                    <ellipse cx="126" cy="73" rx="2" ry="1.5" fill="#222" />
                    <path d="M117 79 Q120 83 123 79" stroke="#222" strokeWidth="1" fill="none" />

                    {/* Nón Lá 3D Asset (Nón lá bài thơ chóp nhọn) */}
                    {hasNonLa && (
                      <g stroke="#222" strokeWidth="1.5">
                        <polygon points="120,38 72,82 168,82" fill="#f4d06f" />
                        <ellipse cx="120" cy="82" rx="48" ry="12" fill="#e9c46a" />
                        {/* Nan nón */}
                        <line x1="120" y1="38" x2="90" y2="82" stroke="#b08968" strokeWidth="0.8" />
                        <line x1="120" y1="38" x2="120" y2="82" stroke="#b08968" strokeWidth="0.8" />
                        <line x1="120" y1="38" x2="150" y2="82" stroke="#b08968" strokeWidth="0.8" />
                        <ellipse cx="120" cy="62" rx="26" ry="4" fill="none" stroke="#b08968" strokeWidth="0.8" />
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* SIDEBAR RIGHT: PALETTE & FABRIC PATTERN SELECTOR (4 Cột) */}
              <div className="md:col-span-4 space-y-3.5">
                {/* Palette */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase text-stone-300 tracking-wider">Palette</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {LOOKBOOK_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => handleSelectPaletteFrom2D(pal)}
                        className={`w-full h-6 rounded-md border transition-all ${
                          robeColor.toLowerCase() === pal.hex.toLowerCase()
                            ? 'border-white shadow-md scale-105 ring-2 ring-[#d4af37]'
                            : 'border-white/10 hover:border-white/40'
                        }`}
                        style={{ backgroundColor: pal.hex }}
                        title={`${pal.name} - Nhấn để áp dụng cả 3D & 2D`}
                      />
                    ))}
                  </div>
                </div>

                {/* Color Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-stone-300 tracking-wider">Color</span>
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-white/40 shadow-inner"
                    style={{ backgroundColor: robeColor }}
                  />
                </div>

                {/* Fabric Pattern */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase text-stone-300 tracking-wider">Fabric pattern</span>
                  <div className="flex flex-col gap-1.5">
                    {FABRIC_PATTERNS.map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setActivePattern(pat.id)}
                        className={`w-full h-8 rounded-lg border transition-all relative overflow-hidden ${
                          activePattern === pat.id
                            ? 'border-[#d4af37] ring-1 ring-[#d4af37]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ background: pat.previewBg }}
                        title={pat.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lookbook Card Metadata Info */}
            <div className="p-3 rounded-xl bg-[#1b1725] border border-[#2b243a] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                  {appliedCostumeType === 'ngu_than' ? '#LOOKBOOK-NGUTHAN-2026' : '#LOOKBOOK-AOTAC-2026'}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Streetwear
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {appliedCostumeType === 'ngu_than'
                  ? 'Gợi ý phối: Áo Ngũ Thân tay chẽn phối nón lá, túi quai chéo và sneaker retro năng động khi check-in Hồ Gươm, Hội An.'
                  : 'Gợi ý phối: Áo Tấc đại lễ tay thụng phối quần lụa tuyết sa, giữ nếp khiêm nhường chuẩn mực tại Văn Miếu, Hoàng Thành.'}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SUBTITLE CAPTION (NHƯ TRONG ẢNH MẪU) */}
        <div className="py-2.5 px-4 bg-[#110e17] border-t border-[#2a2236] text-center">
          <p className="text-xs sm:text-sm font-medium text-[#f5efe6] tracking-wide">
            Dữ liệu 3D và 2D được liên kết. Thay đổi 3D sẽ cập nhật gợi ý 2D và ngược lại.
          </p>
        </div>
      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1828] border border-[#d4af37] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}
    </div>
  );
}
