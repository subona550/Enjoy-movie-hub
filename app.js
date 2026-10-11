const $ = id => document.getElementById(id);

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
        unlockDurationAdBadge: "২ ঘণ্টার জন্য ফ্রি", unlockDurationPtDesc: "২৪ ঘণ্টার জন্য আনলক থাকবে", btnAdWatchRemain: "বিজ্ঞাপন দেখুন", btnPointUnlock: "পয়েন্ট দিয়ে আনলক করুন",
        lblBackHome: "হোমে ফিরে যান", rulesTitle: "ভিডিও দেখার নিয়ম", rulesDoneBtn: "বুঝেছি, ধন্যবাদ", adultModalTitle: "এন্ডাল সতর্কতা ও দায়মুক্তি নোটিশ",
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
        allCat: "সকল", catFilterLabel: "ক্যাটাগরি ফিল্টার"
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
        unlockDurationAdBadge: "Free for 2 Hours", unlockDurationPtDesc: "Unlocked for 24 Hours", btnAdWatchRemain: "Watch Ad", btnPointUnlock: "Unlock with Points",
        lblBackHome: "Back to Home", rulesTitle: "Video Watching Rules", rulesDoneBtn: "Understood, Thanks", adultModalTitle: "Endal Warning & Disclaimer",
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
        allCat: "All", catFilterLabel: "Category Filter"
    }
};

let APP_CONFIG = {
    appName: "ইনজ়য় মুভিজ", 
    appHeaderBadge: "সিনেমা", 
    cloudflareStreamApi: "https://open-player-7bd4.rakibkdbb.workers.dev",
    adsgramRewardBlockId: "46116", 
    adsgramInterstitialBlockId: "int-38278",
    monetagZoneId: "11928576",
    monetagSdkName: "show_11928576",
    onclickaSpotId: "6153127",
    adsgramDailyLimit: 10,
    adsgramRewardPoints: 2,
    monetagDailyLimit: 10,
    monetagRewardPoints: 2,
    onclickaDailyLimit: 10,
    onclickaRewardPoints: 2,
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
    minSelfEarnedWithdrawRatio: 0.6, 
    adUnlockDurationHours: 2, 
    pointsUnlockDurationHours: 12, 
    maintenanceMode: false,
    maintenanceTitle: "", 
    maintenanceNotice: "", 
    withdrawNotice: "", 
    bannedTitle: "", 
    bannedDesc: "", 
    refAntiFraudCondition: "",
    enableBkash: true, 
    enableNagad: true, 
    enableRecharge: true
};

let db = null, tg = null, currentUser = null, userData = {};
let adsgramRewardController = null, adsgramInterstitialController = null;
let currentSelectedGateway = 'bKash', selectedSimOperator = 'Grameenphone';
let allLoadedVideos = [], activeDetailVideo = null, videoAdProgressMap = {}, videoUnlockExpiryMap = {};
let currentActiveTab = 'movies', currentStreamUrl = "", hlsInstance = null, currentPlayingPartIndex = 0;
let countdownTimerInterval = null, searchDebounceTimeout = null, pendingActionAfterJoin = null;
let hasHandledInitialTargetVideo = false, backButtonInitialized = false;
let activeHeroFilterTags = { adult: 'adult_new', series: 'new_series', movies: 'new_movie' };

let adminCreatedCategories = [];
let activeSelectedCategory = { movies: 'all', series: 'all', adult: 'all' };

let activeDedicatedNetwork = 'adsgram';
window.onclickaShowMethod = null;

const ITEMS_PER_PAGE = 10;
let currentPageMap = { adult: 1, series: 1, movies: 1 };

let userLikedVideos = {};
try { userLikedVideos = JSON.parse(localStorage.getItem('app_user_liked_vids') || '{}'); } catch(e) { userLikedVideos = {}; }

function getTodayBDDate() { return new Date(Date.now() + 21600000).toISOString().slice(0, 10); }

