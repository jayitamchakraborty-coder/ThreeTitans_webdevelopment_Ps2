// ──────────────────────────────────────────────────
//  Header + Home View
// ──────────────────────────────────────────────────

const renderHeader = () => {
    const header = document.getElementById('app-header');
    const r = state.currentRoute;

    const navLink = (hash, label, icon) => {
        const active = r === hash;
        return `<a class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${active ? 'bg-primary/10 text-primary dark:text-indigo-400 font-semibold' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'}" href="${hash}">
            <span class="material-symbols-outlined text-[18px]">${icon}</span>${label}
        </a>`;
    };

    const userMenu = state.user ? `
    <div class="relative group">
        <button aria-label="User menu" class="flex items-center gap-1.5 focus:outline-none" type="button">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold flex items-center justify-center text-[11px] tracking-wide shadow-sm ring-2 ring-white dark:ring-black">
                ${state.user.name.substring(0, 2).toUpperCase()}
            </div>
        </button>
        <div class="absolute right-0 mt-2 w-56 py-1.5 rounded-xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div class="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">${state.user.name}</p>
                <p class="text-[11px] text-neutral-500 dark:text-neutral-500 mt-0.5">${state.user.email}</p>
            </div>
            <a class="flex items-center gap-2 px-4 py-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors" href="#/my-activity">
                <span class="material-symbols-outlined text-[17px]">person</span> My Activity
            </a>
            ${(state.user.role === 'MODERATOR' || state.user.role === 'ADMIN') ? `<a class="flex items-center gap-2 px-4 py-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors" href="#/moderation">
                <span class="material-symbols-outlined text-[17px]">shield</span> Moderation Queue
            </a>` : ''}
            <div class="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1">
                <button class="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" onclick="logout()">
                    <span class="material-symbols-outlined text-[17px]">logout</span> Sign out
                </button>
            </div>
        </div>
    </div>
    ` : `
    <a href="#/login" class="text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">Login</a>
    `;

    header.innerHTML = `
    <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <a class="flex items-center gap-2 group shrink-0" href="#/">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                <span class="text-white font-bold text-sm">V</span>
            </div>
            <div class="flex flex-col leading-tight">
                <span class="text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-primary transition-colors">Vicinus</span>
                <span class="hidden lg:block text-[10px] text-neutral-400 dark:text-neutral-600 font-medium uppercase tracking-widest">Community · Info</span>
            </div>
        </a>
        
        <nav class="hidden md:flex items-center gap-1">
            ${navLink('#/', 'Home', 'home')}
            ${navLink('#/discover', 'Discover', 'explore')}
        </nav>

        <div class="flex items-center gap-2">
            <button aria-label="Toggle Theme" class="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center transition-colors" onclick="const isDark = document.documentElement.classList.toggle('dark'); localStorage.setItem('theme', isDark ? 'dark' : 'light');" type="button">
                <span class="material-symbols-outlined text-[19px] dark:hidden">dark_mode</span>
                <span class="material-symbols-outlined text-[19px] hidden dark:inline">light_mode</span>
            </button>
            <a class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-[13px] font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all" href="#/share">
                <span class="material-symbols-outlined text-[17px]">add_circle</span>
                <span>Share Info</span>
            </a>
            ${userMenu}
        </div>
    </div>
    `;

    // Mobile bottom nav
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        const mNavLink = (hash, label, icon) => {
            const active = r === hash;
            return `<a class="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${active ? 'text-primary dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-600'}" href="${hash}">
                <span class="material-symbols-outlined text-[22px]">${icon}</span>
                <span class="text-[10px] font-medium">${label}</span>
            </a>`;
        };
        mobileNav.innerHTML = `
        <div class="flex items-center justify-around max-w-sm mx-auto">
            ${mNavLink('#/', 'Home', 'home')}
            ${mNavLink('#/discover', 'Discover', 'explore')}
            <a class="flex flex-col items-center gap-0.5 px-2 py-1" href="#/share">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md -mt-4">
                    <span class="material-symbols-outlined text-white text-[22px]">add</span>
                </div>
                <span class="text-[10px] font-medium text-primary dark:text-indigo-400 mt-0.5">Share</span>
            </a>
            ${mNavLink('#/my-activity', 'Activity', 'person')}
            ${state.user ? mNavLink('#/my-activity', 'Profile', 'account_circle') : mNavLink('#/login', 'Login', 'login')}
        </div>`;
    }
};

