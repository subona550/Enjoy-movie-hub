/**
 * EARNHUB PRO - ADVANCED CLIENT ENGINE (v5.7.0 UPDATED)
 * - Auto-Verify Status Check (Reverts to Unverified if user leaves Telegram Channel)
 * - In-Screen Ad Loop (Stay inside task screen after ad completion)
 * - Dynamic Admin-Controlled Waiting Time
 * - BD Mobile Operator & Prefix Mismatch Guard
 */

// ================= ১. ব্যাকএন্ড কনফিগারেশন =================
const BACKEND_API_URL = "https://earnpro84cc.rakibkdbb.workers.dev"; 

// ================= ২. ওয়েব অডিও সিন্থেসাইজার =================
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

// ================= ৩. টেলিগ্রাম SDK ও গ্লোবাল ব্যাকবাটন ম্যানেজার =================
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

        if (tg.BackButton) {
            tg.BackButton.onClick(() => {
                if (openModalStack.length > 0) {
                    const topModal = openModalStack.pop();
                    if (topModal && typeof topModal.close === 'function') {
                        topModal.close();
                    }
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
        tutorial_btn_title: "How to Work (Video Tutorial)",
        tutorial_btn_sub: "Watch full video to learn correct rules",
        btn_watch: "Watch",
        menu_verify_channel: "Channel Verification",
        verify_status_unverified: "● Unverified (Tasks Locked)",
        verify_status_verified: "● Verified (Tasks Active)",
        verify_badge_unverified: "Verify Now",
        verify_badge_verified: "Verified",
        verify_badge: "VERIFICATION REQUIRED",
        verify_title: "Verify Your Account",
        verify_desc: "You must join our official Telegram channel to keep tasks and withdrawals active. Tasks remain locked without joining.",
        btn_join_tg_channel: "Join Official Channel",
        btn_check_verify: "I Joined (Verify Now)",
        btn_close: "Close",
        section_tasks_title: "Official Sponsored Tasks",
        section_tasks_sub: "Tap any card to preview & execute",
        badge_rewarded: "REWARDED",
        badge_direct: "SPONSOR VISIT",
        monetag_title: "Monetag Rewarded",
        monetag_desc: "Watch full sponsored video to credit instant points",
        adsgram_title: "Adsgram Ad Stream",
        adsgram_desc: "High-CPM interstitial and video ad experience",
        adsterra_title: "Direct Sponsor Link",
        adsterra_desc: "Explore sponsored partner link and stay for verified seconds",
        btn_start_task: "Start Task",
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
        footer_caption: "EarnHub Pro v5.7.0 • Verified Telegram WebApp",
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
        toast_limit_reached: "⚠️ Today's limit for this ad network is reached!",
        toast_preparing_ad: "⚡ Loading advertisement...",
        toast_starting_ad: "🎬 Starting advertisement...",
        toast_ad_failed: "⚠️ Advertisement cancelled or not completed.",
        toast_sdk_error: "⚠️ Ad SDK failed to initialize or blocked by adblocker!",
        toast_pts_credited: "🎉 +{pts} points credited successfully!",
        toast_min_limit: "⚠️ Minimum withdrawal is {pts} points.",
        toast_valid_phone: "⚠️ Please enter a valid 11-digit mobile number.",
        toast_operator_mismatch: "⚠️ Selected operator does not match mobile number prefix!",
        toast_insufficient_bal: "⚠️ Insufficient balance in your account.",
        toast_cashout_error: "⚠️ Insufficient points or server error.",
        toast_already_claimed: "⚠️ You have already claimed today's gift!",
        toast_claim_success: "🎉 Day {day} reward +{pts} points added!",
        toast_link_copied: "✅ Referral link copied to clipboard!",
        toast_verify_required: "⚠️ You must join our official Telegram channel first!",
        toast_verify_withdraw: "⚠️ You must verify your account by joining our Telegram channel before making a withdrawal!",
        toast_verify_success: "🎉 Membership confirmed! Tasks and cashouts are now unlocked.",
        toast_already_verified: "✅ Your account is already verified!",
        toast_verifying_membership: "⏳ Verifying official channel membership...",
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
        tutorial_btn_title: "কাজের নিয়ম ভিডিও টিউটোরিয়াল",
        tutorial_btn_sub: "সঠিক নিয়মে কাজ করতে ভিডিওটি দেখুন",
        btn_watch: "দেখুন",
        menu_verify_channel: "চ্যানেল ভেরিফিকেশন",
        verify_status_unverified: "● আনভেরিফাইড (কাজ বন্ধ)",
        verify_status_verified: "● ভেরিফাইড (কাজ চালু)",
        verify_badge_unverified: "ভেরিফাই করুন",
        verify_badge_verified: "ভেরিফাইড",
        verify_badge: "ভেরিফিকেশন আবশ্যক",
        verify_title: "অ্যাকাউন্ট ভেরিফাই করুন",
        verify_desc: "টাস্ক সম্পন্ন এবং আয় চালু রাখতে আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন থাকা আবশ্যক। চ্যানেলে জয়েন না থাকলে কাজ করতে পারবেন না।",
        btn_join_tg_channel: "চ্যানেলে জয়েন করুন",
        btn_check_verify: "আমি জয়েন করেছি (ভেরিফাই করুন)",
        btn_close: "বন্ধ করুন",
        section_tasks_title: "অফিসিয়াল স্পনসর টাস্ক",
        section_tasks_sub: "বিস্তারিত দেখতে যেকোনো কার্ডে চাপুন",
        badge_rewarded: "রিওয়ার্ডেড",
        badge_direct: "স্পনসর ভিজিট",
        monetag_title: "মানেট্যাগ রিওয়ার্ডেড",
        monetag_desc: "সম্পূর্ণ ভিডিও বিজ্ঞাপন দেখে সরাসরি পয়েন্ট যোগ করুন",
        adsgram_title: "অ্যাডসগ্রাম অ্যাড স্ট্রিম",
        adsgram_desc: "উচ্চ সি-পি-এম ভিডিও এবং ইন্টারস্টিশিয়াল বিজ্ঞাপন",
        adsterra_title: "সরাসরি স্পনসর লিংক",
        adsterra_desc: "স্পনসর পেজটিতে নির্দিষ্ট সেকেন্ড সক্রিয়ভাবে ভিজিট করুন",
        btn_start_task: "টাস্ক শুরু",
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
        footer_caption: "আর্নহাব প্রো সংস্করণ ৫.৭.০ • টেলিগ্রাম মিনি অ্যাপ",
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
        toast_sdk_error: "⚠️ অ্যাড এসডিকে লোড হতে পারেনি অথবা অ্যাডব্লকার সক্রিয় আছে!",
        toast_pts_credited: "🎉 +{pts} পয়েন্ট অ্যাকাউন্টে যোগ হয়েছে!",
        toast_min_limit: "⚠️ সর্বনিম্ন উত্তোলন {pts} পয়েন্ট হতে হবে।",
        toast_valid_phone: "⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।",
        toast_operator_mismatch: "⚠️ নির্বাচিত অপারেটরের সাথে মোবাইল নম্বরের মিল নেই!",
        toast_insufficient_bal: "⚠️ অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।",
        toast_cashout_error: "⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা সার্ভার ত্রুটি।",
        toast_already_claimed: "⚠️ আজকের বোনাস ইতিমধ্যে নেওয়া হয়েছে!",
        toast_claim_success: "🎉 দিন {day}-এর বোনাস +{pts} পয়েন্ট যোগ হয়েছে!",
        toast_link_copied: "✅ রেফারেল লিংক কপি করা হয়েছে!",
        toast_verify_required: "⚠️ আপনি চ্যানেলে নেই! টেলিগ্রাম চ্যানেলে জয়েন করে ভেরিফাই করুন।",
        toast_verify_withdraw: "⚠️ টাকা উত্তোলন করতে প্রথমে টেলিগ্রাম চ্যানেলে জয়েন করে অ্যাকাউন্ট ভেরিফাই করুন!",
        toast_verify_success: "🎉 মেম্বারশিপ নিশ্চিত হয়েছে! কাজ ও উত্তোলন সক্রিয় হলো।",
        toast_already_verified: "✅ আপনার অ্যাকাউন্ট ইতিমধ্যে ভেরিফাইড!",
        toast_verifying_membership: "⏳ চ্যানেল মেম্বারশিপ যাচাই করা হচ্ছে...",
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

// ================= ৭. ইউজার স্টেট ম্যানেজমেন্ট =================
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
let adsterraWatchedCount = 0;

let referralCount = 0;
let referralEarnings = 0;
let lastCheckInDate = "";
let checkInStreak = 0;

let isChannelVerified = false;
const checkInRewards = [2, 3, 5, 10, 15, 20, 50];

let tutorialVideoUrl = "https://www.youtube.com"; 
let telegramChannelUrl = "https://t.me/";

let pointsToBdtRate = 0.10;
let referralBonusPoints = 50;
let welcomeBonusPoints = 100;
let myReferralLink = `https://t.me/?startapp=ref_${userId}`;

let adminMinRecharge = 200;
let adminMinBkash = 500;
let adminMinNagad = 500;
let minWithdrawPoints = 200;

let requiredSponsorTime = 15;

let selectedWithdrawMethod = 'recharge';
let selectedNetwork = 'monetag';

let netConfigs = {
    monetag: { zoneId: "8765432", reward: 15, limit: 15 },
    adsgram: { rewardedBlockId: "26019", interstitialBlockId: "26020", mode: "swap", reward: 20, limit: 20 },
    adsterra: { url: "https://www.highcpmgate.com/sample", reward: 15, limit: 25 }
};

let adsgramNextFormat = 'rewarded';
let adsterraSession = null;

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

// ================= ৮. MONETAG SDK LOADER & HELPER =================
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

// ================= ৯. ফায়ারবেস অ্যাডমিন প্যানেল সিঙ্ক =================
db.ref('settings').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    if (data.tutorialVideoUrl || data.tutorialUrl || data.youtubeTutorial) {
        tutorialVideoUrl = data.tutorialVideoUrl || data.tutorialUrl || data.youtubeTutorial;
    }

    if (data.telegramChannel) {
        telegramChannelUrl = data.telegramChannel.startsWith('http') 
            ? data.telegramChannel 
            : `https://t.me/${data.telegramChannel.replace('@', '')}`;
    }

    const joinBtn = document.getElementById('btn-verify-join-tg');
    if (joinBtn) joinBtn.href = telegramChannelUrl;

    const channelLinkEl = document.getElementById('telegram-channel-link');
    if (channelLinkEl) channelLinkEl.href = telegramChannelUrl;

    if (data.adsterraWaitTime || data.directLinkTimer) {
        requiredSponsorTime = Number(data.adsterraWaitTime || data.directLinkTimer || 15);
    }

    pointsToBdtRate = Number(data.pointsToBdtRate ?? 0.10);
    referralBonusPoints = Number(data.referralBonusPoints ?? 50);
    welcomeBonusPoints = Number(data.welcomeBonusPoints ?? 100);

    adminMinRecharge = Number(data.minWithdrawRecharge ?? data.minWithdrawPoints ?? 200);
    adminMinBkash = Number(data.minWithdrawBkash ?? data.minWithdrawWallet ?? 500);
    adminMinNagad = Number(data.minWithdrawNagad ?? adminMinBkash ?? 500);

    if (selectedWithdrawMethod === 'recharge') {
        minWithdrawPoints = adminMinRecharge;
    } else if (selectedWithdrawMethod === 'bkash') {
        minWithdrawPoints = adminMinBkash;
    } else if (selectedWithdrawMethod === 'nagad') {
        minWithdrawPoints = adminMinNagad;
    }

    netConfigs.monetag.zoneId = data.monetagZoneId || "8765432";
    netConfigs.monetag.reward = Number(data.rewardMonetagPoints ?? 15);
    netConfigs.monetag.limit = Number(data.monetagLimit ?? data.limitMonetag ?? 15);

    netConfigs.adsgram.rewardedBlockId = data.adsgramRewardedBlockId || data.adsgramBlockId || "26019";
    netConfigs.adsgram.interstitialBlockId = data.adsgramInterstitialBlockId || "26020";
    netConfigs.adsgram.mode = (data.adsgramMode || "swap").toLowerCase();
    netConfigs.adsgram.reward = Number(data.rewardAdsgramPoints ?? 20);
    netConfigs.adsgram.limit = Number(data.adsgramLimit ?? data.limitAdsgram ?? 20);

    const rawAdsterra = data.adsterraUrl || data.adsterraLink || data.directLink || data.adsterraDirectLink || "https://www.highcpmgate.com/sample";
    let formattedAdsterra = String(rawAdsterra).trim();
    if (!formattedAdsterra.startsWith('http://') && !formattedAdsterra.startsWith('https://')) {
        formattedAdsterra = 'https://' + formattedAdsterra;
    }
    netConfigs.adsterra.url = formattedAdsterra;
    netConfigs.adsterra.reward = Number(data.rewardAdsterraPoints ?? 15);
    netConfigs.adsterra.limit = Number(data.adsterraLimit ?? data.limitAdsterra ?? 25);

    injectMonetagScript(netConfigs.monetag.zoneId);

    if (data.botUsername) {
        myReferralLink = data.appShortName 
            ? `https://t.me/${data.botUsername}/${data.appShortName}?startapp=ref_${userId}`
            : `https://t.me/${data.botUsername}?start=ref_${userId}`;
        const refDisplay = document.getElementById('referral-link-display');
        if (refDisplay) refDisplay.innerText = myReferralLink;
    }

    const supportLinkEl = document.getElementById('telegram-support-link');
    const supportUrl = data.supportUrl || data.telegramSupport || (data.botUsername ? `https://t.me/${data.botUsername}?start=support` : 'https://t.me/');
    if (supportLinkEl) supportLinkEl.href = supportUrl.startsWith('http') ? supportUrl : `https://t.me/${supportUrl.replace('@', '')}`;

    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = formatNum(netConfigs.monetag.reward));
    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = formatNum(netConfigs.adsgram.reward));
    document.querySelectorAll('.reward-adsterra-val').forEach(el => el.innerText = formatNum(netConfigs.adsterra.reward));

    const wbModal = document.getElementById('welcome-bonus-modal');
    if (wbModal) wbModal.innerText = formatNum(welcomeBonusPoints);

    const refBonusEl = document.getElementById('display-ref-bonus');
    if (refBonusEl) refBonusEl.innerText = formatNum(referralBonusPoints);

    updateUI();
});

