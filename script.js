gsap.registerPlugin(ScrollTrigger);

// Parallax & fade
gsap.to('.hero-image', {
  y: -100, scale: 0.8, opacity: 0.7,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-name', {
  y: -60, opacity: 0.8,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-tagline', {
  y: -40, opacity: 0.6,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Header shrink
const header = document.getElementById('site-header');
ScrollTrigger.create({
  start: 'top -100',
  onEnter: () => header.classList.add('shrunk'),
  onLeaveBack: () => header.classList.remove('shrunk')
});

// Fade-in cards
gsap.utils.toArray('.company-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out'
  });
});

// Populate scrolls
const projects = { dream11: 7, sports: 5, zee: 3 };
Object.keys(projects).forEach(key => {
  const container = document.getElementById(`${key}-scroll`);
  for (let i = 1; i <= projects[key]; i++) {
    const div = document.createElement('div');
    div.className = 'scroll-item';
    div.innerHTML = `
      <img src="assets/${key}-${i}.jpg" alt="${key} project ${i}">
      <h4>Project ${i}</h4>
      <p>Short description for ${key} project ${i}</p>
    `;
    container.appendChild(div);
  }
});

// Scroll arrows
document.querySelectorAll('.scroll-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const container = document.getElementById(`${target}-scroll`);
    const dir = btn.classList.contains('left') ? -1 : 1;
    container.scrollBy({ left: 300 * dir, behavior: 'smooth' });
  });
});
