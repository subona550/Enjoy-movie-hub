/*** 
 * AETHERIA ARCADE - REALTIME CYBER REFLEX ENGINE (v8.0.0 PRODUCTION)
 * - 100% Policy-Compliant for Adsgram & Telegram Mini Apps
 * - Wave-Based Reflex Grid (Cyan Nodes, Gold Targets & Red Glitch Hazards)
 * - Natural Gaming Placements: Second Chance Shield & Emergency Power Refills
 * - Armory Hardware Modules & Realtime Firebase Leaderboard
 */

// ================= ১. কনফিগারেশন ও গেম কনস্ট্যান্ট =================
const BACKEND_API_URL = "https://aetheria-arcade-api.rakibkdbb.workers.dev"; 
const DEFAULT_BOT_USERNAME = "AetheriaArcadeBot"; 
let ADSGRAM_BLOCK_ID = "26019"; // Adsgram Block ID

// ================= ২. সাইবার ওয়েব অডিও সিন্থেসাইজার =================
let audioCtx = null;
let isAudioEnabled = localStorage.getItem('arcade_audio_enabled') !== 'false';

function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function toggleAudioFx() {
    isAudioEnabled = !isAudioEnabled;
    localStorage.setItem('arcade_audio_enabled', isAudioEnabled);
    updateAudioIcon();
    if (isAudioEnabled) {
        playHitSound();
        showToast(currentLang === 'bn' ? 'অডিও এফেক্ট সক্রিয়' : 'Audio SFX Enabled');
    } else {
        showToast(currentLang === 'bn' ? 'অডিও এফেক্ট মিউট করা হয়েছে' : 'Audio SFX Muted');
    }
}

function updateAudioIcon() {
    const icon = document.getElementById('audio-icon');
    if (!icon) return;
    if (isAudioEnabled) {
        icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    } else {
        icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
    }
}

function playClickSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) { }
}

function playHitSound(isGold = false) {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isGold ? 'sine' : 'triangle';
        const startFreq = isGold ? 800 : 450 + Math.random() * 200;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(isGold ? 1400 : 900, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) { }
}

function playHazardSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
    } catch (e) { }
}

function playRewardSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(1040, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) { }
}

// ================= ৩. টেলিগ্রাম ওয়েবঅ্যাপ ও ব্যাক বাটন নেভিগেশন =================
const tg = window.Telegram?.WebApp;
const openModalStack = [];

function syncModalState() {
    if (openModalStack.length > 0) {
        document.body.style.overflow = 'hidden';
        if (tg?.BackButton) tg.BackButton.show();
    } else {
        document.body.style.overflow = '';
        if (tg?.BackButton) tg.BackButton.hide();
    }
}

function pushModalToStack(modalId, closeFn) {
    const existingIdx = openModalStack.findIndex(m => m.id === modalId);
    if (existingIdx !== -1) openModalStack.splice(existingIdx, 1);
    openModalStack.push({ id: modalId, close: closeFn });
    syncModalState();
}

function removeModalFromStack(modalId) {
    const idx = openModalStack.findIndex(m => m.id === modalId);
    if (idx !== -1) openModalStack.splice(idx, 1);
    syncModalState();
}

if (tg) {
    try {
        tg.ready();
        tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') tg.enableClosingConfirmation();

        const applyTelegramSafeArea = () => {
            const safeTop = tg.safeAreaInset?.top || tg.contentSafeAreaInset?.top || 0;
            const safeBottom = tg.safeAreaInset?.bottom || tg.contentSafeAreaInset?.bottom || 0;
            if (safeTop > 0) document.documentElement.style.setProperty('--safe-top', `${safeTop}px`);
            if (safeBottom > 0) document.documentElement.style.setProperty('--safe-bottom', `${safeBottom}px`);
        };
        applyTelegramSafeArea();
        if (typeof tg.onEvent === 'function') tg.onEvent('safeAreaChanged', applyTelegramSafeArea);

        if (tg.BackButton) {
            tg.BackButton.hide();
            tg.BackButton.onClick(() => {
                if (openModalStack.length > 0) {
                    const topModal = openModalStack.pop();
                    if (topModal && typeof topModal.close === 'function') topModal.close();
                    syncModalState();
                }
            });
        }
    } catch (e) { }
}

function triggerHaptic(type = 'light') {
    try {
        if (!tg?.HapticFeedback) return;
        if (type === 'notification_success') tg.HapticFeedback.notificationOccurred('success');
        else if (type === 'notification_error') tg.HapticFeedback.notificationOccurred('error');
        else tg.HapticFeedback.impactOccurred(type);
    } catch (e) { }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'cyber-toast-item';
    if (type === 'error') toast.classList.add('error-toast');
    toast.innerText = message;
    container.appendChild(toast);
    triggerHaptic(type === 'error' ? 'notification_error' : 'notification_success');

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00FF9D', '#00F0FF', '#BD00FF', '#FFFFFF']
        });
    }
}

// ================= ৪. থিম কন্ট্রোলার =================
let currentTheme = localStorage.getItem('arcade_theme') || 'dark';

function applyTheme() {
    const iconEl = document.getElementById('theme-icon');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (iconEl) iconEl.innerText = '☀️';
        if (tg?.setHeaderColor) tg.setHeaderColor('#F8FAFC');
    } else {
        document.body.classList.remove('light-theme');
        if (iconEl) iconEl.innerText = '🌙';
        if (tg?.setHeaderColor) tg.setHeaderColor('#07090E');
    }
}

