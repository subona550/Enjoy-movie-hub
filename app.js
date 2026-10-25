// ================= অডিও সাউন্ড এফেক্ট =================
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
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
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
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) { }
}

// ================= হেল্পার ও ইউটিলিটি =================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
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
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function triggerConfettiAnimation() {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 }, zIndex: 999999 });
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================= লোকালাইজেশন (i18n) =================
let currentLang = localStorage.getItem('app_lang') || 'bn';
const checkInRewards = [1, 2, 3, 5, 6, 8, 15];

const i18n = {
    bn: {
        nav_home: "হোম", nav_refer: "রেফার", nav_withdraw: "উত্তোলনের", nav_support: "সাপোর্ট",
        header_sub: "প্রতিদিন ১০ মিনিট সময় দিন", welcome_title: "স্বাগতম আমাদের অ্যাপে!", welcome_desc: "আমাদের মিনি অ্যাপে যোগ দেওয়ার জন্য ধন্যবাদ! আপনি পাচ্ছেন",
        currency_bdt: "টাকা", welcome_suffix: "ওয়েলকাম বোনাস।", claim_bonus_btn: "🎁 বোনাস গ্রহণ করুন", balance_label: "ব্যালেন্স",
        slide1_badge: "🚀 ইনস্ট্যান্ট আর্নিং", slide1_prefix: "প্রতি টা এডের জন্য", slide1_suffix: "পাবেন", slide1_desc: "বিজ্ঞাপন শেষ হলেই সাথে সাথে অ্যাকাউন্টে টাকা যুক্ত হবে।",
        slide2_badge: "📱 ফাস্ট উইথড্র", slide2_title: "রিচার্জ ও USDT (BEP20)", slide2_desc: "মোবাইল রিচার্জ (৫০৳) ও USDT ($1) এ দ্রুত ক্যাশআউট সুবিধা।",
        slide3_badge: "🎁 রেফার এন্ড আর্ন", slide3_title: "রেফার করে ইনকাম করুন", slide3_desc: "বন্ধুদের শেয়ার করুন এবং প্রতিটি রেফারে পাবেন", slide3_suffix: "বোনাস!",
        balance_card_title: "💰 মূল ওয়ালেট ব্যালেন্স", status_active: "● এক্টিভ", ref_card_badge: "🎁 রেফারেল প্রোগ্রাম", ref_bonus_label: "বোনাস:",
        ref_hero_title: "বন্ধুদের রেফার করুন, আনলিমিটেড আয় করুন!", ref_hero_desc: "আপনার ইউনিক রেফারেল লিংক দিয়ে বন্ধুদের জয়েন করালেই তাৎক্ষণিক বোনাস মূল ওয়ালেটে পাবেন।", ref_stat_title: "📊 আপনার রেফারেল সামারি",
        ref_card_title: "আপনার ইনভাইট লিংক", copy_btn: "কপি করুন", stat_total_ref: "মোট রেফারেল", stat_ref_earn: "রেফারেল আয়",
        share_tg_btn: "✈️ টেলিগ্রামে শেয়ার করুন",
        withdraw_badge: "💸 উত্তোলন ও রিচার্জ", withdraw_title: "ইনস্ট্যান্ট ক্যাশআউট", wallet_bal_text: "বর্তমান ওয়ালেট ব্যালেন্স:", btn_recharge_method: "📱 মোবাইল রিচার্জ",
        btn_usdt_method: "🪙 USDT (BEP20)", min_recharge_text: "মোবাইল রিচার্জের সর্বনিম্ন লিমিট:", label_operator: "অপারেটর সিলেক্ট করুন:",
        select_operator_opt: "অপারেটর নির্বাচন করুন", label_sim_type: "সিম টাইপ:", sim_prepaid: "প্রিপেইড", sim_postpaid: "পোস্টপেইড",
        label_phone: "মোবাইল নম্বর:", label_recharge_amount: "রিচার্জের পরিমাণ (৳):", btn_submit_recharge: "⚡ রিচার্জ রিকোয়েস্ট পাঠান",
        min_usdt_text: "USDT উত্তোলনের সর্বনিম্ন লিমিট:", label_usdt_address: "USDT BEP-20 ওয়ালেট অ্যাড্রেস:", label_usdt_amount: "উত্তোলনের পরিমাণ ($ USDT):",
        summary_gross: "উত্তোলন পরিমাণ:", summary_fee: "১০% সার্ভিস ফি:", summary_receive: "আপনি পাবেন:", summary_bdt_deduct: "ওয়ালেট থেকে কাটবে:",
        btn_submit_usdt: "🪙 USDT উইথড্র রিকোয়েস্ট পাঠান", support_tg_badge: "✈️ টেলিগ্রাম", support_tg_title: "অফিশিয়াল টেলিগ্রাম চ্যানেল", join_tg_btn: "টেলিগ্রাম গ্রুপে যুক্ত হন",
        support_wa_badge: "💬 হোয়াটসঅ্যাপ", support_wa_title: "জরুরি হোয়াটসঅ্যাপ সাপোর্ট", msg_wa_btn: "হোয়াটসঅ্যাপে মেসেজ দিন",
        btn_withdraw_history: "উইথড্রয়াল হিস্ট্রি দেখুন", history_title: "📜 উইথড্রয়াল ইতিহাস", loading_text: "ডাটা লোড হচ্ছে...", no_history_withdraw: "কোন উইথড্রয়াল ইতিহাস পাওয়া যায়নি।",
        checkin_badge: "📅 ৭ দিনের দৈনিক উপহার", checkin_title: "ডেইলি লগইন বোনাস", checkin_desc: "প্রতিদিন লগইন করে ক্লেইম করুন এবং ৭ম দিনে জিতে নিন বিশেষ মেগা বোনাস!",
        checkin_btn_claim: "🎁 আজকের বোনাস সংগ্রহ করুন", checkin_btn_claimed: "✅ আজকের বোনাস নেওয়া হয়েছে",
        day_prefix: "দিন ", tag_done: "নেওয়া হয়েছে", tag_open: "ক্লেইম করুন", tag_lock: "লক"
    },
    en: {
        nav_home: "Home", nav_refer: "Refer", nav_withdraw: "Withdraw", nav_support: "Support",
        header_sub: "Spend 10 minutes daily", welcome_title: "Welcome to Our App!", welcome_desc: "Thank you for joining our Mini App! You get a",
        currency_bdt: "BDT", welcome_suffix: "welcome bonus.", claim_bonus_btn: "🎁 Claim Bonus", balance_label: "Balance",
        slide1_badge: "🚀 Instant Earning", slide1_prefix: "Per ad watch reward is", slide1_suffix: "BDT", slide1_desc: "Instantly credited to your balance after watching ads.",
        slide2_badge: "📱 Fast Withdraw", slide2_title: "Recharge & USDT (BEP20)", slide2_desc: "Fast cashout via Mobile Recharge (50৳) & USDT ($1).",
        slide3_badge: "🎁 Refer & Earn", slide3_title: "Earn Money by Referring", slide3_desc: "Share with friends and get", slide3_suffix: "bonus per invite!",
        balance_card_title: "💰 Main Wallet Balance", status_active: "● Active", ref_card_badge: "🎁 Referral Program", ref_bonus_label: "Bonus:",
        ref_hero_title: "Invite Friends & Earn Unlimited!", ref_hero_desc: "Share your referral link and earn instant cash bonuses directly into your main balance.", ref_stat_title: "📊 Your Referral Summary",
        ref_card_title: "Your Invite Link", copy_btn: "Copy Link", stat_total_ref: "Total Referrals", stat_ref_earn: "Referral Income",
        share_tg_btn: "✈️ Share on Telegram",
        withdraw_badge: "💸 Cashout & Recharge", withdraw_title: "Instant Cashout", wallet_bal_text: "Current Wallet Balance:", btn_recharge_method: "📱 Mobile Recharge",
        btn_usdt_method: "🪙 USDT (BEP20)", min_recharge_text: "Min Mobile Recharge limit:", label_operator: "Select Operator:",
        select_operator_opt: "Choose Operator", label_sim_type: "SIM Type:", sim_prepaid: "Prepaid", sim_postpaid: "Postpaid",
        label_phone: "Mobile Number:", label_recharge_amount: "Recharge Amount (৳):", btn_submit_recharge: "⚡ Send Recharge Request",
        min_usdt_text: "Min USDT withdraw limit:", label_usdt_address: "USDT BEP-20 Wallet Address:", label_usdt_amount: "Withdraw Amount ($ USDT):",
        summary_gross: "Gross Amount:", summary_fee: "10% Service Fee:", summary_receive: "You Receive:", summary_bdt_deduct: "Deducted from Wallet:",
        btn_submit_usdt: "🪙 Submit USDT Withdraw", support_tg_badge: "✈️ Telegram", support_tg_title: "Official Telegram Channel", join_tg_btn: "Join Telegram Channel",
        support_wa_badge: "💬 WhatsApp", support_wa_title: "Urgent WhatsApp Support", msg_wa_btn: "Message on WhatsApp",
        btn_withdraw_history: "View Withdraw History", history_title: "📜 Withdrawal History", loading_text: "Loading data...", no_history_withdraw: "No withdrawal history found.",
        checkin_badge: "📅 7-Day Daily Gifts", checkin_title: "Daily Login Bonus", checkin_desc: "Log in daily to claim rewards and unlock the Mega Bonus on Day 7!",
        checkin_btn_claim: "🎁 Claim Today's Bonus", checkin_btn_claimed: "✅ Already Claimed Today",
        day_prefix: "Day ", tag_done: "Claimed", tag_open: "Claim", tag_lock: "Locked"
    }
};

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.getElementById('lang-indicator').innerText = lang === 'bn' ? 'EN' : 'BN';
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
        progress += 25;
        if (progress <= 100) progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                splash.style.opacity = '0';
                splash.style.visibility = 'hidden';
            }, 300);
        }
    }, 100);
}

