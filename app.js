/*** 
 * AETHERIA ARCADE - REALTIME CYBER ENGINE (v9.0.0 PRODUCTION)
 * =============================================================
 * 1. Strict Ticket Economy:
 *    - Tasks, Ads, Daily Check-in & Referrals ONLY grant Game Tickets (🎟️)
 *    - Playing the Quantum Reflex Game (1 Ticket/entry) is the ONLY way to earn Energy Cells (💰)
 * 2. Complete i18n Bilingual System (Bangla & English)
 * 3. Professional 3D Podium Stall Leaderboard (1st, 2nd, 3rd + Runners-up)
 * 4. 60s Live Ad Cooldown Pipeline & TON Connect UI
 */

// ================= ১. গ্লোবাল কনফিগারেশন =================
const DEFAULT_BOT_USERNAME = "AetheriaArcadeBot"; 
let ADSGRAM_BLOCK_ID = "26019"; // আপনার Adsgram ব্লক আইডি
let telegramCommunityUrl = "https://t.me/AetheriaArcadeChannel";
const AD_COOLDOWN_TIME_MS = 60 * 1000; // ৬০ সেকেন্ড কুলডাউন

// ================= ২. বহুভাষিক অনুবাদ অভিধান (i18n Dictionary) =================
let currentLang = localStorage.getItem('arcade_lang') || 'bn';

