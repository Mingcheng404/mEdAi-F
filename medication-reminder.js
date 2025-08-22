// medication-reminder.js
// 翻译对象
const translations = {
    en: {
        back: "Back",
        chinese: "中文",
        english: "EN",
        medication_reminder: "Medication Reminder",
        set_medication_plan: "Set your medication plan",
        medication_settings: "Medication Settings",
        medication_name_optional: "Medication Name (Optional)",
        doses_per_day: "Doses Per Day",
        times: "times",
        dose_interval: "Dose Interval",
        seconds: "seconds",
        test: "test",
        hour: "hour",
        hours: "hours",
        start_time: "Start Time",
        start_medication_reminder: "Start Medication Reminder",
        medication_reminder_status: "Medication Reminder Status",
        unspecified_medication: "Unspecified Medication",
        total_doses: "Total Doses",
        completed: "Completed",
        remaining: "Remaining",
        next_dose_countdown: "Next Dose Countdown",
        estimated_time: "Estimated Time",
        medication_history: "Medication History",
        mark_as_taken: "Mark as Taken",
        restart_medication: "Restart Medication",
        reset_reminder: "Reset Reminder",
        medication_time: "Medication Time!",
        take_medication_prompt: "Please take your medication promptly",
        close: "Close",
        taken: "Taken",
        planned_time: "Planned Time",
        restart: "Restart",
        all_medication_completed: "All medication completed",
        restart_tomorrow: "Please restart tomorrow",
        reset_success: "Reset successful"
    },
    zh: {
        back: "返回",
        chinese: "中文",
        english: "EN",
        medication_reminder: "用藥提醒",
        set_medication_plan: "設置您的用藥計劃",
        medication_settings: "用藥設置",
        medication_name_optional: "藥物名稱（可選）",
        doses_per_day: "每日用藥次數",
        times: "次",
        dose_interval: "用藥間隔",
        seconds: "秒",
        test: "測試",
        hour: "小時",
        hours: "小時",
        start_time: "開始時間",
        start_medication_reminder: "開始用藥提醒",
        medication_reminder_status: "用藥提醒狀態",
        unspecified_medication: "未指定藥物",
        total_doses: "總用藥次數",
        completed: "已完成",
        remaining: "剩餘次數",
        next_dose_countdown: "下次用藥倒計時",
        estimated_time: "預計時間",
        medication_history: "用藥記錄",
        mark_as_taken: "標記為已用藥",
        restart_medication: "重新繼續服藥",
        reset_reminder: "重置提醒",
        medication_time: "用藥時間到！",
        take_medication_prompt: "請及時服用您的藥物",
        close: "關閉",
        taken: "已用藥",
        planned_time: "計劃時間",
        restart: "重新開始",
        all_medication_completed: "今日用藥已完成",
        restart_tomorrow: "請明日重新開始",
        reset_success: "重置成功"
    }
};

// 当前语言设置
let currentLang = 'zh';

// DOM元素
const startReminderBtn = document.getElementById('start-reminder');
const reminderDisplay = document.getElementById('reminder-display');
const totalDosesElement = document.getElementById('total-doses');
const completedDosesElement = document.getElementById('completed-doses');
const remainingDosesElement = document.getElementById('remaining-doses');
const countdownTimer = document.getElementById('countdown-timer');
const nextDoseTime = document.getElementById('next-dose-time');
const markTakenBtn = document.getElementById('mark-taken');
const resetBtn = document.getElementById('reset-reminder');
const restartBtn = document.getElementById('restart-reminder');
const historyItems = document.getElementById('history-items');
const notification = document.getElementById('reminder-notification');
const progressBar = document.getElementById('dose-progress-bar');
const closeNotificationBtn = document.getElementById('close-notification');
const medNameElement = document.getElementById('current-med-name');
const notificationTitle = document.getElementById('notification-title');
const notificationMessage = document.getElementById('notification-message');
const langButtons = document.querySelectorAll('.lang-btn');

