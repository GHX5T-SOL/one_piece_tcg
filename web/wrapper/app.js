const config = window.GRAND_LINE_CONFIG || {};
const state = {
  cards: [],
  offers: [],
  valuation: null,
  sources: [],
  media: [],
  localCards: JSON.parse(localStorage.getItem("grandLineLocalCards") || "[]")
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function showPortal() {
  $("#gate").classList.add("hidden");
  $("#portal").classList.remove("hidden");
  loadData().catch((error) => {
    $("#unity-status").textContent = `Data load failed: ${error.message}`;
  });
}

function setupGate() {
  const form = $("#gate-form");
  const status = $("#gate-status");
  if (sessionStorage.getItem("grandLineAuthed") === "1") {
    showPortal();
    return;
  }
  if (!config.passcodeHash) {
    status.textContent = "Passcode hash is not configured. Set GRAND_LINE_PASSCODE_SHA256 before deploy.";
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!config.passcodeHash) {
      status.textContent = "Gate blocked: missing GRAND_LINE_PASSCODE_SHA256 build environment variable.";
      return;
    }
    const passcode = new FormData(form).get("passcode")?.toString() || "";
    const hash = await sha256Hex(passcode);
    if (hash === config.passcodeHash) {
      sessionStorage.setItem("grandLineAuthed", "1");
      showPortal();
    } else {
      status.textContent = "Wrong passcode.";
    }
  });
}

async function loadJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json();
}

async function loadData() {
  const [cards, offers, valuation, sources, media] = await Promise.all([
    loadJson("./data/inventory/cards.json"),
    loadJson("./data/inventory/open-bids.json"),
    loadJson("./data/inventory/valuation.json"),
    loadJson("./data/research/source-ledger.json"),
    loadJson("./media/manifest.json")
  ]);
  state.cards = cards.cards;
  state.offers = offers.offers;
  state.valuation = valuation;
  state.sources = sources.sources;
  state.media = media.items;
  renderStats();
  renderInventory();
  renderBids();
  renderResearch();
  renderArchive();
  renderLocalCards();
  bootUnity();
}

function renderStats() {
  const stats = [
    ["Visible value", `$${state.valuation.summary.visibleCollectrValueUsd.toFixed(2)}`],
    ["Open bid exposure", `$${state.valuation.summary.openBidExposureUsd.toFixed(2)}`],
    ["Owned OP cards", state.valuation.summary.ownedOnePieceCards],
    ["Open offers", state.valuation.summary.openCourtyardOffers]
  ];
  $("#quick-stats").innerHTML = stats.map(([term, value]) => `<dt>${term}</dt><dd>${value}</dd>`).join("");
}

function renderInventory() {
  $("#inventory-grid").innerHTML = state.cards.map((card) => `
    <article class="card">
      <span class="badge keep">${card.action}</span>
      <h3>${card.character}</h3>
      <p>${card.title}</p>
      <p class="meta">${card.gradeCompany} ${card.grade} | ${card.status} | Cert: ${card.certNumber ?? "null"}</p>
      <p class="meta">Conviction ${card.convictionScore} / Liquidity ${card.liquidityScore}</p>
      <p>${card.recommendation}</p>
    </article>
  `).join("");
}

function renderBids() {
  $("#bid-board").innerHTML = state.offers.map((offer) => {
    const className = offer.action.includes("cancel") ? "cancel" : "keep";
    return `
      <article class="row">
        <div>
          <strong>${offer.title}</strong>
          <p class="meta">${offer.gradeCompany} ${offer.grade} | Cert: ${offer.certNumber ?? "null"}</p>
          <p class="meta">${offer.rationale}</p>
        </div>
        <strong>$${offer.offerUsd.toFixed(2)}</strong>
        <span class="badge ${className}">${offer.action}</span>
        <span>${offer.score}</span>
      </article>
    `;
  }).join("");
}