const I18N_STRINGS = {
    bn: {
        status_online: "● অনলাইন অপারেটর",
        lbl_ticket_stash: "বর্তমান এন্ট্রি টিকেট",
        unit_tickets: "টিকেট",
        msg_economy_hint: "টাস্ক ও রেফার থেকে টিকেট সংগ্রহ করুন ➔ গেম খেলে রূপান্তরযোগ্য CELLS আয় করুন!",
        btn_daily_streak: "⚡ ডেইলি বোনাস টিকেট",
        btn_play_arena: "🎮 এরেনায় যান (১ টিকেট)",
        title_ad_missions: "📺 স্পনসর ভিডিও ও অ্যাড মিশন",
        sub_ad_missions: "ভিডিও দেখে ফ্রি এন্ট্রি টিকেট রিফিল করুন (১ মিনিট কুলডাউন)",
        title_social_missions: "📢 অফিসিয়াল সোশ্যাল মিশন",
        sub_social_missions: "কমিউনিটি চ্যানেলে যুক্ত হয়ে পান এক্সট্রা বোনাস টিকেট",
        title_partner_missions: "🌐 স্পেশাল ও পার্টনার মিশন",
        card_community_head: "অফিসিয়াল কমিউনিটি ও স্বচ্ছতা",
        card_community_sub: "দৈনিক আপডেট, টিকিট গিভঅ্যাওয়ে ও ডিস্ট্রিবিউশন প্রুফ",
        btn_join: "জয়েন",
        btn_claim: "ক্লেইম",
        btn_watch: "দেখুন",
        btn_done: "✔ সম্পন্ন",
        lbl_available_tickets: "উপলব্ধ এন্ট্রি টিকেট",
        btn_get_more_tickets: "+ টিকেট সংগ্রহ করুন",
        lbl_score: "স্কোর:",
        rule_cyan: "🎯 Cyan = +10 PTS",
        rule_gold: "⭐ Gold = +30 PTS",
        rule_red: "⚠️ Red Hazard = শিল্ড লস!",
        lbl_game_cost: "🎮 এন্ট্রি খরচ: ১টি টিকেট (1 Ticket)",
        lbl_reward_rate: "💰 রিওয়ার্ড ফর্মুলা: প্রতি ৪ স্কোরে = ১ Energy Cell",
        btn_start_match: "ম্যাচ শুরু করুন",
        msg_game_tip: "টার্গেটে নিখুঁত ট্যাপ করে পয়েন্ট আয় করুন এবং গেম শেষে ব্যালেন্সে ক্রিপ্টো রিওয়ার্ড বুঝে নিন।",
        lbl_shield_life: "🛡️ কোর শিল্ড স্থিতিশীলতা",
        title_crypto_vault: "ট্যাকটিক্যাল ক্রিপ্টো ওয়ালেট",
        sub_crypto_vault: "গেমপ্লে থেকে অর্জিত Energy Cells জমা করুন এবং সরাসরি আপনার TON ওয়ালেটে ট্রান্সফার করুন।",
        lbl_connected_wallet: "কানেক্টেড ওয়ালেট:",
        head_manual_ton: "ম্যানুয়াল TON Address সেটআপ",
        sub_manual_ton: "যদি TON Connect এ কোনো ত্রুটি হয়, তবে Tonkeeper বা Telegram Wallet অ্যাড্রেস পেস্ট করে সেভ করুন।",
        btn_save: "সেভ",
        title_cashout_box: "রিওয়ার্ড ক্যাশআউট ডেক",
        lbl_earned_cells: "মোট অর্জিত Cells",
        lbl_estimated_ton: "আনুমানিক মূল্য",
        head_withdraw_rule: "📌 উইথড্র নীতিমালা:",
        body_withdraw_rule: "নূন্যতম উইথড্রল রিকোয়ারমেন্ট ১,০০০ CELLS। সাবমিট করার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে অ্যাড্রেসে ভেরিফিকেশন সহ ডিস্ট্রিবিউট হয়।",
        btn_submit_withdraw: "উইথড্রল রিকোয়েস্ট সাবমিট করুন",
        title_stall_leaderboard: "শীর্ষ অপারেটর লিডারবোর্ড",
        sub_stall_leaderboard: "কোয়ান্টাম এরেনায় সর্বোচ্চ ব্যক্তিগত স্কোর অর্জনকারীদের তালিকা।",
        banner_ref_ticket: "🎁 প্রতি ফ্রেন্ড ইনভাইটে ৩টি টিকেট (+৩ 🎟️) এন্ট্রি বোনাস!",
        msg_ref_explainer: "বন্ধুদের মিনি-অ্যাপে আমন্ত্রণ জানান। প্রতি রেফারে ফ্রি গেম টিকেট পাবেন যা দিয়ে গেম খেলে আনলিমিটেড CELLS আয় করা যাবে।",
        btn_copy: "কপি",
        btn_invite_friends: "বন্ধুদের ইনভাইট করুন (+৩ টিকেট)",
        lbl_total_invites: "আমন্ত্রিত ফ্রেন্ডস",
        lbl_best_score: "ব্যক্তিগত সেরা স্কোর",
        title_challengers: "রানার্স-আপ পাইলট তালিকা",
        msg_syncing: "ডাটা সিঙ্ক হচ্ছে...",
        lbl_crypto_balance: "মোট অর্জিত সেল",
        lbl_total_tickets: "এন্ট্রি টিকেট",
        menu_streak_protocol: "৭-দিনের বোনাস টিকেট ড্রপ",
        menu_official_tg: "অফিসিয়াল টেলিগ্রাম চ্যানেল",
        tag_system_breached: "SYSTEM BREACHED",
        modal_match_finished: "মিশন সমাপ্ত!",
        lbl_match_score: "ম্যাচ স্কোর:",
        lbl_earned_rewards: "অর্জিত রিওয়ার্ড (Cells):",
        lbl_personal_record: "সেরা রেকর্ড:",
        btn_revive_shield: "বিজ্ঞাপন দেখে শিল্ড রিভাইভ করুন (+১)",
        btn_claim_and_exit: "রিওয়ার্ড ব্যালেন্সে যোগ করুন ও বের হন",
        title_streak_drawer: "৭-দিনের বোনাস টিকেট ড্রপ",
        btn_claim_today: "আজকের ফ্রি টিকেট নিন",
        btn_claimed_today: "✅ আজকের টিকেট নেওয়া হয়েছে",
        nav_tasks: "টাস্ক",
        nav_game: "গেম",
        nav_wallet: "ওয়ালেট",
        nav_rankings: "র‍্যাঙ্কিং",
        nav_pilot: "পাইলট",
        toast_no_tickets: "পর্যাপ্ত টিকেট নেই! টাস্ক পেজ থেকে টিকেট সংগ্রহ করুন।",
        toast_copied: "রেফারেল লিংক কপি হয়েছে!",
        toast_wallet_connected: "TON Wallet সফলভাবে কানেক্ট হয়েছে!",
        toast_withdraw_min: "নূন্যতম ১,০০০ CELLS প্রয়োজন উইথড্র করার জন্য!",
        toast_withdraw_success: "উইথড্রল রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে!"
    },
    en: {
        status_online: "● Online Operator",
        lbl_ticket_stash: "Current Entry Tickets",
        unit_tickets: "Tickets",
        msg_economy_hint: "Earn Tickets from Tasks & Invites ➔ Play Games to win convertible CELLS!",
        btn_daily_streak: "⚡ Daily Streak Tickets",
        btn_play_arena: "🎮 Enter Arena (1 Ticket)",
        title_ad_missions: "📺 Sponsored Video Missions",
        sub_ad_missions: "Watch videos to refill free entry tickets (1-min cooldown)",
        title_social_missions: "📢 Official Social Missions",
        sub_social_missions: "Join community channels to claim bonus tickets",
        title_partner_missions: "🌐 Partner & Special Missions",
        card_community_head: "Official Community & Proofs",
        card_community_sub: "Daily news, ticket drops & distribution logs",
        btn_join: "Join",
        btn_claim: "Claim",
        btn_watch: "Watch",
        btn_done: "✔ Done",
        lbl_available_tickets: "Available Entry Tickets",
        btn_get_more_tickets: "+ Get More Tickets",
        lbl_score: "Score:",
        rule_cyan: "🎯 Cyan = +10 PTS",
        rule_gold: "⭐ Gold = +30 PTS",
        rule_red: "⚠️ Red Hazard = Shield Drop!",
        lbl_game_cost: "🎮 Entry Cost: 1 Ticket",
        lbl_reward_rate: "💰 Reward Formula: 4 Score = 1 Energy Cell",
        btn_start_match: "Start Match",
        msg_game_tip: "Tap nodes swiftly to rack up score and convert it into crypto Cells balance.",
        lbl_shield_life: "🛡️ Core Shield Life",
        title_crypto_vault: "Tactical Crypto Vault",
        sub_crypto_vault: "Store Energy Cells won in gameplay and withdraw directly to your TON Wallet.",
        lbl_connected_wallet: "Connected Wallet:",
        head_manual_ton: "Manual TON Address Setup",
        sub_manual_ton: "If TON Connect fails, paste and save your Tonkeeper or Telegram Wallet address.",
        btn_save: "Save",
        title_cashout_box: "Cashout & Conversion Deck",
        lbl_earned_cells: "Total Earned Cells",
        lbl_estimated_ton: "Estimated Value",
        head_withdraw_rule: "📌 Withdrawal Policy:",
        body_withdraw_rule: "Minimum withdrawal requirement is 1,000 CELLS. Distributed within 24-48 hours after on-chain validation.",
        btn_submit_withdraw: "Submit Cashout Request",
        title_stall_leaderboard: "Top Operator Leaderboard",
        sub_stall_leaderboard: "Global roster of pilots with highest combat scores in Quantum Arena.",
        banner_ref_ticket: "🎁 Earn 3 Free Tickets (+3 🎟️) per friend invited!",
        msg_ref_explainer: "Invite friends to the mini-app. Get free tickets per invite and use them to win real Cells.",
        btn_copy: "Copy",
        btn_invite_friends: "Invite Friends (+3 Tickets)",
        lbl_total_invites: "Invited Friends",
        lbl_best_score: "Personal High Score",
        title_challengers: "Runner-Up Operators",
        msg_syncing: "Syncing data...",
        lbl_crypto_balance: "Total Cells Earned",
        lbl_total_tickets: "Entry Tickets",
        menu_streak_protocol: "7-Day Protocol Ticket Drops",
        menu_official_tg: "Official Telegram Channel",
        tag_system_breached: "SYSTEM BREACHED",
        modal_match_finished: "Mission Debriefing",
        lbl_match_score: "Match Score:",
        lbl_earned_rewards: "Earned Rewards (Cells):",
        lbl_personal_record: "High Record:",
        btn_revive_shield: "Watch Ad to Revive Shield (+1)",
        btn_claim_and_exit: "Claim Cells & Debrief",
        title_streak_drawer: "7-Day Bonus Ticket Protocol",
        btn_claim_today: "Claim Today's Free Ticket",
        btn_claimed_today: "✅ Claimed for Today",
        nav_tasks: "Tasks",
        nav_game: "Game",
        nav_wallet: "Wallet",
        nav_rankings: "Rankings",
        nav_pilot: "Pilot",
        toast_no_tickets: "Not enough tickets! Earn tickets from the Tasks hub.",
        toast_copied: "Referral link copied!",
        toast_wallet_connected: "TON Wallet connected successfully!",
        toast_withdraw_min: "Minimum 1,000 CELLS required to cash out!",
        toast_withdraw_success: "Withdrawal request dispatched successfully!"
    }
};

