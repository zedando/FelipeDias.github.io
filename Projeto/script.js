// ==== JOGO DA ABELHA ====
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const menu = document.getElementById('menu')
const startBtn = document.getElementById('startbtn')
const returnBtn = document.getElementById('returnbtn')

let collected = 0
let target = 5
let timeLeft = 30
let lives = 3
let playing = false
let beeFrames = []
let spiderFrames = []
let flowerImgs = []
let bgImg = new Image()
let imagesLoaded = 0
let overlayImg = null
let bgY = 0
let bgSpeed = 120

function li(src, arr) {
  const i = new Image()
  i.src = src
  i.onload = () => imagesLoaded++
  arr.push(i)
}

li('img/bee1.png', beeFrames)
li('img/bee2.png', beeFrames)
li('img/bee3.png', beeFrames)
li('img/bee4.png', beeFrames)
li('img/spider1.png', spiderFrames)
li('img/spider2.png', spiderFrames)
li('img/spider3.png', spiderFrames)
li('img/spider4.png', spiderFrames)
li('img/flower1.png', flowerImgs)
li('img/flower2.png', flowerImgs)

bgImg.src = 'img/bg.png'
bgImg.onload = () => imagesLoaded++

class E {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  drawImg(img, flip = false) {
    ctx.save()
    if (flip) {
      ctx.translate(this.x + this.w, this.y)
      ctx.scale(-1, 1)
      ctx.drawImage(img, 0, 0, this.w, this.h)
    } else {
      ctx.drawImage(img, this.x, this.y, this.w, this.h)
    }
    ctx.restore()
  }
  collide(o) {
    return this.x < o.x + o.w &&
           this.x + this.w > o.x &&
           this.y < o.y + o.h &&
           this.y + this.h > o.y
  }
}

class Bee extends E {
  constructor() {
    super(368, 520, 64, 48)
    this.dir = 0
    this.frame = 0
    this.ft = 0
  }
  update(dt) {
    this.x += this.dir * 240 * dt
    if (this.x < 0) this.x = 0
    if (this.x + this.w > canvas.width) this.x = canvas.width - this.w
    this.ft += dt
    if (this.ft > 0.08) {
      this.frame = (this.frame + 1) % beeFrames.length
      this.ft = 0
    }
  }
  draw() {
    if (beeFrames.length) ctx.drawImage(beeFrames[this.frame], this.x, this.y, this.w, this.h)
  }
}

class Spider extends E {
  constructor() {
    super(100, -60, 64, 48)
    this.speed = 160
    this.frame = 0
    this.ft = 0
  }
  reset() {
    this.y = -Math.random() * 300 - 60
    this.x = Math.random() * (canvas.width - this.w)
  }
  update(dt) {
    this.y += this.speed * dt
    this.ft += dt
    if (this.ft > 0.15) {
      this.frame = (this.frame + 1) % spiderFrames.length
      this.ft = 0
    }
    if (this.y > canvas.height + 50) this.reset()
  }
  draw() {
    if (spiderFrames.length) ctx.drawImage(spiderFrames[this.frame], this.x, this.y, this.w, this.h)
  }
}

class Flower extends E {
  constructor(x, y) {
    super(x, y, 36, 36)
    this.speed = 190
    this.frame = 0
    this.ft = 0
  }
  reset() {
    this.y = -Math.random() * 800 - 50
    this.x = Math.random() * (canvas.width - this.w)
  }
  update(dt) {
    this.y += this.speed * dt
    this.ft += dt
    if (this.ft > 0.8) {
      this.frame = (this.frame + 1) % flowerImgs.length
      this.ft = 0
    }
    if (this.y > canvas.height + 50) this.reset()
  }
  draw() {
    if (flowerImgs.length) ctx.drawImage(flowerImgs[this.frame], this.x, this.y, this.w, this.h)
  }
}

let bee = new Bee()
let spider = new Spider()
let flowers = []

function makeFlowers(n) {
  flowers = []
  for (let i = 0; i < n; i++) {
    flowers.push(new Flower(Math.random() * (canvas.width - 36), -Math.random() * 800 - 50))
  }
}

