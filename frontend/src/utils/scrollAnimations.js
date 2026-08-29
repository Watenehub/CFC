// Scroll Animations Utility
// Adds intersection observer for fade-up, fade-in, slide-up, and scale-in animations

export const initScrollAnimations = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: Unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .slide-up, .scale-in');
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });

  return observer;
};

// Cleanup function
export const cleanupScrollAnimations = (observer) => {
  if (observer) {
    observer.disconnect();
  }
};

// Initialize on page load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
}
