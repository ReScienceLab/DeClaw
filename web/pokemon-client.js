/**
 * Pokemon Battle Arena — browser client
 * Uses @pkmn/img for official Showdown sprites
 */

const API = window.POKEMON_API ?? `${location.protocol}//${location.host}`;
const Sprites = pkmn.img.Sprites;
const Icons = pkmn.img.Icons;

let sessionId = null;
let battleState = null;
let manifest = null;
let lastLogHash = "";

const $statusDot = document.getElementById("status-dot");
const $statusText = document.getElementById("status-text");
const $manifestContent = document.getElementById("manifest-content");
const $teamList = document.getElementById("team-list");
const $playerName = document.getElementById("player-name");
const $playerLevel = document.getElementById("player-level");
const $playerHpBar = document.getElementById("player-hp-bar");
const $playerHpText = document.getElementById("player-hp-text");
const $oppName = document.getElementById("opp-name");
const $oppLevel = document.getElementById("opp-level");
const $oppHpBar = document.getElementById("opp-hp-bar");
const $oppHpText = document.getElementById("opp-hp-text");
const $playerSprite = document.getElementById("player-sprite");
const $oppSprite = document.getElementById("opp-sprite");
const $turnNum = document.getElementById("turn-num");
const $moveBtns = document.querySelectorAll(".move-btn");
const $switchButtons = document.getElementById("switch-buttons");
const $battleLog = document.getElementById("battle-log");
const $newBattleBtn = document.getElementById("new-battle-btn");
const $actionPrompt = document.getElementById("action-prompt");

function toShowdownId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSpriteUrl(name, back) {
  const info = Sprites.getPokemon(toShowdownId(name), { gen: "gen1rg", side: back ? "p1" : "p2" });
  return info.url;
}

function getIconStyle(name) {
  return Icons.getPokemon(toShowdownId(name)).style;
}

async function apiPost(endpoint, body) {
  const resp = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return resp.json();
}

async function joinBattle() {
  setStatus(false, "joining...");
  try {
    const data = await apiPost("/play/join", { alias: "Player" });
    if (!data.ok) { setStatus(false, data.error ?? "join failed"); return; }
    sessionId = data.sessionId;
    manifest = data.manifest;
    battleState = data.state;
    lastLogHash = "";
    $battleLog.innerHTML = "";
    setStatus(true, "battle " + data.battleId.slice(0, 8));
    renderManifest();
    renderBattle();
    addLog("Battle started! Choose your moves.", "system");
  } catch (e) {
    setStatus(false, "error: " + e.message);
  }
}

async function sendAction(action, slot) {
  if (!sessionId) return;
  disableActions();
  try {
    const data = await apiPost("/play/action", { sessionId, action, slot: parseInt(slot) });
    if (data.state) {
      battleState = data.state;
      renderBattle();
    }
    if (!data.ok) {
      addLog("Error: " + data.error, "info");
      enableActions();
    }
  } catch (e) {
    addLog("Error: " + e.message, "info");
    enableActions();
  }
}

async function newBattle() {
  try {
    const data = await apiPost("/play/new", { sessionId });
    if (!data.ok) return;
    sessionId = data.sessionId;
    battleState = data.state;
    manifest = data.manifest;
    lastLogHash = "";
    $battleLog.innerHTML = "";
    renderBattle();
    addLog("New battle started!", "system");
    setStatus(true, "battle " + data.battleId.slice(0, 8));
  } catch (e) {
    addLog("Error: " + e.message, "info");
  }
}

function renderManifest() {
  if (!manifest) return;
  let html = '<div style="margin-bottom:8px;color:var(--text)">' + manifest.description + "</div>";
  html += '<div style="margin-bottom:4px;color:var(--yellow);font-size:10px;letter-spacing:1px;">OBJECTIVE</div>';
  html += '<div class="rule">' + manifest.objective + "</div>";
  if (manifest.rules) {
    html += '<div style="margin:8px 0 4px;color:var(--yellow);font-size:10px;letter-spacing:1px;">RULES</div>';
    manifest.rules.forEach(function(r) { html += '<div class="rule">' + r + "</div>"; });
  }
  $manifestContent.innerHTML = html;
}

