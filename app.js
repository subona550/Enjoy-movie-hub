/*** 
 * AETHERIA ARCADE - CYBER GAMING & REWARD ENGINE (v7.0.0 PRODUCTION)
 * - 100% Synced with Secured Cloudflare Worker & Firebase Database
 * - Realtime Mini-Arcade Tap Reflex System
 * - Zero Direct Firebase Writes (Tamper-Proof Architecture)
 * - Adsgram & Telegram Moderation Policy Compliant
 */

// ================= ১. কোর কনফিগারেশন =================
const BACKEND_API_URL = "https://earnpro84cc.rakibkdbb.workers.dev"; 
const DEFAULT_BOT_USERNAME = "EarnHubProBot"; 

// ================= ২. সাইবার ওয়েব অডিও সিন্থেসাইজার =================
let audioCtx = null;
let isAudioEnabled = localStorage.getItem('app_audio_enabled') !== 'false';

function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function toggleAudioFx() {
    isAudioEnabled = !isAudioEnabled;
    localStorage.setItem('app_audio_enabled', isAudioEnabled);
    updateAudioIcon();
    if (isAudioEnabled) {
        playClickSound();
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
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) { }
}

function playTapArcadeSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 + Math.random() * 300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) { }
}

function playRewardSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.setValueAtTime(950, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(1400, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
    } catch (e) { }
}

// ================= ৩. ডিভাইস সিকিউরিটি ও ফিঙ্গারপ্রিন্ট =================
function getDeviceFingerprint() {
    let localId = localStorage.getItem('eh_device_uuid');
    if (!localId) {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            const renderer = gl ? gl.getParameter(gl.RENDERER) : 'generic';
            const str = `${navigator.userAgent}_${screen.width}x${screen.height}_${screen.colorDepth}_${renderer}`;
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            localId = 'pilot_' + Math.abs(hash).toString(36) + '_' + Math.random().toString(36).substring(2, 8);
        } catch (e) {
            localId = 'pilot_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
        }
        localStorage.setItem('eh_device_uuid', localId);
    }
    return localId;
}
const currentDeviceId = getDeviceFingerprint();

// ================= ৪. টেলিগ্রাম ওয়েবঅ্যাপ ও মোডাল নেভিগেশন =================
const tg = window.Telegram?.WebApp;
const openModalStack = [];

function syncModalState() {
    if (isUserBanned) {
        if (tg?.BackButton) tg.BackButton.hide();
        return;
    }
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
            const safeBottom = tg.safeAreaInset?.bottom || tg.contentSafeAreaInset?.bottom || 0;
            if (safeTop > 0) document.documentElement.style.setProperty('--safe-top', `${safeTop}px`);
            if (safeBottom > 0) document.documentElement.style.setProperty('--safe-bottom', `${safeBottom}px`);
        };
        applyTelegramSafeArea();
        if (typeof tg.onEvent === 'function') {
            tg.onEvent('safeAreaChanged', applyTelegramSafeArea);
        }

        if (tg.BackButton) {
            tg.BackButton.hide();
            tg.BackButton.onClick(() => {
                if (isUserBanned) return;
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
            particleCount: 80,
            spread: 90,
            origin: { y: 0.65 },
            colors: ['#00FF9D', '#00F0FF', '#BD00FF', '#FFFFFF']
        });
    }
}

// ================= ৫. থিম কন্ট্রোলার =================
let currentTheme = localStorage.getItem('app_theme') || 'dark';

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
    localStorage.setItem('app_theme', currentTheme);
    applyTheme();
    showToast(currentTheme === 'light' 
        ? (currentLang === 'bn' ? 'লাইট মোড সক্রিয়' : 'Light Matrix Enabled') 
        : (currentLang === 'bn' ? 'ডার্ক মোড সক্রিয়' : 'Dark Matrix Enabled'));
}

// ================= ৬. ফায়ারবেস ডেটাবেস সিঙ্ক =================
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

// ================= ৭. দ্বিভাষিক ইঞ্জিন ও পলিসি-বান্ধব ডিকশনারি =================
let currentLang = localStorage.getItem('app_lang') || 'bn';
const bnDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};

function formatNum(val) {
    const s = String(val ?? 0);
    if (currentLang !== 'bn') return s;
    return s.replace(/\d/g, d => bnDigits[d]);
}