function triggerHaptic(type = 'light') {
    try {
        if (tg?.HapticFeedback) {
            if (['success', 'error', 'warning'].includes(type)) {
                tg.HapticFeedback.notificationOccurred(type);
            } else {
                const validImpacts = ['light', 'medium', 'heavy', 'rigid', 'soft'];
                tg.HapticFeedback.impactOccurred(validImpacts.includes(type) ? type : 'light');
            }
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

function getDeviceUUID() {
    let devId = localStorage.getItem('app_device_fingerprint_secure');
    if (!devId) {
        const navStr = (navigator.userAgent || '') + screen.width + screen.height + (navigator.language || '');
        let hash = 0;
        for (let i = 0; i < navStr.length; i++) hash = ((hash << 5) - hash) + navStr.charCodeAt(i) | 0;
        devId = 'dev_' + Math.abs(hash).toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('app_device_fingerprint_secure', devId);
    }
    return devId;
}

function showToast(msg, type = 'info') {
    const t = $('top-toast');
    t.className = 'top-toast show ' + (type === 'error' ? 'err' : (type === 'success' ? 'succ' : ''));
    $('toast-msg').innerText = msg;
    triggerHaptic(type === 'error' ? 'error' : (type === 'success' ? 'success' : 'light'));
    setTimeout(() => t.classList.remove('show'), 2800);
}

function toggleSidebarMenu(show) {
    triggerHaptic('light');
    $('drawer-overlay').classList.toggle('open', show);
    $('drawer-menu').classList.toggle('open', show);
    updateTelegramBackButtonState();
}

function navFromDrawer(tab) { toggleSidebarMenu(false); switchNavTab(tab); }

function changeAppLang(lang) {
    triggerHaptic('medium');
    APP_LANG = lang;
    localStorage.setItem('app_lang_choice', lang);
    $('btn-lang-bn').classList.toggle('active', lang === 'bn');
    $('btn-lang-en').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    applyStaticTranslations();
    applyAdminConfigToUI();
    renderAllCategoryChips();
    filterVideosUI();
    showToast(lang === 'bn' ? "ভাষা বাংলায় রূপান্তর করা হয়েছে" : "Language switched to English", "success");
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
        ['btn-video-rules-txt', "ভিডিও দেখার নিয়ম"], ['tag-pill-movie', t.tagMovie], ['movie-empty-card', t.emptyList],
        ['u-badge-vip', APP_LANG === 'bn' ? "ভিআইপি" : "VIP"], ['lbl-uid-prefix', t.uidPrefix], ['lbl-stat-my-points', t.lblMyPoints],
        ['lbl-stat-active-ref', t.lblActiveRef], ['profile-withdraw-title', t.profileWithdrawTitle], ['profile-withdraw-sub', t.profileWithdrawSub],
        ['btn-open-withdraw-txt', t.btnOpenWithdraw], ['profile-earn-title', t.profileEarnTitle], ['profile-earn-desc', t.profileEarnDesc],
        ['btn-profile-earn-more-txt', t.btnProfileEarnMore], ['lbl-ref-bonus', t.lblRefBonus], ['lbl-join-bonus', t.lblJoinBonus],
        ['lbl-anti-fraud', t.lblAntiFraud], ['lbl-ref-code', t.lblRefCode], ['lbl-ref-link', t.lblRefLink],
        ['btn-share-ref-txt', t.btnShareRef], ['btn-copy-ref-txt', t.btnCopyRef], 
        ['payout-page-head', t.payoutPageHead], ['payout-page-sub', t.payoutPageSub],
        ['video-unlock-notice-title', t.videoUnlockNoticeTitle], ['video-unlock-notice-desc', t.videoUnlockNoticeDesc],
        ['lbl-uac-ad-title', APP_LANG === 'bn' ? "বিজ্ঞাপন দেখে আনলক" : "Unlock by Watching Ads"], ['lbl-unlock-progress-txt', t.unlockProgressTxt],
        ['lbl-uac-point-title', APP_LANG === 'bn' ? "পয়েন্ট দিয়ে সরাসরি আনলক" : "Unlock Instantly with Points"], ['lbl-cost-txt', APP_LANG === 'bn' ? "খরচ" : "Cost"],
        ['lbl-points-unit', t.unitPoints], ['lbl-back-home-txt', t.lblBackHome], ['btn-rules-modal-close', t.rulesDoneBtn],
        ['adult-warn-title', t.adultModalTitle], ['btn-adult-decline', t.btnAdultDecline], ['tg-modal-heading', t.tgModalHeading],
        ['tg-modal-desc-txt', t.tgModalDesc], ['lbl-tab-withdraw', t.lblTabWithdraw], ['lbl-tab-history', t.lblTabHistory],
        ['lbl-cur-bal', t.lblCurBal], ['lbl-pts-unit', t.unitPoints], ['lbl-taka-equiv', t.lblTakaEquiv], ['lbl-currency-symbol', t.currencySymbol],
        ['lbl-choose-gw', t.lblChooseGw], ['gw-title-bkash', APP_LANG === 'bn' ? "বিকাশ" : "bKash"], ['gw-title-nagad', APP_LANG === 'bn' ? "নগদ" : "Nagad"],
        ['gw-title-recharge', APP_LANG === 'bn' ? "রিচার্জ" : "Recharge"], ['lbl-choose-sim', t.lblChooseSim], ['lbl-admin-notice-title', t.adminNoticeTitle],
        ['btn-submit-payout', t.btnSubmitPayout], ['btn-player-close', t.btnClose],
        ['nav-lbl-movies', t.drawerMovie], ['nav-lbl-series', t.drawerSeries], ['nav-lbl-adult', t.drawerAdult],
        ['nav-lbl-profile', APP_LANG === 'bn' ? "প্রোফাইল" : "Profile"], ['banned-title', t.bannedTitle], ['banned-desc', t.bannedDesc],
        ['maint-title', t.maintTitle], ['maint-desc', t.maintDesc],
        ['lbl-ded-stat-balance', t.lblEarnStatBal], ['lbl-ded-stat-reward', t.lblEarnStatRew],
        ['lbl-ded-stat-watched', t.lblEarnStatWatch], ['lbl-ded-stat-limit', t.lblEarnStatLim],
        ['lbl-ded-row-reward', t.lblEarnStatRew], ['lbl-ded-row-limit', t.lblEarnStatLim],
        ['lbl-ded-row-remaining', APP_LANG === 'bn' ? "আজ বাকি আছে" : "Remaining Today"],
        ['btn-watch-ded-txt', t.btnWatchReward]
    ];

    txtMap.forEach(([id, val]) => { const el = $(id); if (el && val !== undefined) el.innerText = val; });
    document.querySelectorAll('.lbl-cat-select').forEach(el => el.innerText = t.catFilterLabel);

    const htmlMap = [
        ['drawer-lang-label', `<i class="fa-solid fa-language"></i> ${t.drawerLangLabel}`],
        ['adult-badge-feature', `<i class="fa-solid fa-fire"></i> ${t.adultBadgeFeature}`],
        ['series-badge-feature', `<i class="fa-solid fa-layer-group"></i> ${t.seriesBadgeFeature}`],
        ['movie-badge-feature', `<i class="fa-solid fa-film"></i> ${t.movieBadgeFeature}`],
        ['overview-bar-title', `<i class="fa-solid fa-chart-simple"></i> ${t.overviewBarTitle}`],
        ['earn-bar-title', `<i class="fa-solid fa-bolt"></i> ${t.earnBarTitle}`],
        ['pill-badge-instant', `<i class="fa-solid fa-circle-check"></i> 3টি মাল্টিপল নেটওয়ার্ক`],
        ['pill-badge-freecoins', `<i class="fa-solid fa-coins"></i> ফ্রি পয়েন্ট`],
        ['ref-bar-title', `<i class="fa-solid fa-shield-halved"></i> ${t.refBarTitle}`],
        ['ut-title-txt', `<i class="fa-solid fa-clock"></i> ${APP_LANG === 'bn' ? 'আনলক মেয়াদের বাকি:' : 'Unlock Time Remaining:'}`],
        ['rules-modal-title', `<i class="fa-solid fa-circle-info"></i> ${t.rulesTitle}`],
        ['btn-adult-confirm', `<i class="fa-solid fa-circle-check"></i> ${t.btnAdultConfirm}`],
        ['btn-tg-join-channel', `<i class="fa-brands fa-telegram"></i> ${t.btnTgJoin}`],
        ['btn-verify-tg-status', `<i class="fa-solid fa-check-double"></i> ${t.btnTgVerify}`],
        ['btn-banned-support', `<i class="fa-brands fa-telegram"></i> ${t.bannedSupportBtn}`]
    ];
    htmlMap.forEach(([id, val]) => { const el = $(id); if (el && val !== undefined) el.innerHTML = val; });

    if ($('video-search-input')) $('video-search-input').placeholder = t.searchPlaceholder;
    if ($('pay-number')) $('pay-number').placeholder = t.inputPhonePlaceholder;
    if ($('pay-amount')) $('pay-amount').placeholder = t.inputAmountPlaceholder;

    renderRulesList();
}

function renderRulesList() {
    const l = $('rules-modal-content-list');
    if (!l) return;
    l.innerHTML = APP_LANG === 'bn' ? `
        <div><b style="color:#00f260;">১. নির্বাচন:</b> যেকোনো ভিডিও কার্ডে ক্লিক করুন।</div>
        <div><b style="color:var(--primary);">২. বিজ্ঞাপন আনলক:</b> নির্দিষ্ট অ্যাড দেখে ভিডিও ফ্রি আনলক করুন।</div>
        <div><b style="color:#ffe000;">৩. পয়েন্ট আনলক:</b> কোনো অ্যাড ছাড়া পয়েন্ট দিয়ে ২৪ ঘণ্টার জন্য আনলক করুন।</div>
        <div><b style="color:#ff0844;">৪. ডিভাইস পলিসি:</b> একই ফোনে একাধিক রেফার করা নিষিদ্ধ সাথে উত্তোলন স্বয়ংক্রিয়ভাবে বাতিল হবে।</div>
    ` : `
        <div><b style="color:#00f260;">1. Select:</b> Click on any video card to open.</div>
        <div><b style="color:var(--primary);">2. Ad Unlock:</b> Watch required ads to unlock video free.</div>
        <div><b style="color:#ffe000;">3. Point Unlock:</b> Instantly unlock for 24 hours using reward points.</div>
        <div><b style="color:#ff0844;">4. Device Policy:</b> Multiple accounts or self-referrals on the same device are strictly prohibited.</div>
    `;
}

function isGatewayEnabled(gw) {
    if (gw === 'bKash') return APP_CONFIG.enableBkash !== false && APP_CONFIG.bkashEnabled !== false;
    if (gw === 'Nagad') return APP_CONFIG.enableNagad !== false && APP_CONFIG.nagadEnabled !== false;
    if (gw === 'Recharge') return APP_CONFIG.enableRecharge !== false && APP_CONFIG.rechargeEnabled !== false;
    return true;
}

function applyAdminConfigToUI() {
    const t = I18N[APP_LANG];
    const m = $('maintenance-screen');
    if (APP_CONFIG.maintenanceMode === true) {
        m.style.display = 'flex';
        $('maint-title').innerText = APP_CONFIG.maintenanceTitle || t.maintTitle;
        $('maint-desc').innerText = APP_CONFIG.maintenanceNotice || t.maintDesc;
        return;
    } else { m.style.display = 'none'; }

    const bMin = APP_CONFIG.minWithdrawBkash || 100, nMin = APP_CONFIG.minWithdrawNagad || 100, rMin = APP_CONFIG.minWithdrawRecharge || 40;
    const rate = APP_CONFIG.pointsToTakaRate || 0.3;

    $('ui-referral-bonus-txt').innerText = `${formatNumber(APP_CONFIG.referralBonus)} ${t.unitPoints}`;
    $('ui-signup-bonus-txt').innerText = `${formatNumber(APP_CONFIG.signupBonus)} ${t.unitPoints}`;
    $('ui-cost-points-badge').innerText = formatNumber(APP_CONFIG.unlockPointsCost);
    $('ui-point-unlock-btn-txt').innerText = `${t.btnPointUnlock} (${formatNumber(APP_CONFIG.unlockPointsCost)} ${t.unitPoints})`;
    $('ui-ad-progress-desc').innerText = APP_LANG === 'bn' ? `বিজ্ঞাপন দেখে ${formatNumber(APP_CONFIG.unlockAdCount)}টি পূরণ করুন` : `Watch ${formatNumber(APP_CONFIG.unlockAdCount)} ads to complete`;
    $('ui-ad-duration-badge').innerText = APP_LANG === 'bn' ? `${formatNumber(APP_CONFIG.adUnlockDurationHours || 2)} ঘণ্টার জন্য ফ্রি` : `Free for ${formatNumber(APP_CONFIG.adUnlockDurationHours || 2)} Hours`;
    $('ui-point-duration-desc').innerText = APP_LANG === 'bn' ? `${formatNumber(APP_CONFIG.pointsUnlockDurationHours || 24)} ঘণ্টার জন্য আনলক থাকবে` : `Unlocked for ${formatNumber(APP_CONFIG.pointsUnlockDurationHours || 24)} Hours`;
    $('lbl-min-bkash').innerText = `${formatNumber(bMin)} ${t.unitPoints} (${formatNumber(Math.round(bMin * rate))}${t.currencySymbol})`;
    $('lbl-min-nagad').innerText = `${formatNumber(nMin)} ${t.unitPoints} (${formatNumber(Math.round(nMin * rate))}${t.currencySymbol})`;
    $('lbl-min-recharge').innerText = `${formatNumber(rMin)} ${t.unitPoints} (${formatNumber(Math.round(rMin * rate))}${t.currencySymbol})`;
    $('ui-min-withdraw-summary').innerText = `${t.rechargeSummaryPrefix} ${formatNumber(Math.round(rMin * rate))} ${t.currencySymbol} | ${t.bkashNagadSummaryPrefix} ${formatNumber(Math.round(bMin * rate))} ${t.currencySymbol}`;

    if ($('ui-payout-admin-notice')) $('ui-payout-admin-notice').innerText = APP_CONFIG.withdrawNotice || t.defaultWithdrawNotice;
    updateGatewaysAvailabilityUI();

    if (currentUser?.id) {
        $('ref-share-url-box').innerText = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${currentUser.id}`;
    }
    updateUserUI();
    if (activeDetailVideo) updateUnlockProgressUI();

    if ($('hub-limit-adsgram')) $('hub-limit-adsgram').innerText = `দৈনিক ${formatNumber(APP_CONFIG.adsgramDailyLimit || 10)}টি অ্যাড`;
    if ($('hub-reward-adsgram')) $('hub-reward-adsgram').innerText = `${formatNumber(APP_CONFIG.adsgramRewardPoints || 2)} pt`;
    if ($('hub-limit-monetag')) $('hub-limit-monetag').innerText = `দৈনিক ${formatNumber(APP_CONFIG.monetagDailyLimit || 10)}টি অ্যাড`;
    if ($('hub-reward-monetag')) $('hub-reward-monetag').innerText = `${formatNumber(APP_CONFIG.monetagRewardPoints || 2)} pt`;
    if ($('hub-limit-onclicka')) $('hub-limit-onclicka').innerText = `দৈনিক ${formatNumber(APP_CONFIG.onclickaDailyLimit || 10)}টি অ্যাড`;
    if ($('hub-reward-onclicka')) $('hub-reward-onclicka').innerText = `${formatNumber(APP_CONFIG.onclickaRewardPoints || 2)} pt`;

    if ($('dedicated-ad-view')?.style.display === 'block') {
        updateDedicatedAdScreenUI();
    }
}

function updateGatewaysAvailabilityUI() {
    const gws = ['bKash', 'Nagad', 'Recharge'];
    gws.forEach(g => {
        const card = $(`gw-card-${g}`), badge = $(`gw-badge-${g.toLowerCase()}`);
        const enabled = isGatewayEnabled(g);
        if (card) card.classList.toggle('gw-disabled', !enabled);
        if (badge) badge.style.display = enabled ? 'none' : 'block';
    });
    if (!isGatewayEnabled(currentSelectedGateway)) {
        const firstActive = gws.find(g => isGatewayEnabled(g));
        if (firstActive) selectGateway(firstActive);
    } else {
        selectGateway(currentSelectedGateway);
    }
}

function updateUserUI() {
    const pts = userData.balancePoints ?? (APP_CONFIG.initialPoints || 0);
    const rate = APP_CONFIG.pointsToTakaRate || 0.3;

    $('profile-points-val').innerText = formatNumber(pts);
    $('profile-ref-count').innerText = formatNumber(userData.totalReferrals ?? 0);
    $('payout-modal-pts').innerText = formatNumber(pts);
    $('payout-modal-tk').innerText = formatNumber((pts * rate).toFixed(2));
}

/* =================== AD HUB NAVIGATION =================== */
function openEarnHubView() {
    triggerHaptic('light');
    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('video-unlock-detail-view').style.display = 'none';
    $('payout-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    $('main-header').style.display = 'none';
    $('earn-hub-view').style.display = 'block';

    applyAdminConfigToUI();
    updateTelegramBackButtonState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeEarnHubView() {
    triggerHaptic('light');
    $('earn-hub-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if ($('tab-' + currentActiveTab)) $('tab-' + currentActiveTab).style.display = 'block';
    updateTelegramBackButtonState();
}

function openDedicatedAdScreen(network) {
    triggerHaptic('light');
    activeDedicatedNetwork = network;
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'block';

    const netNames = {
        adsgram: "Adsgram Ads",
        monetag: "Monetag Ads",
        onclicka: "Onclicka Ads"
    };
    $('ded-screen-title').innerText = netNames[network] || "Reward Ads";

    updateDedicatedAdScreenUI();
    updateTelegramBackButtonState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDedicatedAdScreen() {
    triggerHaptic('light');
    $('dedicated-ad-view').style.display = 'none';
    openEarnHubView();
}

function getNetworkStats(net) {
    const todayWatched = (userData.networkAdsWatched && userData.networkAdsWatched[net]) || 0;
    const limit = Number(APP_CONFIG[`${net}DailyLimit`]) || 10;
    const reward = Number(APP_CONFIG[`${net}RewardPoints`]) || 2;
    return { todayWatched, limit, reward };
}

function updateDedicatedAdScreenUI() {
    const net = activeDedicatedNetwork;
    const { todayWatched, limit, reward } = getNetworkStats(net);
    const pts = userData.balancePoints ?? 0;
    const t = I18N[APP_LANG];

    $('ded-stat-balance').innerText = formatNumber(pts);
    $('ded-stat-reward').innerText = formatNumber(reward);
    $('ded-stat-watched').innerText = formatNumber(todayWatched);
    $('ded-stat-limit').innerText = formatNumber(limit);

    $('ded-row-reward').innerText = `${formatNumber(reward)} ${t.unitPoints}`;
    $('ded-row-limit').innerText = formatNumber(limit);
    $('ded-row-remaining').innerText = formatNumber(Math.max(0, limit - todayWatched));

    const pBar = $('ded-progress-bar'), pText = $('ded-progress-text');
    if (pBar) pBar.style.width = Math.min(100, Math.round((todayWatched / limit) * 100)) + "%";
    if (pText) pText.innerText = `${formatNumber(todayWatched)} / ${formatNumber(limit)} ${t.doneToday}`;
}

function initOnclickaTma() {
    if (window.initCdTma) {
        try {
            window.initCdTma({ id: APP_CONFIG.onclickaSpotId || 'Your Spot ID' })
                .then(show => {
                    window.onclickaShowMethod = show;
                    window.show = show;
                })
                .catch(e => console.log(e));
        } catch (err) {
            console.log(err);
        }
    }
}

function showOnclickaAd() {
    return new Promise((resolve, reject) => {
        const showFn = window.onclickaShowMethod || window.show;
        if (typeof showFn === 'function') {
            showFn()
                .then(() => resolve({ done:true, network: 'onclicka' }))
                .catch(err => reject(err));
        } else if (window.initCdTma) {
            window.initCdTma({ id: APP_CONFIG.onclickaSpotId || 'Your Spot ID' })
                .then(show => {
                    window.onclickaShowMethod = show;
                    window.show = show;
                    return show();
                })
                .then(() => resolve({ done: true, network: 'onclicka' }))
                .catch(err => reject(err));
        } else {
            reject(new Error("Onclicka TMA SDK is not loaded"));
        }
    });
}

async function watchSpecificNetworkAd() {
    const btn = $('btn-watch-dedicated-ad');
    if (!btn || btn.classList.contains('btn-disabled-state') || btn.disabled) return;
    triggerHaptic('medium');

    const net = activeDedicatedNetwork;
    const { todayWatched, limit, reward } = getNetworkStats(net);

    if (todayWatched >= limit) {
        return showToast(APP_LANG === 'bn' ? "আজকের লিমিট শেষ! আগামীকাল আবার চেষ্টা করুন।" : "Daily limit reached! Try again tomorrow.", "error");
    }

    btn.classList.add('btn-disabled-state');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'বিজ্ঞাপন লোড হচ্ছে...' : 'Loading ad...'}`;

    try {
        let res = null;
        if (net === 'adsgram') res = await showAdsgramAd(adsgramRewardController || adsgramInterstitialController, true);
        else if (net === 'monetag') res = await showMonetagAd();
        else if (net === 'onclicka') res = await showOnclickaAd();

        if (res && (res.done === true || res === true)) {
            triggerHaptic('success');
            const todayStr = getTodayBDDate();

            if (!userData.networkAdsWatched) userData.networkAdsWatched = {};
            userData.networkAdsWatched[net] = (userData.networkAdsWatched[net] || 0) + 1;
            userData.dailyAdsWatched = (userData.dailyAdsWatched || 0) + 1;
            userData.balancePoints = (userData.balancePoints || 0) + reward;
            userData.selfEarnedPoints = (userData.selfEarnedPoints || 0) + reward;

            if (db && currentUser?.id) {
                const userRef = db.collection("users").doc(String(currentUser.id));
                await userRef.update({
                    balancePoints: firebase.firestore.FieldValue.increment(reward),
                    selfEarnedPoints: firebase.firestore.FieldValue.increment(reward),
                    dailyAdsWatched: firebase.firestore.FieldValue.increment(1),
                    [`networkAdsWatched.${net}`]: firebase.firestore.FieldValue.increment(1),
                    lastAdDate: todayStr
                }).catch(()=>{});

                const totalSeen = (userData.networkAdsWatched.adsgram || 0) + (userData.networkAdsWatched.monetag || 0) + (userData.networkAdsWatched.onclicka || 0);
                if (userData.referredBy && !userData.referralActivated && !userData.isSameDeviceFraud && totalSeen >= 3) {
                    await db.collection("users").doc(String(userData.referredBy)).update({
                        balancePoints: firebase.firestore.FieldValue.increment(APP_CONFIG.referralBonus || 20),
                        referralEarnedPoints: firebase.firestore.FieldValue.increment(APP_CONFIG.referralBonus || 20),
                        totalReferrals: firebase.firestore.FieldValue.increment(1)
                    });
                    await userRef.update({ referralActivated: true });
                }
            }

            if (window.confetti) window.confetti();
            showToast(APP_LANG === 'bn' ? `🎉 আপনি ${formatNumber(reward)} পয়েন্ট পেয়েছেন!` : `🎉 You earned ${formatNumber(reward)} points!`, "success");
            updateDedicatedAdScreenUI();
            updateUserUI();
        } else {
            showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন সম্পূর্ণ না দেখলে পয়েন্ট যোগ হবে না!" : "Watch full ad to earn points!", "error");
        }
    } catch (err) {
        showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন লোড হতে ব্যর্থ হয়েছে! আবার চেষ্টা করুন।" : "Ad failed to load!", "error");
    } finally {
        startButtonCooldown('btn-watch-dedicated-ad', `<i class="fa-solid fa-play"></i> <span>${I18N[APP_LANG].btnWatchReward}</span>`, APP_CONFIG.adCooldownSeconds || 5);
    }
}

function openVideoRulesModal() { triggerHaptic('light'); $('rules-modal').style.display = 'flex'; updateTelegramBackButtonState(); }

function checkAdultAgePrompt() {
    if (localStorage.getItem('adult_18_confirmed_permanent') !== 'true') {
        $('adult-warning-modal').style.display = 'flex';
        updateTelegramBackButtonState();
    }
}

function confirmAdultAge() {
    triggerHaptic('success');
    localStorage.setItem('adult_18_confirmed_permanent', 'true');
    $('adult-warning-modal').style.display = 'none';
    showToast(APP_LANG === 'bn' ? "এন্ডাল সেকশনে স্বাগতম! (নিজ দায়িত্বে প্রবেশ করেছেন)" : "Welcome to Endal Section!", "success");
    updateTelegramBackButtonState();
}

function declineAdultAge() {
    triggerHaptic('warning');
    $('adult-warning-modal').style.display = 'none';
    showToast(APP_LANG === 'bn' ? "আপনাকে সিনেমা লাইব্রেরিতে নেওয়া হয়েছে" : "Redirected to Movies Section", "info");
    switchNavTab('movies');
    updateTelegramBackButtonState();
}

async function checkTelegramMembershipRealtime(userId) {
    if (!userId) return { isMember: false };
    try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`https://tg-check.rakibkdbb.workers.dev?userId=${userId}`, { signal: controller.signal });
        clearTimeout(tid);
        return res.ok ? await res.json() : { isMember: false };
    } catch { return { isMember: false }; }
}

async function verifyUserMembershipNow(customMsg = "") {
    if (!currentUser?.id) return false;
    const check = await checkTelegramMembershipRealtime(currentUser.id);
    if (check.isMember) return true;
    openTelegramMandatoryModal(customMsg || I18N[APP_LANG].tgModalDesc);
    return false;
}

function openTelegramMandatoryModal(customNotice) {
    triggerHaptic('warning');
    if (customNotice) $('tg-modal-desc-txt').innerText = customNotice;
    $('telegram-mandatory-modal').style.display = 'flex';
    updateTelegramBackButtonState();
}

function goToTelegramChannel() { triggerHaptic('medium'); openTelegramDirect(APP_CONFIG.telegramChannel || "https://t.me/Ads_Earn_Pro"); }

async function verifyTelegramChannelJoin() {
    triggerHaptic('medium');
    const btn = $('btn-verify-tg-status');
    const oldHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}`;

    const res = await checkTelegramMembershipRealtime(currentUser.id);
    btn.disabled = false;
    btn.innerHTML = oldHtml;

    if (res.isMember) {
        $('telegram-mandatory-modal').style.display = 'none';
        updateTelegramBackButtonState();
        showToast(APP_LANG === 'bn' ? "অভিনন্দন! ভেরিফিকেশন সফল হয়েছে।" : "Congratulations! Verification successful.", "success");
        if (typeof pendingActionAfterJoin === 'function') {
            const act = pendingActionAfterJoin;
            pendingActionAfterJoin = null;
            act();
        }
    } else {
        showToast(APP_LANG === 'bn' ? "আপনি এখনো চ্যানেলে যুক্ত হননি! আগে জয়েন করুন।" : "You have not joined the channel yet! Please join first.", "error");
    }
}

function loadSavedProgress() {
    try { videoAdProgressMap = JSON.parse(localStorage.getItem('user_video_ad_progress') || '{}'); } catch(e) {}
    try { videoUnlockExpiryMap = JSON.parse(localStorage.getItem('user_video_unlock_expiry') || '{}'); } catch(e) {}
}

async function saveUnlockProgress() {
    try {
        const expJson = JSON.stringify(videoUnlockExpiryMap);
        localStorage.setItem('user_video_ad_progress', JSON.stringify(videoAdProgressMap));
        localStorage.setItem('user_video_unlock_expiry', expJson);
        if (tg?.CloudStorage) tg.CloudStorage.setItem('user_video_unlock_expiry', expJson);
        if (db && currentUser?.id) await db.collection("users").doc(String(currentUser.id)).set({ unlockedExpiryMap: videoUnlockExpiryMap }, { merge: true }).catch(()=>{});
    } catch(e) {}
}

function isVideoCurrentlyUnlocked(videoId) {
    return !!(videoId && videoUnlockExpiryMap[videoId] && Date.now() < videoUnlockExpiryMap[videoId]);
}

function isTelegramUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const u = url.toLowerCase().trim();
    return u.includes("t.me/") || u.includes("telegram.me/") || u.startsWith("tg://");
}

function openTelegramDirect(url) {
    window.Telegram?.WebApp?.openTelegramLink ? window.Telegram.WebApp.openTelegramLink(url) : window.open(url, '_blank');
}

function listenToAdminConfig() {
    if (!db) return;
    db.collection("settings").doc("app_config").onSnapshot((doc) => {
        if (doc.exists) { 
            APP_CONFIG = { ...APP_CONFIG, ...doc.data() }; 
            initAdsgram();
            initOnclickaTma();
            applyAdminConfigToUI(); 
        }
    }, () => {});

    db.collection("categories").onSnapshot((snapshot) => {
        if (!snapshot.empty) {
            adminCreatedCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            adminCreatedCategories = [];
        }
        renderAllCategoryChips();
        filterVideosUI();
    }, () => {});
}

function extractTelegramUser() {
    let u = null;
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) u = window.Telegram.WebApp.initDataUnsafe.user;
    else if (window.Telegram?.WebApp?.initData) {
        try { const raw = new URLSearchParams(window.Telegram.WebApp.initData).get('user'); if (raw) u = JSON.parse(raw); } catch(e) {}
    }
    if (!u && window.location.hash) {
        try {
            const innerP = new URLSearchParams(new URLSearchParams(window.location.hash.substring(1)).get('tgWebAppData'));
            const raw = innerP.get('user'); if (raw) u = JSON.parse(raw);
        } catch(e) {}
    }
    if (!u || !u.id) {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#050814; color:#fff; text-align:center; padding:20px;">
                <i class="fa-brands fa-telegram" style="font-size:60px; color:var(--primary); margin-bottom:15px; filter: drop-shadow(0 0 15px var(--primary));"></i>
                <h2 style="font-size:22px; margin-bottom:10px; font-weight:900;">শুধুমাত্র টেলিগ্রামে চলবে</h2>
                <p style="font-size:15px; color:#8ba2c4; max-width:300px; line-height:1.5; font-weight:700;">এই অ্যাপটি ব্যবহারের জন্য দয়া করে আমাদের অফিসিয়াল টেলিগ্রাম বট থেকে প্রবেশ করুন।</p>
            </div>`;
        throw new Error("Unauthorized: Opened outside Telegram");
    }
    return u;
}