// ================= ১০. ইউজার ইনিশিয়ালাইজেশন =================
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
                isChannelVerified: false,
                adsWatchedCount: 0,
                monetagWatchedCount: 0,
                adsgramWatchedCount: 0,
                adsterraWatchedCount: 0,
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

            openWelcomeModal();
        }

        if (!userListenerAttached) {
            userListenerAttached = true;
            userRef.on('value', (s) => {
                const data = s.val();
                if (!data) return;

                balancePoints = Math.round(Number(data.balance || 0));
                isChannelVerified = !!data.isChannelVerified;

                adsWatchedCount = Number(data.adsWatchedCount || 0);
                monetagWatchedCount = Number(data.monetagWatchedCount || 0);
                adsgramWatchedCount = Number(data.adsgramWatchedCount || 0);
                adsterraWatchedCount = Number(data.adsterraWatchedCount || 0);

                referralCount = Number(data.referralCount || 0);
                referralEarnings = Math.round(Number(data.referralEarnings || 0));
                lastCheckInDate = data.lastCheckInDate || "";
                checkInStreak = Number(data.checkInStreak || 0);

                const currentServerDay = getSafeDateKey();
                if (data.lastAdDate !== currentServerDay) {
                    adsWatchedCount = 0;
                    monetagWatchedCount = 0;
                    adsgramWatchedCount = 0;
                    adsterraWatchedCount = 0;

                    userRef.update({
                        adsWatchedCount: 0,
                        monetagWatchedCount: 0,
                        adsgramWatchedCount: 0,
                        adsterraWatchedCount: 0,
                        lastAdDate: currentServerDay
                    });
                }

                updateUI();
                renderCheckInGrid();
                updateFullViewMetrics();
            });
        }
        
        // অ্যাপে প্রবেশের সময় স্বয়ংক্রিয় রিয়েল-টাইম মেম্বারশিপ যাচাই
        silentVerifyTelegramMembership();
    });

    listenToUserReferrals();
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

    const statusTextEl = document.getElementById('profile-verify-status-text');
    const badgeEl = document.getElementById('profile-verify-badge');
    const headerStatus = document.getElementById('header-user-status');

    if (isChannelVerified) {
        if (statusTextEl) {
            statusTextEl.innerText = t('verify_status_verified');
            statusTextEl.style.color = 'var(--accent-mint)';
        }
        if (badgeEl) {
            badgeEl.innerText = t('verify_badge_verified');
            badgeEl.className = 'h-badge st-approved';
        }
        if (headerStatus) {
            headerStatus.innerText = '● ' + (currentLang === 'bn' ? 'ভেরিফাইড মেম্বার' : 'Verified Member');
            headerStatus.style.color = 'var(--accent-mint)';
        }
    } else {
        if (statusTextEl) {
            statusTextEl.innerText = t('verify_status_unverified');
            statusTextEl.style.color = '#EF4444';
        }
        if (badgeEl) {
            badgeEl.innerText = t('verify_badge_unverified');
            badgeEl.className = 'h-badge st-rejected';
        }
        if (headerStatus) {
            headerStatus.innerText = '● ' + (currentLang === 'bn' ? 'আনভেরিফাইড (কাজ বন্ধ)' : 'Unverified (Locked)');
            headerStatus.style.color = '#EF4444';
        }
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

// ================= ১১. ইউটিউব টিউটোরিয়াল ও চ্যানেল ভেরিফিকেশন ইঞ্জিন =================
function openTutorialVideo() {
    playClickSound();
    triggerHaptic('medium');

    if (tg && typeof tg.openLink === 'function') {
        tg.openLink(tutorialVideoUrl);
    } else {
        window.open(tutorialVideoUrl, '_blank');
    }
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

function openChannelVerifyModal() {
    playClickSound();
    triggerHaptic('light');

    const joinBtn = document.getElementById('btn-verify-join-tg');
    if (joinBtn) joinBtn.href = telegramChannelUrl;

    const modal = document.getElementById('channel-verify-modal');
    if (modal) {
        modal.style.display = 'flex';
        pushModalToStack('channel-verify-modal', closeChannelVerifyModal);
    }
}

function closeChannelVerifyModal() {
    playClickSound();
    triggerHaptic('light');
    const modal = document.getElementById('channel-verify-modal');
    if (modal) modal.style.display = 'none';
    removeModalFromStack('channel-verify-modal');
}

// সাইক্লিক/রিয়েল-টাইম মেম্বারশিপ যাচাই (লিভ নিলে স্বয়ংক্রিয়ভাবে আনভেরিফাইড করবে)
async function silentVerifyTelegramMembership() {
    if (!BACKEND_API_URL) return;
    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/check-channel-membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ 
                userId: userId,
                initData: tg?.initData || ''
            })
        });

        if (resp.ok) {
            const resData = await resp.json();
            const isCurrentlyMember = (resData && resData.isMember === true);

            if (isChannelVerified !== isCurrentlyMember) {
                isChannelVerified = isCurrentlyMember;
                await db.ref('users/' + userId).update({
                    isChannelVerified: isCurrentlyMember
                });
                updateUI();
            }
            return isCurrentlyMember;
        }
    } catch (e) { }
    return isChannelVerified;
}

