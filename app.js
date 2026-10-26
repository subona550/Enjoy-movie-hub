/**
 * ADS EARN PRO - ADVANCED CLIENT ENGINE (v3.1.0)
 * Features:
 * - 3-Dot Sliding Dashboard Drawer Engine
 * - Fullscreen Modern Cashout & Conversion Engine
 * - Complete Profile Page with Live Stats
 * - Monetag, Adsgram & Adsterra Integrated Systems
 * - 7-Day Progressive Streak Check-in System
 * - Real-time Firebase Sync & WebAudio Synthesizer
 */

// ================= অডিও সাউন্ড সিন্থেসাইজার =================
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playClickSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) { }
}

function playCoinSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) { }
}

// ================= হেল্পার ও ইউটিলিটি =================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.borderColor = type === 'error' ? '#ef4444' : '#00f2fe';
    toast.innerText = message;
    container.appendChild(toast);

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type === 'error' ? 'error' : 'success');
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

function triggerConfettiAnimation() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#00f5a0', '#7f00ff', '#ffaa00'],
            zIndex: 999999
        });
    }
}

function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDaysDiff(dateStr1, dateStr2) {
    if (!dateStr1 || !dateStr2) return 999;
    const d1 = new Date(dateStr1 + "T00:00:00");
    const d2 = new Date(dateStr2 + "T00:00:00");
    return Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
}

// ================= ফায়ারবেস কনফিগারেশন =================
const firebaseConfig = {
    apiKey: "AIzaSyBR9cx11EjwDzoCshY_8_j-pBix_brYA50",
    authDomain: "ads-earning-26019.firebaseapp.com",
    databaseURL: "https://ads-earning-26019-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ads-earning-26019",
    storageBucket: "ads-earning-26019.firebasestorage.app",
    messagingSenderId: "226920017119",
    appId: "1:226920017119:web:f9e5d2baac8cc86ab30d6a"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ================= লোকালাইজেশন (i18n) =================
let currentLang = localStorage.getItem('app_lang') || 'bn';

// ৭ দিনের ডেইলি বোনাস পয়েন্ট
const checkInRewards = [10, 20, 30, 50, 70, 100, 200];

const i18n = {
    bn: {
        nav_home: "হোম ড্যাশবোর্ড", nav_refer: "রেফারেল", nav_withdraw: "উত্তোলন", nav_profile: "আমার প্রোফাইল",
        header_sub: "বিজ্ঞাপন দেখে আয় করুন", welcome_title: "স্বাগতম আমাদের অ্যাপে!",
        welcome_desc: "আমাদের অ্যাপে জয়েন করায় আপনাকে দেওয়া হলো", points_label: "পয়েন্ট",
        welcome_suffix: "ওয়েলকাম বোনাস!", claim_bonus_btn: "🎁 বোনাস গ্রহণ করুন", balance_label: "মোট ব্যালেন্স",
        slide1_badge: "🚀 ইনস্ট্যান্ট আর্নিং", slide1_prefix: "প্রতি বিজ্ঞাপনে", slide1_suffix: "পাবেন",
        slide1_desc: "ভিডিও ও অন-ক্লিক বিজ্ঞাপন দেখা শেষ হলেই পয়েন্ট জমা হবে।",
        slide2_badge: "📱 ইনস্ট্যান্ট ক্যাশআউট", slide2_title: "মোবাইল রিচার্জ, বিকাশ ও নগদ",
        slide2_desc: "আপনার অর্জিত পয়েন্ট সরাসরি মোবাইল রিচার্জ ও ওয়ালেটে ক্যাশআউট নিন।",
        slide3_badge: "🎁 রেফারেল বোনাস", slide3_title: "বন্ধুদের ইনভাইট করুন",
        slide3_desc: "প্রতিটি সফল রেফারে পেয়ে যান",
        balance_card_title: "💎 মূল পয়েন্ট ওয়ালেট", status_active: "● সক্রিয় সিস্টেম",
        checkin_title: "ডেইলি লগইন বোনাস", checkin_open_btn: "ক্লেইম ➔",
        ref_card_badge: "🎁 রেফারেল প্রোগ্রাম", ref_hero_title: "বন্ধুদের ইনভাইট করুন, আয় করুন পয়েন্ট!",
        ref_hero_desc: "আপনার ইউনিক রেফারেল লিংকের মাধ্যমে বন্ধু যুক্ত হলেই ইনস্ট্যান্ট পয়েন্ট যোগ হবে আপনার ওয়ালেটে।",
        ref_card_title: "আপনার ইনভাইট লিংক", ref_bonus_label: "বোনাস:", copy_btn: "কপি করুন",
        share_tg_btn: "✈️ টেলিগ্রাম বন্ধুদের সাথে শেয়ার করুন", ref_stat_title: "📊 আপনার রেফারেল পরিসংখ্যান",
        stat_total_ref: "মোট রেফারেল", stat_ref_earn: "রেফারেল পয়েন্ট",
        withdraw_badge: "💸 পয়েন্ট উত্তোলন", withdraw_title: "মোবাইল রিচার্জ ও ক্যাশআউট",
        wallet_bal_text: "বর্তমান উত্তোলনযোগ্য পয়েন্ট:", min_withdraw_text: "সর্বনিম্ন উত্তোলন লিমিট:",
        label_acc_type: "সিম টাইপ (SIM Type):", label_withdraw_points: "উত্তোলনের পয়েন্ট পরিমাণ (Points):",
        btn_submit_withdraw: "⚡ ক্যাশআউট রিকোয়েস্ট পাঠান", btn_withdraw_history: "উইথড্রয়াল হিস্ট্রি দেখুন",
        history_title: "📜 উত্তোলনের ইতিহাস", loading_text: "ডাটা লোড হচ্ছে...",
        no_history_withdraw: "কোনো উইথড্রয়াল হিস্ট্রি পাওয়া যায়নি।",
        checkin_modal_title: "৭ দিনের দৈনিক উপহার", checkin_fullview_head: "প্রতিদিন লগইন করে পয়েন্ট নিন",
        checkin_fullview_sub: "প্রতিদিন চেক-ইন করে আপনার স্ট্রিক ধরে রাখুন এবং ৭ম দিনে জিতে নিন মেগা পয়েন্ট বোনাস!",
        checkin_btn_claim: "🎁 আজকের পয়েন্ট সংগ্রহ করুন", checkin_btn_claimed: "✅ আজকের পয়েন্ট ক্লেইম করা হয়েছে",
        day_prefix: "দিন ", tag_done: "নেওয়া হয়েছে", tag_open: "ক্লেইম", tag_lock: "লক"
    },
    en: {
        nav_home: "Home Dashboard", nav_refer: "Refer", nav_withdraw: "Withdraw", nav_profile: "My Profile",
        header_sub: "Earn points watching ads", welcome_title: "Welcome to Our App!",
        welcome_desc: "Thanks for joining! You received", points_label: "Points",
        welcome_suffix: "welcome bonus!", claim_bonus_btn: "🎁 Claim Bonus", balance_label: "Total Balance",
        slide1_badge: "🚀 Instant Earning", slide1_prefix: "Per ad watch reward is", slide1_suffix: "",
        slide1_desc: "Points credited to balance right after ad completion.",
        slide2_badge: "📱 Instant Cashout", slide2_title: "Mobile Recharge, bKash & Nagad",
        slide2_desc: "Redeem points directly to Mobile Recharge & Cashout wallets.",
        slide3_badge: "🎁 Referral Bonus", slide3_title: "Invite Friends",
        slide3_desc: "Earn instantly for every friend invited",
        balance_card_title: "💎 Main Wallet Points", status_active: "● Active System",
        checkin_title: "Daily Login Bonus", checkin_open_btn: "Claim ➔",
        ref_card_badge: "🎁 Referral Program", ref_hero_title: "Invite Friends & Earn Points!",
        ref_hero_desc: "Whenever friends join via your link, bonus points credit immediately to your account.",
        ref_card_title: "Your Invite Link", ref_bonus_label: "Bonus:", copy_btn: "Copy Link",
        share_tg_btn: "✈️ Share with Telegram Friends", ref_stat_title: "📊 Referral Statistics",
        stat_total_ref: "Total Referrals", stat_ref_earn: "Referral Points",
        withdraw_badge: "💸 Point Cashout", withdraw_title: "Mobile Recharge & Cashout",
        wallet_bal_text: "Current Point Balance:", min_withdraw_text: "Minimum cashout limit:",
        label_acc_type: "SIM Type:", label_withdraw_points: "Points to Withdraw (Points):",
        btn_submit_withdraw: "⚡ Submit Cashout Request", btn_withdraw_history: "View Cashout History",
        history_title: "📜 Withdrawal History", loading_text: "Loading data...",
        no_history_withdraw: "No cashout history found.",
        checkin_modal_title: "7 Days Login Gifts", checkin_fullview_head: "Log in Daily for Points",
        checkin_fullview_sub: "Maintain your daily streak to grab massive bonus points on Day 7!",
        checkin_btn_claim: "🎁 Claim Today's Points", checkin_btn_claimed: "✅ Already Claimed Today",
        day_prefix: "Day ", tag_done: "Claimed", tag_open: "Claim", tag_lock: "Locked"
    }
};

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    const ind = document.getElementById('lang-indicator');
    if (ind) ind.innerText = lang === 'bn' ? 'EN' : 'BN';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
    renderCheckInUI();
}

