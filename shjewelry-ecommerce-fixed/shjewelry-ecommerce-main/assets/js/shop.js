document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("shop");
  renderFooter();

  const params = new URLSearchParams(window.location.search);
  const state = {
    q: params.get("q") || "",
    category: params.get("category") || "All",
    sort: "featured"
  };

  const chipsEl = document.getElementById("categoryChips");
  const searchEl = document.getElementById("shopSearch");
  const sortEl = document.getElementById("sortSelect");
  const gridEl = document.getElementById("shopGrid");
  const emptyEl = document.getElementById("emptyState");
  const countEl = document.getElementById("resultsCount");
  const clearBtn = document.getElementById("clearFilters");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const PAGE_SIZE = 12;
  let page = 1;

  searchEl.value = state.q;

  await PRODUCTS_READY; // CATEGORIES is only accurate once this resolves

  function renderChips(){
    const allChips = ["All", ...CATEGORIES];
    chipsEl.innerHTML = allChips
      .map(c => `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
      .join("");
  }
  renderChips();

  function apply(resetPage){
    if (resetPage !== false) page = 1;
    let items = PRODUCTS.slice();

    if (state.category !== "All"){
      items = items.filter(p => p.category === state.category);
    }
    if (state.q.trim()){
      const q = state.q.trim().toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q))
      );
    }
    switch (state.sort){
      case "price-asc": items.sort((a,b) => effectivePrice(a) - effectivePrice(b)); break;
      case "price-desc": items.sort((a,b) => effectivePrice(b) - effectivePrice(a)); break;
      case "name-asc": items.sort((a,b) => a.name.localeCompare(b.name)); break;
      default: items.sort((a,b) => Number(b.featured)-Number(a.featured)); break;
    }

    countEl.textContent = `${items.length} piece${items.length === 1 ? "" : "s"}`;

    if (items.length === 0){
      gridEl.style.display = "none";
      emptyEl.style.display = "block";
      loadMoreBtn.style.display = "none";
    } else {
      gridEl.style.display = "";
      emptyEl.style.display = "none";
      const visible = items.slice(0, page * PAGE_SIZE);
      renderProductGrid(gridEl, visible);
      loadMoreBtn.style.display = visible.length < items.length ? "inline-flex" : "none";
    }

    const newParams = new URLSearchParams();
    if (state.q) newParams.set("q", state.q);
    if (state.category !== "All") newParams.set("category", state.category);
    const qs = newParams.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.getAttribute("data-cat");
    chipsEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
    apply();
  });

  let debounce;
  searchEl.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = searchEl.value; apply(); }, 200);
  });

  sortEl.addEventListener("change", () => { state.sort = sortEl.value; apply(); });

  clearBtn.addEventListener("click", () => {
    state.q = ""; state.category = "All"; state.sort = "featured";
    searchEl.value = ""; sortEl.value = "featured";
    chipsEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.cat === "All"));
    apply();
  });

  loadMoreBtn.addEventListener("click", () => {
    page += 1;
    apply(false); // keep current page — don't reset back to page 1
  });

  apply();
});