// ================= টেলিগ্রাম ওয়েবঅ্যাপ =================
const tg = window.Telegram?.WebApp;
if (tg) { 
    tg.ready(); 
    tg.expand();
    if (typeof tg.requestFullscreen === 'function') {
        try { tg.requestFullscreen(); } catch (e) { }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    startSplashScreen();
});

const tgUser = tg?.initDataUnsafe?.user;
if (!tgUser || !tgUser.id) {
    document.body.innerHTML = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; text-align:center; padding:20px; color:#ffffff; background-color:#05070f;"><div style="font-size:50px; margin-bottom:10px;">🚫</div><h2>Access Denied</h2><p style="font-size:13px; color:#cbd5e1;">Please open this app inside Telegram Bot.</p></div>`;
    throw new Error("Telegram required.");
}

const userId = tgUser.id.toString();
const userName = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@user_' + userId.substr(-4);

// ভ্যারিয়েবল ও অ্যাড নেটওয়ার্ক সেটিংস
let welcomeBonus = 10, targetAds = 20, minRecharge = 50, minUsdt = 1, usdtFeePercent = 10, usdtExchangeRate = 120, referralBonus = 5;
let balance = 0, adsWatchedCount = 0, referralCount = 0, referralEarnings = 0;
let lastCheckInDate = "", checkInStreak = 0;

