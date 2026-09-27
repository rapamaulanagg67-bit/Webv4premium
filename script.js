const ADMIN_WA = "6283817546555";
const DANA = "083867468118";

const packages = [
  {name:"3 Hari", price:2000},
  {name:"6 Hari", price:4000},
  {name:"8 Hari", price:5000},
  {name:"10 Hari", price:7000},
  {name:"Permanen", price:10000}
];

const digitalProducts = [
  ["APK Auto SV", "APK utilitas otomatis untuk kebutuhan digital yang legal.", 2000],
  ["Panel UNLI", "Panel digital demo/administrasi sesuai penggunaan yang sah.", 10000],
  ["File Auto HS 70%", "File konfigurasi/demo untuk penggunaan yang diizinkan.", 2000],
  ["Jasa Edit Spek", "Jasa edit tampilan/data proyek sesuai permintaan.", 1000],
  ["Jasa Buat Logo JB", "Jasa desain logo jual-beli sederhana.", 2000],
  ["Murpush", "Jasa digital sesuai detail yang disepakati.", 1000],
  ["NOKOS INDO", "Layanan nomor virtual sesuai ketersediaan dan aturan penyedia.", 6000],
  ["FF KIPAS", "Produk/jasa terkait game yang tidak memodifikasi atau merusak sistem.", 3000],
  ["Jasa Buat Web", "Website HTML/CSS/JS sederhana sesuai kebutuhan.", 10000],
  ["APK BADAK", "APK/demo utilitas BADAK.", 2000],
  ["MURNOK", "Layanan nomor virtual sesuai ketersediaan.", 5000],
  ["Jasa Akun FF Server Luar", "Jasa bantuan pembuatan akun sesuai aturan platform.", 2000],
  ["WA IOS", "Jasa/produk WhatsApp yang legal dan tidak mengganggu akun orang lain.", 2000],
  ["Reseller Digital", "Paket reseller untuk produk digital yang aman.", 70000]
];

let selected = null;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function rupiah(n){
  return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
}
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2200);
}
function showPage(id){
  $$(".page").forEach(p=>p.classList.remove("active"));
  $("#"+id).classList.add("active");
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
function waOrder(product, price){
  const msg = `Halo Admin CEO RAFFSTR, saya mau order ${product} (${rupiah(price)}). Mohon info proses pembayarannya.`;
  window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`,"_blank");
}

function renderPackages(){
  $("#packageGrid").innerHTML = packages.map((p,i)=>`
    <button class="package" data-index="${i}">
      <div class="days">${p.name}</div>
      <div class="price">${rupiah(p.price)}</div>
    </button>`).join("");
  $$(".package").forEach(el=>el.addEventListener("click",()=>{
    $$(".package").forEach(x=>x.classList.remove("selected"));
    el.classList.add("selected");
    selected=packages[+el.dataset.index];
    $("#selectedPackage").textContent=`${selected.name} • ${rupiah(selected.price)}`;
    $("#orderJoki").disabled=false;
  }));
}

function renderDigital(){
  $("#digitalGrid").innerHTML = digitalProducts.map(p=>`
    <article class="product">
      <h3>${p[0]}</h3>
      <p>${p[1]}</p>
      <div class="pprice">${rupiah(p[2])}</div>
      <button class="btn primary order-digital" data-name="${p[0]}" data-price="${p[2]}">ORDER</button>
    </article>`).join("");
  $$(".order-digital").forEach(b=>b.addEventListener("click",()=>waOrder(b.dataset.name,Number(b.dataset.price))));
}

function loadProfile(){
  const name=localStorage.getItem("raff_name") || "RAFFSTR USER";
  $("#profileName").textContent=name;
  const avatar=localStorage.getItem("raff_avatar");
  if(avatar) $("#avatar").src=avatar;
  else $("#avatar").src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#12121b"/><text x="50%" y="53%" fill="#00e5ff" font-size="58" font-family="Arial" text-anchor="middle">R</text></svg>`);
}
function history(){
  const items=JSON.parse(localStorage.getItem("raff_history")||"[]");
  $("#historyList").innerHTML=items.length?items.map(x=>`<div class="history-item"><b>${x.product}</b><span>${x.price}</span><small>${x.date}</small></div>`).join(""):"<div class='info-card'>Belum ada riwayat pembelian.</div>";
}

