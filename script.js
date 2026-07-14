(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const year = document.getElementById('current-year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const canvas = document.getElementById('game-canvas');
  const statusEl = document.getElementById('game-status');
  const scoreEl = document.getElementById('game-score');
  const bestEl = document.getElementById('game-best');
  const controlButtons = document.querySelectorAll('[data-action]');
  const directionButtons = document.querySelectorAll('[data-direction]');
  const gameSection = document.getElementById('games');

  if (!canvas || !statusEl || !scoreEl || !bestEl || !gameSection) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const GRID_SIZE = 20;
  const BASE_TICK_MS = 135;
  const STORAGE_KEY = 'loopengine-snake-high-score';

  if (!ctx) {
    statusEl.textContent = 'Canvas unavailable';
    return;
  }

  const state = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    best: 0,
    running: false,
    paused: false,
    gameOver: false,
    timerId: null,
    tickMs: BASE_TICK_MS,
    lastDirectionChangeTick: -1,
    tickIndex: 0,
    canvasSize: 480,
    touchStart: null,
  };

  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  function loadBestScore() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = Number.parseInt(stored || '0', 10);
      state.best = Number.isFinite(parsed) ? parsed : 0;
    } catch {
      state.best = 0;
    }
  }

  function saveBestScore() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(state.best));
    } catch {
      // Ignore storage errors in static hosting contexts.
    }
  }

  function syncStats() {
    scoreEl.textContent = String(state.score);
    bestEl.textContent = String(state.best);
    statusEl.textContent = state.gameOver
      ? 'Game over'
      : state.paused
        ? 'Paused'
        : state.running
          ? 'Playing'
          : 'Ready';
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const size = Math.max(280, Math.floor(rect.width));
    const dpr = window.devicePixelRatio || 1;
    state.canvasSize = size;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function centerPoint() {
    const mid = Math.floor(GRID_SIZE / 2);
    return { x: mid, y: mid };
  }

  function initSnake() {
    const head = centerPoint();
    state.snake = [
      { x: head.x, y: head.y },
      { x: head.x - 1, y: head.y },
      { x: head.x - 2, y: head.y },
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.food = spawnFood();
    state.score = 0;
    state.tickMs = BASE_TICK_MS;
    state.tickIndex = 0;
    state.gameOver = false;
    state.paused = false;
    state.running = false;
    syncStats();
  }

  function isSnakeCell(x, y) {
    return state.snake.some((segment) => segment.x === x && segment.y === y);
  }

  function spawnFood() {
    let next;
    let guard = 0;
    do {
      next = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      guard += 1;
    } while (isSnakeCell(next.x, next.y) && guard < 500);
    return next;
  }

  function setBestScore(score) {
    if (score > state.best) {
      state.best = score;
      saveBestScore();
    }
  }

  function endGame() {
    state.running = false;
    state.paused = false;
    state.gameOver = true;
    stopLoop();
    setBestScore(state.score);
    syncStats();
    render();
  }

  function stopLoop() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startLoop() {
    stopLoop();
    state.timerId = window.setInterval(tick, state.tickMs);
  }

  function beginGame() {
    if (state.gameOver || state.snake.length === 0) {
      initSnake();
    }
    state.running = true;
    state.paused = false;
    state.gameOver = false;
    syncStats();
    startLoop();
  }

  function restartGame() {
    stopLoop();
    initSnake();
    state.running = true;
    syncStats();
    startLoop();
  }

  function togglePause() {
    if (state.gameOver) {
      restartGame();
      return;
    }
    if (!state.running) {
      beginGame();
      return;
    }
    state.paused = !state.paused;
    syncStats();
    if (state.paused) {
      stopLoop();
    } else {
      startLoop();
    }
  }

  function canTurnInto(next) {
    return !(next.x === -state.direction.x && next.y === -state.direction.y);
  }

  function queueDirection(next, source = 'keyboard') {
    if (!next) {
      return;
    }

    const activeDirection = state.paused || state.gameOver ? state.direction : state.nextDirection;
    const isReverseOfActive = next.x === -activeDirection.x && next.y === -activeDirection.y;
    if (isReverseOfActive) {
      return;
    }

    if (state.tickIndex === state.lastDirectionChangeTick && source === 'keyboard') {
      return;
    }

    state.nextDirection = next;
    state.lastDirectionChangeTick = state.tickIndex;

    if (!state.running && !state.gameOver) {
      beginGame();
    }
  }

  function applyDirection() {
    if (canTurnInto(state.nextDirection)) {
      state.direction = state.nextDirection;
    }
  }

  function moveSnake() {
    const head = state.snake[0];
    const nextHead = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y,
    };

    if (nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= GRID_SIZE || nextHead.y >= GRID_SIZE) {
      endGame();
      return;
    }

    const willEat = nextHead.x === state.food.x && nextHead.y === state.food.y;
    const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
    if (bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
      endGame();
      return;
    }

    state.snake.unshift(nextHead);
    if (willEat) {
      state.score += 1;
      setBestScore(state.score);
      state.food = spawnFood();
      state.tickMs = Math.max(78, BASE_TICK_MS - Math.floor(state.score / 4) * 6);
      startLoop();
    } else {
      state.snake.pop();
    }
  }

  function tick() {
    if (!state.running || state.paused || state.gameOver) {
      return;
    }
    state.tickIndex += 1;
    applyDirection();
    moveSnake();
    syncStats();
    render();
  }

  function renderCell(x, y, color, radius = 6) {
    const cell = state.canvasSize / GRID_SIZE;
    const px = x * cell;
    const py = y * cell;
    const inset = Math.max(2, cell * 0.08);
    const width = cell - inset * 2;
    const height = cell - inset * 2;

    ctx.fillStyle = color;
    roundRect(ctx, px + inset, py + inset, width, height, Math.min(radius, width / 2));
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
    context.fill();
  }

  function render() {
    const size = state.canvasSize;
    const cell = size / GRID_SIZE;

    ctx.clearRect(0, 0, size, size);

    const bgGradient = ctx.createLinearGradient(0, 0, size, size);
    bgGradient.addColorStop(0, '#f8fffd');
    bgGradient.addColorStop(1, '#edf8f6');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(15, 118, 110, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(size, i * cell);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, size);
      ctx.stroke();
    }

    renderCell(state.food.x, state.food.y, '#ef4444', 999);

    state.snake.forEach((segment, index) => {
      renderCell(segment.x, segment.y, index === 0 ? '#0f766e' : '#1d948c', 7);
    });

    if (state.gameOver) {
      ctx.fillStyle = 'rgba(7, 19, 18, 0.42)';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 30px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Game Over', size / 2, size / 2 - 16);
      ctx.font = '500 16px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Press Restart to play again', size / 2, size / 2 + 18);
    }

    if (state.paused && !state.gameOver) {
      ctx.fillStyle = 'rgba(7, 19, 18, 0.34)';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 28px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Paused', size / 2, size / 2);
    }
  }

  function handleKeydown(event) {
    const { code } = event;
    const map = {
      ArrowUp: directions.up,
      ArrowDown: directions.down,
      ArrowLeft: directions.left,
      ArrowRight: directions.right,
      KeyW: directions.up,
      KeyS: directions.down,
      KeyA: directions.left,
      KeyD: directions.right,
    };

    if (code === 'Space' || code === 'KeyP') {
      event.preventDefault();
      togglePause();
      return;
    }

    if (map[code]) {
      event.preventDefault();
      queueDirection(map[code], 'keyboard');
    }
  }

  function parseAction(action) {
    switch (action) {
      case 'start':
        beginGame();
        break;
      case 'pause':
        togglePause();
        break;
      case 'restart':
        restartGame();
        break;
      default:
        break;
    }
  }

  controlButtons.forEach((button) => {
    button.addEventListener('click', () => {
      parseAction(button.dataset.action || '');
    });
  });

  directionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = directions[button.dataset.direction || ''];
      queueDirection(direction, 'touch');
      if (!state.running && !state.gameOver) {
        beginGame();
      }
    });
  });

  canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    state.touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  canvas.addEventListener('touchend', (event) => {
    if (!state.touchStart || !event.changedTouches.length) {
      state.touchStart = null;
      return;
    }

    const touch = event.changedTouches[0];
    const dx = touch.clientX - state.touchStart.x;
    const dy = touch.clientY - state.touchStart.y;
    const distance = Math.hypot(dx, dy);
    state.touchStart = null;

    if (distance < 28) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      queueDirection(dx > 0 ? directions.right : directions.left, 'touch');
    } else {
      queueDirection(dy > 0 ? directions.down : directions.up, 'touch');
    }

    if (!state.running && !state.gameOver) {
      beginGame();
    }
  }, { passive: true });

  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.running && !state.paused && !state.gameOver) {
      state.paused = true;
      stopLoop();
      syncStats();
      render();
    }
  });

  loadBestScore();
  syncStats();
  initSnake();
  resizeCanvas();
  render();
})();