// 提醒状态变量
let totalDoses = 0;
let completedDoses = 0;
let doseInterval = 0;
let nextDoseTimestamp = 0;
let countdownInterval = null;
let notificationTimeout = null;
let medicationName = "";
let startTime = "";

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置当前时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('start-time').value = `${hours}:${minutes}`;
    
    // 添加语言切换事件
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新活动按钮
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新语言
            currentLang = button.dataset.lang;
            
            // 翻译整个页面
            translatePage();
        });
    });
    
    // 添加事件监听器
    startReminderBtn.addEventListener('click', startReminder);
    markTakenBtn.addEventListener('click', markAsTaken);
    restartBtn.addEventListener('click', restartMedication);
    resetBtn.addEventListener('click', resetReminder);
    closeNotificationBtn.addEventListener('click', closeNotification);
    
    // 初始翻译
    translatePage();
});

// 开始用药提醒
function startReminder() {
    // 获取用户输入
    const dosesPerDay = parseInt(document.getElementById('doses-per-day').value);
    doseInterval = parseFloat(document.getElementById('dose-interval').value);
    startTime = document.getElementById('start-time').value;
    medicationName = document.getElementById('medication-name').value || 
        document.querySelector('[data-translate="unspecified_medication"]').textContent;
    
    // 验证输入
    if (dosesPerDay <= 0 || doseInterval <= 0) {
        alert(currentLang === 'en' ? 
            'Please enter valid number of doses and interval' : 
            '請輸入有效的用藥次數和間距');
        return;
    }
    
    // 设置状态
    totalDoses = dosesPerDay;
    completedDoses = 0;
    
    // 显示药物名称
    medNameElement.textContent = medicationName;
    
    // 显示提醒状态区域
    reminderDisplay.style.display = 'block';
    
    // 更新统计显示
    updateStatsDisplay();
    
    // 设置第一次用药时间
    setNextDoseTime(startTime);
    
    // 开始倒计时
    startCountdown();
    
    // 滚动到提醒区域
    reminderDisplay.scrollIntoView({ behavior: 'smooth' });
}

// 设置下一次用药时间
function setNextDoseTime(startTime) {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // 创建开始时间对象
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    // 计算下一次用药时间（考虑已完成次数）
    nextDoseTimestamp = startDate.getTime() + (completedDoses * doseInterval * 60 * 60 * 1000);
    
    // 如果时间已过去，则加上间隔直到未来时间
    while (nextDoseTimestamp < now.getTime()) {
        nextDoseTimestamp += doseInterval * 60 * 60 * 1000;
    }
    
    // 显示下一次用药时间
    const nextDoseDate = new Date(nextDoseTimestamp);
    nextDoseTime.textContent = formatTime(nextDoseDate);
}

// 开始倒计时
function startCountdown() {
    // 清除之前的倒计时
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 更新倒计时显示
    updateCountdown();
    
    // 设置每秒更新一次
    countdownInterval = setInterval(updateCountdown, 1000);
}

// 更新倒计时显示
function updateCountdown() {
    const now = Date.now();
    const diff = nextDoseTimestamp - now;
    
    if (diff <= 0) {
        // 时间到，显示通知
        showNotification();
        
        // 清除倒计时
        clearInterval(countdownInterval);
        countdownTimer.textContent = "00:00:00";
        return;
    }
    
    // 计算剩余时间
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    countdownTimer.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 显示用药提醒通知
function showNotification() {
    notificationTitle.textContent = `${medicationName} ${translations[currentLang].medication_time}`;
    notificationMessage.textContent = `${translations[currentLang].take_medication_prompt} ${medicationName}`;
    notification.classList.add('show');
    
    // 播放提示音
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
    
    // 30秒后自动隐藏通知
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 30000);
}

