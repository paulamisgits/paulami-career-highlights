/* 
Required assets (place in /assets/):
- dream11-header.gif
- sportz-header.gif
- zee-header.gif
- dream11-1.jpg ... dream11-7.jpg
- sports-1.jpg ... sports-5.jpg
- zee-1.jpg ... zee-3.jpg
- paulami-chakraborty.pdf
*/

/* GLOBAL */
gsap.registerPlugin(ScrollTrigger);

// small hero intro
gsap.from(".name", { y: 36, opacity: 0, duration: 1, ease: "power3.out" });
gsap.from(".tagline", { y: 20, opacity: 0, duration: 0.9, delay: 0.15, ease: "power2.out" });
gsap.from(".cv-cta", { scale: 0.92, opacity: 0, duration: 0.9, delay: 0.4, ease: "back.out(1.6)" });

// progress bar
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";
});

/* Modal / fullscreen logic */
const cards = document.querySelectorAll(".company-card");
const modal = document.getElementById("fs-modal");
const fsBg = document.getElementById("fs-bg");
const fsTitle = document.getElementById("fs-title");
const fsTag = document.getElementById("fs-tagline");
const fsCarousel = document.getElementById("fs-carousel");
const fsClose = document.getElementById("fs-close");
const leftArrow = document.getElementById("fs-left");
const rightArrow = document.getElementById("fs-right");

let activeCompany = null;
let currentIndex = 0;
let modalOpen = false;

// data: lists for each company (image filename, title, short)
const DATA = {
  dream11: [
    ["dream11-1.jpg","Feature Adoption Series","In-app story tiles that increased feature discovery."],
    ["dream11-2.jpg","Retention Push — Season","Timed campaigns around match windows to boost DAU."],
    ["dream11-3.jpg","Behavioral Messaging","Segmentation-led copy that improved CTRs."],
    ["dream11-4.jpg","Gamified Tips","Tutorials reframed as challenges to boost completion."],
    ["dream11-5.jpg","Adoption Dashboard","Visualized uptake to prioritize content sequencing."],
    ["dream11-6.jpg","Copy A/B","Tonal tests that improved engagement by 12%."],
    ["dream11-7.jpg","Impact & Rollout","20% retention uplift for target cohort over 90 days."]
  ],
  sports: [
    ["sports-1.jpg","Pressure Index Visuals","Made match momentum tangible with simple visuals."],
    ["sports-2.jpg","Brand Story Templates","Assets for sponsor activations and social."],
    ["sports-3.jpg","Real-time Narratives","Short match snippets that boosted live engagement."],
    ["sports-4.jpg","Product-Led Copy","Microcopy for overlays & tooltips to aid usage."],
    ["sports-5.jpg","Partner Case Study","Materials that helped secure enterprise partnerships."]
  ],
  zee: [
    ["zee-1.jpg","What’s Next Journeys","Triggered pushes reduced churn during content dips."],
    ["zee-2.jpg","Micro-seg Messaging","Hooks tailored to viewer moods and patterns."],
    ["zee-3.jpg","Retention Spike","15% DAU lift in a 30-day reactivation sprint."]
  ]
};

// helper: build carousel DOM for chosen company
function buildCarousel(company) {
  fsCarousel.innerHTML = ""; // clear
  const list = DATA[company] || [];
  list.forEach((item, idx) => {
    const [img, title, desc] = item;
    const card = document.createElement("div");
    card.className = "fs-card";
    card.setAttribute("role","listitem");
    card.innerHTML = `
      <img src="assets/${img}" alt="${title}">
      <h4>${title}</h4>
      <p>${desc}</p>
    `;
    fsCarousel.appendChild(card);
  });
  // reset scroll
  fsCarousel.scrollLeft = 0;
}

// open modal with cinematic animation
function openModal(company, gifUrl, title, tagline) {
  if (modalOpen) return;
  activeCompany = company;
  // set bg image
  fsBg.style.backgroundImage = `url('${gifUrl}')`;
  // set header
  fsTitle.textContent = title;
  fsTag.textContent = tagline;
  // build carousel
  buildCarousel(company);
  // show modal (display:flex)
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  // animate bg and panel
  gsap.killTweensOf([fsBg, ".fs-body"]);
  gsap.timeline()
    .to(fsBg, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" })
    .fromTo(".fs-body", { y: 18, opacity: 0, scale: 0.99 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, "-=0.38")
    .call(() => { modalOpen = true; currentIndex = 0; focusCarousel(); animateCardsIn(); });
}

// close modal
function closeModal() {
  if (!modalOpen) return;
  gsap.timeline()
    .to(".fs-body", { y: 12, opacity: 0, scale: 0.98, duration: 0.35, ease: "power2.in" })
    .to(fsBg, { opacity: 0, duration: 0.45, ease: "power2.in" }, "-=0.2")
    .call(() => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden","true");
      fsBg.style.backgroundImage = "";
      fsCarousel.innerHTML = "";
      modalOpen = false;
      // restore focus to the originating card
      const originating = document.querySelector(`.company-card[data-company="${activeCompany}"]`);
      if (originating) originating.focus();
      activeCompany = null;
    });
}

// animate cards in modal
function animateCardsIn() {
  const cards = gsap.utils.toArray(".fs-card");
  gsap.fromTo(cards, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
}

// focus carousel for keyboard nav
function focusCarousel() {
  const first = fsCarousel.querySelector(".fs-card");
  if (first) first.focus();
}

// event: clicking company cards
cards.forEach(card => {
  const company = card.dataset.company;
  card.addEventListener("click", () => {
    const gif = card.dataset.gif || `assets/${company}-header.gif`;
    const title = card.querySelector("h2").textContent;
    const tagline = card.querySelector(".sub").textContent;
    openModal(company, gif, title, tagline);
  });
  // keyboard enter/space support
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

// close button
fsClose.addEventListener("click", closeModal);

// arrow nav inside modal (scrolls the carousel by card width)
leftArrow.addEventListener("click", () => {
  scrollCarouselBy(-1);
});
rightArrow.addEventListener("click", () => {
  scrollCarouselBy(1);
});

function scrollCarouselBy(direction) {
  const card = fsCarousel.querySelector(".fs-card");
  if (!card) return;
  const style = window.getComputedStyle(card);
  const gap = 18; // matches CSS gap
  const cardWidth = card.offsetWidth + gap;
  fsCarousel.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
}

// keyboard controls: Esc closes, arrows navigate when modal open
document.addEventListener("keydown", (e) => {
  if (!modalOpen) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") scrollCarouselBy(-1);
  if (e.key === "ArrowRight") scrollCarouselBy(1);
});

// Small touch: swipe left/right for mobile in modal
let startX = 0;
fsCarousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
fsCarousel.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) {
    scrollCarouselBy(dx < 0 ? 1 : -1);
  }
});

// Accessibility: trap focus within modal when open
document.addEventListener("focus", function(e) {
  if (!modalOpen) return;
  if (!modal.contains(e.target)) {
    e.stopPropagation();
    // move focus to close button
    fsClose.focus();
  }
}, true);
