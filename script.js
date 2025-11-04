gsap.registerPlugin(ScrollTrigger);

// Fade-in on scroll
gsap.utils.toArray(".project").forEach((proj) => {
  gsap.fromTo(
    proj,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: proj,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});
