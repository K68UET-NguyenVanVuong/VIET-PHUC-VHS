// ==========================================================================================
// VIỆT PHỤC REMIX - UNITY 3D & C# ENGINE INTEGRATION FRAMEWORK
// File: VietPhucSceneManager.cs
// Mục đích: Quản lý bối cảnh địa danh nổi tiếng (Văn Miếu, Hoàng Thành, Huế, Hội An...), 
// ánh sáng môi trường và hiệu ứng hạt trong Unity
// ==========================================================================================

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace VietPhucRemix.CostumeEngine
{
    [Serializable]
    public class LandmarkEnvironment
    {
        public string landmarkId;
        public string landmarkName;
        public Material skyboxMaterial;
        public Color ambientLightColor;
        public float lightIntensity;
        public ParticleSystem weatherParticles; // Lá vàng rơi / Cánh hoa đào / Đèn hoa đăng
        public Transform cameraSpawnPoint;
    }

    public class VietPhucSceneManager : MonoBehaviour
    {
        [Header("--- DANH SÁCH BỐI CẢNH ĐỊA DANH NỔI TIẾNG (VIETNAM HERITAGE SITES) ---")]
        [SerializeField] private List<LandmarkEnvironment> environments = new List<LandmarkEnvironment>();
        [SerializeField] private Light mainDirectionalLight;
        [SerializeField] private Camera mainOrbitCamera;

        private LandmarkEnvironment currentActiveEnvironment;

        /// <summary>
        /// Chuyển đổi bối cảnh chụp ảnh (Văn Miếu, Hoàng Thành, Đại Nội Huế, Hội An, Hồ Gươm, Dinh Độc Lập)
        /// </summary>
        public void SwitchLandmark(string landmarkId)
        {
            var target = environments.Find(e => e.landmarkId == landmarkId);
            if (target == null) return;

            // Tắt hiệu ứng hạt của bối cảnh cũ
            if (currentActiveEnvironment != null && currentActiveEnvironment.weatherParticles != null)
            {
                currentActiveEnvironment.weatherParticles.Stop();
            }

            currentActiveEnvironment = target;

            // Đổi Skybox & Ánh sáng môi trường
            RenderSettings.skybox = target.skyboxMaterial;
            RenderSettings.ambientLight = target.ambientLightColor;

            if (mainDirectionalLight != null)
            {
                mainDirectionalLight.color = target.ambientLightColor;
                mainDirectionalLight.intensity = target.lightIntensity;
            }

            // Kích hoạt hạt rơi đặc trưng
            if (target.weatherParticles != null)
            {
                target.weatherParticles.Play();
            }

            Debug.Log($"[SCENE MANAGER] Đã tải bối cảnh di sản: {target.landmarkName}");
        }
    }
}
