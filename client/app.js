/**
 * Vicinus - Main Application Logic
 * unified SPA handling routing, auth, and views.
 */

const API_URL = 'http://localhost:5000/api';

const state = {
    user: null,
    token: localStorage.getItem('token') || null,
    currentRoute: window.location.hash || '#/',
    communities: [],
    information: []
};

// Utilities
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
    toast.className = `px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${color} flex flex-col pointer-events-auto opacity-0 translate-x-4`;
    
    const icon = type === 'success' ? 'check_circle' : 'error';
    toast.innerHTML = `<div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">${icon}</span><span>${message}</span></div>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-x-4');
    }, 10);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-4');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const fetchAPI = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(state.token ? { 'Authorization': `Bearer ${state.token}` } : {}),
        ...options.headers
    };
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data;
    } catch (err) {
        showToast(err.message, 'error');
        throw err;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

// Auth
const checkAuth = async () => {
    if (state.token) {
        try {
            const res = await fetchAPI('/auth/me');
            state.user = res.user;
        } catch (e) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    }
};

const logout = () => {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
    showToast('Logged out successfully');
    navigate('#/login');
};

const getStatusBadge = (status) => {
    switch(status) {
        case 'VERIFIED': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">🟢 Verified</span>';
        case 'NEEDS_VERIFICATION': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">🟡 Needs Verification</span>';
        case 'UNDER_REVIEW': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/60 dark:border-orange-500/20">🟠 Under Review</span>';
        case 'REPORTED': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20">🔴 Reported</span>';
        case 'RESOLVED': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">🔵 Resolved</span>';
        case 'EXPIRED': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">⚫ Expired</span>';
        case 'REMOVED': return '<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700">⚪ Removed</span>';
        default: return '';
    }
};

const getCategoryIcon = (category) => {
    switch(category) {
        case 'internships': return '🎓';
        case 'scholarships': return '💰';
        case 'events': return '🎉';
        case 'lost_found': return '🔎';
        case 'emergencies': return '🚨';
        case 'local_issues': return '🚧';
        case 'announcements': return '📢';
        default: return '📍';
    }
}

// Router
const navigate = (hash) => {
    window.location.hash = hash;
};

const router = async () => {
    state.currentRoute = window.location.hash || '#/';
    renderHeader();
    const root = document.getElementById('app-root');
    root.innerHTML = '<div class="flex justify-center p-12"><span class="material-symbols-outlined animate-spin text-primary text-4xl">sync</span></div>';

    if (state.currentRoute === '#/') {
        await renderHome(root);
    } else if (state.currentRoute === '#/login') {
        renderLogin(root);
    } else if (state.currentRoute === '#/register') {
        renderRegister(root);
    } else if (state.currentRoute === '#/discover') {
        await renderDiscover(root);
    } else if (state.currentRoute === '#/share') {
        renderShare(root);
    } else if (state.currentRoute === '#/my-activity') {
        await renderMyActivity(root);
    } else if (state.currentRoute === '#/moderation') {
        await renderModeration(root);
    } else if (state.currentRoute.startsWith('#/information/')) {
        await renderInformationDetail(root, state.currentRoute.split('/')[2]);
    } else {
        root.innerHTML = '<div class="p-12 text-center text-xl font-bold">404 Not Found</div>';
    }
};

window.addEventListener('hashchange', router);

// Init
const init = async () => {
    await checkAuth();
    router();
};

init();