function toggleTheme() {
    playClickSound();
    triggerHaptic('light');
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('arcade_theme', currentTheme);
    applyTheme();
    showToast(currentTheme === 'light' 
        ? (currentLang === 'bn' ? 'লাইট মোড সক্রিয়' : 'Light Matrix Active') 
        : (currentLang === 'bn' ? 'ডার্ক মোড সক্রিয়' : 'Dark Matrix Active'));
}

// ================= ৫. ফায়ারবেস ডেটাবেস ইনিট =================
const firebaseConfig = {
  apiKey: "AIzaSyDj-9ox7l6tRO9hYr9chF7MxWwkCTRchEA",
  authDomain: "enjoy-movies-app.firebaseapp.com",
  databaseURL: "https://enjoy-movies-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "enjoy-movies-app",
  storageBucket: "enjoy-movies-app.firebasestorage.app",
  messagingSenderId: "839389874270",
  appId: "1:839389874270:web:b99129ebae43d0cdd48ccf",
  measurementId: "G-V9RSVFWBV0"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ================= ৬. দ্বিভাষিক ইঞ্জিন (Language System) =================
let currentLang = localStorage.getItem('arcade_lang') || 'bn';
const bnDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};

function formatNum(val) {
    const s = String(val ?? 0);
    if (currentLang !== 'bn') return s;
    return s.replace(/\d/g, d => bnDigits[d]);
}