function hideAppPreloader() {
    const preloader = $('app-preloader');
    if (preloader) {
        preloader.classList.add('hide-loader');
        setTimeout(() => { preloader.style.display = 'none'; }, 550);
    }
}

async function initApp() {
    try { if (!firebase.apps.length) firebase.initializeApp(firebaseConfig); db = firebase.firestore(); } catch(e) {}
    if (window.Telegram?.WebApp) {
        tg = window.Telegram.WebApp;
        try { tg.expand(); tg.ready(); setupTelegramBackButton(); } catch(e){}
    }
    currentUser = extractTelegramUser();
    const uid = String(currentUser.id);
    $('u-profile-name').innerText = currentUser.first_name || (APP_LANG === 'bn' ? "ব্যবহারকারী" : "User");
    $('u-profile-handle').innerText = currentUser.username ? "@" + currentUser.username : "@user";
    $('u-profile-id').innerText = formatNumber(uid);
    $('ref-user-code').innerText = formatNumber(uid);
    $('ref-share-url-box').innerText = `https://t.me/${APP_CONFIG.botUsername}/${APP_CONFIG.appShortName}?startapp=${uid}`;

    loadSavedProgress();
    applyStaticTranslations();
    listenToAdminConfig();
    loadSettingsAndVideos();
    await syncUserData();
    initAdsgram();
    initOnclickaTma();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { const v = $('in-app-video-element'); if (v && !v.paused) v.pause(); }
    });

    setTimeout(hideAppPreloader, 600);
}

