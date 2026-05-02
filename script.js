const designs = [
  {
    id: "persona",
    label: "Persona",
    title: "Persona portfolio design preview",
    path: "persona/index.html",
  },
  {
    id: "undertale",
    label: "Undertale",
    title: "Undertale portfolio design preview",
    path: "undertale/index.html",
  },
  {
    id: "omori",
    label: "Omori",
    title: "Omori portfolio design preview",
    path: "omori/index.html",
  },
  {
    id: "sanrio",
    label: "Sanrio",
    title: "Sanrio portfolio design preview",
    path: "sanrio/index.html",
  },
  {
    id: "zelda",
    label: "Zelda",
    title: "Zelda portfolio design preview",
    path: "zelda/index.html",
  },
  {
    id: "fire-emblem",
    label: "Fire Emblem",
    title: "Fire Emblem portfolio design preview",
    path: "fire-emblem/index.html",
  },
  {
    id: "nier",
    label: "Nier",
    title: "Nier portfolio design preview",
    path: "nier/index.html",
  },
  {
    id: "genshin",
    label: "Genshin",
    title: "Genshin Impact portfolio design preview",
    path: "genshin-impact/index.html",
  },
  {
    id: "eight-bit",
    label: "8-bit",
    title: "8-bit portfolio design preview",
    path: "eight-bit/index.html",
  },
  {
    id: "soulsborne",
    label: "Soulsborne",
    title: "Soulsborne portfolio design preview",
    path: "soulsborne/index.html",
  },
];

const tabs = document.querySelector("[data-design-tabs]");
const select = document.querySelector("[data-design-select]");
const frame = document.querySelector("[data-design-frame]");
const switcherBar = document.querySelector(".switcher-bar");
const openLinks = document.querySelectorAll("[data-open-current]");

function normalizeDesignId(id) {
  return designs.some((design) => design.id === id) ? id : designs[0].id;
}

function setDesign(nextId, updateUrl = true) {
  const design = designs.find((item) => item.id === normalizeDesignId(nextId));

  frame.src = design.path;
  frame.title = design.title;
  select.value = design.id;
  switcherBar.dataset.accent = design.id;

  document.querySelectorAll("[data-design-id]").forEach((button) => {
    const isActive = button.dataset.designId === design.id;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  openLinks.forEach((link) => {
    link.href = design.path;
  });

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("design", design.id);
    window.history.replaceState({}, "", url);
  }
}

function buildControls() {
  const fragment = document.createDocumentFragment();

  designs.forEach((design) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "design-tab";
    button.dataset.designId = design.id;
    button.textContent = design.label;
    button.addEventListener("click", () => setDesign(design.id));
    fragment.append(button);

    const option = document.createElement("option");
    option.value = design.id;
    option.textContent = design.label;
    select.append(option);
  });

  tabs.append(fragment);
}

buildControls();

select.addEventListener("change", () => setDesign(select.value));

const params = new URLSearchParams(window.location.search);
setDesign(normalizeDesignId(params.get("design")), false);