const translations = {
    en: {
        welcome_badge: "PILOT PROTOCOL",
        welcome_title: "Operator License Active!",
        welcome_desc_1: "Welcome to Aetheria Arena. You received",
        welcome_desc_2: "starter Energy Cells for high-reflex missions!",
        btn_claim_welcome: "Activate Arena Engine",
        user_status: "● Online Operator",
        credits_balance_label: "Total Power Cells",
        pts_currency: "CELLS",
        shield_status_lbl: "🛡️ Core Shield Status",
        current_score_lbl: "SCORE:",
        btn_start_match: "Launch Mission",
        game_objective: "Strike Cyan and Gold targets quickly! Avoid Red Glitches.",
        arcade_hint: "⚡ Increase your combo with fast reflex hits. Glitch taps damage your shields.",
        recharge_title: "⚡ Core Power Cell Recharge",
        recharge_desc: "Recharge your emergency shield and core cells when critical.",
        btn_recharge: "Recharge (+25)",
        tutorial_btn_title: "Operator Tactical Docs",
        tutorial_btn_sub: "Review gameplay strategy and high-score combos",
        btn_watch: "Docs",
        armory_pill: "CYBER ARMORY & UPGRADES",
        armory_headline: "Tactical Gear Vault",
        armory_subtext: "Unlock reflex stabilizers and shield modules using your Power Cells.",
        armory_catalog_title: "Operator Module Catalog",
        skin_desc_1: "Boosts reflex score by +15% per successful strike",
        skin_desc_2: "Target nodes remain stable for 0.4s longer before moving",
        skin_desc_3: "Automatically nullifies 1 hazard glitch tap per mission",
        btn_unlock: "Unlock",
        btn_equipped: "Equipped",
        leaderboard_pill: "ARENA GLOBAL LADDER",
        leaderboard_heading: "Top Operator Rankings",
        leaderboard_subtext: "Global pilots leaderboard and squad challenge hub.",
        btn_copy: "Copy",
        btn_challenge_squad: "Challenge Friends via Squad Link",
        stat_squad_pilots: "Squad Members",
        stat_high_score: "Best Record",
        leaderboard_list_title: "Global Pilot Roster",
        profile_stat_bal: "Power Cells",
        profile_stat_matches: "Missions Run",
        menu_daily_bonus: "7-Day Protocol Vault",
        menu_tg_support: "Official Telegram Community",
        menu_support: "24/7 Operator Helpdesk",
        checkin_modal_title: "7-Day Protocol Drop",
        loading_text: "Syncing arena data...",
        nav_home: "Arena",
        nav_armory: "Armory",
        nav_ranking: "Rankings",
        nav_profile: "Pilot",
        modal_gameover_badge: "SYSTEM BREACHED",
        modal_gameover_title: "Mission Terminated!",
        final_score_label: "Match Score:",
        earned_credits_label: "Energy Cells Earned:",
        high_score_status: "Personal Record:",
        btn_revive: "Second Chance (Shield +1)",
        btn_finish_match: "Submit Score & Conclude",
        checkin_day_text: "Day {day}",
        checkin_streak_text: "Current Streak: {day} Days",
        checkin_claimed_btn: "✅ Today's Protocol Claimed",
        checkin_claim_btn: "⚡ Claim Day {day} Bounty (+{pts} CELLS)",
        home_streak_claimed: "Streak: {day} Days (Claimed)",
        home_streak_ready: "Day {day} Protocol",
        toast_revive_success: "⚡ Shield Restored! Match Continued!",
        toast_full_recharge: "⚡ Core fully recharged! +25 Cells added!",
        toast_unlocked_skin: "🎉 Tactical module unlocked and equipped!",
        toast_not_enough_credits: "⚠️ Insufficient Power Cells in vault!",
        toast_link_copied: "✅ Squad mission invite link copied!"
    },
    bn: {
        welcome_badge: "পাইলট প্রোটোকল",
        welcome_title: "অপারেটর লাইসেন্স সক্রিয়!",
        welcome_desc_1: "আর্টিফিশিয়াল অ্যারেনায় আপনাকে দেওয়া হয়েছে",
        welcome_desc_2: "স্টার্টার এনার্জি সেল!",
        btn_claim_welcome: "অ্যারেনা এক্টিভেট করুন",
        user_status: "● অনলাইন অপারেটর",
        credits_balance_label: "টোটাল এনার্জি সেল",
        pts_currency: "CELLS",
        shield_status_lbl: "🛡️ কোর শিল্ড ও এনার্জি",
        current_score_lbl: "স্কোর:",
        btn_start_match: "মিশন শুরু করুন",
        game_objective: "রেড গ্লিচ নোড এড়িয়ে সঠিক নিয়ন টার্গেটে দ্রুত ট্যাপ করুন",
        arcade_hint: "⚡ দ্রুত লক্ষ্যভেদ করে কম্বো বৃদ্ধি করুন। ভুল ট্যাপে শিল্ড ক্ষতিগ্রস্ত হবে।",
        recharge_title: "⚡ কোর এনার্জি সেল রিফিল",
        recharge_desc: "জরুরি পরিস্থিতিতে অ্যারেনা শিল্ড ও কোর এনার্জি পুনরুদ্ধার করুন।",
        btn_recharge: "রিচার্জ (+২৫)",
        tutorial_btn_title: "অপারেটর ট্যাকটিক্স গাইড",
        tutorial_btn_sub: "হাই-স্কোর রিফ্লেক্স এবং টেকনিক্যাল টিপস দেখুন",
        btn_watch: "ডকস",
        armory_pill: "CYBER ARMORY & UPGRADES",
        armory_headline: "ট্যাকটিক্যাল গিয়ার ভল্ট",
        armory_subtext: "অর্জিত এনার্জি সেল দিয়ে রিফ্লেক্স স্ট্যাবিলাইজার ও শিল্ড মডিউল আপগ্রেড করুন।",
        armory_catalog_title: "অপারেটর মডিউল ক্যাটালগ",
        skin_desc_1: "প্রতিটি সফল হিটে অতিরিক্ত +১৫% স্কোর বুস্ট",
        skin_desc_2: "টার্গেট নোডের অবস্থান ০.৪ সেকেন্ড বেশি স্থির থাকবে",
        skin_desc_3: "ম্যাচে ১টি রেড গ্লিচ ট্যাপের ক্ষতি স্বয়ংক্রিয়ভাবে ব্লক করবে",
        btn_unlock: "আনলক",
        btn_equipped: "ব্যবহৃত",
        leaderboard_pill: "ARENA GLOBAL LADDER",
        leaderboard_heading: "শীর্ষ অপারেটর লিডারবোর্ড",
        leaderboard_subtext: "সর্বোচ্চ স্কোর অর্জনকারী পাইলটদের গ্লোবাল র্যাঙ্ক ও স্কোয়াড তালিকা।",
        btn_copy: "কপি",
        btn_challenge_squad: "বন্ধুদের সাথে স্কোয়াড চ্যালেঞ্জ শেয়ার করুন",
        stat_squad_pilots: "স্কোয়াড মেম্বার",
        stat_high_score: "ব্যক্তিগত সেরা",
        leaderboard_list_title: "গ্লোবাল পাইলট রোস্টার",
        profile_stat_bal: "এনার্জি সেল",
        profile_stat_matches: "সম্পন্ন মিশন",
        menu_daily_bonus: "৭-দিনের প্রোটোকল ভল্ট",
        menu_tg_support: "অফিসিয়াল টেলিগ্রাম কমিউনিটি",
        menu_support: "২৪/৭ অপারেটর হেল্পডেস্ক",
        checkin_modal_title: "৭-দিনের প্রোটোকল ড্রপ",
        loading_text: "ডাটা সিঙ্ক হচ্ছে...",
        nav_home: "অ্যারেনা",
        nav_armory: "আর্মোরি",
        nav_ranking: "র‍্যাঙ্কিং",
        nav_profile: "পাইলট",
        modal_gameover_badge: "SYSTEM BREACHED",
        modal_gameover_title: "অপারেশন ব্যর্থ!",
        final_score_label: "ম্যাচ স্কোর:",
        earned_credits_label: "অর্জিত এনার্জি সেল:",
        high_score_status: "সেরা রেকর্ড:",
        btn_revive: "Second Chance (Shield +1)",
        btn_finish_match: "ফলাফল জমা দিন ও বের হন",
        checkin_day_text: "দিন {day}",
        checkin_streak_text: "বর্তমান স্ট্রিক: {day} দিন",
        checkin_claimed_btn: "✅ আজকের প্রোটোকল সম্পন্ন",
        checkin_claim_btn: "⚡ দিন {day}-এর বাউন্টি নিন (+{pts} CELLS)",
        home_streak_claimed: "স্ট্রিক: {day} দিন (সম্পন্ন)",
        home_streak_ready: "দিন {day} প্রোটোকল",
        toast_revive_success: "⚡ কোর শিল্ড অ্যাক্টিভেটেড! ম্যাচ পুনরায় শুরু হয়েছে!",
        toast_full_recharge: "⚡ এনার্জি কোর ফুল রিচার্জড! +২৫ সেলস যোগ হয়েছে!",
        toast_unlocked_skin: "🎉 ট্যাকটিক্যাল মডিউল আনলক ও সুসজ্জিত হয়েছে!",
        toast_not_enough_credits: "⚠️ ভল্টে পর্যাপ্ত এনার্জি সেল নেই!",
        toast_link_copied: "✅ স্কোয়াড চ্যালেঞ্জ লিংক কপি হয়েছে!"
    }
};

