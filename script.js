// let max = prompt("enter the maximum number ");
// // console.log(max);
// const random = Math.floor(Math.random() * max) + 1;
// console.log(random);
// let guess = prompt("guess the number");
// while (true) {
//     if (guess == "quit") {
//         console.log("you are quitting game");
//         break;
//     }

//     if (guess == random) {
//         console.log("you are right!congrates random number was", random);
//         break;
//     }
//     else if (guess < random) {
//         guess = prompt("hint : your guess was too small.please try again");

//     } else {
//         guess = prompt("hint :your guess was too large.please try again");

//     }

// }






const maxInput = document.getElementById('maxInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const quitBtn = document.getElementById('quitBtn');
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const hintBox = document.getElementById('hintBox');
const attemptsEl = document.getElementById('attempts');
const lastGuessEl = document.getElementById('lastGuess');
const rangeText = document.getElementById('rangeText');
const statusEl = document.getElementById('status');
const secretDebug = document.getElementById('secretDebug');
const card = document.getElementById('card');
const hintBtn = document.getElementById('hintBtn');
const confettiRoot = document.getElementById('confetti');

let secret = null;
let attempts = 0;
let min = 1;
let max = 100;
let playing = false;

function startGame(){
  const m = parseInt(maxInput.value, 10);
  if (!m || m < 2) {
    alert('Please enter a valid maximum (>= 2).');
    return;
  }
  max = m;
  secret = Math.floor(Math.random() * max) + 1;
  attempts = 0;
  playing = true;
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.value = '';
  guessInput.focus();
  statusEl.textContent = 'Playing';
  hintBox.textContent = `Guess a number between ${min} and ${max}.`;
  rangeText.textContent = `${min} — ${max}`;
  attemptsEl.textContent = attempts;
  lastGuessEl.textContent = '-';
  secretDebug.textContent = secret;
  card.classList.remove('win');
  confettiRoot.innerHTML = '';
}

function resetGame(){
  maxInput.value = 100;
  min = 1;
  max = 100;
  secret = null;
  attempts = 0;
  playing = false;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  statusEl.textContent = 'Waiting to start';
  hintBox.textContent = 'Start a game to see hints here.';
  attemptsEl.textContent = attempts;
  lastGuessEl.textContent = '-';
  rangeText.textContent = '-';
  secretDebug.textContent = '—';
  confettiRoot.innerHTML = '';
  card.classList.remove('win','shake');
}

function quitGame(){
  playing = false;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  statusEl.textContent = 'Quit';
  hintBox.textContent = 'You quit the game.';
  secretDebug.textContent = '—';
  card.classList.remove('win','shake');
  confettiRoot.innerHTML = '';
}

function handleGuess(){
  if(!playing) return;
  const raw = guessInput.value;
  if (!raw) return;
  const g = parseInt(raw, 10);
  if (isNaN(g)) {
    hintBox.textContent = 'Enter a valid number.';
    return;
  }
  attempts++;
  attemptsEl.textContent = attempts;
  lastGuessEl.textContent = g;

  if (g === secret){
    hintBox.textContent = `🎉 You got it! Number was ${secret}. Attempts: ${attempts}`;
    statusEl.textContent = 'Won';
    card.classList.add('win');
    playing = false;
    guessInput.disabled = true;
    guessBtn.disabled = true;
    createConfetti(80);
  } else if (g < secret){
    hintBox.textContent = 'Too small! Try bigger.';
    animateWrong();
  } else {
    hintBox.textContent = 'Too big! Try smaller.';
    animateWrong();
  }
  guessInput.value = '';
  guessInput.focus();
}

function animateWrong(){
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
  setTimeout(()=> card.classList.remove('shake'), 450);
}

function randomHint(){
  if(!playing){ hintBox.textContent = 'Start a game first.'; return; }
  const chance = Math.random();
  if (chance < 0.5){
    hintBox.textContent = `Secret is ${secret % 2 === 0 ? 'even' : 'odd'}.`;
  } else {
    hintBox.textContent = `Secret is ${secret > max/2 ? 'in upper half' : 'in lower half'} of range.`;
  }
}

function createConfetti(count=50){
  confettiRoot.innerHTML = '';
  const colors = ['#60a5fa','#7c3aed','#f472b6','#f59e0b','#34d399','#f97316'];
  const w = window.innerWidth;
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.left = Math.random()*w + 'px';
    el.style.top = '-20px';
    el.style.background = colors[i % colors.length];
    confettiRoot.appendChild(el);
    const dx = (Math.random()-0.5)*200;
    const dy = 300 + Math.random()*400;
    const rot = (Math.random()*720 - 360);
    el.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity:1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0.9 }
    ], {
      duration: 1600 + Math.random()*1200,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      delay: Math.random()*300
    });
  }
  setTimeout(()=> confettiRoot.innerHTML = '', 4000);
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
quitBtn.addEventListener('click', quitGame);
guessBtn.addEventListener('click', handleGuess);
hintBtn.addEventListener('click', randomHint);

maxInput.addEventListener('keydown', e => { if(e.key === 'Enter') startGame(); });
guessInput.addEventListener('keydown', e => { if(e.key === 'Enter') handleGuess(); });

resetGame();
