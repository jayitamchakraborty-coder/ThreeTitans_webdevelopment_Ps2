// Moderation Queue View
const renderModeration = async (root) => {
    if (!state.user || (state.user.role !== 'MODERATOR' && state.user.role !== 'ADMIN')) {
        root.innerHTML = `<div class="p-12 text-center"><div class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-sm font-medium"><span class="material-symbols-outlined text-[20px]">lock</span> Access Denied — Moderator privileges required.</div></div>`;
        return;
    }

    try {
        root.innerHTML = '<div class="p-12 text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span></div>';
        const res = await fetchAPI('/moderation/queue');
        const items = res.information || [];

        const queueHTML = items.length === 0
            ? '<div class="col-span-full p-12 text-center text-neutral-500 dark:text-neutral-600 bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border">🎉 Queue is empty! Great job.</div>'
            : items.map(item => `
            <div class="bg-white dark:bg-d-card rounded-xl border border-neutral-200 dark:border-d-border p-5 shadow-sm hover:shadow-md transition-all">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2 flex-wrap">
                        ${getStatusBadge(item.status)}
                        ${item.reviewRequired ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">⚠ THRESHOLD ${item.reportCount}/${item.reportThreshold}</span>` : ''}
                    </div>
                    <span class="text-[11px] text-neutral-400 dark:text-neutral-600">${timeAgo(item.createdAt)}</span>
                </div>
                <h3 class="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 mb-2 cursor-pointer hover:text-primary transition-colors" onclick="navigate('#/information/${item._id}')">${item.title}</h3>
                <p class="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">${item.description}</p>
                
                ${item.reports && item.reports.length > 0 ? `
                <div class="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-[13px] border border-rose-100 dark:border-rose-900/30">
                    <strong class="text-rose-700 dark:text-rose-400 text-[12px] uppercase tracking-wider">Reports (${item.reportCount})</strong>
                    <ul class="list-disc pl-5 mt-1.5 text-rose-600 dark:text-rose-300/80 space-y-0.5">
                        ${item.reports.map(r => `<li>${r.reason}${r.description ? ': ' + r.description : ''}</li>`).join('')}
                    </ul>
                </div>` : ''}

                <div class="flex items-center gap-2 pt-3 border-t border-neutral-100 dark:border-d-border">
                    <button class="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[13px] font-medium transition-colors border border-emerald-200 dark:border-emerald-900/50" onclick="window._modAction('${item._id}', 'verify')">✓ Verify</button>
                    <button class="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[13px] font-medium transition-colors border border-rose-200 dark:border-rose-900/50" onclick="window._modAction('${item._id}', 'remove')">✗ Remove</button>
                    <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[13px] font-medium transition-colors flex items-center gap-1 border border-indigo-200 dark:border-indigo-900/50" onclick="window._askAiMod('${item._id}')">
                        <span class="material-symbols-outlined text-[15px]">auto_awesome</span> Ask AI
                    </button>
                </div>
            </div>
        `).join('');

        root.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Moderation Queue</h2>
                <p class="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Review flagged and pending information.</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="bg-white dark:bg-d-card border border-neutral-200 dark:border-d-border p-4 rounded-xl">
                    <div class="text-[12px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">Pending</div>
                    <div class="text-2xl font-bold text-neutral-900 dark:text-white mt-1">${res.stats.pendingVerification}</div>
                </div>
                <div class="bg-white dark:bg-d-card border border-neutral-200 dark:border-d-border p-4 rounded-xl">
                    <div class="text-[12px] text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider">Under Review</div>
                    <div class="text-2xl font-bold text-neutral-900 dark:text-white mt-1">${res.stats.underReview}</div>
                </div>
                <div class="bg-white dark:bg-d-card border border-neutral-200 dark:border-d-border p-4 rounded-xl">
                    <div class="text-[12px] text-rose-600 dark:text-rose-400 font-medium uppercase tracking-wider">Reported</div>
                    <div class="text-2xl font-bold text-neutral-900 dark:text-white mt-1">${res.stats.reported}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${queueHTML}
            </div>
        </div>
        
        <!-- AI Modal -->
        <div id="ai-mod-modal" class="fixed inset-0 z-[100] hidden">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="document.getElementById('ai-mod-modal').classList.add('hidden')"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-d-card rounded-2xl shadow-2xl border border-neutral-200 dark:border-d-border p-6 animate-slide-up">
                <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">auto_awesome</span> AI Moderator Review
                </h3>
                <div id="ai-mod-content" class="text-sm text-neutral-700 dark:text-neutral-300">Loading…</div>
                <div class="mt-5 text-right">
                    <button class="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-d-raised text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-d-border text-sm font-medium transition-colors" onclick="document.getElementById('ai-mod-modal').classList.add('hidden')">Close</button>
                </div>
            </div>
        </div>
        `;

        window._modAction = async (id, action) => {
            try {
                if (action === 'verify') {
                    await fetchAPI(`/moderation/${id}/verify`, { method: 'POST' });
                    showToast('Verified ✓');
                } else if (action === 'remove') {
                    const reason = prompt("Removal reason:", "Violates community guidelines");
                    if (!reason) return;
                    await fetchAPI(`/moderation/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) });
                    showToast('Removed');
                }
                renderModeration(root);
            } catch(e) {}
        };

        window._askAiMod = async (id) => {
            const modal = document.getElementById('ai-mod-modal');
            const content = document.getElementById('ai-mod-content');
            modal.classList.remove('hidden');
            content.innerHTML = '<div class="flex items-center gap-2"><span class="material-symbols-outlined animate-spin text-primary">sync</span> Analyzing content…</div>';
            
            try {
                const res = await fetchAPI(`/ai/moderate`, { method: 'POST', body: JSON.stringify({ informationId: id }) });
                const r = res.aiReview;
                content.innerHTML = `
                    <div class="space-y-4">
                        <div><p class="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Flagged</p><span class="text-base font-bold ${r.flagged ? 'text-rose-600' : 'text-emerald-600'}">${r.flagged ? 'Yes — Needs attention' : 'No — Appears safe'}</span></div>
                        <div><p class="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Reasoning</p><p class="text-[14px] leading-relaxed">${r.reason}</p></div>
                        <div><p class="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Recommendation</p><span class="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-[13px] font-semibold mt-1">${r.recommendation}</span></div>
                    </div>`;
            } catch(e) {
                content.innerHTML = '<span class="text-rose-500">AI analysis failed. Try again.</span>';
            }
        };

    } catch (e) {
        root.innerHTML = `<div class="p-12 text-center text-rose-500">Failed to load moderation queue.</div>`;
    }
};
