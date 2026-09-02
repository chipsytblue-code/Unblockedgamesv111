/**
 * Standalone HTML5/JS/CSS game engines to serve inside iframe srcDoc.
 * Ensures 100% reliability, zero CORS or X-Frame-Options blocks,
 * responsive canvas scaling, touch & keyboard controls, and local high scores.
 */

export const standaloneGameDocs = {
  "2048": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>2048</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #faf8ef;
      color: #776e65;
      font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 12px;
    }
    .header {
      width: 100%;
      max-width: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .title { font-size: 42px; font-weight: bold; color: #776e65; line-height: 1; }
    .scores { display: flex; gap: 8px; }
    .score-box {
      background: #bbada0;
      padding: 6px 14px;
      border-radius: 4px;
      color: white;
      text-align: center;
      min-width: 65px;
    }
    .score-label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #eee4da; }
    .score-val { font-size: 18px; font-weight: bold; }
    .controls {
      width: 100%;
      max-width: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .intro { font-size: 13px; color: #8f7a66; }
    .btn {
      background: #8f7a66;
      color: #f9f6f2;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.15s;
    }
    .btn:hover { background: #9f8b77; }
    .grid-container {
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1/1;
      background: #bbada0;
      border-radius: 8px;
      padding: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 12px;
      position: relative;
      touch-action: none;
    }
    .cell {
      background: rgba(238, 228, 218, 0.35);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: bold;
      color: #776e65;
      transition: all 0.1s ease-in-out;
    }
    .c2 { background: #eee4da; color: #776e65; }
    .c4 { background: #ede0c8; color: #776e65; }
    .c8 { background: #f2b179; color: #f9f6f2; }
    .c16 { background: #f59563; color: #f9f6f2; }
    .c32 { background: #f67c5f; color: #f9f6f2; }
    .c64 { background: #f65e3b; color: #f9f6f2; }
    .c128 { background: #edcf72; color: #f9f6f2; font-size: 24px; box-shadow: 0 0 10px rgba(243, 215, 116, 0.4); }
    .c256 { background: #edcc61; color: #f9f6f2; font-size: 24px; box-shadow: 0 0 10px rgba(243, 215, 116, 0.5); }
    .c512 { background: #edc850; color: #f9f6f2; font-size: 24px; box-shadow: 0 0 12px rgba(243, 215, 116, 0.6); }
    .c1024 { background: #edc53f; color: #f9f6f2; font-size: 20px; box-shadow: 0 0 15px rgba(243, 215, 116, 0.7); }
    .c2048 { background: #edc22e; color: #f9f6f2; font-size: 20px; box-shadow: 0 0 20px rgba(243, 215, 116, 0.9); }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(238, 228, 218, 0.85);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
    .overlay.active { display: flex; }
    .overlay h2 { font-size: 36px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">2048</div>
    <div class="scores">
      <div class="score-box"><div class="score-label">Score</div><div class="score-val" id="score">0</div></div>
      <div class="score-box"><div class="score-label">Best</div><div class="score-val" id="best">0</div></div>
    </div>
  </div>
  <div class="controls">
    <div class="intro">Join numbers to get <b>2048!</b></div>
    <button class="btn" id="new-btn">New Game</button>
  </div>
  <div class="grid-container" id="grid">
    <div class="overlay" id="game-over">
      <h2 id="over-text">Game Over!</h2>
      <button class="btn" id="retry-btn">Try Again</button>
    </div>
  </div>

  <script>
    let grid = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];
    let score = 0;
    let best = parseInt(localStorage.getItem('2048_best') || '0');
    document.getElementById('best').innerText = best;

    const gridEl = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const overEl = document.getElementById('game-over');
    const overText = document.getElementById('over-text');

    function init() {
      grid = Array(4).fill(0).map(() => Array(4).fill(0));
      score = 0;
      scoreEl.innerText = score;
      overEl.classList.remove('active');
      addTile();
      addTile();
      render();
    }

    function addTile() {
      const empty = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) empty.push({ r, c });
        }
      }
      if (empty.length > 0) {
        const spot = empty[Math.floor(Math.random() * empty.length)];
        grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    function render() {
      // Clear cells except overlay
      const cells = gridEl.querySelectorAll('.cell');
      cells.forEach(c => c.remove());

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = grid[r][c];
          const div = document.createElement('div');
          div.className = 'cell ' + (val > 0 ? 'c' + (val <= 2048 ? val : 2048) : '');
          div.innerText = val > 0 ? val : '';
          gridEl.appendChild(div);
        }
      }
    }

    function slide(row) {
      let arr = row.filter(val => val);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(val => val);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    function moveLeft() {
      let moved = false;
      for (let r = 0; r < 4; r++) {
        const oldRow = [...grid[r]];
        const newRow = slide(grid[r]);
        grid[r] = newRow;
        if (oldRow.some((val, idx) => val !== newRow[idx])) moved = true;
      }
      return moved;
    }

    function rotate() {
      const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          newGrid[c][3 - r] = grid[r][c];
        }
      }
      grid = newGrid;
    }

    function handleMove(dir) {
      let moved = false;
      if (dir === 'left') moved = moveLeft();
      if (dir === 'down') { rotate(); moved = moveLeft(); rotate(); rotate(); rotate(); }
      if (dir === 'right') { rotate(); rotate(); moved = moveLeft(); rotate(); rotate(); }
      if (dir === 'up') { rotate(); rotate(); rotate(); moved = moveLeft(); rotate(); }

      if (moved) {
        addTile();
        render();
        scoreEl.innerText = score;
        if (score > best) {
          best = score;
          bestEl.innerText = best;
          localStorage.setItem('2048_best', best);
        }
        checkGameOver();
      }
    }

    function checkGameOver() {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 2048) {
            overText.innerText = 'You Win!';
            overEl.classList.add('active');
            return;
          }
          if (grid[r][c] === 0) return;
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return;
        }
      }
      overText.innerText = 'Game Over!';
      overEl.classList.add('active');
    }

    window.addEventListener('keydown', e => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); handleMove('up'); }
      if (['ArrowDown', 'KeyS'].includes(e.code)) { e.preventDefault(); handleMove('down'); }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) { e.preventDefault(); handleMove('left'); }
      if (['ArrowRight', 'KeyD'].includes(e.code)) { e.preventDefault(); handleMove('right'); }
    });

    // Touch Swipe
    let touchStartX = 0, touchStartY = 0;
    gridEl.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    gridEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
          handleMove(dx > 0 ? 'right' : 'left');
        } else {
          handleMove(dy > 0 ? 'down' : 'up');
        }
      }
    }, { passive: true });

    document.getElementById('new-btn').onclick = init;
    document.getElementById('retry-btn').onclick = init;
    init();
  </script>
</body>
</html>`,

  "snake": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Classic Snake</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: monospace, system-ui;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }
    .hud {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 440px;
      margin-bottom: 8px;
      font-size: 16px;
      background: #1e293b;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .val { color: #22c55e; font-weight: bold; }
    canvas {
      background: #020617;
      border: 2px solid #22c55e;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
      max-width: 100%;
      touch-action: none;
    }
    .controls {
      display: grid;
      grid-template-columns: repeat(3, 50px);
      gap: 6px;
      margin-top: 12px;
    }
    .btn-dir {
      background: #334155;
      color: white;
      border: 1px solid #475569;
      border-radius: 6px;
      height: 44px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-dir:active { background: #22c55e; color: black; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="score" class="val">0</span></div>
    <div>HIGH: <span id="high" class="val">0</span></div>
    <div>SPEED: <span id="speed" class="val">1</span></div>
  </div>
  <canvas id="game" width="400" height="400"></canvas>
  <div class="controls">
    <div></div><button class="btn-dir" id="btn-u">▲</button><div></div>
    <button class="btn-dir" id="btn-l">◀</button><button class="btn-dir" id="btn-d">▼</button><button class="btn-dir" id="btn-r">▶</button>
  </div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');
    const speedEl = document.getElementById('speed');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 1, dy = 0;
    let nextDx = 1, nextDy = 0;
    let score = 0;
    let high = parseInt(localStorage.getItem('snake_high') || '0');
    highEl.innerText = high;
    let gameOver = false;
    let gameLoop;
    let speedMs = 110;

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // ensure not on snake
      for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
          placeFood();
          break;
        }
      }
    }

    function reset() {
      snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
      dx = 1; dy = 0;
      nextDx = 1; nextDy = 0;
      score = 0;
      scoreEl.innerText = score;
      speedMs = 110;
      speedEl.innerText = '1';
      gameOver = false;
      placeFood();
      clearInterval(gameLoop);
      gameLoop = setInterval(update, speedMs);
    }

    function update() {
      dx = nextDx;
      dy = nextDy;

      const head = {x: snake[0].x + dx, y: snake[0].y + dy};

      // Wrap-around walls or wall collision
      if (head.x < 0) head.x = tileCount - 1;
      if (head.x >= tileCount) head.x = 0;
      if (head.y < 0) head.y = tileCount - 1;
      if (head.y >= tileCount) head.y = 0;

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          gameOver = true;
          clearInterval(gameLoop);
          draw();
          return;
        }
      }

      snake.unshift(head);

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        if (score > high) {
          high = score;
          highEl.innerText = high;
          localStorage.setItem('snake_high', high);
        }
        if (score % 50 === 0 && speedMs > 50) {
          speedMs -= 8;
          speedEl.innerText = Math.round(110 / speedMs);
          clearInterval(gameLoop);
          gameLoop = setInterval(update, speedMs);
        }
        placeFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      // Clear
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px monospace';
        ctx.fillText('Press SPACE or TAP to Restart', canvas.width / 2, canvas.height / 2 + 25);
      }
    }

    function setDirection(x, y) {
      if (gameOver) { reset(); return; }
      if (x !== 0 && dx !== 0) return;
      if (y !== 0 && dy !== 0) return;
      nextDx = x;
      nextDy = y;
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); setDirection(0, -1); }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); setDirection(0, 1); }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); setDirection(-1, 0); }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); setDirection(1, 0); }
      if (e.code === 'Space' && gameOver) { reset(); }
    });

    document.getElementById('btn-u').onclick = () => setDirection(0, -1);
    document.getElementById('btn-d').onclick = () => setDirection(0, 1);
    document.getElementById('btn-l').onclick = () => setDirection(-1, 0);
    document.getElementById('btn-r').onclick = () => setDirection(1, 0);
    canvas.onclick = () => { if (gameOver) reset(); };

    reset();
  </script>
</body>
</html>`,

  "tetris": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Retro Tetris</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #090d16;
      color: #e2e8f0;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }
    .wrapper {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background: #131b2e;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #1e293b;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    canvas#tetris {
      background: #020617;
      border: 2px solid #38bdf8;
      border-radius: 6px;
    }
    .side {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 120px;
    }
    .box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 8px;
      text-align: center;
    }
    .box-title { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 4px; }
    .box-val { font-size: 18px; font-weight: bold; color: #38bdf8; }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn:hover { background: #3b82f6; }
    .mobile-controls {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .m-btn {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 18px;
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <canvas id="tetris" width="240" height="400"></canvas>
    <div class="side">
      <div class="box">
        <div class="box-title">Score</div>
        <div class="box-val" id="score">0</div>
      </div>
      <div class="box">
        <div class="box-title">Lines</div>
        <div class="box-val" id="lines">0</div>
      </div>
      <div class="box">
        <div class="box-title">Level</div>
        <div class="box-val" id="level">1</div>
      </div>
      <div class="box">
        <div class="box-title">Next</div>
        <canvas id="next" width="80" height="80"></canvas>
      </div>
      <button class="btn" id="restart">Restart</button>
    </div>
  </div>
  <div class="mobile-controls">
    <button class="m-btn" id="m-left">◀</button>
    <button class="m-btn" id="m-rot">↻</button>
    <button class="m-btn" id="m-right">▶</button>
    <button class="m-btn" id="m-down">▼</button>
    <button class="m-btn" id="m-drop">⤓</button>
  </div>

  <script>
    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next');
    const nextCtx = nextCanvas.getContext('2d');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 24;

    const COLORS = [
      null,
      '#ef4444', // Z (Red)
      '#22c55e', // S (Green)
      '#3b82f6', // J (Blue)
      '#f97316', // L (Orange)
      '#eab308', // O (Yellow)
      '#06b6d4', // I (Cyan)
      '#a855f7'  // T (Purple)
    ];

    const PIECES = [
      [],
      [[1,1,0],[0,1,1],[0,0,0]], // Z
      [[0,2,2],[2,2,0],[0,0,0]], // S
      [[3,0,0],[3,3,3],[0,0,0]], // J
      [[0,0,4],[4,4,4],[0,0,0]], // L
      [[5,5],[5,5]],             // O
      [[0,0,0,0],[6,6,6,6],[0,0,0,0],[0,0,0,0]], // I
      [[0,7,0],[7,7,7],[0,0,0]]  // T
    ];

    let arena = createMatrix(COLS, ROWS);
    let player = { pos: {x: 0, y: 0}, matrix: null, score: 0, lines: 0, level: 1 };
    let nextMatrix = null;
    let dropCounter = 0;
    let dropInterval = 800;
    let lastTime = 0;
    let isGameOver = false;

    function createMatrix(w, h) {
      const matrix = [];
      while (h--) matrix.push(new Array(w).fill(0));
      return matrix;
    }

    function collide(arena, player) {
      const [m, o] = [player.matrix, player.pos];
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 &&
             (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            arena[y + player.pos.y][x + player.pos.x] = value;
          }
        });
      });
    }

    function rotate(matrix, dir) {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      if (dir > 0) matrix.forEach(row => row.reverse());
      else matrix.reverse();
    }

    function playerRotate(dir) {
      const pos = player.pos.x;
      let offset = 1;
      rotate(player.matrix, dir);
      while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
          rotate(player.matrix, -dir);
          player.pos.x = pos;
          return;
        }
      }
    }

    function getRandomPiece() {
      const id = Math.floor(Math.random() * 7) + 1;
      return PIECES[id].map(row => [...row]);
    }

    function playerReset() {
      if (!nextMatrix) nextMatrix = getRandomPiece();
      player.matrix = nextMatrix;
      nextMatrix = getRandomPiece();
      player.pos.y = 0;
      player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
      drawNext();

      if (collide(arena, player)) {
        isGameOver = true;
      }
    }

    function arenaSweep() {
      let rowCount = 0;
      outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        rowCount++;
      }
      if (rowCount > 0) {
        const points = [0, 40, 100, 300, 1200];
        player.score += (points[rowCount] || 1200) * player.level;
        player.lines += rowCount;
        player.level = Math.floor(player.lines / 10) + 1;
        dropInterval = Math.max(100, 800 - (player.level - 1) * 70);
        updateScore();
      }
    }

    function playerDrop() {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
      }
      dropCounter = 0;
    }

    function playerHardDrop() {
      while (!collide(arena, player)) {
        player.pos.y++;
      }
      player.pos.y--;
      merge(arena, player);
      playerReset();
      arenaSweep();
      dropCounter = 0;
    }

    function playerMove(offset) {
      player.pos.x += offset;
      if (collide(arena, player)) {
        player.pos.x -= offset;
      }
    }

    function drawMatrix(matrix, offset, context) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            context.fillStyle = COLORS[value];
            context.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            context.strokeStyle = 'rgba(255,255,255,0.3)';
            context.strokeRect((x + offset.x) * BLOCK_SIZE + 2, (y + offset.y) * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
          }
        });
      });
    }

    function drawNext() {
      nextCtx.fillStyle = '#0f172a';
      nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
      if (nextMatrix) {
        const offX = (nextCanvas.width / BLOCK_SIZE - nextMatrix[0].length) / 2;
        const offY = (nextCanvas.height / BLOCK_SIZE - nextMatrix.length) / 2;
        drawMatrix(nextMatrix, {x: offX, y: offY}, nextCtx);
      }
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawMatrix(arena, {x: 0, y: 0}, ctx);
      if (!isGameOver) {
        drawMatrix(player.matrix, player.pos, ctx);
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      }
    }

    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (!isGameOver) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
          playerDrop();
        }
      }

      draw();
      requestAnimationFrame(update);
    }

    function updateScore() {
      document.getElementById('score').innerText = player.score;
      document.getElementById('lines').innerText = player.lines;
      document.getElementById('level').innerText = player.level;
    }

    function reset() {
      arena = createMatrix(COLS, ROWS);
      player.score = 0;
      player.lines = 0;
      player.level = 1;
      dropInterval = 800;
      isGameOver = false;
      nextMatrix = null;
      updateScore();
      playerReset();
    }

    window.addEventListener('keydown', event => {
      if (['ArrowLeft', 'KeyA'].includes(event.code)) { event.preventDefault(); playerMove(-1); }
      if (['ArrowRight', 'KeyD'].includes(event.code)) { event.preventDefault(); playerMove(1); }
      if (['ArrowDown', 'KeyS'].includes(event.code)) { event.preventDefault(); playerDrop(); }
      if (['ArrowUp', 'KeyW'].includes(event.code)) { event.preventDefault(); playerRotate(1); }
      if (event.code === 'Space') { event.preventDefault(); playerHardDrop(); }
    });

    document.getElementById('m-left').onclick = () => playerMove(-1);
    document.getElementById('m-right').onclick = () => playerMove(1);
    document.getElementById('m-rot').onclick = () => playerRotate(1);
    document.getElementById('m-down').onclick = () => playerDrop();
    document.getElementById('m-drop').onclick = () => playerHardDrop();
    document.getElementById('restart').onclick = reset;

    reset();
    update();
  </script>