// Home View
const renderHome = async (root) => {
    try {
        const res = await fetchAPI('/information?limit=8&sort=newest');
        const info = res.information || [];
        
        const feedHTML = info.length === 0
            ? `<div class="col-span-full p-12 text-center text-neutral-500 dark:text-neutral-600 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">No information shared yet. Be the first!</div>`
            : info.map(item => `
            <div class="card-lift bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer group" onclick="navigate('#/information/${item._id}')">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        ${getStatusBadge(item.status)}
                        <span class="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-medium">${getCategoryIcon(item.category)} ${item.category.replace('_',' ')}</span>
                    </div>
                    <span class="text-[11px] text-neutral-400 dark:text-neutral-600">${timeAgo(item.createdAt)}</span>
                </div>
                <h3 class="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5 line-clamp-1 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors">${item.title}</h3>
                <p class="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">${item.description}</p>
                <div class="flex items-center gap-4 text-[12px] text-neutral-400 dark:text-neutral-500">
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span>${item.location}</span>
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-emerald-500">thumb_up</span>${item.helpfulCount}</span>
                </div>
            </div>
        `).join('');

        root.innerHTML = `
        <!-- Hero -->
        <section class="relative w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.08),transparent_70%)]"></div>
            <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 flex flex-col items-center text-center">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-5 animate-fade-in">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot"></span>
                    <span class="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">Live Community Updates</span>
                </div>
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4 leading-[1.15] animate-slide-up">
                  What's happening in your<br><span class="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">community</span>?
                </h1>
                <p class="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mb-9 leading-relaxed animate-slide-up" style="animation-delay:.1s">
                  Discover local internships, events, lost items and emergencies — before the information gets lost.
                </p>
                
                <div class="w-full max-w-2xl relative animate-slide-up" style="animation-delay:.15s">
                    <div class="relative flex items-center rounded-2xl bg-white dark:bg-neutral-900 shadow-lg dark:shadow-2xl border border-neutral-200 dark:border-neutral-800 p-1.5 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50">
                        <div class="pl-3 pr-1 text-neutral-400 dark:text-neutral-500 flex items-center">
                            <span class="material-symbols-outlined text-[22px]">search</span>
                        </div>
                        <input id="home-search" class="w-full bg-transparent px-2 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-sm border-0 focus:outline-none focus:ring-0" placeholder="Search internships, events, scholarships..." type="text" onkeyup="if(event.key==='Enter')performHomeSearch()">
                        <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold transition-all shadow-sm shrink-0" onclick="performHomeSearch()" type="button">
                            Search
                        </button>
                    </div>
                    <div id="home-search-results" class="hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-2 z-40 text-left max-h-80 overflow-y-auto"></div>
                </div>

                <div class="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-in" style="animation-delay:.25s">
                    <span class="text-[11px] text-neutral-400 dark:text-neutral-600 font-medium mr-1">Popular:</span>
                    ${['🎓 Internships', '💰 Scholarships', '🎉 Events', '🔎 Lost & Found', '🚨 Emergencies'].map(label => {
                        const val = label.split(' ').slice(1).join(' ');
                        return `<button class="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[12px] font-medium transition-colors border border-neutral-200 dark:border-neutral-800" onclick="document.getElementById('home-search').value='${val}';performHomeSearch()">${label}</button>`;
                    }).join('')}
                </div>
            </div>
        </section>

        <!-- Feed -->
        <section class="w-full py-10 bg-surface dark:bg-black">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">dynamic_feed</span> Latest Updates
                    </h2>
                    <a href="#/discover" class="text-[13px] font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
                        View all <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${feedHTML}
                </div>
            </div>
        </section>
        `;
    } catch (e) {
        root.innerHTML = `<div class="p-12 text-center text-rose-500">Failed to load. Is the server running?</div>`;
    }
};

window.performHomeSearch = async () => {
    const q = document.getElementById('home-search').value;
    const resBox = document.getElementById('home-search-results');
    if (!q) { resBox.classList.add('hidden'); return; }
    
    resBox.innerHTML = '<div class="p-4 text-center text-neutral-500"><span class="material-symbols-outlined animate-spin text-sm">sync</span> Searching…</div>';
    resBox.classList.remove('hidden');

    try {
        const res = await fetchAPI(`/information?search=${encodeURIComponent(q)}&limit=5`);
        if (res.information.length === 0) {
            resBox.innerHTML = '<div class="p-4 text-center text-neutral-500">No results found.</div>';
            return;
        }
        resBox.innerHTML = res.information.map(item => `
            <div class="px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer flex items-center gap-3 group transition-colors" onclick="navigate('#/information/${item._id}')">
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-primary truncate">${item.title}</p>
                    <p class="text-[11px] text-neutral-400 dark:text-neutral-600">${item.location} · ${timeAgo(item.createdAt)}</p>
                </div>
                ${getStatusBadge(item.status)}
            </div>
        `).join('');
    } catch (e) {
        resBox.innerHTML = '<div class="p-4 text-center text-rose-500">Search failed.</div>';
    }
};
