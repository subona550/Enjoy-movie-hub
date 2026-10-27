/**
 * EARNHUB PRO - ADVANCED CLIENT ENGINE (v5.6.0 FINAL)
 * - Social & Partner Tasks Engine (YouTube, Telegram, Website, WhatsApp, Facebook)
 * - Anti-Cheat Real-time Verification & Duration Tracker
 * - Dynamic Admin Task Management & Tutorial Video Sync
 * - Monetag Official Rewarded Interstitial Engine
 * - Adsgram Official Multi-Format (Rewarded & Interstitial Swap) Engine
 * - Dynamic Admin Cashout Limits (Recharge, bKash, Nagad)
 * - 7-Day Streak Gifts & Serverless Daily Reset
 * - Bilingual Support (Bangla & English) & Obsidian Dark/Light Theme
 */

// ================= ১. ব্যাকএন্ড ও গ্লোবাল কনফিগারেশন =================
const BACKEND_API_URL = "https://earnpro84cc.rakibkdbb.workers.dev"; 

let globalTutorialUrl = "https://www.youtube.com";
let socialTasksList = [];
let userCompletedTasks = {};
let activeTaskSessions = {}; // { [taskId]: { startedAt: number, visited: boolean } }

// ================= ২. ওয়েব অডিও সিন্থেসাইজার (সাউন্ড এফেক্ট) =================
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
        osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
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
        osc.frequency.setValueAtTime(1400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) { }
}

// ================= ৩. টেলিগ্রাম SDK ও হ্যাপটিক্স =================
const tg = window.Telegram?.WebApp;
if (tg) {
    try {
        tg.ready();
        tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') {
            tg.enableClosingConfirmation();
        }

        const applyTelegramSafeArea = () => {
            const safeTop = tg.safeAreaInset?.top || tg.contentSafeAreaInset?.top || 0;
            if (safeTop > 0) {
                document.documentElement.style.setProperty('--safe-top', `${safeTop}px`);
            }
        };
        applyTelegramSafeArea();
        if (typeof tg.onEvent === 'function') {
            tg.onEvent('safeAreaChanged', applyTelegramSafeArea);
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
            particleCount: 75,
            spread: 80,
            origin: { y: 0.65 },
            colors: ['#00e599', '#0098ea', '#ffffff', '#ffd700']
        });
    }
}

// ================= ৪. থিম কন্ট্রোলার =================
let currentTheme = localStorage.getItem('app_theme') || 'dark';

function applyTheme() {
    const iconEl = document.getElementById('theme-icon');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (iconEl) iconEl.innerText = '☀️';
        if (tg?.setHeaderColor) tg.setHeaderColor('#FFFFFF');
    } else {
        document.body.classList.remove('light-theme');
        if (iconEl) iconEl.innerText = '🌙';
        if (tg?.setHeaderColor) tg.setHeaderColor('#0B0E14');
    }
}

function toggleTheme() {
    playClickSound();
    triggerHaptic('light');
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('app_theme', currentTheme);
    applyTheme();
    showToast(currentTheme === 'light' 
        ? (currentLang === 'bn' ? 'লাইট মোড সক্রিয়' : 'Light Mode Enabled') 
        : (currentLang === 'bn' ? 'ডার্ক মোড সক্রিয়' : 'Dark Mode Enabled'));
}

// ================= ৫. ফায়ারবেস কনফিগারেশন =================
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

let serverTimeOffset = 0;
db.ref('.info/serverTimeOffset').on('value', (snap) => {
    serverTimeOffset = snap.val() || 0;
});

function getSafeDateKey() {
    const serverNow = new Date(Date.now() + serverTimeOffset);
    return `${serverNow.getUTCFullYear()}-${String(serverNow.getUTCMonth() + 1).padStart(2, '0')}-${String(serverNow.getUTCDate()).padStart(2, '0')}`;
}

// ================= ৬. দ্বিভাষিক ইঞ্জিন (ইংরেজি ও বাংলা) =================
let currentLang = localStorage.getItem('app_lang') || 'en';
const bnDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};

