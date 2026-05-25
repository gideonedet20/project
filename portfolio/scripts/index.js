    // ── Cursor
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
    function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); }
    animRing();
    document.querySelectorAll('a, button, .skill-card, .project-card, .service-card').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.style.opacity = '0.5'; });
      el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '1'; });
    });
 
    // ── Scroll progress
    const progress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (s / h * 100) + '%';
    });
 
    // ── Nav scroll
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); });
 
    // ── Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    function closeMobile() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }
 
    // ── Reveal on scroll
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // animate skill bars
          e.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
 
    // Also trigger skill bars when their parent becomes visible
    document.querySelectorAll('.skill-card').forEach(card => {
      const cardObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const bar = e.target.querySelector('.skill-bar');
            if (bar) bar.style.width = bar.dataset.width + '%';
          }
        });
      }, { threshold: 0.5 });
      cardObs.observe(card);
    });
 
    // ── Count-up animation
    function countUp(el, target, duration) {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        el.textContent = Math.round(start) + (target === 100 ? '' : '+');
      }, 16);
    }
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('[data-count]').forEach(el => {
            countUp(el, parseInt(el.dataset.count), 1200);
          });
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObs.observe(statsEl);
 
    // ── Hero immediate reveal
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal, .hero .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 200);
 
    // ── Form send
    function handleSend() {
      const btn = document.getElementById('sendBtn');
      btn.textContent = 'Sending…';
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.innerHTML = 'Message Sent ✓';
        btn.style.opacity = '1';
        btn.style.background = '#6be585';
        setTimeout(() => {
          btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
          btn.style.background = '';
        }, 2500);
      }, 1200);
    }
 
    // ── Smooth active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
      });
    });