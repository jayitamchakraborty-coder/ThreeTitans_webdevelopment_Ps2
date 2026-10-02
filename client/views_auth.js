// Login View
const renderLogin = (root) => {
    root.innerHTML = `
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-surface dark:bg-black">
        <div class="w-full max-w-md animate-slide-up">
            <div class="text-center mb-8">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                    <span class="text-white font-bold text-xl">V</span>
                </div>
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Welcome back</h2>
                <p class="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Sign in to your Vicinus account</p>
            </div>
            <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:shadow-2xl border border-neutral-200 dark:border-neutral-800 p-7">
                <form id="login-form" class="space-y-5">
                    <div>
                        <label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email</label>
                        <input type="email" id="login-email" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600" placeholder="you@example.com">
                    </div>
                    <div>
                        <label class="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
                        <input type="password" id="login-password" required class="w-full rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600" placeholder="••••••••">
                    </div>
                    <button type="submit" id="login-btn" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">Sign In</button>
                </form>
            </div>
            <div class="mt-6 space-y-2 text-center">
                <p class="text-[12px] text-neutral-400 dark:text-neutral-600 font-medium uppercase tracking-wider">Demo Accounts</p>
                <div class="flex flex-col sm:flex-row gap-2 justify-center">
                    <button class="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[12px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors" onclick="document.getElementById('login-email').value='demo@vicinus.local';document.getElementById('login-password').value='Demo@123'">
                        👤 User: demo@vicinus.local
                    </button>
                    <button class="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[12px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors" onclick="document.getElementById('login-email').value='moderator@vicinus.local';document.getElementById('login-password').value='Moderator@123'">
                        🛡️ Mod: moderator@vicinus.local
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Signing in…';
        btn.disabled = true;
        try {
            const res = await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
            state.token = res.token;
            state.user = res.user;
            localStorage.setItem('token', res.token);
            showToast('Welcome back, ' + res.user.name + '!');
            navigate('#/');
        } catch (err) { btn.innerHTML = 'Sign In'; btn.disabled = false; }
    });
};

const renderRegister = (root) => {
    root.innerHTML = `<div class="flex items-center justify-center min-h-[calc(100vh-64px)] p-4"><div class="text-center max-w-md"><h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Registration</h2><p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Use demo accounts during the hackathon.</p><a href="#/login" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-md"><span class="material-symbols-outlined text-[18px]">login</span> Go to Login</a></div></div>`;
};
