// Share View
const renderShare = (root) => {
    if (!state.user) {
        root.innerHTML = `<div class="p-12 text-center"><p class="text-neutral-500 mb-4">Please sign in to share information.</p><a href="#/login" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-md">Login</a></div>`;
        return;
    }
    root.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
        <div class="mb-2"><h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Share Information</h2><p class="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Help your community by sharing useful local information.</p></div>
        <div class="mt-6 mb-8 p-6 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-neutral-900 dark:to-neutral-900 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <h3 class="text-base font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5 flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">auto_awesome</span> Format with AI</h3>
            <p class="text-[13px] text-indigo-700 dark:text-indigo-400/80 mb-4">Paste a messy WhatsApp or Telegram forward, and AI will auto-fill the form.</p>
            <textarea id="ai-input-text" rows="4" class="w-full rounded-xl border-indigo-200 dark:border-neutral-700 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 mb-3 placeholder:text-neutral-400 dark:placeholder:text-neutral-600" placeholder="Guys tomorrow there is an internship session in DBIT at 2pm by Google…"></textarea>
            <button id="ai-format-btn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">auto_awesome</span> Structure with AI</button>
        </div>
        <form id="share-form" class="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="col-span-2"><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Title *</label><input type="text" id="share-title" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"></div>
                <div class="col-span-2"><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Description *</label><textarea id="share-desc" required rows="4" class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"></textarea></div>
                <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category *</label><select id="share-category" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm"><option value="internships">🎓 Internships</option><option value="scholarships">💰 Scholarships</option><option value="events">🎉 Events</option><option value="lost_found">🔎 Lost & Found</option><option value="emergencies">🚨 Emergencies</option><option value="local_issues">🚧 Local Issues</option><option value="announcements" selected>📢 Announcements</option></select></div>
                <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Type *</label><select id="share-type" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm"><option value="NOTICE">Notice</option><option value="EVENT">Event</option><option value="UPDATE">Update</option><option value="LOST_FOUND">Lost/Found</option><option value="EMERGENCY">Emergency</option></select></div>
                <div class="col-span-2"><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Location *</label><input type="text" id="share-location" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. DBIT Campus, Kurla"></div>
                <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Date / Time</label><input type="text" id="share-date" class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm" placeholder="Oct 15, 2026 2:00 PM"></div>
                <div><label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Link</label><input type="url" id="share-link" class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm" placeholder="https://..."></div>
            </div>
            <div class="flex items-start gap-3 mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <input type="checkbox" id="share-confirm" required class="mt-0.5 rounded text-primary focus:ring-primary bg-white dark:bg-black border-neutral-300 dark:border-neutral-600">
                <label for="share-confirm" class="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">I confirm this information is accurate. Posts start as <strong>"Needs Verification"</strong>.</label>
            </div>
            <div class="flex justify-end gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" class="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-sm transition-colors" onclick="history.back()">Cancel</button>
                <button type="submit" id="share-submit-btn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all">Publish</button>
            </div>
        </form>
    </div>`;

    document.getElementById('ai-format-btn').addEventListener('click', async () => {
        const text = document.getElementById('ai-input-text').value;
        if (!text) return showToast('Paste some text first', 'error');
        const btn = document.getElementById('ai-format-btn');
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Formatting…`; btn.disabled = true;
        try {
            const res = await fetchAPI('/ai/structure', { method: 'POST', body: JSON.stringify({ text }) });
            const d = res.data;
            if (d.title) document.getElementById('share-title').value = d.title;
            if (d.description) document.getElementById('share-desc').value = d.description;
            if (d.location) document.getElementById('share-location').value = d.location;
            document.getElementById('share-date').value = (d.date||'') + ' ' + (d.time||'');
            if (d.link) document.getElementById('share-link').value = d.link;
            if (d.category) document.getElementById('share-category').value = d.category;
            if (d.type) document.getElementById('share-type').value = d.type;
            showToast('AI formatting applied!');
        } catch(e){} finally { btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">auto_awesome</span> Structure with AI`; btn.disabled = false; }
    });

    document.getElementById('share-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('share-submit-btn');
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span>'; btn.disabled = true;
        try {
            await fetchAPI('/information', { method: 'POST', body: JSON.stringify({
                title: document.getElementById('share-title').value, description: document.getElementById('share-desc').value,
                category: document.getElementById('share-category').value, type: document.getElementById('share-type').value,
                location: document.getElementById('share-location').value, eventDate: document.getElementById('share-date').value,
                link: document.getElementById('share-link').value, rawInput: document.getElementById('ai-input-text').value
            })});
            showToast('Information published!'); navigate('#/');
        } catch(e){ btn.innerHTML = 'Publish'; btn.disabled = false; }
    });
};
