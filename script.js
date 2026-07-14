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
  const GRID_SIZE = 24;
  const BASE_TICK_MS = 270;
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

  function isSnakeCell(x, y) {
    return state.snake.some((segment) => segment.x === x && segment.y === y);
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

  function setBestScore(score) {
    if (score > state.best) {
      state.best = score;
      saveBestScore();
    }
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

  function endGame() {
    state.running = false;
    state.paused = false;
    state.gameOver = true;
    stopLoop();
    setBestScore(state.score);
    syncStats();
    render();
  }

  function resetGame() {
    stopLoop();
    initSnake();
    syncStats();
    render();
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
    render();
  }

  function togglePause() {
    if (!state.running || state.gameOver) {
      return;
    }

    state.paused = !state.paused;
    syncStats();

    if (state.paused) {
      stopLoop();
    } else {
      startLoop();
    }

    render();
  }

  function canTurnInto(next) {
    return !(next.x === -state.direction.x && next.y === -state.direction.y);
  }

  function queueDirection(next, source = 'keyboard') {
    if (!next || !state.running || state.gameOver) {
      return;
    }

    const activeDirection = state.paused ? state.direction : state.nextDirection;
    const isReverseOfActive = next.x === -activeDirection.x && next.y === -activeDirection.y;
    if (isReverseOfActive) {
      return;
    }

    if (state.tickIndex === state.lastDirectionChangeTick && source === 'keyboard') {
      return;
    }

    state.nextDirection = next;
    state.lastDirectionChangeTick = state.tickIndex;
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
      state.tickMs = Math.max(156, BASE_TICK_MS - Math.floor(state.score / 4) * 12);
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

  function cellMetrics() {
    const cell = state.canvasSize / GRID_SIZE;
    return {
      cell,
      inset: Math.max(2, cell * 0.08),
    };
  }

  function renderCell(x, y, color, radius = 6) {
    const { cell, inset } = cellMetrics();
    const px = x * cell;
    const py = y * cell;
    const width = cell - inset * 2;
    const height = cell - inset * 2;

    ctx.fillStyle = color;
    roundRect(ctx, px + inset, py + inset, width, height, Math.min(radius, width / 2));
  }

  function renderApple(x, y) {
    const { cell } = cellMetrics();
    const px = x * cell;
    const py = y * cell;
    const size = cell * 0.58;
    const cx = px + cell / 2;
    const cy = py + cell / 2 + cell * 0.04;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d12d2d';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.04, size * 0.18, size * 0.32, -0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5f9946';
    ctx.beginPath();
    ctx.ellipse(size * 0.12, -size * 0.34, size * 0.16, size * 0.28, -0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = Math.max(1, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.42);
    ctx.lineTo(-size * 0.02, -size * 0.58);
    ctx.stroke();

    ctx.restore();
  }

  function renderSnakeHead(segment) {
    const { cell, inset } = cellMetrics();
    const px = segment.x * cell + inset;
    const py = segment.y * cell + inset;
    const width = cell - inset * 2;
    const height = cell - inset * 2;
    const cx = px + width / 2;
    const cy = py + height / 2;

    ctx.save();
    ctx.fillStyle = '#7bc95f';
    roundRect(ctx, px, py, width, height, Math.min(width, height) * 0.45);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx - width * 0.12, cy - height * 0.1, width * 0.24, height * 0.18, -0.35, 0, Math.PI * 2);
    ctx.fill();

    const eyeY = cy - height * 0.12;
    const eyeOffsetX = width * 0.18;
    const eyeRadius = Math.max(2, width * 0.08);

    ctx.fillStyle = '#21462f';
    ctx.beginPath();
    ctx.arc(cx - eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffsetX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - eyeOffsetX + eyeRadius * 0.35, eyeY - eyeRadius * 0.2, eyeRadius * 0.28, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffsetX + eyeRadius * 0.35, eyeY - eyeRadius * 0.2, eyeRadius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#24482f';
    ctx.lineWidth = Math.max(1.5, width * 0.07);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + height * 0.05, width * 0.18, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 183, 197, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx - width * 0.22, cy + height * 0.12, width * 0.08, height * 0.06, -0.35, 0, Math.PI * 2);
    ctx.ellipse(cx + width * 0.22, cy + height * 0.12, width * 0.08, height * 0.06, 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function renderSnakeBody(segment) {
    renderCell(segment.x, segment.y, '#1d948c', 7);
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

    renderApple(state.food.x, state.food.y);

    state.snake.forEach((segment, index) => {
      if (index === 0) {
        renderSnakeHead(segment);
      } else {
        renderSnakeBody(segment);
      }
    });

    if (state.gameOver) {
      ctx.fillStyle = 'rgba(7, 19, 18, 0.42)';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 30px "Trebuchet MS", system-ui, sans-serif';
      ctx.fillText('Game Over', size / 2, size / 2 - 28);
      ctx.font = '700 22px "Trebuchet MS", system-ui, sans-serif';
      ctx.fillText('ㅋㅋ 아직 끝난 건 아니야', size / 2, size / 2 + 4);
      ctx.font = '500 16px "Trebuchet MS", system-ui, sans-serif';
      ctx.fillText('Press Stop to reset', size / 2, size / 2 + 30);
    }

    if (state.paused && !state.gameOver) {
      ctx.fillStyle = 'rgba(7, 19, 18, 0.34)';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 28px "Trebuchet MS", system-ui, sans-serif';
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
      case 'stop':
        resetGame();
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
