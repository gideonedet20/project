// ─────────────────────────────────────────────────────────────
//  Gideon Edet — Portfolio JS
//  Includes: cursor, scroll, mobile menu, animations, contact form
// ─────────────────────────────────────────────────────────────

// ── CONFIG: Update this URL when you deploy your backend ──────
const BACKEND_URL = "http://localhost:3000/contact";
// e.g. "https://your-app.onrender.com/contact"
// ─────────────────────────────────────────────────────────────


// ── Custom Cursor ─────────────────────────────────────────────
const cursorDot  = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
if (cursorDot && cursorRing) {
  document.addEventListener("mousemove", e => {
    cursorDot.style.left  = e.clientX + "px";
    cursorDot.style.top   = e.clientY + "px";
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top  = e.clientY + "px";
  });
}


// ── Scroll Progress Bar ───────────────────────────────────────
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  if (!scrollProgress) return;
  const max = document.body.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (window.scrollY / max * 100) + "%";
});


// ── Sticky Nav ────────────────────────────────────────────────
const mainNav = document.getElementById("mainNav");
window.addEventListener("scroll", () => {
  if (!mainNav) return;
  mainNav.classList.toggle("scrolled", window.scrollY > 50);
});


// ── Mobile Menu ───────────────────────────────────────────────
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger?.addEventListener("click", () => {
  mobileMenu?.classList.toggle("open");
  hamburger.classList.toggle("open");
});
function closeMobile() {
  mobileMenu?.classList.remove("open");
  hamburger?.classList.remove("open");
}


// ── Scroll Reveal ─────────────────────────────────────────────
const revealEls = document.querySelectorAll(".reveal, .reveal-right");
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));


// ── Animated Counters ─────────────────────────────────────────
const counters = document.querySelectorAll(".stat-num[data-count]");
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.count;
    const step   = Math.ceil(target / 60);
    let current  = 0;
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 25);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));


// ── Skill Bars ────────────────────────────────────────────────
const skillBars = document.querySelectorAll(".skill-bar[data-width]");
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + "%";
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObserver.observe(b));


// ── Contact Form ───────────────────────────────────────────────
async function handleSend() {
  const btn = document.getElementById("sendBtn");

  // Grab inputs
  const inputs = {
    firstName: document.querySelector(".contact-form input[placeholder='John']"),
    lastName:  document.querySelector(".contact-form input[placeholder='Doe']"),
    email:     document.querySelector(".contact-form input[type='email']"),
    subject:   document.querySelector(".contact-form input[placeholder='Project Inquiry']"),
    message:   document.querySelector(".contact-form textarea"),
  };

  // Validate
  if (!inputs.firstName?.value.trim()) return showFormError("Please enter your first name.");
  if (!inputs.email?.value.trim())     return showFormError("Please enter your email address.");
  if (!inputs.message?.value.trim())   return showFormError("Please enter a message.");

  const payload = {
    firstName: inputs.firstName.value.trim(),
    lastName:  inputs.lastName?.value.trim()  || "",
    email:     inputs.email.value.trim(),
    subject:   inputs.subject?.value.trim()   || "Portfolio Inquiry",
    message:   inputs.message.value.trim(),
  };

  // Loading state
  btn.disabled = true;
  btn.innerHTML = `Sending… <span class="spinner"></span>`;

  try {
    const res  = await fetch(BACKEND_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showFormSuccess("✅ Message sent! I'll get back to you within 24 hours.");
      // Clear form
      Object.values(inputs).forEach(el => { if (el) el.value = ""; });
    } else {
      showFormError(data.error || "Something went wrong. Please try again.");
    }
  } catch (err) {
    showFormError("Could not reach the server. Check your connection.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Send Message <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  }
}

function showFormSuccess(msg) {
  removeFormFeedback();
  const el = document.createElement("p");
  el.className = "form-feedback form-success";
  el.textContent = msg;
  document.querySelector(".contact-form")?.appendChild(el);
}

function showFormError(msg) {
  removeFormFeedback();
  const el = document.createElement("p");
  el.className = "form-feedback form-error";
  el.textContent = msg;
  document.querySelector(".contact-form")?.appendChild(el);
}

function removeFormFeedback() {
  document.querySelectorAll(".form-feedback").forEach(el => el.remove());
}
