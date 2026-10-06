const WORD_BANK = `the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part over after our back only round man year came show every good me give our under name very through just form much great think say help low line before turn cause same mean differ move right boy old too does tell sentence set three want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father head stand own page should country found answer school grow study still learn plant cover food sun four thought let keep eye never last door between city tree cross hard start might story saw far sea draw left late run don't while press close night real life few stop open seem together next white children begin got walk example ease paper often always music those both mark book letter until mile river car car?`.split(/\\s+/); 

let settings = { duration: 15, mode: "time" };
let test = null;
let currentUser = localStorage.getItem("jonnytype_current_user") || null;
let clickCount = 0, clickTimer;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function users(){ return JSON.parse(localStorage.getItem("jonnytype_users") || "{}"); }
function saveUsers(u){ localStorage.setItem("jonnytype_users", JSON.stringify(u)); }
function getUser(){
  const u=users();
  return currentUser && u[currentUser] ? u[currentUser] : null;
}
function updateUserUI(){
  const u=getUser();
  $("#userMini").textContent=u ? u.username : "guest";
}
function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove("show"),1800);
}
function makeWords(n=55){
  const arr=[];
  for(let i=0;i<n;i++) arr.push(WORD_BANK[Math.floor(Math.random()*WORD_BANK.length)]);
  return arr;
}
function renderWords(){
  const words=makeWords();
  $("#words").innerHTML=words.map((w,i)=>`<span class="word" data-index="${i}">${[...w].map(c=>`<span class="letter">${c}</span>`).join("")}</span> `).join("");
}
function resetTest(){
  clearInterval(test?.interval);
  test=null;
  $("#timer").textContent=settings.duration;
  renderWords();
  $("#typingInput").value="";
  $("#typingScreen").focus();
  $("#resultOverlay").classList.add("hidden");
  $(".hint").textContent="click here and start typing";
}
function startTest(){
  if(test?.started) return;
  test={started:true,start:performance.now(),typed:0,correct:0,errors:0};
  $(".hint").textContent="";
  test.interval=setInterval(()=>{
    const elapsed=(performance.now()-test.start)/1000;
    const left=Math.max(0,settings.duration-elapsed);
    $("#timer").textContent=left.toFixed(1);
    if(left<=0) finishTest();
  },80);
}
function handleTyping(e){
  const input=e.target;
  if(e.inputType==="deleteContentBackward" || input.value.length===0) return;
  if(!test?.started) startTest();
  const typed=input.value;
  const words=[...$("#words").querySelectorAll(".word")];
  const expected=words.map(w=>w.textContent).join(" ");
  let correct=0;
  for(let i=0;i<typed.length;i++) if(typed[i]===expected[i]) correct++;
  test.typed=typed.length; test.correct=correct; test.errors=typed.length-correct;
  words.forEach(w=>w.classList.remove("current"));
  let pos=0;
  for(const w of words){
    const letters=[...w.querySelectorAll(".letter")];
    if(typed.length>=pos && typed.length<=pos+w.textContent.length){
      w.classList.add("current");
      letters.forEach((l,i)=>{
        l.classList.remove("correct","incorrect");
        if(typed[pos+i]!==undefined) l.classList.add(typed[pos+i]===l.textContent?"correct":"incorrect");
      });
      break;
    }
    pos+=w.textContent.length+1;
  }
  if(typed.length>=expected.length) finishTest();
}
function finishTest(){
  if(!test?.started || test.finished) return;
  test.finished=true; clearInterval(test.interval);
  const elapsed=Math.max(1,(performance.now()-test.start)/60000);
  const wpm=Math.max(0,Math.round((test.correct/5)/elapsed));
  const accuracy=test.typed ? Math.round(test.correct/test.typed*100) : 0;
  const record={wpm,accuracy,errors:test.errors,chars:test.typed,duration:settings.duration,date:new Date().toISOString()};
  const u=getUser();
  if(u){
    u.tests=u.tests||[]; u.tests.unshift(record); u.tests=u.tests.slice(0,100);
    u.bestWpm=Math.max(u.bestWpm||0,wpm);
    const us=users(); us[u.username]=u; saveUsers(us);
  }
  $("#resultWpm").textContent=wpm;
  $("#resultAccuracy").textContent=accuracy+"%";
  $("#resultChars").textContent=test.typed;
  $("#resultErrors").textContent=test.errors;
  $("#resultOverlay").classList.remove("hidden");
}
function showView(name){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $(`#${name}View`).classList.add("active");
  $$(".nav-btn[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  if(name==="stats") renderStats();
}
function renderStats(){
  const u=getUser();
  const tests=u?.tests||[];
  const avg=tests.length ? Math.round(tests.reduce((a,b)=>a+b.wpm,0)/tests.length) : 0;
  const accuracy=tests.length ? Math.round(tests.reduce((a,b)=>a+b.accuracy,0)/tests.length) : 0;
  $("#statsGrid").innerHTML=[
    ["best WPM",u?.bestWpm||0],["average WPM",avg],["accuracy",accuracy+"%"],["tests",tests.length]
  ].map(x=>`<div class="stat"><div class="stat-value">${x[1]}</div><div class="stat-label">${x[0]}</div></div>`).join("");
  $("#history").innerHTML=tests.length ? tests.slice(0,15).map(t=>`<div class="history-row"><span>${t.wpm} wpm</span><span>${t.accuracy}%</span><span>${t.errors} errors</span><span>${new Date(t.date).toLocaleDateString()}</span></div>`).join("") : `<p class="muted">No tests yet. Humanity has survived another day without statistics.</p>`;
}
function openAuth(){
  const u=getUser();
  $("#authModal").classList.remove("hidden");
  $("#authEyebrow").textContent=u?"account":"local account";
  $("#authTitle").textContent=u?"account":"log in";
  $("#authSubtitle").textContent=u?`Signed in as ${u.username}. Your data stays in this browser.`:"Your account is stored locally in this browser. No server required.";
  $("#authForm").classList.toggle("hidden",!!u);
  $("#switchAuth").classList.toggle("hidden",!!u);
  $("#logoutBtn").classList.toggle("hidden",!u);
}
function authSubmit(e){
  e.preventDefault();
  const username=$("#usernameInput").value.trim().toLowerCase();
  const password=$("#passwordInput").value;
  if(username.length<2) return showToast("Username is too short");
  const us=users();
  if($("#authTitle").textContent==="sign up"){
    if(us[username]) return showToast("That username already exists");
    us[username]={username,password,tests:[],bestWpm:0,gameScores:{}};
    saveUsers(us); currentUser=username; localStorage.setItem("jonnytype_current_user",username);
    $("#authModal").classList.add("hidden"); updateUserUI(); showToast("Account created");
  }else{
    if(!us[username] || us[username].password!==password) return showToast("Wrong username or password");
    currentUser=username; localStorage.setItem("jonnytype_current_user",username);
    $("#authModal").classList.add("hidden"); updateUserUI(); showToast("Logged in");
  }
}
$("#typingScreen").addEventListener("click",()=>$("#typingInput").focus());
$("#typingInput").addEventListener("input",handleTyping);
$("#restartBtn").addEventListener("click",resetTest);
$("#resultRestart").addEventListener("click",resetTest);
$("#typingScreen").addEventListener("keydown",e=>{if(e.key==="Tab"&&e.key==="Enter"){e.preventDefault();resetTest()}});
$$(".mode-btn").forEach(b=>b.addEventListener("click",()=>{
  $$(".mode-btn").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  if(b.dataset.time) settings.duration=+b.dataset.time;
  resetTest();
}));
$$(".nav-btn[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$("#loginBtn").addEventListener("click",openAuth);
$("#closeAuth").addEventListener("click",()=>$("#authModal").classList.add("hidden"));
$("#authModal .modal-backdrop").addEventListener("click",()=>$("#authModal").classList.add("hidden"));
$("#authForm").addEventListener("submit",authSubmit);
$("#switchAuth").addEventListener("click",()=>{
  const signup=$("#authTitle").textContent!=="sign up";
  $("#authTitle").textContent=signup?"sign up":"log in";
  $("#authSubmit").textContent=signup?"create account":"log in";
  $("#switchAuth").textContent=signup?"already have an account? log in":"need an account? sign up";
  $("#passwordInput").value="";
  $("#passwordInput").autocomplete=signup?"new-password":"current-password";
});
$("#logoutBtn").addEventListener("click",()=>{
  currentUser=null; localStorage.removeItem("jonnytype_current_user");
  $("#authModal").classList.add("hidden"); updateUserUI(); showToast("Logged out");
});
$("#exportBtn").addEventListener("click",()=>{
  const u=getUser(); if(!u) return showToast("Log in to export your data");
  const blob=new Blob([JSON.stringify(u,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`jonnytype-${u.username}.json`; a.click(); URL.revokeObjectURL(a.href);
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){$("#resultOverlay").classList.add("hidden");$("#authModal").classList.add("hidden")}
});
$("#typingScreen").addEventListener("click",()=>{
  clearTimeout(clickTimer); clickCount++;
  clickTimer=setTimeout(()=>clickCount=0,1000);
  if(clickCount>=5){clickCount=0; location.href="games.html"}
});
updateUserUI(); resetTest();
