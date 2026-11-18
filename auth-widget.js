(() => {
  'use strict';
  const SUPABASE_URL = 'https://qyuczfpgydgqywgthgrz.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_2NLEuDREplLS9DgUXeA8Tw_f8MJOhCq';
  if (!window.supabase) return;
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  if (!document.querySelector('.email-widget-launch')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="email-auth-modal" id="emailAuthModal" aria-hidden="true">
      <div class="email-auth-card" role="dialog" aria-modal="true" aria-labelledby="emailAuthTitle">
        <button class="email-auth-close" type="button" aria-label="Close">×</button>
        <div id="emailAuthFormView">
          <h2 id="emailAuthTitle">Join Email List</h2>
          <p class="email-auth-sub" id="emailAuthSub">Stay updated with FEDPromptly</p>
          <form id="emailAuthForm" autocomplete="off">
            <label class="email-auth-label" for="emailAuthEmail">Email Address</label>
            <input class="email-auth-input" id="emailAuthEmail" type="email" placeholder="you@example.com" required>
            <label class="email-auth-label" for="emailAuthPassword">Password</label>
            <input class="email-auth-input" id="emailAuthPassword" type="password" placeholder="••••••••" minlength="6" required>
            <div class="email-auth-options"><a href="#" id="emailForgot">Forgot password?</a></div>
            <button class="email-auth-primary" id="emailSubmit" type="submit">Join Email List</button>
            <div class="email-auth-message" id="emailMessage" role="status" aria-live="polite"></div>
            <div class="email-auth-divider"><span>or</span></div>
            <p class="email-auth-toggle"><span id="emailToggleText">Already joined?</span> <button type="button" id="emailToggleMode">Sign In</button></p>
          </form>
        </div>
        <div class="email-auth-logged" id="emailLoggedView" hidden>
          <div class="email-auth-avatar" id="emailAvatar"></div>
          <h2 id="emailName"></h2><p id="emailAddress"></p>
          <div class="email-thanks"><strong>Thank you for joining our email list.</strong><br>Questions or concerns? <a href="mailto:contact@fedpromptly.com">contact@fedpromptly.com</a>.</div>
          <button class="email-auth-secondary" type="button" id="emailLogout">Logout</button>
        </div>
      </div>
    </div>`);

  const modal = document.getElementById('emailAuthModal');
  const formView = document.getElementById('emailAuthFormView');
  const loggedView = document.getElementById('emailLoggedView');
  const form = document.getElementById('emailAuthForm');
  const email = document.getElementById('emailAuthEmail');
  const password = document.getElementById('emailAuthPassword');
  const submit = document.getElementById('emailSubmit');
  const message = document.getElementById('emailMessage');
  const title = document.getElementById('emailAuthTitle');
  const sub = document.getElementById('emailAuthSub');
  const toggle = document.getElementById('emailToggleMode');
  const toggleText = document.getElementById('emailToggleText');
  const forgot = document.getElementById('emailForgot');
  const avatar = document.getElementById('emailAvatar');
  const name = document.getElementById('emailName');
  const address = document.getElementById('emailAddress');
  let currentUser = null;
  let signUp = true;
  const phrases = ['Type your email here…', 'Join our newsletter…', 'Get early access…', 'Stay in the loop…'];
  let phrase = 0, char = 0, deleting = false, typingTimer;

  function showMessage(text, kind = 'error') { message.textContent = text; message.className = `email-auth-message ${kind}`; }
  function hideMessage() { message.textContent = ''; message.className = 'email-auth-message'; }
  function setMode(next) { signUp = next; title.textContent = next ? 'Join Email List' : 'Sign In'; sub.textContent = next ? 'Stay updated with FEDPromptly' : 'Enter your credentials to continue'; submit.textContent = next ? 'Join Email List' : 'Sign In'; toggle.textContent = next ? 'Sign In' : 'Join Email List'; toggleText.textContent = next ? 'Already joined?' : 'New here?'; hideMessage(); }
  function showUser(user) { currentUser = user; formView.hidden = true; loggedView.hidden = false; const who = user.email?.split('@')[0] || 'User'; avatar.textContent = who.charAt(0).toUpperCase(); name.textContent = who; address.textContent = user.email || ''; }
  function showForm() { formView.hidden = false; loggedView.hidden = true; }
  function openModal() { modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false'); hideMessage(); if (currentUser) showUser(currentUser); else { setMode(true); form.reset(); setTimeout(() => email.focus(), 80); } }
  function closeModal() { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); }
  function typeStep() { const input = document.querySelector('.email-widget-input'); if (!input || currentUser) return; const word = phrases[phrase]; if (!deleting) { char++; input.placeholder = word.slice(0, char) + '|'; if (char >= word.length) { deleting = true; typingTimer = setTimeout(typeStep, 1500); return; } typingTimer = setTimeout(typeStep, 62); } else { char--; input.placeholder = word.slice(0, char) + '|'; if (char <= 0) { deleting = false; phrase = (phrase + 1) % phrases.length; typingTimer = setTimeout(typeStep, 300); return; } typingTimer = setTimeout(typeStep, 28); } }

  document.querySelectorAll('.email-widget-launch').forEach((node) => node.addEventListener('click', openModal));
  const close = modal.querySelector('.email-auth-close'); close.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
  toggle.addEventListener('click', () => { setMode(!signUp); form.reset(); });
  forgot.addEventListener('click', async (event) => { event.preventDefault(); if (!email.value.trim()) { showMessage('Please enter your email address first.'); return; } const { error } = await supabaseClient.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: window.location.href }); if (error) showMessage(error.message); else showMessage('Password reset email sent. Check your inbox.', 'info'); });
  form.addEventListener('submit', async (event) => { event.preventDefault(); const mail = email.value.trim(); const pass = password.value; if (!mail || !pass) return showMessage('Please fill in all fields.'); submit.disabled = true; submit.textContent = signUp ? 'Joining…' : 'Signing in…'; try { const result = signUp ? await supabaseClient.auth.signUp({ email: mail, password: pass, options: { emailRedirectTo: window.location.href } }) : await supabaseClient.auth.signInWithPassword({ email: mail, password: pass }); if (result.error) throw result.error; if (signUp && !result.data.session) showMessage('Please check your email to confirm your subscription.', 'info'); else { showMessage('Welcome back.', 'success'); showUser(result.data.user); } } catch (error) { showMessage(error.message || 'Authentication failed.'); } finally { submit.disabled = false; submit.textContent = signUp ? 'Join Email List' : 'Sign In'; } });
  document.getElementById('emailLogout').addEventListener('click', async () => { await supabaseClient.auth.signOut(); currentUser = null; showForm(); setMode(false); });
  supabaseClient.auth.onAuthStateChange((event, session) => { if (session) showUser(session.user); else if (event === 'SIGNED_OUT') { currentUser = null; showForm(); } });
  (async () => { const { data } = await supabaseClient.auth.getSession(); if (data.session) showUser(data.session.user); typeStep(); })();
})();