function initAdsgram() {
    if (window.Adsgram) {
        try { adsgramRewardController = window.Adsgram.init({ blockId: APP_CONFIG.adsgramRewardBlockId || "46116" }); } catch(e) {}
        try { adsgramInterstitialController = window.Adsgram.init({ blockId: APP_CONFIG.adsgramInterstitialBlockId || "int-38278" }); } catch(e) {}
    } else {
        setTimeout(initAdsgram, 500);
    }
}

// ================== AD ENGINES ==================
let adWatchCounter = 0;

function showMonetagAd() {
    return new Promise((resolve, reject) => {
        const sdkName = APP_CONFIG.monetagSdkName || 'show_11928576';
        if (typeof window[sdkName] === 'function') {
            try {
                window[sdkName]()
                    .then(() => resolve({ done: true, network: 'monetag' }))
                    .catch(err => reject(err));
            } catch (e) {
                reject(e);
            }
        } else {
            reject(new Error("Monetag SDK is not loaded"));
        }
    });
}

function showAdsgramAd(controller, isRewarded = true) {
    return new Promise((resolve, reject) => {
        if (!controller) return reject(new Error("Adsgram controller not available"));
        controller.show()
            .then(res => {
                if (res?.done || !isRewarded) resolve({ done: true, network: 'adsgram' });
                else resolve({ done: false, network: 'adsgram' });
            })
            .catch(err => reject(err));
    });
}

function getAdExecutionSequence(purpose = 'video', stepIndex = 0) {
    if (!adsgramRewardController || !adsgramInterstitialController) initAdsgram();

    const adNet = (APP_CONFIG.adNetwork || 'both').toLowerCase();
    const mode = (purpose === 'video' ? (APP_CONFIG.adModeVideo || 'alternate') : (APP_CONFIG.adModeEarn || 'reward')).toLowerCase();
    
    let sequence = [];
    const adsgramRewardItem = { name: 'Adsgram Reward', run: () => showAdsgramAd(adsgramRewardController || adsgramInterstitialController, true) };
    const adsgramInterItem = { name: 'Adsgram Interstitial', run: () => showAdsgramAd(adsgramInterstitialController || adsgramRewardController, false) };
    const monetagItem = { name: 'Monetag Rewarded Interstitial', run: () => showMonetagAd() };

    if (adNet === 'monetag' || mode === 'monetag_only') {
        sequence = [monetagItem, adsgramRewardItem, adsgramInterItem];
    } else if (adNet === 'adsgram') {
        if (mode === 'interstitial') sequence = [adsgramInterItem, adsgramRewardItem];
        else if (mode === 'reward') sequence = [adsgramRewardItem, adsgramInterItem];
        else {
            const isStepEven = ((purpose === 'video' ? stepIndex : adWatchCounter) % 2 === 0);
            sequence = isStepEven ? [adsgramInterItem, adsgramRewardItem] : [adsgramRewardItem, adsgramInterItem];
        }
    } else {
        const count = (purpose === 'video' ? stepIndex : adWatchCounter);
        if (mode === 'alternate' || mode === 'swap') {
            const mod = count % 3;
            if (mod === 0) sequence = [monetagItem, adsgramRewardItem, adsgramInterItem];
            else if (mod === 1) sequence = [adsgramInterItem, monetagItem, adsgramRewardItem];
            else sequence = [adsgramRewardItem, monetagItem, adsgramInterItem];
        } else if (mode === 'random' || mode === 'mixed') {
            sequence = [monetagItem, adsgramRewardItem, adsgramInterItem].sort(() => Math.random() - 0.5);
        } else if (mode === 'interstitial') {
            sequence = [adsgramInterItem, monetagItem, adsgramRewardItem];
        } else {
            sequence = [adsgramRewardItem, monetagItem, adsgramInterItem];
        }
    }
    return sequence.filter(Boolean);
}

