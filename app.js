/* ==========================================================================
   ENJOY MOVIES ULTRA HD - 100/100 MASTER CONTROLLER (app.js)
   Secured with Cloudflare Worker: security-3a8b.rakibkdbb.workers.dev
   ========================================================================== */

const $ = id => document.getElementById(id);

// মাস্টার ব্যাকএন্ড API এন্ডপয়েন্ট
const MASTER_API = "https://security-3a8b.rakibkdbb.workers.dev";

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyBR9cx11EjwDzoCshY_8_j-pBix_brYA50",
    authDomain: "ads-earning-26019.firebaseapp.com",
    databaseURL: "https://ads-earning-26019-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ads-earning-26019",
    storageBucket: "ads-earning-26019.firebasestorage.app",
    messagingSenderId: "226920017119",
    appId: "1:226920017119:web:f9e5d2baac8cc86ab30d6a"
};

let APP_LANG = localStorage.getItem('app_lang_choice') || 'bn';

// বহুভাষিক ডিকশনারি (i18n)
const I18N = {
    bn: {
        appName: "ইনজ়য় মুভিজ", appHeaderBadge: "সিনেমা", menuTitle: "মেনু", drawerMovie: "মুভি", drawerSeries: "সিরিজ", drawerAdult: "এন্ডাল",
        drawerProfile: "ইউজার প্রোফাইল", drawerLangLabel: "ভাষা পরিবর্তন", drawerSocial: "সোশ্যাল লিংক", telegram: "টেলিগ্রাম", searchPlaceholder: "ভিডিও বা সিনেমার নাম খুঁজুন...",
        adultHero1: "নতুন এন্ডাল", adultHeroSub1: "লেটেস্ট আপডেট", adultHero2: "হট এন্ডাল", adultHeroSub2: "জনপ্রিয় কালেকশন",
        seriesHero1: "নতুন সিরিজ", seriesHeroSub1: "ফুল সিজন", seriesHero2: "হট সিরিজ", seriesHeroSub2: "জনপ্রিয় সিরিজ",
        movieHero1: "নতুন সিনেমা", movieHeroSub1: "সর্বশেষ রিলিজ", movieHero2: "হট সিনেমা", movieHeroSub2: "জনপ্রিয় সিনেমা",
        adultFeatureTitle: "এন্ডাল ভিডিও লাইব্রেরি", adultFeatureDesc: "আপনার পছন্দের ভিডিও নির্বাচন করে ফ্রিতে অ্যাড দেখে অথবা পয়েন্ট দিয়ে আনলক করে উপভোগ করুন।",
        adultBadgeFeature: "এন্ডাল বিশেষ কালেকশন", adultCountSub: "ভিডিও", tagUltraHd: "⚡ আল্ট্রা এইচডি",
        seriesBadgeFeature: "ওয়েব সিরিজ", seriesCountSub: "সিরিজ", seriesFeatureTitle: "সিরিজ লাইব্রেরি", seriesFeatureDesc: "দেশি ও বিদেশি সকল জনপ্রিয় ওয়েব সিরিজের অল এপিসোড সরাসরি আনলক করুন।",
        tagFullSeason: "⚡ ফুল সিজন", movieBadgeFeature: "মুভিজ", movieCountSub: "মুভি", movieFeatureTitle: "সিনেমা লাইব্রেরি", movieFeatureDesc: "আপনার পছন্দের সিনেমার উপর ক্লিক করে আনলক করে উপভোগ করুন।",
        tagMovie: "⚡ সিনেমা", overviewBarTitle: "ব্যালেন্স ওভারভিউ", lblMyPoints: "আমার পয়েন্ট", lblActiveRef: "সক্রিয় রেফারেল",
        profileWithdrawTitle: "টাকা উত্তোলন (বিকাশ/নগদ/রিচার্জ)", profileWithdrawSub: "সহজ ও দ্রুত পেমেন্ট রিকোয়েস্ট ও হিস্টোরি", btnOpenWithdraw: "উত্তোলন করুন",
        earnBarTitle: "পয়েন্ট আয় করুন", profileEarnTitle: "রিওয়ার্ড অ্যাড দেখে পয়েন্ট আয় করুন", profileEarnDesc: "বিজ্ঞাপন দেখে পয়েন্ট সংগ্রহ করে ভিডিও আনলক করুন অথবা টাকা উত্তোলন করুন।",
        pillInstant: "ইনস্ট্যান্ট পয়েন্ট", pillFreeCoins: "ফ্রি কয়েন", btnProfileEarnMore: "আরও পয়েন্ট আয় করুন", refBarTitle: "সিকিউর রেফারেল সিস্টেম",
        lblRefBonus: "সক্রিয় রেফারেল রিওয়ার্ড", lblJoinBonus: "বন্ধু জয়েন বোনাস", lblAntiFraud: "শর্ত (অ্যান্টি-ফ্রড)", lblRefCode: "রেফারেল কোড", lblRefLink: "আপনার রেফারেল লিংক",
        btnShareRef: "শেয়ার করুন", btnCopyRef: "লিংক কপি",
        payoutPageHead: "টাকা উত্তোলন", payoutPageSub: "বিকাশ, নগদ ও মোবাইল রিচার্জ",
        lblEarnStatBal: "বর্তমান পয়েন্ট", lblEarnStatRew: "প্রতি অ্যাড পয়েন্ট", lblEarnStatWatch: "দেখা বিজ্ঞাপন", lblEarnStatLim: "দৈনিক লিমিট",
        btnWatchReward: "বিজ্ঞাপন দেখে পয়েন্ট নিন", doneToday: "আজ সম্পন্ন হয়েছে", videoUnlockNoticeTitle: "ভিডিও আনলক", videoUnlockNoticeDesc: "বিজ্ঞাপন দেখে ফ্রিতে অথবা পয়েন্ট দিয়ে সরাসরি ভিডিওটি চালু করুন।",
        unlockDurationAdBadge: "২ ঘণ্টার জন্য ফ্রি", unlockDurationPtDesc: "২৪ ঘণ্টার জন্য আনলক থাকবে", btnAdWatchRemain: "বিজ্ঞাপন দেখে ফ্রিতে আনলক করুন", btnPointUnlock: "পয়েন্ট দিয়ে সরাসরি আনলক করুন",
        lblBackHome: "আরো দেখুন", rulesTitle: "ভিডিও দেখার নিয়ম", rulesDoneBtn: "বুঝেছি, ধন্যবাদ", adultModalTitle: "এন্ডাল সতর্কতা ও দায়মুক্তি নোটিশ",
        btnAdultConfirm: "আমি নিজ দায়িত্বে প্রবেশ করছি", btnAdultDecline: "না, সিনেমা লাইব্রেরিতে ফিরে যান", tgModalHeading: "চ্যানেলে জয়েন করা বাধ্যতামূলক",
        tgModalDesc: "ভিডিও আনলক করতে ও প্লে করতে আমাদের টেলিগ্রাম চ্যানেলে যুক্ত থাকা বাধ্যতামূলক।", btnTgJoin: "চ্যানেলে জয়েন করুন", btnTgVerify: "আমি জয়েন করেছি",
        lblTabWithdraw: "উত্তোলন", lblTabHistory: "হিস্টোরি", lblCurBal: "বর্তমান ব্যালেন্স", lblTakaEquiv: "টাকার পরিমাণ", lblChooseGw: "উত্তোলন মাধ্যম বেছে নিন:",
        lblChooseSim: "সিম অপারেটর নির্বাচন করুন:", btnSubmitPayout: "উত্তোলন রিকোয়েস্ট পাঠান", btnClose: "বন্ধ করুন", unitPoints: "পয়েন্ট", partPrefix: "পাঠ",
        likesWord: "লাইক", viewsWord: "ভিউ", currencySymbol: "৳", uidPrefix: "আইডি:", emptyList: "কোনো ভিডিও বা তথ্য পাওয়া যায়নি!",
        bannedTitle: "আপনার একাউন্ট স্থগিত করা হয়েছে", bannedDesc: "অ্যাপের নিয়ম ভঙ্গের কারণে আপনার আইডিটি সাময়িক বা স্থায়ীভাবে ব্যান করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।",
        bannedSupportBtn: "সাপোর্টে মেসেজ দিন", maintTitle: "অ্যাপ সাময়িক রক্ষণাবেক্ষণে আছে", maintDesc: "আমরা সিস্টেম আপডেট করছি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
        rechargeSummaryPrefix: "রিচার্জ:", bkashNagadSummaryPrefix: "বিকাশ/নগদ:", unlockProgressTxt: "আনলক অগ্রগতি:", unlockCompletedTxt: "সম্পন্ন",
        minWithdrawPrefix: "নূন্যতম উত্তোলন:", inputPhonePlaceholder: "মোবাইল নম্বর দিন", inputAmountPlaceholder: "পয়েন্ট পরিমাণ দিন", adminNoticeTitle: "অ্যাডমিন নোটিশ",
        defaultWithdrawNotice: "উত্তোলন রিকোয়েস্ট দেওয়ার সর্বোচ্চ ২৪ ঘণ্টার মধ্যে পেমেন্ট কমপ্লিট করা হবে। সঠিক নম্বর প্রদান করুন।",
        allCat: "সকল", catFilterLabel: "ক্যাটাগরি ফিল্টার",
        hubUnverifiedBadge: "অপ্রমাণিত", hubVerifiedBadge: "ভেরিফাইড", hubVerifyBtnTxt: "ভেরিফাই করুন",
        justNow: "এইমাত্র", minutesAgo: "মিনিট আগে", hoursAgo: "ঘণ্টা আগে", daysAgo: "দিন আগে", weeksAgo: "সপ্তাহ আগে", monthsAgo: "মাস আগে", yearsAgo: "বছর আগে"
    },
    en: {
        appName: "Enjoy Movies", appHeaderBadge: "Movies", menuTitle: "Menu", drawerMovie: "Movies", drawerSeries: "Series", drawerAdult: "Endal",
        drawerProfile: "User Profile", drawerLangLabel: "Change Language", drawerSocial: "Social Links", telegram: "Telegram", searchPlaceholder: "Search movies or videos...",
        adultHero1: "New Endal", adultHeroSub1: "Latest Updates", adultHero2: "Hot Endal", adultHeroSub2: "Popular Collection",
        seriesHero1: "New Series", seriesHeroSub1: "Full Seasons", seriesHero2: "Hot Series", seriesHeroSub2: "Top Ranked",
        movieHero1: "New Movies", movieHeroSub1: "Latest Releases", movieHero2: "Hot Movies", movieHeroSub2: "Popular Movies",
        adultFeatureTitle: "Endal Video Library", adultFeatureDesc: "Pick your preferred video, unlock for free by watching ads or directly with points.",
        adultBadgeFeature: "Endal Special", adultCountSub: "Videos", tagUltraHd: "⚡ Ultra HD",
        seriesBadgeFeature: "Web Series", seriesCountSub: "Series", seriesFeatureTitle: "Series Library", seriesFeatureDesc: "Unlock all episodes of popular local and international web series instantly.",
        tagFullSeason: "⚡ Full Season", movieBadgeFeature: "Movies", movieCountSub: "Movies", movieFeatureTitle: "Movie Library", movieFeatureDesc: "Click any movie below to unlock and start streaming instantly.",
        tagMovie: "⚡ Movies", overviewBarTitle: "Balance Overview", lblMyPoints: "My Points", lblActiveRef: "Active Referrals",
        profileWithdrawTitle: "Withdraw Money (bKash/Nagad/Recharge)", profileWithdrawSub: "Fast and secure payment requests and complete history", btnOpenWithdraw: "Withdraw Now",
        earnBarTitle: "Earn Points", profileEarnTitle: "Earn Points by Watching Ads", profileEarnDesc: "Collect reward points by watching ads to unlock movies or cash out.",
        pillInstant: "Instant Points", pillFreeCoins: "Free Coins", btnProfileEarnMore: "Earn More Points", refBarTitle: "Secure Referral System",
        lblRefBonus: "Active Referral Reward", lblJoinBonus: "Friend Join Bonus", lblAntiFraud: "Rule (Anti-Fraud)", lblRefCode: "Referral Code", lblRefLink: "Your Referral Link",
        btnShareRef: "Share Link", btnCopyRef: "Copy Link",
        payoutPageHead: "Withdraw Money", payoutPageSub: "bKash, Nagad & Mobile Recharge",
        lblEarnStatBal: "Current Points", lblEarnStatRew: "Points Per Ad", lblEarnStatWatch: "Watched Ads", lblEarnStatLim: "Daily Limit",
        btnWatchReward: "Watch Ad & Collect Points", doneToday: "completed today", videoUnlockNoticeTitle: "Unlock Video", videoUnlockNoticeDesc: "Watch ads for free access or unlock permanently with points.",
        unlockDurationAdBadge: "Free for 2 Hours", unlockDurationPtDesc: "Unlocked for 24 Hours", btnAdWatchRemain: "Unlock with Ads Free", btnPointUnlock: "Instant Unlock with Points",
        lblBackHome: "Browse More", rulesTitle: "Video Watching Rules", rulesDoneBtn: "Understood, Thanks", adultModalTitle: "Endal Warning & Disclaimer",
        btnAdultConfirm: "I Enter At My Own Risk", btnAdultDecline: "No, Back To Movies", tgModalHeading: "Telegram Channel Join Required",
        tgModalDesc: "You must be a member of our official Telegram channel to unlock and watch videos.", btnTgJoin: "Join Channel", btnTgVerify: "I Have Joined",
        lblTabWithdraw: "Withdraw", lblTabHistory: "History", lblCurBal: "Current Balance", lblTakaEquiv: "Amount in Cash", lblChooseGw: "Select Gateway:",
        lblChooseSim: "Select Mobile Operator:", btnSubmitPayout: "Submit Withdrawal Request", btnClose: "Close", unitPoints: "Points", partPrefix: "Part",
        likesWord: "Likes", viewsWord: "Views", currencySymbol: "BDT", uidPrefix: "ID:", emptyList: "No videos or content available in this section!",
        bannedTitle: "Your Account Has Been Suspended", bannedDesc: "Your account is temporarily or permanently suspended due to violation of rules. Please contact support.",
        bannedSupportBtn: "Contact Support", maintTitle: "App Under Maintenance", maintDesc: "We are currently updating our systems. Please check back shortly.",
        rechargeSummaryPrefix: "Recharge:", bkashNagadSummaryPrefix: "bKash/Nagad:", unlockProgressTxt: "Unlock Progress:", unlockCompletedTxt: "Completed",
        minWithdrawPrefix: "Min Withdrawal:", inputPhonePlaceholder: "Enter mobile number", inputAmountPlaceholder: "Enter points amount", adminNoticeTitle: "Admin Notice",
        defaultWithdrawNotice: "Payments are processed within 24 hours of request. Ensure your number is correct.",
        allCat: "All", catFilterLabel: "Category Filter",
        hubUnverifiedBadge: "Unverified", hubVerifiedBadge: "Verified", hubVerifyBtnTxt: "Verify Now",
        justNow: "Just now", minutesAgo: "mins ago", hoursAgo: "hours ago", daysAgo: "days ago", weeksAgo: "weeks ago", monthsAgo: "months ago", yearsAgo: "years ago"
    }
};

