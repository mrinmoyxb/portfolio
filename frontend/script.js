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
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are MrinmoyNLP v1.0, an NLP inference API built by Mrinmoy Borah (ML researcher, Android + backend developer). Analyze the following user input and respond ONLY with a JSON object — no markdown, no explanation, no backticks.

Input: "${input}"

Return exactly this JSON structure:
{
  "sentiment": { "label": "POSITIVE|NEGATIVE|NEUTRAL", "score": <0.0-1.0> },
  "intent": "<2-4 word intent label>",
  "domain": "<ML|Backend|Android|General|Research|Creative|Other>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"],
  "confidence": <0.0-1.0>,
  "response": "<one short, witty, personalized sentence acknowledging the input, relating it to Mrinmoy's skills>",
  "tokens": <estimated token count integer>
}`
          }]
        })
      });
      const data = await res.json();
      const latency = Date.now() - t0;
      const raw = data.content[0].text;
      let result;
      try { result = JSON.parse(raw); } catch(e) {
        // fallback parse if model added any wrapper text
        const match = raw.match(/\{[\s\S]*\}/);
        result = match ? JSON.parse(match[0]) : null;
      }
      if (!result) throw new Error('parse failed');
      renderResult(result, latency, input);
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
    const sentColor = r.sentiment.label === 'POSITIVE' ? '#4eff91' : r.sentiment.label === 'NEGATIVE' ? '#ff8a7a' : '#ffc56a';
    const domainColor = { ML:'#4eff91', Backend:'#6ab4ff', Android:'#A97BFF', Research:'#ffc56a', Creative:'#ff8a7a', General:'#7a9c82', Other:'#7a9c82' }[r.domain] || '#7a9c82';
    const confPct = Math.round(r.confidence * 100);
    const sentPct = Math.round(r.sentiment.score * 100);

    document.getElementById('ml-output').innerHTML = `
      <div class="ml-meta-row">
        <span class="ml-meta-item">⏱ ${latency}ms</span>
        <span class="ml-meta-item">~${r.tokens || '?'} tokens</span>
        <span class="ml-meta-item ml-domain" style="color:${domainColor}">⬡ ${r.domain}</span>
      </div>
      <div class="ml-result-grid">
        <div class="ml-result-row">
          <span class="ml-label">SENTIMENT</span>
          <span class="ml-value" style="color:${sentColor}">${r.sentiment.label}</span>
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
          <span class="ml-value" style="color:#6ab4ff">${r.intent}</span>
        </div>
      </div>
      <div class="ml-tags">
        ${(r.tags||[]).map(t => `<span class="ml-tag">${t}</span>`).join('')}
      </div>
      <div class="ml-response">&gt; ${r.response}</div>
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