function formatNum(val) {
    const s = String(val ?? 0);
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
        today_task_title: "Total Tasks Completed Today",
        section_tasks_title: "Official Sponsored Tasks",
        section_tasks_sub: "Tap any card to preview & execute",
        badge_rewarded: "REWARDED",
        badge_social_hub: "SOCIAL & PARTNERS",
        monetag_title: "Monetag Rewarded",
        monetag_desc: "Watch full sponsored video to credit instant points",
        adsgram_title: "Adsgram Ad Stream",
        adsgram_desc: "High-CPM interstitial and video ad experience",
        social_tasks_card_title: "Social & Partner Tasks",
        social_tasks_card_desc: "Join YouTube, Telegram, Website, WhatsApp & Facebook to earn",
        btn_start_task: "Start Task",
        btn_view_tasks: "View Tasks",
        social_screen_title: "Social Tasks Hub",
        btn_how_to_work: "How to Work",
        social_verify_title: "Real-time Verified Tasks",
        social_verify_desc: "Points will be credited only after real verification. Fake claims will not be rewarded.",
        available_social_tasks: "Available Tasks",
        available_social_sub: "Complete official tasks to earn instant bonus points",
        task_btn_visit: "Start Task",
        task_btn_verify: "Verify",
        task_btn_verifying: "Verifying...",
        task_btn_completed: "Completed",
        task_guide_title: "Watch Tutorial",
        refer_badge: "REFER & EARN",
        refer_heading: "Invite Friends & Earn Together",
        refer_sub_1: "Earn",
        refer_sub_2: "points for every active invitee!",
        btn_copy: "Copy",
        btn_share_telegram: "Share via Telegram",
        stat_total_ref: "Total Referrals",
        stat_ref_earnings: "Bonus Earned",
        refer_list_title: "Invited Friends",
        refer_list_sub: "List of users who joined with your link",
        empty_referrals: "No referrals yet. Share your link to start earning!",
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
        btn_submitting: "Processing...",
        btn_view_history: "View Withdrawal History",
        profile_stat_bal: "Balance",
        profile_stat_ref: "Referrals",
        menu_payment_history: "Payment & Payout History",
        menu_daily_bonus: "7-Day Streak Rewards",
        menu_support: "24/7 Help & Support",
        menu_tg_support: "Telegram Official Channel",
        footer_caption: "EarnHub Pro v5.6.0 • Verified Telegram WebApp",
        fv_task_details: "Task Overview",
        fv_m_reward: "Task Reward",
        fv_m_limit: "Daily Limit",
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
        toast_limit_reached: "⚠️ Today's limit for this task is reached!",
        toast_preparing_ad: "⚡ Loading advertisement...",
        toast_starting_ad: "🎬 Starting advertisement...",
        toast_ad_failed: "⚠️ Advertisement cancelled or not completed.",
        toast_sdk_error: "⚠️ Ad SDK failed to initialize!",
        toast_pts_credited: "🎉 +{pts} points credited successfully!",
        toast_min_limit: "⚠️ Minimum withdrawal is {pts} points.",
        toast_valid_phone: "⚠️ Please enter a valid 11-digit mobile number.",
        toast_insufficient_bal: "⚠️ Insufficient balance in your account.",
        toast_cashout_error: "⚠️ Insufficient points or server error.",
        toast_already_claimed: "⚠️ You have already claimed today's gift!",
        toast_claim_success: "🎉 Day {day} reward +{pts} points added!",
        toast_link_copied: "✅ Referral link copied to clipboard!",
        toast_task_not_started: "⚠️ Please click 'Start Task' and visit first!",
        toast_task_time_left: "⚠️ Please stay at least {sec} more seconds!",
        toast_task_not_joined: "⚠️ Verification failed! Make sure you completed the task.",
        checkin_day_text: "Day {day}",
        checkin_streak_text: "Current Streak: {day} Days",
        checkin_claimed_btn: "✅ Today's Gift Claimed",
        checkin_claim_btn: "🎁 Claim Today's Gift (+{pts} PTS)",
        home_streak_claimed: "Streak: {day} Days (Claimed)",
        home_streak_ready: "Day {day} Reward",
        empty_history: "No withdrawal history found.",
        receipt_badge: "REQUEST SUBMITTED",
        receipt_title: "Cashout Successful!",
        receipt_desc: "Your cashout request has been securely placed and is currently under review.",
        rc_method: "Method:",
        rc_account: "Account:",
        rc_points: "Points Deducted:",
        rc_amount: "Amount:",
        rc_status: "Status:",
        status_pending: "Pending",
        btn_done: "Done & Close"
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
        today_task_title: "আজকে সম্পন্ন মোট টাস্ক",
        section_tasks_title: "অফিসিয়াল স্পনসর টাস্ক",
        section_tasks_sub: "বিস্তারিত দেখতে যেকোনো কার্ডে চাপুন",
        badge_rewarded: "রিওয়ার্ডেড",
        badge_social_hub: "সোশ্যাল ও পার্টনার",
        monetag_title: "মানেট্যাগ রিওয়ার্ডেড",
        monetag_desc: "সম্পূর্ণ ভিডিও বিজ্ঞাপন দেখে সরাসরি পয়েন্ট যোগ করুন",
        adsgram_title: "অ্যাডসগ্রাম অ্যাড স্ট্রিম",
        adsgram_desc: "উচ্চ সি-পি-এম ভিডিও এবং ইন্টারস্টিশিয়াল বিজ্ঞাপন",
        social_tasks_card_title: "সোশ্যাল ও পার্টনার টাস্ক",
        social_tasks_card_desc: "YouTube, Telegram, Website, WhatsApp ও Facebook টাস্কে যোগ দিয়ে আয় করুন",
        btn_start_task: "টাস্ক শুরু",
        btn_view_tasks: "টাস্ক দেখুন",
        social_screen_title: "সোশ্যাল টাস্ক হাব",
        btn_how_to_work: "কাজ শিখুন",
        social_verify_title: "রিয়েল-টাইম ভেরিফাইড টাস্ক",
        social_verify_desc: "সঠিকভাবে কাজ সম্পন্ন করলেই পয়েন্ট পাবেন। ফেক ক্লেইম গ্রহণযোগ্য নয়।",
        available_social_tasks: "উপলব্ধ টাস্কসমূহ",
        available_social_sub: "টাস্ক সম্পন্ন করুন এবং সরাসরি ব্যালেন্সে পয়েন্ট যোগ করুন",
        task_btn_visit: "কাজ করুন",
        task_btn_verify: "যাচাই করুন",
        task_btn_verifying: "যাচাই হচ্ছে...",
        task_btn_completed: "সম্পন্ন",
        task_guide_title: "টিউটোরিয়াল দেখুন",
        refer_badge: "রেফার ও আয়",
        refer_heading: "বন্ধুদের আমন্ত্রণ জানিয়ে আয় করুন",
        refer_sub_1: "প্রতি সফল রেফারে সরাসরি পাবেন",
        refer_sub_2: "পয়েন্ট ইনস্ট্যান্ট বোনাস!",
        btn_copy: "কপি",
        btn_share_telegram: "টেলিগ্রামে পাঠান",
        stat_total_ref: "মোট রেফারেল",
        stat_ref_earnings: "অর্জিত পয়েন্ট",
        refer_list_title: "আমন্ত্রিত বন্ধুদের তালিকা",
        refer_list_sub: "আপনার রেফারেল লিংক ব্যবহার করে যারা যুক্ত হয়েছেন",
        empty_referrals: "এখনও কোনো রেফারেল নেই। বন্ধুদের লিংক শেয়ার করুন!",
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
        btn_submitting: "প্রক্রিয়াধীন...",
        btn_view_history: "উত্তোলনের হিস্ট্রি দেখুন",
        profile_stat_bal: "ব্যালেন্স",
        profile_stat_ref: "রেফারেল",
        menu_payment_history: "পেমেন্ট ও উত্তোলন হিস্ট্রি",
        menu_daily_bonus: "৭ দিনের ধারাবাহিক উপহার",
        menu_support: "২৪/৭ হেল্প ও সাপোর্ট",
        menu_tg_support: "টেলিগ্রাম অফিসিয়াল চ্যানেল",
        footer_caption: "আর্নহাব প্রো সংস্করণ ৫.৬.০ • ভেরিফাইড টেলিগ্রাম মিনি অ্যাপ",
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
        toast_limit_reached: "⚠️ এই নেটওয়ার্কের আজকের বিজ্ঞাপন দেখার সীমা শেষ হয়েছে!",
        toast_preparing_ad: "⚡ বিজ্ঞাপন প্রস্তুত হচ্ছে...",
        toast_starting_ad: "🎬 বিজ্ঞাপন শুরু হচ্ছে...",
        toast_ad_failed: "⚠️ বিজ্ঞাপন বাতিল হয়েছে বা সম্পূর্ণ দেখা হয়নি।",
        toast_sdk_error: "⚠️ অ্যাড এসডিকে লোড হতে পারেনি!",
        toast_pts_credited: "🎉 +{pts} পয়েন্ট অ্যাকাউন্টে যোগ হয়েছে!",
        toast_min_limit: "⚠️ সর্বনিম্ন উত্তোলন {pts} পয়েন্ট হতে হবে।",
        toast_valid_phone: "⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।",
        toast_insufficient_bal: "⚠️ অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।",
        toast_cashout_error: "⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা সার্ভার ত্রুটি।",
        toast_already_claimed: "⚠️ আজকের বোনাস ইতিমধ্যে নেওয়া হয়েছে!",
        toast_claim_success: "🎉 দিন {day}-এর বোনাস +{pts} পয়েন্ট যোগ হয়েছে!",
        toast_link_copied: "✅ রেফারেল লিংক কপি করা হয়েছে!",
        toast_task_not_started: "⚠️ আগে 'কাজ করুন' বাটনে চাপ দিয়ে টাস্কটি সম্পন্ন করুন!",
        toast_task_time_left: "⚠️ অনুগ্রহ করে আরও {sec} সেকেন্ড সাইটে অপেক্ষা করুন!",
        toast_task_not_joined: "⚠️ যাচাই সম্পন্ন হয়নি! আপনি চ্যানেল বা গ্রুপে সঠিকভাবে যোগ দেননি।",
        checkin_day_text: "দিন {day}",
        checkin_streak_text: "বর্তমান স্ট্রিক: {day} দিন",
        checkin_claimed_btn: "✅ আজকের উপহার নেওয়া হয়েছে",
        checkin_claim_btn: "🎁 আজকের উপহার সংগ্রহ করুন (+{pts} পয়েন্ট)",
        home_streak_claimed: "স্ট্রিক: {day} দিন (নেওয়া হয়েছে)",
        home_streak_ready: "দিন {day} উপহার",
        empty_history: "কোনো উত্তোলনের রেকর্ড পাওয়া যায়নি।",
        receipt_badge: "রিকোয়েস্ট জমা হয়েছে",
        receipt_title: "ক্যাশআউট সফল হয়েছে!",
        receipt_desc: "আপনার ক্যাশআউট রিকোয়েস্ট সফলভাবে জমা হয়েছে এবং পর্যালোচনায় রয়েছে।",
        rc_method: "উত্তোলন মাধ্যম:",
        rc_account: "অ্যাকাউন্ট নম্বর:",
        rc_points: "কর্তনকৃত পয়েন্ট:",
        rc_amount: "টাকার পরিমাণ:",
        rc_status: "স্ট্যাটাস:",
        status_pending: "অপেক্ষারত",
        btn_done: "ঠিক আছে"
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
    renderSocialTasks();
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

// ================= ৭. ইউজার স্টেট ও ইনিশিয়ালাইজেশন =================
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
let monetagWatchedCount = 0;
let adsgramWatchedCount = 0;

let referralCount = 0;
let referralEarnings = 0;
let lastCheckInDate = "";
let checkInStreak = 0;

const checkInRewards = [10, 20, 30, 45, 60, 80, 150];

let pointsToBdtRate = 0.10;
let referralBonusPoints = 50;
let welcomeBonusPoints = 100;
let myReferralLink = `https://t.me/?startapp=ref_${userId}`;

let adminMinRecharge = 200;
let adminMinBkash = 500;
let adminMinNagad = 500;
let minWithdrawPoints = 200;

let selectedWithdrawMethod = 'recharge';
let selectedNetwork = 'monetag';

let netConfigs = {
    monetag: { zoneId: "8765432", reward: 15, limit: 15 },
    adsgram: { rewardedBlockId: "26019", interstitialBlockId: "26020", mode: "swap", reward: 20, limit: 20 }
};

let adsgramNextFormat = 'rewarded';

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

// ================= ৮. MONETAG SDK LOADER =================
function injectMonetagScript(zoneId) {
    if (!zoneId) return;
    const old = document.getElementById('monetag-sdk-dynamic');
    if (old) old.remove();

    const script = document.createElement('script');
    script.id = 'monetag-sdk-dynamic';
    script.src = 'https://libtl.com/sdk.js';
    script.dataset.zone = zoneId;
    script.dataset.sdk = `show_${zoneId}`;
    script.async = true;

    script.onload = () => {
        if (typeof window[`show_${zoneId}`] === 'function') {
            window.show_ = window[`show_${zoneId}`];
        } else if (typeof window.show_ === 'function') {
            window[`show_${zoneId}`] = window.show_;
        }
    };
    document.head.appendChild(script);
}

function getMonetagFunction() {
    const zoneId = netConfigs.monetag.zoneId;
    if (typeof window[`show_${zoneId}`] === 'function') return window[`show_${zoneId}`];
    if (typeof window.show_ === 'function') return window.show_;
    if (typeof window.show === 'function') return window.show;
    return null;
}

// ================= ৯. ফায়ারবেস সেটিংস ও সোশ্যাল টাস্ক সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    pointsToBdtRate = Number(data.pointsToBdtRate ?? 0.10);
    referralBonusPoints = Number(data.referralBonusPoints ?? 50);
    welcomeBonusPoints = Number(data.welcomeBonusPoints ?? 100);

    adminMinRecharge = Number(data.minWithdrawRecharge ?? data.minWithdrawPoints ?? 200);
    adminMinBkash = Number(data.minWithdrawBkash ?? data.minWithdrawWallet ?? 500);
    adminMinNagad = Number(data.minWithdrawNagad ?? adminMinBkash ?? 500);

    if (selectedWithdrawMethod === 'recharge') minWithdrawPoints = adminMinRecharge;
    else if (selectedWithdrawMethod === 'bkash') minWithdrawPoints = adminMinBkash;
    else if (selectedWithdrawMethod === 'nagad') minWithdrawPoints = adminMinNagad;

    netConfigs.monetag.zoneId = data.monetagZoneId || "8765432";
    netConfigs.monetag.reward = Number(data.rewardMonetagPoints ?? 15);
    netConfigs.monetag.limit = Number(data.monetagLimit ?? data.limitMonetag ?? 15);

    netConfigs.adsgram.rewardedBlockId = data.adsgramRewardedBlockId || data.adsgramBlockId || "26019";
    netConfigs.adsgram.interstitialBlockId = data.adsgramInterstitialBlockId || "26020";
    netConfigs.adsgram.mode = (data.adsgramMode || "swap").toLowerCase();
    netConfigs.adsgram.reward = Number(data.rewardAdsgramPoints ?? 20);
    netConfigs.adsgram.limit = Number(data.adsgramLimit ?? data.limitAdsgram ?? 20);

    globalTutorialUrl = data.tutorialVideoUrl || data.howToWorkUrl || "https://www.youtube.com";

    injectMonetagScript(netConfigs.monetag.zoneId);

    if (data.botUsername) {
        myReferralLink = data.appShortName 
            ? `https://t.me/${data.botUsername}/${data.appShortName}?startapp=ref_${userId}`
            : `https://t.me/${data.botUsername}?start=ref_${userId}`;
        const refDisplay = document.getElementById('referral-link-display');
        if (refDisplay) refDisplay.innerText = myReferralLink;
    }

    const supportLinkEl = document.getElementById('telegram-support-link');
    const channelLinkEl = document.getElementById('telegram-channel-link');

    const supportUrl = data.supportUrl || data.telegramSupport || (data.botUsername ? `https://t.me/${data.botUsername}?start=support` : 'https://t.me/');
    if (supportLinkEl) supportLinkEl.href = supportUrl.startsWith('http') ? supportUrl : `https://t.me/${supportUrl.replace('@', '')}`;

    if (data.telegramChannel && channelLinkEl) {
        channelLinkEl.href = data.telegramChannel.startsWith('http') ? data.telegramChannel : `https://t.me/${data.telegramChannel.replace('@', '')}`;
    }

    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = formatNum(netConfigs.monetag.reward));
    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = formatNum(netConfigs.adsgram.reward));

    const wbModal = document.getElementById('welcome-bonus-modal');
    if (wbModal) wbModal.innerText = formatNum(welcomeBonusPoints);

    const refBonusEl = document.getElementById('display-ref-bonus');
    if (refBonusEl) refBonusEl.innerText = formatNum(referralBonusPoints);

    updateUI();
});