function saveHistory(product, price){
  const items=JSON.parse(localStorage.getItem("raff_history")||"[]");
  items.unshift({product,price:rupiah(price),date:new Date().toLocaleString("id-ID")});
  localStorage.setItem("raff_history",JSON.stringify(items.slice(0,30)));
}

function finishIntro(){
  $("#splash").style.display="none";
  $("#app").classList.remove("hidden");
  showPage("joki");
}
function initIntro(){
  const v=$("#introVideo");
  let done=false;
  const finish=()=>{if(done)return;done=true;finishIntro()};
  $("#skipBtn").addEventListener("click",finish);
  // Video otomatis masuk setelah 15 detik; tombol LEWATI tetap bisa dipakai kapan saja.
  setTimeout(finish,15000);
  v.addEventListener("ended",finish);
  v.play().catch(()=>{});
}

$("#orderJoki").addEventListener("click",()=>{
  if(!selected)return toast("Pilih paket terlebih dahulu.");
  $("#paymentPrice").textContent=rupiah(selected.price);
  showPage("payment");
});

$("#copyDana").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(DANA);toast("Nomor DANA berhasil disalin.");}
  catch{toast("Nomor DANA: "+DANA);}
});

$("#proofInput").addEventListener("change",()=>{
  const f=$("#proofInput").files[0];
  if(!f)return;
  $("#proofLabel").textContent="✅ "+f.name;
  const box=$("#proofPreview"); box.innerHTML="";
  if(f.type.startsWith("image/")){
    const img=document.createElement("img");
    img.src=URL.createObjectURL(f); box.appendChild(img);
  }else box.textContent="File bukti siap dikonfirmasi.";
});

$("#confirmPayment").addEventListener("click",()=>{
  if(!selected)return toast("Paket belum dipilih.");
  const proof=$("#proofInput").files[0];
  if(!proof)return toast("Silakan pilih bukti transfer terlebih dahulu.");
  saveHistory(`Joki Kontak ${selected.name}`,selected.price);
  const msg=`Halo Admin CEO RAFFSTR, saya sudah transfer untuk Joki Kontak ${selected.name} sebesar ${rupiah(selected.price)}. Bukti transfer sudah saya siapkan di website. Mohon dicek dan diproses.`;
  window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`,"_blank");
  toast("Konfirmasi dibuat. Kirim file bukti di chat admin.");
  setTimeout(()=>showPage("joki"),700);
});

$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$$(".back-btn").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("#profileQuick").addEventListener("click",()=>showPage("profile"));

$("#changeName").addEventListener("click",()=>{
  const old=localStorage.getItem("raff_name")||"RAFFSTR USER";
  const name=prompt("Masukkan nama profil:",old);
  if(name&&name.trim()){localStorage.setItem("raff_name",name.trim());loadProfile();toast("Nama profil diperbarui.");}
});
$("#avatarInput").addEventListener("change",()=>{
  const f=$("#avatarInput").files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>{localStorage.setItem("raff_avatar",r.result);loadProfile();toast("Foto profil diperbarui.");};
  r.readAsDataURL(f);
});
$("#editPhotoBtn").addEventListener("click",()=>$("#avatarInput").click());
$("#historyBtn").addEventListener("click",()=>{
  $("#historyPanel").classList.toggle("hidden"); history();
});
$("#logoutBtn").addEventListener("click",()=>{
  if(confirm("Reset profil dan riwayat di perangkat ini?")){
    localStorage.removeItem("raff_name");localStorage.removeItem("raff_avatar");localStorage.removeItem("raff_history");
    loadProfile();history();toast("Profil lokal direset.");
  }
});

renderPackages();
renderDigital();
loadProfile();
history();
initIntro();
