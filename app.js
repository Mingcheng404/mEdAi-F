// 語言翻譯對照表
const translations = {
    zh: {
        title: "MedAI - AI藥物助手",
        brand: "MedAI",
        backButton: "返回個人資料",
        appTitle: "AI藥物助手",
        appSubtitle: "描述您的症狀，獲取基於先進AI技術的個性化藥物建議",
        aiHeader: "向我們的AI諮詢藥物信息",
        inputPlaceholder: "描述您的症狀或諮詢藥物信息...",
        submitButton: "提交",
        newChatButton: "新對話",
        age: "年齡",
        gender: "性別",
        allergies: "過敏史",
        conditions: "健康狀況",
        medications: "當前用藥",
        none: "無",
        chatIntroduction: "👋 您好！我是MedAI，您的智能藥物助手。我可以幫助您：",
        chatPoints: [
            "根據症狀提供藥物建議",
            "提供劑量建議",
            "提供副作用信息",
            "檢查藥物相互作用"
        ],
        chatPrompt: "請描述您的症狀或詢問有關藥物的問題。"
    },
    en: {
        title: "MedAI - AI Medication Assistant",
        brand: "MedAI",
        backButton: "Back to Profile",
        appTitle: "AI Medication Assistant",
        appSubtitle: "Describe your symptoms and receive personalized medication suggestions powered by advanced AI technology",
        aiHeader: "Ask our AI about medications",
        inputPlaceholder: "Describe your symptoms or ask about medications...",
        submitButton: "Submit",
        newChatButton: "New Conversation",
        age: "Age",
        gender: "Gender",
        allergies: "Allergies",
        conditions: "Conditions",
        medications: "Medications",
        none: "None",
        chatIntroduction: "👋 Hello! I'm MedAI, your intelligent medication assistant. I can help with:",
        chatPoints: [
            "Medication suggestions based on symptoms",
            "Dosage recommendations",
            "Side effect information",
            "Drug interaction checks"
        ],
        chatPrompt: "Please describe your symptoms or ask a question about medications."
    }
};

// 全局狀態管理
const state = {
    userProfile: {},
    chatHistory: [],
    currentLanguage: 'zh',
    isProcessing: false,
    lastAiMessageId: null
};

// DOM元素
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const userInput = document.getElementById('userInput');
const loader = document.getElementById('loader');
const chatContainer = document.getElementById('chatContainer');
const userProfile = document.getElementById('userProfile');
const langButtons = document.querySelectorAll('.lang-btn');
const newChatBtn = document.getElementById('newChatBtn');
const brand = document.querySelector('.brand');
const appTitle = document.querySelector('.app-title h1');
const appSubtitle = document.querySelector('.app-title p');
const aiHeader = document.querySelector('.ai-header h2');
const title = document.title;

