const currentUser=localStorage.getItem("jonnytype_current_user");
const $=s=>document.querySelector(s);
function users(){return JSON.parse(localStorage.getItem("jonnytype_users")||"{}")}
function saveUsers(u){localStorage.setItem("jonnytype_users",JSON.stringify(u))}
function getUser(){const u=users();return currentUser&&u[currentUser]?u[currentUser]:null}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function saveGameScore(game,score){
  const u=getUser();
  if(!u){toast("Log in on JonnyType to save scores");return}
  u.gameScores=u.gameScores||{};u.gameScores[game]=Math.max(u.gameScores[game]||0,score);
  const us=users();us[u.username]=u;saveUsers(us);renderScore();
  toast("score saved");
}
function renderScore(){
  const u=getUser();
  $("#gameUser").textContent=u?u.username:"guest";
  $("#accountPill").textContent=u?`signed in as ${u.username}`:"guest mode";
  const scores=u?.gameScores||{};
  $("#savedScore").innerHTML=`${Object.values(scores).reduce((a,b)=>a+b,0)} <span>game score</span>`;
}
function openGame(name){
  $("#gameModal").classList.remove("hidden");
  if(name==="snake") snakeGame();
  else if(name==="aim") aimGame();
  else if(name==="2048") simple2048();
  else typingRush();
}
function closeGame(){$("#gameModal").classList.add("hidden");$("#gameContent").innerHTML=""}
function snakeGame(){
  $("#gameContent").innerHTML=`<h2 class="game-title">snake</h2><div class="game-big-score" id="gscore">0</div><canvas id="snakeCanvas" width="420" height="420"></canvas><p class="muted game-center">Use arrow keys. Eat the squares. Don't become your own problem.</p>`;
  const c=$("#snakeCanvas"),ctx=c.getContext("2d"),size=21,grid=20;
  let snake=[{x:10,y:10}],dir={x:1,y:0},food={x:5,y:5},score=0;
  document.onkeydown=e=>{const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}}[e.key];if(m&&!(m.x===-dir.x&&m.y===-dir.y))dir=m};
  const timer=setInterval(()=>{
    const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(head.x<0||head.y<0||head.x>=grid||head.y>=grid||snake.some(s=>s.x===head.x&&s.y===head.y)){clearInterval(timer);saveGameScore("snake",score);return}
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y){score+=10;$("#gscore").textContent=score;do{food={x:Math.floor(Math.random()*grid),y:Math.floor(Math.random()*grid)}}while(snake.some(s=>s.x===food.x&&s.y===food.y))}else snake.pop();
    ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#343434";snake.forEach(s=>ctx.fillRect(s.x*size,s.y*size,size-2,size-2));ctx.fillStyle="#e8b84b";ctx.fillRect(food.x*size,food.y*size,size-2,size-2);
  },100);
}
function aimGame(){
  $("#gameContent").innerHTML=`<h2 class="game-title">aim trainer</h2><div class="game-big-score" id="gscore">10 targets</div><canvas id="aimCanvas" width="560" height="330"></canvas><p class="muted game-center">Click the target as quickly as possible.</p>`;
  const c=$("#aimCanvas"),ctx=c.getContext("2d");let left=10,start=performance.now();
  function target(){ctx.clearRect(0,0,c.width,c.height);const x=35+Math.random()*(c.width-70),y=35+Math.random()*(c.height-70);ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fillStyle="#e8b84b";ctx.fill();c.onclick=e=>{const r=c.getBoundingClientRect(),dx=e.clientX-r.left-x,dy=e.clientY-r.top-y;if(dx*dx+dy*dy<324){left--;$("#gscore").textContent=left+" targets";if(!left){const score=Math.max(1,Math.round(10000/(performance.now()-start)*100));saveGameScore("aim",score);c.onclick=null;ctx.clearRect(0,0,c.width,c.height)}else target()}}}
  target();
}
function simple2048(){
  $("#gameContent").innerHTML=`<h2 class="game-title">2048</h2><div class="game-center"><button class="primary-btn" id="easy2048">start</button><div id="board2048" style="margin:20px auto;display:grid;grid-template-columns:repeat(4,70px);gap:7px;width:max-content"></div></div>`;
  $("#easy2048").onclick=()=>{let board=Array(16).fill(0);board[Math.floor(Math.random()*16)]=2;draw();document.onkeydown=e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){const i=Math.floor(Math.random()*16);if(!board[i])board[i]=Math.random()>.8?4:2;draw()}};function draw(){$("#board2048").innerHTML=board.map(n=>`<div style="height:70px;border-radius:8px;background:${n?"#f1d995":"#f0f0ed"};display:grid;place-items:center;font:500 20px var(--mono)">${n||""}</div>`).join("")}};
}
function typingRush(){
  $("#gameContent").innerHTML=`<h2 class="game-title">typing rush</h2><div class="game-center"><p id="rushWord" style="font:24px var(--mono)">ready</p><input id="rushInput" autofocus style="padding:12px;border:1px solid #e5e5e0;border-radius:8px"><p class="muted">Type the word correctly. 20 rounds.</p></div>`;
  const words=["apple","keyboard","school","javascript","jonnytype","computer","banana","rocket","tennis","window","orange","purple","monitor","internet","coding","pizza","rhode","browser","mouse","speed"];let i=0,start=performance.now();const w=$("#rushWord"),inp=$("#rushInput");w.textContent=words[0];inp.oninput=()=>{if(inp.value===words[i]){i++;inp.value="";if(i===words.length){saveGameScore("typing-rush",Math.round(20000/(performance.now()-start)*100));w.textContent="complete";inp.disabled=true}else w.textContent=words[i]}}; 
}
$$(".play-btn").forEach(b=>b.addEventListener("click",()=>openGame(b.dataset.game)));
$("#closeGame").addEventListener("click",closeGame);$("#gameModal .modal-backdrop").addEventListener("click",closeGame);
renderScore();
