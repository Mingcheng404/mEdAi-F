// 语言翻译对照表
const translations = {
    zh: {
        title: "MedAI - 功能選擇",
        brand: "MedAI",
        logoHeading: "功能選擇",
        logoText: "選擇您需要的服務",
        aiAssistant: "AI藥物助手",
        aiDescription: "描述症狀獲取個性化藥物建議  ",
        medicationReminder: "用藥提醒",
        reminderCardDesc: "設置和管理您的用藥計劃",
        medicationScanner: "AI藥物掃描器",
        scannerDescription: "掃描藥物盒獲取藥物信息",
        reminderLink: "用藥提醒",
        scannerLink: "藥物掃描"
    },
    en: {
        title: "MedAI - Function Select",
        brand: "MedAI",
        logoHeading: "Function Select",
        logoText: "Select the service you need",
        aiAssistant: "AI Medication Assistant",
        aiDescription: "Describe symptoms for personalized medication suggestions",
        medicationReminder: "Medication Reminder",
        reminderCardDesc: "Set up and manage your medication schedule",
        medicationScanner: "AI Medication Scanner",
        scannerDescription: "Scan medicine box to get drug information",
        reminderLink: "Medication Reminder",
        scannerLink: "Medicine Scanner"
    }
};

// DOM元素
const langButtons = document.querySelectorAll('.lang-btn');
const brand = document.querySelector('.brand');
const logoHeading = document.querySelector('.page-logo h1');
const logoText = document.querySelector('.page-logo p');
const aiAssistantCard = document.getElementById('aiAssistant');
const aiTitle = aiAssistantCard.querySelector('h3');
const aiDescription = aiAssistantCard.querySelector('p');
const medicationReminderCard = document.getElementById('medicationReminder');
const reminderTitle = medicationReminderCard.querySelector('h3');
const reminderDescription = medicationReminderCard.querySelector('p');
const medicationScannerCard = document.getElementById('medicationScanner');
const scannerTitle = medicationScannerCard.querySelector('h3');
const scannerDescription = medicationScannerCard.querySelector('p');
const navLinks = document.querySelectorAll('.nav-link span');
const reminderQuickLinks = document.querySelectorAll('.reminder-quick-link span');

// 当前语言
let currentLanguage = 'zh';

// 初始化页面翻译
function translatePage(lang) {
    const langData = translations[lang];
    
    // 更新页面标题
    document.title = langData.title;
    
    // 更新品牌
    brand.innerHTML = `<i class="fas fa-pills"></i> ${langData.brand}`;
    
    // 更新标志
    logoHeading.innerHTML = `<i class="fas fa-th"></i> ${langData.logoHeading}`;
    logoText.textContent = langData.logoText;
    
    // 更新功能卡片
    aiTitle.textContent = langData.aiAssistant;
    aiDescription.textContent = langData.aiDescription;
    
    // 更新用药提醒卡片
    reminderTitle.textContent = langData.medicationReminder;
    reminderDescription.textContent = langData.reminderCardDesc;
    
    // 更新药物扫描卡片
    scannerTitle.textContent = langData.medicationScanner;
    scannerDescription.textContent = langData.scannerDescription;
    
    // 更新导航链接
    navLinks.forEach((link, index) => {
        if (index === 0) link.textContent = langData.reminderLink;
        if (index === 1) link.textContent = langData.scannerLink;
    });
    
    // 更新快速链接
    reminderQuickLinks.forEach((link, index) => {
        if (index === 0) link.textContent = langData.reminderLink;
        if (index === 1) link.textContent = langData.scannerLink;
    });
    
    // 更新活动语言按钮
    langButtons.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 保存语言选择
    localStorage.setItem('medaiLanguage', lang);
    currentLanguage = lang;
}

// 事件监听器
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        translatePage(btn.dataset.lang);
    });
});

aiAssistantCard.addEventListener('click', () => {
    window.location.href = 'user-info.html';
});

medicationReminderCard.addEventListener('click', () => {
    window.location.href = 'medication-reminder.html';
});

medicationScannerCard.addEventListener('click', () => {
    window.location.href = 'medication-scanner.html';
});

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('medaiLanguage') || 'zh';
    translatePage(savedLanguage);
});