// ম্যানুয়াল ভেরিফাই বাটন হ্যান্ডলার
async function checkTelegramVerification() {
    playClickSound();
    triggerHaptic('medium');

    const btn = document.getElementById('btn-check-tg-verify');
    if (btn) btn.disabled = true;

    showToast(t('toast_verifying_membership'));

    try {
        let isMemberVerified = false;

        if (BACKEND_API_URL) {
            const resp = await fetch(`${BACKEND_API_URL}/api/check-channel-membership`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-telegram-init-data': tg?.initData || ''
                },
                body: JSON.stringify({ 
                    userId: userId,
                    initData: tg?.initData || ''
                })
            });

            if (resp.ok) {
                const resData = await resp.json();
                if (resData && resData.isMember === true) {
                    isMemberVerified = true;
                }
            }
        }

        if (isMemberVerified) {
            await db.ref('users/' + userId).update({
                isChannelVerified: true,
                verifiedAt: new Date().toISOString()
            });

            isChannelVerified = true;
            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_verify_success'));
            closeChannelVerifyModal();
            updateUI();
        } else {
            isChannelVerified = false;
            await db.ref('users/' + userId).update({
                isChannelVerified: false
            });
            updateUI();
            triggerHaptic('notification_error');
            showToast(t('toast_verify_required'), 'error');
        }
    } catch (err) {
        triggerHaptic('notification_error');
        showToast(t('toast_verify_required'), 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ================= ১২. ফুলভিউ ইন-পেজ স্ক্রিন =================
function updateFullViewMetrics() {
    const screen = document.getElementById('network-fullview');
    if (!screen || !screen.classList.contains('active')) return;

    let curCount = 0;
    let curLimit = 0;

    if (selectedNetwork === 'monetag') {
        curCount = monetagWatchedCount;
        curLimit = netConfigs.monetag.limit;
    } else if (selectedNetwork === 'adsgram') {
        curCount = adsgramWatchedCount;
        curLimit = netConfigs.adsgram.limit;
    } else if (selectedNetwork === 'adsterra') {
        curCount = adsterraWatchedCount;
        curLimit = netConfigs.adsterra.limit;
    }

    const limitEl = document.getElementById('fv-limit-count');
    if (limitEl) limitEl.innerText = `${formatNum(curCount)} / ${formatNum(curLimit)}`;

    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');

    if (curCount >= curLimit) {
        if (actionBtn) actionBtn.disabled = true;
        if (btnText) btnText.innerText = currentLang === 'bn' ? "সীমা শেষ হয়েছে" : "Limit Reached";
    } else {
        if (actionBtn) actionBtn.disabled = false;
        if (btnText) btnText.innerText = t('btn_watch_and_earn');
    }
}

async function openNetworkFullView(networkKey) {
    playClickSound();
    triggerHaptic('light');

    // ইনস্ট্যান্ট মেম্বারশিপ রি-চেক (ইউজার লিভ নিলে তৎক্ষণাৎ ধরা পড়বে)
    const isMember = await silentVerifyTelegramMembership();
    if (!isMember) {
        triggerHaptic('notification_error');
        showToast(t('toast_verify_required'), 'error');
        openChannelVerifyModal();
        return;
    }

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
        },
        adsterra: {
            badge: currentLang === 'bn' ? "স্পনসর ডিরেক্ট ভিজিট" : "SPONSOR DIRECT VISIT",
            headline: currentLang === 'bn' ? "স্পনসর ওয়েবসাইট ভিজিট" : "Sponsor Website Visit",
            desc: currentLang === 'bn' 
                ? `স্পনসর পেজটিতে অন্তত ${formatNum(requiredSponsorTime)} সেকেন্ড সক্রিয়ভাবে থাকুন এবং পয়েন্ট পান।` 
                : `Visit the sponsored partner website for at least ${requiredSponsorTime} seconds to unlock reward points.`,
            iconClass: "task-purple",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
            watched: adsterraWatchedCount,
            limit: netConfigs.adsterra.limit
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
    
    screen.classList.add('active');
    pushModalToStack('network-fullview', closeNetworkFullView);
    updateFullViewMetrics();
}

function closeNetworkFullView() {
    playClickSound();
    triggerHaptic('light');
    if (adsterraSession) {
        adsterraSession.active = false;
    }
    const screen = document.getElementById('network-fullview');
    if (screen) screen.classList.remove('active');
    removeModalFromStack('network-fullview');
}

// ================= ১৩. অ্যাড এক্সিকিউশন ও ডায়নামিক অ্যান্টি-চিট ইঞ্জিন =================
async function executeCurrentNetworkAd() {
    playClickSound();
    triggerHaptic('medium');

    const isMember = await silentVerifyTelegramMembership();
    if (!isMember) {
        triggerHaptic('notification_error');
        showToast(t('toast_verify_required'), 'error');
        closeNetworkFullView();
        openChannelVerifyModal();
        return;
    }

    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');

    let curCount = 0;
    let curLimit = 0;

    if (selectedNetwork === 'monetag') {
        curCount = monetagWatchedCount;
        curLimit = netConfigs.monetag.limit;
    } else if (selectedNetwork === 'adsgram') {
        curCount = adsgramWatchedCount;
        curLimit = netConfigs.adsgram.limit;
    } else if (selectedNetwork === 'adsterra') {
        curCount = adsterraWatchedCount;
        curLimit = netConfigs.adsterra.limit;
    }

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
                    // ফুলভিউ বন্ধ করা হবে না; সরাসরি UI আপডেট হবে
                    updateFullViewMetrics();
                }
                actionBtn.disabled = false;
            }).catch((err) => {
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
                // ফুলভিউ বন্ধ করা হবে না; সরাসরি UI আপডেট হবে
                updateFullViewMetrics();
            } else {
                showToast(t('toast_ad_failed'), 'error');
            }
            actionBtn.disabled = false;
        }
        else if (selectedNetwork === 'adsterra') {
            let directUrl = netConfigs.adsterra.url;
            if (!directUrl.startsWith('http://') && !directUrl.startsWith('https://')) {
                directUrl = 'https://' + directUrl;
            }

            adsterraSession = {
                active: true,
                startedAt: Date.now(),
                leftAt: null,
                hasLeft: false,
                reward: netConfigs.adsterra.reward
            };

            actionBtn.disabled = true;
            btnText.innerText = currentLang === 'bn' 
                ? `⏳ ${formatNum(requiredSponsorTime)} সেকেন্ড পেজে থেকে ফিরে আসুন...` 
                : `⏳ Stay ${requiredSponsorTime}s in sponsor link & return...`;

            showToast(currentLang === 'bn' 
                ? `🚀 বিজ্ঞাপন ওপেন হচ্ছে! অন্তত ${formatNum(requiredSponsorTime)} সেকেন্ড পেজে থাকুন।` 
                : `🚀 Opening sponsor! Please stay at least ${requiredSponsorTime} seconds.`);

            try {
                if (tg && typeof tg.openLink === 'function') {
                    tg.openLink(directUrl);
                } else {
                    window.open(directUrl, '_blank', 'noopener,noreferrer');
                }
            } catch (err) {
                window.open(directUrl, '_blank');
            }
        }
    } catch (err) {
        showToast(t('toast_ad_failed'), 'error');
        if (actionBtn) actionBtn.disabled = false;
    }
}

