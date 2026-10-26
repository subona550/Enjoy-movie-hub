/**
 * EARNHUB PRO - ADVANCED CLIENT ENGINE (v4.1.0)
 * Architecture: Clean Web3/FinTech Minimal
 * 
 * Features Included:
 * - Native In-Page Ad Task Full View Screen
 * - Modern Card-Based Ad Layout
 * - Telegram Native WebApp SDK (BackButton, Haptic, Fullscreen)
 * - Monetag Rewarded Interstitial Ad Integration
 * - Adsgram Dynamic Ad Stream (Rewarded & Interstitial Swap Engine)
 * - Firebase Realtime Database Full Admin Sync
 * - 7-Day Progressive Streak Check-in System
 * - Real-time Point-to-BDT Conversion & Cashout Engine
 * - Zero-Dependency WebAudio Sound Synthesizer
 */

// ================= ১. অডিও সিন্থেসাইজার (WebAudio) =================
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

// ================= ২. টেলিগ্রাম নেটিভ SDK ও হ্যাপটিক =================
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
    }, 2600);
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

// ================= ৩. ফায়ারবেস ইনিশিয়ালাইজেশন =================
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

// ================= ৪. ইউজার তথ্য ও গ্লোবাল স্টেট =================
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
const userName = (tgUser.first_name || 'User') + (tgUser.last_name ? ' ' + tgUser.last_name : '');
const userUsername = tgUser.username ? '@' + tgUser.username : '@user_' + userId.slice(-4);

// গ্লোবাল ভেরিয়েবল
let balancePoints = 0;
let adsWatchedCount = 0;
let referralCount = 0;
let referralEarnings = 0;
let lastCheckInDate = "";
let checkInStreak = 0;

let currentLang = localStorage.getItem('app_lang') || 'bn';
const checkInRewards = [10, 20, 30, 45, 60, 80, 150];

// সেটিংস
let targetAds = 20;
let pointsToBdtRate = 0.10;
let minWithdrawPoints = 200;
let referralBonusPoints = 50;
let welcomeBonusPoints = 100;
let myReferralLink = `https://t.me/?startapp=ref_${userId}`;

let selectedWithdrawMethod = 'recharge';
let selectedNetwork = 'monetag';

// অ্যাড নেটওয়ার্ক সেটিংস অবজেক্ট
let netConfigs = {
    monetag: {
        zoneId: "8765432",
        reward: 15
    },
    adsgram: {
        rewardedBlockId: "26019",
        interstitialBlockId: "26020",
        mode: "swap",
        reward: 20
    },
    adsterra: {
        url: "https://beta.publishers.adsterra.com/direct-link-sample",
        reward: 15
    }
};

let adsgramNextFormat = 'rewarded';

// হেল্পার ফাংশন
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

// ================= ৫. ফায়ারবেস অ্যাডমিন সেটিংস সিঙ্ক =================
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

    if (data.telegramChannel) {
        const tgLink = document.getElementById('telegram-support-link');
        if (tgLink) tgLink.href = data.telegramChannel;
    }

    document.querySelectorAll('.reward-monetag-val').forEach(el => el.innerText = netConfigs.monetag.reward);
    document.querySelectorAll('.reward-adsgram-val').forEach(el => el.innerText = netConfigs.adsgram.reward);
    document.querySelectorAll('.reward-adsterra-val').forEach(el => el.innerText = netConfigs.adsterra.reward);

    const modeTag = document.getElementById('adsgram-mode-tag');
    if (modeTag) {
        modeTag.innerText = netConfigs.adsgram.mode === 'swap' ? 'Swap Mode' : (netConfigs.adsgram.mode.toUpperCase());
    }

    const rateTextEl = document.getElementById('display-point-rate-text');
    if (rateTextEl) {
        rateTextEl.innerText = `১০০ পয়েন্ট = ${(100 * pointsToBdtRate).toFixed(2)} ৳`;
    }

    const wbModal = document.getElementById('welcome-bonus-modal');
    if (wbModal) wbModal.innerText = welcomeBonusPoints;

    const refBonusEl = document.getElementById('display-ref-bonus');
    if (refBonusEl) refBonusEl.innerText = referralBonusPoints;

    updateUI();
});

// ================= ৬. ইউজার ডাটা হ্যান্ডলার ও রিসেট =================
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
        });
    });
}

