// Discover View
const renderDiscover = async (root) => {
    let currentCategory = 'all';
    let currentSort = 'newest';

    const loadFeed = async () => {
        const feedContainer = document.getElementById('discover-feed');
        if (!feedContainer) return;
        feedContainer.innerHTML = '<div class="col-span-full p-12 text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span></div>';
        
        try {
            const res = await fetchAPI(`/information?category=${currentCategory}&sort=${currentSort}&limit=20`);
            const data = res.information || [];
            
            if (data.length === 0) {
                feedContainer.innerHTML = `<div class="col-span-full p-12 text-center text-neutral-500 dark:text-neutral-600 bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border">No information found for this filter.</div>`;
                return;
            }

            feedContainer.innerHTML = data.map(item => `
                <div class="card-lift bg-white dark:bg-d-card p-5 rounded-xl border border-neutral-200 dark:border-d-border cursor-pointer group flex flex-col" onclick="navigate('#/information/${item._id}')">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2 min-w-0">
                            ${getStatusBadge(item.status)}
                            <span class="text-[11px] text-neutral-400 dark:text-neutral-600 font-medium uppercase tracking-wider truncate">${getCategoryIcon(item.category)} ${item.category.replace('_',' ')}</span>
                        </div>
                        <span class="text-[11px] text-neutral-400 dark:text-neutral-600 shrink-0 ml-2">${timeAgo(item.createdAt)}</span>
                    </div>
                    <h3 class="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5 line-clamp-1 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors">${item.title}</h3>
                    <p class="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2 leading-relaxed">${item.description}</p>
                    <div class="mt-auto pt-3 border-t border-neutral-100 dark:border-d-border flex items-center justify-between text-[12px] text-neutral-400 dark:text-neutral-500">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-emerald-500">thumb_up</span> ${item.helpfulCount} helpful</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span> ${item.location}</span>
                    </div>
                </div>
            `).join('');
        } catch(e) {
            feedContainer.innerHTML = `<div class="col-span-full p-12 text-center text-rose-500">Failed to load.</div>`;
        }
    };

    const categories = [
        { key: 'all', label: 'All', icon: 'apps' },
        { key: 'internships', label: 'Internships', icon: '🎓' },
        { key: 'scholarships', label: 'Scholarships', icon: '💰' },
        { key: 'events', label: 'Events', icon: '🎉' },
        { key: 'lost_found', label: 'Lost & Found', icon: '🔎' },
        { key: 'emergencies', label: 'Emergencies', icon: '🚨' },
        { key: 'local_issues', label: 'Local Issues', icon: '🚧' },
        { key: 'announcements', label: 'Announcements', icon: '📢' }
    ];

    root.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <!-- Top bar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Discover</h2>
            <select id="discover-sort" class="rounded-xl border-neutral-300 dark:border-d-border bg-white dark:bg-d-card text-sm text-neutral-700 dark:text-neutral-300 py-2 pl-3 pr-8 focus:ring-primary" onchange="window._discoverSetSort(this.value)">
                <option value="newest">Newest First</option>
                <option value="helpful">Most Helpful</option>
            </select>
        </div>

        <!-- Category pills -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2" id="category-pills">
            ${categories.map(c => `
                <button class="shrink-0 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border ${c.key === 'all' ? 'bg-primary text-white border-primary shadow-md shadow-indigo-500/20' : 'bg-white dark:bg-d-card text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-d-border hover:border-primary/50 dark:hover:border-indigo-900'}" onclick="window._discoverSetCategory('${c.key}', this)">
                    ${c.icon.length <= 2 ? c.icon + ' ' : '<span class="material-symbols-outlined text-[16px] mr-1">' + c.icon + '</span>'}${c.label}
                </button>
            `).join('')}
        </div>

        <!-- Feed Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="discover-feed"></div>
    </div>
    `;

    window._discoverSetCategory = (cat, btn) => {
        currentCategory = cat;
        const pills = document.getElementById('category-pills').children;
        for (let b of pills) {
            b.className = "shrink-0 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border bg-white dark:bg-d-card text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-d-border hover:border-primary/50 dark:hover:border-indigo-900";
        }
        btn.className = "shrink-0 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border bg-primary text-white border-primary shadow-md shadow-indigo-500/20";
        loadFeed();
    };

    window._discoverSetSort = (sort) => {
        currentSort = sort;
        loadFeed();
    };

    await loadFeed();
};