const translations = {
    en: {
        welcome_badge: "PILOT AIRDROP",
        welcome_title: "Airdrop Vault Unlocked!",
        welcome_desc_1: "For synchronizing with Aetheria Arcade, you received",
        welcome_desc_2: "Energy Credits as starter bounty!",
        btn_claim_welcome: "Claim Energy Credits",
        user_status: "● Active Operator",
        wallet_balance_label: "Total Power Credits",
        pts_currency: "CREDITS",
        arcade_hint: "⚡ Tap node repeatedly to build combo and charge energy",
        tutorial_btn_title: "Arcade Training Video Guide",
        tutorial_btn_sub: "Learn gameplay tactics & prize redemption",
        btn_watch: "Watch",
        menu_verify_channel: "Telegram Comms Sync",
        verify_status_unverified: "● Unverified (Tasks Locked)",
        verify_status_verified: "● Verified Comms (Active)",
        verify_badge_unverified: "Verify Now",
        verify_badge_verified: "Verified",
        verify_badge: "NETWORK COMMS SYNC",
        verify_title: "Sync Official Comms Channel",
        verify_desc: "You must link with our official Telegram comms to keep energy boosts and reward prize redemptions unlocked.",
        btn_join_tg_channel: "Join Comms Channel",
        btn_check_verify: "Confirm Comms Link",
        btn_close: "Dismiss",
        section_tasks_title: "Power Boosters & Sponsor Missions",
        section_tasks_sub: "Stream sponsor videos to recharge your credits",
        badge_rewarded: "CHRONO BOOST",
        badge_direct: "SPONSOR EXPEDITION",
        monetag_title: "Chrono Overdrive",
        monetag_desc: "Stream full sponsored mission to inject instant power credits",
        adsgram_title: "Quantum Loot Cache",
        adsgram_desc: "Engage high-CPM video data stream for rapid energy surplus",
        adsterra_title: "Cyber Nexus Recon",
        adsterra_desc: "Scout sponsored portal and maintain connection for set seconds",
        btn_start_task: "Activate",
        refer_badge: "SYNDICATE RECRUITMENT",
        refer_heading: "Build Squad & Earn Lifetime Bounty",
        refer_sub_1: "Earn",
        refer_sub_2: "Credits when recruited agent verifies comms & finishes {ads} missions!",
        btn_copy: "Copy",
        btn_share_telegram: "Share via Telegram",
        stat_total_ref: "Recruited Pilots",
        stat_ref_earnings: "Syndicate Bounty",
        refer_list_title: "Recruited Agent Squad",
        refer_list_sub: "Bounties unlock once required missions are completed",
        empty_referrals: "No squad recruits found. Broadcast your link to recruit pilots!",
        withdraw_bal_label: "Redeemable Vault Balance",
        method_recharge: "Airtime Top-up",
        method_bkash: "bKash Payout",
        method_nagad: "Nagad Transfer",
        label_operator: "Select Telecom Carrier:",
        label_sim_type: "Connection Protocol:",
        label_phone: "Account / Mobile Number:",
        label_points: "Credits to Redeem:",
        label_min: "Minimum:",
        label_you_will_get: "Total Prize Value:",
        btn_submit_cashout: "Place Redemption Order",
        btn_submitting: "Deploying Order...",
        btn_view_history: "View Transaction History",
        profile_stat_bal: "Power Level",
        profile_stat_ref: "Squad Members",
        menu_payment_history: "Redemption & Payout Logs",
        menu_daily_bonus: "7-Day Protocol Log",
        menu_support: "24/7 Pilot Help Desk",
        menu_tg_support: "Official Telegram Comms",
        footer_caption: "Aetheria Arcade Engine v7.0.0 • Decoupled WebApp",
        fv_task_details: "Mission Briefing",
        fv_m_reward: "Mission Reward",
        fv_m_limit: "Daily Cap",
        fv_m_status: "Status",
        fv_active: "● Active",
        fv_rules_title: "Mission Execution Rules:",
        fv_rule_step1: 'Tap the <strong>"Deploy Mission Booster"</strong> action button below.',
        fv_rule_step2: "Do not minimize or close the portal while sponsored stream is active.",
        fv_rule_step3: "Clicking on advertisements is <strong>never mandatory</strong>. Complete the video to receive rewards immediately.",
        btn_watch_and_earn: "Deploy Mission Booster",
        checkin_modal_title: "7-Day Daily Protocol Gifts",
        history_modal_title: "Redemption & Cashout History",
        loading_text: "Accessing core data...",
        nav_home: "Arcade",
        nav_refer: "Guild",
        nav_withdraw: "Vault",
        nav_profile: "Pilot",
        toast_limit_reached: "⚠️ Today's mission cap reached for this booster!",
        toast_preparing_ad: "⚡ Synchronizing mission stream...",
        toast_starting_ad: "🎬 Deploying sponsored booster...",
        toast_ad_failed: "⚠️ Mission aborted or streaming interrupted.",
        toast_sdk_error: "⚠️ Booster SDK failed to initialize or adblocker detected!",
        toast_pts_credited: "🎉 +{pts} Power Credits injected to vault!",
        toast_min_limit: "⚠️ Minimum redemption threshold is {pts} credits.",
        toast_valid_phone: "⚠️ Enter a valid 11-digit mobile number.",
        toast_operator_mismatch: "⚠️ Carrier prefix does not match mobile number!",
        toast_insufficient_bal: "⚠️ Insufficient credits in vault balance.",
        toast_cashout_error: "⚠️ Insufficient credits or terminal gateway error.",
        toast_already_claimed: "⚠️ Daily protocol gift already claimed today!",
        toast_claim_success: "🎉 Day {day} reward +{pts} credits claimed!",
        toast_link_copied: "✅ Recruitment link copied to clipboard!",
        toast_verify_required: "⚠️ Comms link required! Join Telegram channel to activate.",
        toast_verify_withdraw: "⚠️ You must synchronize official Telegram comms before prize redemption!",
        toast_verify_success: "🎉 Comms link verified! Missions & Vault unlocked.",
        toast_already_verified: "✅ Pilot comms already verified!",
        toast_verifying_membership: "⏳ Verifying official comms link...",
        checkin_day_text: "Day {day}",
        checkin_streak_text: "Current Streak: {day} Days",
        checkin_claimed_btn: "✅ Today's Bounty Claimed",
        checkin_claim_btn: "🎁 Claim Day {day} Bounty (+{pts} CREDITS)",
        home_streak_claimed: "Streak: {day} Days (Claimed)",
        home_streak_ready: "Day {day} Bounty",
        empty_history: "No previous redemption records found in archive.",
        receipt_badge: "TRANSACTION ORDERED",
        receipt_title: "Redemption Successful!",
        receipt_desc: "Your prize order has been securely deployed and is in queue.",
        rc_method: "Payment Channel:",
        rc_account: "Account Number:",
        rc_points: "Credits Debited:",
        rc_amount: "Cash Value:",
        rc_status: "Status:",
        status_pending: "In-Review",
        btn_done: "Dismiss Order"
    },
    bn: {
        welcome_badge: "পাইলট এয়ারড্রপ",
        welcome_title: "এয়ারড্রপ রিওয়ার্ড আনলকড!",
        welcome_desc_1: "আর্কেড নেটওয়ার্কে প্রথম যোগদানের জন্য আপনি পেয়েছেন",
        welcome_desc_2: "পয়েন্ট ক্রিপ্টো এনার্জি ক্রেডিট!",
        btn_claim_welcome: "ক্লেইম এনার্জি ক্রেডিট",
        user_status: "● ভেরিফাইড অপারেটর",
        wallet_balance_label: "টোটাল পাওয়ার ক্রেডিট",
        pts_currency: "ক্রেডিট",
        arcade_hint: "⚡ ট্যাপ করে কম্বো চার্জ করুন এবং ফ্রি পাওয়ার রিফিল পান",
        tutorial_btn_title: "আর্কেড ট্রেনিং ভিডিও গাইড",
        tutorial_btn_sub: "হাই-স্কোর ও সঠিক রিওয়ার্ড নেওয়ার নিয়ম দেখুন",
        btn_watch: "ভিডিও",
        menu_verify_channel: "টেলিগ্রাম চ্যানেল ভেরিফিকেশন",
        verify_status_unverified: "● আনভেরিফাইড (টাস্ক ব্লক)",
        verify_status_verified: "● ভেরিফাইড চ্যানেল (সক্রিয়)",
        verify_badge_unverified: "ভেরিফাই করুন",
        verify_badge_verified: "ভেরিফাইড",
        verify_badge: "নেটওয়ার্ক কমস সিঙ্ক",
        verify_title: "অফিসিয়াল কমস লিংক সিঙ্ক",
        verify_desc: "গেমিং টাস্ক, আর্কেড রেটিং এবং ওয়ালেট উত্তোলন সচল রাখতে আমাদের টেলিগ্রাম কমিউনিটিতে সিঙ্ক থাকা আবশ্যক।",
        btn_join_tg_channel: "কমিউনিটিতে যুক্ত হোন",
        btn_check_verify: "ভেরিফিকেশন চেক করুন",
        btn_close: "পরে করব",
        section_tasks_title: "পাওয়ার বুস্টার ও স্পনসর মিশন",
        section_tasks_sub: "স্পনসর ভিডিও সম্পন্ন করে পাওয়ার রিচার্জ করুন",
        badge_rewarded: "ক্রোনো বুস্ট",
        badge_direct: "স্পনসর এক্সপিডিশন",
        monetag_title: "Chrono Overdrive",
        monetag_desc: "ফুল স্পনসর স্ট্রীম কমপ্লিট করে তাৎক্ষণিক পাওয়ার ক্রেডিট নিন",
        adsgram_title: "Quantum Loot Cache",
        adsgram_desc: "হাই-সিপিএম ভিডিও বিজ্ঞাপন দেখে সরাসরি ক্রেডিট জেনারেট করুন",
        adsterra_title: "Cyber Nexus Recon",
        adsterra_desc: "স্পনসর পার্টনার পোর্টালে ভিজিট করে নির্দিষ্ট সময় অবস্থান করুন",
        btn_start_task: "এক্টিভেট",
        refer_badge: "স্কোয়াড রিক্রুটমেন্ট",
        refer_heading: "স্কোয়াড বিল্ড করুন ও আর্ন শেয়ার পান",
        refer_sub_1: "আমন্ত্রিত পাইলট কমস ভেরিফাই করে {ads}টি মিশন সম্পন্ন করলেই পাবেন",
        refer_sub_2: "পয়েন্ট ক্রেডিট বোনাস!",
        btn_copy: "কপি",
        btn_share_telegram: "টেলিগ্রাম স্কোয়াডে শেয়ার করুন",
        stat_total_ref: "রিক্রুটেড পাইলট",
        stat_ref_earnings: "টোটাল গিল্ড বোনাস",
        refer_list_title: "রিক্রুটেড এজেন্ট তালিকা",
        refer_list_sub: "শর্ত পূরণ হওয়ার সাথে সাথে বোনাস যোগ হবে",
        empty_referrals: "কোনো রিক্রুট পাওয়া যায়নি। স্কোয়াড গড়তে লিংক শেয়ার করুন!",
        withdraw_bal_label: "রিডিমযোগ্য ভল্ট ব্যালেন্স",
        method_recharge: "মোবাইল রিচার্জ",
        method_bkash: "বিকাশ",
        method_nagad: "নগদ",
        label_operator: "টেলিকম নেটওয়ার্ক নির্বাচন:",
        label_sim_type: "সংযোগ প্রটোকল:",
        label_phone: "অ্যাকাউন্ট মোবাইল নম্বর:",
        label_points: "পয়েন্ট পরিমাণ:",
        label_min: "সর্বনিম্ন:",
        label_you_will_get: "মোট প্রাইজ ভ্যালু:",
        btn_submit_cashout: "রিডিমশন অর্ডার প্লেস করুন",
        btn_submitting: "প্রসেসিং হচ্ছে...",
        btn_view_history: "ট্রানজ্যাকশন হিস্ট্রি দেখুন",
        profile_stat_bal: "পাওয়ার লেভেল",
        profile_stat_ref: "স্কোয়াড মেম্বার",
        menu_payment_history: "রিডিমশন ও পেআউট লগ",
        menu_daily_bonus: "৭-দিনের স্ট্রিক ভল্ট",
        menu_support: "২৪/৭ পাইলট সাপোর্ট ডেস্ক",
        menu_tg_support: "অফিসিয়াল টেলিগ্রাম কমস",
        footer_caption: "Aetheria Arcade Engine v7.0.0 • Decoupled WebApp",
        fv_task_details: "মিশন ব্রিফিং",
        fv_m_reward: "মিশন রিওয়ার্ড",
        fv_m_limit: "দৈনিক ক্যাপ",
        fv_m_status: "স্ট্যাটাস",
        fv_active: "● সক্রিয়",
        fv_rules_title: "মিশন সম্পন্ন করার নিয়ম:",
        fv_rule_step1: 'নিচের <strong>"মিশন বুস্ট শুরু করুন"</strong> অ্যাকশন বাটনে চাপুন।',
        fv_rule_step2: "স্পনসর কন্টেন্ট চলাকালীন স্ক্রিন ক্লোজ করবেন না বা ব্যাক করবেন না।",
        fv_rule_step3: "বিজ্ঞাপনে ক্লিক করা <strong>বাধ্যতামূলক নয়</strong>। শুধুমাত্র ভিডিওটি সম্পূর্ণ সমাপ্ত হলেই স্বয়ংক্রিয়ভাবে ক্রেডিট যুক্ত হবে।",
        btn_watch_and_earn: "মিশন বুস্ট শুরু করুন",
        checkin_modal_title: "৭-দিনের ডেইলি গিফট ড্রপ",
        history_modal_title: "রিডিমশন ও ক্যাশআউট হিস্ট্রি",
        loading_text: "ডাটা রিড করা হচ্ছে...",
        nav_home: "আর্কেড",
        nav_refer: "গিল্ড",
        nav_withdraw: "ভল্ট",
        nav_profile: "অপারেটর",
        toast_limit_reached: "⚠️ আজকের জন্য এই বুস্টারের লিমিট শেষ!",
        toast_preparing_ad: "⚡ বুস্টার স্ট্রিম লোড হচ্ছে...",
        toast_starting_ad: "🎬 স্পনসর বুস্টার শুরু হচ্ছে...",
        toast_ad_failed: "⚠️ মিশন বাতিল হয়েছে বা স্ট্রিম বন্ধ করা হয়েছে।",
        toast_sdk_error: "⚠️ বুস্টার প্লাগইন ব্লকড হয়েছে বা কাজ করছে না!",
        toast_pts_credited: "🎉 +{pts} পাওয়ার ক্রেডিট ভল্টে যোগ হয়েছে!",
        toast_min_limit: "⚠️ সর্বনিম্ন রিডিমশন কোটা {pts} ক্রেডিট।",
        toast_valid_phone: "⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।",
        toast_operator_mismatch: "⚠️ নির্বাচিত অপারেটরের সাথে মোবাইল নম্বরের মিল নেই!",
        toast_insufficient_bal: "⚠️ ভল্টে পর্যাপ্ত পাওয়ার ক্রেডিট নেই।",
        toast_cashout_error: "⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা সার্ভার সংযোগ বিচ্ছিন্ন।",
        toast_already_claimed: "⚠️ আজকের প্রটোকল গিফট ইতিমধ্যে নেওয়া হয়েছে!",
        toast_claim_success: "🎉 দিন {day}-এর উপহার +{pts} ক্রেডিট যুক্ত হয়েছে!",
        toast_link_copied: "✅ রিক্রুটমেন্ট লিংক ক্লিপবোর্ডে কপি হয়েছে!",
        toast_verify_required: "⚠️ অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করে ভেরিফাই করুন!",
        toast_verify_withdraw: "⚠️ প্রাইজ রিডিম করতে টেলিগ্রাম কমস ভেরিফিকেশন সম্পন্ন করুন!",
        toast_verify_success: "🎉 মেম্বারশিপ নিশ্চিত হয়েছে! আর্কেড বুস্টার সক্রিয়।",
        toast_already_verified: "✅ পাইলট কমস ইতিমধ্যে ভেরিফাইড!",
        toast_verifying_membership: "⏳ কমস লিংক সার্ভার যাচাই করা হচ্ছে...",
        checkin_day_text: "দিন {day}",
        checkin_streak_text: "বর্তমান স্ট্রিক: {day} দিন",
        checkin_claimed_btn: "✅ আজকের গিফট নেওয়া হয়েছে",
        checkin_claim_btn: "🎁 দিন {day}-এর উপহার নিন (+{pts} ক্রেডিট)",
        home_streak_claimed: "স্ট্রিক: {day} দিন (ক্লেইমড)",
        home_streak_ready: "দিন {day} গিফট",
        empty_history: "কোনো পূর্ববর্তী রিডিমশন রেকর্ড পাওয়া যায়নি।",
        receipt_badge: "অর্ডার কনফার্মড",
        receipt_title: "রিডিমশন সফল হয়েছে!",
        receipt_desc: "আপনার প্রাইজ রিকোয়েস্ট সফলভাবে জমা হয়েছে এবং কিউতে রয়েছে।",
        rc_method: "পেমেন্ট চ্যানেল:",
        rc_account: "অ্যাকাউন্ট নম্বর:",
        rc_points: "পয়েন্ট ডেবিট:",
        rc_amount: "মোট মূল্য:",
        rc_status: "স্ট্যাটাস:",
        status_pending: "ইন-রিভিউ",
        btn_done: "অর্ডার ক্লোজ করুন"
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
            el.innerHTML = translations[currentLang][key].replace(/\{ads\}/g, formatNum(requiredRefAds));
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
    showToast(currentLang === 'en' ? 'Switched to English Interface' : 'ভাষা বাংলায় পরিবর্তন করা হয়েছে');
}

function updateDropdownOptions() {
    const selectAcc = document.getElementById('withdraw-account-type');
    if (!selectAcc) return;

    if (selectedWithdrawMethod === 'recharge') {
        selectAcc.innerHTML = currentLang === 'bn' 
            ? '<option value="Prepaid">প্রিপেইড (Prepaid)</option><option value="Postpaid">পোস্টপেইড (Postpaid)</option>'
            : '<option value="Prepaid">Prepaid</option><option value="Postpaid">Postpaid</option>';
    } else {
        selectAcc.innerHTML = currentLang === 'bn'
            ? '<option value="Personal">পার্সোনাল (Personal)</option><option value="Agent">এজেন্ট (Agent)</option>'
            : '<option value="Personal">Personal</option><option value="Agent">Agent</option>';
    }
}

// ================= ৮. ইউজার স্টেট ভেরিয়েবলস =================
let tgUser = tg?.initDataUnsafe?.user;
if (!tgUser || !tgUser.id) {
    let mockId = localStorage.getItem('eh_dev_tester_id');
    if (!mockId) {
        mockId = 'pilot_' + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('eh_dev_tester_id', mockId);
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

let balancePoints = 0;
let adsWatchedCount = 0;
let monetagWatchedCount = 0;
let adsgramWatchedCount = 0;
let adsterraWatchedCount = 0;
let totalAllTimeAds = 0;

let referralCount = 0;
let referralEarnings = 0;
let lastCheckInDate = "";
let checkInStreak = 0;

let isChannelVerified = false;
let isUserBanned = false;
let myReferrerId = null;
let refRewardClaimed = false;

let requiredRefAds = 3; 
const checkInRewards = [2, 3, 5, 10, 15, 20, 50];

let tutorialVideoUrl = "https://www.youtube.com"; 
let telegramChannelUrl = "https://t.me/";
let telegramPayoutProofUrl = "https://t.me/";

let pointsToBdtRate = 0.10;
let referralBonusPoints = 50;
let welcomeBonusPoints = 100;
let myReferralLink = `https://t.me/${DEFAULT_BOT_USERNAME}?start=ref_${userId}`;

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
let adsterraTimerInterval = null;

let isSplashFinished = false;
let isFirstTimeNewUser = false;

// মিনি-আর্কেড গেম স্টেট
let arcadeComboCounter = 0;
let arcadeLastTapTime = 0;

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
const initialReferrerId = getReferrerId();

// ================= ৯. MONETAG SDK লোডার =================
function injectMonetagScript(zoneId) {
    if (!zoneId) return;
    const scriptId = `monetag-sdk-${zoneId}`;
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
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

// ================= ১০. ফায়ারবেস সেটিংস ও প্রুফ চ্যানেল সিঙ্ক =================
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

    // পলিসি কমপ্লায়েন্স: পাবলিক পেমেন্ট প্রুফ চ্যানেল সিঙ্ক
    const rawProof = data.payoutProofChannel || data.proofChannel || data.paymentProofChannel || data.telegramChannel;
    if (rawProof) {
        telegramPayoutProofUrl = String(rawProof).startsWith('http') 
            ? String(rawProof) 
            : `https://t.me/${String(rawProof).replace('@', '')}`;
    } else {
        telegramPayoutProofUrl = telegramChannelUrl;
    }

    const proofCardEl = document.getElementById('telegram-payout-proof-link');
    if (proofCardEl) proofCardEl.href = telegramPayoutProofUrl;

    const profileProofEl = document.getElementById('profile-proof-link');
    if (profileProofEl) profileProofEl.href = telegramPayoutProofUrl;

    const joinBtn = document.getElementById('btn-verify-join-tg');
    if (joinBtn) joinBtn.href = telegramChannelUrl;

    const channelLinkEl = document.getElementById('telegram-channel-link');
    if (channelLinkEl) channelLinkEl.href = telegramChannelUrl;

    if (data.adsterraWaitTime || data.directLinkTimer) {
        requiredSponsorTime = Number(data.adsterraWaitTime || data.directLinkTimer || 15);
    }

    if (data.requiredRefAds) {
        requiredRefAds = Number(data.requiredRefAds);
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

    const activeBotUser = (data.botUsername || DEFAULT_BOT_USERNAME).replace('@', '').trim();
    myReferralLink = data.appShortName 
        ? `https://t.me/${activeBotUser}/${data.appShortName}?startapp=ref_${userId}`
        : `https://t.me/${activeBotUser}?start=ref_${userId}`;

    const refDisplay = document.getElementById('referral-link-display');
    if (refDisplay) refDisplay.innerText = myReferralLink;

    const supportLinkEl = document.getElementById('telegram-support-link');
    const supportUrl = data.supportUrl || data.telegramSupport || (data.botUsername ? `https://t.me/${activeBotUser}?start=support` : 'https://t.me/');
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

// ================= ১১. ইউজার ইনিশিয়ালাইজেশন =================
async function initUser() {
    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/init-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({
                userId,
                name: userName,
                username: userUsername,
                deviceId: currentDeviceId,
                referredBy: (initialReferrerId && initialReferrerId !== userId) ? initialReferrerId : null,
                initData: tg?.initData || ''
            })
        });

        const resData = await resp.json().catch(() => ({}));
        if (resData && resData.user) {
            if (resData.user.balance === welcomeBonusPoints && !localStorage.getItem('eh_welcome_claimed')) {
                localStorage.setItem('eh_welcome_claimed', 'true');
                if (isSplashFinished) openWelcomeModal();
                else isFirstTimeNewUser = true;
            }
        }
    } catch (e) { }

    db.ref('users/' + userId).on('value', (s) => {
        const data = s.val();
        if (!data) return;

        if (data.isBanned === true) {
            isUserBanned = true;
            const bannedModal = document.getElementById('banned-modal');
            const devEl = document.getElementById('banned-device-id');
            if (devEl) devEl.innerText = currentDeviceId;
            if (bannedModal) bannedModal.style.display = 'flex';
            syncModalState();
            return;
        }

        balancePoints = Math.round(Number(data.balance || 0));
        isChannelVerified = !!data.isChannelVerified;
        myReferrerId = data.referredBy || null;
        refRewardClaimed = !!data.refRewardClaimed;

        adsWatchedCount = Number(data.adsWatchedCount || 0);
        monetagWatchedCount = Number(data.monetagWatchedCount || 0);
        adsgramWatchedCount = Number(data.adsgramWatchedCount || 0);
        adsterraWatchedCount = Number(data.adsterraWatchedCount || 0);
        totalAllTimeAds = Number(data.totalAllTimeAds || 0);

        referralCount = Number(data.referralCount || 0);
        referralEarnings = Math.round(Number(data.referralEarnings || 0));
        lastCheckInDate = data.lastCheckInDate || "";
        checkInStreak = Number(data.checkInStreak || 0);

        updateUI();
        renderCheckInGrid();
        updateFullViewMetrics();
        checkAndUnlockReferralReward(data);
    });

    listenToUserReferrals();
    silentVerifyTelegramMembership();
}

// ================= ১২. মিনি আর্কেড ট্যাপ মেকানিক =================
function handleArcadeTap(e) {
    if (isUserBanned) return;
    const now = Date.now();
    if (now - arcadeLastTapTime < 100) return; // স্প্যাম প্রিভেনশন
    arcadeLastTapTime = now;

    playTapArcadeSound();
    triggerHaptic('light');

    arcadeComboCounter++;
    const node = document.getElementById('arcade-target');
    if (node) {
        node.style.transform = 'scale(0.92)';
        setTimeout(() => { node.style.transform = 'scale(1)'; }, 100);
    }

    createTapSpark(e);

    if (arcadeComboCounter % 20 === 0) {
        triggerHaptic('notification_success');
        showToast(currentLang === 'bn' ? `⚡ দারুণ রিফ্লেক্স! ${formatNum(arcadeComboCounter)} কম্বো চার্জড!` : `⚡ Reflex Combo! ${arcadeComboCounter} Charges!`);
    }
}

function createTapSpark(e) {
    const arena = document.getElementById('arcade-interactive-arena');
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const x = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
    const y = e.clientY ? (e.clientY - rect.top) : (rect.height / 2);

    const spark = document.createElement('div');
    spark.className = 'tap-spark';
    spark.innerText = '+1 BOOST';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    arena.appendChild(spark);

    setTimeout(() => spark.remove(), 700);
}

// ================= ১৩. রেফারেল ইঞ্জিন =================
let isUnlockingRefReward = false;
async function checkAndUnlockReferralReward(userData) {
    if (!userData || isUnlockingRefReward) return;
    const refId = userData.referredBy;
    if (!refId || userData.refRewardClaimed) return;

    const totalAds = Number(userData.totalAllTimeAds || 0);
    if (userData.isChannelVerified === true && totalAds >= requiredRefAds) {
        isUnlockingRefReward = true;
        try {
            await fetch(`${BACKEND_API_URL}/api/unlock-referral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-telegram-init-data': tg?.initData || ''
                },
                body: JSON.stringify({ 
                    userId,
                    referrerId: refId,
                    initData: tg?.initData || ''
                })
            });
        } catch (e) {
        } finally {
            isUnlockingRefReward = false;
        }
    }
}

function listenToUserReferrals() {
    const refContainer = document.getElementById('referrals-container');
    if (!refContainer) return;

    db.ref(`referrals/${userId}`).on('value', snapshot => {
        if (!snapshot.exists()) {
            refContainer.innerHTML = `<div style="text-align:center; padding:22px; font-size:14px; color:var(--text-muted);">${t('empty_referrals')}</div>`;
            return;
        }

        let html = '';
        snapshot.forEach(child => {
            const item = child.val();
            const initial = (item.name?.charAt(0) || 'P').toUpperCase();
            const dateStr = item.joinedAt ? new Date(item.joinedAt).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US') : '';
            const isQualified = item.status === 'qualified';

            const badgeText = isQualified 
                ? `+${formatNum(item.bonus || 50)} ${t('pts_currency')}`
                : (currentLang === 'bn' ? 'পেন্ডিং' : 'Pending');

            const badgeClass = isQualified ? 'cyber-chip chip-success' : 'cyber-chip chip-pending';

            html = `
                <div class="roster-item">
                    <div class="roster-left">
                        <div class="roster-avatar">${escapeHtml(initial)}</div>
                        <div class="roster-details">
                            <span class="roster-title">${escapeHtml(item.name || 'Pilot')}</span>
                            <span class="roster-sub">${escapeHtml(item.username || '')} • ${dateStr}</span>
                        </div>
                    </div>
                    <span class="${badgeClass}">${badgeText}</span>
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
    setElem('profile-stat-ref', `${formatNum(referralCount)} ${currentLang === 'bn' ? 'জন' : 'Pilots'}`);
    setElem('home-ref-count', formatNum(referralCount));
    setElem('home-ref-earnings', formatNum(referralEarnings));

    const statusTextEl = document.getElementById('profile-verify-status-text');
    const badgeEl = document.getElementById('profile-verify-badge');
    const headerStatus = document.getElementById('header-user-status');

    if (isChannelVerified) {
        if (statusTextEl) {
            statusTextEl.innerText = t('verify_status_verified');
            statusTextEl.className = 'dock-desc text-success';
        }
        if (badgeEl) {
            badgeEl.innerText = t('verify_badge_verified');
            badgeEl.className = 'cyber-chip chip-success';
        }
        if (headerStatus) {
            headerStatus.innerText = '● ' + (currentLang === 'bn' ? 'ভেরিফাইড মেম্বার' : 'Verified Operator');
            headerStatus.style.color = 'var(--neon-emerald)';
        }
    } else {
        if (statusTextEl) {
            statusTextEl.innerText = t('verify_status_unverified');
            statusTextEl.className = 'dock-desc text-danger';
        }
        if (badgeEl) {
            badgeEl.innerText = t('verify_badge_unverified');
            badgeEl.className = 'cyber-chip chip-danger';
        }
        if (headerStatus) {
            headerStatus.innerText = '● ' + (currentLang === 'bn' ? 'আনভেরিফাইড (ব্লকড)' : 'Unverified (Locked)');
            headerStatus.style.color = 'var(--neon-alert)';
        }
    }

    const rateTextEl = document.getElementById('display-point-rate-text');
    if (rateTextEl) {
        const bdtCalc = (100 * pointsToBdtRate).toFixed(2);
        rateTextEl.innerText = `${formatNum(100)} ${t('pts_currency')} = ${formatNum(bdtCalc)} BDT`;
    }

    const minWithdrawEl = document.getElementById('display-min-withdraw');
    if (minWithdrawEl) minWithdrawEl.innerText = formatNum(minWithdrawPoints);

    const ptsInput = document.getElementById('withdraw-points');
    if (ptsInput) {
        ptsInput.min = minWithdrawPoints;
        ptsInput.placeholder = currentLang === 'bn' ? `সর্বনিম্ন ${formatNum(minWithdrawPoints)} ক্রেডিট` : `Min ${minWithdrawPoints} Credits`;
    }

    const modeTag = document.getElementById('adsgram-mode-tag');
    if (modeTag) {
        modeTag.innerText = netConfigs.adsgram.mode === 'swap' 
            ? (currentLang === 'bn' ? 'কোয়ান্টাম সোয়াপ' : 'QUANTUM SWAP') 
            : (netConfigs.adsgram.mode.toUpperCase());
    }

    const pId = document.getElementById('profile-page-id');
    if (pId) pId.innerText = `ID: #${formatNum(userId)}`;
}

// ================= ১৪. কমস লিংক ও ভিডিও গাইড =================
function openTutorialVideo() {
    playClickSound();
    triggerHaptic('medium');
    if (tg && typeof tg.openLink === 'function') {
        tg.openLink(tutorialVideoUrl);
    } else {
        window.open(tutorialVideoUrl, '_blank', 'noopener,noreferrer');
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

async function silentVerifyTelegramMembership() {
    if (!BACKEND_API_URL) return isChannelVerified;
    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/check-channel-membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ userId, initData: tg?.initData || '' })
        });
        if (resp.ok) {
            const resData = await resp.json();
            if (resData && typeof resData.isMember === 'boolean') {
                isChannelVerified = resData.isMember;
                updateUI();
                return resData.isMember;
            }
        }
    } catch (e) { }
    return isChannelVerified;
}

async function checkTelegramVerification() {
    playClickSound();
    triggerHaptic('medium');

    const btn = document.getElementById('btn-check-tg-verify');
    if (btn) btn.disabled = true;
    showToast(t('toast_verifying_membership'));

    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/check-channel-membership`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ userId, initData: tg?.initData || '' })
        });

        const resData = await resp.json();
        if (resp.ok && resData && resData.isMember) {
            isChannelVerified = true;
            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_verify_success'));
            closeChannelVerifyModal();
            updateUI();
        } else {
            isChannelVerified = false;
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

// ================= ১৫. মিশন ফুলভিউ ইন্টারফেস =================
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
        if (btnText) btnText.innerText = currentLang === 'bn' ? "মিশন ক্যাপ পূর্ণ" : "Daily Cap Reached";
    } else if (!adsterraSession || !adsterraSession.active) {
        if (actionBtn) actionBtn.disabled = false;
        if (btnText) btnText.innerText = t('btn_watch_and_earn');
    }
}

async function openNetworkFullView(networkKey) {
    if (isUserBanned) return;
    playClickSound();
    triggerHaptic('light');

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
            badge: currentLang === 'bn' ? "ক্রোনো বুস্টার (ভিডিও)" : "CHRONO OVERDRIVE (VIDEO)",
            headline: currentLang === 'bn' ? "Chrono Overdrive মিশন" : "Chrono Overdrive Mission",
            desc: currentLang === 'bn' ? "স্পনসর স্ট্রীম সম্পূর্ণ সমাপ্ত করে ইনস্ট্যান্ট পাওয়ার এনার্জি ক্রেডিট আপনার ভল্টে রিচার্জ করুন।" : "Complete the sponsored stream to inject direct power credits into your vault balance.",
            iconClass: "icon-blue",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
            limit: netConfigs.monetag.limit
        },
        adsgram: {
            badge: currentLang === 'bn' ? "কোয়ান্টাম ক্যাশ (বিজ্ঞাপন)" : "QUANTUM CACHE (AD)",
            headline: currentLang === 'bn' ? "Quantum Cache মিশন" : "Quantum Cache Mission",
            desc: currentLang === 'bn' ? "হাই-ব্যান্ডউইথ ভিডিও ডাটা সম্পন্ন হওয়া মাত্রই স্বয়ংক্রিয়ভাবে ক্রেডিট ভল্টে যুক্ত হবে।" : "Stream the high-bandwidth video data cache to unlock immediate energy credits.",
            iconClass: "icon-mint",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="15" x="2" y="5" rx="2"/><polygon points="10 9 15 12.5 10 16"/></svg>`,
            limit: netConfigs.adsgram.limit
        },
        adsterra: {
            badge: currentLang === 'bn' ? "সাইবার নেক্সাস রিকন" : "CYBER NEXUS RECON",
            headline: currentLang === 'bn' ? "Nexus Recon এক্সপিডিশন" : "Nexus Recon Expedition",
            desc: currentLang === 'bn' 
                ? `স্পনসর পার্টনার পোর্টালে অন্তত ${formatNum(requiredSponsorTime)} সেকেন্ড একটিভ কানেকশনে থাকুন।` 
                : `Scout partner portal and maintain a verified link for at least ${requiredSponsorTime} seconds.`,
            iconClass: "icon-purple",
            iconSvg: `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
            limit: netConfigs.adsterra.limit
        }
    };

    const info = details[networkKey];
    const iconBox = document.getElementById('fv-icon-box');
    if (iconBox) {
        iconBox.innerHTML = info.iconSvg;
        iconBox.className = `mission-icon-beacon ${info.iconClass}`;
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
    if (adsterraTimerInterval) {
        clearInterval(adsterraTimerInterval);
        adsterraTimerInterval = null;
    }
    if (adsterraSession) {
        adsterraSession.active = false;
    }
    const screen = document.getElementById('network-fullview');
    if (screen) screen.classList.remove('active');
    removeModalFromStack('network-fullview');
}

// ================= ১৬. অ্যান্টি-চিট মিশন এক্সিকিউশন =================
async function executeCurrentNetworkAd() {
    if (isUserBanned) return;
    playClickSound();
    triggerHaptic('medium');

    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');

    actionBtn.disabled = true;
    showToast(t('toast_preparing_ad'));

    try {
        const ticketResp = await fetch(`${BACKEND_API_URL}/api/start-ad-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ userId, network: selectedNetwork, initData: tg?.initData || '' })
        });

        const ticketData = await ticketResp.json();
        if (!ticketResp.ok || !ticketData.success) {
            actionBtn.disabled = false;
            return showToast(ticketData.message || t('toast_limit_reached'), 'error');
        }

        const adTicket = ticketData.ticket;

        if (selectedNetwork === 'monetag') {
            const monetagFunc = getMonetagFunction();
            if (typeof monetagFunc !== 'function') {
                actionBtn.disabled = false;
                return showToast(t('toast_sdk_error'), 'error');
            }

            Promise.resolve(monetagFunc()).then(async (result) => {
                if (result && result.reward_event_type && result.reward_event_type !== 'valued') {
                    showToast(t('toast_ad_failed'), 'error');
                } else {
                    await submitRewardClaim(selectedNetwork, adTicket);
                }
                actionBtn.disabled = false;
            }).catch(() => {
                showToast(t('toast_ad_failed'), 'error');
                actionBtn.disabled = false;
            });
        }
        else if (selectedNetwork === 'adsgram') {
            if (typeof window.Adsgram === 'undefined') {
                actionBtn.disabled = false;
                return showToast(t('toast_sdk_error'), 'error');
            }

            let blockIdToUse = (netConfigs.adsgram.mode === 'swap')
                ? (adsgramNextFormat === 'rewarded' ? netConfigs.adsgram.rewardedBlockId : netConfigs.adsgram.interstitialBlockId)
                : netConfigs.adsgram.rewardedBlockId;

            if (netConfigs.adsgram.mode === 'swap') {
                adsgramNextFormat = adsgramNextFormat === 'rewarded' ? 'interstitial' : 'rewarded';
            }

            showToast(t('toast_starting_ad'));
            const adController = window.Adsgram.init({ blockId: blockIdToUse });
            const result = await adController.show().catch(err => ({ done: false, error: err }));

            // পলিসি সম্মত: ইউজার বিজ্ঞাপন পুরো দেখলেই রিওয়ার্ড ক্রেডিট হবে
            if (result && result.done) {
                await submitRewardClaim(selectedNetwork, adTicket);
            } else {
                showToast(t('toast_ad_failed'), 'error');
            }
            actionBtn.disabled = false;
        }
        else if (selectedNetwork === 'adsterra') {
            let directUrl = netConfigs.adsterra.url;
            if (!directUrl.startsWith('http://') && !directUrl.startsWith('https://')) directUrl = 'https://' + directUrl;

            adsterraSession = {
                active: true,
                ticket: adTicket,
                startedAt: Date.now()
            };

            let secondsLeft = requiredSponsorTime;
            if (adsterraTimerInterval) clearInterval(adsterraTimerInterval);
            adsterraTimerInterval = setInterval(() => {
                secondsLeft--;
                if (secondsLeft > 0) {
                    btnText.innerText = currentLang === 'bn' ? `⏳ ${formatNum(secondsLeft)} সেকেন্ড বাকি...` : `⏳ ${secondsLeft}s link stable...`;
                } else {
                    clearInterval(adsterraTimerInterval);
                    adsterraTimerInterval = null;
                    checkAdsterraCompletion();
                }
            }, 1000);

            showToast(currentLang === 'bn' ? `🚀 পোর্টালে সংযুক্ত হচ্ছে! পেজে থাকুন।` : `🚀 Portal linked! Maintain connection.`);
            try {
                if (tg && typeof tg.openLink === 'function') tg.openLink(directUrl);
                else window.open(directUrl, '_blank', 'noopener,noreferrer');
            } catch (e) {
                window.open(directUrl, '_blank');
            }
        }
    } catch (err) {
        showToast(t('toast_ad_failed'), 'error');
        actionBtn.disabled = false;
    }
}