// সোশ্যাল টাস্কসমূহ Firebase ডাটাবেস থেকে লাইভ সিঙ্ক
function listenSocialTasks() {
    db.ref('socialTasks').on('value', (snap) => {
        const data = snap.val();
        if (data) {
            socialTasksList = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        } else {
            // ডাটাবেসে কোনো টাস্ক না থাকলে অটো ডিফল্ট টাস্ক সেটআপ
            socialTasksList = [
                {
                    id: "task_tg_official",
                    platform: "telegram",
                    title_bn: "অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন",
                    title_en: "Join Official Telegram Channel",
                    desc_bn: "সবশেষ পেমেন্ট প্রুফ ও আপডেট পেতে জয়েন করুন",
                    desc_en: "Stay updated with payment proofs and bonuses",
                    url: "https://t.me/telegram",
                    channelId: "@telegram",
                    reward: 50,
                    minSeconds: 5,
                    tutorialUrl: globalTutorialUrl
                },
                {
                    id: "task_yt_sub",
                    platform: "youtube",
                    title_bn: "অফিসিয়াল ইউটিউব চ্যানেল সাবস্ক্রাইব করুন",
                    title_en: "Subscribe to Official YouTube",
                    desc_bn: "ভিডিও দেখে লাইক ও সাবস্ক্রাইব করুন",
                    desc_en: "Watch video and subscribe to our channel",
                    url: "https://youtube.com",
                    reward: 50,
                    minSeconds: 10,
                    tutorialUrl: globalTutorialUrl
                },
                {
                    id: "task_web_visit",
                    platform: "website",
                    title_bn: "স্পনসর ওয়েবসাইট ভিজিট করুন",
                    title_en: "Visit Sponsored Partner Website",
                    desc_bn: "অন্তত ১৫ সেকেন্ড ওয়েবসাইটে থেকে ঘুরে দেখুন",
                    desc_en: "Stay at least 15 seconds on the partner website",
                    url: "https://www.google.com",
                    reward: 35,
                    minSeconds: 15,
                    tutorialUrl: globalTutorialUrl
                },
                {
                    id: "task_wa_group",
                    platform: "whatsapp",
                    title_bn: "অফিসিয়াল হোয়াটসঅ্যাপ কমিউনিটি",
                    title_en: "Join WhatsApp Community",
                    desc_bn: "সরাসরি সাপোর্ট ও নোটিফিকেশন পেতে যুক্ত হোন",
                    desc_en: "Join for instant support and updates",
                    url: "https://whatsapp.com",
                    reward: 40,
                    minSeconds: 5,
                    tutorialUrl: globalTutorialUrl
                },
                {
                    id: "task_fb_page",
                    platform: "facebook",
                    title_bn: "ফেসবুক অফিসিয়াল পেজ ফলো করুন",
                    title_en: "Follow Official Facebook Page",
                    desc_bn: "লাইক ও ফলো করে সাথেই থাকুন",
                    desc_en: "Like and follow our official page",
                    url: "https://facebook.com",
                    reward: 35,
                    minSeconds: 8,
                    tutorialUrl: globalTutorialUrl
                }
            ];
        }

        // হোমপেজের সোশ্যাল কার্ডের মোট সম্ভাব্য রিওয়ার্ড ক্যালকুলেট
        const totalSocialReward = socialTasksList.reduce((acc, curr) => acc + Number(curr.reward || 0), 0);
        const rewardMaxEl = document.getElementById('social-tasks-max-reward');
        if (rewardMaxEl) rewardMaxEl.innerText = formatNum(totalSocialReward || 300);

        renderSocialTasks();
    });
}

