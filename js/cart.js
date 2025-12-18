(function(){
  const CART_KEY = 'void_cart_v1';
  const fmt = (n)=>`€${n.toFixed(2)}`;

  const api = {
    init(cfg){
      this.cfg = cfg;
      this.renderCount();
      this.bindUI();
    },
    get(){
      try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(e){ return []; }
    },
    set(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); this.renderCount(); },
    add(item){
      const items = this.get();
      const existing = items.find(i=>i.id===item.id);
      if(existing){ existing.qty = (existing.qty||1)+ (item.qty||1); }
      else { items.push({...item, qty: item.qty||1}); }
      this.set(items); this.renderOverlay();
    },
    remove(id){ const items = this.get().filter(i=>i.id!==id); this.set(items); this.renderOverlay(); },
    updateQty(id, delta){
      const items = this.get();
      const item = items.find(i=>i.id===id);
      if(item){
        item.qty = Math.max(1, (item.qty||1) + delta);
        this.set(items); this.renderOverlay();
      }
    },
    clear(){ this.set([]); this.renderOverlay(); },
    count(){ return this.get().reduce((a,i)=>a+(i.qty||1),0); },
    total(){ return this.get().reduce((a,i)=>a + (i.price||0)*(i.qty||1),0); },

    bindUI(){
      const {buttonEl, overlayEl, clearEl, closeEl} = this.cfg;
      if(buttonEl){ buttonEl.addEventListener('click', ()=> this.toggleOverlay(true)); }
      if(closeEl){ closeEl.addEventListener('click', ()=> this.toggleOverlay(false)); }
      if(overlayEl){ overlayEl.addEventListener('click', (e)=>{ if(e.target===overlayEl) this.toggleOverlay(false); }); }
      if(clearEl){ clearEl.addEventListener('click', ()=> this.clear()); }
      this.renderOverlay();
    },
    renderCount(){ const {countEl} = this.cfg || {}; if(countEl) countEl.textContent = this.count(); },
    toggleOverlay(show){ const {overlayEl} = this.cfg; if(!overlayEl) return; overlayEl.hidden = !show; if(show) this.renderOverlay(); },
    renderOverlay(){
      const {itemsEl, totalEl} = this.cfg;
      if(!itemsEl || !totalEl) return;
      const items = this.get();
      if(items.length===0){ itemsEl.innerHTML = '<div class="empty">Your cart is empty.</div>'; }
      else {
        itemsEl.innerHTML = items.map(i=>`
          <div class="cart-item">
            <div class="ci-main">
              <div class="ci-title">${i.title}</div>
              <div class="ci-meta">${fmt(i.price)} each</div>
            </div>
            <div class="ci-controls">
              <button class="ci-qty-btn ci-minus" data-id="${i.id}">−</button>
              <span class="ci-qty">${i.qty||1}</span>
              <button class="ci-qty-btn ci-plus" data-id="${i.id}">+</button>
              <button class="ci-remove" data-id="${i.id}">×</button>
            </div>
          </div>
        `).join('');
        itemsEl.querySelectorAll('.ci-remove').forEach(btn=>{
          btn.addEventListener('click', ()=> this.remove(btn.getAttribute('data-id')));
        });
        itemsEl.querySelectorAll('.ci-minus').forEach(btn=>{
          btn.addEventListener('click', ()=> this.updateQty(btn.getAttribute('data-id'), -1));
        });
        itemsEl.querySelectorAll('.ci-plus').forEach(btn=>{
          btn.addEventListener('click', ()=> this.updateQty(btn.getAttribute('data-id'), 1));
        });
      }
      totalEl.textContent = fmt(this.total());
      this.renderCount();
    }
  };

  window.VoidCart = api;
})();