function checkAdsterraCompletion() {
    if (!adsterraSession || !adsterraSession.active) return;
    const actionBtn = document.getElementById('fv-action-btn');
    const btnText = document.getElementById('fv-btn-text');
    const secondsSpent = Math.floor((Date.now() - adsterraSession.startedAt) / 1000);

    if (secondsSpent < requiredSponsorTime) {
        if (adsterraTimerInterval) {
            clearInterval(adsterraTimerInterval);
            adsterraTimerInterval = null;
        }
        adsterraSession.active = false;
        if (actionBtn) actionBtn.disabled = false;
        if (btnText) btnText.innerText = t('btn_watch_and_earn');
        triggerHaptic('notification_error');
        showToast(currentLang === 'bn' 
            ? `⚠️ পুরো ${formatNum(requiredSponsorTime)} সেকেন্ড লিংকে থাকতে হবে!` 
            : `⚠️ Maintain link for full ${requiredSponsorTime} seconds!`, 'error');
    } else {
        const ticket = adsterraSession.ticket;
        adsterraSession.active = false;
        if (adsterraTimerInterval) {
            clearInterval(adsterraTimerInterval);
            adsterraTimerInterval = null;
        }
        if (btnText) btnText.innerText = t('btn_watch_and_earn');
        if (actionBtn) actionBtn.disabled = false;
        submitRewardClaim('adsterra', ticket);
    }
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && adsterraSession && adsterraSession.active) {
        const secondsSpent = Math.floor((Date.now() - adsterraSession.startedAt) / 1000);
        const actionBtn = document.getElementById('fv-action-btn');
        const btnText = document.getElementById('fv-btn-text');

        if (secondsSpent < requiredSponsorTime) {
            if (adsterraTimerInterval) {
                clearInterval(adsterraTimerInterval);
                adsterraTimerInterval = null;
            }
            adsterraSession.active = false;
            if (actionBtn) actionBtn.disabled = false;
            if (btnText) btnText.innerText = t('btn_watch_and_earn');

            triggerHaptic('notification_error');
            showToast(currentLang === 'bn' 
                ? `⚠️ সময়ের পূর্বেই ডিসকানেক্ট হয়েছেন! পূর্ণ ${formatNum(requiredSponsorTime)} সেকেন্ড কানেকশন রাখুন।` 
                : `⚠️ Disconnected too early! Maintain connection for full ${requiredSponsorTime}s.`, 'error');
        } else {
            if (adsterraTimerInterval) {
                clearInterval(adsterraTimerInterval);
                adsterraTimerInterval = null;
            }
            checkAdsterraCompletion();
        }
    }
});

