// 定义API地址和API Key
const apiUrl = "https://api.probex.top/v1/chat/completions";
const apiKey = "sk-AjyTBfmjHsUi5CprmHv4qRdRU6PC0UmsmG7z4HHWEHUkmP0n"; 

// DOM元素
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const scanBtn = document.getElementById('scanBtn');
const preview = document.getElementById('preview');
const result = document.getElementById('result');
const fileInfo = document.getElementById('fileInfo');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const additionalInfo = document.getElementById('additionalInfo');
const aiSubmitBtn = document.getElementById('aiSubmitBtn');
const aiResponse = document.getElementById('aiResponse');
const langChinese = document.getElementById('langChinese');
const langEnglish = document.getElementById('langEnglish');
const responseLoader = document.getElementById('responseLoader');

// 全局變量
let currentFile = null;
let currentLanguage = 'zh'; // 默認中文

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 点击上传
    fileInput.addEventListener('change', handleFileSelect);
    dropArea.addEventListener('click', () => fileInput.click());
    
    // 拖放上传
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    // 扫描按钮
    scanBtn.addEventListener('click', startOCR);
    
    // AI提交按钮
    aiSubmitBtn.addEventListener('click', submitToAI);
    
    // 语言切换
    langChinese.addEventListener('click', () => switchLanguage('zh'));
    langEnglish.addEventListener('click', () => switchLanguage('en'));
});

// 阻止默认行为
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 高亮区域
function highlight() {
    dropArea.style.borderColor = '#2ecc71';
    dropArea.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
}

// 取消高亮
function unhighlight() {
    dropArea.style.borderColor = '#3498db';
    dropArea.style.backgroundColor = 'rgba(52, 152, 219, 0.05)';
}

// 处理文件拖放
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect({ target: fileInput });
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        currentFile = files[0];
        updateFileInfo(currentFile);
        displayPreview(currentFile);
        scanBtn.disabled = false;
    }
}

// 更新文件信息
function updateFileInfo(file) {
    fileInfo.textContent = `文件名: ${file.name} (${formatFileSize(file.size)})`;
    fileInfo.style.color = '#2c3e50';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 显示预览
function displayPreview(file) {
    preview.innerHTML = '';
    
    if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="預覽">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = `<p class="unsupported">不支持文件種類: ${file.type}</p>`;
        scanBtn.disabled = true;
    }
}

// 開始OCR掃描
function startOCR() {
    if (!currentFile) {
        showStatus('請先上傳圖片', 'error');
        return;
    }
    
    const language = document.getElementById('language').value;
    
    // 重置UI
    result.textContent = '';
    progressEl.style.display = 'block';
    progressBar.style.width = '0%';
    aiSubmitBtn.disabled = true;

    showStatus('正在處理圖片...', 'info');

    Tesseract.recognize(
        currentFile,
        language,
        {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    progressBar.style.width = `${progress}%`;
                    showStatus(`識別進度: ${progress}%`, 'info');
                }
            }
        }
    ).then(({ data: { text } }) => {
        result.textContent = text;
        progressBar.style.width = '100%';
        showStatus('文字識別完成!', 'success');
        setTimeout(() => {
            progressEl.style.display = 'none';
            statusEl.style.display = 'none';
        }, 3000);
        
        // 启用AI提交按钮
        aiSubmitBtn.disabled = false;
    }).catch(err => {
        console.error('OCR Error:', err);
        showStatus(`識別錯誤: ${err.message}`, 'error');
        progressEl.style.display = 'none';
    });
}

// 显示状态信息
function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';
}

