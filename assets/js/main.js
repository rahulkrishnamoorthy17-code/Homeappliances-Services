
const VH={
 toast(msg,type='success'){
   let old=document.querySelector('.vh-toast-mini'); if(old) old.remove();
   let el=document.createElement('div');
   el.className=`vh-toast-mini ${type==='success'?'is-success':'is-warning'}`;
   el.setAttribute('role','status');
   el.innerHTML=`<i class="bi ${type==='success'?'bi-check-circle-fill':'bi-exclamation-circle-fill'}"></i><span>${msg}</span>`;
   document.body.appendChild(el);
   requestAnimationFrame(()=>el.classList.add('show'));
   setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),220)},2600);
 },
 formPopup(msg,type='success'){
   let old=document.querySelector('.vh-popup-overlay'); if(old) old.remove();
   let overlay=document.createElement('div');
   overlay.className='vh-popup-overlay';
   let icon=type==='success'?'bi-check-circle-fill':'bi-exclamation-circle-fill';
   overlay.innerHTML=`<div class="vh-popup-card ${type==='success'?'is-success':'is-warning'}" role="dialog" aria-live="polite">
      <button class="vh-popup-close" type="button" aria-label="Close"><i class="bi bi-x-lg"></i></button>
      <div class="vh-popup-icon"><i class="bi ${icon}"></i></div>
      <h4>${type==='success'?'Success':'Notice'}</h4>
      <p>${msg}</p>
      <button class="btn btn-brand vh-popup-ok" type="button">OK</button>
   </div>`;
   document.body.appendChild(overlay);
   requestAnimationFrame(()=>overlay.classList.add('show'));
   const close=()=>{overlay.classList.remove('show');setTimeout(()=>overlay.remove(),220)};
   overlay.querySelector('.vh-popup-close').onclick=close;
   overlay.querySelector('.vh-popup-ok').onclick=close;
   overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 },
 theme(){let t='light';try{t=localStorage.getItem('vh-theme')||'light'}catch(e){}document.documentElement.dataset.theme=t;document.querySelectorAll('[data-theme-icon]').forEach(x=>x.className=t==='dark'?'bi bi-sun':'bi bi-moon-stars')},
 toggleTheme(){const t=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('vh-theme',t)}catch(e){document.documentElement.dataset.theme=t}this.theme()},
 dir(){let d=localStorage.getItem('vh-dir')||'ltr';document.documentElement.dir=d;document.documentElement.lang=d==='rtl'?'ar':'en';document.querySelectorAll('[data-dir-label]').forEach(x=>x.textContent=d==='rtl'?'LTR':'RTL')},
 toggleDir(){localStorage.setItem('vh-dir',document.documentElement.dir==='rtl'?'ltr':'rtl');this.dir()},
 save(key,obj){let a=JSON.parse(localStorage.getItem(key)||'[]');a.unshift(obj);localStorage.setItem(key,JSON.stringify(a));return a},
 user(){return JSON.parse(localStorage.getItem('vh-user')||'null')}
};
document.addEventListener('DOMContentLoaded',()=>{
 VH.theme();VH.dir();
 document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.onclick=()=>VH.toggleTheme());
 document.querySelectorAll('[data-dir-toggle]').forEach(b=>b.onclick=()=>VH.toggleDir());
 document.querySelectorAll('.reveal').forEach(el=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.08}).observe(el));
 // active nav
 let f=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.navbar .nav-link,.dropdown-item').forEach(a=>{if(a.getAttribute('href')===f)a.classList.add('active')});
 // generic forms
 document.querySelectorAll('[data-contact-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();let fd=Object.fromEntries(new FormData(form));VH.save('vh-messages',{...fd,id:'MSG-'+Date.now(),date:new Date().toLocaleDateString()});form.reset();VH.formPopup('Message sent successfully. We will contact you shortly.')}));
 document.querySelectorAll('[data-booking-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();let fd=Object.fromEntries(new FormData(form));VH.save('vh-bookings',{...fd,id:'SRV-'+String(Date.now()).slice(-6),status:'Pending',date:new Date().toLocaleDateString()});form.reset();VH.formPopup('Repair booking confirmed. Reference saved in your browser.')}));
 // newsletter
 document.querySelectorAll('[data-newsletter]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.reset();VH.toast('Subscribed to VoltHome updates.')}));
 // product search/filter
 let cards=[...document.querySelectorAll('[data-product-card]')], search=document.querySelector('[data-product-search]');
 function applyProducts(){if(!cards.length)return;let q=(search?.value||'').toLowerCase(),cat=document.querySelector('.filter-btn.active')?.dataset.filter||'all';cards.forEach(c=>{let ok=(cat==='all'||c.dataset.category===cat)&&c.innerText.toLowerCase().includes(q);c.closest('[data-product-col]').style.display=ok?'':'none'})}
 search?.addEventListener('input',applyProducts);document.querySelectorAll('.filter-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');applyProducts()});
 const PRODUCT_CATALOG={
  'FrostPro 340L':{price:42990,image:'assets/images/product-frostpro-340l-landscape.png'},
  'FamilyCool 520L':{price:68500,image:'assets/images/product-familycool-520l.webp'},
  'EcoWash 8kg':{price:31990,image:'assets/images/product-ecowash-8kg.webp'},
  'SmartWash 10kg':{price:44990,image:'assets/images/product-smartwash-10kg.svg'},
  'BreezeMax 1.5T':{price:39990,image:'assets/images/product-breezemax-1-5t.webp'},
  'AirPure 2T':{price:52500,image:'assets/images/product-airpure-2t.webp'},
  'QuickChef 28L':{price:14990,image:'assets/images/product-quickchef-28l.webp'},
  'HeatFlow 25L':{price:10990,image:'assets/images/product-heatflow-25l.webp'},
  'SparkleClean 14S':{price:36990,image:'assets/images/product-sparkleclean-14s.jpg'},
  'MixMaster Pro 1000W':{price:7490,image:'assets/images/product-mixmaster-1000w.jpg'}
 };
 const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
 const loadCart=()=>JSON.parse(localStorage.getItem('vh-cart')||'[]');
 const saveCart=c=>localStorage.setItem('vh-cart',JSON.stringify(c));
 function addProduct(name,goCheckout=false){
   const meta=PRODUCT_CATALOG[name]||{};let cart=loadCart(),x=cart.find(i=>i.name===name);
   if(x){x.qty++;x.price=Number(x.price)||meta.price||0;x.image=x.image||meta.image}
   else cart.push({name,qty:1,price:meta.price||0,image:meta.image||'assets/images/hero-appliances.svg'});
   saveCart(cart);updateCart();
   if(goCheckout){localStorage.setItem('vh-checkout-mode','single');localStorage.setItem('vh-checkout-product',name);location.href='checkout.html'}
   else {VH.toast(name+' added to cart.');renderCartPage()}
 }
 document.querySelectorAll('[data-add-cart]').forEach(b=>b.onclick=()=>addProduct(b.dataset.addCart,false));
 document.querySelectorAll('[data-buy-now]').forEach(b=>b.onclick=()=>addProduct(b.dataset.buyNow,true));
 function updateCart(){let n=loadCart().reduce((s,i)=>s+i.qty,0);document.querySelectorAll('[data-cart-count]').forEach(x=>{x.textContent=n;x.style.display=n?'inline-block':'none'})} updateCart();
 function renderCartPage(){
   let wrap=document.querySelector('[data-cart-items]');if(!wrap)return;let cart=loadCart();
   let items=cart.reduce((s,i)=>s+i.qty,0),amount=cart.reduce((s,i)=>s+(Number(i.price)||PRODUCT_CATALOG[i.name]?.price||0)*i.qty,0);
   document.querySelectorAll('[data-cart-total-items]').forEach(x=>x.textContent=items);
   document.querySelectorAll('[data-cart-subtotal],[data-cart-grand-total]').forEach(x=>x.textContent=money(amount));
   if(!cart.length){wrap.innerHTML='<div class="cart-empty"><div class="empty-icon"><i class="bi bi-cart-x"></i></div><h3>Your cart is empty</h3><p class="text-muted">Browse our appliance collection and add products to see them here.</p><a class="btn btn-brand" href="products.html">Browse Products</a></div>';document.querySelector('[data-cart-checkout]')?.classList.add('disabled');return}
   document.querySelector('[data-cart-checkout]')?.classList.remove('disabled');
   wrap.innerHTML=cart.map((i,idx)=>{const meta=PRODUCT_CATALOG[i.name]||{},price=Number(i.price)||meta.price||0,img=i.image||meta.image||'assets/images/hero-appliances.svg';return `<article class="cart-item"><div class="cart-image-wrap"><img src="${img}" alt="${i.name}"></div><div class="cart-item-info"><span class="small text-muted">Home appliance</span><h5>${i.name}</h5><strong class="cart-price">${money(price)}</strong><div class="small text-muted mt-1">Line total: <strong>${money(price*i.qty)}</strong></div></div><div class="qty-control"><button type="button" data-cart-minus="${idx}" aria-label="Decrease quantity"><i class="bi bi-dash"></i></button><span>${i.qty}</span><button type="button" data-cart-plus="${idx}" aria-label="Increase quantity"><i class="bi bi-plus"></i></button></div><button class="cart-remove" type="button" data-cart-remove="${idx}" aria-label="Remove ${i.name}"><i class="bi bi-trash3"></i></button></article>`}).join('');
   wrap.querySelectorAll('[data-cart-minus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.cartMinus,-1));
   wrap.querySelectorAll('[data-cart-plus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.cartPlus,1));
   wrap.querySelectorAll('[data-cart-remove]').forEach(b=>b.onclick=()=>removeCart(+b.dataset.cartRemove));
 }
 function changeQty(idx,delta){let cart=loadCart();if(!cart[idx])return;cart[idx].qty+=delta;if(cart[idx].qty<=0)cart.splice(idx,1);saveCart(cart);updateCart();renderCartPage()}
 function removeCart(idx){let cart=loadCart();cart.splice(idx,1);saveCart(cart);updateCart();renderCartPage();VH.toast('Product removed from cart.','warning')}
 document.querySelector('[data-clear-cart]')?.addEventListener('click',()=>{localStorage.removeItem('vh-cart');updateCart();renderCartPage();VH.toast('Cart cleared.','warning')}); document.querySelector('[data-cart-checkout]')?.addEventListener('click',e=>{if(!loadCart().length){e.preventDefault();VH.toast('Your cart is empty.','warning');return}localStorage.setItem('vh-checkout-mode','cart');localStorage.removeItem('vh-checkout-product')});
 renderCartPage();
 function renderCheckout(){
   const box=document.querySelector('[data-checkout-items]');if(!box)return;let cart=loadCart(),mode=localStorage.getItem('vh-checkout-mode')||'cart',name=localStorage.getItem('vh-checkout-product');let items=mode==='single'&&name?cart.filter(i=>i.name===name).slice(-1):cart;
   if(!items.length){box.innerHTML='<p class="text-muted">No products selected.</p>';document.querySelector('[data-checkout-total]').textContent=money(0);return}
   let total=items.reduce((s,i)=>s+(Number(i.price)||PRODUCT_CATALOG[i.name]?.price||0)*i.qty,0);
   box.innerHTML=items.map(i=>{let meta=PRODUCT_CATALOG[i.name]||{},img=i.image||meta.image,price=Number(i.price)||meta.price||0;return `<div class="checkout-item"><img src="${img}" alt="${i.name}"><div><strong>${i.name}</strong><small>Qty ${i.qty} · ${money(price*i.qty)}</small></div></div>`}).join('');
   document.querySelector('[data-checkout-total]').textContent=money(total);
 }
 renderCheckout();
 document.querySelector('[data-checkout-form]')?.addEventListener('submit',e=>{
   e.preventDefault();
   if(!e.target.checkValidity()){e.target.reportValidity();return}
   let total=document.querySelector('[data-checkout-total]')?.textContent||'₹0';
   VH.formPopup('Purchase request submitted successfully. Order value: '+total+'. You can place another order from this page.');
   e.target.reset();
   localStorage.removeItem('vh-cart');
   localStorage.removeItem('vh-checkout-product');
   localStorage.removeItem('vh-checkout-mode');
   updateCart();
   renderCheckout();
   setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),250);
 });
 // blog filter
 let posts=[...document.querySelectorAll('[data-blog-card]')],bs=document.querySelector('[data-blog-search]');function applyBlog(){let q=(bs?.value||'').toLowerCase(),cat=document.querySelector('.blog-filter.active')?.dataset.filter||'all';posts.forEach(c=>{let ok=(cat==='all'||c.dataset.category===cat)&&c.innerText.toLowerCase().includes(q);c.closest('[data-blog-col]').style.display=ok?'':'none'})}bs?.addEventListener('input',applyBlog);document.querySelectorAll('.blog-filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.blog-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');applyBlog()});
 // warranty checker
 let wf=document.querySelector('[data-warranty-form]');wf?.addEventListener('submit',e=>{e.preventDefault();let s=document.querySelector('[name=serial]').value.trim(),out=document.querySelector('[data-warranty-result]');if(s.length<6){out.innerHTML='<div class="alert alert-warning">Enter a valid serial number (minimum 6 characters).</div>';return}let months=(s.charCodeAt(0)%2?12:24);out.innerHTML='<div class="alert alert-success"><strong>Warranty eligible:</strong> '+months+'-month standard coverage. Final validation requires invoice date.</div>'});
 // auth tabs/forms
 document.querySelector('[data-register-form]')?.addEventListener('submit',e=>{e.preventDefault();let f=Object.fromEntries(new FormData(e.target));localStorage.setItem('vh-user',JSON.stringify({name:f.name,email:f.email}));VH.formPopup('Account created. You can now sign in.');setTimeout(()=>location.hash='login',500)});
 document.querySelector('[data-login-form]')?.addEventListener('submit',e=>{e.preventDefault();let f=Object.fromEntries(new FormData(e.target)),u=VH.user();if(u&&u.email===f.email){localStorage.setItem('vh-auth','1');VH.formPopup('Login successful.');setTimeout(()=>location.href='index.html',700)}else VH.formPopup('Create an account first or use the same registered email.','warning')});

 // Open requested auth tab from navbar hash links.
 function openAuthHash(){let hash=location.hash;if(hash==='#register'){let t=document.querySelector('[data-bs-target="#register"]');if(t)bootstrap.Tab.getOrCreateInstance(t).show()}else if(hash==='#login'){let t=document.querySelector('[data-bs-target="#login"]');if(t)bootstrap.Tab.getOrCreateInstance(t).show()}}
 openAuthHash();window.addEventListener('hashchange',openAuthHash);

});


