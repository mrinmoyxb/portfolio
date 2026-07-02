/* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── TERMINAL REVEAL ── */
  const terminal = document.querySelector('.terminal');
  const termObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        termObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  if (terminal) termObs.observe(terminal);

  /* ── COUNT-UP ── */
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (eased * target).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.count-up');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObs.observe(c));

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--green)';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObs.observe(s));

  /* ── NEURAL NETWORK CANVAS ── */
  (function() {
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], mouse = { x: -999, y: -999 };
    const NODE_COUNT = 52, MAX_DIST = 160, NODE_COLOR = 'rgba(78,255,145,', LINE_COLOR = 'rgba(78,255,145,';

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // update + draw nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += 0.02;
        const alpha = 0.35 + 0.25 * Math.sin(n.pulse);
        // mouse proximity boost
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const mdist = Math.sqrt(dx*dx + dy*dy);
        const boost = mdist < 80 ? 1 - mdist/80 : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + boost * 2, 0, Math.PI * 2);
        ctx.fillStyle = NODE_COLOR + (alpha + boost * 0.4) + ')';
        ctx.fill();
      });
      // draw lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = LINE_COLOR + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        // mouse connection
        const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = LINE_COLOR + (1 - d/120) * 0.5 + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    resize(); initNodes(); draw();
  })();

  /* ── TYPEWRITER ── */
  (function() {
    const phrases = [
      'research-grade ML models.',
      'production-ready apps.',
      'scalable APIs.',
      'deep learning pipelines.',
      'full-stack applications.'
    ];
    const el = document.getElementById('typewriter');
    const cur = document.querySelector('.typewriter-cursor');
    let pi = 0, ci = 0, deleting = false, wait = 0;

    function tick() {
      const phrase = phrases[pi];
      if (!deleting) {
        el.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; wait = 55; }
      } else {
        if (--wait > 0) { setTimeout(tick, 30); return; }
        el.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 38 : 68);
    }
    setTimeout(tick, 900);
    setInterval(() => cur.style.opacity = cur.style.opacity === '0' ? '1' : '0', 500);
  })();

  /* ── ML INFERENCE PANEL ── */
  async function runInference() {
    const input = document.getElementById('ml-input').value.trim();
    if (!input) return;
    const out = document.getElementById('ml-output');
    const btn = document.getElementById('ml-run');
    btn.disabled = true;
    btn.textContent = '...';

    // show loading state
    out.innerHTML = `
      <div class="ml-loading">
        <span class="ml-spinner"></span>
        <span class="ml-loading-text">running inference<span class="ml-dots"></span></span>
      </div>`;
    animateDots();

    const t0 = Date.now();
    try {
      const res = await fetch(`${API_BASE}/api/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const latency = Date.now() - t0;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      // if the firewall blocked/redirected the query, show it as such
      if (result.blocked) {
        out.innerHTML = `<div class="ml-error">// firewall: ${escapeHtml(result.response || 'query outside portfolio scope — nice try.')}</div>`;
      } else {
        renderResult(result, latency, input);
      }
    } catch(e) {
      out.innerHTML = `<div class="ml-error">// inference error: ${e.message}</div>`;
    }
    btn.disabled = false;
    btn.textContent = 'run';
  }

  function animateDots() {
    const dotsEl = document.querySelector('.ml-dots');
    if (!dotsEl) return;
    let d = 0;
    const iv = setInterval(() => {
      if (!document.querySelector('.ml-dots')) { clearInterval(iv); return; }
      dotsEl.textContent = '.'.repeat((d++ % 3) + 1);
    }, 350);
  }

  function renderResult(r, latency, input) {
    const out = document.getElementById('ml-output');

    // backend currently only returns { response: "..." } — render that simply.
    // (if sentiment/intent/etc. get added later, the richer block below still works)
    if (!r || !r.sentiment) {
      out.innerHTML = `
        <div class="ml-meta-row">
          <span class="ml-meta-item">⏱ ${latency}ms</span>
        </div>
        <div class="ml-response">&gt; ${escapeHtml(r && r.response ? r.response : 'no response')}</div>
      `;
      return;
    }

    const sentColor = r.sentiment.label === 'POSITIVE' ? '#4eff91' : r.sentiment.label === 'NEGATIVE' ? '#ff8a7a' : '#ffc56a';
    const domainColor = { ML:'#4eff91', Backend:'#6ab4ff', Android:'#A97BFF', Research:'#ffc56a', Creative:'#ff8a7a', General:'#7a9c82', Other:'#7a9c82' }[r.domain] || '#7a9c82';
    const confPct = Math.round(r.confidence * 100);
    const sentPct = Math.round(r.sentiment.score * 100);

    out.innerHTML = `
      <div class="ml-meta-row">
        <span class="ml-meta-item">⏱ ${latency}ms</span>
        <span class="ml-meta-item">~${r.tokens || '?'} tokens</span>
        <span class="ml-meta-item ml-domain" style="color:${domainColor}">⬡ ${escapeHtml(r.domain)}</span>
      </div>
      <div class="ml-result-grid">
        <div class="ml-result-row">
          <span class="ml-label">SENTIMENT</span>
          <span class="ml-value" style="color:${sentColor}">${escapeHtml(r.sentiment.label)}</span>
          <div class="ml-bar-wrap"><div class="ml-bar" style="width:${sentPct}%;background:${sentColor}"></div></div>
          <span class="ml-pct">${sentPct}%</span>
        </div>
        <div class="ml-result-row">
          <span class="ml-label">CONFIDENCE</span>
          <span class="ml-value" style="color:#4eff91">${confPct >= 80 ? 'HIGH' : confPct >= 50 ? 'MED' : 'LOW'}</span>
          <div class="ml-bar-wrap"><div class="ml-bar" style="width:${confPct}%;background:#4eff91"></div></div>
          <span class="ml-pct">${confPct}%</span>
        </div>
        <div class="ml-result-row">
          <span class="ml-label">INTENT</span>
          <span class="ml-value" style="color:#6ab4ff">${escapeHtml(r.intent)}</span>
        </div>
      </div>
      <div class="ml-tags">
        ${(r.tags||[]).map(t => `<span class="ml-tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="ml-response">&gt; ${escapeHtml(r.response)}</div>
    `;
    // animate bars
    setTimeout(() => {
      document.querySelectorAll('.ml-bar').forEach(b => b.classList.add('ml-bar-animate'));
    }, 50);
  }

  // allow Enter key to run
  document.getElementById('ml-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runInference();
  });
  /* ══════════════════════════════════════════════
     API-DRIVEN CONTENT
     Base URL points at the EC2/Nginx-fronted backend.
     Note: this is plain HTTP — if the site is ever served
     over HTTPS, browsers will block this as mixed content,
     so put the API behind HTTPS (e.g. via the same Nginx +
     a domain + Let's Encrypt) at that point.
  ══════════════════════════════════════════════ */
  const API_BASE = 'http://3.6.237.123';

  async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
    return res.json();
  }

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function langDotClass(tag) {
    const t = (tag || '').toLowerCase();
    if (t.includes('kotlin')) return 'lang-kotlin';
    if (t.includes('python')) return 'lang-python';
    if (t.includes('typescript')) return 'lang-ts';
    if (t.includes('javascript') || t.includes('js')) return 'lang-js';
    if (t.includes('node')) return 'lang-node';
    if (t.includes('android')) return 'lang-android';
    if (t.includes('jupyter') || t.includes('ml') || t.includes('tensorflow') || t.includes('cnn') || t.includes('nlp')) return 'lang-ml';
    if (t.includes('c++') || t.includes('cpp')) return 'lang-cpp';
    return 'lang-default';
  }

  /* ── PROJECTS ── */
  async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    try {
      const projects = await apiGet('/api/projects');
      if (!Array.isArray(projects) || !projects.length) return;
      grid.innerHTML = projects.map((p, i) => `
        <a href="${escapeHtml(p.github)}" target="_blank" class="project-card reveal reveal-delay-${(i % 6) + 1}">
          <div class="project-header">
            <div class="project-name">${escapeHtml(p.pname)}</div>
            <div class="project-stars">&#9733; ${Number(p.star) || 0}</div>
          </div>
          <div class="project-desc">${escapeHtml(p.description)}</div>
          <div class="project-lang"><div class="lang-dot ${langDotClass((p.tags || [])[0])}"></div> ${(p.tags || []).map(escapeHtml).join(' &middot; ')}</div>
        </a>
      `).join('');
      observeReveals(grid);
    } catch (e) {
      console.warn('projects fetch failed, keeping fallback content:', e.message);
    }
  }

  /* ── CERTIFICATIONS ── */
  const CERT_BADGE_COLORS = ['#0b3d91', '#e65100', '#03a9f4', '#7b1fa2', '#2e7d32', '#c62828'];

  async function loadCerts() {
    const grid = document.getElementById('cert-grid');
    if (!grid) return;
    try {
      const certs = await apiGet('/api/certs');
      if (!Array.isArray(certs) || !certs.length) return;
      grid.innerHTML = certs.map((c, i) => `
        <div class="cert-card reveal reveal-delay-${(i % 6) + 1}">
          <div class="cert-issuer-row">
            <div class="cert-issuer-badge" style="background:${CERT_BADGE_COLORS[i % CERT_BADGE_COLORS.length]};">${escapeHtml((c.platform || c.issuer || '??').slice(0, 2).toUpperCase())}</div>
            <div>
              <div class="cert-issuer">${escapeHtml(c.issuer)}${c.platform ? ' &middot; ' + escapeHtml(c.platform) : ''}</div>
              <div class="cert-date">${escapeHtml(c.date)}</div>
            </div>
            <span class="cert-verified">&#10003; verified</span>
          </div>
          <div class="cert-name">${escapeHtml(c.name)}</div>
          <div class="cert-meta-row">
            ${(c.tags || []).map(t => `<span class="cert-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
          <a href="${escapeHtml(c.url)}" target="_blank" class="cert-link">view credential &#8599;</a>
        </div>
      `).join('');
      observeReveals(grid);
    } catch (e) {
      console.warn('certs fetch failed, keeping fallback content:', e.message);
    }
  }

  /* ── CODING PROFILES ── */
  async function loadCoding() {
    const grid = document.getElementById('coding-grid');
    if (!grid) return;
    try {
      const data = await apiGet('/api/coding');
      const lc = data.leetcode || data.leetCode;
      const hr = data.hackerrank || data.hackerRank;
      if (!lc && !hr) return;

      let html = '';

      if (lc) {
        html += `
        <div class="coding-card reveal reveal-delay-1">
          <div class="coding-header">
            <div class="coding-logo lc-logo">LC</div>
            <div class="coding-platform-info">
              <div class="coding-platform-name">LeetCode</div>
              <div class="coding-handle">@${escapeHtml(lc.username)}</div>
            </div>
            <a href="${escapeHtml(lc.url)}" target="_blank" class="coding-visit-btn">visit &#8599;</a>
          </div>
          <div class="coding-stats-grid">
            <div class="coding-stat">
              <div class="coding-stat-num green">${escapeHtml(lc.problemsSolved)}+</div>
              <div class="coding-stat-label">problems solved</div>
            </div>
            <div class="coding-stat">
              <div class="coding-stat-num" style="color:#ffc56a;">${escapeHtml(lc.contestRating)}</div>
              <div class="coding-stat-label">contest rating</div>
            </div>
            <div class="coding-stat">
              <div class="coding-stat-num" style="color:#6ab4ff;">${escapeHtml(lc.mainTag)}</div>
              <div class="coding-stat-label">main focus</div>
            </div>
          </div>
          <div class="coding-tags">
            ${(lc.tags || []).map(t => `<span class="coding-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>`;
      }

      if (hr) {
        const badges = (hr.badges || []).slice(0, 3);
        html += `
        <div class="coding-card reveal reveal-delay-2">
          <div class="coding-header">
            <div class="coding-logo hr-logo">HR</div>
            <div class="coding-platform-info">
              <div class="coding-platform-name">HackerRank</div>
              <div class="coding-handle">@${escapeHtml(hr.username)}</div>
            </div>
            <a href="${escapeHtml(hr.url)}" target="_blank" class="coding-visit-btn">visit &#8599;</a>
          </div>
          <div class="coding-stats-grid">
            ${badges.map(b => `
              <div class="coding-stat">
                <div class="coding-stat-num" style="color:#4eff91;">${'&#9733;'.repeat(Math.min(Number(b.stars) || 0, 5))}</div>
                <div class="coding-stat-label">${escapeHtml(b.programmingLanguage)}</div>
              </div>
            `).join('')}
          </div>
          <div class="coding-tags">
            ${(hr.tags || []).map(t => `<span class="coding-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>`;
      }

      grid.innerHTML = html;
      observeReveals(grid);
    } catch (e) {
      console.warn('coding stats fetch failed, keeping fallback content:', e.message);
    }
  }

  /* re-run the scroll-reveal observer on freshly injected nodes */
  function observeReveals(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      revealObs.observe(el);
    });
  }

  /* ── CONTACT FORM ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('cf-submit');
      const status = document.getElementById('cf-status');
      const payload = {
        name: document.getElementById('cf-name').value.trim(),
        email: document.getElementById('cf-email').value.trim(),
        message: document.getElementById('cf-message').value.trim()
      };
      if (!payload.name || !payload.email || !payload.message) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'sending...';
      status.textContent = '';
      status.className = 'contact-form-status';

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        status.textContent = '✓ message sent — thanks, I\'ll get back to you soon.';
        status.className = 'contact-form-status ok';
        contactForm.reset();
      } catch (err) {
        status.textContent = `✗ failed to send: ${err.message}. try emailing directly instead.`;
        status.className = 'contact-form-status err';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'send';
    });
  }

  /* ── INIT ── */
  loadProjects();
  loadCerts();
  loadCoding();