function renderBattle() {
  if (!battleState) return;

  $turnNum.textContent = battleState.turn;

  var active = battleState.active;
  if (active) {
    $playerName.textContent = active.name;
    $playerLevel.textContent = "";
    var pct = active.maxHp > 0 ? (active.hp / active.maxHp) * 100 : 0;
    $playerHpBar.style.width = pct + "%";
    $playerHpBar.className = "hp-bar" + (pct < 25 ? " red" : pct < 50 ? " yellow" : "");
    $playerHpText.textContent = active.hp + " / " + active.maxHp;
    $playerSprite.src = getSpriteUrl(active.name, true);
    $playerSprite.alt = active.name;
    $playerSprite.style.display = "";
  } else {
    $playerName.textContent = "???";
    $playerHpBar.style.width = "0%";
    $playerHpText.textContent = "";
    $playerSprite.style.display = "none";
  }

  renderOpponent();
  renderTeam();
  renderMoves();
  renderSwitchButtons();
  renderLog();

  if (battleState.battleOver) {
    var isWin = battleState.winner !== "Wild AI" && battleState.winner !== "tie";
    var msg = isWin ? "YOU WIN!" : (battleState.winner === "tie" ? "TIE!" : "YOU LOSE!");
    addLog(msg, "win");
    $actionPrompt.textContent = msg;
    $actionPrompt.style.color = isWin ? "var(--green)" : "var(--red)";
    disableActions();
  } else if (battleState.waitingForAction) {
    if (battleState.mustSwitch) {
      $actionPrompt.textContent = "Your Pokemon fainted! Choose one to switch in.";
      $actionPrompt.style.color = "var(--yellow)";
    } else {
      $actionPrompt.textContent = "Choose a move or switch Pokemon.";
      $actionPrompt.style.color = "var(--yellow)";
    }
  } else {
    $actionPrompt.textContent = "Waiting...";
    $actionPrompt.style.color = "var(--text-dim)";
  }
}

function renderOpponent() {
  var log = battleState.log || [];
  var oppName = "???";
  var oppPct = 100;
  var oppHpStr = "";

  for (var i = log.length - 1; i >= 0; i--) {
    var line = log[i];
    var dmg = line.match(/^(.+?) took damage .+ (\d+)\/(\d+)/);
    if (dmg && battleState.active && dmg[1] !== battleState.active.name) {
      oppName = dmg[1];
      oppPct = (parseInt(dmg[2]) / parseInt(dmg[3])) * 100;
      oppHpStr = dmg[2] + "/" + dmg[3];
      break;
    }
    if (line.includes("took damage") && line.includes("0 fnt")) {
      var m = line.match(/^(.+?) took damage/);
      if (m && battleState.active && m[1] !== battleState.active.name) {
        oppName = m[1]; oppPct = 0; oppHpStr = "0 (fainted)";
        break;
      }
    }
    var sw = line.match(/sent out (.+?)!/);
    if (sw) {
      var sName = sw[1];
      if (!battleState.active || sName !== battleState.active.name) {
        oppName = sName;
        break;
      }
    }
  }

  $oppName.textContent = oppName;
  $oppLevel.textContent = "";
  $oppHpBar.style.width = oppPct + "%";
  $oppHpBar.className = "hp-bar" + (oppPct < 25 ? " red" : oppPct < 50 ? " yellow" : "");
  $oppHpText.textContent = oppHpStr;

  if (oppName !== "???") {
    $oppSprite.src = getSpriteUrl(oppName, false);
    $oppSprite.alt = oppName;
    $oppSprite.style.display = "";
  } else {
    $oppSprite.style.display = "none";
  }
}

