<<<<<<< HEAD
import {
  initMenuToggle,
  initProgressBar,
  initHeaderScroll,
  initScrollTop,
  initScrollAnimations
} from "./ui.js";
=======
const galleryContainer = document.getElementById('galleryContainer');
const folderPath = 'images/gallery/img';
const maxTry = 200;
const extensions = ['jpg', 'jpeg', 'png', 'webp'];
>>>>>>> 3089d77d1e33815589b3ed624237eb7c0df18393

initMenuToggle();
initProgressBar();
initHeaderScroll();
initScrollTop();
initScrollAnimations();

const galleryContainer = document.getElementById("galleryContainer");

const folderPath = "/images/gallery/img";
const extensions = ["jpg","jpeg","png","webp"];
const maxTry = 200;

async function loadGallery(){

if(!galleryContainer) return;

galleryContainer.innerHTML = "";

const images = [];

for(let i=1;i<=maxTry;i++){

let loaded=false;

for(const ext of extensions){

const src=`${folderPath}${i}.${ext}`;

const exists = await checkImage(src);

if(exists){

images.push(src);
loaded=true;
break;

}

}

if(!loaded) break;

}

renderGallery(images);

}

function checkImage(src){

return new Promise(resolve=>{

const img=new Image();

img.onload=()=>resolve(true);
img.onerror=()=>resolve(false);

img.src=src;

});

}

function renderGallery(images){

const html = images.map(src=>`

<div class="gallery-item animate-on-scroll">

<img src="${src}" alt="Everest FC gallery image" loading="lazy">

<div class="gallery-overlay">
<p>Everest FC</p>
</div>

</div>

`).join("");

galleryContainer.innerHTML=html;

initScrollAnimations();

initLightbox();

}

function initLightbox(){

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
const closeBtn=document.querySelector(".lightbox-close");

if(!lightbox || !lightboxImg) return;

document.querySelectorAll(".gallery-item img").forEach(img=>{

img.addEventListener("click",()=>{

lightboxImg.src=img.src;
lightbox.style.display="flex";

});

});

closeBtn.onclick=()=>lightbox.style.display="none";

lightbox.addEventListener("click",(e)=>{
if(e.target===lightbox){
lightbox.style.display="none";
}
});

}
window.addEventListener("load",loadGallery);

<<<<<<< HEAD
=======
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}
>>>>>>> 3089d77d1e33815589b3ed624237eb7c0df18393
