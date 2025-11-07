// GSAP Parallax + Sticky Header + Scroll setup

gsap.registerPlugin(ScrollTrigger);

// Parallax hero elements
const heroImg = document.querySelector('.hero-image');
const heroName = document.querySelector('.hero-name');
const heroTag = document.querySelector('.hero-tagline');

// Parallax motion
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

tl.to(heroImg, { y: -100, scale: 0.8, opacity: 0.6 }, 0)
  .to(heroName, { y: -60, opacity: 0.7 }, 0)
  .to(heroTag, { y: -40, opacity: 0.5 }, 0);

// Sticky header shrink
const header = document.getElementById('site-header');
ScrollTrigger.create({
  start: 'top -100',
  onEnter: () => header.classList.add('shrunk'),
  onLeaveBack: () => header.classList.remove('shrunk')
});

// Populate project scrolls
const projects = {
  dream11: 7,
  sports: 5,
  zee: 3
};

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

// Horizontal scroll buttons
const scrollBtns = document.querySelectorAll('.scroll-btn');
scrollBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const container = document.getElementById(`${target}-scroll`);
    const direction = btn.classList.contains('left') ? -1 : 1;
    const scrollAmount = 300 * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
});