async function executeAdFlow(purpose = 'video', stepIndex = 0) {
    const sequence = getAdExecutionSequence(purpose, stepIndex);
    if (!sequence.length) throw new Error("কোনো অ্যাড নেটওয়ার্ক প্রস্তুত নেই!");

    let lastError = null;
    for (const adStep of sequence) {
        try {
            const res = await adStep.run();
            if (res?.done) return res;
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error("বিজ্ঞাপন লোড হতে ব্যর্থ হয়েছে!");
}

async function syncUserData() {
    if (!db || !currentUser?.id) return;
    try {
        const uid = String(currentUser.id);
        const ref = db.collection("users").doc(uid);
        const todayStr = getTodayBDDate();
        const deviceId = getDeviceUUID();
        const snap = await ref.get();

        if (!snap.exists) {
            let initialBalance = APP_CONFIG.initialPoints || 10, referredBy = null;
            const startParam = tg?.initDataUnsafe?.start_param;
            let isSameDeviceDetected = false;
            try {
                const devCheck = await db.collection("users").where("deviceId", "==", deviceId).limit(1).get();
                if (!devCheck.empty) isSameDeviceDetected = true;
            } catch(e) {}

            if (startParam && !startParam.startsWith('vid_') && String(startParam) !== uid) {
                if (isSameDeviceDetected) {
                    showToast(APP_LANG === 'bn' ? "⚠️ একই ডিভাইসে রেফার গ্রহণযোগ্য নয়!" : "⚠️ Same device referral rejected!", "error");
                } else {
                    referredBy = String(startParam);
                    initialBalance += (APP_CONFIG.signupBonus || 10);
                }
            }

            const newUser = {
                name: currentUser.first_name || "User", username: currentUser.username || "", balancePoints: initialBalance,
                selfEarnedPoints: 0, referralEarnedPoints: 0, dailyAdsWatched: 0, videoAdsWatched: 0, totalVideoAdsWatched: 0,
                dailyAdsLimit: APP_CONFIG.dailyAdLimit || 20, lastAdDate: todayStr, totalReferrals: 0, referredBy,
                referralActivated: false, deviceId, isSameDeviceFraud: isSameDeviceDetected, status: 'active',
                networkAdsWatched: { adsgram: 0, monetag: 0, onclicka: 0 },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await ref.set(newUser);
            userData = newUser;
        } else {
            userData = snap.data();
            if (userData.unlockedExpiryMap) videoUnlockExpiryMap = { ...videoUnlockExpiryMap, ...userData.unlockedExpiryMap };
            if (userData.lastAdDate !== todayStr) {
                userData.dailyAdsWatched = 0; 
                userData.videoAdsWatched = 0; 
                userData.networkAdsWatched = { adsgram: 0, monetag: 0, onclicka: 0 };
                userData.lastAdDate = todayStr;
                ref.update({ dailyAdsWatched: 0, videoAdsWatched: 0, networkAdsWatched: userData.networkAdsWatched, lastAdDate: todayStr }).catch(()=>{});
            }
        }

        ref.onSnapshot((doc) => {
            if (doc.exists) {
                userData = { ...userData, ...doc.data() };
                $('banned-screen').style.display = userData.status === 'banned' ? 'flex' : 'none';
                updateUserUI();
                if ($('dedicated-ad-view')?.style.display === 'block') updateDedicatedAdScreenUI();
            }
        }, () => {});
        updateUserUI();
    } catch (e) { updateUserUI(); }
}

function startButtonCooldown(btnId, defaultText, seconds = null) {
    const btn = $(btnId);
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add('btn-disabled-state');
    
    let remaining = (seconds !== null && seconds !== undefined) ? Number(seconds) : Number(APP_CONFIG.adCooldownSeconds || 5);
    if (isNaN(remaining) || remaining <= 0) remaining = 5;

    const updateBtn = () => { 
        btn.innerHTML = `<i class="fa-solid fa-hourglass-half fa-spin"></i> ${APP_LANG === 'bn' ? `অপেক্ষা করুন (${formatNumber(remaining)}s)` : `Please wait (${remaining}s)`}`; 
    };
    updateBtn();
    const timer = setInterval(() => {
        remaining--;
        if (remaining > 0) updateBtn();
        else {
            clearInterval(timer);
            btn.disabled = false;
            btn.classList.remove('btn-disabled-state');
            btn.innerHTML = defaultText;
            triggerHaptic('light');
        }
    }, 1000);
}

async function watchVideoUnlockAd() {
    if (!activeDetailVideo) return;
    const btn = $('btn-unlock-ad-step');
    if (!btn || btn.classList.contains('btn-disabled-state') || btn.disabled) return;
    triggerHaptic('medium');

    const vId = activeDetailVideo.id, total = APP_CONFIG.unlockAdCount || 3;
    if (!isVideoCurrentlyUnlocked(vId) && (videoAdProgressMap[vId] || 0) >= total) {
        videoAdProgressMap[vId] = 0; saveUnlockProgress(); updateUnlockProgressUI();
    }

    const currentDone = videoAdProgressMap[vId] || 0;
    if (isVideoCurrentlyUnlocked(vId)) return playMovie(activeDetailVideo);
    if (currentDone >= total) return executeUnlockSuccess('ad');

    btn.classList.add('btn-disabled-state');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'অপেক্ষা করুন...' : 'Please wait...'}`;

    const releaseBtn = () => { btn.classList.remove('btn-disabled-state'); btn.disabled = false; updateUnlockProgressUI(); };

    if (currentDone >= (total - 1)) {
        const isMember = await verifyUserMembershipNow();
        if (!isMember) { pendingActionAfterJoin = () => watchVideoUnlockAd(); releaseBtn(); return; }
    }

    try {
        const res = await executeAdFlow('video', currentDone);
        if (res?.done) {
            triggerHaptic('success');
            adWatchCounter++;
            videoAdProgressMap[vId] = (videoAdProgressMap[vId] || 0) + 1;
            saveUnlockProgress();
            try {
                const userRef = db.collection("users").doc(String(currentUser.id));
                await userRef.update({
                    videoAdsWatched: firebase.firestore.FieldValue.increment(1),
                    totalVideoAdsWatched: firebase.firestore.FieldValue.increment(1),
                    lastAdDate: getTodayBDDate()
                });
            } catch {}

            updateUnlockProgressUI();
            if (videoAdProgressMap[vId] >= total) {
                executeUnlockSuccess('ad');
            } else {
                showToast(APP_LANG === 'bn' ? `বিজ্ঞাপন সম্পন্ন! বাকি ${formatNumber(total - videoAdProgressMap[vId])} টি` : `Ad completed! ${total - videoAdProgressMap[vId]} left`, "success");
            }
            startButtonCooldown('btn-unlock-ad-step', $('btn-unlock-ad-step').innerHTML, APP_CONFIG.adCooldownSeconds || 5);
        } else {
            updateUnlockProgressUI();
            showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন সম্পূর্ণ দেখলে আনলক হবে!" : "Watch full ad to unlock!", "error");
            startButtonCooldown('btn-unlock-ad-step', $('btn-unlock-ad-step').innerHTML, APP_CONFIG.adCooldownSeconds || 4);
        }
    } catch (err) {
        updateUnlockProgressUI();
        showToast(APP_LANG === 'bn' ? "বিজ্ঞাপন লোড হতে ব্যর্থ হয়েছে!" : "Ad failed to load!", "error");
        startButtonCooldown('btn-unlock-ad-step', $('btn-unlock-ad-step').innerHTML, APP_CONFIG.adCooldownSeconds || 4);
    }
}

function extractVideoLinks(data) {
    let rawList = [];
    let src = data.links || data.urls || data.parts || data.episodes || data.url || data.videoUrl || data.link || data.video_url || '';
    if (typeof src === 'string' && src.trim()) rawList = src.split(',').map(s => s.trim()).filter(Boolean);
    else if (Array.isArray(src)) {
        src.forEach(item => {
            if (typeof item === 'string') item.split(',').forEach(u => u.trim() && rawList.push(u.trim()));
            else if (item && typeof item === 'object') {
                const u = item.url || item.link || '';
                u.includes(',') ? u.split(',').forEach(x => x.trim() && rawList.push({ ...item, url: x.trim() })) : rawList.push(item);
            }
        });
    }
    let formatted = rawList.map((item, idx) => {
        const partName = `${I18N[APP_LANG].partPrefix} ${formatNumber(idx + 1)}`;
        const defaultThumb = data.thumb || data.thumbnail || data.poster || '';
        return typeof item === 'string' ? { name: partName, part: partName, duration: data.duration || 'HD', views: Number(data.views || 0), url: item.trim(), thumb: defaultThumb }
                                        : { name: item.name || item.title || partName, part: item.part || partName, duration: item.duration || data.duration || 'HD', views: Number(item.views || data.views || 0), thumb: item.thumb || item.thumbnail || defaultThumb, url: (item.url || item.link || '').trim() };
    });
    return formatted.length ? formatted : [{ name: `${I18N[APP_LANG].partPrefix} ${formatNumber(1)}`, duration: "HD", views: Number(data.views || 0), url: "", thumb: data.thumb || '' }];
}

function isSeriesVideo(v) {
    const type = (v.type || '').toLowerCase(), cat = (v.category || '').toLowerCase(), sec = (v.section || '').toLowerCase();
    return sec === 'series' || type === 'series' || v.isSeries === true || cat.includes('series') || cat.includes('dub');
}

function isAdultVideo(v) {
    if (isSeriesVideo(v)) return false;
    const type = (v.type || '').toLowerCase(), cat = (v.category || '').toLowerCase(), sec = (v.section || '').toLowerCase(), title = (v.title || '').toLowerCase();
    if (['adult', '18+', '18+', 'endal', 'এন্ডাল'].includes(sec) || ['adult', '18', '18+', 'endal', 'এন্ডাল'].includes(type) || v.isAdult === true || v.adult === true) return true;
    if (['movie', 'movies'].includes(sec) || ['movie', 'movies'].includes(type)) return false;
    const kws = ['adult', '18', '18+', '১৮+', 'endal', 'এন্ডাল', 'hot', 'viral', 'tiktok', 'desi', 'college', 'exclusive', 'boudi', 'bhabi', 'sex', 'bhabhi', 'বউদি', 'ভাবি', 'বাবা মেয়ে', 'মা ছেলে', 'ভাই বোন', 'এডাল্ট', 'গার্লফ্রেন্ড', 'টিকটকার', 'গরম', 'choti', 'baba meye', 'ma chele', 'bhai bon'];
    return kws.some(k => title.includes(k) || cat.includes(k));
}

function isMovieVideo(v) { return !isSeriesVideo(v) && !isAdultVideo(v); }

function formatTimeAgo(dateObj) {
    if (!dateObj) return APP_LANG === 'bn' ? 'এইমাত্র' : 'Just now';

    let past = 0;
    try {
        if (typeof dateObj === 'number') {
            past = dateObj < 1e11 ? dateObj * 1000 : dateObj;
        } else if (dateObj && typeof dateObj.toDate === 'function') {
            past = dateObj.toDate().getTime();
        } else if (dateObj && dateObj.seconds) {
            past = dateObj.seconds * 1000;
        } else if (dateObj instanceof Date) {
            past = dateObj.getTime();
        } else {
            const parsed = new Date(dateObj).getTime();
            past = isNaN(parsed) ? 0 : parsed;
        }
    } catch (e) {
        past = 0;
    }

    if (!past) return APP_LANG === 'bn' ? 'এইমাত্র' : 'Just now';

    const diffSec = Math.max(0, Math.floor((Date.now() - past) / 1000));

    if (diffSec < 60) return APP_LANG === 'bn' ? 'এইমাত্র' : 'Just now';

    const diffM = Math.floor(diffSec / 60);
    if (diffM < 60) return APP_LANG === 'bn' ? `${formatNumber(diffM)} মিনিট আগে` : `${diffM} min${diffM > 1 ? 's' : ''} ago`;

    const diffH = Math.floor(diffSec / 3600);
    if (diffH < 24) return APP_LANG === 'bn' ? `${formatNumber(diffH)} ঘণ্টা আগে` : `${diffH} hour${diffH > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffSec / 86400);
    if (diffDays < 7) return APP_LANG === 'bn' ? `${formatNumber(diffDays)} দিন আগে` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return APP_LANG === 'bn' ? `${formatNumber(diffWeeks)} সপ্তাহ আগে` : `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffDays < 365) return APP_LANG === 'bn' ? `${formatNumber(diffMonths)} মাস আগে` : `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

    const diffYears = Math.floor(diffDays / 365);
    return APP_LANG === 'bn' ? `${formatNumber(diffYears)} বছর আগে` : `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

function processVideoSnapshot(docs) {
    allLoadedVideos = docs.map(d => {
        const data = d.data(), links = extractVideoLinks(data);
        return {
            id: d.id, ...data, title: data.title || data.name || (APP_LANG === 'bn' ? 'ভিডিও' : 'Video'),
            thumb: data.thumb || data.thumbnail || data.poster || 'https://via.placeholder.com/600x450?text=HD+Video',
            duration: data.duration || 'HD', url: links[0]?.url || data.url || '', links, views: Number(data.views || 0),
            likes: Number(data.likes || 0), season: data.season || 'S5',
            timeAgo: data.timeAgo || formatTimeAgo(data.createdAt || data.timestamp || data.date),
            section: (data.section || '').toLowerCase(), type: (data.type || '').toLowerCase(), 
            category: (data.category || data.cat || '').trim()
        };
    }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    $('movie-total-count').innerText = formatNumber(allLoadedVideos.filter(isMovieVideo).length);
    $('series-total-count').innerText = formatNumber(allLoadedVideos.filter(isSeriesVideo).length);
    $('adult-total-count').innerText = formatNumber(allLoadedVideos.filter(isAdultVideo).length);

    renderAllCategoryChips();
    filterVideosUI();
    if (!hasHandledInitialTargetVideo) handleDeepLinkVideoScroll();
}

function renderCategoryChipsForTab(section, containerId) {
    const container = $(containerId);
    if (!container) return;

    const set = new Set();
    adminCreatedCategories.forEach(cat => {
        const name = (cat.name || cat.title || '').trim();
        const type = (cat.type || cat.section || '').toLowerCase();
        if (name) {
            if (!type || type === section || type === 'all' || (section === 'movies' && (type === 'movie' || type === 'movies'))) {
                set.add(name);
            }
        }
    });

    const sectionWrapper = $(`${section}-cat-section`);
    if (set.size === 0) {
        if (sectionWrapper) sectionWrapper.style.display = 'none';
        container.innerHTML = "";
        return;
    } else {
        if (sectionWrapper) sectionWrapper.style.display = 'block';
    }

    const activeCat = activeSelectedCategory[section] || 'all';
    const t = I18N[APP_LANG];

    let html = `
        <div class="cat-filter-pill ${activeCat === 'all' ? 'active' : ''}" onclick="selectCategoryChip('${section}', 'all', this)">
            <i class="fa-solid fa-shapes"></i> <span>${t.allCat}</span>
        </div>
    `;

    set.forEach(catName => {
        const isActive = activeCat.toLowerCase() === catName.toLowerCase();
        html += `
            <div class="cat-filter-pill ${isActive ? 'active' : ''}" onclick="selectCategoryChip('${section}', '${catName.replace(/'/g, "\\'")}', this)">
                <i class="fa-solid fa-tag"></i> <span>${catName}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderAllCategoryChips() {
    renderCategoryChipsForTab('movies', 'movie-category-chips');
    renderCategoryChipsForTab('series', 'series-category-chips');
    renderCategoryChipsForTab('adult', 'adult-category-chips');
}

function selectCategoryChip(section, catName, el) {
    triggerHaptic('light');
    activeSelectedCategory[section] = catName;
    currentPageMap[section] = 1;

    if (el && el.parentElement) {
        el.parentElement.querySelectorAll('.cat-filter-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
    }

    filterVideosUI();
}

function scrollToAndHighlightVideo(videoId) {
    if (!videoId) return;
    const cleanId = videoId.replace(/^vid_/, '').trim();
    const found = allLoadedVideos.find(v => v.id === cleanId || v.id === videoId);
    if (!found) return;

    let sec = isSeriesVideo(found) ? 'series' : (isAdultVideo(found) ? 'adult' : 'movies');
    const list = allLoadedVideos.filter(sec === 'series' ? isSeriesVideo : (sec === 'adult' ? isAdultVideo : isMovieVideo));
    const idx = list.findIndex(v => v.id === found.id);
    if (idx !== -1) currentPageMap[sec] = Math.floor(idx / ITEMS_PER_PAGE) + 1;

    filterVideosUI();
    switchNavTab(sec);
    setTimeout(() => {
        const card = $(`video-card-${found.id}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight-glow-pulse');
            triggerHaptic('success');
            showToast(APP_LANG === 'bn' ? "🎯 ভিডিও হাইলাইট করা হয়েছে!" : "🎯 Video highlighted!", "success");
            setTimeout(() => card.classList.remove('highlight-glow-pulse'), 3500);
        }
    }, 300);
}

function handleDeepLinkVideoScroll() {
    const p = new URLSearchParams(window.location.search);
    const targetId = p.get('video') || p.get('v') || p.get('id') || tg?.initDataUnsafe?.start_param;
    if (targetId) {
        hasHandledInitialTargetVideo = true;
        scrollToAndHighlightVideo(targetId.replace(/^vid_/, ''));
    }
}

async function loadSettingsAndVideos() {
    if (!db) return;
    try {
        db.collection("videos").onSnapshot(s => {
            s.empty ? ['movies', 'series', 'adult'].forEach(t => renderVideosForGrid(t, [])) : processVideoSnapshot(s.docs);
        }, () => {});
    } catch {}
}

function handleHeroSectionClick(cardEl, tag, section) {
    triggerHaptic('light');
    cardEl.closest('.hero-banner-grid').querySelectorAll('.hero-card').forEach(c => c.classList.remove('active-animated'));
    cardEl.classList.add('active-animated');
    activeHeroFilterTags[section] = tag;
    currentPageMap[section] = 1;

    const titleMap = {
        movies: tag === 'trending' ? (APP_LANG === 'bn' ? 'হট সিনেমা' : 'Hot Movies') : (APP_LANG === 'bn' ? 'নতুন সিনেমা' : 'New Movies'),
        series: tag === 'top_rated' ? (APP_LANG === 'bn' ? 'হট সিরিজ' : 'Hot Series') : (APP_LANG === 'bn' ? 'নতুন সিরিজ (ফুল সিজন)' : 'New Series (Full Season)'),
        adult: tag === 'adult_hot' ? (APP_LANG === 'bn' ? 'হট এন্ডাল' : 'Hot Endal') : (APP_LANG === 'bn' ? 'নতুন এন্ডাল' : 'New Endal')
    };
    const bar = $(`${section === 'movies' ? 'movie' : section}-bar-title`);
    if (bar) bar.innerText = titleMap[section];
    filterVideosUI();
}

function toggleCardLike(event, videoId) {
    event.stopPropagation();
    triggerHaptic('medium');
    const v = allLoadedVideos.find(item => item.id === videoId);
    if (!v) return;

    const isLiked = !!userLikedVideos[videoId];
    userLikedVideos[videoId] = !isLiked;
    v.likes = Math.max(0, (v.likes || 0) + (isLiked ? -1 : 1));
    showToast(APP_LANG === 'bn' ? (isLiked ? "লাইক বাতিল করা হয়েছে" : "ভিডিওতে লাইক দেওয়া হয়েছে!") : (isLiked ? "Like removed" : "Video liked!"), isLiked ? "info" : "success");

    if (db && videoId) db.collection("videos").doc(videoId).update({ likes: firebase.firestore.FieldValue.increment(isLiked ? -1 : 1) }).catch(()=>{});
    localStorage.setItem('app_user_liked_vids', JSON.stringify(userLikedVideos));

    if ($(`card-like-count-${videoId}`)) $(`card-like-count-${videoId}`).innerText = formatNumber(v.likes);
    if ($(`card-like-chip-${videoId}`)) $(`card-like-chip-${videoId}`).classList.toggle('active-liked', !isLiked);
    if (activeDetailVideo?.id === videoId) { activeDetailVideo.likes = v.likes; updateDetailLikeUI(); }
}

function renderPaginationUI(type, totalPages, currentPage) {
    const c = $(`${type === 'movies' ? 'movie' : type}-pagination`);
    if (!c) return;
    if (totalPages <= 1) { c.style.display = 'none'; c.innerHTML = ''; return; }

    c.style.display = 'flex';
    let html = `<div class="page-pill-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPaginationPage('${type}', ${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></div>`;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    if (start > 1) {
        html += `<div class="page-pill-btn" onclick="goToPaginationPage('${type}', 1)">${formatNumber(1)}</div>`;
        if (start > 2) html += `<div class="page-pill-btn disabled" style="border:none; background:transparent;">...</div>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<div class="page-pill-btn ${i === currentPage ? 'active' : ''}" onclick="goToPaginationPage('${type}', ${i})">${formatNumber(i)}</div>`;
    }

    if (end < totalPages) {
        if (end < totalPages - 1) html += `<div class="page-pill-btn disabled" style="border:none; background:transparent;">...</div>`;
        html += `<div class="page-pill-btn" onclick="goToPaginationPage('${type}', ${totalPages})">${formatNumber(totalPages)}</div>`;
    }

    html += `<div class="page-pill-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="goToPaginationPage('${type}', ${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></div>`;
    c.innerHTML = html;
}

function goToPaginationPage(type, pageNum) {
    triggerHaptic('light');
    currentPageMap[type] = pageNum;
    filterVideosUI();
    const grid = $(`${type === 'movies' ? 'movie' : type}-list-grid`);
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVideosForGrid(type, list) {
    const grid = $(`${type === 'movies' ? 'movie' : type}-list-grid`), empty = $(`${type === 'movies' ? 'movie' : type}-empty-card`);
    if (!grid) return;
    if (!list || !list.length) { grid.innerHTML = ""; if (empty) empty.style.display = "block"; renderPaginationUI(type, 0, 1); return; }
    if (empty) empty.style.display = "none";

    const t = I18N[APP_LANG];
    const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
    currentPageMap[type] = Math.min(Math.max(1, currentPageMap[type]), totalPages);
    const curPage = currentPageMap[type];
    const visible = list.slice((curPage - 1) * ITEMS_PER_PAGE, curPage * ITEMS_PER_PAGE);

    renderPaginationUI(type, totalPages, curPage);

    grid.innerHTML = visible.map(v => {
        const epCount = v.links?.length || 1, viewsStr = formatNumber(v.views || 0), likesStr = formatNumber(v.likes || 0);
        const timeAgoStr = v.timeAgo || formatTimeAgo(v.createdAt || v.timestamp || v.date);
        const isLiked = !!userLikedVideos[v.id], isSeries = (type === 'series');
        const partsBadgeTxt = `${t.partPrefix} ${formatNumber(1)}-${formatNumber(epCount)}`;

        let rightBadge = `<div class="series-thumb-badge-yellow" ${type === 'adult' ? 'style="background:linear-gradient(135deg, #ff0844, #ff4e50); color:#fff; box-shadow:0 0 10px rgba(255,8,68,0.6);"' : (type === 'movies' ? 'style="background:var(--grad-blue); color:#fff; box-shadow:0 0 10px var(--primary-glow);"' : '')}>${isSeries ? (v.badgeText || partsBadgeTxt) : (epCount > 1 ? partsBadgeTxt : (type === 'adult' ? (APP_LANG === 'bn' ? 'এন্ডাল' : 'Adult') : (APP_LANG === 'bn' ? 'সিনেমা' : 'Movie')))}</div>`;
        let metaChips = `
            <span class="series-chip-pill"><i class="fa-solid fa-eye"></i> ${viewsStr}</span>
            <span class="series-chip-pill ${isLiked ? 'active-liked' : ''}" id="card-like-chip-${v.id}" onclick="toggleCardLike(event, '${v.id}')"><i class="fa-solid fa-thumbs-up"></i> <span id="card-like-count-${v.id}">${likesStr}</span></span>
            ${isSeries ? `<span class="series-chip-pill"><i class="fa-solid fa-bars-staggered"></i> ${formatNumber(epCount)} ${t.partPrefix}</span><span class="series-chip-pill pill-season"><i class="fa-solid fa-clapperboard"></i> ${v.season || 'S5'}</span>` : 
             (type === 'adult' ? `<span class="series-chip-pill pill-season"><i class="fa-solid fa-fire"></i> ${epCount > 1 ? formatNumber(epCount) + ' ' + t.partPrefix : (APP_LANG === 'bn' ? 'হট' : 'Hot')}</span>` :
             `<span class="series-chip-pill pill-season"><i class="fa-solid fa-film"></i> ${epCount > 1 ? formatNumber(epCount) + ' ' + t.partPrefix : 'HD'}</span>`)}
        `;

        return `
        <div class="series-card-item" id="video-card-${v.id}" onclick="${isSeries ? `openSeriesEpisodesDrawer('${v.id}')` : `openVideoDetailView('${v.id}')`}">
            <div class="series-thumb-container">
                <div class="series-thumb-badge-blue"><i class="fa-solid fa-circle-play"></i> ${v.duration || 'HD'}</div>
                <img src="${v.thumb}" onerror="this.src='https://via.placeholder.com/600x450?text=Enjoy+Movies'" loading="lazy" decoding="async">
                ${rightBadge}
            </div>
            <div class="series-info-body shimmer-card-effect">
                <div class="series-title-row">
                    <div class="series-main-title">${v.title}</div>
                    <div class="series-share-btn" onclick="shareVideoItem(event, '${v.id}', '${encodeURIComponent(v.title)}')"><i class="fa-solid fa-share-nodes"></i></div>
                </div>
                <div class="series-meta-row"><div class="series-chips-group">${metaChips}</div><div class="series-time-ago">${timeAgoStr}</div></div>
            </div>
        </div>`;
    }).join('');
}

function shareVideoItem(event, videoId, encodedTitle) {
    event?.stopPropagation();
    triggerHaptic('medium');
    const shareUrl = `https://t.me/${APP_CONFIG.botUsername || "Ret2_bot"}/${APP_CONFIG.appShortName || "TkEarning"}?startapp=vid_${videoId}`;
    const msg = APP_LANG === 'bn' ? `🔥 ${decodeURIComponent(encodedTitle || 'ভিডিও')} সরাসরি দেখুন এখনই!` : `🔥 Watch ${decodeURIComponent(encodedTitle || 'Video')} right now!`;
    openTelegramDirect(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(msg)}`);
}

let activeSeriesForDrawer = null;
function openSeriesEpisodesDrawer(seriesId) {
    triggerHaptic('light');
    const s = allLoadedVideos.find(v => v.id === seriesId);
    if (!s) return;
    activeSeriesForDrawer = s;
    $('series-drawer-title').innerText = s.title;

    const list = $('series-episodes-list');
    list.innerHTML = "";
    $('series-drawer-modal').style.display = 'flex';
    updateTelegramBackButtonState();

    const links = s.links || extractVideoLinks(s), t = I18N[APP_LANG];
    list.innerHTML = links.map((ep, idx) => `
        <div class="episode-item-card" onclick="selectEpisodeFromDrawer(${idx})">
            <div class="ep-left-wrap">
                <div class="ep-thumb-box">
                    <img src="${ep.thumb || s.thumb}" onerror="this.src='https://via.placeholder.com/120x90?text=EP'" loading="lazy" decoding="async">
                    <span class="ep-badge-label">${t.partPrefix} ${formatNumber(idx + 1)}</span>
                </div>
                <div class="ep-details">
                    <h4>${s.title} - ${ep.name || `${t.partPrefix} ${formatNumber(idx + 1)}`}</h4>
                    <p>${ep.duration || 'HD'} • ${APP_LANG === 'bn' ? `সিজন ${formatNumber(s.season?.replace(/\D/g, '') || 5)}` : `Season ${s.season?.replace(/\D/g, '') || 5}`} • ${formatNumber(ep.views || 0)} ${t.viewsWord}</p>
                </div>
            </div>
            <div class="ep-arrow-btn"><i class="fa-solid fa-chevron-right"></i></div>
        </div>
    `).join('');
}

function closeSeriesDrawer() { 
    triggerHaptic('light'); 
    $('series-drawer-modal').style.display = 'none'; 
    activeSeriesForDrawer = null; 
    updateTelegramBackButtonState(); 
}

function selectEpisodeFromDrawer(epIndex) { 
    if (!activeSeriesForDrawer) return; 
    triggerHaptic('medium'); 
    const s = activeSeriesForDrawer; 
    closeSeriesDrawer(); 
    openVideoDetailView(s.id, epIndex); 
}

function openVideoDetailView(videoId, epIndex = null) {
    triggerHaptic('light');
    currentPlayingPartIndex = epIndex ?? 0;
    const video = allLoadedVideos.find(v => v.id === videoId);
    if (!video) return showToast(APP_LANG === 'bn' ? "ভিডিও পাওয়া যায়নি!" : "Video not found!", "error");
    activeDetailVideo = video;

    video.views = (video.views || 0) + 1;
    if (db && videoId) db.collection("videos").doc(videoId).update({ views: firebase.firestore.FieldValue.increment(1) }).catch(()=>{});

    if (videoUnlockExpiryMap[videoId] && Date.now() >= videoUnlockExpiryMap[videoId]) {
        delete videoUnlockExpiryMap[videoId]; delete videoAdProgressMap[videoId]; saveUnlockProgress();
    }
    if (typeof videoAdProgressMap[videoId] === 'undefined' || !videoUnlockExpiryMap[videoId]) videoAdProgressMap[videoId] = videoAdProgressMap[videoId] || 0;

    const badge = $('detail-category-badge');
    if (badge) {
        const isAd = isAdultVideo(video) || currentActiveTab === 'adult', isSer = isSeriesVideo(video) || currentActiveTab === 'series';
        badge.innerHTML = `<i class="fa-solid ${isAd ? 'fa-fire' : (isSer ? 'fa-layer-group' : 'fa-clapperboard')}"></i> ${APP_LANG === 'bn' ? (isAd ? 'এন্ডাল' : (isSer ? 'সিরিজ' : 'মুভি')) : (isAd ? 'Endal' : (isSer ? 'Series' : 'Movie'))}`;
        badge.style.background = isAd ? 'var(--grad-red)' : (isSer ? 'var(--grad-purple-pink)' : 'var(--grad-blue)');
    }

    $('detail-poster-img').src = video.thumb;
    $('detail-file-title').innerText = video.title;
    $('detail-duration-badge').innerHTML = `<i class="fa-regular fa-clock"></i> ${video.duration || 'HD'}`;
    $('detail-views-txt').innerText = `${formatNumber(video.views || 0)} ${I18N[APP_LANG].viewsWord}`;

    updateDetailLikeUI();
    updateUnlockProgressUI();

    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('video-unlock-detail-view').style.display = 'block';
    updateTelegramBackButtonState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDetailLikeUI() {
    if (!activeDetailVideo) return;
    const isLiked = !!userLikedVideos[activeDetailVideo.id];
    $('detail-likes-txt').innerText = `${formatNumber(activeDetailVideo.likes || 0)} ${I18N[APP_LANG].likesWord}`;
    $('detail-like-btn-action')?.classList.toggle('active-liked', isLiked);
}

function toggleDetailVideoLike() {
    if (!activeDetailVideo) return;
    triggerHaptic('medium');
    const vId = activeDetailVideo.id, isLiked = !!userLikedVideos[vId];
    userLikedVideos[vId] = !isLiked;
    activeDetailVideo.likes = Math.max(0, (activeDetailVideo.likes || 0) + (isLiked ? -1 : 1));
    showToast(APP_LANG === 'bn' ? (isLiked ? "লাইক বাতিল করা হয়েছে" : "ধন্যবাদ আপনার লাইকের জন্য!") : (isLiked ? "Like removed" : "Thank you for liking!"), isLiked ? "info" : "success");

    if (db && vId) db.collection("videos").doc(vId).update({ likes: firebase.firestore.FieldValue.increment(isLiked ? -1 : 1) }).catch(()=>{});
    localStorage.setItem('app_user_liked_vids', JSON.stringify(userLikedVideos));
    updateDetailLikeUI();

    if ($(`card-like-count-${vId}`)) $(`card-like-count-${vId}`).innerText = formatNumber(activeDetailVideo.likes);
    if ($(`card-like-chip-${vId}`)) $(`card-like-chip-${vId}`).classList.toggle('active-liked', !isLiked);
}

function closeVideoDetailView() {
    triggerHaptic('light');
    if (countdownTimerInterval) { clearInterval(countdownTimerInterval); countdownTimerInterval = null; }
    $('video-unlock-detail-view').style.display = 'none';
    switchNavTab(currentActiveTab);
    updateTelegramBackButtonState();
}

function updateUnlockProgressUI() {
    if (!activeDetailVideo) return;
    const vId = activeDetailVideo.id, total = APP_CONFIG.unlockAdCount || 3, isUnlocked = isVideoCurrentlyUnlocked(vId);
    const t = I18N[APP_LANG], timerCard = $('unlock-status-timer-card'), adBtn = $('btn-unlock-ad-step'), pointBtn = $('btn-unlock-point-step');

    if (countdownTimerInterval) { clearInterval(countdownTimerInterval); countdownTimerInterval = null; }

    if (isUnlocked) {
        timerCard.style.display = 'flex';
        startExpiryCountdown(vId);
        $('unlock-ratio-txt').innerText = `${formatNumber(total)} / ${formatNumber(total)} ${t.unlockCompletedTxt} (100%)`;
        $('unlock-p-bar').style.width = "100%";
        adBtn.innerHTML = `<i class="fa-brands fa-telegram"></i> ${APP_LANG === 'bn' ? 'টেলিগ্রামে ভিডিও দেখুন' : 'Watch on Telegram'}`;
        pointBtn.disabled = true; pointBtn.style.opacity = "0.5";
    } else {
        timerCard.style.display = 'none';
        pointBtn.disabled = false; pointBtn.style.opacity = "1";
        const done = videoAdProgressMap[vId] || 0, percent = Math.min(100, Math.round((done / total) * 100));
        $('unlock-ratio-txt').innerText = `${formatNumber(done)} / ${formatNumber(total)} ${t.unlockCompletedTxt} (${formatNumber(percent)}%)`;
        $('unlock-p-bar').style.width = percent + "%";
        adBtn.innerHTML = done >= total ? `<i class="fa-brands fa-telegram"></i> ${APP_LANG === 'bn' ? 'টেলিগ্রামে ভিডিও দেখুন' : 'Watch on Telegram'}` :
                         (done === (total - 1) ? `<i class="fa-brands fa-telegram"></i> ${APP_LANG === 'bn' ? 'চ্যানেলে জয়েন ও শেষ অ্যাড দেখুন' : 'Join Channel & Watch Final Ad'}` :
                         `<i class="fa-solid fa-desktop"></i> ${APP_LANG === 'bn' ? `বিজ্ঞাপন দেখুন (বাকি ${formatNumber(total - done)} টি)` : `Watch Ad (${total - done} remaining)`}`);
    }
}

function startExpiryCountdown(vId) {
    const timer = $('unlock-remaining-countdown');
    if (countdownTimerInterval) { clearInterval(countdownTimerInterval); countdownTimerInterval = null; }
    const update = () => {
        const diff = (videoUnlockExpiryMap[vId] || 0) - Date.now();
        if (diff <= 0) {
            clearInterval(countdownTimerInterval); countdownTimerInterval = null;
            delete videoUnlockExpiryMap[vId]; delete videoAdProgressMap[vId];
            saveUnlockProgress(); updateUnlockProgressUI();
            return showToast(APP_LANG === 'bn' ? "আনলকের মেয়াদ শেষ হয়েছে!" : "Unlock expired!", "error");
        }
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        timer.innerText = `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
    };
    update();
    if ((videoUnlockExpiryMap[vId] || 0) - Date.now() > 0) countdownTimerInterval = setInterval(update, 1000);
}

async function unlockVideoWithPoints() {
    if (!activeDetailVideo) return;
    const btn = $('btn-unlock-point-step');
    if (!btn || btn.disabled) return;
    triggerHaptic('medium');

    btn.disabled = true; btn.style.pointerEvents = 'none';
    const oldHtml = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}`;

    const cost = APP_CONFIG.unlockPointsCost || 5;
    if ((userData.balancePoints ?? 0) < cost) {
        btn.disabled = false; btn.style.pointerEvents = 'auto'; btn.innerHTML = oldHtml;
        return showToast(APP_LANG === 'bn' ? "পর্যাপ্ত পয়েন্ট নেই!" : "Insufficient points!", "error");
    }

    pendingActionAfterJoin = () => unlockVideoWithPoints();
    if (!await verifyUserMembershipNow()) { btn.disabled = false; btn.style.pointerEvents = 'auto'; btn.innerHTML = oldHtml; return; }

    const vId = activeDetailVideo.id;
    if (isVideoCurrentlyUnlocked(vId)) { btn.disabled = false; btn.style.pointerEvents = 'auto'; btn.innerHTML = oldHtml; return playMovie(activeDetailVideo); }

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${APP_LANG === 'bn' ? 'আনলক হচ্ছে...' : 'Unlocking...'}`;
    const userRef = db.collection("users").doc(String(currentUser.id));

    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) throw new Error(APP_LANG === 'bn' ? "ইউজার তথ্য পাওয়া যায়নি!" : "User not found!");
            const pts = doc.data().balancePoints || 0;
            if (pts < cost) throw new Error(APP_LANG === 'bn' ? "পর্যাপ্ত পয়েন্ট নেই!" : "Insufficient points!");
            t.update(userRef, { balancePoints: pts - cost });
        });
        userData.balancePoints = Math.max(0, (userData.balancePoints || cost) - cost);
        updateUserUI();
        btn.disabled = false; btn.style.pointerEvents = 'auto'; btn.innerHTML = oldHtml;
        executeUnlockSuccess('point');
    } catch (err) {
        btn.disabled = false; btn.style.pointerEvents = 'auto'; btn.innerHTML = oldHtml;
        const msg = (err?.message || '').toLowerCase();
        showToast(msg.includes('429') || msg.includes('quota') ? (APP_LANG === 'bn' ? "সার্ভারে অতিরিক্ত চাপ। ৩০ সেকেন্ড পর চেষ্টা করুন।" : "Server busy. Try in 30 seconds.") : (err.message || "পয়েন্ট দিয়ে আনলক ব্যর্থ!"), "error");
    }
}

