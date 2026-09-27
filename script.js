const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const navLinks = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".module-card");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

function closeMenu() {
  primaryNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 680) closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 680) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && primaryNav.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateCards(filter) {
  let visibleCount = 0;

  cards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "module" : "modules"}`;
  emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    updateCards(button.dataset.filter);
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});