async function submitRewardClaim(networkKey, ticket) {
    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/claim-ad-reward`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ 
                network: networkKey, 
                ticket,
                userId,
                initData: tg?.initData || ''
            })
        });

        const resData = await resp.json().catch(() => ({}));
        if (resp.ok && resData && resData.success) {
            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_pts_credited', { pts: resData.reward }));
            updateFullViewMetrics();
        } else {
            triggerHaptic('notification_error');
            showToast(resData.message || t('toast_ad_failed'), 'error');
        }
    } catch (e) {
        triggerHaptic('notification_error');
        showToast("⚠️ ক্রেডিট আপডেট করা যায়নি!", 'error');
    }
}

// ================= ১৭. ভল্ট প্রাইজ রিডিমশন =================
function switchWithdrawMethod(method) {
    playClickSound();
    triggerHaptic('light');
    selectedWithdrawMethod = method;

    document.querySelectorAll('.c-tab-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-method-${method}`);
    if (activeBtn) activeBtn.classList.add('active');

    const grpOperator = document.getElementById('group-operator');
    const labelAcc = document.getElementById('label-acc-type');
    const phoneInput = document.getElementById('withdraw-phone');

    if (method === 'recharge') {
        if (grpOperator) grpOperator.style.display = 'block';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'সংযোগ প্রটোকল:' : 'Connection Protocol:';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX';
        minWithdrawPoints = adminMinRecharge;
    } else if (method === 'bkash') {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'অ্যাকাউন্টের ধরন:' : 'Account Protocol:';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX (bKash)';
        minWithdrawPoints = adminMinBkash;
    } else {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = currentLang === 'bn' ? 'অ্যাকাউন্টের ধরন:' : 'Account Protocol:';
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
    if (isUserBanned) return;
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
    const operator = selectedWithdrawMethod === 'recharge' ? document.getElementById('withdraw-operator').value : '';

    if (pointsToDeduct < minWithdrawPoints) return showToast(t('toast_min_limit', { pts: minWithdrawPoints }), 'error');
    if (!/^01[3-9]\d{8}$/.test(phone)) return showToast(t('toast_valid_phone'), 'error');

    if (selectedWithdrawMethod === 'recharge' && operator) {
        const regex = operatorPrefixes[operator];
        if (regex && !regex.test(phone)) return showToast(t('toast_operator_mismatch'), 'error');
    }

    if (pointsToDeduct > balancePoints) return showToast(t('toast_insufficient_bal'), 'error');

    const calculatedBdt = (pointsToDeduct * pointsToBdtRate).toFixed(2);
    let methodName = selectedWithdrawMethod === 'bkash' ? 'bKash' : (selectedWithdrawMethod === 'nagad' ? 'Nagad' : 'Airtime Recharge');

    if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.innerText = t('btn_submitting');
    }

    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/submit-withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({
                userId,
                userName,
                userUsername,
                deviceId: currentDeviceId,
                method: methodName,
                operator,
                accountType,
                phone,
                pointsToDeduct,
                amountBdt: calculatedBdt,
                initData: tg?.initData || ''
            })
        });

        const resData = await resp.json().catch(() => ({}));
        if (resp.ok && resData && resData.success) {
            form.reset();
            calculateWithdrawBdt();
            openCashoutSuccessModal({
                method: methodName + (operator ? ` (${operator})` : ''),
                account: `${phone} (${accountType})`,
                points: pointsToDeduct,
                bdt: calculatedBdt
            });
        } else {
            throw new Error(resData.message || t('toast_cashout_error'));
        }
    } catch (err) {
        triggerHaptic('notification_error');
        showToast(err.message || t('toast_cashout_error'), 'error');
    } finally {
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
}

