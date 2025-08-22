// 語言翻譯對照表
const translations = {
    zh: {
        title: "MedAI - 用戶資料",
        brand: "MedAI",
        logoHeading: "用戶資料",
        logoText: "幫助我們提供個性化建議",
        formHeading: "請提供您的個人資訊",
        ageLabel: "年齡",
        genderLabel: "性別",
        genderOptions: [
            "選擇您的性別",
            "男性",
            "女性",
            "其他",
            "不願透露"
        ],
        allergiesLabel: "食物過敏",
        allergiesPlaceholder: "列出任何食物過敏（例如花生、貝類）",
        conditionsLabel: "已知健康狀況",
        conditionsPlaceholder: "列出任何健康狀況（例如高血壓、糖尿病）",
        medicationsLabel: "當前用藥",
        medicationsPlaceholder: "列出當前用藥（例如二甲雙胍、賴諾普利）",
        optionalText: "（用逗號分隔，如無請留空）",
        submitButton: "繼續使用AI助手",
        requiredField: "此為必填欄位",
        invalidAge: "請輸入有效的年齡（12-120歲）"
    },
    en: {
        title: "MedAI - User Profile",
        brand: "MedAI",
        logoHeading: "User Profile",
        logoText: "Help us provide personalized recommendations",
        formHeading: "Tell us about yourself",
        ageLabel: "Age",
        genderLabel: "Gender",
        genderOptions: [
            "Select your gender",
            "Male",
            "Female",
            "Non-binary",
            "Prefer not to say"
        ],
        allergiesLabel: "Food Allergies",
        allergiesPlaceholder: "List any food allergies (e.g. peanuts, shellfish)",
        conditionsLabel: "Known Medical Conditions",
        conditionsPlaceholder: "List any medical conditions (e.g. hypertension, diabetes)",
        medicationsLabel: "Current Medications",
        medicationsPlaceholder: "List current medications (e.g. Metformin, Lisinopril)",
        optionalText: "(Separate with commas, leave blank if none)",
        submitButton: "Continue to AI Assistant",
        requiredField: "This field is required",
        invalidAge: "Please enter a valid age (12-120)"
    }
};

// DOM元素
const userInfoForm = document.getElementById('userInfoForm');
const langButtons = document.querySelectorAll('.lang-btn');
const brand = document.querySelector('.brand');
const logoHeading = document.querySelector('.page-logo h1');
const logoText = document.querySelector('.page-logo p');
const formHeading = document.querySelector('.card h2');
const ageLabel = document.querySelector('label[for="age"]');
const genderLabel = document.querySelector('label[for="gender"]');
const genderSelect = document.getElementById('gender');
const allergiesLabel = document.querySelector('label[for="allergies"]');
const allergiesInput = document.getElementById('allergies');
const conditionsLabel = document.querySelector('label[for="conditions"]');
const conditionsInput = document.getElementById('conditions');
const medicationsLabel = document.querySelector('label[for="medications"]');
const medicationsInput = document.getElementById('medications');
const optionalTexts = document.querySelectorAll('.optional');
const submitButton = document.querySelector('.btn');
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
    
    // 更新標誌
    logoHeading.innerHTML = `<i class="fas fa-user-circle"></i> ${langData.logoHeading}`;
    logoText.textContent = langData.logoText;
    
    // 更新表單標題
    formHeading.innerHTML = `<i class="fas fa-user-edit"></i> ${langData.formHeading}`;
    
    // 更新表單標籤
    ageLabel.innerHTML = `${langData.ageLabel} <span class="required">*</span>`;
    genderLabel.innerHTML = `${langData.genderLabel} <span class="required">*</span>`;
    allergiesLabel.textContent = langData.allergiesLabel;
    conditionsLabel.textContent = langData.conditionsLabel;
    medicationsLabel.textContent = langData.medicationsLabel;
    
    // 更新表單佔位符
    allergiesInput.placeholder = langData.allergiesPlaceholder;
    conditionsInput.placeholder = langData.conditionsPlaceholder;
    medicationsInput.placeholder = langData.medicationsPlaceholder;
    
    // 更新選項文字
    optionalTexts.forEach(el => {
        el.textContent = langData.optionalText;
    });
    
    // 更新性別選項
    genderSelect.innerHTML = '';
    langData.genderOptions.forEach((option, index) => {
        const opt = document.createElement('option');
        opt.value = index === 0 ? "" : option.toLowerCase().replace(/\s+/g, '-');
        opt.textContent = option;
        genderSelect.appendChild(opt);
    });
    
    // 更新提交按鈕
    submitButton.innerHTML = `<i class="fas fa-robot"></i> ${langData.submitButton}`;
    
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

// 保存用戶資料
function saveUserProfile() {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const allergies = document.getElementById('allergies').value;
    const conditions = document.getElementById('conditions').value;
    const medications = document.getElementById('medications').value;
    
    // 基本驗證
    if (!age || !gender) {
        alert(translations[currentLanguage].requiredField);
        return false;
    }
    
    if (age < 12 || age > 120) {
        alert(translations[currentLanguage].invalidAge);
        return false;
    }
    
    // 儲存用戶資料
    const userProfile = {
        age,
        gender,
        allergies: allergies || '無',
        conditions: conditions || '無',
        medications: medications || '無'
    };
    
    localStorage.setItem('medaiUserProfile', JSON.stringify(userProfile));
    
    // 前往AI助手頁面
    window.location.href = 'app.html';
    
    return false;
}

// 事件監聽器
userInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveUserProfile();
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