function toggleLanguage() { 
    playClickSound();
    applyLanguage(currentLang === 'bn' ? 'en' : 'bn'); 
}

function startSplashScreen() {
    const progressBar = document.getElementById('splash-progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (progressBar && progress <= 100) progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.opacity = '0';
                    splash.style.visibility = 'hidden';
                }
            }, 350);
        }
    }, 90);
}

// ================= টেলিগ্রাম ওয়েবঅ্যাপ ও ইউজার হ্যান্ডলার =================
const tg = window.Telegram?.WebApp;
if (tg) { 
    try {
        tg.ready(); 
        tg.expand();
        if (typeof tg.requestFullscreen === 'function') tg.requestFullscreen();
        if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
    } catch (e) { }
}

let tgUser = tg?.initDataUnsafe?.user;

if (!tgUser || !tgUser.id) {
    tgUser = {
        id: "78601234",
        first_name: "Demo",
        last_name: "User",
        username: "demotester"
    };
}

const userId = tgUser.id.toString();
const userName = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@user_' + userId.substr(-4);

// গ্লোবাল স্টেট ও সেটিংস
let welcomeBonusPoints = 100;
let targetAds = 20;
let minWithdrawPoints = 200; // ডিফল্ট রিচার্জ মিনিমাম ২০০ পয়েন্ট
let pointsToBdtRate = 0.10;   // ১০০ পয়েন্ট = ১০ টাকা
let referralBonusPoints = 50;

let balancePoints = 0, adsWatchedCount = 0, referralCount = 0, referralEarningsPoints = 0;
let lastCheckInDate = "", checkInStreak = 0;

let selectedWithdrawMethod = 'recharge'; // 'recharge', 'bkash', 'nagad'
let selectedNetwork = 'monetag';        // 'monetag', 'adsgram', 'adsterra'