let APP_CONFIG = {
    appName: "ইনজ়য় মুভিজ", 
    appHeaderBadge: "সিনেমা", 
    cloudflareStreamApi: `${MASTER_API}/api/stream`, 
    adsgramRewardBlockId: "46116", 
    adsgramInterstitialBlockId: "int-38278",
    monetagZoneId: "11928576",
    monetagSdkName: "show_11928576",
    adsgramDailyLimit: 10,
    adsgramRewardPoints: 2,
    monetagDailyLimit: 10,
    monetagRewardPoints: 2,
    adNetwork: "both",
    adModeVideo: "alternate",
    adModeEarn: "reward",
    botUsername: "Ret2_bot", 
    telegramChannelId: "@Ads_Earn_Pro", 
    appShortName: "TkEarning", 
    telegramChannel: "https://t.me/Ads_Earn_Pro",
    telegramChannelTitle: "টেলিগ্রাম", 
    unlockAdCount: 3, 
    unlockPointsCost: 5, 
    adRewardPoints: 2, 
    dailyAdLimit: 20, 
    referralBonus: 10,
    signupBonus: 10, 
    initialPoints: 10, 
    adCooldownSeconds: 5, 
    minWithdrawPoints: 100, 
    minWithdrawBkash: 100, 
    minWithdrawNagad: 100, 
    minWithdrawRecharge: 40,
    pointsToTakaRate: 0.3, 
    adUnlockDurationHours: 2, 
    pointsUnlockDurationHours: 24, 
    maintenanceMode: false,
    enableBkash: true, 
    enableNagad: true, 
    enableRecharge: true
};

let db = null, tg = null, currentUser = null, userData = {};
let adsgramRewardController = null, adsgramInterstitialController = null;
let currentSelectedGateway = 'bKash', selectedSimOperator = 'Grameenphone';
let allLoadedVideos = [], activeDetailVideo = null, videoAdProgressMap = {}, videoUnlockExpiryMap = {};
let currentActiveTab = 'movies', currentStreamUrl = "", hlsInstance = null, currentPlayingPartIndex = 0;
let countdownTimerInterval = null, searchDebounceTimeout = null;
let backButtonInitialized = false;
let activeHeroFilterTags = { adult: 'adult_new', series: 'new_series', movies: 'new_movie' };

let adminCreatedCategories = [];
let activeSelectedCategory = { movies: 'all', series: 'all', adult: 'all' };
let activeDedicatedNetwork = 'adsgram';

// মেমোরি থেকে ভেরিফিকেশন স্ট্যাটাস রিস্টোর (যদি পূর্বে ভেরিফাই করা থাকে)
let isTgMemberVerified = localStorage.getItem('tg_member_verified') === 'true';

let lastListScrollY = 0;
let lastOpenedVideoId = null;

const ITEMS_PER_PAGE = 10;
let currentPageMap = { adult: 1, series: 1, movies: 1 };
let userLikedVideos = {};
try { userLikedVideos = JSON.parse(localStorage.getItem('app_user_liked_vids') || '{}'); } catch(e) { userLikedVideos = {}; }

// =================== ইউটিলিটি ফাংশন ===================
function triggerHaptic(type = 'light') {
    try {
        if (tg?.HapticFeedback) {
            if (['success', 'error', 'warning'].includes(type)) tg.HapticFeedback.notificationOccurred(type);
            else tg.HapticFeedback.impactOccurred(type);
        }
    } catch (e) {}
}

function setupTelegramBackButton() {
    if (!tg?.BackButton || backButtonInitialized) return;
    backButtonInitialized = true;
    tg.BackButton.onClick(() => {
        triggerHaptic('light');
        if ($('web-player-modal')?.style.display === 'flex') return closeWebVideoPlayer();
        if ($('series-drawer-modal')?.style.display === 'flex') return closeSeriesDrawer();
        if ($('payout-view')?.style.display === 'block') return closePayoutView();
        if ($('rules-modal')?.style.display === 'flex') { $('rules-modal').style.display = 'none'; return updateTelegramBackButtonState(); }
        if ($('adult-warning-modal')?.style.display === 'flex') return declineAdultAge();
        if ($('drawer-menu')?.classList.contains('open')) return toggleSidebarMenu(false);
        if ($('dedicated-ad-view')?.style.display === 'block') return closeDedicatedAdScreen();
        if ($('earn-hub-view')?.style.display === 'block') return closeEarnHubView();
        if ($('video-unlock-detail-view')?.style.display === 'block') return closeVideoDetailView();
    });
}

function updateTelegramBackButtonState() {
    if (!tg?.BackButton) return;
    const isAnyOpen = $('series-drawer-modal')?.style.display === 'flex' || 
        $('payout-view')?.style.display === 'block' ||
        $('rules-modal')?.style.display === 'flex' || 
        $('adult-warning-modal')?.style.display === 'flex' ||
        $('web-player-modal')?.style.display === 'flex' || 
        $('video-unlock-detail-view')?.style.display === 'block' ||
        $('dedicated-ad-view')?.style.display === 'block' ||
        $('earn-hub-view')?.style.display === 'block' || 
        $('drawer-menu')?.classList.contains('open');
    isAnyOpen ? tg.BackButton.show() : tg.BackButton.hide();
}

function formatNumber(n) {
    if (n === undefined || n === null || n === '') return APP_LANG === 'bn' ? '০' : '0';
    if (APP_LANG === 'en') return String(n);
    const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(n).replace(/\d/g, d => bn[d]);
}

