(() => {
  "use strict";
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const $ = id => document.getElementById(id);
  const UI = {
    hud: $("hud"), areaName: $("areaName"), interactionHint: $("interactionHint"),
    notifications: $("notifications"), score: $("txtScore"), clock: $("txtClock"),
    screens: Object.fromEntries(["menu", "about", "intro", "pause", "dialogue", "attraction", "ending"].map(n => [n, $("screen" + n[0].toUpperCase() + n.slice(1))]))
  };
  const CONFIG = {
    worldWidth: 1700, worldHeight: 3200, pathRadius: 112,
    playerSpeed: 84, finalSpeed: 68, maxDelta: 0.1,
    rideDuration: 40, interactionRadius: 76
  };
  const View = { width: 960, height: 600, scale: 1, ratio: 1 };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PATH = [
    { x: 310, y: 180 },
    { x: 320, y: 560 },
    { x: 1280, y: 650 },
    { x: 1320, y: 1030 },
    { x: 470, y: 1110 },
    { x: 410, y: 1510 },
    { x: 1370, y: 1600 },
    { x: 1290, y: 2020 },
    { x: 590, y: 2130 },
    { x: 650, y: 2490 },
    { x: 1240, y: 2600 },
    { x: 1160, y: 3020 }
  ];
  const ASSET_FILES = [
  "characters/player_idle_down.png",
  "characters/player_walk_down_01.png",
  "characters/player_walk_down_02.png",
  "characters/player_idle_up.png",
  "characters/player_walk_up_01.png",
  "characters/player_walk_up_02.png",
  "characters/player_idle_left.png",
  "characters/player_walk_left_01.png",
  "characters/player_walk_left_02.png",
  "characters/player_idle_right.png",
  "characters/player_walk_right_01.png",
  "characters/player_walk_right_02.png",
  "characters/player_phone_idle_down.png",
  "characters/player_phone_walk_down_01.png",
  "characters/player_tired_idle_down.png",
  "characters/player_tired_walk_down_01.png",
  "npcs/host_idle_down.png",
  "npcs/host_talk_01.png",
  "npcs/host_late_idle_down.png",
  "npcs/npc_phone_idle_01.png",
  "npcs/npc_unresponsive_idle_01.png",
  "npcs/npc_child_01_idle.png",
  "npcs/npc_child_01_walk_01.png",
  "npcs/npc_teen_01_idle.png",
  "npcs/npc_teen_01_walk_01.png",
  "npcs/npc_adult_01_idle.png",
  "npcs/npc_adult_01_walk_01.png",
  "tiles/tile_grass_clean_01.png",
  "tiles/tile_grass_worn_01.png",
  "tiles/tile_grass_dead_01.png",
  "tiles/tile_path_clean_01.png",
  "tiles/tile_path_worn_01.png",
  "tiles/tile_path_cracked_01.png",
  "tiles/tile_arrow_down_clean.png",
  "tiles/tile_arrow_glitch.png",
  "props/tree_full_01.png",
  "props/tree_worn_01.png",
  "props/tree_dead_01.png",
  "props/bush_full_01.png",
  "props/bush_dead_01.png",
  "props/flower_patch_01.png",
  "props/flower_patch_wilted_01.png",
  "props/bench_clean.png",
  "props/bench_broken.png",
  "props/lamp_post_clean.png",
  "props/lamp_post_broken.png",
  "props/trash_bin_clean.png",
  "props/trash_bin_overflow.png",
  "props/fountain_clean.png",
  "props/fountain_dirty.png",
  "props/fence_horizontal_clean.png",
  "props/fence_vertical_clean.png",
  "props/stall_games_clean.png",
  "props/stall_abandoned.png",
  "props/flags_colorful_01.png",
  "props/flags_torn_01.png",
  "props/ad_board_01.png",
  "props/debris_trash_pile_01.png",
  "props/sign_area_likes.png",
  "props/sign_area_notifications.png",
  "props/sign_area_gallery.png",
  "props/sign_area_trends.png",
  "props/sign_area_quiet.png",
  "props/sign_direction_down.png",
  "props/sign_exit.png",
  "props/sign_glitch_01.png",
  "props/debris_paper_01.png",
  "props/crack_small_01.png",
  "props/crack_large_01.png",
  "props/screen_glitch_01.png",
  "attractions/attraction_tunnel_base.png",
  "attractions/attraction_likes_base.png",
  "attractions/attraction_tower_base.png",
  "attractions/attraction_gallery_base.png",
  "attractions/attraction_trends_base.png",
  "attractions/attraction_quiet_base.png",
  "attractions/screen_scroll_01.png",
  "attractions/icon_like_01.png",
  "attractions/icon_notification_bubble.png",
  "attractions/frame_gallery_01.png",
  "ui/ui_dialogue_box.png",
  "ui/ui_choice_button.png",
  "ui/ui_choice_button_selected.png",
  "ui/ui_nameplate.png",
  "ui/ui_hud_panel.png",
  "ui/ui_notification_box.png",
  "ui/ui_title_panel.png",
  "ui/ui_button_primary.png",
  "ui/ui_pause_panel.png",
  "ui/ui_ending_panel.png",
  "ui/ui_bar_time.png",
  "ui/icon_time.png",
  "ui/ui_bar_energy.png",
  "ui/icon_energy.png",
  "ui/ui_bar_focus.png",
  "ui/icon_focus.png",
  "ui/ui_bar_fun.png",
  "ui/icon_fun.png",
  "ui/ui_bar_control.png",
  "ui/icon_control.png",
  "portraits/portrait_player_normal.png",
  "portraits/portrait_player_tired.png",
  "portraits/portrait_host_normal.png",
  "portraits/portrait_host_late.png",
  "portraits/portrait_npc_generic_01.png",
  "final/final_wall_clean.png",
  "final/final_wall_worn.png",
  "final/final_curtain_closed.png",
  "final/final_exit_frame.png",
  "final/final_sign_end.png",
  "effects/fx_player_question.png",
  "effects/fx_question_small.png",
  "effects/fx_interact_prompt.png",
  "effects/fx_notification_ping_01.png",
  "effects/fx_like_pop_01.png",
  "effects/fx_player_notification_orbit_01.png"
];
  const ATTRACTION_ART = {
    "Túnel Infinito": "attractions/attraction_tunnel_base.png",
    "Praça das Curtidas": "attractions/attraction_likes_base.png",
    "Torre das Notificações": "attractions/attraction_tower_base.png",
    "Galeria Perfeita": "attractions/attraction_gallery_base.png",
    "Salão das Tendências": "attractions/attraction_trends_base.png",
    "Praça Tranquila": "attractions/attraction_quiet_base.png"
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function seeded(n) {
    const x = Math.sin(n * 947.73) * 43758.5453;
    return x - Math.floor(x);
  }

  const segments = PATH.slice(1).map((b, i) => {
    const a = PATH[i], dx = b.x - a.x, dy = b.y - a.y;
    return { a, b, dx, dy, length: Math.hypot(dx, dy), before: 0 };
  });
  const pathLength = segments.reduce((sum, s) => { s.before = sum; return sum + s.length; }, 0);
  function pathInfo(x, y) {
    let result = { distance: Infinity, along: 0, x: PATH[0].x, y: PATH[0].y };
    for (const s of segments) {
      const t = clamp(((x - s.a.x) * s.dx + (y - s.a.y) * s.dy) / (s.length * s.length), 0, 1);
      const qx = s.a.x + s.dx * t, qy = s.a.y + s.dy * t;
      const d = Math.hypot(x - qx, y - qy);
      if (d < result.distance) result = { distance: d, along: s.before + s.length * t, x: qx, y: qy };
    }
    return result;
  }
  function distanceToPath(x, y) { return pathInfo(x, y).distance; }
  function pathPoint(along) {
    const s = segments.find(s => s.before + s.length >= along) || segments[segments.length - 1];
    const t = clamp((along - s.before) / s.length, 0, 1);
    return { x: s.a.x + s.dx * t, y: s.a.y + s.dy * t, nx: -s.dy / s.length, ny: s.dx / s.length, angle: Math.atan2(s.dy, s.dx) };
  }
  function onScreen(x, y, margin = 160) {
    return x > Camera.x - margin && y > Camera.y - margin && x < Camera.x + View.width + margin && y < Camera.y + View.height + margin;
  }
  function circleRect(x, y, r, box) {
    return Math.hypot(x - clamp(x, box.x, box.x + box.w), y - clamp(y, box.y, box.y + box.h)) < r;
  }
  function formatClock(minutes) { return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${Math.floor(minutes % 60).toString().padStart(2, "0")}`; }
  function formatDuration(seconds) { return `${Math.floor(seconds / 60)}min ${Math.floor(seconds % 60).toString().padStart(2, "0")}s`; }
  const numberFormat = new Intl.NumberFormat("pt-BR");
  const keys = new Set();
  const Assets = {
    cache: new Map(), patterns: new Map(), variants: new Map(), failed: new Set(), loaded: false,
    get(path) { return this.cache.get(path); },
    ready(path) { const img = this.get(path); return !!(img && img.complete && img.naturalWidth); },
    async preload() {
      let done = 0;
      await Promise.all(ASSET_FILES.map(path => new Promise(resolve => {
        const img = new Image();
        this.cache.set(path, img);
        const finish = failed => {
          if (failed) this.failed.add(path);
          $("loadingStatus").textContent = `Preparando o parque… ${++done}/${ASSET_FILES.length}`;
          resolve();
        };
        img.onload = () => finish(false);
        img.onerror = () => finish(true);
        img.src = `assets/${path}`;
      })));
      this.loaded = this.failed.size === 0;
      if (this.loaded) {
        $("startBtn").disabled = false;
        $("startBtn").textContent = "JOGAR";
        $("loadingStatus").textContent = "";
      } else {
        $("loadingStatus").textContent = "Algumas imagens não abriram. Extraia o ZIP inteiro, mantendo a pasta assets ao lado de index.html, e reabra o jogo.";
        console.error("Imagens indisponíveis:", [...this.failed]);
      }
    },
    draw(path, x, y, w, h, alpha = 1) {
      const img = typeof path === "string" ? this.get(path) : path;
      if (!img || (typeof path === "string" && !this.ready(path))) return false;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, Math.round(x), Math.round(y), w, h);
      ctx.restore();
      return true;
    },
    anchored(path, x, y, scale = 1, alpha = 1) {
      const img = this.get(path);
      if (!img) return;
      const w = img.naturalWidth / 2 * scale, h = img.naturalHeight / 2 * scale;
      this.draw(path, x - w / 2 - Camera.x, y - h - Camera.y, w, h, alpha);
    },
    pattern(path) {
      if (!this.ready(path)) return "#54684a";
      if (!this.patterns.has(path)) {
        const tile = document.createElement("canvas"); tile.width = 32; tile.height = 32;
        const tctx = tile.getContext("2d"); tctx.imageSmoothingEnabled = false;
        tctx.drawImage(this.get(path), 0, 0, 32, 32);
        this.patterns.set(path, ctx.createPattern(tile, "repeat"));
      }
      return this.patterns.get(path);
    },
    weathered(path, stage) {
      if (!stage || !this.ready(path)) return path;
      const key = `${path}:${stage}`;
      if (!this.variants.has(key)) {
        const img = this.get(path), layer = document.createElement("canvas");
        layer.width = img.naturalWidth / 2; layer.height = img.naturalHeight / 2;
        const c = layer.getContext("2d"); c.imageSmoothingEnabled = false;
        c.drawImage(img, 0, 0, layer.width, layer.height);
        c.globalCompositeOperation = "source-atop";
        c.fillStyle = stage === 1 ? "rgba(103,87,62,.27)" : "rgba(74,67,57,.62)";
        c.fillRect(0, 0, layer.width, layer.height);
        if (stage === 2 && this.ready("props/crack_large_01.png")) {
          c.drawImage(this.get("props/crack_large_01.png"), layer.width * .3, layer.height * .43, 48, 48);
          c.fillStyle = "#454139";
          for (let i = 0; i < 7; i++) c.fillRect(13 + i * 16, 85 + i % 3 * 7, 5, 2);
        }
        this.variants.set(key, layer);
      }
      return this.variants.get(key);
    }
  };
  const Camera = {
    x: 0, y: 0,
    update(dt, snap = false) {
      const ride = Game.phase === "attraction" && Attractions.active;
      const fx = ride ? Attractions.active.a.x : Player.x;
      const fy = ride ? Attractions.active.a.y : Player.y;
      const panelSpace = ride && innerWidth > 800 ? Math.min(450, innerWidth * .4) / View.scale : 0;
      const tx = clamp(fx - (View.width - panelSpace) * .48, 0, Math.max(0, CONFIG.worldWidth - View.width));
      const ty = clamp(fy - View.height * .42, 0, Math.max(0, CONFIG.worldHeight - View.height));
      const amount = snap ? 1 : 1 - Math.exp(-6 * dt);
      this.x = lerp(this.x, tx, amount); this.y = lerp(this.y, ty, amount);
    }
  };
  const Player = {
    x: 310, y: 220, radius: 9, facingX: 0, facingY: 1, moving: false, anim: 0,
    update(dt) {
      let dx = Number(keys.has("d") || keys.has("arrowright")) - Number(keys.has("a") || keys.has("arrowleft"));
      let dy = Number(keys.has("s") || keys.has("arrowdown")) - Number(keys.has("w") || keys.has("arrowup"));
      this.moving = false;
      if (!dx && !dy) { this.anim = 0; return; }
      const length = Math.hypot(dx, dy); dx /= length; dy /= length;
      this.facingX = dx; this.facingY = dy;
      const speed = Game.progressStage >= 5 ? CONFIG.finalSpeed : CONFIG.playerSpeed;
      const ox = this.x, oy = this.y;
      this.move(dx * speed * dt, dy * speed * dt);
      this.moving = Math.hypot(this.x - ox, this.y - oy) > .01;
      if (this.moving) this.anim += dt;
    },
    move(mx, my) {
      const steps = Math.max(1, Math.ceil(Math.hypot(mx, my) / 4));
      for (let i = 0; i < steps; i++) {
        const x = clamp(this.x + mx / steps, this.radius, CONFIG.worldWidth - this.radius);
        if (!World.collides(x, this.y, this.radius)) this.x = x;
        const y = clamp(this.y + my / steps, this.radius, CONFIG.worldHeight - this.radius);
        if (!World.collides(this.x, y, this.radius)) this.y = y;
      }
    },
    direction() {
      if (Math.abs(this.facingX) > Math.abs(this.facingY)) return this.facingX < 0 ? "left" : "right";
      return this.facingY < 0 ? "up" : "down";
    },
    draw() {
      const dir = this.direction();
      const frame = (Math.floor(this.anim / .15) % 2) + 1;
      const file = this.moving ? `characters/player_walk_${dir}_0${frame}.png` : `characters/player_idle_${dir}.png`;
      const x = this.x - Camera.x, y = this.y - Camera.y;
      ctx.fillStyle = "rgba(27,33,30,.25)"; ctx.fillRect(Math.round(x - 10), Math.round(y - 3), 20, 5);
      Assets.draw(file, x - 16, y - 46, 32, 48);
    }
  };
  const PROP_ART = {
    tree: ["tree_full_01", "tree_worn_01", "tree_dead_01"],
    bush: ["bush_full_01", "bush_full_01", "bush_dead_01"],
    flower: ["flower_patch_01", "flower_patch_wilted_01", "flower_patch_wilted_01"],
    bench: ["bench_clean", "bench_clean", "bench_broken"],
    lamp: ["lamp_post_clean", "lamp_post_clean", "lamp_post_broken"],
    bin: ["trash_bin_clean", "trash_bin_overflow", "trash_bin_overflow"],
    fountain: ["fountain_clean", "fountain_dirty", "fountain_dirty"],
    stall: ["stall_games_clean", "stall_games_clean", "stall_abandoned"],
    flags: ["flags_colorful_01", "flags_colorful_01", "flags_torn_01"]
  };
  const World = {
    props: [], attractions: [], npcs: [], gates: [], details: [], colliders: [], drawables: [],
    init() {
      this.props = []; this.npcs = []; this.gates = []; this.details = []; this.colliders = [];
      this.attractions = [
        { id: "host", name: "Anfitrião", x: 373, y: 275, stage: 0 },
        { id: "tunnel", name: "Túnel Infinito", x: 650, y: 552, stage: 1 },
        { id: "likes", name: "Praça das Curtidas", x: 1220, y: 910, stage: 2 },
        { id: "tower", name: "Torre das Notificações", x: 488, y: 1420, stage: 3 },
        { id: "gallery", name: "Galeria Perfeita", x: 1240, y: 1840, stage: 4 },
        { id: "trends", name: "Salão das Tendências", x: 694, y: 2290, stage: 5 },
        { id: "quiet", name: "Praça Tranquila", x: 1145, y: 2720, stage: 6 },
        { id: "exit", name: "Saída", x: 1160, y: 2996, stage: 7 }
      ].map(a => ({ ...a, used: 0, kind: "attraction" }));
      for (const a of this.attractions) {
        if (a.id === "exit" || a.id === "host") continue;
        const w = a.id === "tower" ? 26 : a.id === "quiet" ? 80 : 90;
        this.colliders.push({ x: a.x - w / 2, y: a.y - 25, w, h: 22 });
      }
      this.colliders.push({ x: 365, y: 267, w: 16, h: 11 });
      this.colliders.push({ x: 946, y: 3033, w: 420, h: 50 });
      const gateData = [[1, .58, 1], [3, .18, 2], [5, .4, 3], [7, .14, 4], [8, .87, 5]];
      gateData.forEach(([index, t, stage]) => {
        const s = segments[index]; const p = pathPoint(s.before + s.length * t);
        this.gates.push({ ...p, stage, along: s.before + s.length * t, open: 0 });
      });
      const propPositions = [[145,300],[510,360],[770,480],[1030,470],[1480,680],[1500,920],[980,1030],[720,950],[220,1120],[210,1430],[820,1530],[1110,1420],[1510,1640],[1480,1940],[940,2090],[330,2080],[250,2400],[900,2480],[1450,2580],[1380,2860],[820,2940],[430,3050]];
      propPositions.forEach(([x, y], i) => { if (distanceToPath(x, y) > 125) this.addProp("tree", x, y, i); });
      for (let along = 80, i = 0; along < pathLength - 40; along += 116, i++) {
        const p = pathPoint(along);
        for (const side of [-1, 1]) {
          const offset = 145 + seeded(i + side + 230) * 42;
          const x = p.x + p.nx * offset * side, y = p.y + p.ny * offset * side;
          if (distanceToPath(x, y) > 129 && x > 70 && x < 1630 && y > 95 && y < 3030 && !this.attractions.some(a => dist(a, { x, y }) < 120)) {
            this.addProp(i % 3 === 0 ? "bush" : "tree", x, y, i * 2 + side + 500);
          }
        }
        const side = i % 2 ? 1 : -1;
        const x = p.x + p.nx * 128 * side, y = p.y + p.ny * 128 * side;
        if (distanceToPath(x, y) > 117 && !this.attractions.some(a => dist(a, { x, y }) < 120)) {
          const type = ["flower", "lamp", "bench", "flower", "bin", "flower"][i % 6];
          this.addProp(type, x, y, i + 800);
        }
        this.details.push({ x: p.x, y: p.y, angle: p.angle, type: "arrow", seed: i });
        this.details.push({ x: p.x + p.nx * (seeded(i + 1200) - .5) * 110, y: p.y + p.ny * (seeded(i + 1200) - .5) * 110, type: "debris", seed: i });
      }
      [["fountain",475,305],["stall",870,420],["stall",1110,750],["fountain",235,1280],["stall",1440,1530],["fountain",1040,1960],["stall",805,2240],["bench",1035,2820],["lamp",1280,2880],["bin",1090,2940]].forEach(([type,x,y],i) => this.addProp(type,x,y,1500+i));
      this.attractions.filter(a => a.stage > 0 && a.stage < 6).forEach(a => this.addProp("flags", a.x, a.y - 116, 1700 + a.stage));
      const signData = [[345,430,"SIGA",0],[960,560,"CURTIDAS",1],[1400,1010,"NOTIFICAÇÕES",2],[520,1550,"GALERIA",3],[1255,2110,"TENDÊNCIAS",4],[750,2470,"DESCANSO",5],[1250,2890,"SAÍDA",6]];
      const signs = ["sign_direction_down", "sign_area_likes", "sign_area_notifications", "sign_area_gallery", "sign_area_trends", "sign_area_quiet", "sign_exit"];
      signData.forEach(([x,y,label,i]) => this.addProp("sign", x, y, 2000+i, { label, file: signs[i] }));
      for (let i = 0; i < 24; i++) {
        const p = pathPoint(120 + (pathLength - 360) * (Math.floor(i / 2) / 11));
        const side = i % 2 ? 1 : -1;
        const offset = 48 + side * 19;
        let x = p.x + p.nx * offset, y = p.y + p.ny * offset + side * 10;
        if (this.colliders.some(b => circleRect(x, y, 32, b))) { x = p.x - p.nx * 58; y = p.y - p.ny * 58 + side * 10; }
        this.npcs.push({ x, y, baseX:x, baseY:y, nx:p.nx, ny:p.ny, seed:i, phase:seeded(i + 700) * 6.28, kind:"npc", phone:false });
      }
      this.drawables = [...this.props, ...this.attractions, ...this.npcs, { kind:"player", get y() { return Player.y; } }];
    },
    addProp(type, x, y, seed, extra = {}) {
      const p = { type, x, y, seed, kind: "prop", ...extra }; this.props.push(p);
      if (["flower", "flags"].includes(type)) return;
      const sizes = { tree:[18,12], bush:[44,16], bench:[48,17], lamp:[9,10], bin:[25,22], fountain:[66,28], stall:[65,31], sign:[10,10] };
      const [w,h] = sizes[type];
      this.colliders.push({ x:x-w/2, y:y-h, w, h });
    },
    isGateOpen(g) { return Game.progressStage >= g.stage; },
    gateCollision(g, x, y, r) {
      if (this.isGateOpen(g)) return false;
      const dx = x - g.x, dy = y - g.y;
      const forward = dx * Math.cos(g.angle) + dy * Math.sin(g.angle);
      const sideways = dx * g.nx + dy * g.ny;
      return Math.abs(forward) < r + 5 && Math.abs(sideways) < CONFIG.pathRadius + 24 + r;
    },
    collides(x, y, r = Player.radius) {
      if (distanceToPath(x, y) + r > CONFIG.pathRadius + 8) return true;
      if (this.gates.some(g => this.gateCollision(g,x,y,r))) return true;
      return this.colliders.some(b => circleRect(x, y, r, b));
    },
    nearestInteractable() {
      let best = null, bestD = Infinity;
      for (const a of this.attractions) {
        const d = dist(Player, a);
        if (a.id === "exit" && Player.y < 2950) continue;
        if (d < CONFIG.interactionRadius && d < bestD) { best = a; bestD = d; }
      }
      return best;
    },
    zoneName() {
      const y = Player.y;
      if (y < 440) return "Entrada";
      if (y < 815) return "Túnel Infinito";
      if (y < 1210) return "Praça das Curtidas";
      if (y < 1680) return "Torre das Notificações";
      if (y < 2150) return "Galeria Perfeita";
      if (y < 2550) return "Salão das Tendências";
      return y < 2850 ? "Praça Tranquila" : "Saída";
    },
    updateNPCs(dt) {
      const c = Game.corruption / 100;
      for (const n of this.npcs) {
        n.phase += dt;
        n.phone = c > .37 + seeded(n.seed + 60) * .22;
        const active = n.phone ? 0 : 1;
        const isolation = clamp((c - .52) / .28, 0, 1) * ((n.seed % 2) ? 27 : -27);
        const tx = n.baseX + Math.sin(n.phase * .8) * 10 * active + n.nx * isolation;
        const ty = n.baseY + Math.cos(n.phase * .7) * 6 * active + n.ny * isolation;
        if (!this.collides(tx, ty, 7)) { n.x = lerp(n.x,tx,1-Math.exp(-3*dt)); n.y = lerp(n.y,ty,1-Math.exp(-3*dt)); }
      }
      for (const g of this.gates) g.open = Math.min(1, g.open + (this.isGateOpen(g) ? dt * 1.4 : 0));
    },
    drawGround(c) {
      const worn = clamp((c - .2) / .34, 0, 1), dead = clamp((c - .6) / .34, 0, 1);
      ctx.save(); ctx.translate(-Math.round(Camera.x), -Math.round(Camera.y));
      const grass = ["clean", "worn", "dead"];
      [1,worn,dead].forEach((alpha,i) => {
        if (!alpha) return;
        ctx.globalAlpha = alpha; ctx.fillStyle = ["#749854","#8b8960","#696b56"][i]; ctx.fillRect(Camera.x,Camera.y,View.width+2,View.height+2);
        ctx.globalAlpha = alpha * .3; ctx.fillStyle = Assets.pattern(`tiles/tile_grass_${grass[i]}_01.png`); ctx.fillRect(Camera.x,Camera.y,View.width+2,View.height+2);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = c < .5 ? "rgba(82,106,55,.25)" : "rgba(69,71,53,.2)"; ctx.fillRect(Camera.x,Camera.y,View.width+2,View.height+2);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(PATH[0].x,PATH[0].y); for (const p of PATH.slice(1)) ctx.lineTo(p.x,p.y);
      ctx.strokeStyle = "#635d45"; ctx.lineWidth = CONFIG.pathRadius * 2 + 22; ctx.stroke();
      ctx.strokeStyle = "#c0ac78"; ctx.lineWidth = CONFIG.pathRadius * 2 + 14; ctx.stroke();
      [1,worn,dead].forEach((alpha,i) => {
        if (!alpha) return;
        ctx.lineWidth = CONFIG.pathRadius*2;
        ctx.globalAlpha = alpha; ctx.strokeStyle = ["#c9ae70","#aaa078","#888476"][i]; ctx.stroke();
        ctx.globalAlpha = alpha * .5; ctx.strokeStyle = Assets.pattern(`tiles/tile_path_${["clean","worn","cracked"][i]}_01.png`); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.restore();
    },
    draw() {
      const c = Game.corruption / 100;
      this.drawGround(c); this.drawPathDetails(c);
      this.drawFinalCurtain(c);
      this.gates.forEach(g => this.drawGate(g,c));
      this.drawables.sort((a,b) => a.y - b.y);
      for (const item of this.drawables) {
        if (item.kind === "player") Player.draw();
        else if (item.kind === "prop") this.drawProp(item,c);
        else if (item.kind === "attraction") this.drawAttraction(item,c);
        else this.drawNPC(item,c);
      }
    },
    drawPathDetails(c) {
      for (const p of this.details) {
        if (!onScreen(p.x,p.y,80)) continue;
        const x = Math.round(p.x-Camera.x), y = Math.round(p.y-Camera.y);
        if (p.type === "arrow" && p.seed % 3 === 0) {
          ctx.save(); ctx.translate(x,y); ctx.rotate(p.angle-Math.PI/2);
          const file = c > .76 ? "tiles/tile_arrow_glitch.png" : "tiles/tile_arrow_down_clean.png";
          Assets.draw(file,-16,-16,32,32,.7); ctx.restore();
        }
        if (p.type === "debris" && c > .31 + seeded(p.seed+90) * .5) {
          const file = p.seed % 4 === 0 ? "debris_trash_pile_01" : "debris_paper_01";
          Assets.anchored(`props/${file}.png`,p.x,p.y);
          if (c > .65) Assets.anchored("props/crack_small_01.png",p.x+20,p.y+25);
        }
      }
    },
    drawProp(p,c) {
      if (!onScreen(p.x,p.y)) return;
      const local = c + (seeded(p.seed+40)-.5)*.17;
      const stage = local < .33 ? 0 : local < .7 ? 1 : 2;
      let file;
      if (p.type === "sign") file = `props/${local > .76 && p.file !== "sign_exit" ? "sign_glitch_01" : p.file}.png`;
      else file = `props/${PROP_ART[p.type][stage]}.png`;
      Assets.anchored(file,p.x,p.y);
      if (p.type === "lamp" && stage < 2) {
        const light = stage === 0 || reducedMotion || Math.sin(Game.elapsed*2+p.seed) > -.2;
        if (light) { ctx.fillStyle = "rgba(255,207,109,.12)"; ctx.fillRect(Math.round(p.x-Camera.x-12),Math.round(p.y-Camera.y-54),24,25); }
      }
      if (p.type === "bin" && stage > 0) Assets.anchored("props/debris_paper_01.png",p.x+20,p.y+8);
      if (p.type === "stall" && stage === 2) Assets.anchored("props/debris_trash_pile_01.png",p.x+28,p.y+16);
    },
    drawGate(g,c) {
      if (!onScreen(g.x,g.y,300)) return;
      const span = CONFIG.pathRadius + 21;
      const retreat = g.open * (span + 6);
      const file = Math.abs(g.nx) > .7 ? "props/fence_horizontal_clean.png" : "props/fence_vertical_clean.png";
      for (let i = -2; i <= 2; i++) {
        if (g.open > 0 && i === 0) continue;
        const direction = i < 0 ? -1 : 1;
        const offset = i * 53 + direction * retreat;
        const alpha = 1 - g.open * .55;
        Assets.anchored(file,g.x+g.nx*offset,g.y+g.ny*offset,1,alpha);
      }
      if (!this.isGateOpen(g)) {
        const x = Math.round(g.x-Camera.x), y = Math.round(g.y-Camera.y);
        ctx.save(); ctx.translate(x,y); ctx.rotate(g.angle);
        ctx.fillStyle = "#6b5d42"; ctx.fillRect(-4,-span,8,span*2);
        ctx.fillStyle = "#d5ad62"; for (let j=-span;j<span;j+=18) ctx.fillRect(-2,j,4,8);
        ctx.restore();
      }
    },
    drawAttraction(a,c) {
      if (!onScreen(a.x,a.y)) return;
      if (a.id === "host") { Assets.draw(`npcs/${c > .7 ? "host_late_idle_down" : Game.phase === "intro" && Math.floor(Game.elapsed*3)%2 ? "host_talk_01" : "host_idle_down"}.png`,a.x-Camera.x-16,a.y-Camera.y-46,32,48); return; }
      if (a.id === "exit") return;
      const stage = c < .4 ? 0 : c < .75 ? 1 : 2;
      const art = Assets.weathered(ATTRACTION_ART[a.name],stage);
      Assets.draw(art,a.x-Camera.x-64,a.y-Camera.y-128,128,128);
      if (stage === 2 && a.id !== "quiet") Assets.anchored("props/debris_trash_pile_01.png",a.x+43,a.y+10);
      const active = Attractions.active && Attractions.active.a === a && Game.phase === "attraction";
      if (active && Attractions.active.flash > 0) {
        const file = a.id === "tower" ? "effects/fx_notification_ping_01.png" : "effects/fx_like_pop_01.png";
        Assets.anchored(file,a.x,a.y-120,1,Math.min(1,Attractions.active.flash*2));
      }
      if (a.stage === Game.progressStage + 1 && a.stage <= 5 && !active) Assets.anchored("effects/fx_interact_prompt.png",a.x,a.y-135,1,reducedMotion?1:.85+Math.sin(Game.elapsed*2)*.15);
    },
    drawNPC(n,c) {
      if (!onScreen(n.x,n.y,70)) return;
      const base = ["child","teen","adult"][n.seed%3];
      const walk = !n.phone && Math.sin(n.phase*.8) > -.6 && Math.floor(n.phase/.22)%2;
      const file = `npcs/npc_${base}_01_${walk ? "walk_01" : "idle"}.png`;
      const x = Math.round(n.x-Camera.x), y = Math.round(n.y-Camera.y);
      Assets.draw(file,x-16,y-46,32,48);
      if (n.phone) {
        ctx.fillStyle = "#152438"; ctx.fillRect(x-3,y-20,7,10);
        ctx.fillStyle = c > .83 ? "#587d87" : "#91dbdf"; ctx.fillRect(x-2,y-19,5,6);
      }
    },
    drawFinalCurtain(c) {
      if (!onScreen(1160,3035,400)) return;
      const wall = c > .6 ? "final/final_wall_worn.png" : "final/final_wall_clean.png";
      for (const x of [959,1026,1093,1227,1294,1361]) Assets.anchored(wall,x,3120);
      Assets.anchored("final/final_exit_frame.png",1160,3108);
      const x = 1160-Camera.x-64, y = 3110-Camera.y-96;
      const curtain = Assets.get("final/final_curtain_closed.png");
      if (Assets.ready("final/final_curtain_closed.png")) {
        const open = clamp(Game.exitTime/1.5,0,1) * 61;
        ctx.drawImage(curtain,0,0,128,192,Math.round(x-open),Math.round(y),64,96);
        ctx.drawImage(curtain,128,0,128,192,Math.round(x+64+open),Math.round(y),64,96);
      }
      Assets.anchored("final/final_sign_end.png",1040,2994);
    }
  };
  const CLOCKS = [840,880,970,1100,1200,1260];
  const DECAY = [0,18,38,58,78,95];
  const Status = {
    lastScore: -1, lastMinute: -1,
    refresh() {
      if (this.lastScore !== Game.score) { UI.score.textContent = numberFormat.format(Game.score); this.lastScore = Game.score; }
      const minute = Math.floor(Game.clockMinutes);
      if (minute !== this.lastMinute) { UI.clock.textContent = formatClock(minute); this.lastMinute = minute; }
    }
  };
  const Corruption = {
    bumpTo(value) { Game.corruptionTarget = Math.max(Game.corruptionTarget,value); },
    update(dt) {
      Game.corruption = lerp(Game.corruption,Game.corruptionTarget,1-Math.exp(-.5*dt));
      if (Game.progressStage >= 5) {
        const p = clamp((Player.y-2390)/610,0,1);
        this.bumpTo(95+p*3); Game.clockMinutes = Math.max(Game.clockMinutes,1260+p*10);
      }
    }
  };
  const Notifications = {
    remaining: 0, timer: 22, index: 0,
    reset() { this.remaining = 0; this.timer = 22; this.index = 0; UI.notifications.replaceChildren(); },
    push(message, seconds = 3.2) {
      UI.notifications.replaceChildren();
      const el = document.createElement("div"); el.className = "toast"; el.textContent = message;
      UI.notifications.append(el); this.remaining = seconds;
    },
    update(dt) {
      if (this.remaining > 0) { this.remaining -= dt; if (this.remaining <= 0) UI.notifications.replaceChildren(); }
      if (Game.progressStage < 1 || Game.progressStage >= 5 || Game.phase !== "play") return;
      this.timer -= dt;
      if (this.timer <= 0) {
        const messages = ["Alguém gostou.","Tem algo novo.","Só mais um."];
        this.push(messages[Math.min(this.index++,messages.length-1)],2.3); this.timer = 30;
        Game.stats.notificationsShown++;
      }
    }
  };
  const Sound = {
    enabled: true, context: null, master: null, timer: 0, noteIndex: 0,
    init() {
      if (this.context || !this.enabled) return;
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      try {
        this.context = new Audio(); this.master = this.context.createGain();
        this.master.gain.value = .075; this.master.connect(this.context.destination);
      } catch { this.context = null; }
    },
    wake() {
      this.init();
      if (this.context && this.enabled) this.context.resume().catch(() => {});
    },
    sync() {
      document.querySelectorAll(".sound-toggle").forEach(b => { b.textContent = `SOM: ${this.enabled ? "LIGADO" : "DESLIGADO"}`; b.setAttribute("aria-pressed",String(this.enabled)); });
      if (this.master) {
        const audible = this.enabled && !Game.paused && Game.running;
        this.master.gain.setTargetAtTime(audible ? .075 : 0,this.context.currentTime,.04);
      }
    },
    toggle() { this.enabled = !this.enabled; if (this.enabled) this.wake(); this.sync(); },
    note(frequency,duration = .15,level = .2) {
      if (!this.enabled || !this.context || Game.paused) return;
      const c = this.context, now = c.currentTime;
      const oscillator = c.createOscillator(), gain = c.createGain();
      oscillator.type = "triangle"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(level,now+.015);
      gain.gain.exponentialRampToValueAtTime(.001,now+duration);
      oscillator.connect(gain); gain.connect(this.master);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(now); oscillator.stop(now+duration+.02);
    },
    update(dt) {
      if (!this.enabled || !this.context || Game.progressStage >= 5 || Game.phase === "exit") return;
      this.timer -= dt;
      if (this.timer > 0) return;
      const notes = [261.63,329.63,392,329.63,293.66,349.23,440,392];
      const c = Game.corruption / 100;
      this.note(notes[this.noteIndex++ % notes.length]*(c>.6?.5:1),.3,.1*(1-c*.7));
      this.timer = .65+c*1.8+(this.noteIndex%4===0 ? 2+c*3 : 0);
    }
  };
  const RIDE_INFO = {
    tunnel: { type:"DESCOBERTA", hint:"E ou botão: passe para o próximo quadro.", action:"E · VER MAIS UM", invitation:"O próximo já está pronto." },
    likes: { type:"POPULARIDADE", hint:"E quando o marcador passar pela faixa dourada.", action:"E · COMPARTILHAR", invitation:"Olha quanta gente chegou." },
    tower: { type:"CONEXÃO", hint:"Abra a janela acesa: 1, 2 ou 3. Também pode clicar.", action:null, invitation:"Chegou uma mensagem." },
    gallery: { type:"INSPIRAÇÃO", hint:"A/D ou ←/→: escolha um quadro. E: guarde o iluminado.", action:"E · GUARDAR", invitation:"Só os melhores momentos." },
    trends: { type:"NOVIDADE", hint:"Siga a luz: 1, 2, 3 ou 4. Também pode clicar.", action:null, invitation:"Já tem outra novidade." }
  };
  const Attractions = {
    active: null, refs: {},
    interact(a) {
      if (a.id === "host") return Game.openDialogue("ANFITRIÃO",Game.progressStage ? "Pode seguir. O caminho está aberto." : "Experimente o túnel. É logo ali.");
      if (a.id === "exit") {
        if (Game.progressStage < 5 || !Game.stats.quietPassed) return Notifications.push("A saída fica depois da Praça Tranquila.");
        return Game.finishByExit();
      }
      if (a.id === "quiet") {
        if (Game.progressStage < 5) return Notifications.push("O passeio continua antes desta praça.");
        if (Game.restRemaining > 0) return;
        Game.restRemaining = 5; Game.stats.rests++; keys.clear(); Player.moving = false;
        Notifications.push("Um banco. Um pouco de silêncio.",3);
        return;
      }
      if (a.used) { Notifications.push("Você já passou por aqui. O caminho está aberto.",2.5); Sound.note(330,.12,.12); return; }
      if (a.stage !== Game.progressStage+1) return Notifications.push("Experimente a atração anterior para abrir este trecho.");
      this.active = { a, elapsed:0, points:0, count:0, flash:0, cooldown:0, hitBeat:-1, selected:0, finished:false, resultDelay:0, fromClock:Game.clockMinutes, fromDecay:Game.corruptionTarget };
      Game.phase = "attraction"; keys.clear(); Player.moving = false;
      Notifications.reset();
      const info = RIDE_INFO[a.id];
      $("attractionType").textContent = info.type; $("attractionTitle").textContent = a.name;
      $("attractionArt").src = `assets/${ATTRACTION_ART[a.name]}`;
      $("attractionArt").alt = "";
      $("attractionContent").innerHTML = `<p>${info.invitation}</p><div class="ride-top"><span>NO PASSEIO</span><strong id="rideScore">+0</strong></div><div class="ride-progress"><i id="rideProgress"></i></div><div id="rideBoard" class="ride-board"></div><p class="ride-help">${info.hint}</p><p id="rideFeedback" class="ride-feedback" role="status" aria-live="polite">Experimente.</p>`;
      this.refs = { board:$("rideBoard"), score:$("rideScore"), progress:$("rideProgress"), feedback:$("rideFeedback") };
      this.buildBoard(a.id);
      $("attractionChoices").replaceChildren();
      if (info.action) {
        const button = document.createElement("button"); button.className = "primary"; button.textContent = info.action;
        button.addEventListener("click",() => this.action()); $("attractionChoices").append(button);
      }
      const pause = document.createElement("button"); pause.textContent = "PAUSA";
      pause.addEventListener("click",() => Game.togglePause(true)); $("attractionChoices").append(pause);
      Game.showScreen("attraction");
      this.refresh();
    },
    buildBoard(id) {
      const board = this.refs.board;
      if (id === "tunnel") {
        board.innerHTML = '<div class="feed-card"><img id="feedIcon" alt=""><b id="feedTitle"></b><span id="feedCaption"></span></div>';
        this.nextCard(); return;
      }
      if (id === "likes") { board.innerHTML = '<div class="like-machine"><img src="assets/attractions/icon_like_01.png" alt="Curtidas"><div class="like-meter"><span class="like-zone"></span><i id="likeCursor" class="like-cursor"></i></div></div>'; this.refs.cursor = $("likeCursor"); return; }
      const count = id === "trends" ? 4 : 3;
      const grid = document.createElement("div"); grid.className = `ride-grid ${id}`;
      this.refs.buttons = [];
      for (let i = 0; i < count; i++) {
        const button = document.createElement("button"); button.setAttribute("aria-label",`${id === "gallery" ? "Quadro" : "Janela"} ${i+1}`);
        const img = document.createElement("img"); img.alt = "";
        img.src = `assets/${id === "gallery" ? ["props/tree_full_01.png","props/flower_patch_01.png","props/fountain_clean.png"][i] : id === "tower" ? "attractions/icon_notification_bubble.png" : ["attractions/icon_like_01.png","ui/icon_fun.png","attractions/frame_gallery_01.png","ui/icon_time.png"][i]}`;
        const label = document.createElement("span"); label.textContent = String(i+1);
        button.append(img,label);
        button.addEventListener("click",() => { if (!this.active || Game.paused || Game.phase !== "attraction") return; if (id === "gallery") { this.active.selected = i; this.action(i); } else this.action(i); });
        grid.append(button); this.refs.buttons.push(button);
      }
      board.append(grid);
    },
    nextCard() {
      const cards = [["Uma ideia nova","Dá para fazer em casa.","props/flower_patch_01.png"],["Olha esse lugar","Salvo para depois.","attractions/frame_gallery_01.png"],["Deu vontade de rir","Enviado por um amigo.","ui/icon_fun.png"],["Aprendi uma coisa","Mais uma descoberta.","props/fountain_clean.png"],["Um passeio de tarde","Parece que foi agora.","props/tree_full_01.png"]];
      const card = cards[this.active.count%cards.length];
      $("feedTitle").textContent = card[0]; $("feedCaption").textContent = card[1]; $("feedIcon").src = `assets/${card[2]}`;
    },
    beat() { return Math.floor(this.active.elapsed / (this.active.a.id === "trends" ? 1.8 : 2.4)); },
    target() {
      const s = this.active; const count = s.a.id === "trends" ? 4 : 3;
      return (this.beat()*2 + Math.floor(this.beat()/3) + s.a.stage) % count;
    },
    action(index) {
      const s = this.active;
      if (!s || Game.paused || Game.phase !== "attraction" || s.finished || s.cooldown > 0) return;
      const id = s.a.id;
      let points = 0, message = "";
      if (id === "tunnel") {
        points = [20,40,80,100,150][Math.min(4,Math.floor(s.count/4))];
        s.count++; Game.stats.justOneMore++; this.nextCard(); message = "+"+points+" · mais uma descoberta";
        s.cooldown = .7;
      } else if (id === "likes") {
        const position = (Math.sin(s.elapsed*2.1)+1)/2;
        points = position >= .38 && position <= .62 ? 350 : 50;
        message = points === 350 ? "+350 · chegou em muita gente" : "+50 · alguém gostou";
        s.count++; s.cooldown = .65;
      } else {
        const chosen = index ?? (id === "gallery" ? s.selected : this.target());
        const beat = this.beat();
        if (s.hitBeat === beat) return;
        if (chosen === this.target()) {
          s.hitBeat = beat; s.count++;
          points = id === "tower" ? 100 : id === "gallery" ? 200 : 350;
          message = id === "tower" ? "+100 · mensagem aberta" : id === "gallery" ? "+200 · momento guardado" : "+350 · você acompanhou";
          if (id === "tower") Game.stats.notificationsOpened++;
        } else { message = "A luz mudou. A próxima já vem."; }
        s.cooldown = .3;
      }
      if (points) {
        s.points += points; Game.score += points; s.flash = .7;
        Sound.note(points >= 200 ? 659.25 : 523.25,.13,.22);
      }
      this.refs.feedback.textContent = message;
      this.refs.score.textContent = `+${numberFormat.format(s.points)}`;
      this.refresh(); Status.refresh();
    },
    key(key) {
      const s = this.active; if (!s || Game.paused) return;
      if (s.finished) { if (key === "e" && s.resultDelay <= 0) this.leave(); return; }
      if (s.a.id === "gallery") {
        if (["a","arrowleft"].includes(key)) s.selected = (s.selected+2)%3;
        if (["d","arrowright"].includes(key)) s.selected = (s.selected+1)%3;
      }
      if (key === "e") this.action();
      else if (/^[1-4]$/.test(key) && ["tower","trends","gallery"].includes(s.a.id)) {
        const index = Number(key)-1;
        if (index < this.refs.buttons.length) { s.selected = index; this.action(index); }
      }
      this.refresh();
    },
    update(dt) {
      const s = this.active; if (!s) return;
      if (s.finished) { s.resultDelay = Math.max(0,s.resultDelay-dt); const b = $("rideContinue"); if (b) b.disabled = s.resultDelay > 0; return; }
      s.elapsed = Math.min(CONFIG.rideDuration,s.elapsed+dt); s.flash = Math.max(0,s.flash-dt); s.cooldown = Math.max(0,s.cooldown-dt);
      const progress = s.elapsed/CONFIG.rideDuration;
      Corruption.bumpTo(lerp(s.fromDecay,DECAY[s.a.stage],progress));
      Game.clockMinutes = Math.max(Game.clockMinutes,lerp(s.fromClock,CLOCKS[s.a.stage],progress));
      this.refresh();
      if (s.elapsed >= CONFIG.rideDuration) this.complete();
    },
    refresh() {
      const s = this.active; if (!s || s.finished) return;
      this.refs.progress.style.width = `${s.elapsed/CONFIG.rideDuration*100}%`;
      if (this.refs.cursor) this.refs.cursor.style.left = `${(Math.sin(s.elapsed*2.1)+1)/2*98}%`;
      if (this.refs.buttons) this.refs.buttons.forEach((b,i) => {
        const lit = i === this.target() && s.hitBeat !== this.beat();
        b.classList.toggle("lit",lit); b.classList.toggle("selected",s.a.id==="gallery"&&i===s.selected);
        b.setAttribute("aria-label",`${s.a.id === "gallery" ? "Quadro" : "Janela"} ${i+1}${lit ? ", acesa" : ""}`);
      });
    },
    complete() {
      const s = this.active; if (!s || s.finished || s.a.used) return;
      s.finished = true; s.resultDelay = .6; s.a.used = 1;
      Game.progressStage = s.a.stage; Game.stats.attractionUses++; Game.stats.attractionSeconds += s.elapsed;
      const bonus = [0,100,350,500,750,1000][s.a.stage];
      Game.score += bonus; s.points += bonus;
      Corruption.bumpTo(DECAY[s.a.stage]); Game.clockMinutes = Math.max(Game.clockMinutes,CLOCKS[s.a.stage]);
      $("attractionContent").innerHTML = `<div class="ride-result"><strong>+${numberFormat.format(s.points)}</strong><p>${s.a.stage === 5 ? "O carrossel parou." : "O próximo trecho está aberto."}</p></div>`;
      $("attractionChoices").replaceChildren();
      const button = document.createElement("button"); button.id = "rideContinue"; button.textContent = "SEGUIR PELO PARQUE"; button.className = "primary"; button.disabled = true;
      button.addEventListener("click",() => this.leave()); $("attractionChoices").append(button);
      Status.refresh();
      if (s.a.stage < 5) Sound.note(783.99,.24,.16);
    },
    leave() {
      if (!this.active || !this.active.finished || this.active.resultDelay > 0 || Game.paused) return;
      this.active = null; this.refs = {}; Game.closeModals(); Notifications.reset();
    }
  };
  const Game = {
    running: false, paused: false, phase:"menu", elapsed:0, lastTime:0, corruption:0, corruptionTarget:0, progressStage:0, score:0, clockMinutes:840, currentInteractable:null, exitTime:0, restRemaining:0, stats:{},
    reset() {
      this.running = false; this.paused = false; this.phase = "menu"; this.elapsed = 0; this.corruption = 0; this.corruptionTarget = 0; this.progressStage = 0; this.score = 0; this.clockMinutes = 840; this.currentInteractable = null; this.exitTime = 0; this.restRemaining = 0;
      this.stats = { attractionUses:0, attractionSeconds:0, justOneMore:0, notificationsOpened:0, notificationsShown:0, quietPassed:false, rests:0 };
      keys.clear(); touchPointers.clear(); Player.x = 310; Player.y = 220; Player.facingX = 0; Player.facingY = 1; Player.moving = false; Player.anim = 0;
      Attractions.active = null; Attractions.refs = {}; Sound.timer = 1; Sound.noteIndex = 0;
      World.init(); Camera.update(0,true); Notifications.reset(); Status.refresh();
      UI.hud.classList.add("hidden"); $("touchControls").classList.add("hidden"); UI.interactionHint.classList.add("hidden");
      Sound.sync();
    },
    start() {
      if (!Assets.loaded) return;
      this.reset(); this.running = true; this.phase = "intro"; this.showScreen("intro"); Sound.wake(); Sound.sync();
    },
    beginGameplay() {
      if (this.phase !== "intro" || this.paused) return;
      this.phase = "play"; this.showScreen(null); UI.hud.classList.remove("hidden"); this.syncTouch();
      Notifications.push("WASD ou setas · desça até o túnel",5);
    },
    update(dt) {
      if (!this.running || this.paused) return;
      if (this.phase === "intro" || this.phase === "dialogue") return;
      this.elapsed += dt;
      if (this.phase === "play") {
        if (this.restRemaining > 0) { this.restRemaining = Math.max(0,this.restRemaining-dt); Player.moving = false; keys.clear(); }
        else Player.update(dt);
        if (this.progressStage >= 5 && Player.y > 2640) this.stats.quietPassed = true;
        this.refreshInteraction();
      }
      if (this.phase === "attraction") Attractions.update(dt);
      if (this.phase === "exit") { this.exitTime += dt; if (this.exitTime >= 2.4) return this.finish(); }
      Camera.update(dt); World.updateNPCs(dt); Corruption.update(dt); Notifications.update(dt); Sound.update(dt); Status.refresh();
    },
    refreshInteraction() {
      this.currentInteractable = World.nearestInteractable();
      let text = "";
      const a = this.currentInteractable;
      if (a) {
        if (a.id === "quiet") text = "E · sentar um pouco";
        else if (a.id === "exit") text = "E · sair do parque";
        else if (a.used) text = "Passeio concluído · siga o caminho";
        else text = `E · ${a.name}`;
      } else {
        const gate = World.gates.find(g => !World.isGateOpen(g) && dist(Player,g) < 88);
        if (gate) text = `Experimente ${World.attractions.find(a=>a.stage===gate.stage).name}`;
      }
      if (this.restRemaining > 0) text = "…";
      UI.interactionHint.classList.toggle("hidden",!text); UI.interactionHint.textContent = text;
      UI.areaName.textContent = World.zoneName();
    },
    render() {
      ctx.setTransform(View.ratio*View.scale,0,0,View.ratio*View.scale,0,0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#44563b"; ctx.fillRect(0,0,View.width,View.height);
      if (Assets.loaded) World.draw();
    },
    loop(now) {
      const dt = Math.min(CONFIG.maxDelta,Math.max(0,(now-this.lastTime)/1000 || 0)); this.lastTime = now;
      this.update(dt); this.render(); requestAnimationFrame(t=>this.loop(t));
    },
    tryInteract() {
      if (!this.running || this.paused || this.phase !== "play" || this.restRemaining > 0) return;
      const a = World.nearestInteractable();
      if (a) { keys.clear(); Player.moving = false; Attractions.interact(a); }
    },
    syncTouch() { $("touchControls").classList.toggle("hidden",this.phase !== "play" || this.paused); },
    togglePause(force) {
      if (!this.running || this.phase === "ending") return;
      const value = typeof force === "boolean" ? force : !this.paused;
      if (value === this.paused) return;
      this.paused = value; keys.clear(); touchPointers.clear(); Player.moving = false;
      this.showScreen(value ? "pause" : this.phase === "play" || this.phase === "exit" ? null : this.phase);
      this.syncTouch(); Sound.sync();
    },
    showScreen(name) {
      Object.entries(UI.screens).forEach(([key,screen]) => { screen.classList.toggle("active",key===name); screen.inert = key!==name; });
      UI.interactionHint.classList.add("hidden");
      const first = name ? UI.screens[name].querySelector("button:not(:disabled)") : canvas;
      if (first) first.focus({ preventScroll:true });
      this.syncTouch();
    },
    closeModals() {
      this.phase = "play"; keys.clear(); Player.moving = false; this.showScreen(null); this.refreshInteraction();
    },
    openDialogue(speaker,message) {
      this.phase = "dialogue"; Player.moving = false; keys.clear();
      $("dialogueSpeaker").textContent = speaker; $("dialogueText").textContent = message;
      $("dialoguePortrait").src = `assets/portraits/${this.corruption>70 ? "portrait_host_late" : "portrait_host_normal"}.png`;
      $("dialogueChoices").replaceChildren();
      const b = document.createElement("button"); b.textContent = "CONTINUAR"; b.className = "primary";
      b.addEventListener("click",()=>{if(!this.paused&&this.phase==="dialogue")this.closeModals();}); $("dialogueChoices").append(b); this.showScreen("dialogue");
    },
    finishByExit() {
      if (this.phase !== "play" || this.progressStage !== 5 || !this.stats.quietPassed) return;
      keys.clear(); Player.moving = false; this.restRemaining = 0; this.phase = "exit"; this.exitTime = 0; Notifications.reset(); this.showScreen(null);
    },
    finish() {
      if (!this.running) return;
      this.running = false; this.paused = false; this.phase = "ending"; keys.clear(); Notifications.reset();
      UI.hud.classList.add("hidden"); Sound.sync();
      $("endingTitle").textContent = "JÁ É NOITE.";
      $("endingMessage").textContent = "Os números subiram. O parque ficou para trás.";
      const stats = [["Pontos acumulados",numberFormat.format(this.score)],["Tempo real jogando",formatDuration(this.elapsed)],["Horário no parque",`14:00 → ${formatClock(this.clockMinutes)}`],["Atrações visitadas",`${this.stats.attractionUses} de 5`]];
      $("endingStats").innerHTML = stats.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join("");
      this.showScreen("ending");
    },
    backToMenu() { this.reset(); this.showScreen("menu"); }
  };
  const touchPointers = new Map();
  function clearInput() { keys.clear(); touchPointers.clear(); Player.moving = false; }
  function resizeCanvas() {
    View.ratio = Math.min(2,devicePixelRatio || 1);
    View.scale = Math.max(.5,innerWidth/CONFIG.worldWidth,innerHeight/CONFIG.worldHeight,Math.min(innerWidth/680,innerHeight/480,2));
    View.width = Math.min(CONFIG.worldWidth,innerWidth/View.scale); View.height = Math.min(CONFIG.worldHeight,innerHeight/View.scale);
    canvas.width = Math.round(innerWidth*View.ratio); canvas.height = Math.round(innerHeight*View.ratio);
    Camera.update(0,true); Game.render();
  }
  addEventListener("keydown",event => {
    const key = event.key.toLowerCase();
    if (["arrowup","arrowdown","arrowleft","arrowright"].includes(key) || (key === " " && event.target === canvas)) event.preventDefault();
    if (key === "tab") {
      const screen = Object.values(UI.screens).find(s=>s.classList.contains("active"));
      if (screen) {
        const buttons = [...screen.querySelectorAll("button:not(:disabled)")];
        if (buttons.length) {
          const current = buttons.indexOf(document.activeElement);
          if (event.shiftKey && current <= 0) { event.preventDefault(); buttons[buttons.length-1].focus(); }
          else if (!event.shiftKey && (current === buttons.length-1 || current === -1)) { event.preventDefault(); buttons[0].focus(); }
        }
      }
      return;
    }
    if (event.repeat && !["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)) return;
    if (key === "escape" && !event.repeat) { event.preventDefault(); if (Game.phase === "about") { Game.phase="menu"; Game.showScreen("menu"); } else Game.togglePause(); return; }
    if (key === "m" && !event.repeat) { Sound.toggle(); return; }
    if (Game.paused) return;
    if (Game.phase === "play") {
      if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)) keys.add(key);
      if (key === "e" && !event.repeat) Game.tryInteract();
    } else if (Game.phase === "attraction" && !event.repeat) Attractions.key(key);
    else if (key === "e" && !event.repeat) {
      if (Game.phase === "intro") Game.beginGameplay();
      else if (Game.phase === "dialogue") Game.closeModals();
    }
  });
  addEventListener("keyup",event => keys.delete(event.key.toLowerCase()));
  addEventListener("blur",()=>{ clearInput(); if(Game.running)Game.togglePause(true); });
  document.addEventListener("visibilitychange",()=>{if(document.hidden){clearInput();if(Game.running)Game.togglePause(true);}});
  addEventListener("resize",resizeCanvas);
  document.querySelectorAll("[data-move]").forEach(b => {
    b.addEventListener("pointerdown",e=>{if(Game.phase!=="play"||Game.paused)return;e.preventDefault(); b.setPointerCapture(e.pointerId); touchPointers.set(e.pointerId,b.dataset.move); keys.add(b.dataset.move);});
    const release = e => { const key=touchPointers.get(e.pointerId); touchPointers.delete(e.pointerId); if(key&&!Array.from(touchPointers.values()).includes(key))keys.delete(key); };
    b.addEventListener("pointerup",release); b.addEventListener("pointercancel",release); b.addEventListener("lostpointercapture",release);
  });
  $("touchInteract").addEventListener("click",()=>Game.tryInteract());
  $("startBtn").addEventListener("click",()=>Game.start());
  $("aboutBtn").addEventListener("click",()=>{Game.phase="about";Game.showScreen("about");});
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>{Game.phase="menu";Game.showScreen("menu");}));
  $("introNext").addEventListener("click",()=>Game.beginGameplay());
  $("resumeBtn").addEventListener("click",()=>Game.togglePause(false));
  $("pauseBtn").addEventListener("click",()=>Game.togglePause());
  $("restartBtnPause").addEventListener("click",()=>Game.start());
  $("playAgainBtn").addEventListener("click",()=>Game.start());
  $("menuBtnPause").addEventListener("click",()=>Game.backToMenu());
  $("menuBtnEnd").addEventListener("click",()=>Game.backToMenu());
  document.querySelectorAll(".sound-toggle").forEach(b=>b.addEventListener("click",()=>Sound.toggle()));
  Game.reset(); resizeCanvas(); Game.showScreen("menu");
  Assets.preload().then(()=>{if(Assets.loaded){Game.render();if(Game.phase==="menu")$("startBtn").focus({preventScroll:true});}});
  requestAnimationFrame(t=>{Game.lastTime=t;Game.loop(t);});
})();