let netConfigs = {
    monetag: { 
        zoneId: "8765432", 
        url: "https://omulgous.com/4/8765432", 
        reward: 15 
    },
    adsgram: { 
        blockId: "26019", 
        reward: 20 
    },
    adsterra: { 
        url: "https://beta.publishers.adsterra.com/direct-link-sample", 
        reward: 15 
    }
};

let myReferralLink = "https://t.me/?startapp=ref_" + userId;

function getReferrerId() {
    let startParam = tg?.initDataUnsafe?.start_param;
    if (!startParam) {
        let urlParams = new URLSearchParams(window.location.search);
        startParam = urlParams.get('startapp') || urlParams.get('tgWebAppStartParam') || urlParams.get('start');
    }
    if (startParam) {
        if (startParam.startsWith('ref_')) return startParam.replace('ref_', '');
        if (/^\d+$/.test(startParam)) return startParam;
    }
    return null;
}
const referrerId = getReferrerId();

// অ্যাপ ইনিশিয়ালাইজেশন
function initApp() {
    applyLanguage(currentLang);
    startSplashScreen();
    
    // ড্যাশবোর্ড ড্রয়ার ও প্রোফাইল পেজে ইউজারের তথ্য সেট করা
    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElemText('drawer-user-name', userName);
    setElemText('drawer-user-id', '#' + userId);
    setElemText('profile-page-name', userName);
    setElemText('profile-page-username', userUsername);
    setElemText('profile-page-id', 'ID: #' + userId);

    document.querySelectorAll('#referral-link-display').forEach(e => e.innerText = myReferralLink);

    switchWithdrawMethod('recharge');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ================= ফায়ারবেস সেটিংস সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    welcomeBonusPoints = Number(data.welcomeBonusPoints ?? 100);
    targetAds = Number(data.targetAds ?? 20);
    pointsToBdtRate = Number(data.pointsToBdtRate ?? 0.10);
    referralBonusPoints = Number(data.referralBonusPoints ?? 50);

    // Monetag Mini App & Zone ID
    netConfigs.monetag.zoneId = data.monetagZoneId || "8765432";
    netConfigs.monetag.url = data.monetagUrl || "https://omulgous.com/4/8765432";
    netConfigs.monetag.reward = Number(data.rewardMonetagPoints ?? 15);

    // Adsgram
    netConfigs.adsgram.blockId = data.adsgramBlockId || "26019";
    netConfigs.adsgram.reward = Number(data.rewardAdsgramPoints ?? 20);

    // Adsterra On-Click
    netConfigs.adsterra.url = data.adsterraUrl || "https://beta.publishers.adsterra.com/direct-link-sample";
    netConfigs.adsterra.reward = Number(data.rewardAdsterraPoints ?? 15);

    let BOT_USERNAME = data.botUsername || "";
    let APP_SHORT_NAME = data.appShortName || "";

    // প্রোফাইল ও ড্রয়ার লিঙ্ক সিঙ্ক
    const waLink = document.getElementById('whatsapp-support-link');
    const tgLink = document.getElementById('telegram-support-link');
    const drawerWa = document.getElementById('drawer-wa-link');
    const drawerTg = document.getElementById('drawer-tg-link');

    if (data.whatsappNumber) {
        const waUrl = `https://wa.me/${data.whatsappNumber}`;
        if (waLink) waLink.href = waUrl;
        if (drawerWa) drawerWa.href = waUrl;
    }
    if (data.telegramChannel) {
        if (tgLink) tgLink.href = data.telegramChannel;
        if (drawerTg) drawerTg.href = data.telegramChannel;
    }

    if (BOT_USERNAME) {
        myReferralLink = APP_SHORT_NAME 
            ? `https://t.me/${BOT_USERNAME}/${APP_SHORT_NAME}?startapp=ref_${userId}` 
            : `https://t.me/${BOT_USERNAME}?start=ref_${userId}`;
    }
    document.querySelectorAll('#referral-link-display').forEach(e => e.innerText = myReferralLink);

    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = netConfigs.adsgram.reward);
    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = netConfigs.monetag.reward);
    document.querySelectorAll('.reward-adsterra-val').forEach(el => el.innerText = netConfigs.adsterra.reward);
    document.querySelectorAll('.banner-reward-amount').forEach(el => el.innerText = netConfigs.monetag.reward);

    updateDynamicUI();
});

// ================= ইউজার ডাটা ও অটো রিসেট =================
db.ref('users/' + userId).once('value', (snapshot) => {
    const todayStr = localDateKey();

    if (!snapshot.exists()) {
        balancePoints = welcomeBonusPoints;
        let newUserObj = {
            name: userName,
            username: userUsername,
            balance: balancePoints,
            adsWatchedCount: 0,
            ads_monetag: 0,
            ads_adsgram: 0,
            ads_adsterra: 0,
            referralCount: 0,
            referralEarnings: 0,
            referredBy: (referrerId && referrerId !== userId) ? referrerId : null,
            joinedAt: new Date().toISOString(),
            lastAdDate: todayStr,
            lastCheckInDate: "",
            checkInStreak: 0
        };

        db.ref('users/' + userId).set(newUserObj).then(() => {
            if (referrerId && referrerId !== userId) {
                db.ref('users/' + referrerId).transaction((curr) => {
                    if (!curr) return curr;
                    curr.balance = Math.round(Number(curr.balance || 0) + referralBonusPoints);
                    curr.referralCount = Number(curr.referralCount || 0) + 1;
                    curr.referralEarnings = Math.round(Number(curr.referralEarnings || 0) + referralBonusPoints);
                    return curr;
                });
            }
        });

        const welcomeModal = document.getElementById('welcome-modal');
        if (welcomeModal) welcomeModal.style.display = 'flex';
    }

    db.ref('users/' + userId).on('value', (snap) => {
        const uData = snap.val();
        if (uData) {
            balancePoints = Math.round(Number(uData.balance || 0));
            adsWatchedCount = Number(uData.adsWatchedCount || 0);
            referralCount = Number(uData.referralCount || 0);
            referralEarningsPoints = Math.round(Number(uData.referralEarnings || 0));
            lastCheckInDate = uData.lastCheckInDate || "";
            checkInStreak = Number(uData.checkInStreak || 0);

            // নতুন দিনে ডেইলি কাউন্টার রিসেট
            if (uData.lastAdDate !== todayStr) {
                adsWatchedCount = 0;
                db.ref('users/' + userId).update({
                    adsWatchedCount: 0,
                    ads_monetag: 0,
                    ads_adsgram: 0,
                    ads_adsterra: 0,
                    lastAdDate: todayStr
                });
            }
            renderUI();
            renderCheckInUI();
        }
    });
});