</body>
</html>`,

  "flappy": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Flappy Bird</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
    }
    canvas {
      background: #70c5ce;
      border: 3px solid #334155;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      cursor: pointer;
      max-width: 100%;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="360" height="520"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let frames = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('flappy_high') || '0');
    let gameState = 'START'; // START, PLAY, OVER

    const bird = {
      x: 60,
      y: 150,
      w: 30,
      h: 24,
      radius: 12,
      velocity: 0,
      gravity: 0.28,
      jump: 4.8,
      rotation: 0,
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (this.velocity * 4 * Math.PI) / 180));
        ctx.rotate(this.rotation);
        // Bird body
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(5, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(6, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        // Beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(8, -1);
        ctx.lineTo(16, 2);
        ctx.lineTo(8, 5);
        ctx.fill();
        // Wing
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(-4, 2, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
      update() {
        if (gameState === 'PLAY') {
          this.velocity += this.gravity;
          this.y += this.velocity;
          if (this.y + this.radius >= canvas.height - 70) {
            this.y = canvas.height - 70 - this.radius;
            gameOver();
          }
        }
      },
      flap() {
        this.velocity = -this.jump;
      }
    };

    const pipes = {
      items: [],
      gap: 120,
      w: 52,
      dx: 2,
      draw() {
        for (let p of this.items) {
          // Top pipe
          ctx.fillStyle = '#22c55e';
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 3;
          ctx.fillRect(p.x, 0, this.w, p.top);
          ctx.strokeRect(p.x, 0, this.w, p.top);
          // Top lip
          ctx.fillRect(p.x - 3, p.top - 18, this.w + 6, 18);
          ctx.strokeRect(p.x - 3, p.top - 18, this.w + 6, 18);

          // Bottom pipe
          const bY = p.top + this.gap;
          const bH = canvas.height - 70 - bY;
          ctx.fillRect(p.x, bY, this.w, bH);
          ctx.strokeRect(p.x, bY, this.w, bH);
          // Bottom lip
          ctx.fillRect(p.x - 3, bY, this.w + 6, 18);
          ctx.strokeRect(p.x - 3, bY, this.w + 6, 18);
        }
      },
      update() {
        if (gameState !== 'PLAY') return;
        if (frames % 100 === 0) {
          const top = Math.floor(Math.random() * (canvas.height - 70 - this.gap - 80)) + 40;
          this.items.push({ x: canvas.width, top: top, passed: false });
        }
        for (let i = 0; i < this.items.length; i++) {
          const p = this.items[i];
          p.x -= this.dx;

          // Collision
          if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w) {
            if (bird.y - bird.radius < p.top || bird.y + bird.radius > p.top + this.gap) {
              gameOver();
            }
          }

          // Score
          if (!p.passed && p.x + this.w < bird.x) {
            score++;
            p.passed = true;
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('flappy_high', highScore);
            }
          }

          if (p.x + this.w < 0) {
            this.items.splice(i, 1);
            i--;
          }
        }
      },
      reset() {
        this.items = [];
      }
    };

    function gameOver() {
      gameState = 'OVER';
    }

    function reset() {
      bird.y = 180;
      bird.velocity = 0;
      score = 0;
      pipes.reset();
      gameState = 'START';
    }

    function handleClick() {
      if (gameState === 'START') {
        gameState = 'PLAY';
        bird.flap();
      } else if (gameState === 'PLAY') {
        bird.flap();
      } else if (gameState === 'OVER') {
        reset();
      }
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleClick();
      }
    });
    canvas.addEventListener('pointerdown', handleClick);

    function loop() {
      frames++;
      // Background Sky
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds & City
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(80, 100, 30, 0, Math.PI * 2);
      ctx.arc(110, 90, 40, 0, Math.PI * 2);
      ctx.arc(140, 100, 30, 0, Math.PI * 2);
      ctx.fill();

      // Pipes
      pipes.update();
      pipes.draw();

      // Ground
      ctx.fillStyle = '#ded895';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
      ctx.fillStyle = '#73bf2e';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 14);

      // Bird
      bird.update();
      bird.draw();

      // UI
      if (gameState === 'PLAY') {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText(score, canvas.width / 2, 60);
        ctx.fillText(score, canvas.width / 2, 60);
      } else if (gameState === 'START') {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.font = 'bold 26px system-ui';
        ctx.textAlign = 'center';
        ctx.strokeText('TAP OR SPACE TO FLAP', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('TAP OR SPACE TO FLAP', canvas.width / 2, canvas.height / 2 - 20);
      } else if (gameState === 'OVER') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 32px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 200);

        ctx.fillStyle = 'white';
        ctx.font = '20px system-ui';
        ctx.fillText('Score: ' + score, canvas.width / 2, 245);
        ctx.fillText('Best: ' + highScore, canvas.width / 2, 275);

        ctx.fillStyle = '#fde047';
        ctx.font = '16px system-ui';
        ctx.fillText('Tap or press Space to play again', canvas.width / 2, 330);
      }

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`,

  "breakout": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Breakout</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }
    .hud {
      width: 100%;
      max-width: 480px;
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    canvas {
      background: #090d16;
      border: 2px solid #38bdf8;
      border-radius: 8px;
      cursor: none;
      max-width: 100%;
      touch-action: none;
    }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="score" style="color: #38bdf8;">0</span></div>
    <div>LIVES: <span id="lives" style="color: #ef4444;">♥♥♥</span></div>
  </div>
  <canvas id="game" width="480" height="480"></canvas>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');

    let score = 0;
    let lives = 3;
    let gameOver = false;
    let gameWon = false;

    const paddle = {
      w: 80,
      h: 12,
      x: canvas.width / 2 - 40,
      y: canvas.height - 24,
      speed: 7,
      dx: 0
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height - 40,
      r: 6,
      speed: 4.5,
      dx: 3.5,
      dy: -3.5
    };

    const brickRowCount = 5;
    const brickColumnCount = 7;
    const brickWidth = 56;
    const brickHeight = 18;
    const brickPadding = 8;
    const brickOffsetTop = 40;
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2;

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    let bricks = [];

    function initBricks() {
      bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1, color: COLORS[r] };
        }
      }
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 50;
      ball.dx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = -3.5;
      paddle.x = canvas.width / 2 - paddle.w / 2;
    }

    function collisionDetection() {
      let activeCount = 0;
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            activeCount++;
            if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
              ball.dy = -ball.dy;
              b.status = 0;
              score += 10;
              scoreEl.innerText = score;
            }
          }
        }
      }
      if (activeCount === 0) {
        gameWon = true;
      }
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = bricks[c][r].color;
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
      }
    }

    function draw() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBricks();

      // Ball
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Paddle
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 30);
        return;
      }

      if (gameWon) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WON!', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.fillText('Click to Play Again', canvas.width / 2, canvas.height / 2 + 30);
        return;
      }

      collisionDetection();

      // Wall reflection
      if (ball.x + ball.dx > canvas.width - ball.r || ball.x + ball.dx < ball.r) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.r) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.dy > paddle.y - ball.r && ball.y + ball.dy < paddle.y + paddle.h) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          // Add angle variation based on hit point
          const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          ball.dx = hit * 4.5;
          ball.dy = -Math.abs(ball.dy);
        }
      } else if (ball.y + ball.dy > canvas.height - ball.r) {
        lives--;
        livesEl.innerText = '♥'.repeat(Math.max(0, lives));
        if (lives <= 0) {
          gameOver = true;
        } else {
          resetBall();
        }
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      requestAnimationFrame(draw);
    }

    function resetGame() {
      score = 0;
      lives = 3;
      gameOver = false;
      gameWon = false;
      scoreEl.innerText = score;
      livesEl.innerText = '♥♥♥';
      initBricks();
      resetBall();
      draw();
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = e.clientX - rect.left - (paddle.w / 2);
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mouseX));
    });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left - (paddle.w / 2);
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, touchX));
    }, { passive: false });

    canvas.addEventListener('click', () => {
      if (gameOver || gameWon) resetGame();
    });

    initBricks();
    draw();
  </script>