// ১০০% নির্ভুল Time-Ago ফাংশন (০ মাস বা ভুল হিসাব সম্পূর্ণ ফিক্সড)
function formatTimeAgo(timestamp) {
    if (!timestamp) return I18N[APP_LANG].justNow;
    
    let time = 0;
    try {
        if (typeof timestamp === 'object') {
            if (typeof timestamp.toDate === 'function') {
                time = timestamp.toDate().getTime();
            } else if (typeof timestamp.toMillis === 'function') {
                time = timestamp.toMillis();
            } else if (timestamp.seconds !== undefined) {
                time = timestamp.seconds * 1000;
            } else if (timestamp._seconds !== undefined) {
                time = timestamp._seconds * 1000;
            } else if (timestamp instanceof Date) {
                time = timestamp.getTime();
            }
        } else if (typeof timestamp === 'number') {
            time = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
        } else if (typeof timestamp === 'string') {
            const num = Number(timestamp);
            if (!isNaN(num) && num > 0) {
                time = num < 10000000000 ? num * 1000 : num;
            } else {
                time = new Date(timestamp).getTime();
            }
        }
    } catch (e) {
        return I18N[APP_LANG].justNow;
    }

    if (!time || isNaN(time) || time <= 0) return I18N[APP_LANG].justNow;

    const diff = Math.max(0, Date.now() - time);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const t = I18N[APP_LANG];

    // মিনিটের হিসাব
    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${formatNumber(minutes)} ${t.minutesAgo}`;

    // ঘণ্টার হিসাব (১ থেকে ২৩ ঘণ্টা)
    if (hours < 24) return `${formatNumber(hours)} ${t.hoursAgo}`;

    // দিনের হিসাব (১ থেকে ৬ দিন)
    if (days < 7) return `${formatNumber(days)} ${t.daysAgo}`;

    // সপ্তাহের হিসাব (৭ থেকে ২৯ দিন = ১ থেকে ৪ সপ্তাহ)
    if (days < 30) {
        const weeks = Math.max(1, Math.floor(days / 7));
        return `${formatNumber(weeks)} ${t.weeksAgo}`;
    }

    // মাসের হিসাব (৩০ থেকে ৩৬৪ দিন = ১ থেকে ১১ মাস)
    if (days < 365) {
        const months = Math.max(1, Math.floor(days / 30));
        return `${formatNumber(months)} ${t.monthsAgo}`;
    }

    // বছরের হিসাব (৩৬৫ দিন বা তার বেশি)
    const years = Math.max(1, Math.floor(days / 365));
    return `${formatNumber(years)} ${t.yearsAgo}`;
}

function showToast(msg, type = 'info') {
    const t = $('top-toast');
    if (!t) return;
    t.className = 'top-toast show ' + (type === 'error' ? 'err' : (type === 'success' ? 'succ' : ''));
    if ($('toast-msg')) $('toast-msg').innerText = msg;
    triggerHaptic(type === 'error' ? 'error' : (type === 'success' ? 'success' : 'light'));
    setTimeout(() => t.classList.remove('show'), 2800);
}

function toggleSidebarMenu(show) {
    triggerHaptic('light');
    $('drawer-overlay')?.classList.toggle('open', show);
    $('drawer-menu')?.classList.toggle('open', show);
    updateTelegramBackButtonState();
}

function navFromDrawer(tab) { toggleSidebarMenu(false); switchNavTab(tab); }

function changeAppLang(lang) {
    triggerHaptic('medium');
    APP_LANG = lang;
    localStorage.setItem('app_lang_choice', lang);
    $('btn-lang-bn')?.classList.toggle('active', lang === 'bn');
    $('btn-lang-en')?.classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    applyStaticTranslations();
    applyAdminConfigToUI();
    renderAllCategoryChips();
    filterVideosUI();
    updateEarnHubLockUI();
}

function renderRulesList() {
    const l = $('rules-modal-content-list');
    if (!l) return;
    l.innerHTML = APP_LANG === 'bn' ? `
        <div><b style="color:#00f260;">১. ভিডিও নির্বাচন:</b> পছন্দের যেকোনো মুভি বা সিরিজ কার্ডে ক্লিক করুন।</div>
        <div><b style="color:var(--primary);">২. ফ্রি অ্যাড আনলক:</b> নির্দিষ্ট ৩টি বিজ্ঞাপন দেখলে ভিডিও ২ ঘণ্টার জন্য সম্পূর্ণ ফ্রি আনলক থাকবে।</div>
        <div><b style="color:#ffe000;">৩. পয়েন্ট দিয়ে সরাসরি আনলক:</b> অ্যাড ছাড়া পয়েন্ট দিয়ে আনলক করলে ভিডিও টানা ২৪ ঘণ্টা আনলক থাকবে।</div>
        <div><b style="color:#ff0844;">৪. মেয়াদ ও নিয়ম:</b> মেয়াদ শেষ হলে পুনরায় আনলক করতে হবে। কোনো ভিপিএন বা ফেক রেফার গ্রহণযোগ্য নয়।</div>
    ` : `
        <div><b style="color:#00f260;">1. Select Video:</b> Choose your preferred movie or series.</div>
        <div><b style="color:var(--primary);">2. Free Ad Unlock:</b> Watch 3 ads to unlock free access for 2 hours.</div>
        <div><b style="color:#ffe000;">3. Point Unlock:</b> Unlock directly with points for 24-hour access.</div>
        <div><b style="color:#ff0844;">4. Policy:</b> VPN and multi-account referrals will lead to permanent ban.</div>
    `;
}

function applyStaticTranslations() {
    const t = I18N[APP_LANG];
    const txtMap = [
        ['page-head-title', t.appName], ['app-brand-title', t.appName], ['app-header-badge', t.appHeaderBadge],
        ['menu-title-txt', t.menuTitle], ['drawer-item-movie', t.drawerMovie], ['drawer-item-series', t.drawerSeries],
        ['drawer-item-adult', t.drawerAdult], ['drawer-item-profile', t.drawerProfile], ['menu-social-lbl', t.drawerSocial],
        ['menu-telegram-name', t.telegram], ['adult-hero-title1', t.adultHero1], ['adult-hero-sub1', t.adultHeroSub1],
        ['adult-hero-title2', t.adultHero2], ['adult-hero-sub2', t.adultHeroSub2], ['adult-count-sub', t.adultCountSub],
        ['adult-feature-title', t.adultFeatureTitle], ['adult-feature-desc', t.adultFeatureDesc],
        ['tag-pill-ultra-adult', t.tagUltraHd], ['adult-empty-card', t.emptyList], ['series-hero-title1', t.seriesHero1],
        ['series-hero-sub1', t.seriesHeroSub1], ['series-hero-title2', t.seriesHero2], ['series-hero-sub2', t.seriesHeroSub2],
        ['series-count-sub', t.seriesCountSub], ['series-feature-title', t.seriesFeatureTitle], ['series-feature-desc', t.seriesFeatureDesc],
        ['tag-pill-series', t.tagFullSeason], ['series-empty-card', t.emptyList], ['movie-hero-title1', t.movieHero1],
        ['movie-hero-sub1', t.movieHeroSub1], ['movie-hero-title2', t.movieHero2], ['movie-hero-sub2', t.movieHeroSub2],
        ['movie-count-sub', t.movieCountSub], ['movie-feature-title', t.movieFeatureTitle], ['movie-feature-desc', t.movieFeatureDesc],
        ['tag-pill-movie', t.tagMovie], ['movie-empty-card', t.emptyList],
        ['u-badge-vip', APP_LANG === 'bn' ? "ভিআইপি" : "VIP"], ['lbl-uid-prefix', t.uidPrefix], ['lbl-stat-my-points', t.lblMyPoints],
        ['lbl-stat-active-ref', t.lblActiveRef], ['profile-withdraw-title', t.profileWithdrawTitle], ['profile-withdraw-sub', t.profileWithdrawSub],
        ['btn-open-withdraw-txt', t.btnOpenWithdraw], ['profile-earn-title', t.profileEarnTitle], ['profile-earn-desc', t.profileEarnDesc],
        ['btn-profile-earn-more-txt', t.btnProfileEarnMore], ['lbl-ref-bonus', t.lblRefBonus], ['lbl-join-bonus', t.lblJoinBonus],
        ['lbl-anti-fraud', t.lblAntiFraud], ['lbl-ref-code', t.lblRefCode], ['lbl-ref-link', t.lblRefLink],
        ['btn-share-ref-txt', t.btnShareRef], ['btn-copy-ref-txt', t.btnCopyRef], 
        ['payout-page-head', t.payoutPageHead], ['payout-page-sub', t.payoutPageSub],
        ['video-unlock-notice-title', t.videoUnlockNoticeTitle], ['video-unlock-notice-desc', t.videoUnlockNoticeDesc],
        ['lbl-back-home-txt', t.lblBackHome], ['btn-rules-modal-close', t.rulesDoneBtn],
        ['adult-warn-title', t.adultModalTitle], ['btn-adult-decline', t.btnAdultDecline], ['tg-modal-heading', t.tgModalHeading],
        ['tg-modal-desc-txt', t.tgModalDesc], ['lbl-tab-withdraw', t.lblTabWithdraw], ['lbl-tab-history', t.lblTabHistory],
        ['lbl-cur-bal', t.lblCurBal], ['lbl-pts-unit', t.unitPoints], ['lbl-taka-equiv', t.lblTakaEquiv], ['lbl-currency-symbol', t.currencySymbol],
        ['lbl-choose-gw', t.lblChooseGw], ['gw-title-bkash', APP_LANG === 'bn' ? "বিকাশ" : "bKash"], ['gw-title-nagad', APP_LANG === 'bn' ? "নগদ" : "Nagad"],
        ['gw-title-recharge', APP_LANG === 'bn' ? "রিচার্জ" : "Recharge"], ['lbl-choose-sim', t.lblChooseSim], ['lbl-admin-notice-title', t.adminNoticeTitle],
        ['btn-submit-payout', t.btnSubmitPayout], ['btn-player-close', t.btnClose],
        ['nav-lbl-movies', t.drawerMovie], ['nav-lbl-series', t.drawerSeries], ['nav-lbl-adult', t.drawerAdult],
        ['nav-lbl-profile', APP_LANG === 'bn' ? "প্রোফাইল" : "Profile"]
    ];
    txtMap.forEach(([id, val]) => { const el = $(id); if (el && val !== undefined) el.innerText = val; });
    renderRulesList();
}

function applyAdminConfigToUI() {
    const t = I18N[APP_LANG];
    const bMin = APP_CONFIG.minWithdrawBkash || 100, nMin = APP_CONFIG.minWithdrawNagad || 100, rMin = APP_CONFIG.minWithdrawRecharge || 40;

    if ($('preloader-bot-name')) $('preloader-bot-name').innerText = APP_CONFIG.botUsername || "Ret2_bot";
    if ($('ui-referral-bonus-txt')) $('ui-referral-bonus-txt').innerText = `${formatNumber(APP_CONFIG.referralBonus)} ${t.unitPoints}`;
    if ($('ui-signup-bonus-txt')) $('ui-signup-bonus-txt').innerText = `${formatNumber(APP_CONFIG.signupBonus)} ${t.unitPoints}`;
    
    const unlockCost = APP_CONFIG.unlockPointsCost || 5;
    if ($('ui-point-cost-preview')) $('ui-point-cost-preview').innerHTML = `${formatNumber(unlockCost)} <small>pt</small>`;
    
    if ($('lbl-min-bkash')) $('lbl-min-bkash').innerText = `${formatNumber(bMin)} ${t.unitPoints}`;
    if ($('lbl-min-nagad')) $('lbl-min-nagad').innerText = `${formatNumber(nMin)} ${t.unitPoints}`;
    if ($('lbl-min-recharge')) $('lbl-min-recharge').innerText = `${formatNumber(rMin)} ${t.unitPoints}`;
    
    if (currentUser?.id && $('ref-share-url-box')) {
        $('ref-share-url-box').innerText = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${currentUser.id}`;
    }

    updateUserUI();
}

