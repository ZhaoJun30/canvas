var WINDOW_WIDTH = 1024,
  WINDOW_HEIGHT = 768,
  RADIUS = 8,
  MARGIN_TOP = 60,
  MARGIN_LEFT = 30,
  curShowTimeSeconds = 0,
  balls = [],
  colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

function getCurrentShowTimeSeconds() {
  var e = new Date;
  return 3600 * e.getHours() + 60 * e.getMinutes() + e.getSeconds()
}

function update() {
  var e = getCurrentShowTimeSeconds(),
    I = parseInt(e / 3600),
    a = parseInt((e - 3600 * I) / 60),
    l = e % 60,
    t = parseInt(curShowTimeSeconds / 3600),
    r = parseInt((curShowTimeSeconds - 3600 * t) / 60),
    n = curShowTimeSeconds % 60;
  l != n && (parseInt(t / 10) != parseInt(I / 10) && addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(t / 10)), parseInt(t % 10) != parseInt(I % 10) && addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(t / 10)), parseInt(r / 10) != parseInt(a / 10) && addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(r / 10)), parseInt(r % 10) != parseInt(a % 10) && addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(r % 10)), parseInt(n / 10) != parseInt(l / 10) && addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(n / 10)), parseInt(n % 10) != parseInt(l % 10) && addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(l % 10)), curShowTimeSeconds = e), updateBalls(), console.log(balls.length)
}

function updateBalls() {
  for (var e = 0; e < balls.length; e++) {
    balls[e].x += balls[e].vx;
    var I = 1;
    balls[e].y + RADIUS + balls[e].vy >= WINDOW_HEIGHT && (I = (WINDOW_HEIGHT - (balls[e].y + RADIUS)) / balls[e].vy, console.log(I)), balls[e].y += balls[e].vy, balls[e].vy += I * balls[e].g, balls[e].y >= WINDOW_HEIGHT - RADIUS && (balls[e].y = WINDOW_HEIGHT - RADIUS, balls[e].vy = .75 * -Math.abs(balls[e].vy))
  }
  var a = 0;
  for (e = 0; e < balls.length; e++) 0 < balls[e].x + RADIUS && balls[e].x - RADIUS < WINDOW_WIDTH && (balls[a++] = balls[e]);
  for (; balls.length > a;) balls.pop()
}

function addBalls(e, I, a) {
  for (var l = 0; l < digit[a].length; l++)
    for (var t = 0; t < digit[a][l].length; t++)
      if (1 == digit[a][l][t]) {
        var r = {
          x: e + 2 * t * (RADIUS + 1) + (RADIUS + 1),
          y: I + 2 * l * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(),
          vx: 4 * Math.pow(-1, Math.ceil(1e3 * Math.random())),
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        balls.push(r)
      }
}

function render(e) {
  e.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
  var I = parseInt(curShowTimeSeconds / 3600),
    a = parseInt((curShowTimeSeconds - 3600 * I) / 60),
    l = curShowTimeSeconds % 60;
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(I / 10), e), renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(I % 10), e), renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, e), renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(a / 10), e), renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(a % 10), e), renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, e), renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(l / 10), e), renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(l % 10), e);
  for (var t = 0; t < balls.length; t++) e.fillStyle = balls[t].color, e.beginPath(), e.arc(balls[t].x, balls[t].y, RADIUS, 0, 2 * Math.PI, !0), e.closePath(), e.fill()
}

function renderDigit(e, I, a, l) {
  l.fillStyle = "rgb(0,102,153)";
  for (var t = 0; t < digit[a].length; t++)
    for (var r = 0; r < digit[a][t].length; r++) 1 == digit[a][t][r] && (l.beginPath(), l.arc(e + 2 * r * (RADIUS + 1) + (RADIUS + 1), I + 2 * t * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI), l.closePath(), l.fill())
}
window.onload = function () {
  WINDOW_WIDTH = document.body.clientWidth, WINDOW_HEIGHT = document.body.clientHeight, MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10), RADIUS = Math.round(4 * WINDOW_WIDTH / 5 / 108) - 1, MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);
  var e = document.getElementById("canvas"),
    I = e.getContext("2d");
  e.width = WINDOW_WIDTH, e.height = WINDOW_HEIGHT, curShowTimeSeconds = getCurrentShowTimeSeconds(), setInterval(function () {
    render(I), update()
  }, 50)
};