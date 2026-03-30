const navLinks = Array.from(document.querySelectorAll("[data-nav-key]"));
const normalizeValue = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
const getFilterValue = (element) => normalizeValue(element?.dataset.filter);
const getCardTags = (card) => (card?.dataset.tags || "")
  .split(",")
  .map((tag) => normalizeValue(tag))
  .filter(Boolean);

const syncNav = (activeFilterValue) => {
  if (navLinks.length === 0) {
    return;
  }

  navLinks.forEach((link) => link.classList.remove("is-active"));

  const pathname = window.location.pathname;

  if (pathname.includes("/portfolio/")) {
    const portfolioLink = navLinks.find((link) => link.dataset.navKey === "portfolio");
    if (portfolioLink) {
      portfolioLink.classList.add("is-active");
    }
    return;
  }

  if (pathname.includes("/blog/")) {
    const navKey = activeFilterValue === "writeup" ? "writeups" : "blog";
    const activeLink = navLinks.find((link) => link.dataset.navKey === navKey);
    if (activeLink) {
      activeLink.classList.add("is-active");
    }
  }
};

const controls = document.querySelector("[data-blog-controls]");

if (controls) {
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));
  const grid = document.querySelector("[data-post-grid]");
  const results = document.querySelector("[data-results-line]");
  const emptyState = document.querySelector("[data-empty-state]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const tagLinks = Array.from(document.querySelectorAll("[data-tag-link]"));
  const sortSelect = document.querySelector("[data-sort]");
  const params = new URLSearchParams(window.location.search);

  let activeFilter = normalizeValue(params.get("tag") || "all");
  let activeSort = normalizeValue(params.get("sort") || "newest");

  const applyState = () => {
    filterButtons.forEach((button) => {
      const isActive = getFilterValue(button) === activeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (sortSelect) {
      sortSelect.value = activeSort;
    }

    const sortedCards = [...cards].sort((a, b) => {
      if (activeSort === "oldest") {
        return Number(a.dataset.date) - Number(b.dataset.date);
      }

      if (activeSort === "title") {
        return a.dataset.title.localeCompare(b.dataset.title);
      }

      return Number(b.dataset.date) - Number(a.dataset.date);
    });

    sortedCards.forEach((card) => grid.appendChild(card));

    let visibleCount = 0;

    sortedCards.forEach((card) => {
      const tags = getCardTags(card);
      const visible = activeFilter === "all" || tags.includes(activeFilter);
      card.hidden = !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

    if (results) {
      results.textContent = activeFilter === "all"
        ? `${visibleCount} 件の記事`
        : `タグ: ${activeFilter} / ${visibleCount} 件`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    const nextParams = new URLSearchParams();

    if (activeFilter !== "all") {
      nextParams.set("tag", activeFilter);
    }

    if (activeSort !== "newest") {
      nextParams.set("sort", activeSort);
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
    syncNav(activeFilter);
  };

  if (!filterButtons.some((button) => getFilterValue(button) === activeFilter)) {
    activeFilter = "all";
  }

  if (!["newest", "oldest", "title"].includes(activeSort)) {
    activeSort = "newest";
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = getFilterValue(button);
      applyState();
    });
  });

  tagLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const nextFilter = normalizeValue(link.dataset.tagLink);

      if (!filterButtons.some((button) => getFilterValue(button) === nextFilter)) {
        return;
      }

      event.preventDefault();
      activeFilter = nextFilter;
      applyState();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      activeSort = normalizeValue(event.target.value);
      applyState();
    });
  }

  applyState();
} else {
  syncNav("all");
}
