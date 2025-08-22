const translations = {
    zh: {
        title: "MedAI - 智能藥物助手",
        brand: "MedAI",
        logoText: "智能藥物助手",
        heading: "重要通知",
        content: {
            welcome: "歡迎使用 MedAI，您的智能藥物助手。在使用本服務前，請仔細閱讀並理解以下重要資訊：",
            points: [
                "本服務不能替代專業醫療建議",
                "MedAI 提供的資訊基於人工智慧分析，不應視為診斷結果",
                "在做出任何醫療決定前，請務必諮詢合格的醫療專業人員",
                "切勿因本平台提供的資訊而忽視專業醫療建議或延誤就醫",
                "所提供的資訊僅供教育用途",
                "請勿在緊急醫療情況下使用本服務"
            ],
            acknowledgment: "繼續使用即表示您確認：",
            acknowledgmentPoints: [
                "您理解此人工智慧服務的局限性",
                "您年滿12歲",
                "您將對基於提供資訊所作的任何決定承擔全部責任"
            ],
            description: "MedAI 採用先進的人工智慧技術分析症狀並提供藥物建議。我們的系統旨在補充而非取代患者與醫生之間的關係。",
            button: "我理解，繼續填寫個人資料"
        }
    },
    en: {
        title: "MedAI - Intelligent Medication Assistant",
        brand: "MedAI",
        logoText: "Intelligent Medication Assistant",
        heading: "Important Notice",
        content: {
            welcome: "Welcome to MedAI, your intelligent medication assistant. Before using this service, please read and understand the following important information:",
            points: [
                "This is not a substitute for professional medical advice",
                "MedAI provides information based on AI analysis and should not be considered a diagnosis",
                "Always consult with a qualified healthcare professional before making any medical decisions",
                "Never disregard professional medical advice or delay seeking it because of something you have read on this platform",
                "The information provided is for educational purposes only",
                "Do not use this service for emergency medical situations"
            ],
            acknowledgment: "By proceeding, you acknowledge that:",
            acknowledgmentPoints: [
                "You understand the limitations of this AI-powered service",
                "You are at least 12 years of age",
                "You take full responsibility for any decisions made based on the information provided"
            ],
            description: "MedAI uses state-of-the-art AI technology to analyze symptoms and provide medication suggestions. Our system is designed to complement, not replace, the relationship between patients and their physicians.",
            button: "I Understand, Proceed to User Information"
        }
    }
};

// DOM元素
const nextBtn = document.getElementById('nextBtn');
const langButtons = document.querySelectorAll('.lang-btn');
const brand = document.querySelector('.brand');
const logoText = document.querySelector('.page-logo p');
const heading = document.querySelector('.card h2');
const content = document.querySelector('.card-content');
const title = document.title;

// 當前語言
let currentLanguage = 'zh';

// 初始化頁面翻譯
function translatePage(lang) {
    const langData = translations[lang];
    
    // 更新頁面標題
    document.title = langData.title;
    
    // 更新品牌
    brand.innerHTML = `<i class="fas fa-pills"></i> ${langData.brand}`;
    
    // 更新標誌文本
    logoText.textContent = langData.logoText;
    
    // 更新標題
    heading.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${langData.heading}`;
    
    // 更新內容
    let contentHTML = `<p>${langData.content.welcome}</p><ul>`;
    
    langData.content.points.forEach(point => {
        contentHTML += `<li><strong>${point}</strong></li>`;
    });
    
    contentHTML += `</ul><p><strong>${langData.content.acknowledgment}</strong></p><ul>`;
    
    langData.content.acknowledgmentPoints.forEach(point => {
        contentHTML += `<li>${point}</li>`;
    });
    
    contentHTML += `</ul><p>${langData.content.description}</p>`;
    
    content.innerHTML = contentHTML;
    
    // 更新按鈕
    nextBtn.innerHTML = `<i class="fas fa-arrow-right"></i> ${langData.content.button}`;
    
    // 更新活動語言按鈕
    langButtons.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 保存語言選擇
    localStorage.setItem('medaiLanguage', lang);
    currentLanguage = lang;
}

// 事件監聽器
nextBtn.addEventListener('click', () => {
    window.location.href = 'function-select.html';
});

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        translatePage(btn.dataset.lang);
    });
});

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('medaiLanguage') || 'zh';
    translatePage(savedLanguage);
});