function executeUnlockSuccess(type = 'ad') {
    const vId = activeDetailVideo.id, hrs = type === 'ad' ? (APP_CONFIG.adUnlockDurationHours || 2) : (APP_CONFIG.pointsUnlockDurationHours || 24);
    videoUnlockExpiryMap[vId] = Date.now() + (hrs * 3600000);
    saveUnlockProgress();
    updateUnlockProgressUI();
    showToast(APP_LANG === 'bn' ? "ভিডিও আনলক সফল হয়েছে!" : "Video unlocked successfully!", "success");
    setTimeout(() => playMovie(activeDetailVideo), 800);
}

/* =================== CLOUDFLARE WORKER STREAM PLAYER =================== */
async function playMovie(videoObj) {
    if (!videoObj) return;
    pendingActionAfterJoin = () => playMovie(videoObj);
    if (!await verifyUserMembershipNow()) return;

    const links = videoObj.links || extractVideoLinks(videoObj);
    const targetUrl = links[currentPlayingPartIndex || 0]?.url || videoObj.url;

    if (targetUrl && isTelegramUrl(targetUrl)) {
        return openTelegramDirect(targetUrl);
    }

    openDirectPlayer(videoObj, currentPlayingPartIndex || 0);
}

async function getPlayableStreamUrl(rawUrl, videoId) {
    if (!APP_CONFIG.cloudflareStreamApi) return rawUrl;
    const apiBase = APP_CONFIG.cloudflareStreamApi.replace(/\/$/, '');
    const endpoint = `${apiBase}?url=${encodeURIComponent(rawUrl)}&id=${encodeURIComponent(videoId || '')}`;
    try {
        const res = await fetch(endpoint, { method: 'GET' });
        if (res.ok) {
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const json = await res.json();
                return json.streamUrl || json.url || json.playableUrl || json.link || rawUrl;
            }
        }
        return endpoint;
    } catch (err) {
        return rawUrl;
    }
}