// ================= ১০. সোশ্যাল টাস্ক হাব রেন্ডারিং ও কন্ট্রোলার =================
function openSocialTasksFullView() {
    playClickSound();
    triggerHaptic('light');
    renderSocialTasks();
    const screen = document.getElementById('social-tasks-fullview');
    if (screen) screen.classList.add('active');

    if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(closeSocialTasksFullView);
    }
}

function closeSocialTasksFullView() {
    playClickSound();
    triggerHaptic('light');
    const screen = document.getElementById('social-tasks-fullview');
    if (screen) screen.classList.remove('active');
    if (tg?.BackButton) tg.BackButton.hide();
}

function openTutorialVideo(customUrl = null) {
    playClickSound();
    triggerHaptic('light');
    const targetUrl = customUrl || globalTutorialUrl;
    try {
        if (tg && typeof tg.openLink === 'function') {
            tg.openLink(targetUrl);
        } else {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    } catch (e) {
        window.open(targetUrl, '_blank');
    }
}

function renderSocialTasks() {
    const listContainer = document.getElementById('social-tasks-list');
    if (!listContainer) return;

    if (!socialTasksList || socialTasksList.length === 0) {
        listContainer.innerHTML = `<div class="loading-state">${t('loading_text')}</div>`;
        return;
    }

    let html = '';

    socialTasksList.forEach(task => {
        const isCompleted = !!userCompletedTasks[task.id];
        const platform = (task.platform || 'website').toLowerCase();

        let iconSvg = '';
        let iconClass = `st-icon-${platform}`;

        if (platform === 'youtube') {
            iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
        } else if (platform === 'telegram') {
            iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
        } else if (platform === 'whatsapp') {
            iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.981z"/></svg>`;
        } else if (platform === 'facebook') {
            iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
        } else {
            iconSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
        }

        const taskTitle = currentLang === 'bn' ? (task.title_bn || task.title_en || task.title) : (task.title_en || task.title_bn || task.title);
        const taskDesc = currentLang === 'bn' ? (task.desc_bn || task.desc_en || task.desc) : (task.desc_en || task.desc_bn || task.desc);

        html += `
            <div class="st-card shine-card" id="task-card-${task.id}">
                <div class="st-top">
                    <div class="st-left">
                        <div class="st-icon-box ${iconClass}">
                            ${iconSvg}
                        </div>
                        <div class="st-info">
                            <h4 class="st-title">${escapeHtml(taskTitle)}</h4>
                            <p class="st-desc">${escapeHtml(taskDesc)}</p>
                        </div>
                    </div>
                    <div class="st-reward-wrap">
                        <span class="st-reward">+${formatNum(task.reward)} ${t('pts_currency')}</span>
                        <span class="st-badge ${isCompleted ? 'st-badge-done' : 'st-badge-pending'}">
                            ${isCompleted ? t('task_btn_completed') : '● Ready'}
                        </span>
                    </div>
                </div>

                <div class="st-action-row">
                    ${isCompleted ? `
                        <button class="st-btn-visit" style="opacity:0.6; cursor:default;" disabled>
                            ✅ ${t('task_btn_completed')}
                        </button>
                    ` : `
                        <button class="st-btn-visit" onclick="handleStartSocialTask('${task.id}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            <span>${t('task_btn_visit')}</span>
                        </button>
                        <button class="st-btn-verify" id="btn-verify-${task.id}" onclick="handleVerifySocialTask('${task.id}')">
                            <span>${t('task_btn_verify')}</span>
                        </button>
                    `}

                    <!-- প্রতিটি টাস্কের নিজস্ব টিউটোরিয়াল বাটন -->
                    <button class="st-btn-guide" onclick="openTutorialVideo('${task.tutorialUrl || globalTutorialUrl}')" title="${t('task_guide_title')}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
}

// সোশ্যাল টাস্ক ভিজিট বা কাজ শুরু
function handleStartSocialTask(taskId) {
    playClickSound();
    triggerHaptic('light');

    const task = socialTasksList.find(t => t.id === taskId);
    if (!task) return;

    activeTaskSessions[taskId] = {
        startedAt: Date.now(),
        visited: true
    };

    const targetUrl = task.url;
    try {
        if (tg && typeof tg.openLink === 'function') {
            tg.openLink(targetUrl);
        } else {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    } catch (e) {
        window.open(targetUrl, '_blank');
    }

    const verifyBtn = document.getElementById(`btn-verify-${taskId}`);
    if (verifyBtn) {
        verifyBtn.style.animation = "pulseWarn 1.5s infinite";
    }
}

// সোশ্যাল টাস্ক ভেরিফাই ও পয়েন্ট ক্রেডিট
async function handleVerifySocialTask(taskId) {
    playClickSound();
    triggerHaptic('medium');

    const task = socialTasksList.find(t => t.id === taskId);
    if (!task) return;

    if (userCompletedTasks[taskId]) {
        return showToast(currentLang === 'bn' ? 'টাস্কটি ইতিমধ্যে সম্পন্ন করা হয়েছে!' : 'Task already completed!');
    }

    const session = activeTaskSessions[taskId];
    if (!session || !session.visited) {
        return showToast(t('toast_task_not_started'), 'error');
    }

    const minRequiredSeconds = Number(task.minSeconds || 5);
    const timeSpent = Math.floor((Date.now() - session.startedAt) / 1000);

    if (timeSpent < minRequiredSeconds) {
        const remaining = minRequiredSeconds - timeSpent;
        return showToast(t('toast_task_time_left', { sec: remaining }), 'error');
    }

    const verifyBtn = document.getElementById(`btn-verify-${taskId}`);
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerText = t('task_btn_verifying');
    }

    // টেলিগ্রাম চ্যানেল ভেরিফিকেশন (যদি ব্যাকএন্ড এপিআই সক্রিয় থাকে)
    if (task.platform === 'telegram' && task.channelId && BACKEND_API_URL) {
        try {
            const resp = await fetch(`${BACKEND_API_URL}/api/verify-telegram-join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-telegram-init-data': tg?.initData || ''
                },
                body: JSON.stringify({ userId, channelId: task.channelId })
            });
            const data = await resp.json();
            if (resp.ok && !data.isMember) {
                if (verifyBtn) {
                    verifyBtn.disabled = false;
                    verifyBtn.innerText = t('task_btn_verify');
                }
                return showToast(t('toast_task_not_joined'), 'error');
            }
        } catch (e) { }
    }

    // পয়েন্ট ক্রেডিট ও ডাটাবেস সেভ
    try {
        const userRef = db.ref('users/' + userId);
        const rewardPoints = Number(task.reward || 50);

        const tx = await userRef.transaction(current => {
            if (!current) return;
            current.balance = Math.round(Number(current.balance || 0) + rewardPoints);
            return current;
        });

        if (tx.committed) {
            await db.ref(`users/${userId}/completedTasks/${taskId}`).set(true);
            userCompletedTasks[taskId] = true;

            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_pts_credited', { pts: rewardPoints }));

            renderSocialTasks();
        } else {
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.innerText = t('task_btn_verify');
            }
        }
    } catch (err) {
        showToast(currentLang === 'bn' ? 'সার্ভার ত্রুটি! আবার চেষ্টা করুন।' : 'Server error! Try again.', 'error');
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerText = t('task_btn_verify');
        }
    }
}