// ===== Premium interactions =====
document.addEventListener('DOMContentLoaded',()=>{
  const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
  const topBtn=document.createElement('button');topBtn.className='back-top';topBtn.type='button';topBtn.setAttribute('aria-label','Back to top');topBtn.innerHTML='<i class="bi bi-arrow-up"></i>';document.body.appendChild(topBtn);
  const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?(scrollY/max*100):0)+'%';topBtn.classList.toggle('show',scrollY>520)};addEventListener('scroll',onScroll,{passive:true});onScroll();topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
  // Stagger reveal timing for richer entrance animation.
  document.querySelectorAll('.reveal').forEach((el,i)=>el.style.transitionDelay=Math.min((i%6)*55,275)+'ms');
  // Button / control feedback.
  document.querySelectorAll('[data-theme-toggle],[data-dir-toggle]').forEach(btn=>btn.addEventListener('click',()=>{btn.animate([{transform:'scale(1)'},{transform:'scale(.9)'},{transform:'scale(1)'}],{duration:260})}));
  document.querySelectorAll('[data-add-cart]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-cart-count]').forEach(b=>{b.classList.remove('cart-pop');void b.offsetWidth;b.classList.add('cart-pop')});btn.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260})}));
  // Count-up for numeric stats while preserving suffixes.
  const animateStat=el=>{const raw=el.textContent.trim(),m=raw.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);if(!m)return;const target=parseFloat(m[1]),suffix=m[2],dec=m[1].includes('.')?1:0,start=performance.now(),dur=900;const tick=t=>{const p=Math.min((t-start)/dur,1),v=target*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec)+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)};
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.counted){e.target.dataset.counted='1';animateStat(e.target)}}),{threshold:.5});document.querySelectorAll('.stat').forEach(x=>sio.observe(x));
  // Smoothly close mobile navigation after selecting a normal link.
  document.querySelectorAll('#mainNav a:not(.dropdown-toggle)').forEach(a=>a.addEventListener('click',()=>{const nav=document.getElementById('mainNav');if(nav&&innerWidth<992&&nav.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(nav).hide()}));
  // Visual feedback on successful form submissions (local demo functionality remains unchanged).
  document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',()=>{form.classList.remove('form-success-flash');void form.offsetWidth;form.classList.add('form-success-flash')}));
  // Lightweight pointer tilt on premium cards (desktop only).
  if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.cardx,.experience-card').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-7px) perspective(700px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg)`});card.addEventListener('mouseleave',()=>card.style.transform='')})}
});