// ৩টি অ্যাড নেটওয়ার্ক কনফিগ
let netConfigs = {
    adsgram: { blockId: "", reward: 2.0, countKey: "ads_adsgram" },
    monetag: { url: "", reward: 1.5, countKey: "ads_monetag" },
    adsterra: { url: "", reward: 1.5, countKey: "ads_adsterra" }
};
let selectedNetwork = 'adsgram';

let myReferralLink = "https://t.me/?startapp=ref_" + userId;
document.querySelectorAll('#referral-link-display').forEach(e => e.innerText = myReferralLink);

document.getElementById('top-profile-name').innerText = userName;
document.getElementById('top-profile-id').innerText = '#' + userId;

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

// ================= ফায়ারবেস সেটিংস রিড =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    welcomeBonus = Number(data.welcomeBonus ?? 10);
    targetAds = Number(data.targetAds ?? 20);
    minRecharge = Number(data.minRecharge ?? 50);
    minUsdt = Number(data.minUsdt ?? 1);
    usdtFeePercent = Number(data.usdtFeePercent ?? 10);
    usdtExchangeRate = Number(data.usdtExchangeRate ?? 120);
    referralBonus = Number(data.referralBonus ?? 5);

    // ৩টি নেটওয়ার্ক অ্যাডমিন কনফিগারেশন
    netConfigs.adsgram.blockId = data.adsgramBlockId || "";
    netConfigs.adsgram.reward = Number(data.rewardAdsgram ?? data.rewardAmount ?? 2);

    netConfigs.monetag.url = data.monetagUrl || "";
    netConfigs.monetag.reward = Number(data.rewardMonetag ?? 1.5);

    netConfigs.adsterra.url = data.adsterraUrl || "";
    netConfigs.adsterra.reward = Number(data.rewardAdsterra ?? 1.5);

    let BOT_USERNAME = data.botUsername || "";
    let APP_SHORT_NAME = data.appShortName || "";

    if (data.whatsappNumber) document.getElementById('whatsapp-support-link').href = `https://wa.me/${data.whatsappNumber}`;
    if (data.telegramChannel) document.getElementById('telegram-support-link').href = data.telegramChannel;

    if (BOT_USERNAME) {
        myReferralLink = APP_SHORT_NAME 
            ? `https://t.me/${BOT_USERNAME}/${APP_SHORT_NAME}?startapp=ref_${userId}` 
            : `https://t.me/${BOT_USERNAME}?start=ref_${userId}`;
    }
    document.querySelectorAll('#referral-link-display').forEach(e => e.innerText = myReferralLink);

    // কার্ডে রিওয়ার্ড ভ্যালু আপডেট
    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = netConfigs.adsgram.reward.toFixed(2));
    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = netConfigs.monetag.reward.toFixed(2));
    document.querySelectorAll('.reward-adsterra-val').forEach(el => el.innerText = netConfigs.adsterra.reward.toFixed(2));
    document.querySelectorAll('.banner-reward-amount').forEach(el => el.innerText = netConfigs.adsgram.reward);

    updateDynamicUI();
});

