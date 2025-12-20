(function(){
  const CART_KEY = 'void_cart_v1';
  const fmt = (n)=>`€${n.toFixed(2)}`;
  
  let inventoryCache = {};
  let inventoryInterval = null;

  const api = {
    init(cfg){
      this.cfg = cfg;
      this.renderCount();
      this.bindUI();
      this.loadInventory();
      this.startInventoryPolling();
    },

    // ==================== INVENTORY METHODS ====================
    async loadInventory() {
      if (!window.VoidAPI) {
        console.error('VoidAPI not loaded');
        return;
      }

      const inventory = await window.VoidAPI.getInventory();
      if (inventory) {
        inventoryCache = inventory;
        await this.checkAllProducts();
      }
    },

    startInventoryPolling() {
      // Actualizar inventario cada 3 segundos para simular tiempo real
      inventoryInterval = setInterval(async () => {
        await this.loadInventory();
      }, 3000);
    },

    stopInventoryPolling() {
      if (inventoryInterval) {
        clearInterval(inventoryInterval);
        inventoryInterval = null;
      }
    },

    async isSoldOut(productId) {
      const availability = await window.VoidAPI.checkAvailability(productId);
      return availability.soldOut;
    },

    async purchaseProduct(productId) {
      if (!window.VoidAPI) return { success: false, error: 'API not available' };
      return await window.VoidAPI.purchaseProduct(productId);
    },

    async canAddToCart(productId) {
      const items = this.get();
      const inCart = items.find(i=>i.id===productId);
      const inCartQty = inCart ? (inCart.qty || 1) : 0;
      
      const availability = await window.VoidAPI.checkAvailability(productId);
      return availability.available && availability.quantity > inCartQty;
    },

    async updateProductUI(productId) {
      if (typeof document === 'undefined') return;
      
      const availability = await window.VoidAPI.checkAvailability(productId);
      const soldOut = availability.soldOut;
      
      const btns = document.querySelectorAll(`[data-product="${productId}"]`);
      btns.forEach(btn=>{
        if(soldOut){
          btn.disabled = true;
          btn.style.opacity = '0.5';
          btn.style.cursor = 'not-allowed';
          btn.textContent = 'sold out';
        } else {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          if(btn.classList.contains('primary')){
            btn.textContent = 'buy now';
          } else {
            btn.textContent = 'add to cart';
          }
        }
      });
    },

    async checkAllProducts() {
      if (typeof document === 'undefined') return;
      const btns = document.querySelectorAll('[data-product]');
      const productIds = new Set();
      btns.forEach(btn=>{
        const id = btn.getAttribute('data-product');
        if(id) productIds.add(id);
      });
      
      for (const id of productIds) {
        await this.updateProductUI(id);
      }
    },

    // ==================== CART METHODS ====================
    get(){
      try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(e){ return []; }
    },

    set(items){ 
      localStorage.setItem(CART_KEY, JSON.stringify(items)); 
      this.renderCount(); 
    },

    async add(item){
      const canAdd = await this.canAddToCart(item.id);
      if(!canAdd){
        alert('This product is sold out or already in your cart.');
        return false;
      }
      
      const items = this.get();
      const existing = items.find(i=>i.id===item.id);
      // Si ya existe, no añadir (solo 1 unidad por producto)
      if(existing){
        alert('This product is already in your cart.');
        return false;
      }
      items.push({...item, qty: 1});
      this.set(items); 
      this.renderOverlay();
      return true;
    },

    remove(id){ 
      const items = this.get().filter(i=>i.id!==id); 
      this.set(items); 
      this.renderOverlay(); 
    },

    clear(){ 
      this.set([]); 
      this.renderOverlay(); 
    },

    count(){ 
      return this.get().reduce((a,i)=>a+(i.qty||1),0); 
    },

    total(){ 
      return this.get().reduce((a,i)=>a + (i.price||0)*(i.qty||1),0); 
    },

    // ==================== UI METHODS ====================
    bindUI(){
      const {buttonEl, overlayEl, clearEl, closeEl} = this.cfg;
      if(buttonEl){ buttonEl.addEventListener('click', ()=> this.toggleOverlay(true)); }
      if(closeEl){ closeEl.addEventListener('click', ()=> this.toggleOverlay(false)); }
      if(overlayEl){ overlayEl.addEventListener('click', (e)=>{ if(e.target===overlayEl) this.toggleOverlay(false); }); }
      if(clearEl){ clearEl.addEventListener('click', ()=> this.clear()); }
      this.renderOverlay();
    },

    renderCount(){ 
      const {countEl} = this.cfg || {}; 
      if(countEl) countEl.textContent = this.count(); 
    },

    toggleOverlay(show){ 
      const {overlayEl} = this.cfg; 
      if(!overlayEl) return; 
      overlayEl.hidden = !show; 
      if(show) this.renderOverlay(); 
    },

    renderOverlay(){
      const {itemsEl, totalEl} = this.cfg;
      if(!itemsEl || !totalEl) return;
      const items = this.get();
      if(items.length===0){ 
        itemsEl.innerHTML = '<div class="empty">Your cart is empty.</div>'; 
      } else {
        itemsEl.innerHTML = items.map(i=>`
          <div class="cart-item">
            <div class="ci-main">
              <div class="ci-title">${i.title}</div>
              <div class="ci-meta">${fmt(i.price)}</div>
            </div>
            <div class="ci-controls">
              <button class="ci-remove" data-id="${i.id}">×</button>
            </div>
          </div>
        `).join('');
        itemsEl.querySelectorAll('.ci-remove').forEach(btn=>{
          btn.addEventListener('click', ()=> this.remove(btn.getAttribute('data-id')));
        });
      }
      totalEl.textContent = fmt(this.total());
      this.renderCount();
    },

    // Cleanup
    destroy() {
      this.stopInventoryPolling();
    }
  };

  window.VoidCart = api;
})();
