const controls = document.querySelector("[data-blog-controls]");

if (controls) {
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));
  const grid = document.querySelector("[data-post-grid]");
  const results = document.querySelector("[data-results-line]");
  const emptyState = document.querySelector("[data-empty-state]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const sortSelect = document.querySelector("[data-sort]");
  const params = new URLSearchParams(window.location.search);

  let activeFilter = (params.get("tag") || "all").toLowerCase();
  let activeSort = (params.get("sort") || "newest").toLowerCase();

  const applyState = () => {
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === activeFilter);
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
      const tags = card.dataset.tags.split(",").filter(Boolean);
      const visible = activeFilter === "all" || tags.includes(activeFilter);
      card.hidden = !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

    if (results) {
      results.textContent = activeFilter === "all"
        ? `${visibleCount} posts`
        : `${visibleCount} posts in "${activeFilter}"`;
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
  };

  if (!filterButtons.some((button) => button.dataset.filter === activeFilter)) {
    activeFilter = "all";
  }

  if (!["newest", "oldest", "title"].includes(activeSort)) {
    activeSort = "newest";
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      applyState();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      activeSort = event.target.value;
      applyState();
    });
  }

  applyState();
}
