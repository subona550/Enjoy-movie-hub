/*** 
 * AETHERIA ARCADE - CYBER GAMING & REFLEX ENGINE (v7.1.0 PRODUCTION)
 * - 100% Policy-Compliant for Adsgram & Telegram Mini Apps
 * - Realtime Playable Reflex Matrix Mini-Game Engine
 * - Natural Rewarded Placements: Revive, Energy Refills & Multipliers
 * - In-Game Armory Upgrades & Global Pilot Leaderboard
 */

// ================= ১. কনফিগারেশন ও গেম কনস্ট্যান্ট =================
const BACKEND_API_URL = "https://earnpro84cc.rakibkdbb.workers.dev"; 
const DEFAULT_BOT_USERNAME = "EarnHubProBot"; 
let ADSGRAM_BLOCK_ID = "26019"; // ডিফল্ট বা ফায়ারবেস থেকে সিঙ্ক করা Adsgram Block ID

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
        showToast(currentLang === 'bn' ? 'সাউন্ড সক্রিয় করা হয়েছে' : 'Audio SFX Enabled');
    } else {
        showToast(currentLang === 'bn' ? 'সাউন্ড মিউট করা হয়েছে' : 'Audio SFX Muted');
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

function playHitSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + Math.random() * 250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) { }
}

function playMissSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
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
        welcome_badge: "PILOT AIRDROP",
        welcome_title: "Airdrop Credits Unlocked!",
        welcome_desc_1: "Welcome to Aetheria Arcade. You received",
        welcome_desc_2: "Power Energy Credits as starter booster!",
        btn_claim_welcome: "Activate Energy Core",
        user_status: "● Active Operator",
        credits_balance_label: "Total Power Credits",
        pts_currency: "CREDITS",
        current_score_lbl: "SCORE:",
        btn_start_match: "Start Match",
        game_objective: "Quickly tap neon target nodes to build combo & score",
        arcade_hint: "⚡ Strike nodes! Misses drain core life, hits reward power credits",
        tutorial_btn_title: "Arcade Training Doc",
        tutorial_btn_sub: "Review gameplay tactics & high score guide",
        btn_watch: "Guide",
        section_boosters_title: "Power Chargers & Sponsor Boosters",
        section_boosters_sub: "Stream sponsor broadcasts to recharge your energy instantly",
        badge_overdrive: "SPONSOR OVERDRIVE",
        booster_energy_title: "Instant Core Recharge",
        booster_energy_desc: "Watch a short sponsor broadcast for full lives & bonus credits",
        btn_charge: "Recharge",
        badge_multiplier: "2X MULTIPLIER",
        booster_multiplier_title: "Quantum 2x Boost",
        booster_multiplier_desc: "Double your earned score & credits for the next 3 matches",
        badge_active_buff: "BOOST ACTIVE",
        btn_activate: "Activate",
        armory_pill: "CYBER ARMORY & UPGRADES",
        armory_headline: "Pilot Gear & Customization",
        armory_subtext: "Unlock exclusive cyber skins, reflex boosters, and badges using credits.",
        armory_catalog_title: "Avatar Cores & Power-ups",
        skin_desc_1: "Exclusive neon glowing profile border with +5% reflex score bonus",
        skin_desc_2: "Target nodes remain stable for 0.5s longer before moving",
        btn_unlock: "Unlock",
        btn_equipped: "Equipped",
        leaderboard_pill: "PILOT ARENA LEADERBOARD",
        leaderboard_heading: "Top Operator Rankings",
        leaderboard_subtext: "Global pilots leaderboard and squad challenge hub.",
        btn_copy: "Copy",
        btn_challenge_squad: "Challenge Friends via Squad Link",
        stat_squad_pilots: "Squad Pilots",
        stat_high_score: "Best Score",
        leaderboard_list_title: "Global Pilot Roster",
        profile_stat_bal: "Power Credits",
        profile_stat_matches: "Matches Played",
        menu_daily_bonus: "7-Day Protocol Vault",
        menu_tg_support: "Official Telegram Community",
        menu_support: "24/7 Pilot Help Desk",
        checkin_modal_title: "7-Day Daily Protocol Gifts",
        loading_text: "Accessing core data...",
        nav_home: "Arcade",
        nav_armory: "Armory",
        nav_ranking: "Rankings",
        nav_profile: "Pilot",
        modal_gameover_badge: "MISSION TERMINATED",
        modal_gameover_title: "Pilot Down!",
        final_score_label: "Match Score:",
        earned_credits_label: "Energy Credits Earned:",
        high_score_status: "Personal High Score:",
        btn_revive: "Revive Core (+1 Life via Sponsor)",
        btn_finish_match: "Conclude Match & Deposit Score",
        checkin_day_text: "Day {day}",
        checkin_streak_text: "Current Streak: {day} Days",
        checkin_claimed_btn: "✅ Today's Gift Claimed",
        checkin_claim_btn: "🎁 Claim Day {day} Bounty (+{pts} CREDITS)",
        home_streak_claimed: "Streak: {day} Days (Claimed)",
        home_streak_ready: "Day {day} Gift",
        toast_revive_success: "⚡ Core Revived! Match Resumed!",
        toast_multiplier_active: "⚡ 2X Score Multiplier Active for 3 matches!",
        toast_full_recharge: "⚡ Energy Core fully recharged! +25 Credits!",
        toast_unlocked_skin: "🎉 Upgrade unlocked and equipped!",
        toast_not_enough_credits: "⚠️ Not enough energy credits in vault!",
        toast_link_copied: "✅ Squad invitation link copied!"
    },
    bn: {
        welcome_badge: "পাইলট এয়ারড্রপ",
        welcome_title: "এয়ারড্রপ ক্রেডিট আনলকড!",
        welcome_desc_1: "আর্টিফিশিয়াল আর্কেডে প্রথম লগইনের জন্য আপনি পেয়েছেন",
        welcome_desc_2: "পাওয়ার এনার্জি ক্রেডিট!",
        btn_claim_welcome: "অ্যাক্টিভেট এনার্জি কোর",
        user_status: "● সক্রিয় অপারেটর",
        credits_balance_label: "টোটাল এনার্জি ক্রেডিট",
        pts_currency: "ক্রেডিট",
        current_score_lbl: "স্কোর:",
        btn_start_match: "ম্যাচ শুরু করুন",
        game_objective: "দ্রুত নিয়ন নোডগুলোতে ট্যাপ করে স্কোর ও কম্বো বাড়ান",
        arcade_hint: "⚡ লক্ষ্যভেদ করুন! মিস করলে লাইফ কমবে, হিট করলে ক্রেডিট রিওয়ার্ড পাবেন",
        tutorial_btn_title: "আর্টিফিশিয়াল ট্রেনিং ডক",
        tutorial_btn_sub: "হাই-স্কোর ও আর্কেড র‍্যাঙ্কিং গাইডলাইন দেখুন",
        btn_watch: "গাইড",
        section_boosters_title: "পাওয়ার চার্জার ও স্পনসর বুস্টার",
        section_boosters_sub: "স্পনসর ভিডিও সম্পন্ন করে তাৎক্ষণিক এনার্জি রিফিল পান",
        badge_overdrive: "স্পনসর ওভারড্রাইভ",
        booster_energy_title: "Instant Core Recharge",
        booster_energy_desc: "একটি শর্ট স্পনসর ব্রডকাস্ট দেখে ফুল লাইভস এবং অতিরিক্ত ক্রেডিট নিন",
        btn_charge: "চার্জ",
        badge_multiplier: "২X মাল্টিপ্লায়ার",
        booster_multiplier_title: "Quantum 2x Boost",
        booster_multiplier_desc: "পরবর্তী ৩টি ম্যাচের জন্য আপনার অর্জিত স্কোর ও ক্রেডিট দ্বিগুণ করুন",
        badge_active_buff: "বুস্ট সক্রিয়",
        btn_activate: "অ্যাক্টিভেট",
        armory_pill: "সাইবার আর্মোরি ও আপগ্রেডস",
        armory_headline: "পাইলট গিয়ার ও কাস্টমাইজেশন",
        armory_subtext: "আর্কেড ক্রেডিট দিয়ে নতুন সাইবার স্কিন, রিফ্লেক্স বুস্টার এবং ব্যাজ আনলক করুন।",
        armory_catalog_title: "অ্যাভাট্যার কোর ও পাওয়ার-আপ",
        skin_desc_1: "প্রোফাইলে এক্সক্লুসিভ গ্লোইং বর্ডার এবং +৫% রিফ্লেক্স বোনাস",
        skin_desc_2: "টার্গেট নোডের অবস্থান ০.৫ সেকেন্ড বেশি স্থির থাকবে",
        btn_unlock: "আনলক",
        btn_equipped: "ব্যবহৃত",
        leaderboard_pill: "পাইলট এরিনা লিডারবোর্ড",
        leaderboard_heading: "টপ অপারেটর র‍্যাঙ্কিং",
        leaderboard_subtext: "সর্বোচ্চ স্কোর অর্জনকারী পাইলটদের তালিকা ও স্কোয়াড চ্যালেঞ্জ।",
        btn_copy: "কপি",
        btn_challenge_squad: "বন্ধুদের সাথে স্কোয়াড চ্যালেঞ্জ করুন",
        stat_squad_pilots: "স্কোয়াড পার্টনার",
        stat_high_score: "সর্বোচ্চ স্কোর",
        leaderboard_list_title: "গ্লোবাল পাইলট রোস্টার",
        profile_stat_bal: "পাওয়ার ক্রেডিট",
        profile_stat_matches: "ম্যাচ খেলা হয়েছে",
        menu_daily_bonus: "৭-দিনের স্ট্রিক ভল্ট",
        menu_tg_support: "অফিসিয়াল টেলিগ্রাম কমিউনিটি",
        menu_support: "২৪/৭ পাইলট সাপোর্ট ডেস্ক",
        checkin_modal_title: "৭-দিনের ডেইলি গিফট ড্রপ",
        loading_text: "ডাটা রিড করা হচ্ছে...",
        nav_home: "আর্কেড",
        nav_armory: "আর্মোরি",
        nav_ranking: "র‍্যাঙ্কিং",
        nav_profile: "পাইলট",
        modal_gameover_badge: "মিশন সমাপ্ত",
        modal_gameover_title: "পাইলট ডাউন!",
        final_score_label: "আপনার ম্যাচ স্কোর:",
        earned_credits_label: "অর্জিত এনার্জি ক্রেডিট:",
        high_score_status: "ব্যক্তিগত সর্বোচ্চ স্কোর:",
        btn_revive: "লাইফ রিভাইভ করুন (+১ লাইফ স্পনসর)",
        btn_finish_match: "ম্যাচ সমাপ্ত করে স্কোর জমা দিন",
        checkin_day_text: "দিন {day}",
        checkin_streak_text: "বর্তমান স্ট্রিক: {day} দিন",
        checkin_claimed_btn: "✅ আজকের গিফট নেওয়া হয়েছে",
        checkin_claim_btn: "🎁 দিন {day}-এর উপহার নিন (+{pts} ক্রেডিট)",
        home_streak_claimed: "স্ট্রিক: {day} দিন (ক্লেইমড)",
        home_streak_ready: "দিন {day} গিফট",
        toast_revive_success: "⚡ কোর রিভাইভড! ম্যাচ পুনরায় শুরু হয়েছে!",
        toast_multiplier_active: "⚡ পরবর্তী ৩টি ম্যাচের জন্য ২X স্কোর বুস্ট সক্রিয়!",
        toast_full_recharge: "⚡ এনার্জি কোর ফুল রিচার্জড! +২৫ ক্রেডিট যুক্ত হয়েছে!",
        toast_unlocked_skin: "🎉 আপগ্রেড আনলক ও সিলেক্ট করা হয়েছে!",
        toast_not_enough_credits: "⚠️ ভল্টে পর্যাপ্ত এনার্জি ক্রেডিট নেই!",
        toast_link_copied: "✅ স্কোয়াড ইনভাইটেশন লিংক কপি হয়েছে!"
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

// ================= ৭. ইউজার স্টেট ভেরিয়েবলস =================
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

// গেম ও প্রোফাইল ডাটা
let balanceCredits = 100;
let personalHighScore = 0;
let totalMatchesPlayed = 0;
let unlockedUpgrades = JSON.parse(localStorage.getItem('unlocked_skins') || '[]');
let activeMultiplierMatches = 0; // 2X buff counter

let referralCount = 0;
let lastCheckInDate = "";
let checkInStreak = 0;
const checkInRewards = [10, 15, 25, 40, 60, 80, 150];

let tutorialVideoUrl = "https://www.youtube.com";
let telegramCommunityUrl = "https://t.me/";
let myReferralLink = `https://t.me/${DEFAULT_BOT_USERNAME}?start=ref_${userId}`;

// গেম মেকানিক্স স্টেট
let isMatchActive = false;
let currentMatchScore = 0;
let arcadeLives = 3;
const MAX_LIVES = 3;
let targetTimer = null;
let targetSpawnInterval = 1300; // ms
let currentCombo = 1;
let hasRevivedThisMatch = false;

// ================= ৮. ফায়ারবেস সেটিংস ও ক্লাউড সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    if (data.tutorialUrl || data.youtubeTutorial) tutorialVideoUrl = data.tutorialUrl || data.youtubeTutorial;
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
            // নতুন পাইলট রেজিস্ট্রেশন
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

// ================= ৯. বাস্তব গেমপ্লে ইঞ্জিন (Quantum Target Matrix) =================
function startArcadeMatch(e) {
    if (e) e.stopPropagation();
    playClickSound();
    triggerHaptic('medium');

    isMatchActive = true;
    currentMatchScore = 0;
    arcadeLives = MAX_LIVES;
    currentCombo = 1;
    targetSpawnInterval = 1350;
    hasRevivedThisMatch = false;

    // যদি স্ট্যাবিলাইজার আপগ্রেড থাকে
    if (unlockedUpgrades.includes('reflex_overload')) {
        targetSpawnInterval += 400;
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
    if (!arena || !target) return;

    const maxX = arena.clientWidth - 70;
    const maxY = arena.clientHeight - 70;
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.transform = 'scale(1)';

    // মিস টাইমার: সময়মতো না ছুঁলে লাইফ কমবে
    targetTimer = setTimeout(() => {
        handleTargetMiss();
    }, targetSpawnInterval);
}

function handleArcadeBoardClick(e) {
    if (!isMatchActive) return;

    // টার্গেটে সরাসরি হিট হয়েছে কি না যাচাই
    const target = document.getElementById('arcade-target');
    const targetRect = target.getBoundingClientRect();
    const isDirectHit = (
        e.clientX >= targetRect.left &&
        e.clientX <= targetRect.right &&
        e.clientY >= targetRect.top &&
        e.clientY <= targetRect.bottom
    );

    if (isDirectHit) {
        handleTargetHit(e);
    } else {
        // ফাঁকা জায়গায় ক্লিক করলে মিস
        handleTargetMiss();
    }
}

function handleTargetHit(e) {
    playHitSound();
    triggerHaptic('light');

    if (targetTimer) clearTimeout(targetTimer);

    // স্কোর গণনা
    let scoreAdd = 10 * currentCombo;
    if (activeMultiplierMatches > 0) scoreAdd *= 2;
    if (unlockedUpgrades.includes('cyber_neon')) scoreAdd = Math.round(scoreAdd * 1.05);

    currentMatchScore += scoreAdd;
    currentCombo = Math.min(5, currentCombo + 1);

    // গতি বৃদ্ধি (Speed Progression)
    if (targetSpawnInterval > 650) targetSpawnInterval -= 25;

    createHitSpark(e.clientX, e.clientY, `+${scoreAdd}`);
    updateArcadeHUD();
    spawnNextTarget();
}

function handleTargetMiss() {
    if (!isMatchActive) return;
    playMissSound();
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

    const livesEl = document.getElementById('display-arcade-lives');
    if (livesEl) livesEl.innerText = `${formatNum(arcadeLives)} / ${formatNum(MAX_LIVES)} ${currentLang === 'bn' ? 'লাইভস' : 'LIVES'}`;

    const gauge = document.getElementById('energy-gauge-bar');
    if (gauge) {
        const percent = Math.max(0, (arcadeLives / MAX_LIVES) * 100);
        gauge.style.width = percent + '%';
        gauge.style.background = percent > 35 ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-emerald))' : 'var(--neon-alert)';
    }
}