// ================= ১৮. ট্রানজ্যাকশন ও ড্রয়ার হিস্ট্রি =================
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
            listContainer.innerHTML = `<div style="text-align:center; padding:28px; font-size:14px; color:var(--text-muted);">${t('empty_history')}</div>`;
            return;
        }

        let itemsHTML = '';
        snapshot.forEach(child => {
            const item = child.val();
            const statusLower = (item.status || 'Pending').toLowerCase();
            const badgeClass = statusLower === 'approved' ? 'chip-success' : (statusLower === 'rejected' ? 'chip-danger' : 'chip-pending');
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString(currentLang === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '';
            let displayStatus = item.status;
            if (currentLang === 'bn') {
                if (statusLower === 'pending') displayStatus = 'ইন-রিভিউ';
                else if (statusLower === 'approved') displayStatus = 'অনুমোদিত';
                else if (statusLower === 'rejected') displayStatus = 'বাতিল';
            }

            itemsHTML = `
                <div class="cyber-history-item">
                    <div>
                        <div class="h-title">${escapeHtml(item.method)} (${escapeHtml(item.phone)})</div>
                        <div class="h-date">${dateStr}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="h-pts">- ${formatNum(item.pointsDeducted)} ${t('pts_currency')}</div>
                        <span class="cyber-chip ${badgeClass}">${escapeHtml(displayStatus)}</span>
                    </div>
                </div>
            ` + itemsHTML;
        });
        listContainer.innerHTML = itemsHTML;
    });
}