async function openDirectPlayer(videoObj, startIndex = 0) {
    triggerHaptic('light');
    const links = videoObj.links || extractVideoLinks(videoObj);
    if (!links?.length || !links[0].url) {
        return showToast(APP_LANG === 'bn' ? "ভিডিও লিংক পাওয়া যায়নি!" : "Video link not found!", "error");
    }

    currentPlayingPartIndex = (startIndex >= 0 && startIndex < links.length) ? startIndex : 0;
    const rawTargetUrl = (links[currentPlayingPartIndex].url || '').trim();

    if (isTelegramUrl(rawTargetUrl)) { 
        closeWebVideoPlayer(); 
        return openTelegramDirect(rawTargetUrl); 
    }

    $('web-player-title').innerText = `${videoObj.title} - ${links[currentPlayingPartIndex].name || ''}`;
    renderPlayerPartsBar(links, currentPlayingPartIndex);
    $('web-player-modal').style.display = 'flex';
    updateTelegramBackButtonState();

    showToast(APP_LANG === 'bn' ? "ভিডিও প্রস্তুত হচ্ছে..." : "Loading stream...", "info");

    let playableUrl = await getPlayableStreamUrl(rawTargetUrl, videoObj.id);
    currentStreamUrl = playableUrl;
    playStreamUrlInPlayer(playableUrl);
}

function renderPlayerPartsBar(links, activeIndex) {
    const c = $('player-parts-container'), s = $('player-parts-scroll');
    if (!c || !s) return;
    if (links.length <= 1) { c.style.display = 'none'; return; }
    c.style.display = 'block';
    s.innerHTML = links.map((it, i) => `<div class="player-part-pill ${i === activeIndex ? 'active':''}" onclick="switchPlayerPart(${i})"><i class="fa-solid fa-circle-play"></i> ${it.name}</div>`).join('');
}

async function switchPlayerPart(idx) {
    triggerHaptic('light');
    if (!await verifyUserMembershipNow()) { closeWebVideoPlayer(); return; }
    const video = activeDetailVideo;
    if (!video?.links?.[idx]) return;
    currentPlayingPartIndex = idx;
    const rawTargetUrl = (video.links[idx].url || '').trim();

    if (isTelegramUrl(rawTargetUrl)) { 
        closeWebVideoPlayer(); 
        return openTelegramDirect(rawTargetUrl); 
    }

    $('web-player-title').innerText = `${video.title} - ${video.links[idx].name || ''}`;
    renderPlayerPartsBar(video.links, idx);

    let playableUrl = await getPlayableStreamUrl(rawTargetUrl, video.id);
    currentStreamUrl = playableUrl;
    playStreamUrlInPlayer(playableUrl);
}

function playStreamUrlInPlayer(url) {
    const v = $('in-app-video-element'), f = $('in-app-iframe-element');
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    if (!url) return showToast(APP_LANG === 'bn' ? "লিঙ্ক পাওয়া যায়নি!" : "Link not found!", "error");

    v.onended = () => {
        if (activeDetailVideo?.links && currentPlayingPartIndex < activeDetailVideo.links.length - 1) switchPlayerPart(currentPlayingPartIndex + 1);
    };

    if (['drive.google.com', 'youtube.com/embed', 'embed'].some(x => url.includes(x))) {
        v.pause(); v.removeAttribute('src'); v.load(); v.style.display = 'none';
        f.src = url; f.style.display = 'block';
    } else {
        f.src = ""; f.style.display = 'none'; v.style.display = 'block';
        if (url.includes('.m3u8')) {
            if (window.Hls?.isSupported()) {
                hlsInstance = new Hls(); hlsInstance.loadSource(url); hlsInstance.attachMedia(v);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(()=>{}));
            } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
                v.src = url; v.play().catch(()=>{});
            }
        } else { v.src = url; v.play().catch(()=>{}); }
    }
}