// ================= ১১. ইউজার ডেটা ও ডাটাবেস হ্যান্ডলার =================
let userListenerAttached = false;

function initUser() {
    const today = getSafeDateKey();
    const userRef = db.ref('users/' + userId);

    userRef.once('value', (snap) => {
        if (!snap.exists()) {
            balancePoints = welcomeBonusPoints;
            const newUser = {
                name: userName,
                username: userUsername,
                balance: balancePoints,
                adsWatchedCount: 0,
                monetagWatchedCount: 0,
                adsgramWatchedCount: 0,
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

                    db.ref(`referrals/${referrerId}/${userId}`).set({
                        id: userId,
                        name: userName,
                        username: userUsername,
                        bonus: referralBonusPoints,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            const welcomeModal = document.getElementById('welcome-modal');
            if (welcomeModal) welcomeModal.style.display = 'flex';
        }

        if (!userListenerAttached) {
            userListenerAttached = true;
            userRef.on('value', (s) => {
                const data = s.val();
                if (!data) return;

                balancePoints = Math.round(Number(data.balance || 0));
                adsWatchedCount = Number(data.adsWatchedCount || 0);
                monetagWatchedCount = Number(data.monetagWatchedCount || 0);
                adsgramWatchedCount = Number(data.adsgramWatchedCount || 0);

                userCompletedTasks = data.completedTasks || {};

                referralCount = Number(data.referralCount || 0);
                referralEarnings = Math.round(Number(data.referralEarnings || 0));
                lastCheckInDate = data.lastCheckInDate || "";
                checkInStreak = Number(data.checkInStreak || 0);

                const currentServerDay = getSafeDateKey();
                if (data.lastAdDate !== currentServerDay) {
                    adsWatchedCount = 0;
                    monetagWatchedCount = 0;
                    adsgramWatchedCount = 0;

                    userRef.update({
                        adsWatchedCount: 0,
                        monetagWatchedCount: 0,
                        adsgramWatchedCount: 0,
                        lastAdDate: currentServerDay
                    });
                }

                updateUI();
                renderCheckInGrid();
                renderSocialTasks();
            });
        }
    });

    listenToUserReferrals();
    listenSocialTasks();
}

function listenToUserReferrals() {
    const refContainer = document.getElementById('referrals-container');
    if (!refContainer) return;

    db.ref(`referrals/${userId}`).on('value', snapshot => {
        if (!snapshot.exists()) {
            refContainer.innerHTML = `<div style="text-align:center; padding:22px; font-size:14.5px; color:var(--text-muted);">${t('empty_referrals')}</div>`;
            return;
        }

        let html = '';
        snapshot.forEach(child => {
            const item = child.val();
            const initial = (item.name?.charAt(0) || 'U').toUpperCase();
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';

            html = `
                <div class="ref-item shine-card">
                    <div class="ref-item-left">
                        <div class="ref-avatar">${escapeHtml(initial)}</div>
                        <div class="ref-info">
                            <span class="ref-name">${escapeHtml(item.name || 'User')}</span>
                            <span class="ref-date">${escapeHtml(item.username || '')} • ${dateStr}</span>
                        </div>
                    </div>
                    <span class="ref-badge">+${formatNum(item.bonus || 50)} ${t('pts_currency')}</span>
                </div>
            ` + html;
        });

        refContainer.innerHTML = html;
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

    const totalPossibleAds = (netConfigs.monetag.limit + netConfigs.adsgram.limit) || 40;
    setElem('home-ad-counter', `${formatNum(adsWatchedCount)} / ${formatNum(totalPossibleAds)}`);
    const pct = Math.min((adsWatchedCount / totalPossibleAds) * 100, 100);
    const fill = document.getElementById('home-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const fvLimit = document.getElementById('fv-limit-count');
    if (fvLimit && selectedNetwork && netConfigs[selectedNetwork]) {
        let curWatched = selectedNetwork === 'monetag' ? monetagWatchedCount : adsgramWatchedCount;
        fvLimit.innerText = `${formatNum(curWatched)} / ${formatNum(netConfigs[selectedNetwork].limit)}`;
    }

    const rateTextEl = document.getElementById('display-point-rate-text');
    if (rateTextEl) {
        const bdtCalc = (100 * pointsToBdtRate).toFixed(2);
        rateTextEl.innerText = `${formatNum(100)} ${t('pts_currency')} = ${formatNum(bdtCalc)} ৳`;
    }

    const minWithdrawEl = document.getElementById('display-min-withdraw');
    if (minWithdrawEl) minWithdrawEl.innerText = formatNum(minWithdrawPoints);

    const modeTag = document.getElementById('adsgram-mode-tag');
    if (modeTag) {
        modeTag.innerText = netConfigs.adsgram.mode === 'swap' 
            ? (currentLang === 'bn' ? 'অ্যাডসগ্রাম সোয়াপ' : 'ADSGRAM SWAP') 
            : (netConfigs.adsgram.mode.toUpperCase());
    }

    const pId = document.getElementById('profile-page-id');
    if (pId) pId.innerText = `ID: #${formatNum(userId)}`;
}

// ================= ১২. ভিডিও অ্যাড ফুলভিউ ও এক্সিকিউশন =================
function openNetworkFullView(networkKey) {
    playClickSound();
    triggerHaptic('light');
    selectedNetwork = networkKey;
    const screen = document.getElementById('network-fullview');

    if (networkKey === 'monetag') {
        const monetagFunc = getMonetagFunction();
        if (typeof monetagFunc === 'function') {
            try { monetagFunc({ type: 'preload' }).catch(() => {}); } catch (e) { }
        }
    }

    const details = {
        monetag: {
            badge: currentLang === 'bn' ? "মানেট্যাগ অফিসিয়াল" : "MONETAG OFFICIAL",
            headline: currentLang === 'bn' ? "মানেট্যাগ রিওয়ার্ডেড টাস্ক" : "Monetag Rewarded Task",
            desc: currentLang === 'bn' ? "ভিডিওটি সম্পূর্ণ দেখলে সরাসরি পয়েন্ট অ্যাকাউন্টে যোগ হবে।" : "Watch the complete sponsored video to credit points to your account balance.",
            iconClass: "task-blue",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m13 2-2 10h8L7 22l2-10H1z"/></svg>`,
            watched: monetagWatchedCount,
            limit: netConfigs.monetag.limit
        },
        adsgram: {
            badge: currentLang === 'bn' ? "অ্যাডসগ্রাম স্ট্রিম" : "ADSGRAM STREAM",
            headline: currentLang === 'bn' ? "অ্যাডসগ্রাম স্পনসর টাস্ক" : "Adsgram Sponsored Task",
            desc: currentLang === 'bn' ? "বিজ্ঞাপন সম্পন্ন হওয়া মাত্রই রিওয়ার্ড পয়েন্ট নিশ্চিত করা হবে।" : "Complete the video or interstitial stream to claim instant reward.",
            iconClass: "task-mint",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="15" x="2" y="5" rx="2"/><polyline points="10 9 15 12.5 10 16"/></svg>`,
            watched: adsgramWatchedCount,
            limit: netConfigs.adsgram.limit
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
    document.getElementById('fv-limit-count').innerText = `${formatNum(info.watched)} / ${formatNum(info.limit)}`;
    
    const actionBtn = document.getElementById('fv-action-btn');
    if (actionBtn) actionBtn.disabled = false;
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
    if (tg?.BackButton) tg.BackButton.hide();
}

async function executeCurrentNetworkAd() {
    playClickSound();
    triggerHaptic('medium');

    const actionBtn = document.getElementById('fv-action-btn');
    let curCount = selectedNetwork === 'monetag' ? monetagWatchedCount : adsgramWatchedCount;
    let curLimit = netConfigs[selectedNetwork].limit;

    if (curCount >= curLimit) {
        return showToast(t('toast_limit_reached'), 'error');
    }

    try {
        if (selectedNetwork === 'monetag') {
            actionBtn.disabled = true;
            const monetagFunc = getMonetagFunction();

            if (typeof monetagFunc !== 'function') {
                actionBtn.disabled = false;
                return showToast(t('toast_sdk_error'), 'error');
            }

            showToast(t('toast_preparing_ad'));

            monetagFunc().then(async (result) => {
                if (result && result.reward_event_type && result.reward_event_type !== 'valued') {
                    showToast(t('toast_ad_failed'), 'error');
                } else {
                    await creditPoints('monetag', netConfigs.monetag.reward);
                    closeNetworkFullView();
                }
                actionBtn.disabled = false;
            }).catch(() => {
                showToast(t('toast_ad_failed'), 'error');
                actionBtn.disabled = false;
            });
        }
        else if (selectedNetwork === 'adsgram') {
            actionBtn.disabled = true;
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
            
            const result = await adController.show();
            if (result && result.done) {
                await creditPoints('adsgram', netConfigs.adsgram.reward);
                closeNetworkFullView();
            } else {
                showToast(t('toast_ad_failed'), 'error');
            }
            actionBtn.disabled = false;
        }
    } catch (err) {
        showToast(t('toast_ad_failed'), 'error');
        if (actionBtn) actionBtn.disabled = false;
    }
}

async function creditPoints(networkKey, reward) {
    const today = getSafeDateKey();
    const userRef = db.ref('users/' + userId);

    const result = await userRef.transaction(current => {
        if (!current) return;
        
        if (current.lastAdDate !== today) {
            current.adsWatchedCount = 0;
            current.monetagWatchedCount = 0;
            current.adsgramWatchedCount = 0;
            current.lastAdDate = today;
        }

        const netCountKey = `${networkKey}WatchedCount`;
        const currentNetworkCount = Number(current[netCountKey] || 0);
        const limitForNetwork = netConfigs[networkKey].limit;

        if (currentNetworkCount >= limitForNetwork) {
            return;
        }

        current.balance = Math.round(Number(current.balance || 0) + reward);
        current.adsWatchedCount = Number(current.adsWatchedCount || 0) + 1;
        current[netCountKey] = currentNetworkCount + 1;
        current.lastAdDate = today;

        return current;
    });

    if (result.committed) {
        playRewardSound();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(t('toast_pts_credited', { pts: reward }));
    } else {
        showToast(t('toast_limit_reached'), 'error');
    }
}

// ================= ১৩. ক্যাশআউট সাবমিশন ও রিসিট =================
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
        minWithdrawPoints = adminMinRecharge;
    } else if (method === 'bkash') {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'অ্যাকাউন্টের ধরন:' : 'Account Type:';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX (bKash)';
        minWithdrawPoints = adminMinBkash;
    } else {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'অ্যাকাউন্টের ধরন:' : 'Account Type:';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX (Nagad)';
        minWithdrawPoints = adminMinNagad;
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
    const submitText = document.getElementById('btn-submit-text');
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
    let methodName = selectedWithdrawMethod === 'bkash' ? 'bKash' : (selectedWithdrawMethod === 'nagad' ? 'Nagad' : 'Mobile Recharge');

    if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.innerText = t('btn_submitting');
    }

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

        openCashoutSuccessModal({
            method: methodName + (operator ? ` (${operator})` : ''),
            account: `${phone} (${accountType})`,
            points: pointsToDeduct,
            bdt: calculatedBdt
        });

    } catch (err) {
        showToast(t('toast_cashout_error'), 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            if (submitText) submitText.innerText = t('btn_submit_cashout');
        }
    }
}

function openCashoutSuccessModal(data) {
    const modal = document.getElementById('cashout-success-modal');
    if (!modal) return;

    document.getElementById('receipt-method').innerText = data.method;
    document.getElementById('receipt-account').innerText = data.account;
    document.getElementById('receipt-points').innerText = `-${formatNum(data.points)} ${t('pts_currency')}`;
    document.getElementById('receipt-amount').innerText = `৳ ${formatNum(data.bdt)}`;
    document.getElementById('receipt-status').innerText = t('status_pending');

    modal.style.display = 'flex';
    playRewardSound();
    triggerConfetti();
    triggerHaptic('notification_success');
}

function closeCashoutSuccessModal() {
    playClickSound();
    triggerHaptic('light');
    const modal = document.getElementById('cashout-success-modal');
    if (modal) modal.style.display = 'none';

    const submitBtn = document.getElementById('btn-submit-withdraw');
    const submitText = document.getElementById('btn-submit-text');
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.innerText = t('btn_submit_cashout');
}

// ================= ১৪. উইথড্রয়াল হিস্ট্রি =================
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
            listContainer.innerHTML = `<div style="text-align:center; padding:28px; font-size:14.5px; color:var(--text-muted);">${t('empty_history')}</div>`;
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

// ================= ১৫. ৭-দিনের ডেইলি চেক-ইন =================
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

    const today = getSafeDateKey();
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
    const today = getSafeDateKey();
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
        if (claimBtn) claimBtn.disabled = false;
    }
}

// ================= ১৬. রেফারেল ও সোশ্যাল শেয়ার =================
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

    const shareBtn = document.getElementById('btn-share-referral');
    if (shareBtn) {
        shareBtn.disabled = true;
        setTimeout(() => { shareBtn.disabled = false; }, 1200);
    }

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

// ================= ১৭. অ্যাপ বুটস্ট্র্যাপ =================
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

    applyTheme();
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