function renderUI() {
    const userBal = document.getElementById('user-balance');
    const withBal = document.getElementById('withdraw-page-balance');
    const drawerBal = document.getElementById('drawer-profile-balance');
    const profBal = document.getElementById('profile-stat-balance');
    const profRef = document.getElementById('profile-stat-ref');

    if (userBal) userBal.innerText = `${balancePoints} Pts`;
    if (withBal) withBal.innerText = `${balancePoints} Pts`;
    if (drawerBal) drawerBal.innerText = `${balancePoints} Pts`;
    if (profBal) profBal.innerText = `${balancePoints} Pts`;
    if (profRef) profRef.innerText = `${referralCount} ${currentLang === 'bn' ? 'জন' : ''}`;

    document.querySelectorAll('#home-ref-count').forEach(e => e.innerText = `${referralCount} ${currentLang === 'bn' ? 'জন' : ''}`);
    document.querySelectorAll('#home-ref-earnings').forEach(e => e.innerText = `${referralEarningsPoints} Pts`);
}

function updateDynamicUI() {
    const wbModal = document.getElementById('welcome-bonus-modal');
    if (wbModal) wbModal.innerText = welcomeBonusPoints;
    document.querySelectorAll('.banner-ref-bonus').forEach(e => e.innerText = referralBonusPoints);
    document.querySelectorAll('#display-ref-bonus').forEach(e => e.innerText = referralBonusPoints);
    
    const minWithdrawEl = document.getElementById('display-min-withdraw');
    if (minWithdrawEl) minWithdrawEl.innerText = minWithdrawPoints;

    const rateTextEl = document.getElementById('display-point-rate-text');
    if (rateTextEl) {
        const sampleBdt = (100 * pointsToBdtRate).toFixed(1).replace('.0', '');
        rateTextEl.innerText = `১০০ পয়েন্ট = ${sampleBdt} টাকা`;
    }

    const inputPoints = document.getElementById('withdraw-points');
    if (inputPoints) {
        inputPoints.min = minWithdrawPoints;
        inputPoints.placeholder = `পয়েন্ট পরিমাণ লিখুন (মিনিমাম ${minWithdrawPoints})`;
    }
}

// ================= ডেইলি চেক-ইন কন্ট্রোলার =================
function openCheckInFullView() {
    playClickSound();
    renderCheckInUI();
    const overlay = document.getElementById('checkin-fullview');
    if (overlay) overlay.classList.add('active');
}

function closeCheckInFullView() {
    playClickSound();
    const overlay = document.getElementById('checkin-fullview');
    if (overlay) overlay.classList.remove('active');
}

