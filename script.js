const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const startAtTop = () => {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
};

startAtTop();
window.addEventListener("pageshow", startAtTop);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    const target = id === "top" ? document.body : document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
});

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
);

revealItems.forEach((item, index) => {
  if (item.closest(".hero")) item.style.transitionDelay = `${150 + index * 80}ms`;
  revealObserver.observe(item);
});

let parallaxTicking = false;

const updateParallax = () => {
  parallaxItems.forEach((item) => {
    const rect = item.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const speed = Number(item.dataset.parallax);
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  parallaxTicking = false;
};

const handleScroll = () => {
  updateHeader();
  if (!reducedMotion && !parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
};

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", updateParallax);
updateHeader();
updateParallax();

const projectData = [
  {
    title: "Herringbone",
    caption: "A sneak peek of Gudino’s & Co. hardwood flooring work.",
    image: "assets/project-09.jpg",
    alt: "Glossy herringbone hardwood flooring",
  },
  {
    title: "Tri-pattern white oak",
    caption: "A custom white oak floor pattern completed in 2020.",
    image: "assets/project-06.jpg",
    alt: "Rich custom-finished hardwood floor",
  },
  {
    title: "Character color",
    caption: "A character-rich custom floor color.",
    image: "assets/project-04.jpg",
    alt: "Warm character-grade wood floor",
  },
  {
    title: "Rustic red oak",
    caption: "A rustic red oak wood floor installation completed in 2021.",
    image: "assets/project-02.jpg",
    alt: "Rustic red oak floor installation",
  },
  {
    title: "Red oak, back to life",
    caption: "Red oak floors restored through careful refinishing.",
    image: "assets/project-03.jpg",
    alt: "Red oak floor being refinished",
  },
  {
    title: "Flush registers",
    caption: "A set of twenty register installations integrated into the floor.",
    image: "assets/project-05.jpg",
    alt: "Wood floor with flush register installation",
  },
];

const dialog = document.querySelector(".project-dialog");
const dialogImage = dialog.querySelector("img");
const dialogTitle = dialog.querySelector("h2");
const dialogCaption = dialog.querySelector("p");
const dialogClose = dialog.querySelector(".dialog-close");

document.querySelectorAll("[data-project]").forEach((project) => {
  project.addEventListener("click", () => {
    const data = projectData[Number(project.dataset.project)];
    dialogImage.src = data.image;
    dialogImage.alt = data.alt;
    dialogTitle.textContent = data.title;
    dialogCaption.textContent = data.caption;
    document.body.classList.add("dialog-open");
    dialog.showModal();
  });
});

const closeDialog = () => {
  dialog.close();
  document.body.classList.remove("dialog-open");
};

dialogClose.addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("cancel", () => document.body.classList.remove("dialog-open"));