function t(key, params = {}) {
    let str = (translations[currentLang] && translations[currentLang][key]) || translations['en'][key] || key;
    for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), formatNum(v));
    }
    return str;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    const langInd = document.getElementById('lang-indicator');
    if (langInd) langInd.innerText = currentLang === 'en' ? 'BN' : 'EN';

    updateUI();
    renderCheckInGrid();
}

function toggleLanguage() {
    playClickSound();
    triggerHaptic('light');
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    localStorage.setItem('arcade_lang', currentLang);
    applyLanguage();
    showToast(currentLang === 'en' ? 'Switched to English' : 'বাংলা ভাষা সক্রিয় করা হয়েছে');
}

// ================= ৭. ইউজার স্টেট ও ডেটা ইনিশিয়ালাইজেশন =================
let tgUser = tg?.initDataUnsafe?.user;
if (!tgUser || !tgUser.id) {
    let mockId = localStorage.getItem('eh_pilot_id');
    if (!mockId) {
        mockId = 'pilot_' + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('eh_pilot_id', mockId);
    }
    tgUser = {
        id: mockId,
        first_name: "Agent",
        last_name: "Pilot",
        username: "pilot_" + mockId.slice(-4)
    };
}

const userId = tgUser.id.toString();
const userName = (tgUser.first_name || 'Pilot') + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@pilot_' + userId.slice(-4);

let balanceCredits = 100;
let personalHighScore = 0;
let totalMatchesPlayed = 0;
let unlockedUpgrades = JSON.parse(localStorage.getItem('unlocked_skins') || '[]');

let referralCount = 0;
let lastCheckInDate = "";
let checkInStreak = 0;
const checkInRewards = [10, 20, 35, 50, 75, 100, 150];

let tutorialVideoUrl = "https://www.youtube.com";
let telegramCommunityUrl = "https://t.me/";
let myReferralLink = `https://t.me/${DEFAULT_BOT_USERNAME}?start=ref_${userId}`;

// গেম মেকানিক্স ও স্টেট
let isMatchActive = false;
let currentMatchScore = 0;
let arcadeLives = 3;
const MAX_LIVES = 3;
let targetTimer = null;
let currentSpawnInterval = 1250;
let currentCombo = 1;
let currentWave = 1;
let successfulHitsInWave = 0;
let isCurrentTargetGold = false;
let hasRevivedThisMatch = false;
let hasUsedHazardBlock = false;

// ================= ৮. ফায়ারবেস ক্লাউড সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    if (data.tutorialUrl) tutorialVideoUrl = data.tutorialUrl;
    if (data.telegramChannel) telegramCommunityUrl = data.telegramChannel.startsWith('http') ? data.telegramChannel : `https://t.me/${data.telegramChannel.replace('@', '')}`;
    if (data.adsgramBlockId) ADSGRAM_BLOCK_ID = String(data.adsgramBlockId);

    const chLink = document.getElementById('telegram-channel-link');
    if (chLink) chLink.href = telegramCommunityUrl;

    const supLink = document.getElementById('telegram-support-link');
    if (supLink) supLink.href = telegramCommunityUrl;

    const activeBotUser = (data.botUsername || DEFAULT_BOT_USERNAME).replace('@', '').trim();
    myReferralLink = data.appShortName 
        ? `https://t.me/${activeBotUser}/${data.appShortName}?startapp=ref_${userId}`
        : `https://t.me/${activeBotUser}?start=ref_${userId}`;

    const refDisplay = document.getElementById('referral-link-display');
    if (refDisplay) refDisplay.innerText = myReferralLink;
});

function initUser() {
    db.ref('users/' + userId).on('value', (s) => {
        const data = s.val();
        if (!data) {
            db.ref('users/' + userId).set({
                id: userId,
                name: userName,
                username: userUsername,
                balance: 100,
                highScore: 0,
                matchesPlayed: 0,
                createdAt: Date.now()
            });
            openWelcomeModal();
            return;
        }

        balanceCredits = Math.round(Number(data.balance || 0));
        personalHighScore = Math.round(Number(data.highScore || 0));
        totalMatchesPlayed = Number(data.matchesPlayed || 0);
        referralCount = Number(data.referralCount || 0);
        lastCheckInDate = data.lastCheckInDate || "";
        checkInStreak = Number(data.checkInStreak || 0);

        updateUI();
        renderCheckInGrid();
    });

    listenToLeaderboard();
}

