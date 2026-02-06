// ---------- Helpers ----------
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

/* ---------- Scroll progress bar ---------- */
function updateScrollBar(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  $("#scrollbar").style.width = `${p}%`;
}
window.addEventListener("scroll", updateScrollBar, { passive: true });
updateScrollBar();

/* ---------- Reveal on scroll ---------- */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* ---------- Animated counters ---------- */
function animateCount(el, target){
  const isInt = Number.isInteger(target);
  const duration = 900;
  const start = performance.now();
  const from = 0;

  function tick(now){
    const t = Math.min((now - start) / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - t, 3);
    const val = from + (target - from) * eased;
    el.textContent = isInt ? Math.round(val) : val.toFixed(2);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterEls = $$("[data-count]");
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      const el = e.target;
      const target = parseFloat(el.getAttribute("data-count"));
      animateCount(el, target);
      counterIO.unobserve(el);
    }
  });
}, { threshold: 0.3 });

counterEls.forEach(el => counterIO.observe(el));

/* ---------- Compare slider ---------- */
$$("[data-compare]").forEach(comp => {
  const range = comp.querySelector("[data-range]");
  const overlay = comp.querySelector("[data-overlay]");
  const handle = comp.querySelector("[data-handle]");

  function setPos(v){
    overlay.style.width = `${v}%`;
    handle.style.left = `${v}%`;
  }

  setPos(range.value);

  range.addEventListener("input", () => setPos(range.value));
});

/* ---------- Theme toggle ---------- */
const themeBtn = $("#themeBtn");
const root = document.documentElement;

function setTheme(mode){
  if (mode === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");

  localStorage.setItem("theme", mode);
  themeBtn.querySelector(".icon").textContent = (mode === "light") ? "☼" : "☾";
}

const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);

themeBtn.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
