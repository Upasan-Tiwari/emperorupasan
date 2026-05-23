document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initCustomCursor();
  initScrollReveal();
  initMobileMenu();
  initPageTransitions();
});

/* ==========================================================================
   1. HOME PAGE LOADING INTRO SCREEN
   ========================================================================== */
function initLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  const wrapper = document.getElementById("page-wrapper");

  if (loader) {
    // Show loader and hide body scroll temporarily
    document.body.style.overflowY = "hidden";

    // Wait 1.8 seconds (duration of CSS animation), then fade out screen
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      document.body.style.overflowY = "auto";
      
      // Animate the main page transition wrapper content in
      if (wrapper) {
        wrapper.classList.add("fade-in");
      }
    }, 1800);
  } else {
    // If no loading screen exists (other inner pages), immediately make page visible
    if (wrapper) {
      wrapper.classList.add("fade-in");
    }
  }
}

/* ==========================================================================
   2. CUSTOM PREMIUM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  // Safety Check: Avoid initialization on devices with touch capabilities
  if (window.matchMedia("(pointer: coarse)").matches) {
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
    return;
  }

  let mouseX = 0, mouseY = 0; // Absolute mouse positions
  let ringX = 0, ringY = 0; // Trailing ring positions

  // Reveal cursor elements on mouse move
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.opacity = "1";
      dot.style.top = `${mouseY}px`;
      dot.style.left = `${mouseX}px`;
    }
    if (ring) {
      ring.style.opacity = "1";
    }
  });

  // Smooth movement animation loop using linear interpolation (lerp)
  function renderCursor() {
    // Speed constant: lower value means slower trailing animation (0.15 is ideal)
    const easing = 0.15;
    
    ringX += (mouseX - ringX) * easing;
    ringY += (mouseY - ringY) * easing;

    if (ring) {
      ring.style.top = `${ringY}px`;
      ring.style.left = `${ringX}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Scale cursor elements when hovering clickable items
  const clickables = document.querySelectorAll("a, button, .project-card");
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (ring) ring.style.transform = "translate(-50%, -50%) scale(1.5)";
      if (dot) dot.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      if (ring) ring.style.transform = "translate(-50%, -50%) scale(1)";
      if (dot) dot.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

/* ==========================================================================
   3. SCROLL REVEAL (FADE-UP VISIBILITY)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Reveal only once per load
      }
    });
  }, {
    threshold: 0.1, // Element is revealed when 10% visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before the viewport bottom
  });

  reveals.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* ==========================================================================
   4. HAMBURGER SLIDE-IN MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const burgerBtn = document.getElementById("burger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      burgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");

      // Lock scrolling when overlay menu is active
      if (mobileMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }
}

/* ==========================================================================
   5. PREMIUM SMOOTH INTER-PAGE TRANSITIONS
   ========================================================================== */
function initPageTransitions() {
  const links = document.querySelectorAll("a");
  const wrapper = document.getElementById("page-wrapper");

  links.forEach((link) => {
    link.addEventListener("click", function(e) {
      const targetUrl = this.getAttribute("href");

      // Verify that link destination is a relative page link (avoid external links and fragments)
      if (
        targetUrl && 
        !targetUrl.startsWith("#") && 
        !targetUrl.startsWith("http") && 
        !this.getAttribute("target")
      ) {
        e.preventDefault();

        if (wrapper) {
          // Fade-out content
          wrapper.classList.remove("fade-in");
          wrapper.classList.add("fade-out");

          // Navigate to new resource after transition finishes (400ms)
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 400);
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });
}