function closeWebVideoPlayer() {
    triggerHaptic('light');
    const v = $('in-app-video-element'), f = $('in-app-iframe-element');
    if (v) { v.pause(); v.removeAttribute('src'); v.onended = null; v.load(); }
    if (f) f.src = "";
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    $('web-player-modal').style.display = 'none';
    updateTelegramBackButtonState();
}

function switchNavTab(tabName, el) {
    triggerHaptic('light');
    currentActiveTab = tabName;
    
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    closePayoutView();
    closeSeriesDrawer();
    $('video-unlock-detail-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if (tabName === 'adult') checkAdultAgePrompt();

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =================== IN-PAGE PAYOUT VIEW HANDLERS =================== */
function openPayoutView() {
    triggerHaptic('light');
    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    $('video-unlock-detail-view').style.display = 'none';
    $('earn-hub-view').style.display = 'none';
    $('dedicated-ad-view').style.display = 'none';
    $('main-header').style.display = 'none';
    $('payout-view').style.display = 'block';
    updateUserUI(); 
    switchPayoutInnerTab('form'); 
    updateGatewaysAvailabilityUI(); 
    updateTelegramBackButtonState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePayoutView() {
    triggerHaptic('light');
    $('payout-view').style.display = 'none';
    $('main-header').style.display = 'block';
    if ($('tab-' + currentActiveTab)) $('tab-' + currentActiveTab).style.display = 'block';
    updateTelegramBackButtonState();
}

function openPayoutMethodsModal() { openPayoutView(); }
function closePayoutModal() { closePayoutView(); }

function switchPayoutInnerTab(tab) {
    triggerHaptic('light');
    const isForm = tab === 'form';
    $('tab-btn-withdraw-form').classList.toggle('active', isForm);
    $('tab-btn-withdraw-history').classList.toggle('active', !isForm);
    $('payout-form-view').style.display = isForm ? 'block' : 'none';
    $('payout-history-view').style.display = isForm ? 'none' : 'block';
    if ($('payout-balance-card-box')) $('payout-balance-card-box').style.display = isForm ? 'flex' : 'none';
    if (!isForm) loadWithdrawalHistory();
}

function selectSimOperator(operator, el) {
    triggerHaptic('light');
    selectedSimOperator = operator;
    document.querySelectorAll('.sim-opt-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
}

function getGatewayMinPoints(gw) {
    return { bKash: APP_CONFIG.minWithdrawBkash || 100, Nagad: APP_CONFIG.minWithdrawNagad || 100, Recharge: APP_CONFIG.minWithdrawRecharge || 40 }[gw] || APP_CONFIG.minWithdrawPoints || 100;
}

function selectGateway(gw) {
    if (!isGatewayEnabled(gw)) return showToast(APP_LANG === 'bn' ? `${gw} বর্তমানে বন্ধ রয়েছে!` : `${gw} is currently disabled!`, "error");
    triggerHaptic('light');
    currentSelectedGateway = gw;
    ['bKash', 'Nagad', 'Recharge'].forEach(g => $(`gw-card-${g}`)?.classList.toggle('active', g === gw));
    if ($('sim-operator-container')) $('sim-operator-container').style.display = (gw === 'Recharge') ? 'block' : 'none';

    const minPts = getGatewayMinPoints(gw), minTk = Math.round(minPts * (APP_CONFIG.pointsToTakaRate || 0.3)), t = I18N[APP_LANG];
    $('payout-min-limit-alert').innerText = `${t.minWithdrawPrefix} ${formatNumber(minPts)} ${t.unitPoints} (${formatNumber(minTk)} ${t.currencySymbol})`;
}

function calculateWithdrawTakaPreview() {
    const val = parseInt($('pay-amount').value), tag = $('payout-live-calc-tag');
    tag.innerText = (!isNaN(val) && val > 0) ? `= ${formatNumber((Math.round(val * (APP_CONFIG.pointsToTakaRate || 0.3) * 100) / 100).toFixed(2))} ${I18N[APP_LANG].currencySymbol}` : '';
}

async function loadWithdrawalHistory() {
    const list = $('payout-history-list');
    if (!db || !currentUser?.id) return;
    list.innerHTML = "";

    try {
        const snap = await db.collection("withdrawals").where("userId", "==", String(currentUser.id)).limit(40).get();
        if (snap.empty) { list.innerHTML = `<div style="text-align:center; padding:22px; color:#8ba2c4; font-size:14px; font-weight:800;">${APP_LANG === 'bn' ? 'কোনো হিস্টোরি পাওয়া যায়নি!' : 'No history found!'}</div>`; return; }

        let items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.timestamp?.seconds || new Date(b.timestamp || 0).getTime()/1000) - (a.timestamp?.seconds || new Date(a.timestamp || 0).getTime()/1000));

        list.innerHTML = items.slice(0, 20).map(item => {
            const s = (item.status || '').toLowerCase();
            const statusClass = s.includes('approve') ? 'status-approved' : (s.includes('reject') ? 'status-rejected' : 'status-pending');
            const gw = item.gateway === 'Recharge' || item.gateway === 'রিচার্জ' ? (APP_LANG === 'bn' ? `রিচার্জ (${item.operator || ''})` : `Recharge (${item.operator || ''})`) : (item.gateway === 'bKash' ? (APP_LANG === 'bn' ? 'বিকাশ' : 'bKash') : (APP_LANG === 'bn' ? 'নগদ' : 'Nagad'));
            return `
            <div class="history-card-item shimmer-card-effect" style="flex-direction:column; align-items:stretch; gap:6px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="hci-left">
                        <div style="font-size:13px; font-weight:800; color:var(--primary); margin-bottom:2px;"><i class="fa-solid fa-user"></i> ${item.userName || currentUser.first_name || 'User'} <span style="font-size:11px; color:#8ba2c4;">${item.userUsername ? `@${item.userUsername}` : ''}</span></div>
                        <h5 style="font-size:14.5px; color:#fff; font-weight:900; margin: 2px 0;">${gw} - ${item.number}</h5>
                        <p style="font-size:12px; color:#8ba2c4; font-weight:700;">${formatNumber(item.points || 0)} ${I18N[APP_LANG].unitPoints}</p>
                    </div>
                    <div class="hci-right"><div style="font-size:16px; font-weight:900; color:#00f260; text-shadow:0 0 8px rgba(0,242,96,0.5);">${I18N[APP_LANG].currencySymbol} ${formatNumber(item.amountBDT)}</div><span class="hci-status-badge ${statusClass}">${item.status}</span></div>
                </div>
                <div style="border-top:1px dashed rgba(255,255,255,0.08); padding-top:6px; display:flex; justify-content:space-between; font-size:12px; color:#8ba2c4; font-weight:700;">
                    <span>রেফার: <b style="color:var(--primary);">${formatNumber(item.totalReferralsSnapshot ?? 0)}</b> (আয়: <b style="color:#ffe000;">${formatNumber(item.refEarnedSnapshot ?? 0)}</b> pt)</span>
                    <span>অবশিষ্ট ব্যালেন্স: <b style="color:#00f260;">${item.remainingBalanceSnapshot !== undefined ? formatNumber(item.remainingBalanceSnapshot) : '---'}</b> pt</span>
                </div>
            </div>`;
        }).join('');
    } catch { list.innerHTML = `<div style="text-align:center; padding:18px; color:#ff0844; font-weight:800;">হিস্টোরি লোড হতে সমস্যা হয়েছে</div>`; }
}

async function submitWithdrawalRequest() {
    triggerHaptic('medium');

    if (!isGatewayEnabled(currentSelectedGateway)) {
        return showToast(`${currentSelectedGateway} মাধ্যমটি বর্তমানে বন্ধ আছে!`, "error");
    }

    const numInput = $('pay-number');
    const amountInput = $('pay-amount');
    const num = numInput.value.trim();
    const pts = Number(amountInput.value);
    const minPts = getGatewayMinPoints(currentSelectedGateway);

    if (!num) return showToast("মোবাইল নম্বর প্রদান করুন!", "error");
    if (!pts || pts < minPts) return showToast(`নূন্যতম উত্তোলন: ${formatNumber(minPts)} পয়েন্ট!`, "error");

    const btn = $('btn-submit-payout');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> সার্ভার যাচাই করছে...`;

    try {
        const WORKER_URL = "https://withdraw-api-e843.rakibkdbb.workers.dev/api/request-withdrawal";

        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

        numInput.value = '';
        amountInput.value = '';
        $('payout-live-calc-tag').innerText = '';

        triggerHaptic('success');
        showToast(data.message || "উত্তোলন রিকোয়েস্ট সফল হয়েছে!", "success");

        switchPayoutInnerTab('history');

    } catch (err) {
        triggerHaptic('error');
        showToast(err.message || "ত্রুটি হয়েছে, আবার চেষ্টা করুন!", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = I18N[APP_LANG].btnSubmitPayout;
    }
}

function universalCopyText(text, msg) {
    triggerHaptic('light');
    let copied = false;
    try {
        const t = document.createElement("textarea");
        t.value = text; t.style.position = "fixed"; t.style.left = "-9999px";
        document.body.appendChild(t); t.focus(); t.select();
        copied = document.execCommand('copy');
        document.body.removeChild(t);
    } catch {}

    if (copied) showToast(msg, "success");
    else if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast(msg, "success")).catch(() => showToast("কপি করা সম্ভব হয়নি!", "error"));
    } else showToast("কপি করা সম্ভব হয়নি!", "error");
}

function copyReferCode() { universalCopyText(String(currentUser.id), APP_LANG === 'bn' ? "রেফার কোড কপি হয়েছে!" : "Referral code copied!"); }
function copyReferLink() { universalCopyText(`https://t.me/${APP_CONFIG.botUsername || "Ret2_bot"}/${APP_CONFIG.appShortName}?startapp=${currentUser.id}`, APP_LANG === 'bn' ? "লিংক কপি হয়েছে!" : "Link copied!"); }

function shareReferralLink() {
    triggerHaptic('medium');
    const url = `https://t.me/${APP_CONFIG.botUsername || "Ret2_bot"}/${APP_CONFIG.appShortName}?startapp=${currentUser.id}`;
    const msg = APP_LANG === 'bn' ? "🔥 এইচডি মুভি ও নাটক ফ্রিতে দেখুন!" : "🔥 Watch HD Movies & Shows Free!";
    openTelegramDirect(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`);
}

function toggleSearchBox() {
    triggerHaptic('light');
    const s = $('search-container');
    s.style.display = s.style.display === 'none' ? 'block' : 'none';
    if (s.style.display === 'block') $('video-search-input').focus();
}

function debouncedSearch() {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
        currentPageMap.movies = 1; currentPageMap.series = 1; currentPageMap.adult = 1;
        filterVideosUI();
    }, 180);
}

function filterVideosUI() {
    const q = ($('video-search-input')?.value || '').toLowerCase().trim();
    const filterSection = (sectionName, baseFilterFn) => {
        let list = allLoadedVideos.filter(baseFilterFn);

        const currentCat = activeSelectedCategory[sectionName];
        if (currentCat && currentCat !== 'all') {
            list = list.filter(v => {
                const videoCat = (v.category || '').toLowerCase();
                return videoCat.includes(currentCat.toLowerCase());
            });
        }

        if (['adult_hot', 'top_rated', 'trending'].includes(activeHeroFilterTags[sectionName])) {
            list = [...list].sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)));
        }

        if (q) {
            list = list.filter(v => {
                const title = (v.title || '').toLowerCase();
                const cat = (v.category || '').toLowerCase();
                return title.includes(q) || cat.includes(q);
            });
        }

        return list;
    };

    renderVideosForGrid('movies', filterSection('movies', isMovieVideo));
    renderVideosForGrid('series', filterSection('series', isSeriesVideo));
    renderVideosForGrid('adult', filterSection('adult', isAdultVideo));
}

document.addEventListener('DOMContentLoaded', initApp);