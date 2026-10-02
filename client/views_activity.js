// My Activity View
const renderMyActivity = async (root) => {
<<<<<<< HEAD
<<<<<<< Updated upstream
    if (!state.user) return navigate('#/login');
    try {
        root.innerHTML = '<div class="p-12 text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span></div>';
        const [postsRes, savedRes, helpfulRes] = await Promise.all([fetchAPI('/me/posts'), fetchAPI('/me/saved'), fetchAPI('/me/helpful')]);

        const renderItems = (items, emptyMsg) => {
            if (!items || items.length === 0) return `<div class="text-[13px] text-neutral-400 dark:text-neutral-600 py-6 text-center">${emptyMsg}</div>`;
            return items.map(item => `
                <div class="flex items-center justify-between py-3 px-1 border-b border-neutral-100 dark:border-neutral-800 last:border-0 cursor-pointer group" onclick="navigate('#/information/${item._id}')">
                    <div class="min-w-0 flex-1">
                        <h4 class="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors truncate">${item.title}</h4>
                        <div class="flex items-center gap-2 mt-1">${getStatusBadge(item.status)}<span class="text-[11px] text-neutral-400 dark:text-neutral-600">${timeAgo(item.createdAt)}</span></div>
                    </div>
                    <span class="material-symbols-outlined text-neutral-300 dark:text-neutral-700 group-hover:text-primary text-[18px] shrink-0 ml-2">chevron_right</span>
                </div>`).join('');
        };

        root.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mb-8 flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20 shrink-0">${state.user.name.substring(0,2).toUpperCase()}</div>
                <div><h2 class="text-xl font-bold text-neutral-900 dark:text-white">${state.user.name}</h2><p class="text-[13px] text-neutral-500">${state.user.email} · ${state.user.role}</p></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider"><span class="material-symbols-outlined text-primary text-[18px]">campaign</span> My Posts <span class="ml-auto text-primary font-bold">${postsRes.count}</span></h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">${renderItems(postsRes.posts, 'No posts yet.')}</div>
                </div>
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider"><span class="material-symbols-outlined text-primary text-[18px]">bookmark</span> Saved <span class="ml-auto text-primary font-bold">${savedRes.count}</span></h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">${renderItems(savedRes.posts, 'No saved items.')}</div>
                </div>
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider"><span class="material-symbols-outlined text-emerald-500 text-[18px]">thumb_up</span> Helpful <span class="ml-auto text-primary font-bold">${helpfulRes.count}</span></h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">${renderItems(helpfulRes.posts, 'Nothing marked helpful.')}</div>
                </div>
            </div>
        </div>`;
    } catch (e) { root.innerHTML = `<div class="p-12 text-center text-rose-500">Failed to load activity.</div>`; }
=======
    if (!state.user) {
        return navigate('#/login');
    }
=======
    if (!state.user) return navigate('#/login');
>>>>>>> 26ef483 (Update LocalLoop project)

    try {
        root.innerHTML = '<div class="p-12 text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span></div>';
        
        const [postsRes, savedRes, helpfulRes] = await Promise.all([
            fetchAPI('/me/posts'),
            fetchAPI('/me/saved'),
            fetchAPI('/me/helpful')
        ]);

        const renderItems = (items, emptyMsg) => {
            if (!items || items.length === 0) return `<div class="text-[13px] text-neutral-400 dark:text-neutral-600 py-6 text-center">${emptyMsg}</div>`;
            return items.map(item => `
                <div class="flex items-center justify-between py-3 px-1 border-b border-neutral-100 dark:border-d-border last:border-0 cursor-pointer group" onclick="navigate('#/information/${item._id}')">
                    <div class="min-w-0 flex-1">
                        <h4 class="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors truncate">${item.title}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            ${getStatusBadge(item.status)}
                            <span class="text-[11px] text-neutral-400 dark:text-neutral-600">${timeAgo(item.createdAt)}</span>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-neutral-300 dark:text-neutral-700 group-hover:text-primary text-[18px] shrink-0 ml-2">chevron_right</span>
                </div>
            `).join('');
        };

        root.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <!-- Profile Card -->
            <div class="bg-white dark:bg-d-card rounded-2xl border border-neutral-200 dark:border-d-border p-6 mb-8 flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20 shrink-0">
                    ${state.user.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                    <h2 class="text-xl font-bold text-neutral-900 dark:text-white">${state.user.name}</h2>
                    <p class="text-[13px] text-neutral-500 dark:text-neutral-500">${state.user.email} · ${state.user.role}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Shared -->
                <div class="bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <span class="material-symbols-outlined text-primary text-[18px]">campaign</span> My Posts
                        <span class="ml-auto text-primary font-bold">${postsRes.count}</span>
                    </h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">
                        ${renderItems(postsRes.posts, 'No posts yet. Share something!')}
                    </div>
                </div>

                <!-- Saved -->
                <div class="bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <span class="material-symbols-outlined text-primary text-[18px]">bookmark</span> Saved
                        <span class="ml-auto text-primary font-bold">${savedRes.count}</span>
                    </h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">
                        ${renderItems(savedRes.posts, 'No saved items.')}
                    </div>
                </div>

                <!-- Helpful -->
                <div class="bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border p-5">
                    <h3 class="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <span class="material-symbols-outlined text-emerald-500 text-[18px]">thumb_up</span> Helpful
                        <span class="ml-auto text-primary font-bold">${helpfulRes.count}</span>
                    </h3>
                    <div class="flex flex-col max-h-80 overflow-y-auto no-scrollbar">
                        ${renderItems(helpfulRes.posts, 'Nothing marked helpful yet.')}
                    </div>
                </div>
            </div>
        </div>
        `;
    } catch (e) {
        root.innerHTML = `<div class="p-12 text-center text-rose-500">Failed to load activity.</div>`;
    }
>>>>>>> Stashed changes
};