</body>
</html>`,

  "pong": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Pong Classic</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000;
      color: #fff;
      font-family: monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    canvas {
      border: 3px solid #fff;
      background: #000;
      max-width: 100%;
      touch-action: none;
    }
  </style>
</head>
<body>
  <canvas id="pong" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');

    const user = { x: 10, y: 150, w: 10, h: 80, score: 0 };
    const cpu = { x: canvas.width - 20, y: 150, w: 10, h: 80, score: 0 };
    const ball = { x: canvas.width/2, y: canvas.height/2, r: 7, speed: 6, dx: 5, dy: 5 };

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 6;
      ball.dx = -ball.dx;
    }

    function update() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Simple CPU AI
      cpu.y += ((ball.y - (cpu.y + cpu.h/2))) * 0.08;

      // Top & bottom wall
      if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
        ball.dy = -ball.dy;
      }

      // Check paddle hit
      let player = (ball.x < canvas.width/2) ? user : cpu;
      if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.h/2);
        collidePoint = collidePoint / (player.h/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += 0.2;
      }

      // Points
      if (ball.x - ball.r < 0) {
        cpu.score++;
        resetBall();
      } else if (ball.x + ball.r > canvas.width) {
        user.score++;
        resetBall();
      }
    }

    function collision(b, p) {
      return b.x + b.r > p.x && b.x - b.r < p.x + p.w && b.y + b.r > p.y && b.y - b.r < p.y + p.h;
    }

    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Net
      ctx.strokeStyle = '#fff';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scores
      ctx.fillStyle = '#fff';
      ctx.font = '40px monospace';
      ctx.fillText(user.score, canvas.width/4, 60);
      ctx.fillText(cpu.score, 3*canvas.width/4, 60);

      // Paddles
      ctx.fillRect(user.x, user.y, user.w, user.h);
      ctx.fillRect(cpu.x, cpu.y, cpu.w, cpu.h);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
      ctx.fill();
    }

    canvas.addEventListener('mousemove', e => {
      let rect = canvas.getBoundingClientRect();
      user.y = e.clientY - rect.top - user.h/2;
    });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      let rect = canvas.getBoundingClientRect();
      user.y = e.touches[0].clientY - rect.top - user.h/2;
    }, { passive: false });

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`,

  "dino": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>T-Rex Dino Runner</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #f7f7f7;
      color: #535353;
      font-family: monospace, system-ui;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    canvas {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      max-width: 100%;
      cursor: pointer;
    }
    .hud { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="hud">HI <span id="high">00000</span> <span id="score">00000</span></div>
  <canvas id="dino" width="600" height="200"></canvas>
  <script>
    const canvas = document.getElementById('dino');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');

    let score = 0;
    let high = parseInt(localStorage.getItem('dino_high') || '0');
    highEl.innerText = String(high).padStart(5, '0');

    let isPlaying = false;
    let isGameOver = false;
    let speed = 6;
    let obstacles = [];

    const dino = {
      x: 50,
      y: 140,
      w: 24,
      h: 30,
      vy: 0,
      gravity: 0.6,
      jump: 11,
      isGrounded: true
    };

    function reset() {
      score = 0;
      speed = 6;
      obstacles = [];
      dino.y = 140;
      dino.vy = 0;
      dino.isGrounded = true;
      isGameOver = false;
      isPlaying = true;
    }

    function jump() {
      if (isGameOver) {
        reset();
        return;
      }
      if (!isPlaying) isPlaying = true;
      if (dino.isGrounded) {
        dino.vy = -dino.jump;
        dino.isGrounded = false;
      }
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    });
    canvas.addEventListener('pointerdown', jump);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground line
      ctx.strokeStyle = '#535353';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 170);
      ctx.lineTo(canvas.width, 170);
      ctx.stroke();

      if (isPlaying && !isGameOver) {
        score++;
        scoreEl.innerText = String(Math.floor(score / 5)).padStart(5, '0');
        if (score > high * 5) {
          high = Math.floor(score / 5);
          highEl.innerText = String(high).padStart(5, '0');
          localStorage.setItem('dino_high', high);
        }

        if (score % 600 === 0) speed += 0.5;

        // Dino Physics
        dino.vy += dino.gravity;
        dino.y += dino.vy;
        if (dino.y >= 140) {
          dino.y = 140;
          dino.vy = 0;
          dino.isGrounded = true;
        }

        // Spawn obstacles
        if (Math.random() < 0.015 && obstacles.length < 3) {
          const lastX = obstacles.length ? obstacles[obstacles.length - 1].x : 0;
          if (canvas.width - lastX > 200) {
            obstacles.push({
              x: canvas.width,
              y: 140,
              w: 16,
              h: 30
            });
          }
        }

        // Obstacles loop
        for (let i = 0; i < obstacles.length; i++) {
          const obs = obstacles[i];
          obs.x -= speed;

          // Collision
          if (dino.x < obs.x + obs.w && dino.x + dino.w > obs.x &&
              dino.y < obs.y + obs.h && dino.y + dino.h > obs.y) {
            isGameOver = true;
          }

          if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1);
            i--;
          }
        }
      }

      // Draw Dino
      ctx.fillStyle = '#535353';
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      ctx.fillStyle = '#fff';
      ctx.fillRect(dino.x + 16, dino.y + 4, 3, 3); // eye

      // Draw Obstacles (Cacti)
      ctx.fillStyle = '#535353';
      for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillRect(obs.x - 4, obs.y + 8, 4, 10);
        ctx.fillRect(obs.x + obs.w, obs.y + 12, 4, 10);
      }

      if (isGameOver) {
        ctx.fillStyle = '#535353';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('G A M E   O V E R', canvas.width / 2, 80);
        ctx.font = '14px monospace';
        ctx.fillText('Press SPACE or TAP to Restart', canvas.width / 2, 110);
      } else if (!isPlaying) {
        ctx.fillStyle = '#535353';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or TAP to Run', canvas.width / 2, 90);
      }

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`,

  "cookie": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Cookie Clicker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #1e1b18;
      color: #fef08a;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: row;
      min-height: 100vh;
      overflow: hidden;
    }
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-right: 2px solid #3f3f46;
    }
    .cookie {
      width: 170px;
      height: 170px;
      background: radial-gradient(circle, #b45309 0%, #78350f 100%);
      border-radius: 50%;
      border: 6px solid #451a03;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4);
      cursor: pointer;
      position: relative;
      transition: transform 0.05s ease;
    }
    .cookie:active { transform: scale(0.92); }
    .chip {
      position: absolute;
      width: 14px;
      height: 14px;
      background: #271202;
      border-radius: 50%;
    }
    .stats { text-align: center; margin-bottom: 20px; }
    .big-num { font-size: 32px; font-weight: bold; color: #fff; }
    .cps { font-size: 14px; color: #cbd5e1; }
    .right {
      width: 260px;
      background: #18181b;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .upgrade-btn {
      background: #27272a;
      border: 1px solid #3f3f46;
      padding: 10px;
      border-radius: 8px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
    }
    .upgrade-btn:hover:not(:disabled) { background: #3f3f46; border-color: #eab308; }
    .upgrade-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .cost { color: #facc15; font-weight: bold; }
  </style>
</head>
<body>
  <div class="left">
    <div class="stats">
      <div class="big-num" id="cookies">0</div>
      <div class="cps"><span id="cps">0</span> cookies / sec</div>
    </div>
    <div class="cookie" id="cookie-btn">
      <div class="chip" style="top:30px; left:40px;"></div>
      <div class="chip" style="top:70px; left:80px;"></div>
      <div class="chip" style="top:40px; left:110px;"></div>
      <div class="chip" style="top:110px; left:45px;"></div>
      <div class="chip" style="top:115px; left:105px;"></div>
    </div>
  </div>
  <div class="right">
    <h3 style="color:#facc15; font-size:16px; margin-bottom:6px;">Store / Buildings</h3>
    <button class="upgrade-btn" id="b-cursor">
      <div><b>Auto-Clicker</b><br><small>+0.5 cps (owned: <span id="c-cursor">0</span>)</small></div>
      <div class="cost" id="cost-cursor">15</div>
    </button>
    <button class="upgrade-btn" id="b-grandma">
      <div><b>Grandma</b><br><small>+4 cps (owned: <span id="c-grandma">0</span>)</small></div>
      <div class="cost" id="cost-grandma">100</div>
    </button>
    <button class="upgrade-btn" id="b-farm">
      <div><b>Cookie Farm</b><br><small>+16 cps (owned: <span id="c-farm">0</span>)</small></div>
      <div class="cost" id="cost-farm">500</div>
    </button>
    <button class="upgrade-btn" id="b-factory">
      <div><b>Factory</b><br><small>+64 cps (owned: <span id="c-factory">0</span>)</small></div>
      <div class="cost" id="cost-factory">2000</div>
    </button>
    <button class="upgrade-btn" id="b-mine">
      <div><b>Cookie Mine</b><br><small>+250 cps (owned: <span id="c-mine">0</span>)</small></div>
      <div class="cost" id="cost-mine">10000</div>
    </button>
  </div>

  <script>
    let cookies = parseFloat(localStorage.getItem('cc_cookies') || '0');
    let items = {
      cursor: { count: parseInt(localStorage.getItem('cc_cursor') || '0'), cost: 15, cps: 0.5 },
      grandma: { count: parseInt(localStorage.getItem('cc_grandma') || '0'), cost: 100, cps: 4 },
      farm: { count: parseInt(localStorage.getItem('cc_farm') || '0'), cost: 500, cps: 16 },
      factory: { count: parseInt(localStorage.getItem('cc_factory') || '0'), cost: 2000, cps: 64 },
      mine: { count: parseInt(localStorage.getItem('cc_mine') || '0'), cost: 10000, cps: 250 }
    };

    function calcCps() {
      let total = 0;
      for (let k in items) total += items[k].count * items[k].cps;
      return total;
    }

    function updateUI() {
      document.getElementById('cookies').innerText = Math.floor(cookies).toLocaleString();
      document.getElementById('cps').innerText = calcCps().toFixed(1);

      for (let k in items) {
        const item = items[k];
        const currentCost = Math.floor(item.cost * Math.pow(1.15, item.count));
        document.getElementById('cost-' + k).innerText = currentCost.toLocaleString();
        document.getElementById('c-' + k).innerText = item.count;
        document.getElementById('b-' + k).disabled = cookies < currentCost;
      }
    }

    document.getElementById('cookie-btn').addEventListener('click', () => {
      cookies += 1;
      updateUI();
    });

    function buy(k) {
      const item = items[k];
      const currentCost = Math.floor(item.cost * Math.pow(1.15, item.count));
      if (cookies >= currentCost) {
        cookies -= currentCost;
        item.count++;
        localStorage.setItem('cc_' + k, item.count);
        updateUI();
      }
    }

    for (let k in items) {
      document.getElementById('b-' + k).onclick = () => buy(k);
    }

    setInterval(() => {
      cookies += calcCps() / 10;
      localStorage.setItem('cc_cookies', cookies);
      updateUI();
    }, 100);

    updateUI();
  </script>
</body>
</html>`,

  "tic_tac_toe": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tic Tac Toe</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .hud {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .score-badge {
      background: #1e293b;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      border: 1px solid #334155;
    }
    .status { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #38bdf8; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 90px);
      grid-gap: 8px;
      background: #334155;
      padding: 8px;
      border-radius: 12px;
    }
    .cell {
      width: 90px;
      height: 90px;
      background: #1e293b;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.1s;
    }
    .cell:hover { background: #273549; }
    .cell.x { color: #38bdf8; }
    .cell.o { color: #f43f5e; }
    .controls { margin-top: 20px; display: flex; gap: 10px; }
    .btn {
      background: #38bdf8;
      color: #0f172a;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="hud">
    <div class="score-badge">You (X): <span id="s-x">0</span></div>
    <div class="score-badge">CPU (O): <span id="s-o">0</span></div>
    <div class="score-badge">Ties: <span id="s-t">0</span></div>
  </div>
  <div class="status" id="status">Your Turn (X)</div>
  <div class="grid" id="grid">
    <div class="cell" data-i="0"></div><div class="cell" data-i="1"></div><div class="cell" data-i="2"></div>
    <div class="cell" data-i="3"></div><div class="cell" data-i="4"></div><div class="cell" data-i="5"></div>
    <div class="cell" data-i="6"></div><div class="cell" data-i="7"></div><div class="cell" data-i="8"></div>
  </div>
  <div class="controls">
    <button class="btn" id="reset">Next Round</button>
  </div>
  <script>
    let board = Array(9).fill('');
    let scores = { x: 0, o: 0, t: 0 };
    let gameActive = true;
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function checkWin(b, player) {
      return wins.some(comb => comb.every(i => b[i] === player));
    }

    function checkTie(b) {
      return b.every(cell => cell !== '');
    }

    function cpuMove() {
      // 1. Try to win
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          if (checkWin(board, 'O')) return i;
          board[i] = '';
        }
      }
      // 2. Block user
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          if (checkWin(board, 'X')) { board[i] = ''; return i; }
          board[i] = '';
        }
      }
      // 3. Center
      if (!board[4]) return 4;
      // 4. Random available
      const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
      return empty[Math.floor(Math.random() * empty.length)];
    }

    function render() {
      document.querySelectorAll('.cell').forEach((c, i) => {
        c.innerText = board[i];
        c.className = 'cell ' + (board[i] === 'X' ? 'x' : board[i] === 'O' ? 'o' : '');
      });
      document.getElementById('s-x').innerText = scores.x;
      document.getElementById('s-o').innerText = scores.o;
      document.getElementById('s-t').innerText = scores.t;
    }

    document.querySelectorAll('.cell').forEach(cell => {
      cell.onclick = () => {
        const i = parseInt(cell.dataset.i);
        if (!board[i] && gameActive) {
          board[i] = 'X';
          render();
          if (checkWin(board, 'X')) {
            scores.x++;
            document.getElementById('status').innerText = 'You Win! 🎉';
            gameActive = false;
            render();
            return;
          }
          if (checkTie(board)) {
            scores.t++;
            document.getElementById('status').innerText = 'Tie Game!';
            gameActive = false;
            render();
            return;
          }

          document.getElementById('status').innerText = 'CPU Thinking...';
          setTimeout(() => {
            const cpu = cpuMove();
            if (cpu !== undefined) {
              board[cpu] = 'O';
              render();
              if (checkWin(board, 'O')) {
                scores.o++;
                document.getElementById('status').innerText = 'CPU Wins!';
                gameActive = false;
                render();
                return;
              }
              if (checkTie(board)) {
                scores.t++;
                document.getElementById('status').innerText = 'Tie Game!';
                gameActive = false;
                render();
                return;
              }
              document.getElementById('status').innerText = 'Your Turn (X)';
            }
          }, 250);
        }
      };
    });

    document.getElementById('reset').onclick = () => {
      board = Array(9).fill('');
      gameActive = true;
      document.getElementById('status').innerText = 'Your Turn (X)';
      render();
    };

    render();
  </script>
</body>
</html>`,

  "minesweeper": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Minesweeper</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #0f172a;
      color: #e2e8f0;
      font-family: monospace, system-ui;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }
    .panel {
      background: #1e293b;
      border: 3px solid #475569;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background: #0f172a;
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      border: 2px solid #334155;
    }
    .digital { font-size: 22px; font-weight: bold; color: #ef4444; background: #000; padding: 4px 8px; border-radius: 4px; }
    .face-btn { font-size: 24px; background: none; border: none; cursor: pointer; }
    .board {
      display: grid;
      grid-template-columns: repeat(9, 32px);
      gap: 2px;
      background: #334155;
      padding: 4px;
      border-radius: 6px;
    }
    .tile {
      width: 32px;
      height: 32px;
      background: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 2px;
    }
    .tile.revealed { background: #cbd5e1; color: #0f172a; cursor: default; }
    .tile.mine { background: #ef4444; }
    .c1 { color: #2563eb; }
    .c2 { color: #16a34a; }
    .c3 { color: #dc2626; }
    .c4 { color: #7c3aed; }
  </style>
</head>
<body>
  <div class="panel">
    <div class="header">
      <div class="digital" id="mine-count">010</div>
      <button class="face-btn" id="face">🙂</button>
      <div class="digital" id="timer">000</div>
    </div>
    <div class="board" id="board"></div>
  </div>

  <script>
    const ROWS = 9, COLS = 9, MINES = 10;
    let grid = [], revealedCount = 0, flags = 0, timer = 0, timerInterval = null, gameOver = false;

    function init() {
      clearInterval(timerInterval);
      timer = 0;
      document.getElementById('timer').innerText = '000';
      document.getElementById('mine-count').innerText = '010';
      document.getElementById('face').innerText = '🙂';
      gameOver = false;
      revealedCount = 0;
      flags = 0;
      grid = [];

      for (let r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (let c = 0; c < COLS; c++) {
          grid[r][c] = { mine: false, count: 0, revealed: false, flagged: false };
        }
      }

      // Plant mines
      let planted = 0;
      while (planted < MINES) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        if (!grid[r][c].mine) {
          grid[r][c].mine = true;
          planted++;
        }
      }

      // Counts
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!grid[r][c].mine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS && grid[r+dr][c+dc].mine) count++;
              }
            }
            grid[r][c].count = count;
          }
        }
      }

      render();
    }

    function render() {
      const board = document.getElementById('board');
      board.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tile = document.createElement('div');
          tile.className = 'tile';
          const cell = grid[r][c];

          if (cell.revealed) {
            tile.classList.add('revealed');
            if (cell.mine) {
              tile.classList.add('mine');
              tile.innerText = '💣';
            } else if (cell.count > 0) {
              tile.innerText = cell.count;
              tile.classList.add('c' + cell.count);
            }
          } else if (cell.flagged) {
            tile.innerText = '🚩';
          }

          tile.onclick = () => reveal(r, c);
          tile.oncontextmenu = e => { e.preventDefault(); toggleFlag(r, c); };
          board.appendChild(tile);
        }
      }
    }

    function reveal(r, c) {
      if (gameOver || grid[r][c].revealed || grid[r][c].flagged) return;

      if (!timerInterval) {
        timerInterval = setInterval(() => {
          timer++;
          document.getElementById('timer').innerText = String(timer).padStart(3, '0');
        }, 1000);
      }

      const cell = grid[r][c];
      cell.revealed = true;
      revealedCount++;

      if (cell.mine) {
        document.getElementById('face').innerText = '😵';
        gameOver = true;
        clearInterval(timerInterval);
        // reveal all mines
        grid.forEach(row => row.forEach(cl => { if (cl.mine) cl.revealed = true; }));
        render();
        return;
      }

      if (cell.count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS) reveal(r+dr, c+dc);
          }
        }
      }

      if (revealedCount === ROWS * COLS - MINES) {
        document.getElementById('face').innerText = '😎';
        gameOver = true;
        clearInterval(timerInterval);
      }

      render();
    }

    function toggleFlag(r, c) {
      if (gameOver || grid[r][c].revealed) return;
      grid[r][c].flagged = !grid[r][c].flagged;
      flags += grid[r][c].flagged ? 1 : -1;
      document.getElementById('mine-count').innerText = String(MINES - flags).padStart(3, '0');
      render();
    }

    document.getElementById('face').onclick = init;
    init();
  </script>
</body>
</html>`,

  "space_invaders": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Space Invaders</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #050505;
      color: #00ff66;
      font-family: monospace, system-ui;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }
    .hud {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 480px;
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: bold;
    }
    canvas {
      background: #000;
      border: 2px solid #00ff66;
      border-radius: 6px;
      box-shadow: 0 0 20px rgba(0,255,102,0.2);
      max-width: 100%;
      touch-action: none;
    }
    .mobile-controls {
      display: flex;
      gap: 12px;
      margin-top: 10px;
    }
    .btn {
      background: #112211;
      color: #00ff66;
      border: 1px solid #00ff66;
      padding: 12px 24px;
      font-size: 18px;
      border-radius: 6px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="score">0000</span></div>
    <div>LIVES: <span id="lives">▲▲▲</span></div>
  </div>
  <canvas id="game" width="480" height="480"></canvas>
  <div class="mobile-controls">
    <button class="btn" id="btn-left">◀</button>
    <button class="btn" id="btn-fire">FIRE</button>
    <button class="btn" id="btn-right">▶</button>
  </div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');

    let score = 0;
    let lives = 3;
    let gameOver = false;
    let gameWon = false;

    const player = {
      x: canvas.width / 2 - 15,
      y: canvas.height - 35,
      w: 30,
      h: 18,
      speed: 5
    };

    let bullets = [];
    let enemyBullets = [];
    let enemies = [];
    let enemyDir = 1;
    let enemySpeed = 1;
    let enemyDrop = false;

    function initEnemies() {
      enemies = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          enemies.push({
            x: 40 + c * 50,
            y: 40 + r * 35,
            w: 26,
            h: 20,
            type: r,
            alive: true
          });
        }
      }
    }

    let keys = {};
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function shoot() {
      if (gameOver || gameWon) { reset(); return; }
      if (bullets.length < 3) {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
      }
    }

    function reset() {
      score = 0;
      lives = 3;
      gameOver = false;
      gameWon = false;
      bullets = [];
      enemyBullets = [];
      player.x = canvas.width / 2 - 15;
      scoreEl.innerText = '0000';
      livesEl.innerText = '▲▲▲';
      initEnemies();
    }

    function update() {
      if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(10, player.x - player.speed);
      if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.w - 10, player.x + player.speed);

      // Player bullets
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 8;
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
          i--;
        }
      }

      // Enemy bullets
      for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += 4;
        // Collision with player
        if (enemyBullets[i].x > player.x && enemyBullets[i].x < player.x + player.w &&
            enemyBullets[i].y > player.y && enemyBullets[i].y < player.y + player.h) {
          lives--;
          livesEl.innerText = '▲'.repeat(Math.max(0, lives));
          enemyBullets.splice(i, 1);
          i--;
          if (lives <= 0) gameOver = true;
          continue;
        }
        if (enemyBullets[i] && enemyBullets[i].y > canvas.height) {
          enemyBullets.splice(i, 1);
          i--;
        }
      }

      // Enemy logic
      let hitEdge = false;
      let livingCount = 0;
      for (let e of enemies) {
        if (!e.alive) continue;
        livingCount++;
        e.x += enemyDir * enemySpeed;
        if (e.x + e.w > canvas.width - 10 || e.x < 10) hitEdge = true;
        if (e.y + e.h >= player.y) gameOver = true;

        // Random enemy fire
        if (Math.random() < 0.001) {
          enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, w: 3, h: 8 });
        }
      }

      if (livingCount === 0) gameWon = true;

      if (hitEdge) {
        enemyDir = -enemyDir;
        for (let e of enemies) {
          e.y += 12;
        }
      }

      // Bullet hit enemy
      for (let b = 0; b < bullets.length; b++) {
        for (let e of enemies) {
          if (e.alive && bullets[b] &&
              bullets[b].x < e.x + e.w && bullets[b].x + bullets[b].w > e.x &&
              bullets[b].y < e.y + e.h && bullets[b].y + bullets[b].h > e.y) {
            e.alive = false;
            bullets.splice(b, 1);
            b--;
            score += 20;
            scoreEl.innerText = String(score).padStart(4, '0');
            break;
          }
        }
      }
    }

    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player
      ctx.fillStyle = '#00ff66';
      ctx.fillRect(player.x, player.y + 6, player.w, player.h - 6);
      ctx.fillRect(player.x + player.w / 2 - 3, player.y, 6, 6);

      // Bullets
      ctx.fillStyle = '#fff';
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemy Bullets
      ctx.fillStyle = '#ff3366';
      enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemies
      for (let e of enemies) {
        if (!e.alive) continue;
        ctx.fillStyle = e.type === 0 ? '#ff0055' : e.type === 1 ? '#00e5ff' : '#ffe600';
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(e.x + 4, e.y + 4, 4, 4); // eyes
        ctx.fillRect(e.x + e.w - 8, e.y + 4, 4, 4);
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press SPACE or FIRE to restart', canvas.width / 2, canvas.height / 2 + 35);
      } else if (gameWon) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', canvas.width / 2, canvas.height / 2);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press SPACE or FIRE to play again', canvas.width / 2, canvas.height / 2 + 35);
      }
    }

    document.getElementById('btn-left').onmousedown = () => { keys['ArrowLeft'] = true; };
    document.getElementById('btn-left').onmouseup = () => { keys['ArrowLeft'] = false; };
    document.getElementById('btn-right').onmousedown = () => { keys['ArrowRight'] = true; };
    document.getElementById('btn-right').onmouseup = () => { keys['ArrowRight'] = false; };
    document.getElementById('btn-fire').onclick = shoot;

    function loop() {
      if (!gameOver && !gameWon) update();
      draw();
      requestAnimationFrame(loop);
    }

    initEnemies();
    loop();
  </script>