function createHitSpark(x, y, text) {
    const arena = document.getElementById('arcade-interactive-arena');
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    const spark = document.createElement('div');
    spark.className = 'tap-spark';
    spark.innerText = text;
    spark.style.left = `${relX}px`;
    spark.style.top = `${relY}px`;
    arena.appendChild(spark);

    setTimeout(() => spark.remove(), 600);
}

function endArcadeMatch() {
    isMatchActive = false;
    if (targetTimer) clearTimeout(targetTimer);

    document.getElementById('arcade-target').style.display = 'none';

    // স্কোর থেকে ক্রেডিট আর্নিং
    const earnedCredits = Math.floor(currentMatchScore / 4);
    balanceCredits += earnedCredits;
    totalMatchesPlayed++;

    if (activeMultiplierMatches > 0) activeMultiplierMatches--;

    const isNewHigh = currentMatchScore > personalHighScore;
    if (isNewHigh) {
        personalHighScore = currentMatchScore;
        triggerConfetti();
    }

    // ক্লাউড ডেটাবেস আপডেট
    db.ref('users/' + userId).update({
        balance: balanceCredits,
        highScore: personalHighScore,
        matchesPlayed: totalMatchesPlayed
    });

    // গেম ওভার মোডাল ডাটা
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

// ================= ১০. ADSGRAM রিওয়ার্ডেড ইন্টিগ্রেশন (REVIVE & BOOSTERS) =================
async function triggerReviveWithAd() {
    if (hasRevivedThisMatch) return;
    playClickSound();
    triggerHaptic('medium');

    showToast(currentLang === 'bn' ? '⚡ স্পনসর ব্রডকাস্ট লোড হচ্ছে...' : '⚡ Loading sponsor stream...');

    if (typeof window.Adsgram === 'undefined') {
        return showToast(currentLang === 'bn' ? 'বিজ্ঞাপন লোড করা যায়নি বা অ্যাডব্লকার সক্রিয়!' : 'Ad failed to load or Adblock detected!', 'error');
    }

    try {
        const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        const result = await adController.show().catch(err => ({ done: false }));

        if (result && result.done) {
            hasRevivedThisMatch = true;
            document.getElementById('btn-revive-game').style.display = 'none'; // ১ ম্যাচে মাত্র ১ বার রিভাইভ
            closeGameOverModal();

            // খেলা পুনরায় চালু করা (+১ লাইফ)
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
            showToast(currentLang === 'bn' ? 'ভিডিও সম্পূর্ণ না দেখলে রিভাইভ পাওয়া যাবে না।' : 'Stream not finished.', 'error');
        }
    } catch (e) {
        showToast(currentLang === 'bn' ? 'বিজ্ঞাপন লোড ত্রুটি!' : 'Ad stream error!', 'error');
    }
}

async function triggerEnergyRefillAd() {
    playClickSound();
    triggerHaptic('medium');

    if (typeof window.Adsgram === 'undefined') {
        return showToast('Adblocker detected!', 'error');
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
        showToast('Error loading sponsor stream', 'error');
    }
}

async function triggerMultiplierAd() {
    playClickSound();
    triggerHaptic('medium');

    if (typeof window.Adsgram === 'undefined') {
        return showToast('Adblocker detected!', 'error');
    }

    try {
        const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        const res = await adController.show().catch(() => ({ done: false }));

        if (res && res.done) {
            activeMultiplierMatches += 3;
            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_multiplier_active'));
        }
    } catch (e) {
        showToast('Error loading sponsor stream', 'error');
    }
}

// ================= ১১. আর্মোরি ও কাস্টমাইজেশন শপ =================
function purchaseSkin(skinId) {
    playClickSound();
    triggerHaptic('medium');

    if (unlockedUpgrades.includes(skinId)) {
        return showToast(currentLang === 'bn' ? 'এটি ইতিমধ্যে আপনার সংগ্রহে রয়েছে!' : 'Already unlocked!');
    }

    const prices = {
        'cyber_neon': 250,
        'reflex_overload': 500
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

// ================= ১২. গ্লোবাল লিডারবোর্ড সিঙ্ক =================
function listenToLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    if (!container) return;

    db.ref('users').orderByChild('highScore').limitToLast(20).on('value', snapshot => {
        if (!snapshot.exists()) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">${t('loading_text')}</div>`;
            return;
        }

        const pilots = [];
        snapshot.forEach(child => {
            pilots.push(child.val());
        });

        pilots.reverse(); // সর্বোচ্চ স্কোর প্রথমে

        let html = '';
        pilots.forEach((pilot, idx) => {
            const initial = (pilot.name?.charAt(0) || 'P').toUpperCase();
            const rankBadge = idx === 0 ? '👑' : `#${formatNum(idx + 1)}`;

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

// ================= ১৩. UI আপডেট ও প্রোটোকল গিফট =================
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

    // আপগ্রেড বাটনের স্ট্যাটাস
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
    showToast(currentLang === 'bn' ? `🎉 +${formatNum(rewardPts)} ক্রেডিট যুক্ত হয়েছে!` : `🎉 +${rewardPts} Credits claimed!`);
    renderCheckInGrid();
    updateUI();
}

// ================= ১৪. সোশ্যাল শেয়ারিং ও মডালস =================
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
        ? `🎮 Aetheria Cyber Arcade-এ আমার সাথে খেলুন! আমার হাই-স্কোর বিট করতে পারবেন?\n\n👇 গেম লিংক:\n${myReferralLink}`
        : `🎮 Challenge my high score in Aetheria Cyber Arcade!\n\n👇 Play Link:\n${myReferralLink}`;
    
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

    // সাইবার বুট স্ক্রিন রিমুভাল
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