function renderResearch() {
  $("#research-list").innerHTML = state.sources.map((source) => `
    <article class="source-card">
      <span class="badge">${source.id}</span>
      <h3>${source.title}</h3>
      <p class="meta">${source.publisher} | Confidence: ${source.confidence} | Retrieved ${source.retrievedAt}</p>
      <p>${source.useCase}</p>
      ${source.url ? `<a href="${source.url}" target="_blank" rel="noreferrer">Open source</a>` : `<span class="meta">Private capture, not linked</span>`}
    </article>
  `).join("");
}

function renderArchive() {
  $("#archive-list").innerHTML = state.media.map((item) => `
    <article class="card">
      <span class="badge">${item.type}</span>
      <h3>${item.title}</h3>
      <p class="meta">${item.provenance}</p>
      <p>${item.tags.join(", ")}</p>
      <a href="./${item.localPath.replace(/^media\//, "media/")}" target="_blank" rel="noreferrer">Open</a>
    </article>
  `).join("");
}

function setupPanels() {
  $$("nav button").forEach((button) => {
    button.addEventListener("click", () => {
      $$("nav button").forEach((node) => node.classList.remove("active"));
      $$(".panel").forEach((panel) => panel.classList.remove("active-panel"));
      button.classList.add("active");
      $(`#panel-${button.dataset.panel}`).classList.add("active-panel");
    });
  });
}

function renderLocalCards() {
  localStorage.setItem("grandLineLocalCards", JSON.stringify(state.localCards));
  $("#local-cards").textContent = JSON.stringify(state.localCards, null, 2);
}

function setupEntryForm() {
  $("#card-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const card = Object.fromEntries(formData.entries());
    card.id = `local-${Date.now()}`;
    card.certNumber = null;
    card.createdAt = new Date().toISOString();
    state.localCards.push(card);
    event.currentTarget.reset();
    renderLocalCards();
  });

  $("#export-json").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.localCards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ghost-zoro-local-cards.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  $("#import-json").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Imported JSON must be an array.");
    state.localCards = parsed;
    renderLocalCards();
  });
}

async function bootUnity() {
  const status = $("#unity-status");
  try {
    const response = await fetch(config.unityLoader, { method: "HEAD", cache: "no-store" });
    if (!response.ok) throw new Error("Unity WebGL loader not found yet.");
    const script = document.createElement("script");
    script.src = config.unityLoader;
    script.onload = () => {
      window.createUnityInstance($("#unity-canvas"), config.unityConfig, (progress) => {
        status.textContent = `Loading Unity ${(progress * 100).toFixed(0)}%`;
      }).then(() => {
        status.textContent = "Unity loaded.";
      }).catch((error) => {
        status.textContent = `Unity failed: ${error.message}`;
      });
    };
    document.body.append(script);
  } catch (error) {
    status.textContent = "Unity WebGL build is not copied into deploy/game yet. The data cockpit is live; run the Unity build step to replace this placeholder.";
    drawPlaceholderScene();
  }
}

function drawPlaceholderScene() {
  const canvas = $("#unity-canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f3140");
  gradient.addColorStop(1, "#071014");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(18,199,184,0.18)";
  for (let i = 0; i < 16; i += 1) {
    ctx.beginPath();
    ctx.arc(80 + i * 85, 160 + Math.sin(i) * 40, 46, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#f2c14e";
  ctx.font = "700 52px Inter, sans-serif";
  ctx.fillText("Unity Grand Line Hub Pending", 96, 210);
  ctx.fillStyle = "#f3efe2";
  ctx.font = "28px Inter, sans-serif";
  ctx.fillText("Data cockpit is active. Build Unity WebGL to unlock the playable ship.", 96, 270);
  ctx.strokeStyle = "rgba(242,193,78,0.75)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i += 1) {
    const x = 130 + i * 150;
    ctx.strokeRect(x, 390, 92, 140);
    ctx.fillText(["Nami", "Robin", "Franky", "Usopp", "Sanji", "Chopper", "Brook"][i], x - 12, 570);
  }
}

setupGate();
setupPanels();
setupEntryForm();