// ================= ৯. বাস্তব গেমপ্লে ইঞ্জিন (Wave-Based Reflex Protocol) =================
function startArcadeMatch(e) {
    if (e) e.stopPropagation();
    playClickSound();
    triggerHaptic('medium');

    isMatchActive = true;
    currentMatchScore = 0;
    arcadeLives = MAX_LIVES;
    currentCombo = 1;
    currentWave = 1;
    successfulHitsInWave = 0;
    currentSpawnInterval = 1250;
    hasRevivedThisMatch = false;
    hasUsedHazardBlock = false;

    // Time Dilator মডিউল থাকলে স্পিড ০.৪ সে. সহনশীল থাকবে
    if (unlockedUpgrades.includes('reflex_overload')) {
        currentSpawnInterval += 400;
    }

    document.getElementById('game-overlay-screen').style.display = 'none';
    document.getElementById('arcade-target').style.display = 'flex';
    document.getElementById('btn-revive-game').style.display = 'flex';

    updateArcadeHUD();
    spawnNextTarget();
}

function spawnNextTarget() {
    if (!isMatchActive) return;

    if (targetTimer) clearTimeout(targetTimer);

    const arena = document.getElementById('arcade-interactive-arena');
    const target = document.getElementById('arcade-target');
    const hazard = document.getElementById('arcade-hazard');
    if (!arena || !target) return;

    const maxX = Math.max(20, arena.clientWidth - 70);
    const maxY = Math.max(20, arena.clientHeight - 70);

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    // ২০% সম্ভাবনা গোল্ডেন বোনাস টার্গেট আসার
    isCurrentTargetGold = Math.random() < 0.22;
    const label = document.getElementById('target-label');
    
    if (isCurrentTargetGold) {
        target.classList.add('gold-node');
        if (label) label.innerText = 'GOLD!';
    } else {
        target.classList.remove('gold-node');
        if (label) label.innerText = 'STRIKE';
    }

    // ওয়েভ ২ বা তার উপরে থাকলে মাঝে মাঝে হ্যাজার্ড গ্লিচ স্পন হবে
    if (currentWave >= 2 && Math.random() < 0.45 && hazard) {
        let hX = Math.floor(Math.random() * maxX);
        let hY = Math.floor(Math.random() * maxY);
        // টার্গেটের বেশি কাছে যাতে না বসে
        if (Math.abs(hX - randomX) < 60) hX = (hX + 90) % maxX;
        hazard.style.left = `${hX}px`;
        hazard.style.top = `${hY}px`;
        hazard.style.display = 'flex';
    } else if (hazard) {
        hazard.style.display = 'none';
    }

    // মিস কাউন্টডাউন
    targetTimer = setTimeout(() => {
        handleTargetMiss();
    }, currentSpawnInterval);
}

function handleArcadeBoardClick(e) {
    if (!isMatchActive) return;

    const target = document.getElementById('arcade-target');
    const hazard = document.getElementById('arcade-hazard');

    // হ্যাজার্ড/রেড গ্লিচে ক্লিক করেছে কি না চেক
    if (hazard && hazard.style.display !== 'none') {
        const hRect = hazard.getBoundingClientRect();
        if (
            e.clientX >= hRect.left && e.clientX <= hRect.right &&
            e.clientY >= hRect.top && e.clientY <= hRect.bottom
        ) {
            handleHazardHit(e);
            return;
        }
    }

    // টার্গেটে হিট চেক
    const tRect = target.getBoundingClientRect();
    const isDirectHit = (
        e.clientX >= tRect.left && e.clientX <= tRect.right &&
        e.clientY >= tRect.top && e.clientY <= tRect.bottom
    );

    if (isDirectHit) {
        handleTargetHit(e);
    } else {
        handleTargetMiss();
    }
}

function handleTargetHit(e) {
    playHitSound(isCurrentTargetGold);
    triggerHaptic('light');

    if (targetTimer) clearTimeout(targetTimer);

    // বেস স্কোর গণনা
    let basePts = isCurrentTargetGold ? 30 : 10;
    let scoreAdd = basePts * currentCombo;

    // Overclock Core থাকলে +১৫% বোনাস
    if (unlockedUpgrades.includes('cyber_neon')) {
        scoreAdd = Math.round(scoreAdd * 1.15);
    }

    currentMatchScore += scoreAdd;
    currentCombo = Math.min(8, currentCombo + 1);
    successfulHitsInWave++;

    // প্রতি ৫টি সফল হিটে ওয়েভ বৃদ্ধি এবং স্পিড বৃদ্ধি
    if (successfulHitsInWave >= 5) {
        currentWave++;
        successfulHitsInWave = 0;
        if (currentSpawnInterval > 550) currentSpawnInterval -= 45;
        showToast(currentLang === 'bn' ? `⚡ ওয়েভ ${formatNum(currentWave)} সক্রিয়!` : `⚡ Wave ${currentWave} Active!`);
    }

    createHitSpark(e.clientX, e.clientY, `+${scoreAdd}`);
    updateArcadeHUD();
    spawnNextTarget();
}

function handleHazardHit(e) {
    // যদি Hazard Nullifier আপগ্রেড থাকে এবং এখনো ব্যবহার না হয়ে থাকে
    if (unlockedUpgrades.includes('hazard_shield') && !hasUsedHazardBlock) {
        hasUsedHazardBlock = true;
        showToast(currentLang === 'bn' ? '🛡️ গ্লিচ অ্যাটাক ব্লক হয়েছে!' : '🛡️ Glitch Attack Blocked!');
        playRewardSound();
        const hazard = document.getElementById('arcade-hazard');
        if (hazard) hazard.style.display = 'none';
        return;
    }

    playHazardSound();
    triggerHaptic('notification_error');

    // স্ক্রিন শেক এফেক্ট
    const wrapper = document.getElementById('arcade-wrapper');
    if (wrapper) {
        wrapper.classList.add('screen-shake');
        setTimeout(() => wrapper.classList.remove('screen-shake'), 320);
    }

    currentCombo = 1;
    arcadeLives--;
    updateArcadeHUD();

    createHitSpark(e.clientX, e.clientY, `CRITICAL!`, true);

    if (arcadeLives <= 0) {
        endArcadeMatch();
    } else {
        spawnNextTarget();
    }
}

