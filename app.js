
// Simple frontend logic for Telegram Casino Mini App
// Works standalone and inside Telegram Web App (uses window.TelegramWebApp stub when not inside)

const BALANCE_KEY = 'tg_casino_balance_v1';
const LOG_KEY = 'tg_casino_logs_v1';
const initBalance = () => {
  const raw = localStorage.getItem(BALANCE_KEY);
  return raw ? Number(raw) : 500;
}
let balance = initBalance();
let logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');

const balEl = document.getElementById('bal-amt');
const logEl = document.getElementById('log');
const betEl = document.getElementById('bet');
const cheatEl = document.getElementById('cheat');
const slotsEl = document.getElementById('slots');

function saveState(){
  localStorage.setItem(BALANCE_KEY, String(balance));
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0,200)));
}

function addLog(text){
  const time = new Date().toLocaleTimeString();
  logs.unshift({time,text});
  renderLogs();
  saveState();
}

function renderLogs(){
  logEl.innerHTML = '';
  logs.forEach(l=>{
    const li = document.createElement('li');
    li.textContent = `${l.time} — ${l.text}`;
    logEl.appendChild(li);
  });
}

function updateBalanceUI(){
  balEl.textContent = balance;
}

// Game implementations
function playCoinFlip(choice){
  const bet = clampBet();
  const cheat = cheatEl.checked;
  const result = cheat ? choice : (Math.random() < 0.5 ? 'heads' : 'tails');
  if(result === choice){
    balance += bet;
    addLog(`CoinFlip: ${choice} -> ${result} — +${bet}`);
  } else {
    balance -= bet;
    addLog(`CoinFlip: ${choice} -> ${result} — -${bet}`);
  }
  updateBalanceUI(); saveState();
}

function playSlots(){
  const bet = clampBet();
  const cheat = cheatEl.checked;
  const symbols = ['🍒','🍋','🍊','⭐','💎','🔔'];
  const reels = cheat ? ['🍒','🍒','🍒'] : [randSymbol(symbols), randSymbol(symbols), randSymbol(symbols)];
  slotsEl.textContent = reels.join(' ');
  if(reels[0]===reels[1] && reels[1]===reels[2]){
    const win = bet*5;
    balance += win;
    addLog(`Slots: ${reels.join(' ')} — Jackpot +${win}`);
  } else if (new Set(reels).size < 3){
    const win = bet*2;
    balance += win;
    addLog(`Slots: ${reels.join(' ')} — Pair +${win}`);
  } else {
    balance -= bet;
    addLog(`Slots: ${reels.join(' ')} — Lose -${bet}`);
  }
  updateBalanceUI(); saveState();
}

function playRoulette(color){
  const bet = clampBet();
  const cheat = cheatEl.checked;
  const spin = cheat ? (color === 'red' ? 3 : 4) : Math.floor(Math.random()*37);
  const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const sprColor = spin===0 ? 'green' : (reds.has(spin)?'red':'black');
  if(sprColor === color){
    const win = bet*2;
    balance += win;
    addLog(`Roulette: ${spin}(${sprColor}) — +${win}`);
  } else {
    balance -= bet;
    addLog(`Roulette: ${spin}(${sprColor}) — -${bet}`);
  }
  updateBalanceUI(); saveState();
}

function playHighCard(){
  const bet = clampBet();
  const cheat = cheatEl.checked;
  const player = cheat ? 13 : (Math.floor(Math.random()*13)+1);
  const dealer = cheat ? 1 : (Math.floor(Math.random()*13)+1);
  if(player > dealer){
    balance += bet;
    addLog(`HighCard: ${player} vs ${dealer} — +${bet}`);
  } else if (player < dealer){
    balance -= bet;
    addLog(`HighCard: ${player} vs ${dealer} — -${bet}`);
  } else {
    addLog(`HighCard: ${player} vs ${dealer} — Push`);
  }
  updateBalanceUI(); saveState();
}

function randSymbol(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function clampBet(){ const v = Math.max(1, Math.floor(Number(betEl.value)||1)); return Math.min(v, balance); }

// UI bindings
document.getElementById('free').addEventListener('click', ()=>{
  balance += 1000;
  addLog('Free Credits +1000');
  updateBalanceUI(); saveState();
});
document.querySelectorAll('[data-game="coin"]').forEach(b=> b.addEventListener('click', ()=> playCoinFlip(b.dataset.choice)));
document.getElementById('spin').addEventListener('click', playSlots);
document.querySelectorAll('[data-game="roulette"]').forEach(b=> b.addEventListener('click', ()=> playRoulette(b.dataset.val)));
document.getElementById('highcard').addEventListener('click', playHighCard);

// init
updateBalanceUI(); renderLogs();