// 提交给AI识别
function submitToAI() {
    const ocrText = result.textContent;
    const additionalText = additionalInfo.value;
    
    if (!ocrText && !additionalText) {
        showStatus('請先掃描藥物盒或輸入相關信息', 'error');
        return;
    }

    // 構建提示信息
    let prompt = `请分析以下药物信息：
掃描識別藥物訊息: ${ocrText}
補充信息: ${additionalText || "無"}

请提供以下信息：
1. 藥物名稱（通用名和商品名）
2. 主要成分
3. 主要用途和治療症狀
4. 用法用量
5. 注意事項和副作用
6. 儲存條件
7. 其他重要信息`;

    // 显示加载动画
    responseLoader.style.display = 'flex';
    aiResponse.innerHTML = '';
    aiSubmitBtn.disabled = true;
    
    // 请求数据
    const requestData = {
        model: "deepseek-v3",
        messages: [
            {
                role: "system",
                content: currentLanguage === 'zh' ? 
                    "你是一位專業的藥物學家，請根據提供的藥物信息進行專業分析" : 
                    "You are a professional pharmacologist. Please analyze the provided drug information professionally."
            },
            {
                role: "user",
                content: currentLanguage === 'zh' ? prompt : 
                    `Please analyze the following drug information:
Scanned drug information: ${ocrText}
Additional information: ${additionalText || "None"}

Please provide:
1. Drug name (generic and brand names)
2. Active ingredients
3. Main uses and treated symptoms
4. Dosage and administration
5. Precautions and side effects
6. Storage conditions
7. Other important information`
            }
        ],
        stream: true
    };
    
    // 发送请求
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
            throw new Error(`請求失敗，狀態碼: ${response.status}`);
        }
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        
        function readStream() {
            return reader.read().then(({ done, value }) => {
                if (done) {
                    // 完成处理
                    responseLoader.style.display = 'none';
                    aiSubmitBtn.disabled = false;
                    return;
                }
                
                // 解码并处理数据块
                const chunk = decoder.decode(value);
                try {
                    processAIResponseChunk(chunk);
                } catch (e) {
                    console.error("處理響應時出錯:", e);
                }
                
                // 继续读取下一个数据块
                return readStream();
            });
        }
        
        return readStream();
    })
    .catch(error => {
        console.error("請求出錯:", error);
        responseLoader.style.display = 'none';
        aiSubmitBtn.disabled = false;
        aiResponse.innerHTML = `<p class="error">${currentLanguage === 'zh' ? 
            '請求失敗: ' : 'Request failed: '}${error.message}</p>`;
    });
}

// 处理AI响应数据块
function processAIResponseChunk(chunk) {
    // 分割多个JSON对象
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6);
            if (jsonStr === '[DONE]') break;
            
            try {
                const data = JSON.parse(jsonStr);
                const content = data.choices[0]?.delta?.content;
                if (content) {
                    // 将响应内容添加到页面
                    aiResponse.innerHTML += content;
                    // 滚动到底部
                    aiResponse.scrollTop = aiResponse.scrollHeight;
                }
            } catch (e) {
                console.error("解析JSON時出錯:", e);
            }
        }
    }
}

// 切换语言
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // 更新按钮状态
    langChinese.classList.toggle('active', lang === 'zh');
    langEnglish.classList.toggle('active', lang === 'en');
    
    // 更新界面文本
    if (lang === 'zh') {
        document.querySelector('.scanner-header h1').innerHTML = '<i class="fas fa-camera"></i> AI藥物掃描識別系統';
        document.querySelector('.scanner-header p').textContent = '拍攝或上傳藥物包裝照片，獲取詳細藥品信息';
        document.querySelector('.scanner-section:nth-child(1) h2').innerHTML = '<i class="fas fa-camera"></i> 藥物盒掃描';
        document.querySelector('.scanner-section:nth-child(2) h2').innerHTML = '<i class="fas fa-brain"></i> AI藥物識別';
        document.getElementById('additionalInfo').placeholder = '請補充關於此藥物的任何信息（如使用方式、症狀等）';
        document.querySelector('.ai-header h3').innerHTML = '<i class="fas fa-flask"></i> AI分析結果';
        aiSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交AI識別';
        document.querySelector('.upload-area p').textContent = '拖放藥物盒圖片到此區域或點擊上傳';
        scanBtn.innerHTML = '<i class="fas fa-search"></i> 開始掃描';
        document.querySelector('.language-group label').innerHTML = '<i class="fas fa-language"></i> 辨識語言:';
        document.querySelector('.ai-input-group label').innerHTML = '<i class="fas fa-info-circle"></i> 補充信息:';
        document.querySelector('.ai-response p').textContent = '掃描藥品後，AI將提供詳細分析結果...';
    } else {
        document.querySelector('.scanner-header h1').innerHTML = '<i class="fas fa-camera"></i> AI Medication Scanner';
        document.querySelector('.scanner-header p').textContent = 'Take or upload a photo of medication packaging to get detailed drug information';
        document.querySelector('.scanner-section:nth-child(1) h2').innerHTML = '<i class="fas fa-camera"></i> Medicine Box Scan';
        document.querySelector('.scanner-section:nth-child(2) h2').innerHTML = '<i class="fas fa-brain"></i> AI Drug Identification';
        document.getElementById('additionalInfo').placeholder = 'Please add any additional information about this medicine (e.g., usage, symptoms)';
        document.querySelector('.ai-header h3').innerHTML = '<i class="fas fa-flask"></i> AI Analysis Result';
        aiSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit to AI';
        document.querySelector('.upload-area p').textContent = 'Drag and drop medicine box image here or click to upload';
        scanBtn.innerHTML = '<i class="fas fa-search"></i> Start Scan';
        document.querySelector('.language-group label').innerHTML = '<i class="fas fa-language"></i> Recognition Language:';
        document.querySelector('.ai-input-group label').innerHTML = '<i class="fas fa-info-circle"></i> Additional Info:';
        document.querySelector('.ai-response p').textContent = 'After scanning the medication, AI will provide detailed analysis...';
    }
}