function handleTargetMiss() {
    if (!isMatchActive) return;
    playHazardSound();
    triggerHaptic('notification_error');

    currentCombo = 1;
    arcadeLives--;
    updateArcadeHUD();

    if (arcadeLives <= 0) {
        endArcadeMatch();
    } else {
        spawnNextTarget();
    }
}

function updateArcadeHUD() {
    const scoreEl = document.getElementById('arcade-current-score');
    if (scoreEl) scoreEl.innerText = formatNum(currentMatchScore);

    const waveEl = document.getElementById('wave-indicator');
    if (waveEl) waveEl.innerText = `WAVE ${formatNum(currentWave)}`;

    const comboEl = document.getElementById('combo-multiplier');
    if (comboEl) comboEl.innerText = `${formatNum(currentCombo)}X COMBO`;

    const livesEl = document.getElementById('display-arcade-lives');
    if (livesEl) livesEl.innerText = `${formatNum(arcadeLives)} / ${formatNum(MAX_LIVES)} ${currentLang === 'bn' ? 'শিল্ড' : 'SHIELDS'}`;

    const gauge = document.getElementById('energy-gauge-bar');
    if (gauge) {
        const percent = Math.max(0, (arcadeLives / MAX_LIVES) * 100);
        gauge.style.width = percent + '%';
        gauge.style.background = percent > 35 ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-emerald))' : 'var(--neon-alert)';
    }
}

function createHitSpark(x, y, text, isDanger = false) {
    const arena = document.getElementById('arcade-interactive-arena');
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    const spark = document.createElement('div');
    spark.className = 'tap-spark';
    if (isDanger) spark.classList.add('danger-spark');
    spark.innerText = text;
    spark.style.left = `${relX}px`;
    spark.style.top = `${relY}px`;
    arena.appendChild(spark);

    setTimeout(() => spark.remove(), 650);
}

function endArcadeMatch() {
    isMatchActive = false;
    if (targetTimer) clearTimeout(targetTimer);

    document.getElementById('arcade-target').style.display = 'none';
    const hazard = document.getElementById('arcade-hazard');
    if (hazard) hazard.style.display = 'none';

    // প্রতি ৪ পয়েন্ট স্কোরে ১টি এনার্জি সেল
    const earnedCredits = Math.floor(currentMatchScore / 4);
    balanceCredits += earnedCredits;
    totalMatchesPlayed++;

    const isNewHigh = currentMatchScore > personalHighScore;
    if (isNewHigh) {
        personalHighScore = currentMatchScore;
        triggerConfetti();
    }

    db.ref('users/' + userId).update({
        balance: balanceCredits,
        highScore: personalHighScore,
        matchesPlayed: totalMatchesPlayed
    });

    document.getElementById('modal-final-score').innerText = formatNum(currentMatchScore);
    document.getElementById('modal-match-credits').innerText = `+${formatNum(earnedCredits)} ${t('pts_currency')}`;
    document.getElementById('modal-best-score').innerText = formatNum(personalHighScore);

    const modal = document.getElementById('game-over-modal');
    if (modal) {
        modal.style.display = 'flex';
        pushModalToStack('game-over-modal', closeGameOverModal);
    }

    updateUI();
}

function closeGameOverModal() {
    playClickSound();
    triggerHaptic('light');
    const modal = document.getElementById('game-over-modal');
    if (modal) modal.style.display = 'none';
    removeModalFromStack('game-over-modal');

    document.getElementById('game-overlay-screen').style.display = 'flex';
}

// ================= ১০. ন্যাচারাল অ্যাড মেকানিক্স (Adsgram Rewarded Placements) =================
async function triggerReviveWithAd() {
    if (hasRevivedThisMatch) return;
    playClickSound();
    triggerHaptic('medium');

    if (typeof window.Adsgram === 'undefined') {
        return showToast(currentLang === 'bn' ? 'অ্যাড নেটওয়ার্ক লোড করা যায়নি!' : 'Ad network failed to load!', 'error');
    }

    try {
        const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        const result = await adController.show().catch(() => ({ done: false }));

        if (result && result.done) {
            hasRevivedThisMatch = true;
            document.getElementById('btn-revive-game').style.display = 'none';
            closeGameOverModal();

            isMatchActive = true;
            arcadeLives = 1;
            updateArcadeHUD();
            document.getElementById('game-overlay-screen').style.display = 'none';
            document.getElementById('arcade-target').style.display = 'flex';

            playRewardSound();
            triggerHaptic('notification_success');
            showToast(t('toast_revive_success'));
            spawnNextTarget();
        } else {
            showToast(currentLang === 'bn' ? 'ব্রডকাস্ট সম্পন্ন না হলে শিল্ড পাওয়া যাবে না।' : 'Broadcast not finished.', 'error');
        }
    } catch (e) {
        showToast(currentLang === 'bn' ? 'কোর সংযোগ ত্রুটি!' : 'Core connection error!', 'error');
    }
}

