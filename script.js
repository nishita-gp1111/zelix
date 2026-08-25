const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

const revealItems = document.querySelectorAll(
  ".section-head, .concept-copy, .card, .service-card, .value-card, .table, .media-frame, .mvv-hero, .works, .contact-panel, .principles"
);

revealItems.forEach((item) => {
  const siblings = item.parentElement
    ? Array.from(item.parentElement.children).filter((child) => child.matches(".card, .service-card, .value-card"))
    : [];
  const index = siblings.indexOf(item);

  item.classList.add("reveal");
  if (index >= 0) {
    item.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
  }
});

document.querySelectorAll(".works li, .principles li").forEach((item, index) => {
  item.style.setProperty("--item-index", index);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

let scrollTicking = false;

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;
  const hero = document.querySelector(".hero");
  const pageHero = document.querySelector(".page-hero");

  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  siteHeader?.classList.toggle("is-scrolled", scrollTop > 18);

  if (hero) {
    const heroProgress = Math.min(scrollTop / Math.max(hero.offsetHeight, 1), 1);
    hero.style.setProperty("--hero-copy-y", `${(heroProgress * 42).toFixed(1)}px`);
    hero.style.setProperty("--hero-visual-y", `${(heroProgress * 24).toFixed(1)}px`);
    hero.style.setProperty("--hero-opacity", Math.max(1 - heroProgress * 0.72, 0.28).toFixed(3));
  }

  if (pageHero) {
    const pageHeroProgress = Math.min(scrollTop / Math.max(pageHero.offsetHeight, 1), 1);
    pageHero.style.setProperty("--page-hero-y", `${(pageHeroProgress * 34).toFixed(1)}px`);
  }

  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollEffects);
  },
  { passive: true }
);

updateScrollEffects();

const heroVisual = document.querySelector(".hero-visual");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroVisual && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty("--tilt-x", `${(-y * 2.4).toFixed(2)}deg`);
    heroVisual.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
  });
}

if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".card, .service-card, .value-card, .media-frame, .mvv-hero").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      surface.style.setProperty("--pointer-x", `${x.toFixed(1)}%`);
      surface.style.setProperty("--pointer-y", `${y.toFixed(1)}%`);
    });

    surface.addEventListener("pointerleave", () => {
      surface.style.removeProperty("--pointer-x");
      surface.style.removeProperty("--pointer-y");
    });
  });
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const message = form.querySelector("[data-form-message]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const endpoint = form.getAttribute("action");
    const isPlaceholder = !endpoint || endpoint.includes("YOUR_FORM_ID");

    try {
      if (!isPlaceholder) {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("form-submit-failed");
        }
      }

      form.reset();
      if (message) {
        message.textContent = "お問い合わせありがとうございます。";
        message.classList.add("is-visible");
      }
    } catch {
      if (message) {
        message.textContent = "送信できませんでした。お手数ですが、電話またはメールでお問い合わせください。";
        message.classList.add("is-visible");
      }
    }
  });
});