// 标记为已用药
function markAsTaken() {
    // 增加已完成次数
    completedDoses++;
    
    // 更新显示
    updateStatsDisplay();
    
    // 添加历史记录
    addHistoryItem(new Date(), "taken");
    
    // 检查是否完成所有用药
    if (completedDoses >= totalDoses) {
        // 完成所有用药
        clearInterval(countdownInterval);
        countdownTimer.textContent = translations[currentLang].all_medication_completed;
        nextDoseTime.textContent = translations[currentLang].restart_tomorrow;
        markTakenBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        return;
    }
    
    // 设置下一次用药时间
    nextDoseTimestamp += doseInterval * 60 * 60 * 1000;
    
    // 更新下一次用药时间显示
    const nextDoseDate = new Date(nextDoseTimestamp);
    nextDoseTime.textContent = formatTime(nextDoseDate);
    
    // 重新开始倒计时
    startCountdown();
    
    // 隐藏通知（如果正在显示）
    notification.classList.remove('show');
}

// 重新继续服药
function restartMedication() {
    // 重置完成次数
    completedDoses = 0;
    
    // 更新显示
    updateStatsDisplay();
    
    // 设置下一次用药时间
    setNextDoseTime(startTime);
    
    // 重新开始倒计时
    startCountdown();
    
    // 切换按钮显示
    markTakenBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    
    // 添加重新开始记录
    addHistoryItem(new Date(), "restart");
}

// 重置提醒
function resetReminder() {
    // 重置状态
    totalDoses = 0;
    completedDoses = 0;
    
    // 清除倒计时
    clearInterval(countdownInterval);
    
    // 隐藏提醒显示区域
    reminderDisplay.style.display = 'none';
    
    // 重置按钮状态
    markTakenBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    markTakenBtn.disabled = false;
    
    // 清空历史记录
    historyItems.innerHTML = '';
    
    // 隐藏通知
    notification.classList.remove('show');
    
    // 显示成功消息
    alert(translations[currentLang].reset_success);
}

// 关闭通知
function closeNotification() {
    notification.classList.remove('show');
}

// 添加历史记录
function addHistoryItem(time, status) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    let statusText, statusIcon;
    if (status === "taken") {
        statusText = translations[currentLang].taken;
        statusIcon = '<i class="fas fa-check-circle"></i>';
    } else if (status === "restart") {
        statusText = translations[currentLang].restart;
        statusIcon = '<i class="fas fa-sync-alt"></i>';
    } else {
        statusText = translations[currentLang].planned_time;
        statusIcon = '<i class="fas fa-clock"></i>';
    }
    
    historyItem.innerHTML = `
        <div class="time">${formatTime(time)}</div>
        <div class="status">${statusIcon} ${statusText}</div>
    `;
    
    historyItems.prepend(historyItem);
    
    // 限制历史记录数量
    if (historyItems.children.length > 10) {
        historyItems.removeChild(historyItems.lastChild);
    }
}

// 更新统计显示
function updateStatsDisplay() {
    totalDosesElement.textContent = totalDoses;
    completedDosesElement.textContent = completedDoses;
    remainingDosesElement.textContent = totalDoses - completedDoses;
    
    // 更新进度条
    const progress = totalDoses > 0 ? (completedDoses / totalDoses) * 100 : 0;
    progressBar.style.width = `${progress}%`;
}

// 格式化时间 (HH:MM:SS)
function formatTime(date) {
    return date.toTimeString().slice(0, 8);
}

// 翻译整个页面
function translatePage() {
    // 更新所有带翻译属性的元素
    const translateElements = document.querySelectorAll('[data-translate]');
    translateElements.forEach(element => {
        const key = element.dataset.translate;
        element.textContent = translations[currentLang][key];
    });
    
    // 更新下拉菜单中的文本
    const doseOptions = document.querySelectorAll('#doses-per-day option');
    doseOptions.forEach(option => {
        const timesText = option.querySelector('span');
        if (timesText) {
            timesText.textContent = translations[currentLang].times;
        }
    });
    
    const intervalOptions = document.querySelectorAll('#dose-interval option');
    intervalOptions.forEach(option => {
        const text = option.textContent;
        if (text.includes('秒')) {
            option.textContent = text.replace('秒', translations[currentLang].seconds)
                                    .replace('測試', translations[currentLang].test);
        } else if (text.includes('小時')) {
            option.textContent = text.replace('小時', translations[currentLang].hours);
        }
    });
    
    // 更新HTML lang属性
    document.documentElement.lang = currentLang;
}