function updateUserUI() {
    const pts = userData.balancePoints ?? 0;
    const rate = APP_CONFIG.pointsToTakaRate || 0.3;

    if ($('profile-points-val')) $('profile-points-val').innerText = formatNumber(pts);
    if ($('profile-ref-count')) $('profile-ref-count').innerText = formatNumber(userData.totalReferrals ?? 0);
    if ($('payout-modal-pts')) $('payout-modal-pts').innerText = formatNumber(pts);
    if ($('payout-modal-tk')) $('payout-modal-tk').innerText = formatNumber((pts * rate).toFixed(2));
    if ($('ui-user-points-count')) $('ui-user-points-count').innerText = formatNumber(pts);
}

// ==================== CLOUDFLARE API কানেক্টর ====================
async function syncUserData() {
    if (!currentUser?.id) return;
    try {
        const deviceId = getDeviceUUID();
        const startParam = tg?.initDataUnsafe?.start_param || "";

        const res = await fetch(`${MASTER_API}/api/init-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initData: window.Telegram?.WebApp?.initData || "",
                deviceId: deviceId,
                startParam: startParam
            })
        });

        const result = await res.json();
        if (result.success && result.user) {
            userData = result.user;
            updateUserUI();
        }

        if (db) {
            db.collection("users").doc(String(currentUser.id)).onSnapshot(doc => {
                if (doc.exists) {
                    userData = { ...userData, ...doc.data() };
                    updateUserUI();
                }
            });
        }
    } catch (e) {
        console.error("User sync error:", e);
    }
}

// পয়েন্ট দিয়ে ভিডিও আনলক
async function unlockVideoWithPoints() {
    if (!activeDetailVideo) return;
    const btn = $('btn-unlock-point-step');
    if (!btn || btn.disabled) return;
    triggerHaptic('medium');

    const cost = APP_CONFIG.unlockPointsCost || 5;
    if ((userData.balancePoints ?? 0) < cost) {
        return showToast(APP_LANG === 'bn' ? "পর্যাপ্ত পয়েন্ট নেই!" : "Insufficient points!", "error");
    }

    btn.disabled = true;
    btn.innerHTML = `<div class="btn-inner-content"><i class="fa-solid fa-spinner fa-spin"></i> <span>${APP_LANG === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span></div>`;

    try {
        const response = await fetch(`${MASTER_API}/api/unlock-video-points`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initData: window.Telegram?.WebApp?.initData || "",
                videoId: activeDetailVideo.id,
                pointsCost: cost
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "পয়েন্ট কাটা সম্ভব হয়নি!");
        }

        userData.balancePoints = data.newBalance;
        videoUnlockExpiryMap[activeDetailVideo.id] = data.expiry || (Date.now() + ((APP_CONFIG.pointsUnlockDurationHours || 24) * 3600000));
        videoAdProgressMap[activeDetailVideo.id] = 0; // পয়েন্ট দিয়ে আনলক হলে অ্যাড কাউন্টার রিসেট
        saveUnlockProgress();

        updateUserUI();
        executeUnlockSuccess('point');

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        updateUnlockProgressUI();
    }
}

// বিজ্ঞাপন দেখে ভিডিও আনলক
async function watchVideoUnlockAd() {
    if (!activeDetailVideo) return;
    const btn = $('btn-unlock-ad-step');
    if (!btn || btn.disabled) return;

    const vId = activeDetailVideo.id;
    if (isVideoCurrentlyUnlocked(vId)) return playMovie(activeDetailVideo);

    triggerHaptic('medium');
    btn.disabled = true;
    btn.innerHTML = `<div class="btn-inner-content"><i class="fa-solid fa-spinner fa-spin"></i> <span>${APP_LANG === 'bn' ? 'বিজ্ঞাপন লোড হচ্ছে...' : 'Loading ad...'}</span></div>`;

    try {
        let res = await showAdsgramAd(adsgramRewardController || adsgramInterstitialController, true);
        if (!res.done) res = await showMonetagAd();

        if (res && res.done) {
            videoAdProgressMap[vId] = (videoAdProgressMap[vId] || 0) + 1;
            saveUnlockProgress();
            const total = APP_CONFIG.unlockAdCount || 3;

            if (videoAdProgressMap[vId] >= total) {
                videoUnlockExpiryMap[vId] = Date.now() + ((APP_CONFIG.adUnlockDurationHours || 2) * 3600000);
                saveUnlockProgress();
                executeUnlockSuccess('ad');
            } else {
                showToast(`বিজ্ঞাপন সম্পন্ন! বাকি ${total - videoAdProgressMap[vId]} টি`, "success");
            }
        } else {
            showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন সম্পূর্ণ দেখলে আনলক হবে!" : "Watch the entire ad to unlock!", "error");
        }
    } catch {
        showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন লোড হতে সমস্যা হয়েছে!" : "Failed to load ad!", "error");
    } finally {
        btn.disabled = false;
        updateUnlockProgressUI();
    }
}

// আর্ন হাবে অ্যাড দেখে পয়েন্ট আয় (চ্যানেল ভেরিফিকেশন ছাড়া ব্লক থাকবে)
async function watchSpecificNetworkAd() {
    const btn = $('btn-watch-dedicated-ad');
    if (!btn || btn.disabled) return;

    // সিকিউরিটি চেক: যদি চ্যানেল ভেরিফাইড না থাকে তবে কাজ করতে পারবে না
    if (!isTgMemberVerified) {
        showToast("প্রথমে চ্যানেলে জয়েন হয়ে ভেরিফাই সম্পন্ন করুন!", "error");
        openEarnHubView();
        return;
    }

    triggerHaptic('medium');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'বিজ্ঞাপন লোড হচ্ছে...' : 'Loading ad...'}`;

    try {
        let adResult = null;
        if (activeDedicatedNetwork === 'adsgram') adResult = await showAdsgramAd(adsgramRewardController, true);
        else if (activeDedicatedNetwork === 'monetag') adResult = await showMonetagAd();

        if (adResult && adResult.done) {
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'পয়েন্ট যোগ হচ্ছে...' : 'Adding points...'}`;

            const claimRes = await fetch(`${MASTER_API}/api/claim-ad-reward`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    initData: window.Telegram?.WebApp?.initData || "",
                    network: activeDedicatedNetwork
                })
            });

            const claimData = await claimRes.json();

            if (claimRes.ok && claimData.success) {
                userData.balancePoints = claimData.newBalance;
                userData.dailyAdsWatched = (userData.dailyAdsWatched || 0) + 1;
                triggerHaptic('success');
                if (window.confetti) window.confetti();
                showToast(APP_LANG === 'bn' ? `🎉 আপনি ${formatNumber(claimData.reward)} পয়েন্ট পেয়েছেন!` : `🎉 You earned ${claimData.reward} points!`, "success");
                updateUserUI();
                updateDedicatedAdScreenUI();
            } else {
                showToast(claimData.error || "পয়েন্ট যোগ হতে ব্যর্থ হয়েছে!", "error");
            }
        } else {
            showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন সম্পূর্ণ না দেখলে পয়েন্ট পাবেন না!" : "Watch full ad!", "error");
        }
    } catch (err) {
        showToast("বিজ্ঞাপন লোড হতে সমস্যা হয়েছে!", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-play"></i> ${I18N[APP_LANG].btnWatchReward}`;
    }
}

async function submitWithdrawalRequest() {
    triggerHaptic('medium');

    const num = $('pay-number')?.value.trim();
    const pts = Number($('pay-amount')?.value);
    const minPts = APP_CONFIG.minWithdrawPoints || 40;

    if (!num) return showToast("মোবাইল নম্বর দিন!", "error");
    if (!pts || pts < minPts) return showToast(`নূন্যতম উত্তোলন ${formatNumber(minPts)} পয়েন্ট!`, "error");

    const btn = $('btn-submit-payout');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> যাচাই হচ্ছে...`;

    try {
        const response = await fetch(`${MASTER_API}/api/request-withdrawal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initData: window.Telegram?.WebApp?.initData || "",
                gateway: currentSelectedGateway,
                operator: (currentSelectedGateway === 'Recharge') ? selectedSimOperator : null,
                number: num,
                points: pts
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "উত্তোলন সম্পন্ন হয়নি!");
        }

        $('pay-number').value = '';
        $('pay-amount').value = '';

        userData.balancePoints = data.newBalance;
        updateUserUI();

        triggerHaptic('success');
        showToast(data.message || "উত্তোলন রিকোয়েস্ট সফল হয়েছে!", "success");
        switchPayoutInnerTab('history');

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = I18N[APP_LANG].btnSubmitPayout;
    }
}

async function checkTelegramMembershipRealtime(userId) {
    if (!userId) return { isMember: false };
    try {
        const res = await fetch(`${MASTER_API}/api/check-membership?userId=${userId}`);
        return res.ok ? await res.json() : { isMember: false };
    } catch { return { isMember: false }; }
}

