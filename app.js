/**
 * EARNHUB PRO - ADVANCED CLIENT ENGINE (v5.1.0)
 * Dual Language Engine: 100% Pure English <--> 100% Pure Bengali
 * Includes Support Handler, Full Bengali Numeral Conversion and Shine-Sync
 */

// ================= ১. ওয়েব অডিও সিন্থেসাইজার =================
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
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
}

function playRewardSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        osc.frequency.setValueAtTime(1350, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) { }
}

// ================= ২. টেলিগ্রাম SDK ও হ্যাপটিক =================
const tg = window.Telegram?.WebApp;
if (tg) {
    try {
        tg.ready();
        tg.expand();
        if (typeof tg.requestFullscreen === 'function') tg.requestFullscreen();
        if (typeof tg.enableClosingConfirmation === 'function') tg.enableClosingConfirmation();
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
    toast.className = 'toast-msg';
    if (type === 'error') toast.style.borderColor = '#ef4444';
    toast.innerText = message;
    container.appendChild(toast);
    triggerHaptic(type === 'error' ? 'notification_error' : 'notification_success');

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#00e599', '#0098ea', '#ffffff']
        });
    }
}

// ================= ৩. ফায়ারবেস কনফিগারেশন =================
const firebaseConfig = {
  apiKey: "AIzaSyDj-9ox7l6tRO9hYr9chF7MxWwkCTRchEA",
  authDomain: "enjoy-movies-app.firebaseapp.com",
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

// ================= ৪. ভাষা ডিকশনারি ও অনুবাদক =================
let currentLang = localStorage.getItem('app_lang') || 'en';

const bnDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};

function formatNum(val) {
    const s = String(val);
    if (currentLang !== 'bn') return s;
    return s.replace(/\d/g, d => bnDigits[d]);
}

