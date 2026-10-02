// Information Detail View
const renderInformationDetail = async (root, id) => {
    try {
        root.innerHTML = '<div class="p-12 text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span></div>';
        const res = await fetchAPI(`/information/${id}`);
        const item = res.information;

        let historyHTML = '';
        try {
            const hRes = await fetchAPI(`/information/${id}/history`);
            if (hRes.history && hRes.history.length > 0) {
                historyHTML = `
                <div class="mt-8">
                    <h3 class="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px] text-primary">history</span> Lifecycle History
                    </h3>
                    <div class="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-4">
                        ${hRes.history.map(h => `
                        <div class="relative">
                            <div class="absolute -left-[calc(1.5rem+5px)] w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-black"></div>
                            <div class="text-[13px]">
                                <span class="font-semibold text-neutral-800 dark:text-neutral-200">${h.action}</span>
                                ${h.actorId ? `<span class="text-neutral-500"> by ${h.actorId.name || 'System'}</span>` : ''}
                            </div>
                            <p class="text-[12px] text-neutral-400 dark:text-neutral-600">${timeAgo(h.createdAt)}${h.details ? ' · ' + h.details : ''}</p>
                        </div>`).join('')}
                    </div>
                </div>`;
            }
        } catch(e) {}

        root.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
            <button class="mb-6 flex items-center gap-1 text-[13px] font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" onclick="history.back()">
                <span class="material-symbols-outlined text-[18px]">arrow_back</span> Back
            </button>
            <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div class="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800">
                    <div class="flex items-center gap-2 mb-4 flex-wrap">
                        ${getStatusBadge(item.status)}
                        <span class="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium text-[11px] uppercase tracking-wider">${getCategoryIcon(item.category)} ${item.category.replace('_',' ')}</span>
                        ${item.reportCount > 0 ? `<span class="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-[11px] border border-rose-200/60 dark:border-rose-500/20">⚠ ${item.reportCount} report${item.reportCount>1?'s':''}</span>` : ''}
                    </div>
                    <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">${item.title}</h1>
                    <div class="flex flex-wrap items-center gap-y-2 gap-x-5 text-[13px] text-neutral-500">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">${item.authorName.substring(0,2).toUpperCase()}</div>
                            <span class="font-medium text-neutral-700 dark:text-neutral-300">${item.authorName}</span>
                        </div>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">schedule</span>${formatDate(item.createdAt)}</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">location_on</span>${item.location}</span>
                    </div>
                </div>
                <div class="p-6 md:p-8">
                    <div class="text-[15px] text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">${item.description}</div>
                    ${(item.eventDate||item.link||item.contact) ? `
                    <div class="mt-8 p-5 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 space-y-3">
                        ${item.eventDate ? `<div class="flex items-center gap-3 text-[13px] text-neutral-700 dark:text-neutral-300"><span class="material-symbols-outlined text-primary text-[18px]">event</span><div><span class="text-neutral-400 text-[12px] block">Date/Time</span><strong>${item.eventDate}</strong></div></div>` : ''}
                        ${item.link ? `<div class="flex items-center gap-3 text-[13px] text-neutral-700 dark:text-neutral-300"><span class="material-symbols-outlined text-primary text-[18px]">link</span><div><span class="text-neutral-400 text-[12px] block">Link</span><a href="${item.link}" target="_blank" class="text-primary hover:underline break-all">${item.link}</a></div></div>` : ''}
                        ${item.contact ? `<div class="flex items-center gap-3 text-[13px] text-neutral-700 dark:text-neutral-300"><span class="material-symbols-outlined text-primary text-[18px]">call</span><div><span class="text-neutral-400 text-[12px] block">Contact</span><strong>${item.contact}</strong></div></div>` : ''}
                    </div>` : ''}
                    ${historyHTML}
                </div>
                <div class="p-4 md:px-8 md:py-5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <button class="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-[13px] transition-colors flex items-center gap-2 border border-emerald-200 dark:border-emerald-500/20" onclick="window._markHelpful('${item._id}')">
                            <span class="material-symbols-outlined text-[18px]">thumb_up</span> Helpful (${item.helpfulCount})
                        </button>
                        <button class="px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-[13px] transition-colors flex items-center gap-2 border border-neutral-200 dark:border-neutral-700" onclick="window._toggleSave('${item._id}')">
                            <span class="material-symbols-outlined text-[18px]">bookmark_border</span> Save
                        </button>
                    </div>
                    <button class="px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium text-[13px] transition-colors flex items-center gap-2 border border-neutral-200 dark:border-neutral-700" onclick="window._toggleReportModal('${item._id}')">
                        <span class="material-symbols-outlined text-[18px]">flag</span> Report
                    </button>
                </div>
            </div>
        </div>
        <div id="report-modal" class="fixed inset-0 z-[100] hidden">
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="window._toggleReportModal()"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 animate-slide-up">
                <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-4">Report Information</h3>
                <form id="report-form" class="space-y-4">
                    <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Reason</label><select id="report-reason" class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"><option value="INCORRECT">Incorrect Info</option><option value="OUTDATED">Outdated</option><option value="SPAM">Spam</option><option value="MISLEADING">Misleading</option></select></div>
                    <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Details (optional)</label><textarea id="report-details" rows="3" class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"></textarea></div>
                    <div class="flex justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                        <button type="button" class="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium" onclick="window._toggleReportModal()">Cancel</button>
                        <button type="submit" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>`;

        window._markHelpful = async (infoId) => { if(!state.user) return navigate('#/login'); try { await fetchAPI(`/information/${infoId}/helpful`,{method:'POST'}); showToast('Marked as helpful!'); renderInformationDetail(root,infoId); } catch(e){} };
        window._toggleSave = async (infoId) => { if(!state.user) return navigate('#/login'); try { const r = await fetchAPI(`/me/saved/${infoId}`,{method:'POST'}); showToast(r.saved?'Saved!':'Removed from saved'); } catch(e){} };
        window._toggleReportModal = () => { if(!state.user) return navigate('#/login'); document.getElementById('report-modal').classList.toggle('hidden'); };
        document.getElementById('report-form')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await fetchAPI(`/information/${item._id}/report`,{method:'POST',body:JSON.stringify({reason:document.getElementById('report-reason').value,description:document.getElementById('report-details').value})}); showToast('Report submitted'); window._toggleReportModal(); renderInformationDetail(root,item._id); } catch(e){} });
    } catch (e) { root.innerHTML = `<div class="p-12 text-center text-rose-500">Information not found.</div>`; }
};