// চ্যানেল ভেরিফিকেশন (একবার ভেরিফাই হলে পারমানেন্টলি সেভ থাকবে)
async function verifyTelegramChannelJoin() {
    triggerHaptic('medium');
    const btn = $('btn-hub-verify-tg');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> যাচাই হচ্ছে...`;
    }

    try {
        const res = await checkTelegramMembershipRealtime(currentUser?.id);
        if (res && res.isMember) {
            isTgMemberVerified = true;
            localStorage.setItem('tg_member_verified', 'true'); // চিরস্থায়ী সংরক্ষণ
            updateEarnHubLockUI();
            if ($('telegram-mandatory-modal')) $('telegram-mandatory-modal').style.display = 'none';
            updateTelegramBackButtonState();
            showToast("চ্যানেল ভেরিফিকেশন সফল হয়েছে!", "success");
        } else {
            isTgMemberVerified = false;
            localStorage.removeItem('tg_member_verified');
            updateEarnHubLockUI();
            showToast("আপনি এখনো চ্যানেলে যুক্ত হননি বা লিভ নিয়েছেন!", "error");
        }
    } catch(e) {
        showToast("ভেরিফিকেশনে সমস্যা হয়েছে, আবার চেষ্টা করুন!", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-check-double"></i> ${I18N[APP_LANG].hubVerifyBtnTxt}`;
        }
    }
}

// ব্যাকগ্রাউন্ডে নিশ্চিত করা যে ইউজার চ্যানেল থেকে লিভ নিয়েছে কি না
async function syncTelegramMembershipStatus() {
    if (!currentUser?.id) return;
    try {
        const res = await checkTelegramMembershipRealtime(currentUser.id);
        if (res && res.isMember) {
            isTgMemberVerified = true;
            localStorage.setItem('tg_member_verified', 'true');
        } else {
            isTgMemberVerified = false;
            localStorage.removeItem('tg_member_verified'); // লিভ নিলে ভেরিফিকেশন বাতিল
        }
    } catch (e) {
        // নেটওয়ার্ক ইস্যু হলে পূর্বের লোকাল স্টোরেজের স্টেট বহাল থাকবে
    }
    updateEarnHubLockUI();
}

function goToTelegramChannel() {
    if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(APP_CONFIG.telegramChannel);
    } else {
        window.open(APP_CONFIG.telegramChannel, '_blank');
    }
}

function openTelegramMandatoryModal() {
    $('telegram-mandatory-modal').style.display = 'flex';
    updateTelegramBackButtonState();
}

// =================== শেয়ার ও কপি ফাংশন ===================
function copyReferCode() {
    navigator.clipboard?.writeText(String(currentUser?.id || ''));
    showToast("রেফারেল কোড কপি হয়েছে!", "success");
}

function copyReferLink() {
    const url = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${currentUser?.id || ''}`;
    navigator.clipboard?.writeText(url);
    showToast("রেফারেল লিংক কপি হয়েছে!", "success");
}

function shareReferralLink() {
    const url = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${currentUser?.id || ''}`;
    if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("এইচডি মুভি দেখুন ও টাকা আয় করুন!")}`);
    } else {
        copyReferLink();
    }
}

function shareVideoItem(event, videoId, encodedTitle) {
    event?.stopPropagation();
    const url = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=vid_${videoId}`;
    const msg = `🔥 ${decodeURIComponent(encodedTitle || 'ভিডিও')} সরাসরি দেখুন এখনই!`;
    if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`);
    } else {
        navigator.clipboard?.writeText(url);
        showToast("ভিডিও লিংক কপি হয়েছে!", "success");
    }
}

// =================== অ্যাড হাব ও ভিউ হ্যান্ডলার ===================
function updateEarnHubLockUI() {
    const hubView = $('earn-hub-view');
    const lock = $('earn-hub-lock-overlay');
    const cards = $('earn-hub-grid-cards');
    const tgBanner = $('earn-hub-tg-banner');
    const statusBadge = $('hub-verification-status-badge');

    if (hubView) {
        hubView.classList.toggle('earn-hub-unlocked', isTgMemberVerified);
    }

    if (statusBadge) {
        if (isTgMemberVerified) {
            statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${I18N[APP_LANG].hubVerifiedBadge}`;
            statusBadge.style.background = 'rgba(0, 242, 96, 0.15)';
            statusBadge.style.color = '#00f260';
            statusBadge.style.borderColor = '#00f260';
        } else {
            statusBadge.innerHTML = `<i class="fa-solid fa-lock"></i> ${I18N[APP_LANG].hubUnverifiedBadge}`;
            statusBadge.style.background = 'rgba(255, 8, 68, 0.15)';
            statusBadge.style.color = '#ff0844';
            statusBadge.style.borderColor = '#ff0844';
        }
    }

    if (lock && cards) {
        if (isTgMemberVerified) {
            lock.style.display = 'none';
            if (tgBanner) tgBanner.style.display = 'none';
            cards.style.filter = 'none';
            cards.style.opacity = '1';
            cards.style.pointerEvents = 'auto';
        } else {
            lock.style.display = 'flex';
            if (tgBanner) tgBanner.style.display = 'block';
            cards.style.filter = 'blur(6px)';
            cards.style.opacity = '0.4';
            cards.style.pointerEvents = 'none';
        }
    }
}