// 初始化頁面翻譯
function translatePage(lang) {
    const langData = translations[lang];
    
    // 更新頁面元素
    document.title = langData.title;
    brand.innerHTML = `<i class="fas fa-pills"></i> ${langData.brand}`;
    backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> ${langData.backButton}`;
    appTitle.textContent = langData.appTitle;
    appSubtitle.textContent = langData.appSubtitle;
    aiHeader.innerHTML = `<i class="fas fa-robot"></i> ${langData.aiHeader}`;
    userInput.placeholder = langData.inputPlaceholder;
    submitBtn.textContent = langData.submitButton;
    newChatBtn.innerHTML = `<i class="fas fa-plus"></i> ${langData.newChatButton}`;
    
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
    state.currentLanguage = lang;
    
    // 更新用戶資料顯示
    displayUserProfile();
    
    // 更新初始聊天消息
    const introMessage = document.querySelector('.ai-message');
    if (introMessage) {
        introMessage.innerHTML = `
            <p>${langData.chatIntroduction}</p>
            <ul>
                ${langData.chatPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <p>${langData.chatPrompt}</p>
        `;
    }
}

// 顯示用戶資料
function displayUserProfile() {
    const langData = translations[state.currentLanguage];
    
    if (!state.userProfile.age) return;
    
    let profileHTML = '';
    
    if (state.userProfile.age) {
        profileHTML += `
            <div class="profile-item">
                <i class="fas fa-birthday-cake"></i>
                <span>${langData.age}: ${state.userProfile.age}</span>
            </div>
        `;
    }
    
    if (state.userProfile.gender) {
        profileHTML += `
            <div class="profile-item">
                <i class="fas fa-venus-mars"></i>
                <span>${langData.gender}: ${state.userProfile.gender}</span>
            </div>
        `;
    }
    
    if (state.userProfile.allergies) {
        const allergies = state.userProfile.allergies === '無' ? 
            langData.none : state.userProfile.allergies;
        profileHTML += `
            <div class="profile-item">
                <i class="fas fa-allergies"></i>
                <span>${langData.allergies}: ${allergies}</span>
            </div>
        `;
    }
    
    if (state.userProfile.conditions) {
        const conditions = state.userProfile.conditions === '無' ? 
            langData.none : state.userProfile.conditions;
        profileHTML += `
            <div class="profile-item">
                <i class="fas fa-heartbeat"></i>
                <span>${langData.conditions}: ${conditions}</span>
            </div>
        `;
    }
    
    if (state.userProfile.medications) {
        const medications = state.userProfile.medications === '無' ? 
            langData.none : state.userProfile.medications;
        profileHTML += `
            <div class="profile-item">
                <i class="fas fa-pills"></i>
                <span>${langData.medications}: ${medications}</span>
            </div>
        `;
    }
    
    userProfile.innerHTML = profileHTML;
}

// 獲取藥物建議
function getMedicationSuggestion() {
    if (state.isProcessing) {
        alert('請等待當前請求完成');
        return;
    }
    
    const question = userInput.value.trim();
    if (!question) {
        alert('請輸入您的問題或症狀');
        return;
    }
    
    // 添加用戶消息
    addMessageToChat(question, 'user');
    
    // 添加到聊天歷史
    state.chatHistory.push({ role: 'user', content: question });
    
    // 顯示加載動畫
    loader.style.display = 'block';
    state.isProcessing = true;
    submitBtn.disabled = true;
    
    // 使用AI API
    sendMessage(question);
    
    // 清空輸入框
    userInput.value = '';
}

// 發送消息到AI
function sendMessage(question) {
    const apiUrl = "https://api.probex.top/v1/chat/completions";
    const apiKey = "sk-AjyTBfmjHsUi5CprmHv4qRdRU6PC0UmsmG7z4HHWEHUkmP0n";
    
    // 創建包含用戶資料的上下文
    let context = `You are a helpful medical assistant specialized in providing medication recommendations. The user is a ${state.userProfile.age}-year-old ${state.userProfile.gender}.`;
    
    if (state.userProfile.allergies && state.userProfile.allergies !== '無') {
        context += ` The user has allergies to: ${state.userProfile.allergies}.`;
    }
    
    if (state.userProfile.conditions && state.userProfile.conditions !== '無') {
        context += ` The user has medical conditions: ${state.userProfile.conditions}.`;
    }
    
    if (state.userProfile.medications && state.userProfile.medications !== '無') {
        context += ` The user is currently taking: ${state.userProfile.medications}.`;
    }
    
    context += " Provide detailed, accurate, and safe medication suggestions based on the user's symptoms. Always include important safety information and remind users to consult with healthcare professionals. Format your response in markdown.";
    
    // 準備包含聊天歷史的消息
    const messages = [
        { role: "system", content: context },
        ...state.chatHistory.slice(-6) // 包含最近的3次交流
    ];
    
    const requestData = {
        model: "deepseek-v3",
        messages: messages,
        stream: true
    };
    
    // 添加AI輸入指示器
    addTypingIndicator();
    
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullResponse = '';
        let aiMessageId = Date.now().toString();
        
        // 創建AI消息容器
        createAiMessageContainer(aiMessageId);
        state.lastAiMessageId = aiMessageId;
        
        function readStream() {
            return reader.read().then(({ done, value }) => {
                if (done) {
                    // 隱藏加載動畫
                    loader.style.display = 'none';
                    state.isProcessing = false;
                    submitBtn.disabled = false;
                    
                    // 移除輸入指示器
                    document.querySelector('.typing-indicator')?.remove();
                    
                    // 添加到聊天歷史
                    state.chatHistory.push({ role: "assistant", content: fullResponse });
                    
                    return;
                }
                
                const chunk = decoder.decode(value, { stream: true });
                try {
                    // 處理每一行
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    lines.forEach(line => {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            if (data === '[DONE]') return;
                            
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0].delta.content) {
                                    fullResponse += parsed.choices[0].delta.content;
                                    updateAiMessage(aiMessageId, fullResponse);
                                }
                            } catch (e) {
                                console.error('Error parsing JSON:', e);
                            }
                        }
                    });
                } catch (e) {
                    console.error('Error processing chunk:', e);
                }
                
                return readStream();
            });
        }
        
        return readStream();
    })
    .catch(error => {
        console.error("Request error:", error);
        loader.style.display = 'none';
        state.isProcessing = false;
        submitBtn.disabled = false;
        document.querySelector('.typing-indicator')?.remove();
        addMessageToChat(`錯誤: ${error.message}`, 'ai');
    });
}

// 添加消息到聊天界面
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'ai-message';
    messageElement.innerHTML = marked.parse(message);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 添加輸入指示器
function addTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.innerHTML = '<div class="loader-dots"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>';
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 創建AI消息容器
function createAiMessageContainer(id) {
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message';
    messageElement.id = `ai-msg-${id}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageElement;
}

// 更新AI消息內容
function updateAiMessage(id, content) {
    const messageElement = document.getElementById(`ai-msg-${id}`);
    if (messageElement) {
        messageElement.innerHTML = marked.parse(content);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// 事件監聽器
backBtn.addEventListener('click', () => {
    window.location.href = 'function-select.html';
});

submitBtn.addEventListener('click', getMedicationSuggestion);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getMedicationSuggestion();
    }
});

newChatBtn.addEventListener('click', () => {
    const langData = translations[state.currentLanguage];
    
    // 清除聊天歷史但保留初始消息
    chatContainer.innerHTML = `
        <div class="ai-message">
            <p>${langData.chatIntroduction}</p>
            <ul>
                ${langData.chatPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <p>${langData.chatPrompt}</p>
        </div>
    `;
    state.chatHistory = [];
});

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        translatePage(btn.dataset.lang);
    });
});

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    // 加載用戶資料
    const savedProfile = localStorage.getItem('medaiUserProfile');
    if (savedProfile) {
        state.userProfile = JSON.parse(savedProfile);
    }
    
    // 加載語言設置
    const savedLanguage = localStorage.getItem('medaiLanguage') || 'zh';
    translatePage(savedLanguage);
    
    // 顯示用戶資料
    displayUserProfile();
});