function t(key) {
    return I18N_STRINGS[currentLang][key] || I18N_STRINGS['bn'][key] || key;
}

function applyLanguage() {
    document.documentElement.setAttribute('data-lang', currentLang);
    const langBtn = document.getElementById('lang-indicator');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && I18N_STRINGS[currentLang][key]) {
            el.innerText = I18N_STRINGS[currentLang][key];
        }
    });

    renderAllTasks();
    renderCheckInGrid();
}

function toggleLanguage() {
    playClickSound();
    currentLang = currentLang === 'bn' ? 'en' : 'bn';
    localStorage.setItem('arcade_lang', currentLang);
    applyLanguage();
    showToast(currentLang === 'bn' ? 'ভাষা: বাংলা সক্রিয়' : 'Language: English Active');
}

// ================= ৩. অডিও সিন্থেসাইজার (Web Audio SFX) =================
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
    showToast(isAudioEnabled ? (currentLang === 'bn' ? 'অডিও এফেক্ট চালু' : 'SFX Enabled') : (currentLang === 'bn' ? 'অডিও এফেক্ট বন্ধ' : 'SFX Muted'));
}

function updateAudioIcon() {
    const icon = document.getElementById('audio-icon');
    if (!icon) return;
    icon.innerHTML = isAudioEnabled 
        ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`
        : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
}

function playClickSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
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
        osc.frequency.setValueAtTime(isGold ? 880 : 520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(isGold ? 1600 : 960, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) { }
}

function playRewardSound() {
    if (!isAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(1040, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) { }
}

// ================= ৪. টেলিগ্রাম SDK ও থিম হ্যান্ডলিং =================
const tg = window.Telegram?.WebApp;
let currentTheme = localStorage.getItem('arcade_theme') || 'dark';

if (tg) {
    try {
        tg.ready();
        tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') tg.enableClosingConfirmation();
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
            colors: ['#00FF9D', '#00F0FF', '#BD00FF', '#FFB800']
        });
    }
}

function toggleTheme() {
    playClickSound();
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('arcade_theme', currentTheme);
    applyTheme();
}

function applyTheme() {
    const iconEl = document.getElementById('theme-icon');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (iconEl) iconEl.innerText = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        if (iconEl) iconEl.innerText = '🌙';
    }
}

// ================= ৫. ফায়ারবেস ডেটাবেস ইনিশিয়ালাইজেশন =================
const firebaseConfig = {
  apiKey: "AIzaSyDj-9ox7l6tRO9hYr9chF7MxWwkCTRchEA",
  authDomain: "enjoy-movies-app.firebaseapp.com",
  databaseURL: "https://enjoy-movies-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "enjoy-movies-app",
  storageBucket: "enjoy-movies-app.firebasestorage.app",
  messagingSenderId: "839389874270",
  appId: "1:839389874270:web:b99129ebae43d0cdd48ccf"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================= ৬. ইউজার স্টেট ও রেফারেল সিস্টেম =================
let tgUser = tg?.initDataUnsafe?.user;
if (!tgUser || !tgUser.id) {
    let mockId = localStorage.getItem('arcade_pilot_id');
    if (!mockId) {
        mockId = 'pilot_' + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('arcade_pilot_id', mockId);
    }
    tgUser = { id: mockId, first_name: "Operator", last_name: "X", username: "pilot_" + mockId.slice(-4) };
}

const userId = tgUser.id.toString();
const userName = (tgUser.first_name || 'Pilot') + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@pilot_' + userId.slice(-4);

let balanceCredits = 0;       // Energy Cells (গেমপ্লে থেকে অর্জিত আসল ক্রিপ্টো ভ্যালু)
let userTickets = 3;          // প্রাথমিক ৩টি এন্ট্রি টিকেট
let personalHighScore = 0;    // লিডারবোর্ডের জন্য ব্যক্তিগত স্কোর
let totalMatchesPlayed = 0;
let referralCount = 0;
let lastCheckInDate = "";
let checkInStreak = 0;
let tonWalletAddress = localStorage.getItem('arcade_ton_address') || "";
const checkInTicketRewards = [1, 1, 2, 2, 3, 3, 5]; // ডেইলি টিকেটের প্রোটোকল ড্রপ

let myReferralLink = `https://t.me/${DEFAULT_BOT_USERNAME}?start=ref_${userId}`;

function getReferralParam() {
    let refParam = tg?.initDataUnsafe?.start_param || "";
    if (!refParam) {
        const urlParams = new URLSearchParams(window.location.search);
        refParam = urlParams.get('start') || urlParams.get('ref') || "";
    }
    return refParam;
}

// ইনভাইটকারীকে শুধুমাত্র ৩টি গেম টিকেট রিওয়ার্ড প্রদান
function rewardReferrer(refId) {
    if (!refId || refId === userId) return;
    db.ref('users/' + refId).transaction((user) => {
        if (user) {
            user.tickets = (user.tickets || 0) + 3; // শুধুই ৩টি টিকেট
            user.referralCount = (user.referralCount || 0) + 1;
        }
        return user;
    });
}

function initUser() {
    const startParam = getReferralParam();

    db.ref('users/' + userId).on('value', (s) => {
        const data = s.val();
        if (!data) {
            let referredBy = null;
            if (startParam && startParam.startsWith('ref_')) {
                referredBy = startParam.replace('ref_', '').trim();
            }

            db.ref('users/' + userId).set({
                id: userId,
                name: userName,
                username: userUsername,
                balance: 0,
                tickets: 3,
                highScore: 0,
                matchesPlayed: 0,
                tonWallet: "",
                referredBy: referredBy || null,
                createdAt: Date.now()
            });

            if (referredBy) {
                rewardReferrer(referredBy);
            }
            return;
        }

        balanceCredits = Math.round(Number(data.balance || 0));
        userTickets = Number(data.tickets !== undefined ? data.tickets : 3);
        personalHighScore = Math.round(Number(data.highScore || 0));
        totalMatchesPlayed = Number(data.matchesPlayed || 0);
        referralCount = Number(data.referralCount || 0);
        lastCheckInDate = data.lastCheckInDate || "";
        checkInStreak = Number(data.checkInStreak || 0);
        if (data.tonWallet) tonWalletAddress = data.tonWallet;
        if (data.completedTasks) {
            userCompletedTasks = data.completedTasks;
            localStorage.setItem('arcade_completed_tasks', JSON.stringify(userCompletedTasks));
        }

        updateUI();
        renderAllTasks();
        renderCheckInGrid();
    });

    listenToPodiumLeaderboard();
}

function updateUI() {
    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setTxt('user-balance-home', balanceCredits);
    setTxt('user-tickets-display', userTickets);
    setTxt('game-tickets-count', userTickets);
    setTxt('wallet-user-cells', balanceCredits);
    setTxt('wallet-ton-estimate', `${(balanceCredits / 1000 * 0.1).toFixed(2)} TON`);
    setTxt('profile-stat-balance', `${balanceCredits} CELLS`);
    setTxt('profile-stat-tickets', `${userTickets} 🎟️`);
    setTxt('home-ref-count', referralCount);
    setTxt('profile-best-score-badge', personalHighScore);
    setTxt('profile-page-id', `ID: #${userId}`);
    setTxt('referral-link-display', myReferralLink);

    const addrCont = document.getElementById('wallet-address-container');
    const addrVal = document.getElementById('connected-wallet-addr');
    const manualInput = document.getElementById('manual-ton-address-input');
    if (tonWalletAddress) {
        if (addrCont) addrCont.style.display = 'flex';
        if (addrVal) addrVal.innerText = `${tonWalletAddress.slice(0, 6)}...${tonWalletAddress.slice(-4)}`;
        if (manualInput) manualInput.value = tonWalletAddress;
    }
}

// ================= ৭. টাস্ক ও অ্যাড ইঞ্জিন (শুধু টিকেট রিওয়ার্ড) =================
const TASKS_CONFIG = [
    // অ্যাড মিশন (শুধুমাত্র টিকেট রিওয়ার্ড, কোনো Cells নয়)
    {
        id: "task_adsgram",
        type: "ad_adsgram",
        title_bn: "Adsgram স্পনসর ভিডিও",
        title_en: "Adsgram Sponsor Video",
        desc_bn: "ভিডিও অ্যাডটি সম্পূর্ণ দেখে গেম খেলার ফ্রি টিকেট রিফিল করুন।",
        desc_en: "Watch the full video ad to refill free arena entry tickets.",
        rewardTickets: 1,
        badge: "AD",
        iconType: "cyan-glow"
    },
    {
        id: "task_monetag",
        type: "ad_monetag",
        title_bn: "Monetag ওয়াচ অ্যাড",
        title_en: "Monetag Watch Ad",
        desc_bn: "মোনিট্যাগ বিজ্ঞাপন দেখে ফ্রি ম্যাচ এন্ট্রি টিকেট সংগ্রহ করুন।",
        desc_en: "Watch Monetag sponsor ad to collect a free match ticket.",
        rewardTickets: 1,
        badge: "MONETAG",
        iconType: "purple-glow"
    },
    {
        id: "task_adsterra",
        type: "ad_adsterra",
        title_bn: "Adsterra স্পনসর ভিজিট",
        title_en: "Adsterra Sponsor Visit",
        desc_bn: "স্পনসর পেজটি ১৫ সেকেন্ড ঘুরে দেখে টিকেট বুঝে নিন।",
        desc_en: "Explore sponsor page for 15s to claim free game tickets.",
        rewardTickets: 2,
        badge: "VISIT",
        iconType: "gold-glow",
        visitUrl: "https://www.highrevenuegate.com/your-adsterra-direct-link"
    },

    // টেলিগ্রাম সোশ্যাল মিশন (শুধুমাত্র টিকেট রিওয়ার্ড)
    {
        id: "task_tg_channel",
        type: "telegram",
        title_bn: "অফিসিয়াল টেলিগ্রাম চ্যানেল",
        title_en: "Official Telegram Channel",
        desc_bn: "আমাদের চ্যানেলে যুক্ত হয়ে ২টি বোনাস গেম টিকেট নিন।",
        desc_en: "Join our main channel to claim +2 bonus game tickets.",
        rewardTickets: 2,
        badge: "CHANNEL",
        iconType: "telegram-glow",
        link: "https://t.me/AetheriaArcadeChannel"
    },
    {
        id: "task_tg_group",
        type: "telegram",
        title_bn: "কমিউনিটি ডিসকাশন গ্রুপ",
        title_en: "Community Discussion Group",
        desc_bn: "প্লেয়ারদের চ্যাট গ্রুপে যুক্ত হয়ে ১টি টিকেট আনলক করুন।",
        desc_en: "Join the player chatter lounge to unlock 1 ticket.",
        rewardTickets: 1,
        badge: "GROUP",
        iconType: "telegram-glow",
        link: "https://t.me/AetheriaArcadeGroup"
    },
    {
        id: "task_tg_partner",
        type: "telegram",
        title_bn: "পার্টনার স্পনসর চ্যানেল",
        title_en: "Partner Sponsor Channel",
        desc_bn: "পার্টনার চ্যানেলে সাবস্ক্রাইব করে ৩টি টিকেট রিওয়ার্ড নিন।",
        desc_en: "Subscribe to sponsor channel to get 3 entry tickets.",
        rewardTickets: 3,
        badge: "SPONSOR",
        iconType: "telegram-glow",
        link: "https://t.me/Telegram"
    }
];

let userCompletedTasks = JSON.parse(localStorage.getItem('arcade_completed_tasks') || '{}');
let adCooldownTimestamps = JSON.parse(localStorage.getItem('arcade_ad_cooldowns') || '{}');
let tgPendingVerify = {};

function renderAllTasks() {
    const adContainer = document.getElementById('ad-tasks-container');
    const tgContainer = document.getElementById('telegram-tasks-container');
    const customContainer = document.getElementById('custom-tasks-container');
    const customWrapper = document.getElementById('custom-tasks-wrapper');

    if (adContainer) adContainer.innerHTML = '';
    if (tgContainer) tgContainer.innerHTML = '';
    if (customContainer) customContainer.innerHTML = '';

    const now = Date.now();
    let hasCustom = false;

    TASKS_CONFIG.forEach(task => {
        const isCompleted = !!userCompletedTasks[task.id];
        const cooldownUntil = adCooldownTimestamps[task.id] || 0;
        const inCooldown = now < cooldownUntil;

        const card = document.createElement('div');
        card.className = `bento-box task-card ${inCooldown ? 'cooldown-active' : ''} ${isCompleted ? 'task-completed' : ''}`;
        card.id = `card-${task.id}`;

        let btnHtml = '';
        if (task.type.startsWith('ad_')) {
            if (inCooldown) {
                const sec = Math.ceil((cooldownUntil - now) / 1000);
                btnHtml = `<button type="button" class="cyber-btn compact-btn cooldown-btn" id="btn-${task.id}" disabled>⏳ ${sec}s</button>`;
            } else {
                btnHtml = `<button type="button" class="cyber-btn compact-btn" id="btn-${task.id}" onclick="handleTaskClick('${task.id}')">${t('btn_watch')}</button>`;
            }
        } else if (task.type === 'telegram' || task.type === 'custom_link') {
            if (isCompleted) {
                btnHtml = `<button type="button" class="cyber-btn compact-btn completed-btn" disabled>${t('btn_done')}</button>`;
            } else if (tgPendingVerify[task.id]) {
                btnHtml = `<button type="button" class="cyber-btn compact-btn primary-glow" id="btn-${task.id}" onclick="claimSocialTask('${task.id}')">${t('btn_claim')}</button>`;
            } else {
                btnHtml = `<button type="button" class="cyber-btn compact-btn" id="btn-${task.id}" onclick="handleTaskClick('${task.id}')">${t('btn_join')}</button>`;
            }
        }

        const taskTitle = currentLang === 'bn' ? task.title_bn : task.title_en;
        const taskDesc = currentLang === 'bn' ? task.desc_bn : task.desc_en;

        card.innerHTML = `
            <div class="task-icon-box ${task.iconType}">
                ${getTaskIcon(task.type)}
            </div>
            <div class="task-info">
                <div class="task-head">
                    <h4>${escapeHtml(taskTitle)}</h4>
                    <span class="ad-tag-pill">${task.badge}</span>
                </div>
                <p>${escapeHtml(taskDesc)}</p>
                <div class="task-reward-tags">
                    <span class="reward-pill" style="border-color: var(--neon-gold); color: var(--neon-gold);">
                        +${task.rewardTickets} 🎟️ ${t('unit_tickets')}
                    </span>
                </div>
            </div>
            <div>${btnHtml}</div>
        `;

        if (task.type.startsWith('ad_') && adContainer) {
            adContainer.appendChild(card);
        } else if (task.type === 'telegram' && tgContainer) {
            tgContainer.appendChild(card);
        } else if (customContainer) {
            hasCustom = true;
            customContainer.appendChild(card);
        }
    });

    if (customWrapper) customWrapper.style.display = hasCustom ? 'block' : 'none';
}

function getTaskIcon(type) {
    if (type === 'ad_adsgram') {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    } else if (type === 'ad_monetag') {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
    } else if (type === 'ad_adsterra') {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    } else {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>`;
    }
}

function handleTaskClick(taskId) {
    playClickSound();
    const task = TASKS_CONFIG.find(t => t.id === taskId);
    if (!task) return;

    if (task.type === 'ad_adsgram') runAdsgramTask(task);
    else if (task.type === 'ad_monetag') runMonetagTask(task);
    else if (task.type === 'ad_adsterra') runAdsterraTask(task);
    else if (task.type === 'telegram' || task.type === 'custom_link') runTelegramTask(task);
}

async function runAdsgramTask(task) {
    if (typeof window.Adsgram === 'undefined') {
        return showToast(currentLang === 'bn' ? 'বিজ্ঞাপন নেটওয়ার্ক প্রস্তুত নয়' : 'Ad network not available', 'error');
    }

    try {
        const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        const res = await adController.show().catch(() => ({ done: false }));

        if (res && res.done) {
            grantTaskTicketReward(task);
            startAdCooldown(task.id);
        } else {
            showToast(currentLang === 'bn' ? 'সম্পূর্ণ বিজ্ঞাপন দেখলে টিকেট পাবেন' : 'Watch full video to get tickets', 'error');
        }
    } catch (e) {
        showToast(currentLang === 'bn' ? 'বিজ্ঞাপন লোড হতে ব্যর্থ হয়েছে' : 'Ad load failed', 'error');
    }
}

function runMonetagTask(task) {
    showToast(currentLang === 'bn' ? 'বিজ্ঞাপন লোড হচ্ছে...' : 'Loading sponsor ad...');
    if (typeof window.show_native === 'function') {
        window.show_native().then(() => {
            grantTaskTicketReward(task);
            startAdCooldown(task.id);
        }).catch(() => {
            showToast('Monetag error', 'error');
        });
    } else {
        setTimeout(() => {
            grantTaskTicketReward(task);
            startAdCooldown(task.id);
        }, 3000);
    }
}

function runAdsterraTask(task) {
    const btn = document.getElementById(`btn-${task.id}`);
    if (btn) btn.disabled = true;

    if (tg?.openLink) tg.openLink(task.visitUrl);
    else window.open(task.visitUrl, '_blank');

    let left = 15;
    showToast(currentLang === 'bn' ? '১৫ সেকেন্ড পেজটি ভিজিট করুন...' : 'Visit for 15 seconds...');
    const timer = setInterval(() => {
        left--;
        if (btn) btn.innerText = `${left}s...`;
        if (left <= 0) {
            clearInterval(timer);
            grantTaskTicketReward(task);
            startAdCooldown(task.id);
        }
    }, 1000);
}

function runTelegramTask(task) {
    if (tg?.openTelegramLink && task.link.includes('t.me/')) {
        tg.openTelegramLink(task.link);
    } else {
        window.open(task.link, '_blank');
    }

    tgPendingVerify[task.id] = true;
    showToast(currentLang === 'bn' ? 'চ্যানেলে জয়েন করে ফিরে এসে ক্লেইম করুন' : 'Join channel and click Claim');
    renderAllTasks();
}

function claimSocialTask(taskId) {
    playClickSound();
    const task = TASKS_CONFIG.find(t => t.id === taskId);
    if (!task) return;

    userCompletedTasks[task.id] = true;
    localStorage.setItem('arcade_completed_tasks', JSON.stringify(userCompletedTasks));
    delete tgPendingVerify[task.id];

    grantTaskTicketReward(task);
    db.ref('users/' + userId + '/completedTasks').set(userCompletedTasks);
    renderAllTasks();
}

function grantTaskTicketReward(task) {
    userTickets += task.rewardTickets;
    db.ref('users/' + userId).update({ tickets: userTickets });

    playRewardSound();
    triggerConfetti();
    showToast(`🎉 +${task.rewardTickets} ${t('unit_tickets')}!`);
    updateUI();
}

function startAdCooldown(taskId) {
    adCooldownTimestamps[taskId] = Date.now() + AD_COOLDOWN_TIME_MS;
    localStorage.setItem('arcade_ad_cooldowns', JSON.stringify(adCooldownTimestamps));
    renderAllTasks();
}

// ৬০ সেকেন্ডের কাউন্টডাউন টাইমার
setInterval(() => {
    const now = Date.now();
    let needsReRender = false;

    TASKS_CONFIG.forEach(task => {
        if (!task.type.startsWith('ad_')) return;
        const cooldownUntil = adCooldownTimestamps[task.id];
        if (cooldownUntil && cooldownUntil > now) {
            const sec = Math.ceil((cooldownUntil - now) / 1000);
            const btn = document.getElementById(`btn-${task.id}`);
            if (btn) btn.innerText = `⏳ ${sec}s`;
        } else if (cooldownUntil && cooldownUntil <= now) {
            delete adCooldownTimestamps[task.id];
            needsReRender = true;
        }
    });

    if (needsReRender) {
        localStorage.setItem('arcade_ad_cooldowns', JSON.stringify(adCooldownTimestamps));
        renderAllTasks();
    }
}, 1000);

// ================= ৮. গেম ইঞ্জিন (১ টিকেট দিয়ে খেলা ➔ CELLS আয়) =================
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

function startArcadeMatch(e) {
    if (e) e.stopPropagation();
    playClickSound();

    if (userTickets < 1) {
        showToast(t('toast_no_tickets'), 'error');
        switchTab('home');
        return;
    }

    // ১টি টিকেট কেটে ম্যাচ শুরু
    userTickets -= 1;
    db.ref('users/' + userId).update({ tickets: userTickets });
    updateUI();

    isMatchActive = true;
    currentMatchScore = 0;
    arcadeLives = MAX_LIVES;
    currentCombo = 1;
    currentWave = 1;
    successfulHitsInWave = 0;
    currentSpawnInterval = 1250;
    hasRevivedThisMatch = false;

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

    isCurrentTargetGold = Math.random() < 0.25;
    const label = document.getElementById('target-label');
    if (isCurrentTargetGold) {
        target.classList.add('gold-node');
        if (label) label.innerText = 'GOLD!';
    } else {
        target.classList.remove('gold-node');
        if (label) label.innerText = 'STRIKE';
    }

    if (currentWave >= 2 && Math.random() < 0.40 && hazard) {
        let hX = Math.floor(Math.random() * maxX);
        let hY = Math.floor(Math.random() * maxY);
        if (Math.abs(hX - randomX) < 60) hX = (hX + 90) % maxX;
        hazard.style.left = `${hX}px`;
        hazard.style.top = `${hY}px`;
        hazard.style.display = 'flex';
    } else if (hazard) {
        hazard.style.display = 'none';
    }

    targetTimer = setTimeout(() => {
        handleTargetMiss();
    }, currentSpawnInterval);
}

function handleArcadeBoardClick(e) {
    if (!isMatchActive) return;

    const target = document.getElementById('arcade-target');
    const hazard = document.getElementById('arcade-hazard');

    if (hazard && hazard.style.display !== 'none') {
        const hRect = hazard.getBoundingClientRect();
        if (e.clientX >= hRect.left && e.clientX <= hRect.right && e.clientY >= hRect.top && e.clientY <= hRect.bottom) {
            handleHazardHit(e);
            return;
        }
    }

    const tRect = target.getBoundingClientRect();
    if (e.clientX >= tRect.left && e.clientX <= tRect.right && e.clientY >= tRect.top && e.clientY <= tRect.bottom) {
        handleTargetHit(e);
    } else {
        handleTargetMiss();
    }
}

function handleTargetHit(e) {
    playHitSound(isCurrentTargetGold);
    if (targetTimer) clearTimeout(targetTimer);

    let scoreAdd = (isCurrentTargetGold ? 30 : 10) * currentCombo;
    currentMatchScore += scoreAdd;
    currentCombo = Math.min(8, currentCombo + 1);
    successfulHitsInWave++;

    if (successfulHitsInWave >= 5) {
        currentWave++;
        successfulHitsInWave = 0;
        if (currentSpawnInterval > 500) currentSpawnInterval -= 50;
    }

    updateArcadeHUD();
    spawnNextTarget();
}

function handleHazardHit(e) {
    arcadeLives--;
    updateArcadeHUD();
    if (arcadeLives <= 0) endArcadeMatch();
    else spawnNextTarget();
}

function handleTargetMiss() {
    if (!isMatchActive) return;
    arcadeLives--;
    currentCombo = 1;
    updateArcadeHUD();
    if (arcadeLives <= 0) endArcadeMatch();
    else spawnNextTarget();
}

function updateArcadeHUD() {
    const scoreEl = document.getElementById('arcade-current-score');
    if (scoreEl) scoreEl.innerText = currentMatchScore;

    const waveEl = document.getElementById('wave-indicator');
    if (waveEl) waveEl.innerText = `WAVE ${currentWave}`;

    const comboEl = document.getElementById('combo-multiplier');
    if (comboEl) comboEl.innerText = `${currentCombo}X COMBO`;

    const livesEl = document.getElementById('display-arcade-lives');
    if (livesEl) livesEl.innerText = `${arcadeLives} / ${MAX_LIVES} ${currentLang === 'bn' ? 'শিল্ড' : 'Shield'}`;

    const gauge = document.getElementById('energy-gauge-bar');
    if (gauge) {
        gauge.style.width = `${Math.max(0, (arcadeLives / MAX_LIVES) * 100)}%`;
    }
}

function endArcadeMatch() {
    isMatchActive = false;
    if (targetTimer) clearTimeout(targetTimer);

    document.getElementById('arcade-target').style.display = 'none';
    const hazard = document.getElementById('arcade-hazard');
    if (hazard) hazard.style.display = 'none';

    // শুধুমাত্র গেম খেলে রিওয়ার্ড প্রাপ্তি: প্রতি ৪ স্কোরে ১টি Energy Cell
    const earnedCredits = Math.floor(currentMatchScore / 4);
    balanceCredits += earnedCredits;
    totalMatchesPlayed++;

    if (currentMatchScore > personalHighScore) {
        personalHighScore = currentMatchScore;
        triggerConfetti();
    }

    db.ref('users/' + userId).update({
        balance: balanceCredits,
        highScore: personalHighScore,
        matchesPlayed: totalMatchesPlayed
    });

    document.getElementById('modal-final-score').innerText = currentMatchScore;
    document.getElementById('modal-match-credits').innerText = `+${earnedCredits} CELLS`;
    document.getElementById('modal-best-score').innerText = personalHighScore;

    const modal = document.getElementById('game-over-modal');
    if (modal) modal.style.display = 'flex';
    updateUI();
}

function closeGameOverModal() {
    playClickSound();
    const modal = document.getElementById('game-over-modal');
    if (modal) modal.style.display = 'none';
    document.getElementById('game-overlay-screen').style.display = 'flex';
}

async function triggerReviveWithAd() {
    if (hasRevivedThisMatch) return;
    playClickSound();

    if (typeof window.Adsgram === 'undefined') {
        return showToast(currentLang === 'bn' ? 'বিজ্ঞাপন নেটওয়ার্ক উপলব্ধ নয়' : 'Ad network offline', 'error');
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
            showToast(currentLang === 'bn' ? '⚡ শিল্ড রিভাইভ সফল!' : '⚡ Shield Revived!');
            spawnNextTarget();
        }
    } catch (e) {
        showToast('Ad service unavailable', 'error');
    }
}

// ================= ৯. TON WALLET CONNECT ENGINE =================
let tonConnectUI = null;

function initTonConnect() {
    try {
        if (typeof TON_CONNECT_UI !== 'undefined') {
            tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'https://aetheria-arcade-api.rakibkdbb.workers.dev/tonconnect-manifest.json',
                buttonRootId: 'ton-connect-button-root'
            });

            tonConnectUI.onStatusChange(wallet => {
                if (wallet) {
                    tonWalletAddress = wallet.account.address;
                    localStorage.setItem('arcade_ton_address', tonWalletAddress);
                    db.ref('users/' + userId).update({ tonWallet: tonWalletAddress });
                    showToast(t('toast_wallet_connected'));
                    updateUI();
                } else {
                    tonWalletAddress = "";
                    localStorage.removeItem('arcade_ton_address');
                    updateUI();
                }
            });
        }
    } catch (e) {
        console.warn('TonConnect Note:', e);
    }
}

function saveManualTonAddress() {
    playClickSound();
    const input = document.getElementById('manual-ton-address-input');
    const val = (input?.value || '').trim();

    if (!val || val.length < 24) {
        return showToast(currentLang === 'bn' ? 'সঠিক TON ওয়ালেট অ্যাড্রেস লিখুন!' : 'Invalid TON address!', 'error');
    }

    tonWalletAddress = val;
    localStorage.setItem('arcade_ton_address', tonWalletAddress);
    db.ref('users/' + userId).update({ tonWallet: tonWalletAddress });

    showToast(currentLang === 'bn' ? 'TON Address সেভ করা হয়েছে!' : 'TON Address Saved!');
    const status = document.getElementById('manual-ton-status');
    if (status) status.innerText = 'Saved ✅';
    updateUI();
}

function handleWithdrawRequest() {
    playClickSound();
    if (!tonWalletAddress) {
        return showToast(currentLang === 'bn' ? 'আগে TON Wallet সেভ করুন!' : 'Connect or save TON Wallet first!', 'error');
    }

    if (balanceCredits < 1000) {
        return showToast(t('toast_withdraw_min'), 'error');
    }

    const reqAmount = balanceCredits;
    db.ref('withdrawals').push({
        userId,
        userName,
        amountCells: reqAmount,
        tonAddress: tonWalletAddress,
        status: 'pending',
        timestamp: Date.now()
    }).then(() => {
        balanceCredits = 0;
        db.ref('users/' + userId).update({ balance: balanceCredits });
        triggerConfetti();
        showToast(t('toast_withdraw_success'));
        updateUI();
    }).catch(() => {
        showToast('Withdraw error', 'error');
    });
}

// ================= ১০. ডেইলি বোনাস ড্রপ (শুধু টিকেট) ও রেফারেল =================
function openCheckInFullView() {
    playClickSound();
    renderCheckInGrid();
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) sheet.classList.add('active');
}

function closeCheckInFullView() {
    playClickSound();
    const sheet = document.getElementById('checkin-fullview');
    if (sheet) sheet.classList.remove('active');
}

function renderCheckInGrid() {
    const grid = document.getElementById('checkin-grid');
    const claimBtn = document.getElementById('btn-claim-checkin');
    const statusText = document.getElementById('checkin-streak-status');
    if (!grid) return;

    const today = new Date().toISOString().slice(0, 10);
    const isClaimedToday = (lastCheckInDate.startsWith(today));
    if (statusText) {
        statusText.innerText = currentLang === 'bn' 
            ? `বর্তমান স্ট্রিক: ${checkInStreak} দিন` 
            : `Current Streak: ${checkInStreak} Days`;
    }

    let html = '';
    const currentTargetDay = isClaimedToday ? checkInStreak : ((checkInStreak % 7) + 1);

    for (let i = 1; i <= 7; i++) {
        const ticketReward = checkInTicketRewards[i - 1];
        let tileClass = 'cyber-checkin-tile';
        if (isClaimedToday ? (i <= checkInStreak) : (i < currentTargetDay)) tileClass += ' claimed';
        else if (!isClaimedToday && i === currentTargetDay) tileClass += ' active';

        html += `
            <div class="${tileClass}">
                <span class="tile-day-lbl">${currentLang === 'bn' ? 'দিন' : 'Day'} ${i}</span>
                <span class="tile-pts-val" style="color: var(--neon-gold);">+${ticketReward} 🎟️</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (claimBtn) {
        if (isClaimedToday) {
            claimBtn.disabled = true;
            claimBtn.innerText = t('btn_claimed_today');
        } else {
            claimBtn.disabled = false;
            claimBtn.innerText = currentLang === 'bn' 
                ? `আজকের ফ্রি টিকেট নিন (+${checkInTicketRewards[currentTargetDay - 1]} 🎟️)`
                : `Claim Today's Free Ticket (+${checkInTicketRewards[currentTargetDay - 1]} 🎟️)`;
        }
    }
}

function claimDailyCheckIn() {
    playClickSound();
    const today = new Date().toISOString().slice(0, 10);
    if (lastCheckInDate.startsWith(today)) return;

    const currentTargetDay = (checkInStreak % 7) + 1;
    const freeTicketsWon = checkInTicketRewards[currentTargetDay - 1];

    checkInStreak++;
    lastCheckInDate = today;
    userTickets += freeTicketsWon;

    db.ref('users/' + userId).update({ checkInStreak, lastCheckInDate, tickets: userTickets });
    playRewardSound();
    triggerConfetti();
    showToast(`+${freeTicketsWon} ${t('unit_tickets')}!`);
    renderCheckInGrid();
    updateUI();
}

function copyReferralLink() {
    playClickSound();
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(myReferralLink).then(() => showToast(t('toast_copied')));
    } else {
        showToast(t('toast_copied'));
    }
}

function shareReferralLink() {
    playClickSound();
    const shareText = currentLang === 'bn'
        ? `🎮 Aetheria Arcade-এ জয়েন করুন! প্রতি রেফারে ফ্রি গেম টিকেট (+৩ 🎟️) পান এবং গেম খেলে TON ক্রিপ্টো রিওয়ার্ড জিতে নিন!\n\nখেলতে জয়েন করুন:\n${myReferralLink}`
        : `🎮 Enter Aetheria Arcade! Get 3 Free Game Tickets (+3 🎟️) per invite and win real TON crypto rewards!\n\nJoin now:\n${myReferralLink}`;
    
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(myReferralLink)}&text=${encodeURIComponent(shareText)}`;
    if (tg?.openTelegramLink) tg.openTelegramLink(tgUrl);
    else window.open(tgUrl, '_blank');
}

function openCommunityChannel() {
    playClickSound();
    if (tg?.openTelegramLink) tg.openTelegramLink(telegramCommunityUrl);
    else window.open(telegramCommunityUrl, '_blank');
}

// ================= ১১. প্রফেশনাল পডিয়াম স্টল লিডারবোর্ড =================
function listenToPodiumLeaderboard() {
    const listContainer = document.getElementById('leaderboard-container');
    if (!listContainer) return;

    db.ref('users').orderByChild('highScore').limitToLast(30).on('value', snapshot => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = `<div class="loading-state">${t('msg_syncing')}</div>`;
            return;
        }

        const pilots = [];
        snapshot.forEach(child => pilots.push(child.val()));
        pilots.reverse(); // সর্বোচ্চ স্কোর থেকে নিম্নগামী

        // ১. পডিয়াম স্টল ডেটা আপডেট (1st, 2nd, 3rd)
        const rank1 = pilots[0];
        const rank2 = pilots[1];
        const rank3 = pilots[2];

        // Champion (1st)
        if (rank1) {
            document.getElementById('podium-1-avatar').innerText = (rank1.name?.charAt(0) || '1').toUpperCase();
            document.getElementById('podium-1-name').innerText = escapeHtml(rank1.name || 'Champion');
            document.getElementById('podium-1-score').innerText = `${rank1.highScore || 0} PTS`;
        }
        // Silver (2nd)
        if (rank2) {
            document.getElementById('podium-2-avatar').innerText = (rank2.name?.charAt(0) || '2').toUpperCase();
            document.getElementById('podium-2-name').innerText = escapeHtml(rank2.name || 'Silver Pilot');
            document.getElementById('podium-2-score').innerText = `${rank2.highScore || 0} PTS`;
        }
        // Bronze (3rd)
        if (rank3) {
            document.getElementById('podium-3-avatar').innerText = (rank3.name?.charAt(0) || '3').toUpperCase();
            document.getElementById('podium-3-name').innerText = escapeHtml(rank3.name || 'Bronze Pilot');
            document.getElementById('podium-3-score').innerText = `${rank3.highScore || 0} PTS`;
        }

        // ২. রানার্স-আপ তালিকা (৪র্থ থেকে বাকি পাইলটদের তালিকা)
        const challengers = pilots.slice(3);
        if (challengers.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:13px;">${currentLang === 'bn' ? 'অন্যান্য পাইলটদের স্কোর শীঘ্রই আসছে' : 'More pilots joining soon'}</div>`;
            return;
        }

        let html = '';
        challengers.forEach((pilot, idx) => {
            const initial = (pilot.name?.charAt(0) || 'P').toUpperCase();
            const rankPos = idx + 4;

            html += `
                <div class="roster-item">
                    <div class="roster-left">
                        <span class="roster-rank-num">#${rankPos}</span>
                        <div class="roster-avatar">${initial}</div>
                        <div class="roster-details">
                            <span class="roster-title">${escapeHtml(pilot.name || 'Pilot')}</span>
                            <span class="roster-sub">${escapeHtml(pilot.username || '')}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span class="cyber-chip chip-success">${pilot.highScore || 0} PTS</span>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    });
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// ================= ১২. ট্যাব সুইচিং ও ইনিট সাইকেল =================
function switchTab(viewId) {
    playClickSound();
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
    initTonConnect();

    // স্প্ল্যাশ স্ক্রিন বুট অ্যানিমেশন
    let splashProgress = 0;
    const splashTimer = setInterval(() => {
        splashProgress += 34;
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
    }, 30);
});
