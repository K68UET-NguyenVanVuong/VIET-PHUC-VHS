// ==========================================================================================
// VIỆT PHỤC REMIX - UNITY 3D & C# ENGINE INTEGRATION FRAMEWORK
// File: CulturalRuleValidator.cs
// Mục đích: Hệ thống giám sát và cảnh báo sai lệch văn hóa cổ phục thời gian thực trong Unity
// ==========================================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace VietPhucRemix.CostumeEngine
{
    [Serializable]
    public struct RuleViolationReport
    {
        public string ruleId;
        public string ruleTitle;
        public string educationalMessage;
        public string historicalReference;
        public bool isFatalError;
    }

    public class CulturalRuleValidator : MonoBehaviour
    {
        public static CulturalRuleValidator Instance { get; private set; }

        public event Action<List<RuleViolationReport>> OnViolationsDetected;
        public event Action OnCostumeFullyCompliant;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        /// <summary>
        /// Phân tích toàn diện trang phục đang mặc và xuất báo cáo kiểm định văn hóa
        /// </summary>
        public List<RuleViolationReport> EvaluateOutfit(
            CostumeType costume,
            BottomType bottom,
            HeadwearType headwear,
            string locationName,
            bool hasSunglassesInSanctuary)
        {
            var reports = new List<RuleViolationReport>();

            // RULE 1: Quần đùi / Váy ngắn với Cổ phục
            if (bottom == BottomType.QuanShort_VayNgan)
            {
                reports.Add(new RuleViolationReport
                {
                    ruleId = "RULE_NO_SHORTS",
                    ruleTitle = "Sai lệch: Phối Cổ phục trang trọng với Quần ngắn / Váy đùi",
                    educationalMessage = "Cổ phục Việt Nam mang tinh thần đoan trang, kín đáo theo đạo học phương Đông. Mặc quần ngắn phá vỡ tỷ lệ và ý nghĩa của tà áo ngũ thân.",
                    historicalReference = "Định chế triều Nguyễn (1744 - 1837) quy định y phục lễ nghi bắt buộc phải mặc cùng quần dài lụa bạch lạp.",
                    isFatalError = true
                });
            }

            // RULE 2: Áo Nhật Bình và Nón Lá
            if (costume == CostumeType.NhatBinh_TrieuNguyen && headwear == HeadwearType.NonLa_BaiTho)
            {
                reports.Add(new RuleViolationReport
                {
                    ruleId = "RULE_NO_NON_LA_NHAT_BINH",
                    ruleTitle = "Sai lệch điển chế: Đội nón lá với Áo Nhật Bình",
                    educationalMessage = "Áo Nhật Bình là thường phục hoàng tộc cao quý. Nón lá là vật dụng dân dã che mưa nắng của thứ dân.",
                    historicalReference = "Khâm định Đại Nam hội điển sự lệ quy định Nhật Bình phải vấn Khăn Vành Dây ngũ sắc hoặc dùng Kim ước phát.",
                    isFatalError = true
                });
            }

            // RULE 3: Kính râm tại chốn tôn miếu
            if (hasSunglassesInSanctuary && (locationName.Contains("Văn Miếu") || locationName.Contains("Đền")))
            {
                reports.Add(new RuleViolationReport
                {
                    ruleId = "RULE_SUNGLASSES_SANCTUARY",
                    ruleTitle = "Lưu ý thần thái: Đeo kính râm tại chốn tôn miếu",
                    educationalMessage = "Tại nơi cửa Khổng sân Trình hoặc chốn linh thiêng, nên tháo kính râm để ánh nhìn trang nhã, cung kính.",
                    historicalReference = "Cổ nhân coi trọng 'Tâm chính tắc Dung đoan' khi bước vào nơi phụng tự.",
                    isFatalError = false
                });
            }

            if (reports.Count > 0)
            {
                OnViolationsDetected?.Invoke(reports);
            }
            else
            {
                OnCostumeFullyCompliant?.Invoke();
            }

            return reports;
        }
    }
}
