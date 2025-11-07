// register plugin
gsap.registerPlugin(ScrollTrigger);

// HERO intro animations
gsap.from(".name", { y: 36, opacity: 0, duration: 1.1, ease: "power3.out" });
gsap.from(".tagline", { y: 20, opacity: 0, duration: 0.9, delay: 0.15, ease: "power2.out" });
gsap.from(".cv-cta", { scale: 0.92, opacity: 0, duration: 0.9, delay: 0.4, ease: "back.out(1.6)" });

// PROJECT reveal (will animate when panel becomes active and cards are visible)
function animatePanel(panel) {
  const cards = panel.querySelectorAll(".card");
  gsap.fromTo(cards, { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "power3.out"
  });
}

// Initial: animate visible panel
document.addEventListener("DOMContentLoaded", () => {
  const activePanel = document.querySelector(".carousel-panel.active");
  if (activePanel) animatePanel(activePanel);
});

// Scroll-triggered parallax for images inside cards
gsap.utils.toArray(".card img").forEach(img => {
  gsap.to(img, {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

// Tabs: switch panels
const tabs = document.querySelectorAll(".tab");
tabs.forEach(tab => {
  tab.addEventListener("click", (e) => {
    const target = tab.dataset.target;
    // switch active tab
    tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected","true");

    // switch panels
    document.querySelectorAll(".carousel-panel").forEach(panel => panel.classList.remove("active"));
    const panel = document.getElementById(target);
    panel.classList.add("active");

    // reset scroll position of that carousel
    const carousel = panel.querySelector(".carousel");
    carousel.scrollLeft = 0;

    // animate cards in panel
    // small timeout to allow display change to flow
    setTimeout(() => animatePanel(panel), 60);
  });
});

// Carousel arrow navigation
document.querySelectorAll(".arrow").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.carousel;
    const panel = document.getElementById(name);
    if (!panel) return;
    const carousel = panel.querySelector(".carousel");
    const cardWidth = panel.querySelector(".card").offsetWidth + 20; // card + gap
    if (btn.classList.contains("left")) {
      carousel.scrollBy({ left: -(cardWidth * 2), behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: cardWidth * 2, behavior: "smooth" });
    }
  });
});

// keyboard accessibility: arrow keys move focused carousel
document.querySelectorAll(".carousel").forEach(car => {
  car.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") car.scrollBy({ left: 320, behavior: "smooth" });
    if (e.key === "ArrowLeft") car.scrollBy({ left: -320, behavior: "smooth" });
  });
});

// Progress bar
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";
});