function openEarnHubView() {
    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('video-unlock-detail-view').style.display = 'none';
    $('payout-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    $('main-header').style.display = 'none';
    $('earn-hub-view').style.display = 'block';
    
    // তাৎক্ষণিক পূর্বের স্টেট দেখাবে এবং ব্যাকগ্রাউন্ডে ভেরিফাই নিশ্চিত করবে
    updateEarnHubLockUI();
    syncTelegramMembershipStatus();

    updateTelegramBackButtonState();
}

function closeEarnHubView() {
    $('earn-hub-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if ($('tab-' + currentActiveTab)) $('tab-' + currentActiveTab).style.display = 'block';
    updateTelegramBackButtonState();
}

function openDedicatedAdScreen(network) {
    if (!isTgMemberVerified) {
        showToast("প্রথমে চ্যানেলে জয়েন হয়ে ভেরিফাই সম্পন্ন করুন!", "error");
        return;
    }
    activeDedicatedNetwork = network;
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'block';
    if ($('ded-screen-title')) $('ded-screen-title').innerText = network === 'adsgram' ? 'Adsgram Ads' : 'Monetag Ads';
    updateDedicatedAdScreenUI();
    updateTelegramBackButtonState();
}

function closeDedicatedAdScreen() {
    $('dedicated-ad-view').style.display = 'none';
    openEarnHubView();
}

function updateDedicatedAdScreenUI() {
    const pts = userData.balancePoints ?? 0;
    const watched = userData.dailyAdsWatched || 0;
    const limit = (activeDedicatedNetwork === 'adsgram' ? APP_CONFIG.adsgramDailyLimit : APP_CONFIG.monetagDailyLimit) || 10;
    const reward = (activeDedicatedNetwork === 'adsgram' ? APP_CONFIG.adsgramRewardPoints : APP_CONFIG.monetagRewardPoints) || 2;
    const remaining = Math.max(0, limit - watched);
    const percent = Math.min(100, Math.round((watched / limit) * 100));

    if ($('ded-stat-balance')) $('ded-stat-balance').innerText = formatNumber(pts);
    if ($('ded-stat-reward')) $('ded-stat-reward').innerText = formatNumber(reward);
    if ($('ded-stat-watched')) $('ded-stat-watched').innerText = formatNumber(watched);
    if ($('ded-stat-limit')) $('ded-stat-limit').innerText = formatNumber(limit);

    // নিচের সেটিংস কার্ড ও প্রগ্রেস বার লাইভ আপডেট
    if ($('ded-row-reward')) $('ded-row-reward').innerText = `${formatNumber(reward)} ${I18N[APP_LANG].unitPoints}`;
    if ($('ded-row-limit')) $('ded-row-limit').innerText = formatNumber(limit);
    if ($('ded-row-remaining')) $('ded-row-remaining').innerText = formatNumber(remaining);
    if ($('ded-progress-bar')) $('ded-progress-bar').style.width = `${percent}%`;
    if ($('ded-progress-text')) $('ded-progress-text').innerText = `${formatNumber(watched)} / ${formatNumber(limit)} ${I18N[APP_LANG].doneToday}`;

    const btn = $('btn-watch-dedicated-ad');
    if (btn) {
        if (remaining <= 0) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${I18N[APP_LANG].doneToday}`;
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerHTML = `<i class="fa-solid fa-play"></i> ${I18N[APP_LANG].btnWatchReward}`;
        }
    }
}

// =================== উইথড্র স্ক্রিন ও হিস্টোরি ===================
function selectSimOperator(operator, el) {
    selectedSimOperator = operator;
    document.querySelectorAll('.sim-opt-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
}

function calculateWithdrawTakaPreview() {
    const pts = Number($('pay-amount')?.value) || 0;
    const tag = $('payout-live-calc-tag');
    if (tag) tag.innerText = pts > 0 ? `= ${(pts * 0.3).toFixed(2)} ৳` : '';
}

function selectGateway(gw) {
    currentSelectedGateway = gw;
    ['bKash', 'Nagad', 'Recharge'].forEach(g => $(`gw-card-${g}`)?.classList.toggle('active', g === gw));
    if ($('sim-operator-container')) $('sim-operator-container').style.display = (gw === 'Recharge') ? 'block' : 'none';

    const minPts = gw === 'Recharge' ? (APP_CONFIG.minWithdrawRecharge || 40) : (gw === 'Nagad' ? (APP_CONFIG.minWithdrawNagad || 100) : (APP_CONFIG.minWithdrawBkash || 100));
    const minTk = Math.round(minPts * (APP_CONFIG.pointsToTakaRate || 0.3));
    if ($('payout-min-limit-alert')) {
        $('payout-min-limit-alert').innerText = `নূন্যতম উত্তোলন: ${formatNumber(minPts)} পয়েন্ট (${formatNumber(minTk)} ৳)`;
    }
}

function openPayoutView() {
    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('video-unlock-detail-view').style.display = 'none';
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    $('main-header').style.display = 'none';
    $('payout-view').style.display = 'block';
    updateUserUI();
    selectGateway(currentSelectedGateway);
    updateTelegramBackButtonState();
}

function closePayoutView() {
    $('payout-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if ($('tab-' + currentActiveTab)) $('tab-' + currentActiveTab).style.display = 'block';
    updateTelegramBackButtonState();
}

async function loadWithdrawalHistory() {
    const list = $('payout-history-list');
    if (!db || !currentUser?.id || !list) return;
    list.innerHTML = `<div style="text-align:center; padding:18px; color:#8ba2c4;"><i class="fa-solid fa-spinner fa-spin"></i> লোড হচ্ছে...</div>`;

    try {
        const snap = await db.collection("withdrawals").where("userId", "==", String(currentUser.id)).limit(20).get();
        if (snap.empty) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#8ba2c4;">কোনো হিস্টোরি পাওয়া যায়নি!</div>`;
            return;
        }

        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

        list.innerHTML = items.map(item => `
            <div class="history-card-item">
                <div>
                    <h5 style="color:#fff; font-size:14px; margin-bottom:3px;">${item.gateway} - ${item.number}</h5>
                    <small style="color:#8ba2c4;">${formatNumber(item.points)} পয়েন্ট</small>
                </div>
                <div style="text-align:right;">
                    <div style="color:#00f260; font-weight:900;">৳ ${formatNumber(item.amountBDT)}</div>
                    <span class="hci-status-badge status-${(item.status || 'pending').toLowerCase()}">${item.status}</span>
                </div>
            </div>
        `).join('');
    } catch {
        list.innerHTML = `<div style="text-align:center; padding:18px; color:#ff0844;">হিস্টোরি লোড হতে সমস্যা হয়েছে</div>`;
    }
}

function switchPayoutInnerTab(tab) {
    const isForm = tab === 'form';
    $('tab-btn-withdraw-form')?.classList.toggle('active', isForm);
    $('tab-btn-withdraw-history')?.classList.toggle('active', !isForm);
    if ($('payout-form-view')) $('payout-form-view').style.display = isForm ? 'block' : 'none';
    if ($('payout-history-view')) $('payout-history-view').style.display = isForm ? 'none' : 'block';
    if (!isForm) loadWithdrawalHistory();
}

// =================== ভিডিও ও স্ট্রিমিং হ্যান্ডলার ===================
function extractVideoLinks(data) {
    let rawList = [];
    let src = data.links || data.urls || data.parts || data.url || '';
    if (typeof src === 'string' && src.trim()) rawList = src.split(',').map(s => s.trim()).filter(Boolean);
    else if (Array.isArray(src)) rawList = src;

    return rawList.map((item, idx) => ({
        name: `${I18N[APP_LANG].partPrefix} ${formatNumber(idx + 1)}`,
        url: typeof item === 'string' ? item : (item.url || ''),
        duration: data.duration || 'HD'
    }));
}

function formatEmbedOrStreamUrl(rawUrl) {
    if (!rawUrl) return "";
    let u = rawUrl.trim();
    if (u.includes('youtube.com/watch?v=')) {
        const id = u.split('v=')[1]?.split('&')[0];
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (u.includes('youtu.be/')) {
        const id = u.split('youtu.be/')[1]?.split('?')[0];
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (u.includes('drive.google.com/file/d/')) {
        const id = u.split('/d/')[1]?.split('/')[0];
        if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
    return u;
}

function isSeriesVideo(v) {
    const s = ((v.section || v.type || '') + '').toLowerCase().trim();
    return s === 'series' || s === 'সিরিজ' || s === 'web series' || s === 'ওয়েব সিরিজ';
}
function isAdultVideo(v) {
    const s = ((v.section || v.type || '') + '').toLowerCase().trim();
    return s === 'adult' || s === 'এন্ডাল' || s === '18+' || s === 'hot';
}
function isMovieVideo(v) { 
    return !isSeriesVideo(v) && !isAdultVideo(v); 
}

// মেয়াদ উত্তীর্ণ হলে স্বয়ংক্রিয় ক্লিনআপ এবং প্রগ্রেস বার রিসেট
function checkAndCleanExpiredUnlock(videoId) {
    if (!videoId) return false;
    if (videoUnlockExpiryMap[videoId]) {
        if (Date.now() >= videoUnlockExpiryMap[videoId]) {
            delete videoUnlockExpiryMap[videoId];
            videoAdProgressMap[videoId] = 0; // ১০০% নিশ্চিত প্রগ্রেস বার ০ হবে
            saveUnlockProgress();
            return false;
        }
        return true;
    }
    return false;
}

function isVideoCurrentlyUnlocked(videoId) {
    return checkAndCleanExpiredUnlock(videoId);
}

function loadSavedProgress() {
    try { videoUnlockExpiryMap = JSON.parse(localStorage.getItem('user_video_unlock_expiry') || '{}'); } catch(e) {}
    try { videoAdProgressMap = JSON.parse(localStorage.getItem('user_video_ad_progress') || '{}'); } catch(e) {}
}

function saveUnlockProgress() {
    try {
        localStorage.setItem('user_video_unlock_expiry', JSON.stringify(videoUnlockExpiryMap));
        localStorage.setItem('user_video_ad_progress', JSON.stringify(videoAdProgressMap));
    } catch(e) {}
}

function executeUnlockSuccess(type) {
    showToast(APP_LANG === 'bn' ? "ভিডিও আনলক সফল হয়েছে!" : "Video unlocked!", "success");
    updateUnlockProgressUI();
    setTimeout(() => playMovie(activeDetailVideo), 800);
}

// লাইভ কাউন্টডাউন এবং মেয়াদ শেষ হওয়ার সাথে সাথে প্রগ্রেস বার রিসেট
function startExpiryCountdown(vId) {
    if (countdownTimerInterval) clearInterval(countdownTimerInterval);
    const timer = $('unlock-remaining-countdown');

    const update = () => {
        const diff = (videoUnlockExpiryMap[vId] || 0) - Date.now();
        if (diff <= 0) {
            clearInterval(countdownTimerInterval);
            delete videoUnlockExpiryMap[vId];
            videoAdProgressMap[vId] = 0; // মেয়াদ শেষ হলে প্রগ্রেস সাথে সাথে রিসেট
            saveUnlockProgress();
            updateUnlockProgressUI();
            showToast(APP_LANG === 'bn' ? "ভিডিওর আনলক মেয়াদ শেষ হয়েছে!" : "Unlock duration expired!", "info");
            return;
        }
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        if (timer) timer.innerText = `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
    };

    update();
    countdownTimerInterval = setInterval(update, 1000);
}

// আনলক বাটন ও UI প্রগ্রেস বার আপডেট (রিসেট বাগ ফিক্সড)
function updateUnlockProgressUI() {
    if (!activeDetailVideo) return;
    const vId = activeDetailVideo.id;
    const isUnlocked = isVideoCurrentlyUnlocked(vId);
    const timerCard = $('unlock-status-timer-card');
    const adBtn = $('btn-unlock-ad-step');
    const pointBtn = $('btn-unlock-point-step');

    const total = APP_CONFIG.unlockAdCount || 3;

    // যদি আনলক না থাকে অথচ কোনো কারণে অ্যাড ৩/৩ হয়ে ছিল, তবে সাথে সাথে ০ তে রিসেট হবে
    if (!isUnlocked && (videoAdProgressMap[vId] || 0) >= total) {
        videoAdProgressMap[vId] = 0;
        saveUnlockProgress();
    }

    const done = videoAdProgressMap[vId] || 0;

    if ($('ui-point-cost-preview')) $('ui-point-cost-preview').innerHTML = `${formatNumber(APP_CONFIG.unlockPointsCost || 5)} <small>pt</small>`;
    if ($('ui-user-points-count')) $('ui-user-points-count').innerText = formatNumber(userData.balancePoints || 0);
    if ($('ui-req-ads-count')) $('ui-req-ads-count').innerText = formatNumber(total);
    if ($('ui-remaining-ads-count')) $('ui-remaining-ads-count').innerText = formatNumber(isUnlocked ? 0 : Math.max(0, total - done));

    if (isUnlocked) {
        if (timerCard) timerCard.style.display = 'flex';
        startExpiryCountdown(vId);
        if ($('unlock-p-bar')) $('unlock-p-bar').style.width = '100%';
        if ($('unlock-ratio-txt')) $('unlock-ratio-txt').innerText = `${formatNumber(total)}/${formatNumber(total)}`;
        
        if (pointBtn) { 
            pointBtn.disabled = true; 
            pointBtn.style.opacity = '0.5';
            pointBtn.classList.remove('btn-animated-shine');
        }

        if (adBtn) {
            adBtn.disabled = false;
            adBtn.classList.add('btn-animated-shine');
            adBtn.innerHTML = `
                <div class="btn-inner-content">
                    <i class="fa-solid fa-circle-play"></i> 
                    <span>ভিডিও চালু করুন</span>
                </div>
                <span class="btn-duration-tag" style="background:#00f260; color:#050814; font-weight:900;"><i class="fa-solid fa-check"></i> আনলকড</span>
            `;
        }
    } else {
        if (timerCard) timerCard.style.display = 'none';
        if (countdownTimerInterval) clearInterval(countdownTimerInterval);

        if (pointBtn) { 
            pointBtn.disabled = false; 
            pointBtn.style.opacity = '1';
            pointBtn.classList.add('btn-animated-shine');
            pointBtn.innerHTML = `
                <div class="btn-inner-content">
                    <i class="fa-solid fa-coins"></i> 
                    <span id="ui-point-unlock-btn-txt">${I18N[APP_LANG].btnPointUnlock}</span>
                </div>
                <span class="btn-duration-tag duration-tag-gold" id="ui-point-duration-badge"><i class="fa-solid fa-bolt"></i> ২৪ ঘণ্টার ফুল এক্সেস</span>
            `;
        }

        // প্রগ্রেস পার্সেন্টেজ হিসাব
        const p = Math.min(100, Math.round((done / total) * 100));
        if ($('unlock-p-bar')) $('unlock-p-bar').style.width = `${p}%`;
        if ($('unlock-ratio-txt')) $('unlock-ratio-txt').innerText = `${formatNumber(done)}/${formatNumber(total)}`;

        if (adBtn) {
            adBtn.disabled = false;
            adBtn.classList.add('btn-animated-shine');
            adBtn.innerHTML = `
                <div class="btn-inner-content">
                    <i class="fa-solid fa-film"></i> 
                    <span>বিজ্ঞাপন দেখে ফ্রিতে আনলক (${formatNumber(done)}/${formatNumber(total)})</span>
                </div>
                <span class="btn-duration-tag" id="ui-ad-duration-badge"><i class="fa-regular fa-clock"></i> ২ ঘণ্টার জন্য ফ্রি</span>
            `;
        }
    }
}

function toggleDetailVideoLike() {
    if (!activeDetailVideo) return;
    const vId = activeDetailVideo.id;
    const isLiked = !userLikedVideos[vId];
    userLikedVideos[vId] = !isLiked;
    activeDetailVideo.likes = Math.max(0, (activeDetailVideo.likes || 0) + (isLiked ? -1 : 1));
    localStorage.setItem('app_user_liked_vids', JSON.stringify(userLikedVideos));
    
    if ($('detail-likes-txt')) $('detail-likes-txt').innerText = `${formatNumber(activeDetailVideo.likes)} ${I18N[APP_LANG].likesWord}`;
    $('detail-like-btn-action')?.classList.toggle('active-liked', !isLiked);
    
    const cardLikeEl = $(`card-like-cnt-${vId}`);
    if (cardLikeEl) cardLikeEl.innerText = formatNumber(activeDetailVideo.likes);
    $(`card-like-pill-${vId}`)?.classList.toggle('active-liked', !isLiked);

    if (db) db.collection("videos").doc(vId).update({ likes: firebase.firestore.FieldValue.increment(isLiked ? -1 : 1) }).catch(()=>{});
}

function renderPlayerParts(links, activeIndex) {
    const container = $('player-parts-container'), scroll = $('player-parts-scroll');
    if (!container || !scroll) return;
    if (!links || links.length <= 1) { container.style.display = 'none'; return; }

    container.style.display = 'block';
    scroll.innerHTML = links.map((it, i) => `
        <div class="player-part-pill ${i === activeIndex ? 'active' : ''}" onclick="switchPlayerPart(${i})">
            <i class="fa-solid fa-circle-play"></i> ${it.name}
        </div>
    `).join('');
}

function switchPlayerPart(idx) {
    if (!activeDetailVideo) return;
    currentPlayingPartIndex = idx;
    playMovie(activeDetailVideo);
}

async function playMovie(videoObj) {
    if (!videoObj) return;
    const links = videoObj.links || extractVideoLinks(videoObj);
    const rawTargetUrl = links[currentPlayingPartIndex || 0]?.url || videoObj.url;

    if (!rawTargetUrl) return showToast("ভিডিও লিংক পাওয়া যায়নি!", "error");

    if (rawTargetUrl.includes('t.me/') || rawTargetUrl.startsWith('tg://')) {
        if (window.Telegram?.WebApp?.openTelegramLink) {
            window.Telegram.WebApp.openTelegramLink(rawTargetUrl);
        } else {
            window.open(rawTargetUrl, '_blank');
        }
        return;
    }

    const targetUrl = formatEmbedOrStreamUrl(rawTargetUrl);
    $('web-player-title').innerText = `${videoObj.title} - ${links[currentPlayingPartIndex || 0]?.name || ''}`;
    renderPlayerParts(links, currentPlayingPartIndex);
    $('web-player-modal').style.display = 'flex';
    updateTelegramBackButtonState();

    const v = $('in-app-video-element'), f = $('in-app-iframe-element');
    if (targetUrl.includes('drive.google.com') || targetUrl.includes('youtube.com')) {
        v.style.display = 'none'; f.style.display = 'block'; f.src = targetUrl;
    } else {
        f.style.display = 'none'; v.style.display = 'block';
        if (targetUrl.includes('.m3u8') && window.Hls && Hls.isSupported()) {
            if (hlsInstance) hlsInstance.destroy();
            hlsInstance = new Hls();
            hlsInstance.loadSource(targetUrl);
            hlsInstance.attachMedia(v);
        } else {
            v.src = targetUrl;
        }
        v.play().catch(()=>{});
    }
}

function closeWebVideoPlayer() {
    const v = $('in-app-video-element'), f = $('in-app-iframe-element');
    if (v) { v.pause(); v.removeAttribute('src'); }
    if (f) f.src = "";
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    $('web-player-modal').style.display = 'none';
    updateTelegramBackButtonState();
}

// =================== সিরিজ ড্রয়ার হ্যান্ডলার ===================
let activeSeriesForDrawer = null;
function openSeriesEpisodesDrawer(seriesId) {
    const s = allLoadedVideos.find(v => v.id === seriesId);
    if (!s) return;
    activeSeriesForDrawer = s;
    if ($('series-drawer-title')) $('series-drawer-title').innerText = s.title;

    const list = $('series-episodes-list');
    list.innerHTML = "";
    $('series-drawer-modal').style.display = 'flex';
    updateTelegramBackButtonState();

    const links = s.links || extractVideoLinks(s);
    list.innerHTML = links.map((ep, idx) => `
        <div class="episode-item-card" onclick="selectEpisodeFromDrawer(${idx})">
            <div class="ep-left-wrap">
                <div class="ep-thumb-box">
                    <img src="${s.thumb}">
                    <span class="ep-badge-label">পাঠ ${formatNumber(idx + 1)}</span>
                </div>
                <div class="ep-details">
                    <h4>${s.title} - পর্ব ${formatNumber(idx + 1)}</h4>
                </div>
            </div>
            <div class="ep-arrow-btn"><i class="fa-solid fa-chevron-right"></i></div>
        </div>
    `).join('');
}

function closeSeriesDrawer() {
    $('series-drawer-modal').style.display = 'none';
    activeSeriesForDrawer = null;
    updateTelegramBackButtonState();
}

function selectEpisodeFromDrawer(epIndex) {
    if (!activeSeriesForDrawer) return;
    const s = activeSeriesForDrawer;
    closeSeriesDrawer();
    openVideoDetailView(s.id, epIndex);
}

// =================== ফিল্টার ও ক্যাটাগরি হ্যান্ডলার ===================
function renderAllCategoryChips() {
    ['movies', 'series', 'adult'].forEach(sec => {
        const tabKey = sec === 'movies' ? 'movie' : sec;
        const c = $(`${tabKey}-category-chips`);
        const sectionWrapper = $(`${tabKey}-cat-section`);

        const sectionCats = adminCreatedCategories.filter(cat => {
            const catSec = ((cat.section || cat.type || '') + '').toLowerCase().trim();
            if (catSec) {
                if (sec === 'movies') return ['movies', 'movie', 'মুভি', 'মুভিজ', 'cinema'].includes(catSec);
                if (sec === 'series') return ['series', 'সিরিজ', 'web series', 'ওয়েব সিরিজ'].includes(catSec);
                if (sec === 'adult') return ['adult', 'এন্ডাল', '18+', 'hot'].includes(catSec);
                return false;
            }
            const catName = ((cat.name || cat.title || '') + '').toLowerCase().trim();
            if (!catName) return false;
            const vids = allLoadedVideos.filter(sec === 'movies' ? isMovieVideo : (sec === 'series' ? isSeriesVideo : isAdultVideo));
            return vids.some(v => {
                const cName = Array.isArray(v.category) ? v.category.join(' ').toLowerCase() : String(v.category || '').toLowerCase();
                return cName.includes(catName);
            });
        });

        if (sectionWrapper) {
            sectionWrapper.style.display = sectionCats.length > 0 ? 'block' : 'none';
        }

        if (c) {
            c.innerHTML = `
                <div class="cat-filter-pill ${activeSelectedCategory[sec] === 'all' ? 'active' : ''}" onclick="selectCategoryChip('${sec}', 'all', this)">
                    <i class="fa-solid fa-shapes"></i> <span>${APP_LANG === 'bn' ? 'সকল' : 'All'}</span>
                </div>
            `;

            sectionCats.forEach(cat => {
                const name = cat.name || cat.title || '';
                if (!name) return;
                const isActive = activeSelectedCategory[sec] === name;
                c.innerHTML += `
                    <div class="cat-filter-pill ${isActive ? 'active' : ''}" onclick="selectCategoryChip('${sec}', '${name}', this)">
                        <i class="fa-solid fa-tag"></i> <span>${name}</span>
                    </div>
                `;
            });
        }
    });
}

function selectCategoryChip(section, catName, el) {
    activeSelectedCategory[section] = catName;
    currentPageMap[section] = 1;
    if (el?.parentElement) {
        el.parentElement.querySelectorAll('.cat-filter-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
    }
    filterVideosUI();
}

function handleHeroSectionClick(cardEl, tag, section) {
    cardEl.closest('.hero-banner-grid').querySelectorAll('.hero-card').forEach(c => c.classList.remove('active-animated'));
    cardEl.classList.add('active-animated');
    activeHeroFilterTags[section] = tag;
    currentPageMap[section] = 1;
    filterVideosUI();
}

function toggleSearchBox() {
    const s = $('search-container');
    if (s) {
        s.style.display = s.style.display === 'none' ? 'block' : 'none';
        if (s.style.display === 'block') $('video-search-input')?.focus();
    }
}

function debouncedSearch() {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
        currentPageMap.movies = 1; currentPageMap.series = 1; currentPageMap.adult = 1;
        filterVideosUI();
    }, 200);
}

function filterVideosUI() {
    const q = ($('video-search-input')?.value || '').toLowerCase().trim();

    const filterSection = (sectionName, baseFilterFn) => {
        let list = allLoadedVideos.filter(baseFilterFn);

        const currentCat = activeSelectedCategory[sectionName];
        if (currentCat && currentCat !== 'all') {
            list = list.filter(v => {
                const c = Array.isArray(v.category) ? v.category.join(' ').toLowerCase() : String(v.category || '').toLowerCase();
                return c.includes(currentCat.toLowerCase());
            });
        }

        const tag = activeHeroFilterTags[sectionName];
        if (['trending', 'top_rated', 'adult_hot'].includes(tag)) {
            list = [...list].sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)));
        }

        if (q) list = list.filter(v => (v.title || '').toLowerCase().includes(q));
        return list;
    };

    renderVideosForGrid('movies', filterSection('movies', isMovieVideo));
    renderVideosForGrid('series', filterSection('series', isSeriesVideo));
    renderVideosForGrid('adult', filterSection('adult', isAdultVideo));
}

function renderPaginationUI(type, totalPages, currentPage) {
    const c = $(`${type === 'movies' ? 'movie' : type}-pagination`);
    if (!c) return;
    if (totalPages <= 1) { c.style.display = 'none'; c.innerHTML = ''; return; }

    c.style.display = 'flex';
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<div class="page-pill-btn ${i === currentPage ? 'active' : ''}" onclick="goToPaginationPage('${type}', ${i})">${formatNumber(i)}</div>`;
    }
    c.innerHTML = html;
}

function goToPaginationPage(type, pageNum) {
    currentPageMap[type] = pageNum;
    filterVideosUI();
}

// ভিডিও গ্রিড রেন্ডারার
function renderVideosForGrid(type, list) {
    const grid = $(`${type === 'movies' ? 'movie' : type}-list-grid`);
    if (!grid) return;
    if (!list || !list.length) { 
        grid.innerHTML = `<div class="empty-video-card">${I18N[APP_LANG].emptyList}</div>`;
        renderPaginationUI(type, 0, 1);
        return; 
    }

    const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
    currentPageMap[type] = Math.min(Math.max(1, currentPageMap[type]), totalPages);
    const curPage = currentPageMap[type];
    const visible = list.slice((curPage - 1) * ITEMS_PER_PAGE, curPage * ITEMS_PER_PAGE);

    renderPaginationUI(type, totalPages, curPage);

    grid.innerHTML = visible.map(v => {
        const isLiked = !!userLikedVideos[v.id];
        const timeAgoText = formatTimeAgo(v.createdAt || v.timestamp || v.date);

        return `
            <div id="vid-card-${v.id}" class="series-card-item" onclick="${type === 'series' ? `openSeriesEpisodesDrawer('${v.id}')` : `openVideoDetailView('${v.id}')`}">
                <div class="series-thumb-container">
                    <img src="${v.thumb}" loading="lazy">
                    <div class="series-thumb-badge-blue">${v.duration || 'HD'}</div>
                </div>
                <div class="series-info-body">
                    <div class="series-title-row">
                        <div class="series-main-title">${v.title}</div>
                        <div class="series-share-btn" onclick="shareVideoItem(event, '${v.id}', '${encodeURIComponent(v.title)}')"><i class="fa-solid fa-share-nodes"></i></div>
                    </div>
                    
                    <div class="series-meta-row">
                        <div class="series-chips-group">
                            <span class="series-chip-pill ${isLiked ? 'active-liked' : ''}" id="card-like-pill-${v.id}">
                                <i class="fa-solid fa-thumbs-up"></i> <span id="card-like-cnt-${v.id}">${formatNumber(v.likes || 0)}</span>
                            </span>
                            <span class="series-chip-pill">
                                <i class="fa-solid fa-eye"></i> <span>${formatNumber(v.views || 0)}</span>
                            </span>
                        </div>
                        <div class="series-time-ago">
                            <i class="fa-solid fa-circle"></i> <span>${timeAgoText}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openVideoDetailView(videoId, epIndex = 0) {
    const video = allLoadedVideos.find(v => v.id === videoId);
    if (!video) return;

    lastListScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    lastOpenedVideoId = videoId;

    activeDetailVideo = video;
    currentPlayingPartIndex = epIndex;

    const isAd = isAdultVideo(video) || currentActiveTab === 'adult';
    const isSer = isSeriesVideo(video) || currentActiveTab === 'series';
    const label = isAd ? 'এন্ডাল' : (isSer ? 'সিরিজ' : 'মুভি');

    if ($('detail-file-title')) $('detail-file-title').innerText = video.title;
    if ($('detail-poster-img')) $('detail-poster-img').src = video.thumb;
    if ($('detail-views-txt')) $('detail-views-txt').innerText = `${formatNumber(video.views || 0)} ${I18N[APP_LANG].viewsWord}`;
    if ($('detail-likes-txt')) $('detail-likes-txt').innerText = `${formatNumber(video.likes || 0)} ${I18N[APP_LANG].likesWord}`;
    if ($('detail-category-badge')) $('detail-category-badge').innerHTML = `<i class="fa-solid fa-film"></i> ${label}`;
    if ($('detail-category-badge-text')) $('detail-category-badge-text').innerText = `${label} কনটেন্ট`;
    if ($('detail-duration-badge')) $('detail-duration-badge').innerHTML = `<i class="fa-regular fa-clock"></i> ${video.duration || 'HD'}`;

    const isLiked = !!userLikedVideos[video.id];
    $('detail-like-btn-action')?.classList.toggle('active-liked', isLiked);

    updateUnlockProgressUI();

    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('main-header').style.display = 'none';
    $('video-unlock-detail-view').style.display = 'block';
    updateTelegramBackButtonState();
    window.scrollTo(0, 0);
}

function closeVideoDetailView() {
    if (countdownTimerInterval) clearInterval(countdownTimerInterval);
    $('video-unlock-detail-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if ($('tab-' + currentActiveTab)) $('tab-' + currentActiveTab).style.display = 'block';
    updateTelegramBackButtonState();

    setTimeout(() => {
        if (lastOpenedVideoId) {
            const cardEl = document.getElementById(`vid-card-${lastOpenedVideoId}`);
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'auto', block: 'center' });
                return;
            }
        }
        window.scrollTo(0, lastListScrollY);
    }, 20);
}

function switchNavTab(tabName, el) {
    triggerHaptic('light');
    currentActiveTab = tabName;

    $('video-unlock-detail-view').style.display = 'none';
    $('payout-view').style.display = 'none';
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    $('main-header').style.display = 'block';

    if (tabName === 'adult' && localStorage.getItem('adult_18_confirmed_permanent') !== 'true') {
        $('adult-warning-modal').style.display = 'flex';
    }

    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    if ($('tab-' + tabName)) $('tab-' + tabName).style.display = 'block';
    
    if (el) el.classList.add('active');
    else {
        const navs = document.querySelectorAll('.bottom-nav .nav-item');
        const idx = { 'movies': 0, 'series': 1, 'adult': 2, 'profile': 3 }[tabName];
        if (navs[idx]) navs[idx].classList.add('active');
    }

    document.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('active-blue-grad'));
    $('drawer-nav-' + tabName)?.classList.add('active-blue-grad');

    updateTelegramBackButtonState();
}

function openVideoRulesModal() {
    renderRulesList();
    $('rules-modal').style.display = 'flex';
    updateTelegramBackButtonState();
}

function confirmAdultAge() {
    localStorage.setItem('adult_18_confirmed_permanent', 'true');
    $('adult-warning-modal').style.display = 'none';
    updateTelegramBackButtonState();
}

function declineAdultAge() {
    $('adult-warning-modal').style.display = 'none';
    switchNavTab('movies');
    updateTelegramBackButtonState();
}

function extractTelegramUser() {
    let u = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!u || !u.id) {
        document.body.innerHTML = `<div style="text-align:center; padding:50px; color:#fff;">টেলিগ্রাম থেকে অ্যাপটি চালু করুন।</div>`;
        throw new Error("Unauthorized");
    }
    return u;
}

// =================== অ্যাড ইনিশিয়ালাইজার ===================
function showMonetagAd() {
    return new Promise((resolve) => {
        const sdkName = APP_CONFIG.monetagSdkName || 'show_11928576';
        if (typeof window[sdkName] === 'function') {
            window[sdkName]().then(() => resolve({ done: true })).catch(() => resolve({ done: false }));
        } else resolve({ done: false });
    });
}

function showAdsgramAd(controller, isRewarded = true) {
    return new Promise((resolve) => {
        if (!controller) return resolve({ done: false });
        controller.show().then(res => resolve({ done: res?.done || !isRewarded })).catch(() => resolve({ done: false }));
    });
}

function initAdsgram(retry = 0) {
    if (window.Adsgram) {
        try { adsgramRewardController = window.Adsgram.init({ blockId: APP_CONFIG.adsgramRewardBlockId || "46116" }); } catch(e) {}
        try { adsgramInterstitialController = window.Adsgram.init({ blockId: APP_CONFIG.adsgramInterstitialBlockId || "int-38278" }); } catch(e) {}
    } else if (retry < 10) {
        setTimeout(() => initAdsgram(retry + 1), 500);
    }
}

// অ্যাপ বুটস্ট্র্যাপ
async function initApp() {
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    } catch(e) {}

    if (window.Telegram?.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
        setupTelegramBackButton();
    }

    try {
        currentUser = extractTelegramUser();
        $('u-profile-name').innerText = currentUser.first_name || "User";
        $('u-profile-handle').innerText = currentUser.username ? "@" + currentUser.username : "@user";
        $('u-profile-id').innerText = formatNumber(currentUser.id);
        if ($('ref-user-code')) $('ref-user-code').innerText = formatNumber(currentUser.id);
        if ($('ref-share-url-box')) $('ref-share-url-box').innerText = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${currentUser.id}`;
    } catch(e) { return; }

    loadSavedProgress();
    applyStaticTranslations();
    applyAdminConfigToUI();
    initAdsgram();

    // অ্যাপ স্টার্ট হওয়ার সাথে সাথে ব্যাকগ্রাউন্ডে নিশ্চিত হওয়া যে সে মেম্বার আছে কি না
    syncTelegramMembershipStatus();

    // ফায়ারবেস কনফিগারেশন লিসেনার
    if (db) {
        db.collection("settings").doc("app_config").onSnapshot(doc => {
            if (doc.exists) {
                APP_CONFIG = { ...APP_CONFIG, ...doc.data() };
                applyAdminConfigToUI();
            }
        });

        db.collection("categories").onSnapshot(snapshot => {
            adminCreatedCategories = snapshot.empty ? [] : snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            renderAllCategoryChips();
            filterVideosUI();
        });

        db.collection("videos").onSnapshot(snap => {
            allLoadedVideos = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    ...data,
                    thumb: data.thumb || data.thumbnail || data.poster || 'https://via.placeholder.com/600x450',
                    views: Number(data.views || 0),
                    likes: Number(data.likes || 0),
                    // সকল সম্ভাব্য তারিখ/টাইমস্ট্যাম্প ফিল্ড সাপোর্ট
                    createdAt: data.createdAt || data.timestamp || data.date || data.uploadDate || data.created_at || data.time || data.publishedAt || null,
                    links: extractVideoLinks(data)
                };
            });

            if ($('movie-total-count')) $('movie-total-count').innerText = formatNumber(allLoadedVideos.filter(isMovieVideo).length);
            if ($('series-total-count')) $('series-total-count').innerText = formatNumber(allLoadedVideos.filter(isSeriesVideo).length);
            if ($('adult-total-count')) $('adult-total-count').innerText = formatNumber(allLoadedVideos.filter(isAdultVideo).length);

            renderAllCategoryChips();
            filterVideosUI();
        });
    }

    await syncUserData();

    const preloader = $('app-preloader');
    if (preloader) {
        preloader.classList.add('hide-loader');
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