function renderTeam() {
  var team = battleState.team || [];
  $teamList.innerHTML = "";
  team.forEach(function(p) {
    var cls = p.fainted ? "fainted" : p.active ? "active" : "";
    var el = document.createElement("div");
    el.className = "team-pokemon " + cls;
    var iconSpan = document.createElement("span");
    iconSpan.style.cssText = getIconStyle(p.name);
    iconSpan.className = "tp-icon";
    el.appendChild(iconSpan);
    var nameDiv = document.createElement("span");
    nameDiv.className = "tp-name";
    nameDiv.textContent = p.name;
    el.appendChild(nameDiv);
    var hpDiv = document.createElement("span");
    hpDiv.className = "tp-hp";
    hpDiv.textContent = p.fainted ? "FNT" : p.hp + "/" + p.maxHp;
    el.appendChild(hpDiv);
    $teamList.appendChild(el);
  });
}

function renderMoves() {
  var moves = (battleState.active && battleState.active.moves) || [];
  var waiting = battleState.waitingForAction && !battleState.battleOver;
  var mustSwitch = battleState.mustSwitch;

  $moveBtns.forEach(function(btn, i) {
    if (i < moves.length) {
      var m = moves[i];
      btn.innerHTML = m.name + '<span class="move-pp">PP: ' + m.pp + "/" + m.maxPp + "</span>";
      btn.disabled = !waiting || mustSwitch || m.disabled || m.pp <= 0;
    } else {
      btn.innerHTML = "\u2014";
      btn.disabled = true;
    }
  });
}

function renderSwitchButtons() {
  var team = battleState.team || [];
  var waiting = battleState.waitingForAction && !battleState.battleOver;
  $switchButtons.innerHTML = "";
  team.forEach(function(p) {
    if (p.active || p.fainted) return;
    var btn = document.createElement("button");
    btn.className = "switch-btn";
    var iconSpan = document.createElement("span");
    iconSpan.style.cssText = getIconStyle(p.name);
    iconSpan.className = "sw-icon";
    btn.appendChild(iconSpan);
    btn.appendChild(document.createTextNode(p.name + " (" + p.hp + "/" + p.maxHp + ")"));
    btn.disabled = !waiting;
    btn.addEventListener("click", function() { sendAction("switch", p.slot); });
    $switchButtons.appendChild(btn);
  });
}

function renderLog() {
  var log = battleState.log || [];
  var hash = log.join("|");
  if (hash === lastLogHash) return;
  $battleLog.innerHTML = "";
  addLog("Battle started! Choose your moves.", "system");
  for (var i = 0; i < log.length; i++) {
    addLog(log[i], classifyLog(log[i]));
  }
  lastLogHash = hash;
}

function classifyLog(line) {
  if (line.includes("fainted")) return "faint";
  if (line.includes("super effective")) return "critical";
  if (line.includes("critical hit")) return "critical";
  if (line.includes("took damage")) return "damage";
  if (line.includes("healed")) return "heal";
  if (line.includes("Winner")) return "win";
  return "info";
}

function addLog(text, cls) {
  var el = document.createElement("div");
  el.className = "log-entry " + (cls || "info");
  el.textContent = text;
  $battleLog.appendChild(el);
  $battleLog.scrollTop = $battleLog.scrollHeight;
}

function disableActions() {
  $moveBtns.forEach(function(b) { b.disabled = true; });
  document.querySelectorAll(".switch-btn").forEach(function(b) { b.disabled = true; });
}

function enableActions() {
  if (!battleState || !battleState.waitingForAction || battleState.battleOver) return;
  renderMoves();
  renderSwitchButtons();
}

function setStatus(connected, text) {
  $statusDot.className = connected ? "connected" : "";
  $statusText.textContent = text;
}

$moveBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (!btn.disabled) sendAction("move", btn.dataset.slot);
  });
});

$newBattleBtn.addEventListener("click", newBattle);

document.addEventListener("keydown", function(e) {
  if (!battleState || battleState.battleOver || !battleState.waitingForAction) return;
  if (e.key >= "1" && e.key <= "4") {
    e.preventDefault();
    var btn = document.querySelector('.move-btn[data-slot="' + e.key + '"]');
    if (btn && !btn.disabled) sendAction("move", e.key);
  }
});

joinBattle();