async function triggerEnergyRefillAd() {
    playClickSound();
    triggerHaptic('medium');

    if (typeof window.Adsgram === 'undefined') {
        return showToast('Ad network offline!', 'error');
    }

    try {
        const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        const res = await adController.show().catch(() => ({ done: false }));

        if (res && res.done) {
            balanceCredits += 25;
            arcadeLives = MAX_LIVES;
            updateArcadeHUD();
            db.ref('users/' + userId).update({ balance: balanceCredits });

            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_full_recharge'));
            updateUI();
        }
    } catch (e) {
        showToast('Error syncing power core', 'error');
    }
}

// ================= ১১. আর্মোরি ও হার্ডওয়্যার মডিউল শপ =================
function purchaseSkin(skinId) {
    playClickSound();
    triggerHaptic('medium');

    if (unlockedUpgrades.includes(skinId)) {
        return showToast(currentLang === 'bn' ? 'মডিউলটি ইতোমধ্যে সক্রিয় রয়েছে!' : 'Module already active!');
    }

    const prices = {
        'cyber_neon': 250,
        'reflex_overload': 500,
        'hazard_shield': 750
    };

    const cost = prices[skinId] || 999;
    if (balanceCredits < cost) {
        return showToast(t('toast_not_enough_credits'), 'error');
    }

    balanceCredits -= cost;
    unlockedUpgrades.push(skinId);
    localStorage.setItem('unlocked_skins', JSON.stringify(unlockedUpgrades));

    db.ref('users/' + userId).update({ balance: balanceCredits });

    playRewardSound();
    triggerConfetti();
    showToast(t('toast_unlocked_skin'));
    updateUI();
}

// ================= ১২. গ্লোবাল পাইলট লিডারবোর্ড =================
function listenToLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    if (!container) return;

    db.ref('users').orderByChild('highScore').limitToLast(25).on('value', snapshot => {
        if (!snapshot.exists()) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">${t('loading_text')}</div>`;
            return;
        }

        const pilots = [];
        snapshot.forEach(child => {
            pilots.push(child.val());
        });

        pilots.reverse();

        let html = '';
        pilots.forEach((pilot, idx) => {
            const initial = (pilot.name?.charAt(0) || 'P').toUpperCase();
            const rankBadge = idx === 0 ? '👑 TOP PILOT' : `#${formatNum(idx + 1)}`;

            html += `
                <div class="roster-item">
                    <div class="roster-left">
                        <div class="roster-avatar" style="${idx === 0 ? 'border-color: #FFB800; color: #FFB800;' : ''}">${escapeHtml(initial)}</div>
                        <div class="roster-details">
                            <span class="roster-title">${escapeHtml(pilot.name || 'Pilot')}</span>
                            <span class="roster-sub">${escapeHtml(pilot.username || '')}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span class="cyber-chip chip-success">${formatNum(pilot.highScore || 0)} PTS</span>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">${rankBadge}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    });
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// ================= ১৩. UI আপডেট ও ডেইলি প্রোটোকল ড্রপ =================
function updateUI() {
    const setElem = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElem('user-balance', formatNum(balanceCredits));
    setElem('profile-stat-balance', `${formatNum(balanceCredits)} ${t('pts_currency')}`);
    setElem('profile-stat-matches', `${formatNum(totalMatchesPlayed)} Matches`);
    setElem('home-ref-count', formatNum(referralCount));
    setElem('profile-best-score-badge', formatNum(personalHighScore));

    // আর্মোরি বাটন স্টেট
    const btn1 = document.getElementById('btn-skin-1');
    if (btn1 && unlockedUpgrades.includes('cyber_neon')) {
        btn1.innerText = t('btn_equipped');
        btn1.classList.add('chip-success');
    }

    const btn2 = document.getElementById('btn-skin-2');
    if (btn2 && unlockedUpgrades.includes('reflex_overload')) {
        btn2.innerText = t('btn_equipped');
        btn2.classList.add('chip-success');
    }

    const btn3 = document.getElementById('btn-skin-3');
    if (btn3 && unlockedUpgrades.includes('hazard_shield')) {
        btn3.innerText = t('btn_equipped');
        btn3.classList.add('chip-success');
    }

    const pId = document.getElementById('profile-page-id');
    if (pId) pId.innerText = `ID: #${formatNum(userId)}`;
}

function openCheckInFullView() {
    playClickSound();
    triggerHaptic('light');
    renderCheckInGrid();
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) {
        sheet.classList.add('active');
        pushModalToStack('checkin-fullview', closeCheckInFullView);
    }
}

function closeCheckInFullView() {
    playClickSound();
    triggerHaptic('light');
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) sheet.classList.remove('active');
    removeModalFromStack('checkin-fullview');
}