const translations = {
    en: {
        welcome_badge: "WELCOME REWARD",
        welcome_title: "Welcome to Our Platform!",
        welcome_desc_1: "You have received",
        welcome_desc_2: "points as a welcome reward!",
        btn_claim_welcome: "Claim Welcome Bonus",
        user_status: "● Active Member",
        wallet_balance_label: "Main Wallet Balance",
        pts_currency: "PTS",
        today_task_title: "Daily Tasks Progress",
        section_tasks_title: "Official Sponsored Tasks",
        section_tasks_sub: "Tap any card to preview & execute",
        badge_rewarded: "REWARDED INTERSTITIAL",
        badge_direct: "SPONSOR VISIT",
        monetag_title: "Monetag Rewarded",
        monetag_desc: "Watch full sponsored video to credit instant points",
        adsgram_title: "Adsgram Ad Stream",
        adsgram_desc: "High-CPM interstitial and video ad experience",
        adsterra_title: "Direct Sponsor Link",
        adsterra_desc: "Explore sponsored partner link for 10-12 seconds",
        btn_start_task: "Start Task",
        refer_badge: "REFER & EARN",
        refer_heading: "Invite Friends & Earn Together",
        refer_sub_1: "Earn",
        refer_sub_2: "points for every active invitee!",
        btn_copy: "Copy",
        btn_share_telegram: "Share via Telegram",
        stat_total_ref: "Total Referrals",
        stat_ref_earnings: "Bonus Earned",
        withdraw_bal_label: "Current Withdrawable Balance",
        method_recharge: "Recharge",
        method_bkash: "bKash",
        method_nagad: "Nagad",
        label_operator: "Select Mobile Operator:",
        label_sim_type: "SIM Connection Type:",
        label_phone: "Account Number:",
        label_points: "Points Amount:",
        label_min: "Min:",
        label_you_will_get: "You will receive:",
        btn_submit_cashout: "Submit Cashout Request",
        btn_view_history: "View Withdrawal History",
        profile_stat_bal: "Balance",
        profile_stat_ref: "Referrals",
        menu_payment_history: "Payment & Payout History",
        menu_daily_bonus: "7-Day Streak Rewards",
        menu_support: "24/7 Help & Support",
        menu_tg_support: "Telegram Official Channel",
        footer_caption: "EarnHub Pro v5.1.0 • Verified Telegram WebApp",
        fv_task_details: "Task Overview",
        fv_m_reward: "Task Reward",
        fv_m_limit: "Daily Progress",
        fv_m_status: "Status",
        fv_active: "● Active",
        fv_rules_title: "How to Complete This Task?",
        fv_rule_step1: 'Tap the <strong>"Watch Ad & Earn Points"</strong> action button below.',
        fv_rule_step2: "Do not press back or close the screen while the advertisement is streaming.",
        fv_rule_step3: "Upon verified completion, reward points will immediately credit to your balance.",
        btn_watch_and_earn: "Watch Ad & Earn Points",
        checkin_modal_title: "7-Day Daily Gifts",
        history_modal_title: "Cashout Transaction History",
        loading_text: "Loading records...",
        nav_home: "Home",
        nav_refer: "Refer",
        nav_withdraw: "Cashout",
        nav_profile: "Profile",
        toast_limit_reached: "⚠️ Today's ad task limit is reached!",
        toast_preparing_ad: "⚡ Loading advertisement...",
        toast_starting_ad: "🎬 Starting advertisement...",
        toast_ad_failed: "⚠️ Advertisement cancelled or failed to load.",
        toast_sdk_error: "⚠️ Ad SDK failed to initialize!",
        toast_wait: "⏳ Please wait",
        toast_pts_credited: "🎉 +{pts} points credited successfully!",
        toast_min_limit: "⚠️ Minimum withdrawal is {pts} points.",
        toast_valid_phone: "⚠️ Please enter a valid 11-digit mobile number.",
        toast_insufficient_bal: "⚠️ Insufficient balance in your account.",
        toast_cashout_success: "⚡ {method} request submitted successfully!",
        toast_cashout_error: "⚠️ Insufficient points or database error.",
        toast_already_claimed: "⚠️ You have already claimed today's gift!",
        toast_claim_success: "🎉 Day {day} reward +{pts} points added!",
        toast_link_copied: "✅ Referral link copied to clipboard!",
        checkin_day_text: "Day {day}",
        checkin_streak_text: "Current Streak: {day} Days",
        checkin_claimed_btn: "✅ Today's Gift Claimed",
        checkin_claim_btn: "🎁 Claim Today's Gift (+{pts} PTS)",
        home_streak_claimed: "Streak: {day} Days (Claimed)",
        home_streak_ready: "Day {day} Reward",
        empty_history: "No withdrawal history found."
    },
    bn: {
        welcome_badge: "স্বাগতম উপহার",
        welcome_title: "আমাদের প্ল্যাটফর্মে স্বাগতম!",
        welcome_desc_1: "যোগ দেওয়ার জন্য আপনি পেয়েছেন",
        welcome_desc_2: "পয়েন্ট ওয়েলকাম বোনাস!",
        btn_claim_welcome: "বোনাস সংগ্রহ করুন",
        user_status: "● সক্রিয় সদস্য",
        wallet_balance_label: "মূল ওয়ালেট ব্যালেন্স",
        pts_currency: "পয়েন্ট",
        today_task_title: "দৈনিক টাস্ক প্রোগ্রেস",
        section_tasks_title: "অফিসিয়াল স্পনসর টাস্ক",
        section_tasks_sub: "বিস্তারিত দেখতে যেকোনো কার্ডে চাপুন",
        badge_rewarded: "রিওয়ার্ডেড বিজ্ঞাপন",
        badge_direct: "স্পনসর ভিজিট",
        monetag_title: "মানেট্যাগ রিওয়ার্ডেড",
        monetag_desc: "সম্পূর্ণ ভিডিও বিজ্ঞাপন দেখে সরাসরি পয়েন্ট যোগ করুন",
        adsgram_title: "অ্যাডসগ্রাম অ্যাড স্ট্রিম",
        adsgram_desc: "উচ্চ সি-পি-এম ভিডিও এবং ইন্টারস্টিশিয়াল বিজ্ঞাপন",
        adsterra_title: "সরাসরি স্পনসর লিংক",
        adsterra_desc: "স্পনসর পেজটিতে ১০-১২ সেকেন্ড সক্রিয়ভাবে ভিজিট করুন",
        btn_start_task: "টাস্ক শুরু",
        refer_badge: "রেফার ও আয়",
        refer_heading: "বন্ধুদের আমন্ত্রণ জানিয়ে আয় করুন",
        refer_sub_1: "প্রতি সফল রেফারে সরাসরি পাবেন",
        refer_sub_2: "পয়েন্ট ইনস্ট্যান্ট বোনাস!",
        btn_copy: "কপি",
        btn_share_telegram: "টেলিগ্রামে পাঠান",
        stat_total_ref: "মোট রেফারেল",
        stat_ref_earnings: "অর্জিত পয়েন্ট",
        withdraw_bal_label: "উত্তোলনযোগ্য মূল ব্যালেন্স",
        method_recharge: "রিচার্জ",
        method_bkash: "বিকাশ",
        method_nagad: "নগদ",
        label_operator: "মোবাইল অপারেটর নির্বাচন করুন:",
        label_sim_type: "সিম সংযোগ ধরন:",
        label_phone: "অ্যাকাউন্ট নম্বর:",
        label_points: "পয়েন্ট পরিমাণ:",
        label_min: "সর্বনিম্ন:",
        label_you_will_get: "আপনি পাবেন:",
        btn_submit_cashout: "ক্যাশআউট রিকোয়েস্ট পাঠান",
        btn_view_history: "উত্তোলনের হিস্ট্রি দেখুন",
        profile_stat_bal: "ব্যালেন্স",
        profile_stat_ref: "রেফারেল",
        menu_payment_history: "পেমেন্ট ও উত্তোলন হিস্ট্রি",
        menu_daily_bonus: "৭ দিনের ধারাবাহিক উপহার",
        menu_support: "২৪/৭ হেল্প ও সাপোর্ট",
        menu_tg_support: "টেলিগ্রাম অফিসিয়াল চ্যানেল",
        footer_caption: "আর্নহাব প্রো সংস্করণ ৫.১.০ • টেলিগ্রাম মিনি অ্যাপ",
        fv_task_details: "টাস্ক বিবরণ",
        fv_m_reward: "টাস্ক রিওয়ার্ড",
        fv_m_limit: "দৈনিক লিমিট",
        fv_m_status: "স্ট্যাটাস",
        fv_active: "● সক্রিয়",
        fv_rules_title: "কীভাবে টাস্কটি সম্পন্ন করবেন?",
        fv_rule_step1: 'নিচের <strong>"বিজ্ঞাপন দেখুন ও পয়েন্ট নিন"</strong> বাটনে চাপুন।',
        fv_rule_step2: "বিজ্ঞাপন চলাকালীন স্ক্রিন বন্ধ করবেন না বা ব্যাক করবেন না।",
        fv_rule_step3: "বিজ্ঞাপন সম্পূর্ণ হলে স্বয়ংক্রিয়ভাবে ব্যালেন্সে পয়েন্ট যোগ হবে।",
        btn_watch_and_earn: "বিজ্ঞাপন দেখুন ও পয়েন্ট নিন",
        checkin_modal_title: "৭ দিনের দৈনিক উপহার",
        history_modal_title: "ক্যাশআউট লেনদেন হিস্ট্রি",
        loading_text: "ডাটা লোড হচ্ছে...",
        nav_home: "হোম",
        nav_refer: "রেফার",
        nav_withdraw: "উত্তোলন",
        nav_profile: "প্রোফাইল",
        toast_limit_reached: "⚠️ আজকের বিজ্ঞাপন দেখার সীমা শেষ হয়েছে!",
        toast_preparing_ad: "⚡ বিজ্ঞাপন প্রস্তুত হচ্ছে...",
        toast_starting_ad: "🎬 বিজ্ঞাপন শুরু হচ্ছে...",
        toast_ad_failed: "⚠️ বিজ্ঞাপন বাতিল করা হয়েছে বা লোড হয়নি।",
        toast_sdk_error: "⚠️ অ্যাড এসডিকে লোড হতে পারেনি!",
        toast_wait: "⏳ অপেক্ষা করুন",
        toast_pts_credited: "🎉 +{pts} পয়েন্ট অ্যাকাউন্টে যোগ হয়েছে!",
        toast_min_limit: "⚠️ সর্বনিম্ন উত্তোলন {pts} পয়েন্ট হতে হবে।",
        toast_valid_phone: "⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।",
        toast_insufficient_bal: "⚠️ অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।",
        toast_cashout_success: "⚡ {method} রিকোয়েস্ট সফলভাবে জমা হয়েছে!",
        toast_cashout_error: "⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা ডাটাবেজ ত্রুটি।",
        toast_already_claimed: "⚠️ আজকের বোনাস ইতিমধ্যে নেওয়া হয়েছে!",
        toast_claim_success: "🎉 দিন {day}-এর বোনাস +{pts} পয়েন্ট যোগ হয়েছে!",
        toast_link_copied: "✅ রেফারেল লিংক কপি করা হয়েছে!",
        checkin_day_text: "দিন {day}",
        checkin_streak_text: "বর্তমান স্ট্রিক: {day} দিন",
        checkin_claimed_btn: "✅ আজকের উপহার নেওয়া হয়েছে",
        checkin_claim_btn: "🎁 আজকের উপহার সংগ্রহ করুন (+{pts} পয়েন্ট)",
        home_streak_claimed: "স্ট্রিক: {day} দিন (নেওয়া হয়েছে)",
        home_streak_ready: "দিন {day} উপহার",
        empty_history: "কোনো উত্তোলনের রেকর্ড পাওয়া যায়নি।"
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
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    const langInd = document.getElementById('lang-indicator');
    if (langInd) langInd.innerText = currentLang === 'en' ? 'BN' : 'EN';

    const step1 = document.getElementById('step-num-1');
    const step2 = document.getElementById('step-num-2');
    const step3 = document.getElementById('step-num-3');
    if (step1) step1.innerText = formatNum(1);
    if (step2) step2.innerText = formatNum(2);
    if (step3) step3.innerText = formatNum(3);

    updateDropdownOptions();
    updateUI();
    renderCheckInGrid();
}

function toggleLanguage() {
    playClickSound();
    triggerHaptic('light');
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    localStorage.setItem('app_lang', currentLang);
    applyLanguage();
    showToast(currentLang === 'en' ? 'Switched to English' : 'ভাষা বাংলায় পরিবর্তন করা হয়েছে');
}

function updateDropdownOptions() {
    const selectAcc = document.getElementById('withdraw-account-type');
    if (!selectAcc) return;

    if (selectedWithdrawMethod === 'recharge') {
        selectAcc.innerHTML = currentLang === 'bn' 
            ? '<option value="Prepaid">প্রিপেইড</option><option value="Postpaid">পোস্টপেইড</option>'
            : '<option value="Prepaid">Prepaid</option><option value="Postpaid">Postpaid</option>';
    } else {
        selectAcc.innerHTML = currentLang === 'bn'
            ? '<option value="Personal">পার্সোনাল</option><option value="Agent">এজেন্ট</option>'
            : '<option value="Personal">Personal</option><option value="Agent">Agent</option>';
    }
}

// ================= ৫. স্টেট ম্যানেজমেন্ট ও ইউজার অবজেক্ট =================
let tgUser = tg?.initDataUnsafe?.user;
if (!tgUser || !tgUser.id) {
    tgUser = {
        id: "87654321",
        first_name: "Demo",
        last_name: "User",
        username: "demotester"
    };
}

const userId = tgUser.id.toString();
const userName = (tgUser.first_name || 'User') + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@user_' + userId.slice(-4);

let balancePoints = 0;
let adsWatchedCount = 0;
let referralCount = 0;
let referralEarnings = 0;
let lastCheckInDate = "";
let checkInStreak = 0;

const checkInRewards = [10, 20, 30, 45, 60, 80, 150];

let targetAds = 20;
let pointsToBdtRate = 0.10;
let minWithdrawPoints = 200;
let referralBonusPoints = 50;
let welcomeBonusPoints = 100;
let myReferralLink = `https://t.me/?startapp=ref_${userId}`;

let selectedWithdrawMethod = 'recharge';
let selectedNetwork = 'monetag';

let netConfigs = {
    monetag: { zoneId: "8765432", reward: 15 },
    adsgram: { rewardedBlockId: "26019", interstitialBlockId: "26020", mode: "swap", reward: 20 },
    adsterra: { url: "https://beta.publishers.adsterra.com/direct-link-sample", reward: 15 }
};

let adsgramNextFormat = 'rewarded';

function localDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

function getReferrerId() {
    let param = tg?.initDataUnsafe?.start_param;
    if (!param) {
        const urlParams = new URLSearchParams(window.location.search);
        param = urlParams.get('startapp') || urlParams.get('tgWebAppStartParam') || urlParams.get('start');
    }
    if (param) {
        if (param.startsWith('ref_')) return param.replace('ref_', '');
        if (/^\d+$/.test(param)) return param;
    }
    return null;
}
const referrerId = getReferrerId();

// ================= ৬. ফায়ারবেস অ্যাডমিন কনফিগ সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    targetAds = Number(data.targetAds ?? 20);
    pointsToBdtRate = Number(data.pointsToBdtRate ?? 0.10);
    referralBonusPoints = Number(data.referralBonusPoints ?? 50);
    welcomeBonusPoints = Number(data.welcomeBonusPoints ?? 100);

    netConfigs.monetag.zoneId = data.monetagZoneId || "8765432";
    netConfigs.monetag.reward = Number(data.rewardMonetagPoints ?? 15);

    netConfigs.adsgram.rewardedBlockId = data.adsgramRewardedBlockId || data.adsgramBlockId || "26019";
    netConfigs.adsgram.interstitialBlockId = data.adsgramInterstitialBlockId || "26020";
    netConfigs.adsgram.mode = (data.adsgramMode || "swap").toLowerCase();
    netConfigs.adsgram.reward = Number(data.rewardAdsgramPoints ?? 20);

    netConfigs.adsterra.url = data.adsterraUrl || "https://beta.publishers.adsterra.com/direct-link-sample";
    netConfigs.adsterra.reward = Number(data.rewardAdsterraPoints ?? 15);

    if (netConfigs.monetag.zoneId) {
        const monetagScript = document.getElementById('monetag-sdk');
        if (monetagScript) {
            monetagScript.src = '//niphaumeenses.net/vignette.min.js';
            monetagScript.setAttribute('data-zone', netConfigs.monetag.zoneId);
            monetagScript.setAttribute('data-sdk', `show_${netConfigs.monetag.zoneId}`);
        }
    }

    if (data.botUsername) {
        myReferralLink = data.appShortName 
            ? `https://t.me/${data.botUsername}/${data.appShortName}?startapp=ref_${userId}`
            : `https://t.me/${data.botUsername}?start=ref_${userId}`;
        const refDisplay = document.getElementById('referral-link-display');
        if (refDisplay) refDisplay.innerText = myReferralLink;
    }

    // সাপোর্ট লিঙ্ক সিঙ্ক (যদি ডাটাবেজে থাকে তবে সেট হবে অথবা ডিফল্ট সাপোর্ট)
    const supportLinkEl = document.getElementById('telegram-support-link');
    const channelLinkEl = document.getElementById('telegram-channel-link');

    const supportUrl = data.supportUrl || data.telegramSupport || (data.botUsername ? `https://t.me/${data.botUsername}?start=support` : 'https://t.me/');
    if (supportLinkEl) supportLinkEl.href = supportUrl.startsWith('http') ? supportUrl : `https://t.me/${supportUrl.replace('@', '')}`;

    if (data.telegramChannel && channelLinkEl) {
        channelLinkEl.href = data.telegramChannel.startsWith('http') ? data.telegramChannel : `https://t.me/${data.telegramChannel.replace('@', '')}`;
    }

    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = formatNum(netConfigs.monetag.reward));
    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = formatNum(netConfigs.adsgram.reward));
    document.querySelectorAll('.reward-adsterra-val').forEach(el => el.innerText = formatNum(netConfigs.adsterra.reward));

    const wbModal = document.getElementById('welcome-bonus-modal');
    if (wbModal) wbModal.innerText = formatNum(welcomeBonusPoints);

    const refBonusEl = document.getElementById('display-ref-bonus');
    if (refBonusEl) refBonusEl.innerText = formatNum(referralBonusPoints);

    updateUI();
});