// Adsterra সক্রিয় যাচাই ইঞ্জিন
function checkAdsterraCompletion() {
    if (!adsterraSession || !adsterraSession.active) return;

    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');
    const timeNow = Date.now();
    
    const startTime = adsterraSession.startedAt;
    const secondsSpent = Math.floor((timeNow - startTime) / 1000);

    if (secondsSpent < requiredSponsorTime) {
        const remainingSeconds = requiredSponsorTime - secondsSpent;
        adsterraSession.active = false;
        if (actionBtn) actionBtn.disabled = false;
        if (btnText) btnText.innerText = t('btn_watch_and_earn');

        triggerHaptic('notification_error');
        showToast(
            currentLang === 'bn' 
                ? `⚠️ আপনি মাত্র ${formatNum(secondsSpent)} সেকেন্ড ছিলেন! অন্তত ${formatNum(requiredSponsorTime)} সেকেন্ড থাকতে হবে। (আরও ${formatNum(remainingSeconds)} সে বাকি ছিল)` 
                : `⚠️ You stayed only ${secondsSpent}s! Must stay at least ${requiredSponsorTime}s.`, 
            'error'
        );
    } else {
        const rewardPoints = adsterraSession.reward;
        adsterraSession.active = false;

        if (btnText) btnText.innerText = t('btn_watch_and_earn');
        if (actionBtn) actionBtn.disabled = false;

        creditPoints('adsterra', rewardPoints);
        // ফুলভিউ বন্ধ করা হবে না; কাউন্টার ও বাটন আপডেট হবে
        updateFullViewMetrics();
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (adsterraSession && adsterraSession.active) {
            adsterraSession.hasLeft = true;
            adsterraSession.leftAt = Date.now();
        }
    } else {
        if (adsterraSession && adsterraSession.active && adsterraSession.hasLeft) {
            checkAdsterraCompletion();
        }
    }
});

