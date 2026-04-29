const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

const workItems = document.querySelectorAll(".work-item");

workItems.forEach((item) => {
  const trigger = item.querySelector(".work-row");

  trigger.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");

    workItems.forEach((entry) => {
      entry.classList.remove("is-active");
      const button = entry.querySelector(".work-row");
      button.setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("is-active");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});