// ===== Final site-wide entrance & micro-interaction pass =====
document.addEventListener('DOMContentLoaded',()=>{
  const selectors=[
    '.section-heading','.cardx','.simple-product-card','.product-card-rich','.experience-card',
    '.pricing-card','.story-panel','.buying-guide','.turnaround-panel','.accordion-item',
    '.hero .col-lg-6','.hero .col-lg-5','.hero .col-lg-7','.stat','.brand-pill','.footer .col-lg-4','.footer .col-6'
  ];
  const nodes=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))];
  nodes.forEach((el,i)=>{
    if(el.classList.contains('reveal')) return;
    el.classList.add(i%7===1?'vh-animate-left':i%7===5?'vh-animate-right':'vh-animate');
    el.style.transitionDelay=Math.min((i%5)*60,240)+'ms';
  });
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('vh-in');io.unobserve(entry.target)}
  }),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  nodes.forEach(el=>io.observe(el));

  // Gentle cursor spotlight on premium cards, no layout movement.
  if(matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.cardx,.simple-product-card,.product-card-rich,.experience-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
    });
  }
});

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-countdown]').forEach(box=>{
   let target=Number(localStorage.getItem('vh-maintenance-target')||0);if(!target||target<Date.now()){target=Date.now()+10*24*60*60*1000;localStorage.setItem('vh-maintenance-target',String(target))}
   const tick=()=>{let diff=Math.max(0,target-Date.now()),d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);box.querySelector('[data-days]').textContent=String(d).padStart(2,'0');box.querySelector('[data-hours]').textContent=String(h).padStart(2,'0');box.querySelector('[data-minutes]').textContent=String(m).padStart(2,'0');box.querySelector('[data-seconds]').textContent=String(s).padStart(2,'0')};tick();setInterval(tick,1000)
 });
});