// ================= ১৯. ৭-দিনের প্রটোকল উপহার =================
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

async function claimDailyCheckIn() {
    if (isUserBanned) return;
    playClickSound();
    triggerHaptic('medium');
    const claimBtn = document.getElementById('btn-claim-checkin');

    if (claimBtn) claimBtn.disabled = true;

    try {
        const resp = await fetch(`${BACKEND_API_URL}/api/claim-checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-telegram-init-data': tg?.initData || ''
            },
            body: JSON.stringify({ userId, initData: tg?.initData || '' })
        });

        const resData = await resp.json().catch(() => ({}));
        if (resp.ok && resData && resData.success) {
            playRewardSound();
            triggerConfetti();
            triggerHaptic('notification_success');
            showToast(t('toast_claim_success', { day: resData.streak, pts: resData.reward }));
            checkInStreak = resData.streak;
            renderCheckInGrid();
        } else {
            showToast(resData.message || t('toast_already_claimed'), 'error');
            if (claimBtn) claimBtn.disabled = false;
        }
    } catch (err) {
        showToast(t('toast_cashout_error'), 'error');
        if (claimBtn) claimBtn.disabled = false;
    }
}

// ================= ২০. সোশ্যাল রিক্রুটমেন্ট ও শেয়ারিং =================
function copyReferralLink() {
    playClickSound();
    triggerHaptic('light');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(myReferralLink).then(() => {
            showToast(t('toast_link_copied'));
        }).catch(() => fallbackCopy(myReferralLink));
    } else {
        fallbackCopy(myReferralLink);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(t('toast_link_copied'));
    } catch (e) {
        showToast("Error copying link", "error");
    }
    document.body.removeChild(textArea);
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
        ? `🎮 Aetheria Arcade নেটওয়ার্কে জয়েন করে পাওয়ার এনার্জি রিফিল করুন এবং ক্রিপ্টো প্রাইজ আনলক করুন!\n\n👇 জয়েন লিংক:\n${myReferralLink}`
        : `🎮 Join the Aetheria Cyber Arcade squad! Play reflex missions & win verified prize rewards!\n\n👇 Squad Link:\n${myReferralLink}`;
    
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`;
    if (tg && typeof tg.openTelegramLink === 'function') tg.openTelegramLink(tgShareUrl);
    else window.open(tgShareUrl, '_blank', 'noopener,noreferrer');
}

// ================= ২১. ট্যাব নেভিগেশন ও ইনিশিয়াল বুটস্ট্র্যাপ =================
function switchTab(viewId) {
    if (isUserBanned) return;
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
    switchWithdrawMethod('recharge');

    // সাইবার বুট লোডার প্রসেসিং
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
                    setTimeout(() => {
                        splash.remove();
                        isSplashFinished = true;
                        if (isFirstTimeNewUser) openWelcomeModal();
                    }, 250);
                }
            }, 120);
        }
    }, 35);
});