// ================= ইউজার ডাটা =================
db.ref('users/' + userId).once('value', (snapshot) => {
    const todayStr = localDateKey();

    if (!snapshot.exists()) {
        balance = welcomeBonus;
        let newUserObj = {
            name: userName,
            username: userUsername,
            balance: balance,
            adsWatchedCount: 0,
            ads_adsgram: 0,
            ads_monetag: 0,
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
                    curr.balance = Number(curr.balance || 0) + referralBonus;
                    curr.referralCount = Number(curr.referralCount || 0) + 1;
                    curr.referralEarnings = Number(curr.referralEarnings || 0) + referralBonus;
                    return curr;
                });
            }
        });
        document.getElementById('welcome-modal').style.display = 'flex';
    }

    db.ref('users/' + userId).on('value', (snap) => {
        const uData = snap.val();
        if (uData) {
            balance = Number(uData.balance || 0);
            adsWatchedCount = Number(uData.adsWatchedCount || 0);
            referralCount = Number(uData.referralCount || 0);
            referralEarnings = Number(uData.referralEarnings || 0);
            lastCheckInDate = uData.lastCheckInDate || "";
            checkInStreak = Number(uData.checkInStreak || 0);

            if (uData.lastAdDate !== todayStr) {
                adsWatchedCount = 0;
                db.ref('users/' + userId).update({
                    adsWatchedCount: 0,
                    ads_adsgram: 0,
                    ads_monetag: 0,
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
    document.getElementById('top-profile-balance').innerText = `৳ ${balance.toFixed(2)}`;
    document.getElementById('user-balance').innerText = `৳ ${balance.toFixed(2)}`;
    document.getElementById('recharge-page-balance').innerText = `৳ ${balance.toFixed(2)}`;
    document.querySelectorAll('#home-ref-count').forEach(e => e.innerText = `${referralCount} ${currentLang === 'bn' ? 'জন' : ''}`);
    document.querySelectorAll('#home-ref-earnings').forEach(e => e.innerText = `৳ ${referralEarnings.toFixed(2)}`);
}

function updateDynamicUI() {
    document.getElementById('welcome-bonus-modal').innerText = welcomeBonus;
    document.querySelectorAll('.banner-ref-bonus').forEach(e => e.innerText = referralBonus);
    document.querySelectorAll('#display-ref-bonus').forEach(e => e.innerText = referralBonus);
    document.querySelectorAll('.display-min-recharge').forEach(e => e.innerText = minRecharge);
    document.getElementById('display-min-usdt').innerText = minUsdt;
}

// ================= ইন-পেজ ফুল ভিউ হ্যান্ডলার (Full View Screen) =================
function openNetworkFullView(networkKey) {
    playClickSound();
    selectedNetwork = networkKey;
    const overlay = document.getElementById('network-fullview');

    const netDetails = {
        adsgram: {
            title: "Adsgram Video Task",
            badge: "OFFICIAL ADSGRAM SDK",
            icon: "🎬",
            headline: "ভিডিও বিজ্ঞাপন দেখুন",
            desc: "ভিডিওটি সম্পূর্ণ দেখুন, ভিডিও শেষ হলে আপনার অ্যাকাউন্টে টাকা ক্রেডিট হবে।"
        },
        monetag: {
            title: "Monetag Smart Link",
            badge: "MONETAG ON-CLICK SMART LINK",
            icon: "⚡",
            headline: "স্মার্ট লিঙ্ক ভিজিট করুন",
            desc: "নিচের বাটনে ক্লিক করে অফার লিঙ্কটি খুলুন এবং ১০-১৫ সেকেন্ড ব্রাউজ করুন।"
        },
        adsterra: {
            title: "Adsterra Direct Task",
            badge: "ADSTERRA PREMIUM DIRECT LINK",
            icon: "💎",
            headline: "অ্যাডস্টেরা হাই-সিপিএম টাস্ক",
            desc: "অ্যাডস্টেরা স্পনসর লিঙ্কটি ওপেন করুন ও সম্পূর্ণ লোড হওয়া পর্যন্ত ভিজিট করুন।"
        }
    };

    const info = netDetails[networkKey];
    document.getElementById('fv-network-title').innerText = info.title;
    document.getElementById('fv-badge').innerText = info.badge;
    document.getElementById('fv-icon').innerText = info.icon;
    document.getElementById('fv-headline').innerText = info.headline;
    document.getElementById('fv-desc').innerText = info.desc;
    document.getElementById('fv-reward-amount').innerText = `৳ ${netConfigs[networkKey].reward.toFixed(2)}`;
    document.getElementById('fv-limit-count').innerText = `${adsWatchedCount}/${targetAds}`;

    let percent = Math.min((adsWatchedCount / targetAds) * 100, 100);
    document.getElementById('fv-progress-bar').style.width = `${percent}%`;

    overlay.classList.add('active');
}

function closeNetworkFullView() {
    playClickSound();
    document.getElementById('network-fullview').classList.remove('active');
}

// ================= ৩টি নেটওয়ার্ক অ্যাড এক্সিকিউশন =================
async function executeCurrentNetworkAd() {
    playClickSound();
    if (adsWatchedCount >= targetAds) {
        return showToast(currentLang === 'bn' ? `⚠️ আজকের বিজ্ঞাপন সীমা (${targetAds}) শেষ হয়েছে।` : `⚠️ Daily limit reached.`, 'error');
    }

    const actionBtn = document.getElementById('fv-action-btn');
    actionBtn.disabled = true;

    try {
        if (selectedNetwork === 'adsgram') {
            if (typeof Adsgram === 'undefined' || !netConfigs.adsgram.blockId) {
                actionBtn.disabled = false;
                return showToast(currentLang === 'bn' ? '⚠️ Adsgram ব্লক আইডি সেট করা হয়নি!' : '⚠️ Adsgram Block ID missing.', 'error');
            }
            await Adsgram.init({ blockId: netConfigs.adsgram.blockId }).show();
            await creditAdReward(netConfigs.adsgram.reward);

        } else if (selectedNetwork === 'monetag') {
            if (!netConfigs.monetag.url) {
                actionBtn.disabled = false;
                return showToast(currentLang === 'bn' ? '⚠️ Monetag লিঙ্ক সেট করা হয়নি!' : '⚠️ Monetag URL missing.', 'error');
            }
            window.open(netConfigs.monetag.url, '_blank');
            showToast(currentLang === 'bn' ? '⏳ অনুগ্রহ করে ১৫ সেকেন্ড পেজটি ব্রাউজ করুন...' : '⏳ Please wait 15 seconds...', 'success');
            setTimeout(async () => {
                await creditAdReward(netConfigs.monetag.reward);
                actionBtn.disabled = false;
            }, 12000);
            return;

        } else if (selectedNetwork === 'adsterra') {
            if (!netConfigs.adsterra.url) {
                actionBtn.disabled = false;
                return showToast(currentLang === 'bn' ? '⚠️ Adsterra লিঙ্ক সেট করা হয়নি!' : '⚠️ Adsterra URL missing.', 'error');
            }
            window.open(netConfigs.adsterra.url, '_blank');
            showToast(currentLang === 'bn' ? '⏳ অনুগ্রহ করে ১৫ সেকেন্ড পেজটি ব্রাউজ করুন...' : '⏳ Please wait 15 seconds...', 'success');
            setTimeout(async () => {
                await creditAdReward(netConfigs.adsterra.reward);
                actionBtn.disabled = false;
            }, 12000);
            return;
        }
    } catch (err) {
        showToast(currentLang === 'bn' ? '⚠️ বিজ্ঞাপন সম্পূর্ণ হয়নি।' : '⚠️ Ad not completed.', 'error');
    } finally {
        actionBtn.disabled = false;
    }
}

async function creditAdReward(rewardVal) {
    const today = localDateKey();
    const userRef = db.ref('users/' + userId);

    const result = await userRef.transaction(current => {
        if (!current) return;
        const count = current.lastAdDate === today ? Number(current.adsWatchedCount || 0) : 0;
        if (count >= targetAds) return;
        current.balance = Math.round((Number(current.balance || 0) + rewardVal) * 100) / 100;
        current.adsWatchedCount = count + 1;
        current.lastAdDate = today;
        return current;
    });

    if (result.committed) {
        playCoinSound();
        triggerConfettiAnimation();
        showToast(currentLang === 'bn' ? `🎉 ৳${rewardVal} যোগ করা হয়েছে!` : `🎉 Added ৳${rewardVal}!`, 'success');
        document.getElementById('fv-limit-count').innerText = `${adsWatchedCount + 1}/${targetAds}`;
        let percent = Math.min(((adsWatchedCount + 1) / targetAds) * 100, 100);
        document.getElementById('fv-progress-bar').style.width = `${percent}%`;
    }
}

// ================= ডেইলি চেক-ইন সিস্টেম =================
function renderCheckInUI() {
    const grid = document.getElementById('checkin-grid');
    const claimBtn = document.getElementById('btn-claim-checkin');
    const streakText = document.getElementById('checkin-streak-status');
    if (!grid || !claimBtn) return;

    const today = localDateKey();
    const isClaimedToday = (lastCheckInDate === today);
    const daysDiff = getDaysDiff(lastCheckInDate, today);

    let currentDayTarget = 1;
    if (isClaimedToday) {
        currentDayTarget = checkInStreak;
    } else {
        currentDayTarget = (daysDiff === 1) ? ((checkInStreak % 7) + 1) : 1;
    }

    streakText.innerText = currentLang === 'bn' ? `🔥 স্ট্রিক: ${checkInStreak} দিন` : `🔥 Streak: ${checkInStreak} Days`;

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
                <span class="checkin-amount">+৳${reward}</span>
                <span class="checkin-status-tag ${tagClass}">${statusTagText}</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.innerText = i18n[currentLang].checkin_btn_claimed;
        claimBtn.style.background = "#1e293b";
        claimBtn.style.color = "#94a3b8";
    } else {
        claimBtn.disabled = false;
        const nextReward = checkInRewards[currentDayTarget - 1];
        claimBtn.innerText = currentLang === 'bn' 
            ? `🎁 আজকের দিন ${currentDayTarget} বোনাস নিন (+৳${nextReward})`
            : `🎁 Claim Day ${currentDayTarget} Bonus (+৳${nextReward})`;
        claimBtn.style.background = "linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)";
        claimBtn.style.color = "#042f2e";
    }
}

async function claimDailyCheckIn() {
    playClickSound();
    const today = localDateKey();
    const btn = document.getElementById('btn-claim-checkin');

    if (lastCheckInDate === today) {
        return showToast(currentLang === 'bn' ? '⚠️ আজ ইতিমধ্যে বোনাস নিয়েছেন!' : '⚠️ Already claimed today!', 'error');
    }

    if (btn) btn.disabled = true;
    const userRef = db.ref('users/' + userId);

    try {
        let earnedReward = 0;
        let resultingStreak = 1;

        const tx = await userRef.transaction((curr) => {
            if (!curr) return;
            if (curr.lastCheckInDate === today) return;

            const prevDate = curr.lastCheckInDate || "";
            const prevStreak = Number(curr.checkInStreak || 0);
            const diff = getDaysDiff(prevDate, today);

            resultingStreak = (diff === 1) ? ((prevStreak % 7) + 1) : 1;
            earnedReward = checkInRewards[resultingStreak - 1];

            curr.balance = Math.round((Number(curr.balance || 0) + earnedReward) * 100) / 100;
            curr.lastCheckInDate = today;
            curr.checkInStreak = resultingStreak;
            return curr;
        });

        if (!tx.committed) return showToast('⚠️ Already claimed today!', 'error');

        playCoinSound();
        triggerConfettiAnimation();
        showToast(currentLang === 'bn' 
            ? `🎉 দিন ${resultingStreak} এর বোনাস ৳${earnedReward} যোগ হয়েছে!` 
            : `🎉 Day ${resultingStreak} bonus ৳${earnedReward} claimed!`, 'success');
    } catch (err) {
        showToast('⚠️ Error claiming bonus.', 'error');
    } finally {
        if (btn) btn.disabled = false;
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
}, 3500);

function closeWelcomeModal() { 
    playCoinSound();
    document.getElementById('welcome-modal').style.display = 'none'; 
    triggerConfettiAnimation();
}

// ================= ট্যাব নেভিগেশন =================
function switchTab(pageId, titleKey, btnElement) {
    playClickSound();
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    const headerTitleKey = 'nav_' + titleKey;
    if (i18n[currentLang][headerTitleKey]) document.getElementById('header-title').innerText = i18n[currentLang][headerTitleKey];
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
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
    const shareText = `🎉 আমাদের আর্নিং অ্যাপে ফ্রিতে ইনকাম করুন! জয়েন করলেই পাবেন ৳${welcomeBonus} টাকা বোনাস।\n\n👇 জয়েন করুন:\n${myReferralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
}

// ================= উত্তোলন ও ক্যাশআউট =================
function switchWithdrawMethod(method) {
    playClickSound();
    document.getElementById('form-recharge').style.display = method === 'recharge' ? 'block' : 'none';
    document.getElementById('form-usdt').style.display = method === 'usdt' ? 'block' : 'none';
    document.getElementById('btn-method-recharge').classList.toggle('active', method === 'recharge');
    document.getElementById('btn-method-usdt').classList.toggle('active', method === 'usdt');
}

async function submitWithdrawalRequest(amountBdt, requestData, form, btn) {
    const userRef = db.ref('users/' + userId);
    const tx = await userRef.transaction(current => {
        if (!current) return;
        const currentBalance = Number(current.balance || 0);
        if (!Number.isFinite(currentBalance) || currentBalance < amountBdt) return;
        current.balance = Math.round((currentBalance - amountBdt) * 100) / 100;
        return current;
    });

    if (!tx.committed) throw new Error('INSUFFICIENT_BALANCE');

    try {
        const requestRef = db.ref('withdrawals').push();
        await requestRef.set({
            ...requestData,
            userId, userName, userUsername,
            status: 'Pending', timestamp: new Date().toISOString()
        });
        form.reset();
    } catch (error) {
        await userRef.transaction(current => {
            if (!current) return;
            current.balance = Math.round((Number(current.balance || 0) + amountBdt) * 100) / 100;
            return current;
        });
        throw error;
    }
}

async function handleRechargeSubmit(event) {
    event.preventDefault();
    playClickSound();
    const form = event.currentTarget;
    const button = document.getElementById('btn-submit-recharge-el');
    const amount = Number(document.getElementById('recharge-amount').value);
    const phone = document.getElementById('recharge-phone').value.trim();
    const operator = document.getElementById('recharge-operator').value;
    const simType = document.getElementById('recharge-sim-type').value;

    if (!Number.isFinite(amount) || amount < minRecharge) return showToast(currentLang === 'bn' ? `⚠️ সর্বনিম্ন রিচার্জ ৳${minRecharge} হতে হবে।` : `⚠️ Min recharge ৳${minRecharge}.`, 'error');
    if (!/^01[3-9][0-9]{8}$/.test(phone)) return showToast(currentLang === 'bn' ? '⚠️ সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।' : '⚠️ Invalid mobile number.', 'error');
    if (!operator) return showToast(currentLang === 'bn' ? '⚠️ অপারেটর নির্বাচন করুন।' : '⚠️ Select operator.', 'error');
    if (amount > balance) return showToast(currentLang === 'bn' ? '⚠️ আপনার ব্যালেন্স পর্যাপ্ত নয়।' : '⚠️ Insufficient balance.', 'error');

    if (button) button.disabled = true;
    try {
        await submitWithdrawalRequest(amount, { method: 'Mobile Recharge', operator, simType, phone, amount }, form, button);
        showToast(currentLang === 'bn' ? '⚡ রিচার্জ রিকোয়েস্ট জমা হয়েছে!' : '⚡ Recharge request submitted!', 'success');
    } catch (error) {
        showToast(currentLang === 'bn' ? '⚠️ ব্যালেন্স পর্যাপ্ত নয়।' : '⚠️ Insufficient balance.', 'error');
    } finally {
        if (button) button.disabled = false;
    }
}

function calculateUsdtFee() {
    const amountUsd = parseFloat(document.getElementById('usdt-amount').value) || 0;
    const feeSummary = document.getElementById('usdt-fee-summary');
    if (amountUsd > 0) {
        feeSummary.style.display = 'block';
        const fee = amountUsd * (usdtFeePercent / 100);
        const netAmount = amountUsd - fee;
        const bdtCost = amountUsd * usdtExchangeRate;

        document.getElementById('summary-gross').innerText = `$${amountUsd.toFixed(2)}`;
        document.getElementById('summary-fee').innerText = `-$${fee.toFixed(2)} (${usdtFeePercent}%)`;
        document.getElementById('summary-net').innerText = `$${netAmount.toFixed(2)} USDT`;
        document.getElementById('summary-bdt').innerText = `৳${bdtCost.toFixed(2)}`;
    } else { feeSummary.style.display = 'none'; }
}

async function handleUsdtSubmit(event) {
    event.preventDefault();
    playClickSound();
    const form = event.currentTarget;
    const button = document.getElementById('btn-submit-usdt-el');
    const usdtAddress = document.getElementById('usdt-address').value.trim();
    const amountUsd = Number(document.getElementById('usdt-amount').value);
    const totalBdtNeeded = Math.round(amountUsd * usdtExchangeRate * 100) / 100;

    if (!/^0x[a-fA-F0-9]{40}$/.test(usdtAddress)) return showToast(currentLang === 'bn' ? '⚠️ সঠিক BEP-20 ওয়ালেট অ্যাড্রেস দিন।' : '⚠️ Invalid BEP-20 address.', 'error');
    if (!Number.isFinite(amountUsd) || amountUsd < minUsdt) return showToast(currentLang === 'bn' ? `⚠️ সর্বনিম্ন ${minUsdt} USDT হতে হবে।` : `⚠️ Min ${minUsdt} USDT.`, 'error');
    if (!Number.isFinite(totalBdtNeeded) || totalBdtNeeded > balance) return showToast(currentLang === 'bn' ? '⚠️ আপনার ব্যালেন্স পর্যাপ্ত নয়।' : '⚠️ Insufficient balance.', 'error');

    if (button) button.disabled = true;
    try {
        await submitWithdrawalRequest(totalBdtNeeded, {
            method: 'USDT (BEP20)', usdtAddress, requestedUsd: amountUsd,
            netUsdToReceive: Math.round((amountUsd - amountUsd * (usdtFeePercent / 100)) * 10000) / 10000,
            bdtDeducted: totalBdtNeeded
        }, form, button);
        document.getElementById('usdt-fee-summary').style.display = 'none';
        showToast(currentLang === 'bn' ? '🪙 USDT উইথড্র রিকোয়েস্ট জমা হয়েছে!' : '🪙 USDT withdraw submitted!', 'success');
    } catch (error) {
        showToast(currentLang === 'bn' ? '⚠️ ব্যালেন্স পর্যাপ্ত নয়।' : '⚠️ Insufficient balance.', 'error');
    } finally {
        if (button) button.disabled = false;
    }
}

// ================= হিস্ট্রি শিট হ্যান্ডলার =================
function openWithdrawHistory() {
    playClickSound();
    const overlay = document.getElementById('history-modal-overlay');
    const sheet = document.getElementById('history-bottom-sheet');
    overlay.style.display = 'block';
    setTimeout(() => { overlay.classList.add('active'); sheet.classList.add('active'); }, 10);
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
    listContainer.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 12px; padding: 20px;">${i18n[currentLang].loading_text}</div>`;

    db.ref('withdrawals').orderByChild('userId').equalTo(userId).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = `<div style="text-align: center; color: #cbd5e1; font-size: 13px; padding: 30px 10px;"><div style="font-size: 36px; margin-bottom: 6px;">📂</div>${i18n[currentLang].no_history_withdraw}</div>`;
            return;
        }

        let itemsHTML = '';
        let itemsArr = [];
        snapshot.forEach((childSnap) => { itemsArr.push(childSnap.val()); });
        itemsArr.reverse();

        itemsArr.forEach(item => {
            let statusClass = 'status-pending';
            let statusText = item.status || 'Pending';
            if (statusText.toLowerCase() === 'approved') statusClass = 'status-approved';
            if (statusText.toLowerCase() === 'rejected') statusClass = 'status-rejected';

            let amountDisplay = item.method && item.method.includes('USDT') 
                ? `$${item.requestedUsd || 0} USDT (৳${item.bdtDeducted || 0})` 
                : `৳ ${item.amount || 0}`;

            let targetDetail = item.phone || item.usdtAddress || '';
            let dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

            itemsHTML += `
                <div class="history-item-card">
                    <div>
                        <div style="font-size: 13px; font-weight: 800; color: #ffffff;">${escapeHtml(item.method)}</div>
                        <div style="font-size: 11px; color: #00f2fe; margin-top: 2px;">${escapeHtml(targetDetail)}</div>
                        <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">${dateStr}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; font-weight: 800; color: #00f5a0;">${amountDisplay}</div>
                        <div style="margin-top: 4px;">
                            <span class="history-status-badge ${escapeHtml(statusClass)}">${escapeHtml(statusText)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = itemsHTML;
    });
}
