const KEY="misFinanzasPWA_v1";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=()=>today().slice(0,7);
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number(n)||0);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const blank=()=>({expenses:[],incomes:[],fixed:[],debts:[],goals:[]});
let data=load();
function load(){try{return {...blank(),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return blank()}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function monthSum(arr){return arr.filter(x=>(x.date||"").slice(0,7)===monthKey()).reduce((a,x)=>a+Number(x.amount||0),0)}
function empty(text){return `<div class="empty">${text}</div>`}
function item(icon,title,meta,amount,actions=""){return `<article class="item"><div class="item-icon">${icon}</div><div class="item-main"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(meta||"")}</small></div><div class="item-side"><strong>${money(amount)}</strong>${actions?`<div class="item-actions">${actions}</div>`:""}</div></article>`}
function actions(kind,id,extra=""){return `<button class="mini" data-edit="${kind}" data-id="${id}">Editar</button>${extra}<button class="mini danger" data-delete="${kind}" data-id="${id}">Borrar</button>`}
function render(){
 const expenses=monthSum(data.expenses),incomes=monthSum(data.incomes);
 $("#monthExpenses").textContent=money(expenses);$("#monthIncome").textContent=money(incomes);$("#monthBalance").textContent=money(incomes-expenses);
 const debtTotal=data.debts.reduce((s,d)=>s+Math.max(0,Number(d.amount)-Number(d.paid||0)),0);
 $("#debtTotal").textContent=money(debtTotal);$("#debtMetric").textContent=money(debtTotal);
 $("#expenseTotal").textContent=money(expenses);$("#incomeTotal").textContent=money(incomes);
 const recent=[...data.expenses.map(x=>({...x,kind:"expense",icon:"↗"})),...data.incomes.map(x=>({...x,kind:"income",icon:"↙"}))].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,5);
 $("#recentList").innerHTML=recent.length?recent.map(x=>item(x.icon,x.name,`${x.date} · ${x.category}`,x.kind==="expense"?-x.amount:x.amount)).join(""):empty("Aún no hay movimientos. Añade tu primer gasto o ingreso.");
 $("#expenseList").innerHTML=renderMovements(data.expenses,"expense","🧾");
 $("#incomeList").innerHTML=renderMovements(data.incomes,"income","💵");
 $("#fixedList").innerHTML=data.fixed.length?data.fixed.map(x=>item("▦",x.name,`Día ${x.day} · ${x.category} · ${x.paidMonth===monthKey()?"Pagado este mes":"Pendiente"}`,x.amount,`<button class="mini" data-paid="${x.id}">${x.paidMonth===monthKey()?"Desmarcar":"Marcar pagado"}</button>${actions("fixed",x.id)}`)).join(""):empty("No tienes pagos fijos registrados.");
 $("#debtList").innerHTML=data.debts.length?data.debts.map(x=>{const left=Math.max(0,Number(x.amount)-Number(x.paid||0)),pct=Math.min(100,Math.round((Number(x.paid||0)/Number(x.amount))*100));return `<article class="item"><div class="item-icon">◈</div><div class="item-main"><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.creditor||"Deuda")} · Pagado ${pct}%</small><div class="progress"><span style="width:${pct}%"></span></div><small>Pendiente: ${money(left)}</small></div><div class="item-side"><strong>${money(x.amount)}</strong><div class="item-actions"><button class="mini" data-abono="${x.id}">Abonar</button>${actions("debt",x.id)}</div></div></article>`}).join(""):empty("¡Buen momento para empezar! Añade una deuda para seguir su avance.");
 $("#goalList").innerHTML=data.goals.length?data.goals.map(x=>{const pct=Math.min(100,Math.round((Number(x.saved||0)/Number(x.target))*100));return `<article class="item"><div class="item-icon">◎</div><div class="item-main"><strong>${escapeHtml(x.name)}</strong><small>${money(x.saved||0)} ahorrados de ${money(x.target)}</small><div class="progress"><span style="width:${pct}%"></span></div><small>${pct}% completado</small></div><div class="item-side"><div class="item-actions"><button class="mini" data-aporte="${x.id}">＋ Aporte</button>${actions("goal",x.id)}</div></div></article>`}).join(""):empty("Crea una meta para darle un propósito a tus ahorros.");
}
function renderMovements(arr,kind,icon){return arr.length?arr.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(x=>item(icon,x.name,`${x.date} · ${x.category}${x.note?" · "+x.note:""}`,x.amount,actions(kind,x.id))).join(""):empty("Todavía no hay registros aquí. Usa «Añadir» para crear uno.");}
function showTab(tab){$$(".page").forEach(p=>p.classList.toggle("active",p.id===tab));$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));window.scrollTo({top:0,behavior:"smooth"})}
const formMap={gastos:"expenseForm",ingresos:"incomeForm",fijos:"fixedForm",deudas:"debtForm",metas:"goalForm"};
const kindMap={expense:"expenses",income:"incomes",fixed:"fixed",debt:"debts",goal:"goals"};
function openForm(tab,record=null){const form=$("#"+formMap[tab]);if(!form)return;form.classList.remove("hidden");form.reset();const idInput=form.querySelector('[name="id"]');if(idInput)idInput.value=record?.id||"";if(record){for(const [k,v] of Object.entries(record)){const el=form.elements[k];if(el)el.value=v??""}}else{if(form.elements.date)form.elements.date.value=today();if(form.elements.day)form.elements.day.value=5;if(form.elements.saved)form.elements.saved.value=0}form.scrollIntoView({behavior:"smooth",block:"start"})}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go.toLowerCase())));
$$("[data-add]").forEach(b=>b.addEventListener("click",()=>openForm(b.dataset.add)));
$$("[data-cancel]").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.cancel).classList.add("hidden")));
function bindForm(id,collection,mapper){$("#"+id).addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget,fd=new FormData(f),obj=mapper(Object.fromEntries(fd.entries()));const oldId=obj.id;obj.id=oldId||uid();const arr=data[collection],idx=arr.findIndex(x=>x.id===obj.id);if(idx>=0)arr[idx]={...arr[idx],...obj};else arr.unshift(obj);f.classList.add("hidden");save();toast(oldId?"Cambios guardados":"Registro guardado")})}
bindForm("expenseForm","expenses",o=>({id:o.id||undefined,name:o.name.trim(),amount:Number(o.amount),date:o.date,category:o.category,note:o.note.trim()}));
bindForm("incomeForm","incomes",o=>({id:o.id||undefined,name:o.name.trim(),amount:Number(o.amount),date:o.date,category:o.category}));
bindForm("fixedForm","fixed",o=>({id:o.id||undefined,name:o.name.trim(),amount:Number(o.amount),day:Number(o.day),category:o.category}));
bindForm("debtForm","debts",o=>({id:o.id||undefined,name:o.name.trim(),creditor:o.creditor.trim(),amount:Number(o.amount),paid:0}));
bindForm("goalForm","goals",o=>({id:o.id||undefined,name:o.name.trim(),target:Number(o.target),saved:Number(o.saved||0)}));
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.delete){const kind=b.dataset.delete,id=b.dataset.id;if(confirm("¿Quieres borrar este registro?")){data[kindMap[kind]]=data[kindMap[kind]].filter(x=>x.id!==id);save();toast("Registro borrado")}}
 if(b.dataset.edit){const kind=b.dataset.edit,id=b.dataset.id,rec=data[kindMap[kind]].find(x=>x.id===id),tab={expense:"gastos",income:"ingresos",fixed:"fijos",debt:"deudas",goal:"metas"}[kind];if(kind==="debt"){openForm(tab,{...rec,amount:rec.amount});return}if(kind==="goal"){openForm(tab,{...rec,target:rec.target,saved:rec.saved});return}if(kind==="fixed"){openForm(tab,rec);return}openForm(tab,{...rec,name:rec.name,amount:rec.amount,date:rec.date,category:rec.category,note:rec.note})}
 if(b.dataset.paid){const x=data.fixed.find(x=>x.id===b.dataset.paid);x.paidMonth=x.paidMonth===monthKey()?"":monthKey();save();toast(x.paidMonth?"Pago marcado como pagado":"Pago marcado como pendiente")}
 if(b.dataset.abono){const x=data.debts.find(x=>x.id===b.dataset.abono),n=prompt(`Saldo pendiente: ${money(Math.max(0,x.amount-(x.paid||0)))}\n¿Cuánto vas a abonar? (COP)`,"");if(n!==null&&Number(n)>0){x.paid=Math.min(Number(x.amount),Number(x.paid||0)+Number(n));save();toast("Abono registrado")}}
 if(b.dataset.aporte){const x=data.goals.find(x=>x.id===b.dataset.aporte),n=prompt(`Meta: ${money(x.target)}\n¿Cuánto vas a aportar? (COP)`,"");if(n!==null&&Number(n)>0){x.saved=Number(x.saved||0)+Number(n);save();toast("Aporte registrado")}}
});
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mis-finanzas-copia.json";a.click();URL.revokeObjectURL(url);toast("Copia de seguridad descargada")});
$("#importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const incoming=JSON.parse(await f.text());if(!confirm("Importar esta copia reemplazará los datos actuales. ¿Continuar?"))return;data={...blank(),...incoming};save();toast("Copia importada")}catch{alert("El archivo no parece una copia válida de Mis Finanzas.")}e.target.value=""});
$("#todayLabel").textContent=new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
let installPrompt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").addEventListener("click",async()=>{if(!installPrompt){toast("En iPhone usa Compartir → Añadir a pantalla de inicio.");return}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").classList.add("hidden")});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
render();