document.addEventListener('DOMContentLoaded',()=>{
  // Active navigation including dropdown parent items.
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link,.navbar .dropdown-item').forEach(a=>{
    a.classList.remove('active','vh-active-parent');
    const href=(a.getAttribute('href')||'').split('#')[0].toLowerCase();
    if(href && href!=='#' && href===page) a.classList.add('active');
  });
  if(page==='index.html'||page==='index-2.html'){
    const homeDrop=[...document.querySelectorAll('.navbar .dropdown')].find(d=>d.querySelector('a[href="index.html"],a[href="index-2.html"]'));
    homeDrop?.querySelector('.dropdown-toggle')?.classList.add('vh-active-parent');
  }
  if(page==='services.html'||page==='warranty.html'||page.startsWith('service-')){
    const svcDrop=[...document.querySelectorAll('.navbar .dropdown')].find(d=>d.querySelector('a[href="services.html"]'));
    svcDrop?.querySelector('.dropdown-toggle')?.classList.add('vh-active-parent');
  }

  // Social sign-in demo actions.
  document.querySelectorAll('[data-social-auth]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const provider=btn.getAttribute('data-social-auth');
      if(window.VH?.toast) VH.toast(`Continue with ${provider} is ready for backend integration.`);
      else alert(`Continue with ${provider} is ready for backend integration.`);
    });
  });
});


