// ==========================================================================================
// VIỆT PHỤC REMIX - UNITY 3D & C# ENGINE INTEGRATION FRAMEWORK
// File: VietPhucCostumeController.cs
// Tác quyền: Dự án Việt phục Remix - Dành cho Unity 2022/2023/Unity 6 & WebGL
// ==========================================================================================

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace VietPhucRemix.CostumeEngine
{
    public enum CostumeType
    {
        NhatBinh_TrieuNguyen,    // Áo Nhật Bình triều Nguyễn
        AoTac_NguThanTayThung,   // Áo Tấc tay thụng đại lễ phục
        NguThan_TayChen,         // Áo Ngũ Thân tay chẽn năng động
        AoDai_Lemur_TanThoi      // Áo Dài Lemur & Cô Ba Sài Gòn
    }

    public enum PoseType
    {
        ChapThu_CungDinh,        // Chắp thủ đoan nghiêm
        CamQuat_ThuThai,         // Cầm quạt trầm ngang ngực
        NangTa_ThaoThuot,        // Bước đi khoan thai tà áo bay
        SiTu_DocSach,            // Sĩ tử cầm sách cổ
        GenZ_StreetRetro         // Dạo phố máy ảnh film & sneaker
    }

    public enum BottomType
    {
        QuanLua_BachLap_Trang,   // Quần lụa trắng chuẩn lễ
        QuanLua_DenTuyen,        // Quần lụa đen
        QuanShort_VayNgan        // Phối lỗi (Cultural Violation)
    }

    public enum HeadwearType
    {
        KhanVanhDay_NguSac,      // Khăn vành dây hoàng tộc
        KhanDong_ChuNhat,        // Khăn đóng nam chữ Nhất
        NonLa_BaiTho,            // Nón lá bài thơ
        ManNhung_CachTan,        // Mấn nhung đính ngọc
        TocTuNhien               // Tóc tự nhiên
    }

    [RequireComponent(typeof(Animator))]
    public class VietPhucCostumeController : MonoBehaviour
    {
        [Header("--- THIẾT LẬP CỔ PHỤC CHÍNH (MAIN COSTUME SETTINGS) ---")]
        [SerializeField] private CostumeType currentCostume = CostumeType.NhatBinh_TrieuNguyen;
        [SerializeField] private Color robeColor = new Color(0.79f, 0.23f, 0.23f); // Đỏ Xích Đào
        [SerializeField] private BottomType currentBottom = BottomType.QuanLua_BachLap_Trang;
        [SerializeField] private HeadwearType currentHeadwear = HeadwearType.KhanVanhDay_NguSac;
        [SerializeField] private PoseType currentPose = PoseType.ChapThu_CungDinh;

        [Header("--- ĐIỂM GẮN XƯƠNG PHỤ KIỆN (SOCKET TRANSFORMS) ---")]
        [SerializeField] private Transform headSocket;
        [SerializeField] private Transform rightHandSocket;
        [SerializeField] private Transform leftHandSocket;
        [SerializeField] private Transform waistSocket;

        [Header("--- THIẾT LẬP RENDERER & SHADER (PBR MATERIALS) ---")]
        [SerializeField] private SkinnedMeshRenderer robeRenderer;
        [SerializeField] private SkinnedMeshRenderer bottomRenderer;
        [SerializeField] private MeshRenderer headwearRenderer;
        [SerializeField] private Material silkFabricMaterial;
        [SerializeField] private Material velvetFabricMaterial;

        [Header("--- GIẢ LẬP VẬT LÝ VẢI (CLOTH PHYSICS) ---")]
        [SerializeField] private Cloth robeSleeveCloth; // Vật lý tay thụng lụa mềm
        [SerializeField] private float windTurbulence = 0.4f;

        private Animator anim;
        private MaterialPropertyBlock propBlock;
        private static readonly int ColorProp = Shader.PropertyToID("_BaseColor");
        private static readonly int SheenProp = Shader.PropertyToID("_SilkSheenColor");
        private static readonly int NormalScaleProp = Shader.PropertyToID("_BumpScale");

        private void Awake()
        {
            anim = GetComponent<Animator>();
            propBlock = new MaterialPropertyBlock();
        }

        private void Start()
        {
            ApplyCostumeVisuals();
            SetPose(currentPose);
        }

        /// <summary>
        /// Cập nhật vật liệu PBR và màu sắc tà áo theo thời gian thực
        /// </summary>
        public void ApplyCostumeVisuals()
        {
            if (robeRenderer == null) return;

            robeRenderer.GetPropertyBlock(propBlock);
            propBlock.SetColor(ColorProp, robeColor);

            // Tinh chỉnh độ óng ả đặc trưng của tơ tằm Hà Đông / Gấm ngũ phúc
            Color silkHighlight = Color.Lerp(robeColor, Color.white, 0.25f);
            propBlock.SetColor(SheenProp, silkHighlight);
            propBlock.SetFloat(NormalScaleProp, 1.2f); // Nổi rõ hoa văn mây ngũ sắc / sóng thủy ba

            robeRenderer.SetPropertyBlock(propBlock);

            // Kiểm tra quy tắc văn hóa ngay khi cập nhật trang phục
            ValidateCulturalCompliance();
        }

        /// <summary>
        /// Chuyển đổi tư thế (Pose) cho người mẫu ảo
        /// </summary>
        /// <param name="newPose">Tư thế mong muốn</param>
        public void SetPose(PoseType newPose)
        {
            currentPose = newPose;
            if (anim == null) return;

            switch (newPose)
            {
                case PoseType.ChapThu_CungDinh:
                    anim.CrossFadeInFixedTime("Pose_ChapThu_Royal", 0.3f);
                    break;
                case PoseType.CamQuat_ThuThai:
                    anim.CrossFadeInFixedTime("Pose_HoldFan_Chest", 0.3f);
                    break;
                case PoseType.NangTa_ThaoThuot:
                    anim.CrossFadeInFixedTime("Pose_GracefulWalk_Silk", 0.3f);
                    break;
                case PoseType.SiTu_DocSach:
                    anim.CrossFadeInFixedTime("Pose_Scholar_Book", 0.3f);
                    break;
                case PoseType.GenZ_StreetRetro:
                    anim.CrossFadeInFixedTime("Pose_GenZ_CameraSnap", 0.3f);
                    break;
            }
        }

        /// <summary>
        /// Kiểm tra tính chuẩn mực văn hóa (Cultural Rules Verification)
        /// </summary>
        public bool ValidateCulturalCompliance()
        {
            // Quy tắc 1: Cấm phối quần short / váy ngắn với Áo Tấc & Nhật Bình
            if (currentBottom == BottomType.QuanShort_VayNgan)
            {
                Debug.LogWarning("[CẢNH BÁO VĂN HÓA] Không phối Áo Tấc / Nhật Bình với quần đùi/váy ngắn! Cần dùng Quần lụa dài bạch lạp.");
                return false;
            }

            // Quy tắc 2: Áo Nhật Bình cung đình không đi cùng Nón lá
            if (currentCostume == CostumeType.NhatBinh_TrieuNguyen && currentHeadwear == HeadwearType.NonLa_BaiTho)
            {
                Debug.LogWarning("[CẢNH BÁO ĐIỂN CHẾ] Áo Nhật Bình cung đình phải đi với Khăn Vành Dây hoặc Trâm cài ngọc, không phối nón lá dân gian!");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Hàm xoay 360 độ góc nhìn cho người dùng trải nghiệm trên WebGL/UI
        /// </summary>
        public void RotateModel(float degreesY)
        {
            transform.Rotate(0, degreesY, 0, Space.World);
        }
    }
}