function renderCheckInGrid() {
    const grid = document.getElementById('checkin-grid');
    const statusText = document.getElementById('checkin-streak-status');
    const homeStreakText = document.getElementById('home-streak-status');
    const claimBtn = document.getElementById('btn-claim-checkin');

    const today = new Date().toISOString().slice(0, 10);
    const isClaimedToday = (lastCheckInDate.startsWith(today));

    if (statusText) statusText.innerText = t('checkin_streak_text', { day: checkInStreak });
    if (homeStreakText) {
        homeStreakText.innerText = isClaimedToday 
            ? t('home_streak_claimed', { day: checkInStreak })
            : t('home_streak_ready', { day: (checkInStreak % 7) + 1 });
    }

    if (!grid || !claimBtn) return;

    let html = '';
    const currentTargetDay = isClaimedToday ? checkInStreak : ((checkInStreak % 7) + 1);

    for (let i = 1; i <= 7; i++) {
        const rewardPts = checkInRewards[i - 1];
        let itemClass = 'cyber-checkin-tile';

        if (isClaimedToday) {
            if (i <= checkInStreak) itemClass += ' claimed';
        } else {
            if (i < currentTargetDay) itemClass += ' claimed';
            else if (i === currentTargetDay) itemClass += ' active';
        }

        html += `
            <div class="${itemClass}">
                <span class="tile-day-lbl">${t('checkin_day_text', { day: i })}</span>
                <span class="tile-pts-val">+${formatNum(rewardPts)}</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.innerText = t('checkin_claimed_btn');
    } else {
        claimBtn.disabled = false;
        claimBtn.innerText = t('checkin_claim_btn', { day: currentTargetDay, pts: checkInRewards[currentTargetDay - 1] });
    }
}

function claimDailyCheckIn() {
    playClickSound();
    triggerHaptic('medium');

    const today = new Date().toISOString().slice(0, 10);
    if (lastCheckInDate.startsWith(today)) return;

    const currentTargetDay = (checkInStreak % 7) + 1;
    const rewardPts = checkInRewards[currentTargetDay - 1];

    checkInStreak++;
    lastCheckInDate = today;
    balanceCredits += rewardPts;

    db.ref('users/' + userId).update({
        checkInStreak,
        lastCheckInDate,
        balance: balanceCredits
    });

    playRewardSound();
    triggerConfetti();
    triggerHaptic('notification_success');
    showToast(currentLang === 'bn' ? `⚡ +${formatNum(rewardPts)} পাওয়ার সেল যুক্ত হয়েছে!` : `⚡ +${rewardPts} Cells claimed!`);
    renderCheckInGrid();
    updateUI();
}

// ================= ১৪. সোশ্যাল ও স্কোয়াড মিশন শেয়ার =================
function copyReferralLink() {
    playClickSound();
    triggerHaptic('light');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(myReferralLink).then(() => {
            showToast(t('toast_link_copied'));
        });
    } else {
        showToast(t('toast_link_copied'));
    }
}

function shareReferralLink() {
    playClickSound();
    triggerHaptic('light');

    const shareText = currentLang === 'bn' 
        ? `🎮 Aetheria Cyber Arcade-এ আমার সাথে খেলুন! আমার হাই-স্কোর ${formatNum(personalHighScore)} বিট করতে পারবেন?\n\n👇 অ্যারেনা লিংক:\n${myReferralLink}`
        : `🎮 Join me on Aetheria Cyber Arcade! Can you beat my high score of ${personalHighScore}?\n\n👇 Play Link:\n${myReferralLink}`;
    
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`;
    if (tg && typeof tg.openTelegramLink === 'function') tg.openTelegramLink(tgShareUrl);
    else window.open(tgShareUrl, '_blank', 'noopener,noreferrer');
}

function openTutorialVideo() {
    playClickSound();
    triggerHaptic('medium');
    if (tg && typeof tg.openLink === 'function') tg.openLink(tutorialVideoUrl);
    else window.open(tutorialVideoUrl, '_blank', 'noopener,noreferrer');
}

function openWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.display = 'flex';
        pushModalToStack('welcome-modal', closeWelcomeModal);
    }
}

function closeWelcomeModal() {
    playRewardSound();
    triggerHaptic('light');
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.style.display = 'none';
    removeModalFromStack('welcome-modal');
    triggerConfetti();
}

// ================= ১৫. ট্যাব নেভিগেশন ও অ্যাপ বুটস্ট্র্যাপ =================
function switchTab(viewId) {
    playClickSound();
    triggerHaptic('light');

    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.hud-nav-tab').forEach(t => t.classList.remove('active'));

    const activeView = document.getElementById(viewId);
    if (activeView) activeView.classList.add('active');

    const activeNav = document.querySelector(`.hud-nav-tab[onclick*="${viewId}"]`);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    const initialLetter = (userName.charAt(0) || 'P').toUpperCase();
    const hAvatar = document.getElementById('header-avatar');
    const pAvatar = document.getElementById('profile-avatar');
    const hName = document.getElementById('header-name');
    const pName = document.getElementById('profile-page-name');
    const pUname = document.getElementById('profile-page-username');

    if (hAvatar) hAvatar.innerText = initialLetter;
    if (pAvatar) pAvatar.innerText = initialLetter;
    if (hName) hName.innerText = userName;
    if (pName) pName.innerText = userName;
    if (pUname) pUname.innerText = userUsername;

    applyTheme();
    updateAudioIcon();
    applyLanguage();
    initUser();

    // বুট স্ক্রিন স্মুথ লোডার
    let splashProgress = 0;
    const splashTimer = setInterval(() => {
        splashProgress += 30;
        const bar = document.getElementById('splash-progress');
        if (bar) bar.style.width = splashProgress + '%';
        if (splashProgress >= 100) {
            clearInterval(splashTimer);
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(() => splash.remove(), 250);
                }
            }, 100);
        }
    }, 35);
});