document.addEventListener('DOMContentLoaded',()=>{
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  document.querySelectorAll('.navbar .nav-link').forEach(a=>{
    a.classList.remove('active','vh-active-parent');
  });

  // Direct pages
  document.querySelectorAll('.navbar .nav-link[href]').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('#')[0].toLowerCase();
    if(href && href===page) a.classList.add('active');
  });

  // Home dropdown parent
  if(page==='index.html'||page==='index-2.html'){
    const homeParent=[...document.querySelectorAll('.navbar .dropdown')].find(d =>
      d.querySelector('a[href="index.html"]') || d.querySelector('a[href="index-2.html"]')
    );
    homeParent?.querySelector('.dropdown-toggle')?.classList.add('vh-active-parent');
  }

  // Services dropdown parent
  if(page==='services.html'||page==='warranty.html'||page.startsWith('service-')){
    const svcParent=[...document.querySelectorAll('.navbar .dropdown')].find(d =>
      d.querySelector('a[href="services.html"]') || d.querySelector('a[href="warranty.html"]')
    );
    svcParent?.querySelector('.dropdown-toggle')?.classList.add('vh-active-parent');
  }
});

/* NAVBAR_FINAL_ACTIVE_SYNC */
document.addEventListener('DOMContentLoaded', function () {
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const topLinks=[...document.querySelectorAll('.navbar .navbar-nav > .nav-item > .nav-link')];
  topLinks.forEach(a=>a.classList.remove('active','vh-active-parent'));

  const addDirect=(href)=>document.querySelector(`.navbar .navbar-nav > .nav-item > .nav-link[href="${href}"]`)?.classList.add('active');

  if(page==='index.html'||page==='index-2.html'){
    const li=[...document.querySelectorAll('.navbar .nav-item.dropdown')].find(x=>x.querySelector('.dropdown-menu a[href="index.html"]'));
    li?.querySelector(':scope > .nav-link')?.classList.add('active');
  } else if(page==='services.html'||page==='warranty.html'||page.startsWith('service-')){
    const li=[...document.querySelectorAll('.navbar .nav-item.dropdown')].find(x=>x.querySelector('.dropdown-menu a[href="services.html"]'));
    li?.querySelector(':scope > .nav-link')?.classList.add('active');
  } else {
    const direct={ 'about.html':'about.html','products.html':'products.html','pricing.html':'pricing.html','blog.html':'blog.html','contact.html':'contact.html' };
    if(direct[page]) addDirect(direct[page]);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const topLinks = [...document.querySelectorAll('.navbar .navbar-nav > .nav-item > .nav-link')];

  // Clear all previous active variants.
  topLinks.forEach(link => link.classList.remove('active', 'vh-active-parent'));

  let target = null;

  if (page === 'index.html' || page === 'index-2.html') {
    target = [...document.querySelectorAll('.navbar .nav-item.dropdown')]
      .find(li => li.querySelector('.dropdown-menu a[href="index.html"]'))
      ?.querySelector(':scope > .nav-link');
  } else if (page === 'services.html' || page === 'warranty.html' || page.startsWith('service-')) {
    target = [...document.querySelectorAll('.navbar .nav-item.dropdown')]
      .find(li => li.querySelector('.dropdown-menu a[href="services.html"]'))
      ?.querySelector(':scope > .nav-link');
  } else {
    const direct = {
      'about.html': 'about.html',
      'products.html': 'products.html',
      'pricing.html': 'pricing.html',
      'blog.html': 'blog.html',
      'contact.html': 'contact.html'
    };
    if (direct[page]) {
      target = document.querySelector(`.navbar .navbar-nav > .nav-item > .nav-link[href="${direct[page]}"]`);
    }
  }

  if (target) target.classList.add('active');
});