// ================= ৭. ইউজার ইনিশিয়ালাইজেশন =================
function initUser() {
    const today = localDateKey();
    const userRef = db.ref('users/' + userId);

    userRef.once('value', (snap) => {
        if (!snap.exists()) {
            balancePoints = welcomeBonusPoints;
            const newUser = {
                name: userName,
                username: userUsername,
                balance: balancePoints,
                adsWatchedCount: 0,
                referralCount: 0,
                referralEarnings: 0,
                referredBy: (referrerId && referrerId !== userId) ? referrerId : null,
                lastAdDate: today,
                lastCheckInDate: "",
                checkInStreak: 0,
                joinedAt: new Date().toISOString()
            };

            userRef.set(newUser).then(() => {
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

        userRef.on('value', (s) => {
            const data = s.val();
            if (!data) return;

            balancePoints = Math.round(Number(data.balance || 0));
            adsWatchedCount = Number(data.adsWatchedCount || 0);
            referralCount = Number(data.referralCount || 0);
            referralEarnings = Math.round(Number(data.referralEarnings || 0));
            lastCheckInDate = data.lastCheckInDate || "";
            checkInStreak = Number(data.checkInStreak || 0);

            if (data.lastAdDate !== today) {
                adsWatchedCount = 0;
                userRef.update({
                    adsWatchedCount: 0,
                    lastAdDate: today
                });
            }

            updateUI();
            renderCheckInGrid();
        });
    });
}

function updateUI() {
    const setElem = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElem('user-balance', formatNum(balancePoints));
    setElem('withdraw-page-balance', formatNum(balancePoints));
    setElem('profile-stat-balance', `${formatNum(balancePoints)} ${t('pts_currency')}`);
    setElem('profile-stat-ref', `${formatNum(referralCount)} ${currentLang === 'bn' ? 'জন' : 'Users'}`);
    setElem('home-ref-count', formatNum(referralCount));
    setElem('home-ref-earnings', formatNum(referralEarnings));

    setElem('home-ad-counter', `${formatNum(adsWatchedCount)} / ${formatNum(targetAds)}`);
    const pct = Math.min((adsWatchedCount / targetAds) * 100, 100);
    const fill = document.getElementById('home-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const fvLimit = document.getElementById('fv-limit-count');
    if (fvLimit) fvLimit.innerText = `${formatNum(adsWatchedCount)} / ${formatNum(targetAds)}`;

    const rateTextEl = document.getElementById('display-point-rate-text');
    if (rateTextEl) {
        const bdtCalc = (100 * pointsToBdtRate).toFixed(2);
        rateTextEl.innerText = `${formatNum(100)} ${t('pts_currency')} = ${formatNum(bdtCalc)} ৳`;
    }

    const minWithdrawEl = document.getElementById('display-min-withdraw');
    if (minWithdrawEl) minWithdrawEl.innerText = formatNum(minWithdrawPoints);

    const modeTag = document.getElementById('adsgram-mode-tag');
    if (modeTag) {
        modeTag.innerText = netConfigs.adsgram.mode === 'swap' ? (currentLang === 'bn' ? 'অ্যাডসগ্রাম সোয়াপ' : 'ADSGRAM SWAP') : (netConfigs.adsgram.mode.toUpperCase());
    }

    const pId = document.getElementById('profile-page-id');
    if (pId) pId.innerText = `ID: #${formatNum(userId)}`;
}

// ================= ৮. ফুলভিউ অ্যাড স্ক্রিন কন্ট্রোলার =================
function openNetworkFullView(networkKey) {
    playClickSound();
    triggerHaptic('light');
    selectedNetwork = networkKey;
    const screen = document.getElementById('network-fullview');

    const details = {
        monetag: {
            badge: currentLang === 'bn' ? "মানেট্যাগ পার্টনার" : "MONETAG OFFICIAL",
            headline: currentLang === 'bn' ? "মানেট্যাগ রিওয়ার্ডেড টাস্ক" : "Monetag Rewarded Task",
            desc: currentLang === 'bn' ? "ভিডিওটি সম্পূর্ণ দেখলে সরাসরি পয়েন্ট অ্যাকাউন্টে যোগ হবে।" : "Watch the complete sponsored video to credit points to your account balance.",
            iconClass: "task-blue",
            iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-2 10h8L7 22l2-10H1z"/></svg>`
        },
        adsgram: {
            badge: currentLang === 'bn' ? `অ্যাডসগ্রাম স্ট্রিম` : `ADSGRAM STREAM`,
            headline: currentLang === 'bn' ? "অ্যাডসগ্রাম স্পনসর টাস্ক" : "Adsgram Sponsored Task",
            desc: currentLang === 'bn' ? "বিজ্ঞাপন সম্পন্ন হওয়া মাত্রই রিওয়ার্ড পয়েন্ট নিশ্চিত করা হবে।" : "Complete the video or interstitial stream to claim instant reward.",
            iconClass: "task-mint",
            iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="5" rx="2"/><polyline points="10 9 15 12.5 10 16"/></svg>`
        },
        adsterra: {
            badge: currentLang === 'bn' ? "স্পনসর ভিজিট" : "SPONSOR DIRECT VISIT",
            headline: currentLang === 'bn' ? "স্পনসর ওয়েবসাইট ভিজিট" : "Sponsor Website Visit",
            desc: currentLang === 'bn' ? "স্পনসর পেইজে ১০-১২ সেকেন্ড সক্রিয়ভাবে ভিজিট সম্পন্ন করুন।" : "Visit the sponsor page actively for 10-12 seconds to unlock points.",
            iconClass: "task-purple",
            iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
        }
    };

    const info = details[networkKey];
    const iconBox = document.getElementById('fv-icon-box');
    if (iconBox) {
        iconBox.innerHTML = info.iconSvg;
        iconBox.className = `fv-icon-box ${info.iconClass}`;
    }

    document.getElementById('fv-badge').innerText = info.badge;
    document.getElementById('fv-headline').innerText = info.headline;
    document.getElementById('fv-desc').innerText = info.desc;
    document.getElementById('fv-reward-amount').innerText = `+${formatNum(netConfigs[networkKey].reward)} ${t('pts_currency')}`;
    document.getElementById('fv-limit-count').innerText = `${formatNum(adsWatchedCount)} / ${formatNum(targetAds)}`;
    document.getElementById('fv-btn-text').innerText = t('btn_watch_and_earn');

    screen.classList.add('active');

    if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(closeNetworkFullView);
    }
}

function closeNetworkFullView() {
    playClickSound();
    triggerHaptic('light');
    const screen = document.getElementById('network-fullview');
    if (screen) screen.classList.remove('active');

    if (tg?.BackButton) {
        tg.BackButton.hide();
    }
}

async function executeCurrentNetworkAd() {
    playClickSound();
    triggerHaptic('medium');

    if (adsWatchedCount >= targetAds) {
        return showToast(t('toast_limit_reached'), 'error');
    }

    const actionBtn = document.getElementById('fv-action-btn');
    actionBtn.disabled = true;

    try {
        if (selectedNetwork === 'monetag') {
            const sdkFunc = window[`show_${netConfigs.monetag.zoneId}`];
            if (typeof sdkFunc === 'function') {
                showToast(t('toast_preparing_ad'));
                try {
                    await sdkFunc({ type: 'rewarded' });
                    await creditPoints(netConfigs.monetag.reward);
                    closeNetworkFullView();
                } catch (sdkErr) {
                    window.open(`https://omulgous.com/4/${netConfigs.monetag.zoneId}`, '_blank');
                    handleTimedTask(netConfigs.monetag.reward);
                }
            } else {
                window.open(`https://omulgous.com/4/${netConfigs.monetag.zoneId}`, '_blank');
                handleTimedTask(netConfigs.monetag.reward);
            }
        }
        else if (selectedNetwork === 'adsgram') {
            if (typeof window.Adsgram === 'undefined') {
                actionBtn.disabled = false;
                return showToast(t('toast_sdk_error'), 'error');
            }

            let blockIdToUse = netConfigs.adsgram.rewardedBlockId;
            if (netConfigs.adsgram.mode === 'swap') {
                if (adsgramNextFormat === 'rewarded') {
                    blockIdToUse = netConfigs.adsgram.rewardedBlockId;
                    adsgramNextFormat = 'interstitial';
                } else {
                    blockIdToUse = netConfigs.adsgram.interstitialBlockId;
                    adsgramNextFormat = 'rewarded';
                }
            } else if (netConfigs.adsgram.mode === 'interstitial') {
                blockIdToUse = netConfigs.adsgram.interstitialBlockId;
            } else {
                blockIdToUse = netConfigs.adsgram.rewardedBlockId;
            }

            showToast(t('toast_starting_ad'));
            const adController = window.Adsgram.init({ blockId: blockIdToUse });
            await adController.show();
            await creditPoints(netConfigs.adsgram.reward);
            closeNetworkFullView();
        }
        else if (selectedNetwork === 'adsterra') {
            window.open(netConfigs.adsterra.url, '_blank');
            handleTimedTask(netConfigs.adsterra.reward);
        }
    } catch (err) {
        showToast(t('toast_ad_failed'), 'error');
    } finally {
        actionBtn.disabled = false;
    }
}

function handleTimedTask(pointsReward) {
    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');
    let timerSeconds = 12;
    btnText.innerText = `${t('toast_wait')} (${formatNum(timerSeconds)}s)...`;

    const countdown = setInterval(() => {
        timerSeconds--;
        if (timerSeconds > 0) {
            btnText.innerText = `${t('toast_wait')} (${formatNum(timerSeconds)}s)...`;
        } else {
            clearInterval(countdown);
            creditPoints(pointsReward);
            btnText.innerText = t('btn_watch_and_earn');
            actionBtn.disabled = false;
            closeNetworkFullView();
        }
    }, 1000);
}

async function creditPoints(reward) {
    const today = localDateKey();
    const userRef = db.ref('users/' + userId);

    const result = await userRef.transaction(current => {
        if (!current) return;
        const count = current.lastAdDate === today ? Number(current.adsWatchedCount || 0) : 0;
        if (count >= targetAds) return;
        current.balance = Math.round(Number(current.balance || 0) + reward);
        current.adsWatchedCount = count + 1;
        current.lastAdDate = today;
        return current;
    });

    if (result.committed) {
        playRewardSound();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(t('toast_pts_credited', { pts: reward }));
    }
}

// ================= ৯. ক্যাশআউট / উত্তোলন কন্ট্রোলার =================
function switchWithdrawMethod(method) {
    playClickSound();
    triggerHaptic('light');
    selectedWithdrawMethod = method;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-method-${method}`);
    if (activeBtn) activeBtn.classList.add('active');

    const grpOperator = document.getElementById('group-operator');
    const labelAcc = document.getElementById('label-acc-type');
    const phoneInput = document.getElementById('withdraw-phone');

    if (method === 'recharge') {
        if (grpOperator) grpOperator.style.display = 'block';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'সিম সংযোগ ধরন:' : 'SIM Connection Type:';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX';
        minWithdrawPoints = 200;
    } else {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'অ্যাকাউন্টের ধরন:' : 'Account Type:';
        if (phoneInput) phoneInput.placeholder = method === 'bkash' ? '01XXXXXXXXX (bKash)' : '01XXXXXXXXX (Nagad)';
        minWithdrawPoints = 500;
    }

    updateDropdownOptions();
    const minWithdrawEl = document.getElementById('display-min-withdraw');
    if (minWithdrawEl) minWithdrawEl.innerText = formatNum(minWithdrawPoints);
    const ptsInput = document.getElementById('withdraw-points');
    if (ptsInput) ptsInput.min = minWithdrawPoints;
    calculateWithdrawBdt();
}

function calculateWithdrawBdt() {
    const ptsInput = document.getElementById('withdraw-points');
    const pointsValue = parseFloat(ptsInput ? ptsInput.value : 0) || 0;
    const previewBox = document.getElementById('withdraw-preview-summary');
    const bdtValueEl = document.getElementById('summary-bdt-val');

    if (pointsValue > 0) {
        if (previewBox) previewBox.style.display = 'flex';
        if (bdtValueEl) bdtValueEl.innerText = formatNum((pointsValue * pointsToBdtRate).toFixed(2));
    } else {
        if (previewBox) previewBox.style.display = 'none';
    }
}

async function handleWithdrawSubmit(event) {
    event.preventDefault();
    playClickSound();
    triggerHaptic('medium');

    const form = event.currentTarget;
    const submitBtn = document.getElementById('btn-submit-withdraw');
    const pointsToDeduct = Number(document.getElementById('withdraw-points').value);
    const phone = document.getElementById('withdraw-phone').value.trim();
    const accountType = document.getElementById('withdraw-account-type').value;
    const operator = selectedWithdrawMethod === 'recharge' 
        ? document.getElementById('withdraw-operator').value 
        : '';

    if (pointsToDeduct < minWithdrawPoints) {
        return showToast(t('toast_min_limit', { pts: minWithdrawPoints }), 'error');
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
        return showToast(t('toast_valid_phone'), 'error');
    }
    if (pointsToDeduct > balancePoints) {
        return showToast(t('toast_insufficient_bal'), 'error');
    }

    const calculatedBdt = (pointsToDeduct * pointsToBdtRate).toFixed(2);
    let methodName = 'Mobile Recharge';
    if (selectedWithdrawMethod === 'bkash') methodName = 'bKash';
    if (selectedWithdrawMethod === 'nagad') methodName = 'Nagad';

    if (submitBtn) submitBtn.disabled = true;

    try {
        const userRef = db.ref('users/' + userId);
        const tx = await userRef.transaction(current => {
            if (!current) return;
            const curBal = Number(current.balance || 0);
            if (curBal < pointsToDeduct) return;
            current.balance = Math.round(curBal - pointsToDeduct);
            return current;
        });

        if (!tx.committed) throw new Error('INSUFFICIENT_FUNDS');

        await db.ref('withdrawals').push({
            userId,
            userName,
            userUsername,
            method: methodName,
            operator,
            accountType,
            phone,
            pointsDeducted: pointsToDeduct,
            amountBdt: calculatedBdt,
            status: 'Pending',
            timestamp: new Date().toISOString()
        });

        form.reset();
        calculateWithdrawBdt();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(t('toast_cashout_success', { method: methodName }));
    } catch (err) {
        showToast(t('toast_cashout_error'), 'error');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// ================= ১০. উইথড্রয়াল হিস্ট্রি বটম শিট =================
function openWithdrawHistory() {
    playClickSound();
    triggerHaptic('light');
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) overlay.classList.add('active');
    loadHistoryData();

    if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(closeWithdrawHistory);
    }
}

function closeWithdrawHistory() {
    playClickSound();
    triggerHaptic('light');
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    if (tg?.BackButton) tg.BackButton.hide();
}

function loadHistoryData() {
    const listContainer = document.getElementById('history-scroll-list');
    if (!listContainer) return;
    listContainer.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;

    db.ref('withdrawals').orderByChild('userId').equalTo(userId).once('value', snapshot => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = `<div style="text-align:center; padding:24px; font-size:13px; color:#64748B;">${t('empty_history')}</div>`;
            return;
        }

        let itemsHTML = '';
        snapshot.forEach(child => {
            const item = child.val();
            const statusLower = (item.status || 'Pending').toLowerCase();
            const badgeClass = statusLower === 'approved' ? 'st-approved' : (statusLower === 'rejected' ? 'st-rejected' : 'st-pending');
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';

            let displayStatus = item.status;
            if (currentLang === 'bn') {
                if (statusLower === 'pending') displayStatus = 'অপেক্ষারত';
                else if (statusLower === 'approved') displayStatus = 'অনুমোদিত';
                else if (statusLower === 'rejected') displayStatus = 'বাতিল';
            }

            itemsHTML = `
                <div class="h-item shine-card">
                    <div>
                        <div class="h-title">${escapeHtml(item.method)} (${escapeHtml(item.phone)})</div>
                        <div class="h-date">${dateStr}</div>
                    </div>
                    <div>
                        <div class="h-pts">- ${formatNum(item.pointsDeducted)} ${t('pts_currency')}</div>
                        <div style="text-align:right;"><span class="h-badge ${badgeClass}">${escapeHtml(displayStatus)}</span></div>
                    </div>
                </div>
            ` + itemsHTML;
        });

        listContainer.innerHTML = itemsHTML;
    });
}

// ================= ১১. ডেইলি ৭-দিনের চেক-ইন সিস্টেম =================
function openCheckInFullView() {
    playClickSound();
    triggerHaptic('light');
    renderCheckInGrid();
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) sheet.classList.add('active');

    if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(closeCheckInFullView);
    }
}

function closeCheckInFullView() {
    playClickSound();
    triggerHaptic('light');
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) sheet.classList.remove('active');
    if (tg?.BackButton) tg.BackButton.hide();
}

function renderCheckInGrid() {
    const grid = document.getElementById('checkin-grid');
    const statusText = document.getElementById('checkin-streak-status');
    const homeStreakText = document.getElementById('home-streak-status');
    const claimBtn = document.getElementById('btn-claim-checkin');

    const today = localDateKey();
    const isClaimedToday = (lastCheckInDate === today);

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
        let itemClass = 'ci-day';

        if (isClaimedToday) {
            if (i <= checkInStreak) itemClass += ' claimed';
        } else {
            if (i < currentTargetDay) itemClass += ' claimed';
            else if (i === currentTargetDay) itemClass += ' active';
        }

        html += `
            <div class="${itemClass}">
                <span class="ci-num">${t('checkin_day_text', { day: i })}</span>
                <span class="ci-pts">+${formatNum(rewardPts)}</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.innerText = t('checkin_claimed_btn');
    } else {
        claimBtn.disabled = false;
        claimBtn.innerText = t('checkin_claim_btn', { pts: checkInRewards[currentTargetDay - 1] });
    }
}

async function claimDailyCheckIn() {
    playClickSound();
    triggerHaptic('medium');
    const today = localDateKey();
    const claimBtn = document.getElementById('btn-claim-checkin');

    if (lastCheckInDate === today) {
        return showToast(t('toast_already_claimed'), 'error');
    }

    if (claimBtn) claimBtn.disabled = true;
    const userRef = db.ref('users/' + userId);

    try {
        let earnedPoints = 0;
        const tx = await userRef.transaction(curr => {
            if (!curr || curr.lastCheckInDate === today) return;
            const newStreak = (Number(curr.checkInStreak || 0) % 7) + 1;
            earnedPoints = checkInRewards[newStreak - 1];

            curr.balance = Math.round(Number(curr.balance || 0) + earnedPoints);
            curr.checkInStreak = newStreak;
            curr.lastCheckInDate = today;
            return curr;
        });

        if (!tx.committed) return showToast(t('toast_already_claimed'), 'error');

        playRewardSound();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(t('toast_claim_success', { day: tx.snapshot.val().checkInStreak, pts: earnedPoints }));
        renderCheckInGrid();
    } catch (err) {
        showToast(t('toast_cashout_error'), 'error');
    } finally {
        if (claimBtn) claimBtn.disabled = false;
    }
}

// ================= ১২. লিংক শেয়ার ও ট্যাব সুইচ =================
function copyReferralLink() {
    playClickSound();
    triggerHaptic('light');
    navigator.clipboard.writeText(myReferralLink).then(() => {
        showToast(t('toast_link_copied'));
    });
}

function shareReferralLink() {
    playClickSound();
    triggerHaptic('light');
    const shareText = currentLang === 'bn' 
        ? `🎉 আমাদের আর্নহাব প্রো প্ল্যাটফর্মে যোগ দিন এবং সহজ বিজ্ঞাপন দেখে জিতে নিন পয়েন্ট!\n\n👇 জয়েন লিংক:\n${myReferralLink}`
        : `🎉 Join EarnHub Pro and earn verified points by completing simple sponsored tasks!\n\n👇 Join Link:\n${myReferralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
}

function switchTab(pageId) {
    playClickSound();
    triggerHaptic('light');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');

    const activeNav = document.querySelector(`.nav-tab[onclick*="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeWelcomeModal() {
    playRewardSound();
    triggerHaptic('light');
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.style.display = 'none';
    triggerConfetti();
}

// ================= ১৩. অ্যাপ ইনিট =================
document.addEventListener('DOMContentLoaded', () => {
    const initialLetter = (userName.charAt(0) || 'U').toUpperCase();
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

    applyLanguage();
    initUser();
    switchWithdrawMethod('recharge');

    let splashProgress = 0;
    const splashTimer = setInterval(() => {
        splashProgress += 25;
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
            }, 150);
        }
    }, 40);
});