function updateUI() {
    const setElem = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElem('user-balance', balancePoints);
    setElem('withdraw-page-balance', balancePoints);
    setElem('profile-stat-balance', `${balancePoints} Pts`);
    setElem('profile-stat-ref', `${referralCount} জন`);
    setElem('home-ref-count', referralCount);
    setElem('home-ref-earnings', referralEarnings);

    // টাস্ক প্রোগ্রেস বার
    setElem('home-ad-counter', `${adsWatchedCount} / ${targetAds}`);
    const pct = Math.min((adsWatchedCount / targetAds) * 100, 100);
    const fill = document.getElementById('home-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const fvLimit = document.getElementById('fv-limit-count');
    if (fvLimit) fvLimit.innerText = `${adsWatchedCount} / ${targetAds}`;
}

// ================= ৭. ইন-পেজ ফুলভিউ স্ক্রিন ও অ্যাড কন্ট্রোলার =================
function openNetworkFullView(networkKey) {
    playClickSound();
    triggerHaptic('light');
    selectedNetwork = networkKey;
    const screen = document.getElementById('network-fullview');

    const details = {
        monetag: {
            title: "Monetag Rewarded Task",
            badge: "MONETAG OFFICIAL PARTNER",
            headline: "Monetag Rewarded Ad",
            desc: "ভিডিওটি মনোযোগ সহকারে দেখলে পয়েন্ট সরাসরি মূল ব্যালেন্সে যুক্ত হবে।",
            iconClass: "task-blue",
            iconSvg: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-2 10h8L7 22l2-10H1z"/></svg>`
        },
        adsgram: {
            title: "Adsgram Ad Stream",
            badge: `ADSGRAM (${netConfigs.adsgram.mode.toUpperCase()})`,
            headline: "Adsgram Sponsored Task",
            desc: "ভিডিও অথবা ইন্টারস্টিশিয়াল বিজ্ঞাপন সম্পন্ন হলে সাথে সাথে রিওয়ার্ড ক্রেডিট হবে।",
            iconClass: "task-mint",
            iconSvg: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="5" rx="2"/><polyline points="10 9 15 12.5 10 16"/></svg>`
        },
        adsterra: {
            title: "Direct Sponsor Visit",
            badge: "SPONSOR DIRECT TASK",
            headline: "Sponsor Page Visit",
            desc: "স্পনসর পেজটিতে ১০-১২ সেকেন্ড সক্রিয়ভাবে ভিজিট সম্পূর্ণ করুন।",
            iconClass: "task-purple",
            iconSvg: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
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
    document.getElementById('fv-reward-amount').innerText = `+${netConfigs[networkKey].reward} PTS`;
    document.getElementById('fv-limit-count').innerText = `${adsWatchedCount} / ${targetAds}`;

    // ফুল স্ক্রিন ওপেন
    screen.classList.add('active');

    // টেলিগ্রামের নেটিভ BackButton বাইন্ড
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
        return showToast('⚠️ আজকের বিজ্ঞাপন দেখার সীমা শেষ হয়েছে!', 'error');
    }

    const actionBtn = document.getElementById('fv-action-btn');
    actionBtn.disabled = true;

    try {
        // ১. Monetag Rewarded Interstitial
        if (selectedNetwork === 'monetag') {
            const sdkFunc = window[`show_${netConfigs.monetag.zoneId}`];
            if (typeof sdkFunc === 'function') {
                showToast('⚡ বিজ্ঞাপন প্রস্তুত হচ্ছে...');
                try {
                    await sdkFunc({ type: 'rewarded' });
                    await creditPoints(netConfigs.monetag.reward);
                    closeNetworkFullView();
                } catch (sdkErr) {
                    console.warn("Monetag Rewarded fallback to direct link:", sdkErr);
                    window.open(`https://omulgous.com/4/${netConfigs.monetag.zoneId}`, '_blank');
                    handleTimedTask(netConfigs.monetag.reward);
                }
            } else {
                window.open(`https://omulgous.com/4/${netConfigs.monetag.zoneId}`, '_blank');
                handleTimedTask(netConfigs.monetag.reward);
            }
        }

        // ২. Adsgram Swap সিস্টেম
        else if (selectedNetwork === 'adsgram') {
            if (typeof window.Adsgram === 'undefined') {
                actionBtn.disabled = false;
                return showToast('⚠️ Adsgram SDK লোড হতে পারেনি!', 'error');
            }

            let blockIdToUse = netConfigs.adsgram.rewardedBlockId;
            let formatUsed = "rewarded";

            if (netConfigs.adsgram.mode === 'swap') {
                if (adsgramNextFormat === 'rewarded') {
                    blockIdToUse = netConfigs.adsgram.rewardedBlockId;
                    formatUsed = "rewarded";
                    adsgramNextFormat = 'interstitial';
                } else {
                    blockIdToUse = netConfigs.adsgram.interstitialBlockId;
                    formatUsed = "interstitial";
                    adsgramNextFormat = 'rewarded';
                }
            } else if (netConfigs.adsgram.mode === 'interstitial') {
                blockIdToUse = netConfigs.adsgram.interstitialBlockId;
                formatUsed = "interstitial";
            } else {
                blockIdToUse = netConfigs.adsgram.rewardedBlockId;
                formatUsed = "rewarded";
            }

            showToast(`🎬 বিজ্ঞাপন শুরু হচ্ছে (${formatUsed})...`);

            const adController = window.Adsgram.init({ blockId: blockIdToUse });
            await adController.show();
            await creditPoints(netConfigs.adsgram.reward);
            closeNetworkFullView();
        }

        // ৩. Adsterra Direct Task
        else if (selectedNetwork === 'adsterra') {
            window.open(netConfigs.adsterra.url, '_blank');
            handleTimedTask(netConfigs.adsterra.reward);
        }
    } catch (err) {
        showToast('⚠️ বিজ্ঞাপন সম্পন্ন হয়নি বা বাতিল করা হয়েছে।', 'error');
    } finally {
        actionBtn.disabled = false;
    }
}