</body>
</html>`,

  "tower_stack": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Tower Stack</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #0f172a;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    canvas {
      background: linear-gradient(to bottom, #1e1b4b, #0f172a);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      cursor: pointer;
      max-width: 100%;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="360" height="560"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let stack = [];
    let currentBlock = null;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('stack_high') || '0');
    let speed = 3;
    let dir = 1;
    let gameOver = false;
    let cameraY = 0;

    const BLOCK_HEIGHT = 24;
    const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

    function init() {
      score = 0;
      speed = 3.5;
      gameOver = false;
      cameraY = 0;
      stack = [
        { x: 80, y: canvas.height - 40, w: 200, h: BLOCK_HEIGHT, color: COLORS[0] }
      ];
      spawnBlock();
    }

    function spawnBlock() {
      const prev = stack[stack.length - 1];
      const color = COLORS[stack.length % COLORS.length];
      currentBlock = {
        x: 0,
        y: prev.y - BLOCK_HEIGHT,
        w: prev.w,
        h: BLOCK_HEIGHT,
        color: color
      };
      dir = 1;
    }

    function placeBlock() {
      if (gameOver) { init(); return; }

      const prev = stack[stack.length - 1];
      const diff = currentBlock.x - prev.x;

      if (Math.abs(diff) >= currentBlock.w) {
        // Missed completely
        gameOver = true;
        return;
      }

      // Slice block
      if (diff > 0) {
        currentBlock.w -= diff;
      } else {
        currentBlock.x = prev.x;
        currentBlock.w += diff;
      }

      stack.push(currentBlock);
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('stack_high', highScore);
      }

      if (score % 5 === 0) speed += 0.4;

      // Adjust camera
      if (stack.length * BLOCK_HEIGHT > canvas.height / 2) {
        cameraY += BLOCK_HEIGHT;
      }

      spawnBlock();
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); placeBlock(); }
    });
    canvas.addEventListener('pointerdown', placeBlock);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!gameOver && currentBlock) {
        currentBlock.x += speed * dir;
        if (currentBlock.x + currentBlock.w > canvas.width) {
          dir = -1;
        } else if (currentBlock.x < 0) {
          dir = 1;
        }
      }

      ctx.save();
      ctx.translate(0, cameraY);

      // Draw stack
      stack.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Draw moving block
      if (!gameOver && currentBlock) {
        ctx.fillStyle = currentBlock.color;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
      }

      ctx.restore();

      // UI
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(score, canvas.width / 2, 70);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 28px system-ui';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = 'white';
        ctx.font = '18px system-ui';
        ctx.fillText('Score: ' + score + '  |  Best: ' + highScore, canvas.width / 2, canvas.height / 2 + 20);
        ctx.font = '14px system-ui';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Tap or press Space to play again', canvas.width / 2, canvas.height / 2 + 60);
      }

      requestAnimationFrame(loop);
    }

    init();
    loop();
  </script>
</body>
</html>`
};

