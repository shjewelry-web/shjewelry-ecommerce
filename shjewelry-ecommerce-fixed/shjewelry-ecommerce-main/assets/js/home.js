document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("home");
  renderFooter();
  initHeroParallax();
  refreshBadges();

  await Promise.all([PRODUCTS_READY, SETTINGS_READY]);

  // Only featured:true products show here. If nothing is marked featured
  // yet (a fresh catalogue), fall back to the first 6 so the homepage
  // isn't empty — remove this fallback once you've picked real featured
  // pieces in Sanity, if you'd rather it stay strictly empty.
  const featured = PRODUCTS.filter(p => p.featured);
  renderProductGrid(document.getElementById("featuredGrid"), featured.length ? featured : PRODUCTS.slice(0, 6));

  const s = SETTINGS;
  if (s.heroHeading) document.getElementById("heroHeading").textContent = s.heroHeading;
  if (s.heroDescription) document.getElementById("heroDesc").textContent = s.heroDescription;
  if (s.featuredHeading) document.getElementById("featuredHeading").textContent = s.featuredHeading;
  if (s.featuredDescription) document.getElementById("featuredDesc").textContent = s.featuredDescription;
  if (s.announcementText && s.announcementText.trim()){
    const bar = document.getElementById("announcementBar");
    bar.textContent = s.announcementText;
    bar.style.display = "block";
  }
});