window.addEventListener('focus', () => {
    if (adsterraSession && adsterraSession.active && adsterraSession.hasLeft) {
        checkAdsterraCompletion();
    }
});

// ================= ১৪. পয়েন্ট ক্রেডিটিং ইঞ্জিন =================
async function creditPoints(networkKey, reward) {
    const validConfig = netConfigs[networkKey];
    if (!validConfig) return;
    const safeReward = Number(validConfig.reward);

    if (BACKEND_API_URL) {
        try {
            const resp = await fetch(`${BACKEND_API_URL}/api/claim-ad-reward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-telegram-init-data': tg?.initData || ''
                },
                body: JSON.stringify({ 
                    network: networkKey, 
                    reward: safeReward,
                    userId: userId 
                })
            });
            const resData = await resp.json();
            if (resp.ok && resData.success) {
                playRewardSound();
                triggerConfetti();
                triggerHaptic('notification_success');
                showToast(t('toast_pts_credited', { pts: safeReward }));
                updateFullViewMetrics();
                return;
            } else if (resData && resData.message) {
                return showToast(resData.message, 'error');
            }
        } catch (e) {
            return showToast(t('toast_ad_failed'), 'error');
        }
        return; 
    }

    const today = getSafeDateKey();
    const userRef = db.ref('users/' + userId);

    const result = await userRef.transaction(current => {
        if (!current) return;
        
        if (current.lastAdDate !== today) {
            current.adsWatchedCount = 0;
            current.monetagWatchedCount = 0;
            current.adsgramWatchedCount = 0;
            current.adsterraWatchedCount = 0;
            current.lastAdDate = today;
        }

        const netCountKey = `${networkKey}WatchedCount`;
        const currentNetworkCount = Number(current[netCountKey] || 0);
        const limitForNetwork = validConfig.limit;

        if (currentNetworkCount >= limitForNetwork) {
            return;
        }

        current.balance = Math.round(Number(current.balance || 0) + safeReward);
        current.adsWatchedCount = Number(current.adsWatchedCount || 0) + 1;
        current[netCountKey] = currentNetworkCount + 1;
        current.lastAdDate = today;
        current.lastAdTimestamp = Date.now();

        return current;
    });

    if (result.committed) {
        playRewardSound();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(t('toast_pts_credited', { pts: safeReward }));
        updateFullViewMetrics();
    } else {
        showToast(t('toast_limit_reached'), 'error');
    }
}

// ================= ১৫. ক্যাশআউট কন্ট্রোলার ও অপারেটর গার্ড =================
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

const operatorPrefixes = {
    'Grameenphone': /^01[37]\d{8}$/,
    'Banglalink': /^01[49]\d{8}$/,
    'Robi': /^018\d{8}$/,
    'Airtel': /^016\d{8}$/,
    'Teletalk': /^015\d{8}$/
};

async function handleWithdrawSubmit(event) {
    event.preventDefault();
    playClickSound();
    triggerHaptic('medium');

    const isMember = await silentVerifyTelegramMembership();
    if (!isMember) {
        triggerHaptic('notification_error');
        showToast(t('toast_verify_withdraw'), 'error');
        openChannelVerifyModal(); 
        return;
    }

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

    if (selectedWithdrawMethod === 'recharge' && operator) {
        const regex = operatorPrefixes[operator];
        if (regex && !regex.test(phone)) {
            return showToast(t('toast_operator_mismatch'), 'error');
        }
    }

    if (pointsToDeduct > balancePoints) {
        return showToast(t('toast_insufficient_bal'), 'error');
    }

    const calculatedBdt = (pointsToDeduct * pointsToBdtRate).toFixed(2);
    let methodName = 'Mobile Recharge';
    if (selectedWithdrawMethod === 'bkash') methodName = 'bKash';
    if (selectedWithdrawMethod === 'nagad') methodName = 'Nagad';

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

// ================= ১৬. সাকসেস রিসিট মোডাল =================
function openCashoutSuccessModal(data) {
    const modal = document.getElementById('cashout-success-modal');
    if (!modal) return;

    document.getElementById('receipt-method').innerText = data.method;
    document.getElementById('receipt-account').innerText = data.account;
    document.getElementById('receipt-points').innerText = `-${formatNum(data.points)} ${t('pts_currency')}`;
    document.getElementById('receipt-amount').innerText = `৳ ${formatNum(data.bdt)}`;
    document.getElementById('receipt-status').innerText = t('status_pending');

    modal.style.display = 'flex';
    pushModalToStack('cashout-success-modal', closeCashoutSuccessModal);

    playRewardSound();
    triggerConfetti();
    triggerHaptic('notification_success');
}

function closeCashoutSuccessModal() {
    playClickSound();
    triggerHaptic('light');
    const modal = document.getElementById('cashout-success-modal');
    if (modal) modal.style.display = 'none';
    removeModalFromStack('cashout-success-modal');

    const submitBtn = document.getElementById('btn-submit-withdraw');
    const submitText = document.getElementById('btn-submit-text');
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.innerText = t('btn_submit_cashout');
}

// ================= ১৭. উইথড্রয়াল হিস্ট্রি =================
function openWithdrawHistory() {
    playClickSound();
    triggerHaptic('light');
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
        pushModalToStack('history-modal-overlay', closeWithdrawHistory);
    }
    loadHistoryData();
}

function closeWithdrawHistory() {
    playClickSound();
    triggerHaptic('light');
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    removeModalFromStack('history-modal-overlay');
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

// ================= ১৮. ৭-দিনের ডেইলি চেক-ইন =================
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

// ================= ১৯. রেফারেল ও সোশ্যাল শেয়ার =================
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

// ================= ২০. অ্যাপ বুটস্ট্র্যাপ =================
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