function handleTimedTask(pointsReward) {
    const actionBtn = document.getElementById('fv-action-btn');
    let timerSeconds = 12;
    actionBtn.innerText = `⏳ অপেক্ষা করুন (${timerSeconds}s)...`;

    const countdown = setInterval(() => {
        timerSeconds--;
        if (timerSeconds > 0) {
            actionBtn.innerText = `⏳ অপেক্ষা করুন (${timerSeconds}s)...`;
        } else {
            clearInterval(countdown);
            creditPoints(pointsReward);
            actionBtn.innerText = 'বিজ্ঞাপন দেখুন ও পয়েন্ট নিন';
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
        showToast(`🎉 +${reward} পয়েন্ট অ্যাকাউন্টে যোগ হয়েছে!`);
    }
}

// ================= ৮. ক্যাশআউট / উত্তোলন কন্ট্রোলার =================
function switchWithdrawMethod(method) {
    playClickSound();
    triggerHaptic('light');
    selectedWithdrawMethod = method;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-method-${method}`);
    if (activeBtn) activeBtn.classList.add('active');

    const grpOperator = document.getElementById('group-operator');
    const labelAcc = document.getElementById('label-acc-type');
    const selectAcc = document.getElementById('withdraw-account-type');
    const phoneInput = document.getElementById('withdraw-phone');
    const minWithdrawEl = document.getElementById('display-min-withdraw');

    if (method === 'recharge') {
        if (grpOperator) grpOperator.style.display = 'block';
        if (labelAcc) labelAcc.innerText = 'সিম টাইপ (SIM Type):';
        if (selectAcc) selectAcc.innerHTML = '<option value="Prepaid">প্রিপেইড (Prepaid)</option><option value="Postpaid">পোস্টপেইড (Postpaid)</option>';
        if (phoneInput) phoneInput.placeholder = '01XXXXXXXXX';
        minWithdrawPoints = 200;
    } else {
        if (grpOperator) grpOperator.style.display = 'none';
        if (labelAcc) labelAcc.innerText = 'অ্যাকাউন্ট ধরন:';
        if (selectAcc) selectAcc.innerHTML = '<option value="Personal">পার্সোনাল (Personal)</option><option value="Agent">এজেন্ট (Agent)</option>';
        if (phoneInput) phoneInput.placeholder = method === 'bkash' ? '01XXXXXXXXX (বিকাশ)' : '01XXXXXXXXX (নগদ)';
        minWithdrawPoints = 500;
    }

    if (minWithdrawEl) minWithdrawEl.innerText = minWithdrawPoints;
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
        if (bdtValueEl) bdtValueEl.innerText = (pointsValue * pointsToBdtRate).toFixed(2);
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
        return showToast(`⚠️ সর্বনিম্ন উত্তোলন ${minWithdrawPoints} পয়েন্ট হতে হবে।`, 'error');
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
        return showToast('⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।', 'error');
    }
    if (pointsToDeduct > balancePoints) {
        return showToast('⚠️ আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।', 'error');
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
        showToast(`⚡ ${methodName} রিকোয়েস্ট সফলভাবে জমা হয়েছে!`);
    } catch (err) {
        showToast('⚠️ পর্যাপ্ত পয়েন্ট নেই অথবা ডাটাবেজ ত্রুটি ঘটেছে।', 'error');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// ================= ৯. উইথড্রয়াল হিস্ট্রি বটম শিট =================
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
    listContainer.innerHTML = '<div class="loading-state">ডাটা লোড হচ্ছে...</div>';

    db.ref('withdrawals').orderByChild('userId').equalTo(userId).once('value', snapshot => {
        if (!snapshot.exists()) {
            listContainer.innerHTML = '<div style="text-align:center; padding:24px; font-size:12px; color:#64748B;">কোনো উত্তোলনের হিস্ট্রি পাওয়া যায়নি।</div>';
            return;
        }

        let itemsHTML = '';
        snapshot.forEach(child => {
            const item = child.val();
            const statusLower = (item.status || 'Pending').toLowerCase();
            const badgeClass = statusLower === 'approved' ? 'st-approved' : (statusLower === 'rejected' ? 'st-rejected' : 'st-pending');
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';

            itemsHTML = `
                <div class="h-item">
                    <div>
                        <div class="h-title">${escapeHtml(item.method)} (${escapeHtml(item.phone)})</div>
                        <div class="h-date">${dateStr}</div>
                    </div>
                    <div>
                        <div class="h-pts">- ${item.pointsDeducted} Pts</div>
                        <div style="text-align:right;"><span class="h-badge ${badgeClass}">${escapeHtml(item.status)}</span></div>
                    </div>
                </div>
            ` + itemsHTML;
        });

        listContainer.innerHTML = itemsHTML;
    });
}

// ================= ১০. ডেইলি ৭-দিনের চেক-ইন সিস্টেম =================
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

    if (statusText) statusText.innerText = `বর্তমান স্ট্রিক: ${checkInStreak} দিন`;
    if (homeStreakText) {
        homeStreakText.innerText = isClaimedToday ? `স্ট্রিক: ${checkInStreak} দিন (নেওয়া হয়েছে)` : `দিন ${(checkInStreak % 7) + 1} রিওয়ার্ড`;
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
                <span class="ci-num">দিন ${i}</span>
                <span class="ci-pts">+${rewardPts}</span>
            </div>
        `;
    }
    grid.innerHTML = html;

    if (isClaimedToday) {
        claimBtn.disabled = true;
        claimBtn.innerText = '✅ আজকের বোনাস নেওয়া হয়েছে';
    } else {
        claimBtn.disabled = false;
        claimBtn.innerText = `🎁 আজকের রিওয়ার্ড সংগ্রহ করুন (+${checkInRewards[currentTargetDay - 1]} Pts)`;
    }
}

async function claimDailyCheckIn() {
    playClickSound();
    triggerHaptic('medium');
    const today = localDateKey();
    const claimBtn = document.getElementById('btn-claim-checkin');

    if (lastCheckInDate === today) {
        return showToast('⚠️ আজ ইতিমধ্যে বোনাস সংগ্রহ করেছেন!', 'error');
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

        if (!tx.committed) return showToast('⚠️ ইতিমধ্যে ক্লেইম করা হয়েছে!', 'error');

        playRewardSound();
        triggerConfetti();
        triggerHaptic('notification_success');
        showToast(`🎉 দিন ${tx.snapshot.val().checkInStreak}-এর বোনাস +${earnedPoints} পয়েন্ট যোগ হয়েছে!`);
        renderCheckInGrid();
    } catch (err) {
        showToast('⚠️ বোনাস গ্রহণে সমস্যা হয়েছে।', 'error');
    } finally {
        if (claimBtn) claimBtn.disabled = false;
    }
}

// ================= ১১. রেফারেল ও ট্যাব নেভিগেশন =================
function copyReferralLink() {
    playClickSound();
    triggerHaptic('light');
    navigator.clipboard.writeText(myReferralLink).then(() => {
        showToast('✅ রেফারেল লিংক কপি হয়েছে!');
    });
}

function shareReferralLink() {
    playClickSound();
    triggerHaptic('light');
    const shareText = `🎉 আমাদের প্ল্যাটফর্মে যোগ দিন এবং সহজ বিজ্ঞাপন টাস্ক করে জিতে নিন পয়েন্ট!\n\n👇 জয়েন করুন:\n${myReferralLink}`;
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

function toggleLanguage() {
    playClickSound();
    triggerHaptic('light');
    currentLang = currentLang === 'bn' ? 'en' : 'bn';
    localStorage.setItem('app_lang', currentLang);
    const langInd = document.getElementById('lang-indicator');
    if (langInd) langInd.innerText = currentLang === 'bn' ? 'EN' : 'BN';
}

// ================= ১২. অ্যাপ লাইফসাইকেল ইনিশিয়ালাইজেশন =================
document.addEventListener('DOMContentLoaded', () => {
    const initialLetter = (userName.charAt(0) || 'U').toUpperCase();
    const hAvatar = document.getElementById('header-avatar');
    const pAvatar = document.getElementById('profile-avatar');
    const hName = document.getElementById('header-name');
    const pName = document.getElementById('profile-page-name');
    const pUname = document.getElementById('profile-page-username');
    const pId = document.getElementById('profile-page-id');

    if (hAvatar) hAvatar.innerText = initialLetter;
    if (pAvatar) pAvatar.innerText = initialLetter;
    if (hName) hName.innerText = userName;
    if (pName) pName.innerText = userName;
    if (pUname) pUname.innerText = userUsername;
    if (pId) pId.innerText = `ID: #${userId}`;

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