makeFlowers(10)

window.addEventListener('keydown', e => {
  if (e.key === 'a' || e.key === 'ArrowLeft') bee.dir = -1
  if (e.key === 'd' || e.key === 'ArrowRight') bee.dir = 1
})
window.addEventListener('keyup', e => {
  if ((e.key === 'a' || e.key === 'ArrowLeft') && bee.dir === -1) bee.dir = 0
  if ((e.key === 'd' || e.key === 'ArrowRight') && bee.dir === 1) bee.dir = 0
})

function t(freq, dur) {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)()
    const o = a.createOscillator()
    const g = a.createGain()
    o.connect(g)
    g.connect(a.destination)
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.value = 0.0001
    o.start()
    g.gain.exponentialRampToValueAtTime(0.2, a.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur)
    o.stop(a.currentTime + dur + 0.02)
  } catch (e) {}
}

function sc() {t(1200,0.12)}
function scc(){t(220,0.25)}
function sgo(){t(200,0.7)}

function update(dt) {
  if (!playing) return
  bee.update(dt)
  spider.update(dt)
  for (let f of flowers) f.update(dt)
  if (bee.collide(spider)) {
    scc()
    spider.reset()
    lives--
    if (lives <= 0) {
      playing = false
      sgo()
      showGameOver()
    }
  }
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i]
    if (bee.collide(f)) {
      sc()
      collected++
      f.reset()
      if (collected >= target) {
        playing = false
        showWin()
      }
    }
  }
}

function drawBg() {
  if (!bgImg.complete) return
  bgY += bgSpeed / 60
  if (bgY >= bgImg.height) bgY -= bgImg.height
  ctx.drawImage(bgImg, 0, bgY, canvas.width, bgImg.height)
  ctx.drawImage(bgImg, 0, bgY - bgImg.height, canvas.width, bgImg.height)
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBg()
  bee.draw()
  spider.draw()
  for (let f of flowers) f.draw()
  if (overlayImg) {
    const w=overlayImg.width
    const h=overlayImg.height
    ctx.drawImage(overlayImg,(canvas.width-w)/2,(canvas.height-h)/2)
  }
  ctx.fillStyle = 'white'
  ctx.font = '20px Arial'
  ctx.fillText('Objetivo: ' + target, 10, 30)
  ctx.fillText('Coletadas: ' + collected, 200, 30)
  ctx.fillText('Vidas: ' + lives, 400, 30)
  ctx.fillText('Tempo: ' + timeLeft + 's', 550, 30)
}

let last = performance.now()

function loop(ts) {
  let dt = (ts-last)/1000
  last = ts
  update(dt)
  draw()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

let timerRef = null

startBtn.addEventListener('click', () => {
  if (imagesLoaded < 11) return
  menu.style.display = 'none'
  if (!playing) startGame()
})

function startGame() {
  playing = true
  overlayImg = null
  collected = 0
  lives = 3
  timeLeft = 30
  spider.reset()
  makeFlowers(10)
  if (timerRef) clearInterval(timerRef)
  timerRef = setInterval(() => {
    if (!playing) {
      clearInterval(timerRef)
      return
    }
    timeLeft--
    if (timeLeft <= 0) {
      clearInterval(timerRef)
      if (collected < target) {
        playing = false
        sgo()
        showGameOver()
      } else {
        playing = false
        showWin()
      }
    }
  }, 1000)
}

function showGameOver() {
  menu.style.display = 'none'
  returnBtn.style.display = 'block'
  overlayImg = new Image()
  overlayImg.src = 'img/gameover.png'
}

function showWin() {
  menu.style.display = 'none'
  returnBtn.style.display = 'block'
  overlayImg = new Image()
  overlayImg.src = 'img/youwin.png'
}

returnBtn.addEventListener('click', () => {
  returnBtn.style.display='none'
  menu.style.display='flex'
  playing=false
  overlayImg=null
  collected=0
  timeLeft=30
  lives=3
  spider.reset()
  makeFlowers(10)
})


const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}