function renderCheckInUI() {
    const grid = document.getElementById('checkin-grid');
    const claimBtn = document.getElementById('btn-claim-checkin');
    const streakText = document.getElementById('checkin-streak-status');
    const compactStatus = document.getElementById('compact-checkin-status');
    const profStreakDesc = document.getElementById('profile-streak-desc');

    const today = localDateKey();
    const isClaimedToday = (lastCheckInDate === today);
    const daysDiff = getDaysDiff(lastCheckInDate, today);

    let currentDayTarget = 1;
    if (isClaimedToday) {
        currentDayTarget = checkInStreak;
    } else {
        currentDayTarget = (daysDiff === 1) ? ((checkInStreak % 7) + 1) : 1;
    }

    if (compactStatus) {
        compactStatus.innerText = isClaimedToday 
            ? (currentLang === 'bn' ? '✅ আজকের বোনাস নেওয়া হয়েছে' : '✅ Claimed for today')
            : (currentLang === 'bn' ? `🎁 দিন ${currentDayTarget}-এর পয়েন্ট অপেক্ষা করছে!` : `🎁 Day ${currentDayTarget} reward is ready!`);
    }

    if (streakText) streakText.innerText = currentLang === 'bn' ? `🔥 স্ট্রিক: ${checkInStreak} দিন` : `🔥 Streak: ${checkInStreak} Days`;
    
    // প্রোফাইল পেজেও স্ট্রিক দেখানো
    if (profStreakDesc) {
        profStreakDesc.innerText = currentLang === 'bn' 
            ? `বর্তমান স্ট্রিক: ${checkInStreak} দিন (${isClaimedToday ? 'আজকে নেওয়া হয়েছে' : 'আজকের বাকি আছে'})` 
            : `Current streak: ${checkInStreak} Days`;
    }

    if (!grid || !claimBtn) return;

    let html = '';
    for (let i = 1; i <= 7; i++) {
        const reward = checkInRewards[i - 1];
        let itemClass = 'checkin-item';
        let tagClass = 'tag-lock';
        let statusTagText = i18n[currentLang].tag_lock;
        let icon = '🎁';

        if (i === 7) { itemClass += ' day-7'; icon = '👑'; }

        if (isClaimedToday) {
            if (i <= checkInStreak) {
                itemClass += ' claimed';
                tagClass = 'tag-claimed';
                statusTagText = i18n[currentLang].tag_done;
                icon = '✅';
            }
        } else {
            if (i < currentDayTarget) {
                itemClass += ' claimed';
                tagClass = 'tag-claimed';
                statusTagText = i18n[currentLang].tag_done;
                icon = '✅';
            } else if (i === currentDayTarget) {
                itemClass += ' active';
                tagClass = 'tag-ready';
                statusTagText = i18n[currentLang].tag_open;
                icon = (i === 7) ? '🌟' : '⚡';
            }
        }

        html += `
            <div class="${itemClass}">
                <span class="checkin-day-num">${i18n[currentLang].day_prefix}${i}</span>
                <span class="checkin-icon">${icon}</span>
                <span class="checkin-amount">+${reward} Pts</span>
                <span class="checkin-status-tag ${tagClass}">${statusTagText}</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.innerText = i18n[currentLang].checkin_btn_claimed;
        claimBtn.style.opacity = "0.6";
        claimBtn.style.cursor = "not-allowed";
    } else {
        claimBtn.disabled = false;
        claimBtn.style.opacity = "1";
        claimBtn.style.cursor = "pointer";
        const nextReward = checkInRewards[currentDayTarget - 1];
        claimBtn.innerText = currentLang === 'bn' 
            ? `🎁 আজকের দিন ${currentDayTarget} বোনাস নিন (+${nextReward} Pts)`
            : `🎁 Claim Day ${currentDayTarget} Bonus (+${nextReward} Pts)`;
    }
}

async function claimDailyCheckIn() {
    playClickSound();
    const today = localDateKey();
    const btn = document.getElementById('btn-claim-checkin');

    if (lastCheckInDate === today) {
        return showToast(currentLang === 'bn' ? '⚠️ আজ ইতিমধ্যে পয়েন্ট সংগ্রহ করেছেন!' : '⚠️ Already claimed today!', 'error');
    }

    if (btn) btn.disabled = true;
    const userRef = db.ref('users/' + userId);

    try {
        let earnedPoints = 0;
        let resultingStreak = 1;

        const tx = await userRef.transaction((curr) => {
            if (!curr) return;
            if (curr.lastCheckInDate === today) return;

            const prevDate = curr.lastCheckInDate || "";
            const prevStreak = Number(curr.checkInStreak || 0);
            const diff = getDaysDiff(prevDate, today);

            resultingStreak = (diff === 1) ? ((prevStreak % 7) + 1) : 1;
            earnedPoints = checkInRewards[resultingStreak - 1];

            curr.balance = Math.round(Number(curr.balance || 0) + earnedPoints);
            curr.lastCheckInDate = today;
            curr.checkInStreak = resultingStreak;
            return curr;
        });

        if (!tx.committed) return showToast('⚠️ Already claimed today!', 'error');

        playCoinSound();
        triggerConfettiAnimation();
        showToast(currentLang === 'bn' 
            ? `🎉 দিন ${resultingStreak}-এর বোনাস +${earnedPoints} পয়েন্ট যোগ হয়েছে!` 
            : `🎉 Day ${resultingStreak} bonus +${earnedPoints} Pts added!`, 'success');
        
        renderCheckInUI();
    } catch (err) {
        showToast('⚠️ Error claiming daily points.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ================= মনেট্যাগ, অ্যাডসগ্রাম ও অন-ক্লিক অ্যাডস ইঞ্জিন =================
function openNetworkFullView(networkKey) {
    playClickSound();
    selectedNetwork = networkKey;
    const overlay = document.getElementById('network-fullview');

    const netDetails = {
        monetag: {
            title: "Monetag Mini App Task",
            badge: "⚡ MONETAG OFFICIAL IN-APP ADS",
            icon: "🚀",
            headline: "Monetag অন-ক্লিক টাস্ক",
            desc: "অন-ক্লিক অফার পেজে যান এবং ১০-১৫ সেকেন্ড ব্রাউজ করে রিওয়ার্ড পয়েন্ট সংগ্রহ করুন।"
        },
        adsgram: {
            title: "Adsgram Video Reward",
            badge: "🎬 OFFICIAL ADSGRAM SDK",
            icon: "🎥",
            headline: "ভিডিও বিজ্ঞাপন দেখুন",
            desc: "ভিডিওটি সম্পূর্ণ দেখুন, দেখা শেষ হলেই স্বয়ংক্রিয়ভাবে পয়েন্ট অ্যাকাউন্টে যোগ হবে।"
        },
        adsterra: {
            title: "Adsterra On-Click Task",
            badge: "💎 ADSTERRA DIRECT NETWORK",
            icon: "🌐",
            headline: "অন-ক্লিক ডাইরেক্ট লিঙ্ক",
            desc: "হাই-সিপিএম স্পনসর লিঙ্কে অন-ক্লিক টাস্ক ভিজিট সম্পন্ন করে পয়েন্ট অর্জন করুন।"
        }
    };

    const info = netDetails[networkKey];
    document.getElementById('fv-network-title').innerText = info.title;
    document.getElementById('fv-badge').innerText = info.badge;
    document.getElementById('fv-icon').innerText = info.icon;
    document.getElementById('fv-headline').innerText = info.headline;
    document.getElementById('fv-desc').innerText = info.desc;
    document.getElementById('fv-reward-amount').innerText = `+${netConfigs[networkKey].reward} Pts`;
    document.getElementById('fv-limit-count').innerText = `${adsWatchedCount}/${targetAds}`;

    let percent = Math.min((adsWatchedCount / targetAds) * 100, 100);
    document.getElementById('fv-progress-bar').style.width = `${percent}%`;

    overlay.classList.add('active');
}

function closeNetworkFullView() {
    playClickSound();
    document.getElementById('network-fullview').classList.remove('active');
}

async function executeCurrentNetworkAd() {
    playClickSound();
    if (adsWatchedCount >= targetAds) {
        return showToast(currentLang === 'bn' ? `⚠️ আজকের বিজ্ঞাপন সীমা (${targetAds}) শেষ হয়েছে।` : `⚠️ Daily limit reached.`, 'error');
    }

    const actionBtn = document.getElementById('fv-action-btn');
    actionBtn.disabled = true;

    try {
        // ১. মনেট্যাগ অন-ক্লিক / SDK
        if (selectedNetwork === 'monetag') {
            const monetagSdkFunction = window[`show_${netConfigs.monetag.zoneId}`];
            
            if (typeof monetagSdkFunction === 'function') {
                showToast(currentLang === 'bn' ? '⚡ মনেট্যাগ বিজ্ঞাপন লোড হচ্ছে...' : '⚡ Loading Monetag In-App...', 'success');
                try {
                    await monetagSdkFunction();
                    await creditAdReward(netConfigs.monetag.reward);
                    return;
                } catch (sdkErr) {
                    console.warn("Monetag In-App fallback to smart-link:", sdkErr);
                }
            }

            if (netConfigs.monetag.url) {
                window.open(netConfigs.monetag.url, '_blank');
                let countdown = 12;
                actionBtn.innerText = `⏳ অপেক্ষা করুন (${countdown}s)...`;
                
                showToast(currentLang === 'bn' ? '⏳ অফার পেজটি ১০-১২ সেকেন্ড ভিজিট করুন...' : '⏳ Visit page for 12 seconds...', 'success');

                const timer = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        actionBtn.innerText = `⏳ অপেক্ষা করুন (${countdown}s)...`;
                    } else {
                        clearInterval(timer);
                        creditAdReward(netConfigs.monetag.reward);
                        actionBtn.innerText = '▶ অন-ক্লিক টাস্ক শুরু করুন';
                        actionBtn.disabled = false;
                    }
                }, 1000);
                return;
            } else {
                actionBtn.disabled = false;
                return showToast('⚠️ Monetag URL বা Zone ID সেট করা নেই!', 'error');
            }
        }

        // ২. অ্যাডসগ্রাম রিওয়ার্ডেড ভিডিও
        else if (selectedNetwork === 'adsgram') {
            if (typeof window.Adsgram === 'undefined' || !netConfigs.adsgram.blockId) {
                actionBtn.disabled = false;
                return showToast(currentLang === 'bn' ? '⚠️ Adsgram ব্লক আইডি পাওয়া যায়নি!' : '⚠️ Adsgram Block ID missing.', 'error');
            }
            
            showToast(currentLang === 'bn' ? '🎬 Adsgram ভিডিও শুরু হচ্ছে...' : '🎬 Starting video ad...', 'success');
            await window.Adsgram.init({ blockId: netConfigs.adsgram.blockId }).show();
            await creditAdReward(netConfigs.adsgram.reward);
        }

        // ৩. অ্যাডস্টেরা অন-ক্লিক লিঙ্ক
        else if (selectedNetwork === 'adsterra') {
            if (!netConfigs.adsterra.url) {
                actionBtn.disabled = false;
                return showToast('⚠️ Adsterra লিঙ্ক পাওয়া যায়নি!', 'error');
            }

            window.open(netConfigs.adsterra.url, '_blank');
            let countdown = 12;
            actionBtn.innerText = `⏳ অপেক্ষা করুন (${countdown}s)...`;

            showToast(currentLang === 'bn' ? '⏳ পেজটি ১০-১২ সেকেন্ড ভিজিট করুন...' : '⏳ Please visit the sponsor page...', 'success');

            const timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    actionBtn.innerText = `⏳ অপেক্ষা করুন (${countdown}s)...`;
                } else {
                    clearInterval(timer);
                    creditAdReward(netConfigs.adsterra.reward);
                    actionBtn.innerText = '▶ অন-ক্লিক টাস্ক শুরু করুন';
                    actionBtn.disabled = false;
                }
            }, 1000);
            return;
        }
    } catch (err) {
        showToast(currentLang === 'bn' ? '⚠️ বিজ্ঞাপন সম্পূর্ণ হয়নি বা বাতিল হয়েছে।' : '⚠️ Ad skipped or canceled.', 'error');
    } finally {
        if (selectedNetwork === 'adsgram') {
            actionBtn.disabled = false;
        }
    }
}

async function creditAdReward(rewardPoints) {
    const today = localDateKey();
    const userRef = db.ref('users/' + userId);

    const result = await userRef.transaction(current => {
        if (!current) return;
        const count = current.lastAdDate === today ? Number(current.adsWatchedCount || 0) : 0;
        if (count >= targetAds) return;
        current.balance = Math.round(Number(current.balance || 0) + rewardPoints);
        current.adsWatchedCount = count + 1;
        current.lastAdDate = today;

        if (selectedNetwork === 'monetag') current.ads_monetag = Number(current.ads_monetag || 0) + 1;
        if (selectedNetwork === 'adsgram') current.ads_adsgram = Number(current.ads_adsgram || 0) + 1;
        if (selectedNetwork === 'adsterra') current.ads_adsterra = Number(current.ads_adsterra || 0) + 1;

        return current;
    });

    if (result.committed) {
        playCoinSound();
        triggerConfettiAnimation();
        showToast(currentLang === 'bn' ? `🎉 +${rewardPoints} পয়েন্ট অ্যাকাউন্টে যোগ হয়েছে!` : `🎉 Added +${rewardPoints} Points!`, 'success');
        
        const newWatched = adsWatchedCount + 1;
        document.getElementById('fv-limit-count').innerText = `${newWatched}/${targetAds}`;
        let percent = Math.min((newWatched / targetAds) * 100, 100);
        document.getElementById('fv-progress-bar').style.width = `${percent}%`;
    }
}

// ================= ব্যানার অটো স্লাইডার =================
let currentSlide = 0;
setInterval(() => {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0 || document.hidden) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}, 3800);

function closeWelcomeModal() { 
    playCoinSound();
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.style.display = 'none'; 
    triggerConfettiAnimation();
}

// ================= বটম নেভিগেশন ও ট্যাব সুইচ =================
function switchTab(pageId, titleKey, btnElement) {
    playClickSound();
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    
    const headerTitleKey = 'nav_' + titleKey;
    const headerTitleEl = document.getElementById('header-title');
    if (i18n[currentLang][headerTitleKey] && headerTitleEl) {
        headerTitleEl.innerText = i18n[currentLang][headerTitleKey];
    }
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= রেফারেল হ্যান্ডলার =================
function copyReferralLink() {
    playClickSound();
    navigator.clipboard.writeText(myReferralLink).then(() => {
        showToast(currentLang === 'bn' ? '✅ রেফারেল লিংক কপি হয়েছে!' : '✅ Referral link copied!', 'success');
    });
}

function shareReferralLink() {
    playClickSound();
    const shareText = `🎉 আমাদের আর্নিং অ্যাপে জয়েন করলেই পাবেন ${welcomeBonusPoints} পয়েন্ট ওয়েলকাম বোনাস!\n\n👇 এখনই জয়েন করুন:\n${myReferralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
}

// ================= রিচার্জ, বিকাশ ও নগদ ক্যাশআউট সিস্টেম =================
function switchWithdrawMethod(method) {
    playClickSound();
    selectedWithdrawMethod = method;
    
    const btnRecharge = document.getElementById('btn-method-recharge');
    const btnBkash = document.getElementById('btn-method-bkash');
    const btnNagad = document.getElementById('btn-method-nagad');
    
    const groupOperator = document.getElementById('group-operator');
    const labelAccType = document.getElementById('label-acc-type');
    const selectAccType = document.getElementById('withdraw-account-type');
    const labelPhone = document.getElementById('label-withdraw-phone');
    const inputPhone = document.getElementById('withdraw-phone');
    const minWithdrawEl = document.getElementById('display-min-withdraw');
    const inputPoints = document.getElementById('withdraw-points');

    if (btnRecharge) btnRecharge.classList.toggle('active', method === 'recharge');
    if (btnBkash) btnBkash.classList.toggle('active', method === 'bkash');
    if (btnNagad) btnNagad.classList.toggle('active', method === 'nagad');

    if (method === 'recharge') {
        if (groupOperator) groupOperator.style.display = 'block';
        if (labelAccType) labelAccType.innerText = 'সিম টাইপ (SIM Type):';
        if (selectAccType) {
            selectAccType.innerHTML = `
                <option value="Prepaid">প্রিপেইড (Prepaid)</option>
                <option value="Postpaid">পোস্টপেইড (Postpaid)</option>
            `;
        }
        if (labelPhone) labelPhone.innerText = 'রিচার্জ মোবাইল নম্বর:';
        if (inputPhone) inputPhone.placeholder = '01XXXXXXXXX';
        
        minWithdrawPoints = 200; // রিচার্জে সর্বনিম্ন ২০০ পয়েন্ট
    } else {
        if (groupOperator) groupOperator.style.display = 'none';
        if (labelAccType) labelAccType.innerText = 'অ্যাকাউন্টের ধরন (Account Type):';
        if (selectAccType) {
            selectAccType.innerHTML = `
                <option value="Personal">পার্সোনাল (Personal)</option>
                <option value="Agent">এজেন্ট (Agent)</option>
            `;
        }
        
        if (method === 'bkash') {
            if (labelPhone) labelPhone.innerText = 'বিকাশ নম্বর:';
            if (inputPhone) inputPhone.placeholder = '01XXXXXXXXX (bKash)';
        } else {
            if (labelPhone) labelPhone.innerText = 'নগদ নম্বর:';
            if (inputPhone) inputPhone.placeholder = '01XXXXXXXXX (Nagad)';
        }
        
        minWithdrawPoints = 500; // বিকাশ ও নগদে সর্বনিম্ন ৫০০ পয়েন্ট
    }

    if (minWithdrawEl) minWithdrawEl.innerText = minWithdrawPoints;
    if (inputPoints) {
        inputPoints.min = minWithdrawPoints;
        inputPoints.placeholder = `পয়েন্ট পরিমাণ লিখুন (মিনিমাম ${minWithdrawPoints})`;
    }
    calculateWithdrawBdt();
}

function calculateWithdrawBdt() {
    const pointsInput = parseFloat(document.getElementById('withdraw-points').value) || 0;
    const previewSummary = document.getElementById('withdraw-preview-summary');
    const bdtVal = document.getElementById('summary-bdt-val');

    if (pointsInput > 0) {
        previewSummary.style.display = 'block';
        const totalBdt = (pointsInput * pointsToBdtRate).toFixed(2);
        bdtVal.innerText = totalBdt;
    } else {
        previewSummary.style.display = 'none';
    }
}

async function handleWithdrawSubmit(event) {
    event.preventDefault();
    playClickSound();
    const form = event.currentTarget;
    const button = document.getElementById('btn-submit-withdraw');
    const pointsToDeduct = Number(document.getElementById('withdraw-points').value);
    const phone = document.getElementById('withdraw-phone').value.trim();
    const accountType = document.getElementById('withdraw-account-type').value;
    const operator = selectedWithdrawMethod === 'recharge' 
        ? document.getElementById('withdraw-operator').value 
        : null;

    if (!Number.isFinite(pointsToDeduct) || pointsToDeduct < minWithdrawPoints) {
        return showToast(currentLang === 'bn' ? `⚠️ সর্বনিম্ন উত্তোলন ${minWithdrawPoints} পয়েন্ট হতে হবে।` : `⚠️ Minimum ${minWithdrawPoints} points.`, 'error');
    }
    if (!/^01[3-9][0-9]{8}$/.test(phone)) {
        return showToast(currentLang === 'bn' ? '⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' : '⚠️ Invalid 11-digit mobile number.', 'error');
    }
    if (pointsToDeduct > balancePoints) {
        return showToast(currentLang === 'bn' ? '⚠️ আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।' : '⚠️ Insufficient points balance.', 'error');
    }

    const calculatedBdt = Math.round(pointsToDeduct * pointsToBdtRate * 100) / 100;
    let methodName = 'Mobile Recharge';
    if (selectedWithdrawMethod === 'bkash') methodName = 'bKash';
    if (selectedWithdrawMethod === 'nagad') methodName = 'Nagad';

    if (button) button.disabled = true;

    const userRef = db.ref('users/' + userId);
    try {
        const tx = await userRef.transaction(current => {
            if (!current) return;
            const curBal = Number(current.balance || 0);
            if (curBal < pointsToDeduct) return;
            current.balance = Math.round(curBal - pointsToDeduct);
            return current;
        });

        if (!tx.committed) throw new Error('INSUFFICIENT_POINTS');

        const requestRef = db.ref('withdrawals').push();
        await requestRef.set({
            userId,
            userName,
            userUsername,
            method: methodName,
            operator: operator || '',
            accountType,
            phone,
            pointsDeducted: pointsToDeduct,
            amountBdt: calculatedBdt,
            status: 'Pending',
            timestamp: new Date().toISOString()
        });

        form.reset();
        document.getElementById('withdraw-preview-summary').style.display = 'none';
        triggerConfettiAnimation();
        showToast(currentLang === 'bn' ? `⚡ ${methodName} রিকোয়েস্ট সফলভাবে জমা হয়েছে!` : `⚡ ${methodName} request submitted!`, 'success');

    } catch (error) {
        showToast(currentLang === 'bn' ? '⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা ত্রুটি ঘটেছে।' : '⚠️ Insufficient points or network error.', 'error');
    } finally {
        if (button) button.disabled = false;
    }
}

// ================= উইথড্রয়াল হিস্ট্রি বটম শিট =================
function openWithdrawHistory() {
    playClickSound();
    const overlay = document.getElementById('history-modal-overlay');
    const sheet = document.getElementById('history-bottom-sheet');
    overlay.style.display = 'block';
    setTimeout(() => { 
        overlay.classList.add('active'); 
        sheet.classList.add('active'); 
    }, 10);
    loadWithdrawHistoryData();
}

function closeWithdrawHistory() {
    playClickSound();
    const overlay = document.getElementById('history-modal-overlay');
    const sheet = document.getElementById('history-bottom-sheet');
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
}

function loadWithdrawHistoryData() {
    const listContainer = document.getElementById('history-scroll-list');
    listContainer.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 14px; padding: 25px;">${i18n[currentLang].loading_text}</div>`;

    db.ref('withdrawals').orderByChild('userId').equalTo(userId).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = `
                <div style="text-align: center; color: #cbd5e1; font-size: 14px; padding: 40px 10px;">
                    <div style="font-size: 42px; margin-bottom: 8px;">📂</div>
                    ${i18n[currentLang].no_history_withdraw}
                </div>`;
            return;
        }

        let itemsArr = [];
        snapshot.forEach((childSnap) => { itemsArr.push(childSnap.val()); });
        itemsArr.reverse();

        let itemsHTML = '';
        itemsArr.forEach(item => {
            let statusClass = 'status-pending';
            let statusText = item.status || 'Pending';
            if (statusText.toLowerCase() === 'approved') statusClass = 'status-approved';
            if (statusText.toLowerCase() === 'rejected') statusClass = 'status-rejected';

            let extraInfo = item.operator ? `${item.operator} - ${item.accountType}` : (item.accountType || 'Personal');
            let methodTitle = `${item.method || 'Cashout'} (${extraInfo})`;
            let pointsText = `${item.pointsDeducted || 0} Pts (৳${item.amountBdt || 0})`;
            let targetDetail = item.phone || '';
            let dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

            itemsHTML += `
                <div class="history-item-card">
                    <div>
                        <div style="font-size: 14px; font-weight: 800; color: #ffffff;">${escapeHtml(methodTitle)}</div>
                        <div style="font-size: 12px; color: #00f2fe; margin-top: 3px; font-weight: 700;">${escapeHtml(targetDetail)}</div>
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${dateStr}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 15px; font-weight: 900; color: #00f5a0;">${pointsText}</div>
                        <div style="margin-top: 5px;">
                            <span class="history-status-badge ${escapeHtml(statusClass)}">${escapeHtml(statusText)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = itemsHTML;
    });
}
