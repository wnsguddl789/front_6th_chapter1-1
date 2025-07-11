(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e){if(t.type!==`childList`)continue;for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();const e=`modulepreload`,t=function(e){return`/front_6th_chapter1-1/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(i.map(i=>{if(i=t(i,a),i in n)return;n[i]=!0;let o=i.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``,l=!!a;if(l)for(let e=r.length-1;e>=0;e--){let t=r[e];if(t.href===i&&(!o||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${i}"]${s}`))return;let u=document.createElement(`link`);if(u.rel=o?`stylesheet`:e,o||(u.as=`script`),u.crossOrigin=``,u.href=i,c&&u.setAttribute(`nonce`,c),document.head.appendChild(u),o)return new Promise((e,t)=>{u.addEventListener(`load`,e),u.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[]){if(t.status!==`rejected`)continue;s(t.reason)}return r().catch(s)})};var i=class{constructor(e,t={}){this.target=e,this.element=e,this.props=t,this.state={},this.preserveSelectors=t.preserveSelectors||[],this._handlers=new Map,this.initialState()}initialState(){this.render()}setState(e){let t={...this.state},n={...this.props};this.state={...this.state,...e},this.reRender(),this.componentDidUpdate(n,t,this.state)}componentDidMount(){}componentDidUpdate(){}template(){return``}reRender(){this.target&&(this.preserveSelectors.length>0?this.reRenderWithPreservation():this.target.innerHTML=this.template())}reRenderWithPreservation(){let e=[];this.preserveSelectors.forEach(t=>{let n=this.target.querySelector(t);n&&(e.push({selector:t,element:n}),n.remove())}),this.target.innerHTML=this.template(),e.forEach(({selector:e,element:t})=>{let n=this.target.querySelector(e);n&&n.parentNode.replaceChild(t,n)})}render(){this.element=this.target,this.target.innerHTML=this.template(),this.componentDidMount()}addEventDelegate(e,t,n){let r=e=>{let r=e.target.closest(t);r&&this.target.contains(r)&&n.call(this,e,r)};return this.target.addEventListener(e,r),this._handlers.has(e)||this._handlers.set(e,new Set),this._handlers.get(e).add(r),()=>this.removeEventHandler(e,r)}removeEventHandler(e,t){this.target.removeEventListener(e,t),this._handlers.get(e)?.delete(t)}componentWillUnmount(){this._handlers.forEach((e,t)=>{e.forEach(e=>{this.removeEventHandler(t,e)})}),this._handlers.clear()}},a=class extends i{constructor(e,t={}){super(e,t)}template(){return`
      <footer class="bg-white border-t border-gray-200 mt-auto fixed bottom-0 left-0 right-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
          <p class="text-sm mt-2">Made with ❤️ using Vanilla JavaScript</p>
        </div>
      </footer>
    `}},o=class{constructor(e={}){this.state={...e},this.subscribers=new Map,this.middlewares=[]}getState(){return{...this.state}}getStateByKey(e){return this.state[e]}setState(e,t,n=`UPDATE`){let r={...this.state},i=this.state[e];this.runMiddlewares(`BEFORE_SET`,{key:e,value:t,prevValue:i,action:n}),this.state[e]=t,this.runMiddlewares(`AFTER_SET`,{key:e,value:t,prevValue:i,action:n}),this.notify(e,t,i,n),this.notifyGlobal(this.state,r,n)}setStates(e,t=`BATCH_UPDATE`){let n={...this.state};this.runMiddlewares(`BEFORE_BATCH_SET`,{updates:e,prevState:n,action:t}),Object.entries(e).forEach(([e,t])=>{this.state[e]=t}),this.runMiddlewares(`AFTER_BATCH_SET`,{updates:e,prevState:n,action:t}),Object.entries(e).forEach(([e,r])=>{this.notify(e,r,n[e],t)}),this.notifyGlobal(this.state,n,t)}subscribe(e,t){return this.subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{this.unsubscribe(e,t)}}subscribeGlobal(e){return this.subscribe(`__GLOBAL__`,e)}unsubscribe(e,t){this.subscribers.has(e)&&(this.subscribers.get(e).delete(t),this.subscribers.get(e).size===0&&this.subscribers.delete(e))}unsubscribeAll(e){this.subscribers.delete(e)}clearSubscribers(){this.subscribers.clear()}notify(e,t,n,r){this.subscribers.has(e)&&this.subscribers.get(e).forEach(e=>{try{e(t,n,r)}catch(e){console.error(`구독자 콜백 실행 중 오류 발생:`,e)}})}notifyGlobal(e,t,n){this.subscribers.has(`__GLOBAL__`)&&this.subscribers.get(`__GLOBAL__`).forEach(r=>{try{r(e,t,n)}catch(e){console.error(`전역 구독자 콜백 실행 중 오류 발생:`,e)}})}addMiddleware(e){this.middlewares.push(e)}runMiddlewares(e,t){this.middlewares.forEach(n=>{try{n(e,t,this)}catch(e){console.error(`미들웨어 실행 중 오류 발생:`,e)}})}debug(){console.log(`=== Store Debug Info ===`),console.log(`State:`,this.state),console.log(`Subscribers:`,Array.from(this.subscribers.keys())),console.log(`Middlewares:`,this.middlewares.length),console.log(`========================`)}};const s=new o;var c=class{async getItem(e){throw Error(`getItem method must be implemented`)}async setItem(e,t){throw Error(`setItem method must be implemented`)}async removeItem(e){throw Error(`removeItem method must be implemented`)}async clear(){throw Error(`clear method must be implemented`)}},l=class extends c{constructor(){super(),this.isAvailable=typeof localStorage<`u`}async getItem(e){if(!this.isAvailable)return null;try{let t=localStorage.getItem(e);return t?JSON.parse(t):null}catch(e){return console.error(`localStorage getItem 오류:`,e),null}}async setItem(e,t){if(!this.isAvailable)return!1;try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(e){return console.error(`localStorage setItem 오류:`,e),!1}}async removeItem(e){if(!this.isAvailable)return!1;try{return localStorage.removeItem(e),!0}catch(e){return console.error(`localStorage removeItem 오류:`,e),!1}}async clear(){if(!this.isAvailable)return!1;try{return localStorage.clear(),!0}catch(e){return console.error(`localStorage clear 오류:`,e),!1}}},u=class extends c{constructor(){super(),this.isAvailable=typeof sessionStorage<`u`}async getItem(e){if(!this.isAvailable)return null;try{let t=sessionStorage.getItem(e);return t?JSON.parse(t):null}catch(e){return console.error(`sessionStorage getItem 오류:`,e),null}}async setItem(e,t){if(!this.isAvailable)return!1;try{return sessionStorage.setItem(e,JSON.stringify(t)),!0}catch(e){return console.error(`sessionStorage setItem 오류:`,e),!1}}async removeItem(e){if(!this.isAvailable)return!1;try{return sessionStorage.removeItem(e),!0}catch(e){return console.error(`sessionStorage removeItem 오류:`,e),!1}}async clear(){if(!this.isAvailable)return!1;try{return sessionStorage.clear(),!0}catch(e){return console.error(`sessionStorage clear 오류:`,e),!1}}},d=class extends c{constructor(e=`AppDB`,t=1){super(),this.dbName=e,this.version=t,this.storeName=`keyValueStore`,this.isAvailable=typeof indexedDB<`u`}async _getDB(){return this.isAvailable?new Promise((e,t)=>{let n=indexedDB.open(this.dbName,this.version);n.onerror=()=>t(n.error),n.onsuccess=()=>e(n.result),n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`key`})}}):null}async getItem(e){if(!this.isAvailable)return null;try{let t=await this._getDB(),n=t.transaction([this.storeName],`readonly`),r=n.objectStore(this.storeName);return new Promise((t,n)=>{let i=r.get(e);i.onerror=()=>n(i.error),i.onsuccess=()=>{let e=i.result;t(e?e.value:null)}})}catch(e){return console.error(`IndexedDB getItem 오류:`,e),null}}async setItem(e,t){if(!this.isAvailable)return!1;try{let n=await this._getDB(),r=n.transaction([this.storeName],`readwrite`),i=r.objectStore(this.storeName);return new Promise((n,r)=>{let a=i.put({key:e,value:t});a.onerror=()=>r(a.error),a.onsuccess=()=>n(!0)})}catch(e){return console.error(`IndexedDB setItem 오류:`,e),!1}}async removeItem(e){if(!this.isAvailable)return!1;try{let t=await this._getDB(),n=t.transaction([this.storeName],`readwrite`),r=n.objectStore(this.storeName);return new Promise((t,n)=>{let i=r.delete(e);i.onerror=()=>n(i.error),i.onsuccess=()=>t(!0)})}catch(e){return console.error(`IndexedDB removeItem 오류:`,e),!1}}async clear(){if(!this.isAvailable)return!1;try{let e=await this._getDB(),t=e.transaction([this.storeName],`readwrite`),n=t.objectStore(this.storeName);return new Promise((e,t)=>{let r=n.clear();r.onerror=()=>t(r.error),r.onsuccess=()=>e(!0)})}catch(e){return console.error(`IndexedDB clear 오류:`,e),!1}}};const f={STORAGE_TYPE:{LOCAL:`local`,SESSION:`session`,INDEXED_DB:`indexeddb`},DEFAULT_OPTIONS:{storageType:`local`,storageKey:`persist-store`,whitelist:[],blacklist:[],transforms:[],debounceTime:0,version:1}};var p=class{constructor(e,t={}){this.store=e,this.options={...f.DEFAULT_OPTIONS,...t},this.storage=this._createStorageAdapter(),this.saveTimeout=null,this.isInitialized=!1,this.initialize()}_createStorageAdapter(){switch(this.options.storageType){case f.STORAGE_TYPE.LOCAL:return new l;case f.STORAGE_TYPE.SESSION:return new u;case f.STORAGE_TYPE.INDEXED_DB:return new d;default:return console.warn(`지원하지 않는 저장소 타입:`,this.options.storageType),new l}}async initialize(){try{await this.restore(),this.setupPersistMiddleware(),this.isInitialized=!0}catch(e){console.error(`PersistStore 초기화 오류:`,e)}}async restore(){try{let e=await this.storage.getItem(this.options.storageKey);if(e&&e.version===this.options.version){let{state:t}=e,n=this._filterStateForRestore(t),r=this._applyTransforms(n,`restore`);this.store.setStates(r,`RESTORE_STATE`),console.log(`[PersistStore] 상태 복원 완료:`,Object.keys(r))}}catch(e){console.error(`상태 복원 오류:`,e)}}async save(){if(this.isInitialized)try{let e=this.store.getState(),t=this._filterStateForSave(e),n=this._applyTransforms(t,`save`),r={state:n,timestamp:Date.now(),version:this.options.version};await this.storage.setItem(this.options.storageKey,r),console.log(`[PersistStore] 상태 저장 완료:`,Object.keys(n))}catch(e){console.error(`상태 저장 오류:`,e)}}debouncedSave(){this.options.debounceTime>0?(clearTimeout(this.saveTimeout),this.saveTimeout=setTimeout(()=>{this.save()},this.options.debounceTime)):this.save()}setupPersistMiddleware(){let e=(e,t)=>{(e===`AFTER_SET`||e===`AFTER_BATCH_SET`)&&t.action!==`RESTORE_STATE`&&this.debouncedSave()};this.store.addMiddleware(e)}_filterStateForSave(e){let{whitelist:t,blacklist:n}=this.options,r={...e};return t.length>0&&(r={},t.forEach(t=>{Object.hasOwn(e,t)&&(r[t]=e[t])})),n.length>0&&n.forEach(e=>{delete r[e]}),r}_filterStateForRestore(e){return this._filterStateForSave(e)}_applyTransforms(e,t){return this.options.transforms.reduce((e,n)=>{try{return t===`save`&&n.out?n.out(e):t===`restore`&&n.in?n.in(e):e}catch(t){return console.error(`변환 함수 적용 오류:`,t),e}},e)}async clear(){try{await this.storage.removeItem(this.options.storageKey),console.log(`[PersistStore] 저장된 데이터 삭제 완료`)}catch(e){console.error(`저장된 데이터 삭제 오류:`,e)}}async clearAll(){try{await this.storage.clear(),console.log(`[PersistStore] 저장소 전체 초기화 완료`)}catch(e){console.error(`저장소 전체 초기화 오류:`,e)}}};const m=(e,t={})=>new p(e,t);var h=m;const g={items:[],count:0,totalPrice:0,isVisible:!1,selectedItems:[],isAllSelected:!1};var _=class extends o{constructor(){super(g),this.setupPersistStore()}setupInitial(){localStorage.getItem(`shopping_cart`)||localStorage.setItem(`shopping_cart`,JSON.stringify(g))}resetInitialState(){this.state={...g}}setupPersistStore(){this.persistStore=h(this,{storageType:`local`,storageKey:`shopping_cart`,whitelist:[`items`,`count`,`totalPrice`,`selectedItems`,`isAllSelected`],debounceTime:0,version:1,transforms:[{out:e=>({...e,items:e.items?.map(e=>({id:e.id,title:e.title,lprice:e.lprice,image:e.image,quantity:e.quantity||1,addedAt:e.addedAt||Date.now()}))||[]}),in:e=>{let t=e.items?.filter(e=>e.addedAt>Date.now()-7*24*60*60*1e3)||[],n=t.reduce((e,t)=>e+parseInt(t.lprice)*(t.quantity||1),0),r=new Set(t.map(e=>e.id)),i=(e.selectedItems||[]).filter(e=>r.has(e));return{...e,items:t,count:t.length,totalPrice:n,selectedItems:i,isAllSelected:t.length>0&&i.length===t.length}}}]})}getItems(){return this.getStateByKey(`items`)||[]}getCount(){return this.getStateByKey(`count`)||0}getTotalPrice(){return this.getStateByKey(`totalPrice`)||0}getIsVisible(){return this.getStateByKey(`isVisible`)||!1}getSelectedItems(){return this.getStateByKey(`selectedItems`)||[]}getIsAllSelected(){return this.getStateByKey(`isAllSelected`)||!1}calculateTotalPrice(e){return e.reduce((e,t)=>e+parseInt(t.lprice)*(t.quantity||1),0)}addItem(e){let t=this.getItems(),n=t.findIndex(t=>t.id===e.id),r;r=n===-1?[...t,{...e,quantity:1,addedAt:Date.now()}]:t.map((e,t)=>t===n?{...e,quantity:(e.quantity||1)+1}:e),this.updateCartState(r,`ADD_ITEM`)}bulkAddItem(e,t){let n=this.getItems(),r=n.findIndex(t=>t.id===e.id),i;i=r===-1?[...n,{...e,quantity:t,addedAt:Date.now()}]:n.map((e,n)=>n===r?{...e,quantity:(e.quantity||1)+t}:e),this.updateCartState(i,`BULK_ADD_ITEM`)}removeItem(e){let t=this.getItems(),n=t.filter(t=>t.id!==e),r=this.getSelectedItems(),i=r.filter(t=>t!==e);this.updateCartStateWithSelection(n,i,`REMOVE_ITEM`)}updateItemQuantity(e,t){if(t<=0){this.removeItem(e);return}let n=this.getItems(),r=n.map(n=>n.id===e?{...n,quantity:t}:n);this.updateCartState(r,`UPDATE_QUANTITY`)}increaseItemQuantity(e){let t=this.getItems(),n=t.find(t=>t.id===e);n&&this.updateItemQuantity(e,(n.quantity||1)+1)}decreaseItemQuantity(e){let t=this.getItems(),n=t.find(t=>t.id===e);n&&this.updateItemQuantity(e,Math.max(0,(n.quantity||1)-1))}clearCart(){this.updateCartStateWithSelection([],[],`CLEAR_CART`)}selectAll(e){let t=this.getItems(),n=e?t.map(e=>e.id):[];this.setStates({selectedItems:n,isAllSelected:e},`SELECT_ALL`)}selectItem(e,t){let n=this.getSelectedItems(),r;r=t?[...new Set([...n,e])]:[...new Set(n.filter(t=>t!==e))];let i=this.getItems(),a=i.length>0&&r.length===i.length;this.setStates({selectedItems:r,isAllSelected:a},`SELECT_ITEM`)}removeSelectedItems(){let e=this.getItems(),t=this.getSelectedItems(),n=e.filter(e=>!t.includes(e.id));this.updateCartStateWithSelection(n,[],`REMOVE_SELECTED`)}toggleVisibility(){this.setState(`isVisible`,!this.getIsVisible(),`TOGGLE_VISIBILITY`)}showCart(){this.setState(`isVisible`,!0,`SHOW_CART`)}hideCart(){this.setState(`isVisible`,!1,`HIDE_CART`)}updateCartState(e,t){let n=this.calculateTotalPrice(e);this.setStates({items:e,count:e.length,totalPrice:n},t)}updateCartStateWithSelection(e,t,n){let r=this.calculateTotalPrice(e),i=e.length>0&&t.length===e.length;this.setStates({items:e,count:e.length,totalPrice:r,selectedItems:t,isAllSelected:i},n)}hasItem(e){return this.getItems().some(t=>t.id===e)}getItemQuantity(e){let t=this.getItems().find(t=>t.id===e);return t?t.quantity||1:0}isItemSelected(e){return this.getSelectedItems().includes(e)}getSelectedItemsTotal(){let e=this.getItems(),t=this.getSelectedItems();return e.filter(e=>t.includes(e.id)).reduce((e,t)=>e+parseInt(t.lprice)*(t.quantity||1),0)}getSummary(){let e=this.getItems(),t=e.reduce((e,t)=>e+(t.quantity||1),0),n=this.getSelectedItems();return{itemCount:e.length,totalQuantity:t,totalPrice:this.getTotalPrice(),isEmpty:e.length===0,selectedCount:n.length,selectedTotal:this.getSelectedItemsTotal(),isAllSelected:this.getIsAllSelected()}}reset(){this.subscribers.clear(),this.state={...g},typeof window<`u`&&window.localStorage.removeItem(`shopping_cart`),this.setupPersistStore(),this.notify(`RESET`)}};const v=new _;var y=v;const ee=e=>{try{return!e||!e.id?(console.error(`상품 정보가 올바르지 않습니다.`,e),!1):(y.addItem(e),!0)}catch(e){return console.error(`장바구니 추가 중 오류:`,e),!1}},te=(e,t)=>{try{return!e||!e.id?(console.error(`상품 정보가 올바르지 않습니다.`,e),!1):(y.bulkAddItem(e,t),!0)}catch(e){return console.error(`장바구니 추가 중 오류:`,e),!1}},ne=e=>{try{return e?(y.removeItem(e),console.log(`상품이 장바구니에서 제거되었습니다.`),!0):(console.error(`상품 ID가 제공되지 않았습니다.`),!1)}catch(e){return console.error(`장바구니 제거 중 오류:`,e),!1}},b=(e,t)=>{try{return!e||t<0?(console.error(`잘못된 파라미터:`,{productId:e,quantity:t}),!1):(y.updateItemQuantity(e,t),!0)}catch(e){return console.error(`수량 업데이트 중 오류:`,e),!1}},x=()=>{try{return y.clearCart(),console.log(`장바구니가 비워졌습니다.`),!0}catch(e){return console.error(`장바구니 비우기 중 오류:`,e),!1}},S=e=>{try{return y.selectAll(e),console.log(e?`전체 선택됨`:`전체 선택 해제됨`),!0}catch(e){return console.error(`전체 선택 중 오류:`,e),!1}},C=(e,t)=>{try{return e?(y.selectItem(e,t),!0):(console.error(`상품 ID가 제공되지 않았습니다.`),!1)}catch(e){return console.error(`아이템 선택 중 오류:`,e),!1}},w=()=>{try{let e=y.getSelectedItems().length;return e===0?(console.warn(`선택된 아이템이 없습니다.`),!1):(y.removeSelectedItems(),console.log(`선택된 ${e}개 아이템이 삭제되었습니다.`),!0)}catch(e){return console.error(`선택된 아이템 삭제 중 오류:`,e),!1}},T=()=>{try{y.showCart()}catch(e){console.error(`장바구니 모달 표시 중 오류:`,e)}},E=()=>{try{y.hideCart()}catch(e){console.error(`장바구니 모달 숨김 중 오류:`,e)}},D=()=>y.getItems(),O=()=>y.getCount(),k=()=>y.getSummary(),A=e=>y.isItemSelected(e),j=e=>y.subscribe(`count`,e),M=e=>y.subscribe(`isVisible`,e),N=e=>y.subscribeGlobal(e);var P=class extends i{constructor(e,t){super(e,t),this.unsubscribeCart=null}initialState(){this.state={items:[],summary:{itemCount:0,totalQuantity:0,totalPrice:0,isEmpty:!0,selectedCount:0,selectedTotal:0,isAllSelected:!1}},super.initialState()}componentDidMount(){this.initializeEventHandlers(),this.initializeCartSubscription()}componentWillUnmount(){this.unsubscribeCart&&this.unsubscribeCart(),this.eventListenerAttached&&(this.target.removeEventListener(`click`,this.handleClick),document.removeEventListener(`keydown`,this.handleKeyDown),this.eventListenerAttached=!1)}initializeEventHandlers(){this.eventListenerAttached||(this.eventListenerAttached=!0,this.handleClick=e=>{let t=e.target;if(t.matches(`.cart-modal-overlay`)||t.closest(`[data-action="close-modal"]`)||t.closest(`#cart-modal-close-btn`)){this.close();return}if(t.closest(`.quantity-increase-btn`)){let e=t.closest(`.quantity-increase-btn`).dataset.productId;this.handleIncreaseQuantity(e);return}if(t.closest(`.quantity-decrease-btn`)){let e=t.closest(`.quantity-decrease-btn`).dataset.productId;this.handleDecreaseQuantity(e);return}if(t.matches(`[data-action="remove-item"]`)||t.matches(`.cart-item-remove-btn`)){let e=t.dataset.productId;this.handleRemoveItem(e);return}if(t.matches(`[data-action="clear-cart"]`)||t.closest(`#cart-modal-clear-cart-btn`)){this.handleClearCart();return}if(t.matches(`#cart-modal-select-all-checkbox`)){this.handleSelectAll(t.checked);return}if(t.matches(`.cart-item-checkbox`)){let e=t.dataset.productId;this.handleItemSelect(e,t.checked);return}if(t.matches(`[data-action="remove-selected"]`)||t.closest(`#cart-modal-remove-selected-btn`)){this.handleRemoveSelected();return}},this.handleKeyDown=e=>{e.key===`Escape`&&this.props.isVisible&&this.close()},this.target.addEventListener(`click`,this.handleClick),document.addEventListener(`keydown`,this.handleKeyDown))}initializeCartSubscription(){this.updateCartData(),this.unsubscribeCart=N(()=>{this.updateCartData()})}updateCartData(){let e=D(),t=k();this.setState({items:e,summary:t})}close(){this.props.onClose&&this.props.onClose()}handleRemoveItem(e){ne(e)}handleIncreaseQuantity(e){let t=D().find(t=>t.id===e);t&&b(e,t.quantity+1)}handleDecreaseQuantity(e){let t=this.state.items.find(t=>t.id===e);t&&t.quantity>1&&b(e,t.quantity-1)}handleClearCart(){x(),this.props.toast.show(`info`,`장바구니가 모두 비워졌습니다.`)}handleSelectAll(e){S(e)}handleItemSelect(e,t){C(e,t)}handleRemoveSelected(){let e=this.state.summary.selectedCount;if(e===0){this.props.toast.show(`info`,`선택된 상품이 없습니다.`);return}w(),this.props.toast.show(`info`,`선택된 상품들이 삭제되었습니다.`)}template(){if(!this.props.isVisible)return``;let e=k(),t=e.itemCount>0;return`
      <!-- 모달 오버레이 -->
      <div class="cart-modal-overlay flex min-h-full items-center justify-center p-0 sm:p-4 fixed inset-0 bg-black bg-opacity-50 z-50">
      
        <!-- 모달 컨테이너 -->
        <div class="cart-modal relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                />
              </svg>
              장바구니
              ${t?`<span class="text-sm font-normal text-gray-600 ml-1">(${e.itemCount})</span>`:``}
            </h2>
            <button 
              data-action="close-modal"
              id="cart-modal-close-btn"
              class="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            ${e.isEmpty?this.emptyCartTemplate():this.cartWithItemsTemplate()}
          </div>

          <!-- 푸터 (총 가격 및 액션 버튼) -->
          ${e.isEmpty?``:this.cartFooterTemplate()}
        </div>
      </div>
    `}emptyCartTemplate(){return`
      <!-- 빈 장바구니 -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            장바구니가 비어있습니다
          </h3>
          <p class="text-gray-600">
            원하는 상품을 담아보세요!
          </p>
        </div>
      </div>
    `}cartWithItemsTemplate(){let e=k();return`
      <!-- 전체 선택 섹션 -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <label class="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            id="cart-modal-select-all-checkbox" 
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            ${e.isAllSelected?`checked`:``}
          >
          전체선택 (${e.itemCount}개)
        </label>
      </div>
      
      <!-- 아이템 목록 -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-4">
          ${this.state.items.map(e=>this.cartItemTemplate(e)).join(``)}
        </div>
      </div>
    `}cartItemTemplate(e){let t=A(e.id);return`
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${e.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input 
            type="checkbox" 
            class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
            data-product-id="${e.id}"
            ${t?`checked`:``}
          >
        </label>
        
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img 
            src="${e.image}" 
            alt="${e.title}" 
            class="w-full h-full object-cover cursor-pointer cart-item-image" 
            data-product-id="${e.id}"
          >
        </div>
        
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" 
              data-product-id="${e.id}">
            ${e.title}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            ${parseInt(e.lprice).toLocaleString()}원
          </p>
          
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button 
              data-action="decrease-quantity" 
              data-product-id="${e.id}"
              class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input 
              type="number" 
              value="${e.quantity}" 
              min="1" 
              data-testid="quantity-input"
              class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
              disabled 
              data-product-id="${e.id}"
            >
            <button 
              data-action="increase-quantity" 
              data-product-id="${e.id}"
              class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">
            ${(parseInt(e.lprice)*e.quantity).toLocaleString()}원
          </p>
          <button 
            data-action="remove-item" 
            data-product-id="${e.id}"
            class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800"
          >
            삭제
          </button>
        </div>
      </div>
    `}cartFooterTemplate(){let{selectedCount:e,selectedTotal:t}=k();return`
      <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <!-- 선택된 아이템 정보 -->
        ${e>0?`
            <div class="flex justify-between items-center mb-3 text-sm">
              <span class="text-gray-600">선택한 상품 (${e}개)</span>
              <span class="font-medium">${t.toLocaleString()}원</span>
            </div>
          `:``}
        
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">
            ${this.state.summary.totalPrice.toLocaleString()}원
          </span>
        </div>
        
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${e>0?`
              <button
                data-action="remove-selected"
                id="cart-modal-remove-selected-btn"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                선택한 상품 삭제 (${e}개)
              </button>
            `:``}
          <div class="flex gap-2">
            <button 
              data-action="clear-cart"
              id="cart-modal-clear-cart-btn"
              class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              전체 비우기
            </button>
            <button 
              id="cart-modal-checkout-btn" 
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    `}},F=class extends i{constructor(e,t){super(e,t),this.timeoutId=null}initialState(){this.state={isVisible:!1,type:`success`,message:``},super.initialState()}componentDidMount(){this.initializeEventHandlers()}componentWillUnmount(){this.timeoutId&&clearTimeout(this.timeoutId)}initializeEventHandlers(){this.target.addEventListener(`click`,e=>{e.target.closest(`#toast-close-btn`)&&this.hide()})}show(e=`success`,t=``,n=3e3){this.setState({isVisible:!0,type:e,message:t}),this.timeoutId&&clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.hide()},n)}hide(){this.setState({isVisible:!1}),this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null)}getToastConfig(){let e={success:{bgColor:`bg-green-600`,icon:`
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        `},info:{bgColor:`bg-blue-600`,icon:`
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        `},error:{bgColor:`bg-red-600`,icon:`
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `}};return e[this.state.type]||e.success}template(){if(!this.state.isVisible)return``;let e=this.getToastConfig();return`
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-up">
        <div class="${e.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            ${e.icon}
          </div>
          <p class="text-sm font-medium">${this.state.message}</p>
          <button 
            id="toast-close-btn" 
            class="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    `}},I=class extends i{constructor(e){super(e,{preserveSelectors:[`#main`,`#header-container`]}),this.state={cartModalVisible:!1},this.footerComponent=null,this.cartModalComponent=null,this.toastComponent=null,this.unsubscribeCartVisibility=null}initialState(){super.initialState()}componentDidMount(){this.initializeComponent(),this.initializeToast(),this.initializeCartVisibilitySubscription(),this.createCartModal()}componentDidUpdate(e,t,n){this.initializeComponent(),this.initializeToast(),this.createCartModal(n.cartModalVisible),n.cartModalVisible&&this.cartModalComponent.render()}componentWillUnmount(){this.footerComponent&&this.footerComponent.componentWillUnmount?.(),this.cartModalComponent&&this.cartModalComponent.componentWillUnmount?.(),this.toastComponent&&this.toastComponent.componentWillUnmount?.(),this.unsubscribeCartVisibility&&this.unsubscribeCartVisibility()}initializeComponent(){let e=this.target.querySelector(`#footer-container`);e&&(this.footerComponent=new a(e,{}))}initializeToast(){let e=this.target.querySelector(`#toast-container`);e&&!this.toastComponent&&(this.toastComponent=new F(e))}initializeCartVisibilitySubscription(){this.unsubscribeCartVisibility=M(e=>{this.state.cartModalVisible!==e&&(this.setState({cartModalVisible:e}),document.body.style.overflow=e?`hidden`:``)})}createCartModal(e){let t=this.target.querySelector(`#cart-modal-container`);t&&(this.cartModalComponent=new P(t,{now:Date.now(),isVisible:e,onClose:()=>this.closeCartModal(),toast:this.toastComponent}))}closeCartModal(){E()}template(){return`
      <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- 헤더 컨테이너 -->
        <div id="header-container"></div>
        
        <!-- 메인 콘텐츠 -->
        <div class="max-w-md mx-auto px-4 py-4 mt-[72px] mb-[116px]">
          <div id="main" class="flex-1"></div>
        </div>
        
        <!-- 푸터 컨테이너 -->
        <div id="footer-container"></div>
        
        <!-- 장바구니 모달 컨테이너 -->
        <div id="cart-modal-container"></div>

        <!-- 토스트 컨테이너 -->
        <div id="toast-container"></div>
      </div>
    `}};async function L(e={}){let{limit:t=20,search:n=``,category1:r=``,category2:i=``,sort:a=`price_asc`}=e,o=e.current??e.page??1,s=new URLSearchParams({page:o.toString(),limit:t.toString(),...n&&{search:n},...r&&{category1:r},...i&&{category2:i},sort:a}),c=await fetch(`/api/products?${s}`);return await c.json()}async function R(e){let t=await fetch(`/api/products/${e}`);return await t.json()}async function z(){let e=await fetch(`/api/categories`);return await e.json()}var B=class{static INITIAL_STATE={loading:!0,isError:!1,products:[],categories:[],pagination:{hasNext:!1,hasPrev:!1,limit:20,page:1,total:0,totalPages:0},filters:{search:``,category1:``,category2:``,sort:`price_asc`}};static MESSAGES={LOADING_CATEGORIES:`카테고리 로딩 중...`,LOADING_PRODUCTS:`상품을 불러오는 중...`,LOADING_MORE_PRODUCTS:`상품을 불러오는 중...`,LOAD_MORE_ERROR:`상품을 불러오는데 실패했습니다.`,ALL_PRODUCTS_LOADED:`모든 상품을 확인했습니다`,CART_SUCCESS:`장바구니에 추가되었습니다`,ERROR_GENERAL:`오류가 발생했습니다. 다시 시도해주세요.`,ERROR_PRODUCT_ID:`상품 ID를 찾을 수 없습니다.`,ERROR_PRODUCT_INFO:`상품 정보를 찾을 수 없습니다.`,REFRESH_BUTTON:`새로고침`,SEARCH_PLACEHOLDER:`상품명을 검색해보세요...`,CART_BUTTON:`장바구니 담기`,CATEGORY_ALL:`전체`,COUNT_LABEL:`개수:`,SORT_LABEL:`정렬:`,CATEGORY_LABEL:`카테고리:`,TOTAL_PRODUCTS:`총`,PRODUCTS_UNIT:`개`,PRODUCTS_SUFFIX:`의 상품`};static SORT_OPTIONS=[{value:`price_asc`,label:`가격 낮은순`},{value:`price_desc`,label:`가격 높은순`},{value:`name_asc`,label:`이름순`},{value:`name_desc`,label:`이름 역순`}];static LIMIT_OPTIONS=[10,20,50,100];static DEBOUNCE_TIME=300};function V(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`)if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=V(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n);return r}function H(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=V(e))&&(r&&(r+=` `),r+=t);return r}var U=class extends i{constructor(e){super(e),this.toast=null,this.intersectionObserver=null,this.isLoadingMore=!1,this.currentSearchValue=``}initialState(){let e=this.getInitialStateFromURL();this.setState(e)}getInitialStateFromURL(){let e=ie(),t={...B.INITIAL_STATE},n=e.get(`search`),r=e.get(`sort`),i=e.get(`limit`),a=e.get(`category1`),o=e.get(`category2`);return n&&(t.filters.search=n),r&&B.SORT_OPTIONS.some(e=>e.value===r)&&(t.filters.sort=r),i&&B.LIMIT_OPTIONS.includes(parseInt(i))&&(t.pagination.limit=parseInt(i)),a&&(t.filters.category1=a),o&&(t.filters.category2=o),t}updateURLParams(){let e={search:this.state.filters.search,sort:this.state.filters.sort,limit:this.state.pagination.limit,category1:this.state.filters.category1,category2:this.state.filters.category2};ae(e,{})}async componentDidMount(){await this.fetchAsyncData(),this.initializeEventHandlers(),this.initializeToast(),this.setupIntersectionObserver(),this.setupScrollListener()}componentWillUnmount(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),this.handleScroll&&window.removeEventListener(`scroll`,this.handleScroll)}initializeToast(){let e=document.getElementById(`toast-container`);e&&(this.toast=new F(e))}handleAddToCart(e){e.preventDefault();let t=e.target.dataset.productId;if(!t){console.error(B.MESSAGES.ERROR_PRODUCT_ID);return}let n=this.state.products.find(e=>e.productId===t);if(!n){console.error(B.MESSAGES.ERROR_PRODUCT_INFO);return}let r={id:n.productId,title:n.title,lprice:n.lprice,image:n.image},i=ee(r);i&&this.showAddToCartFeedback()}showAddToCartFeedback(){this.toast&&this.toast.show(`success`,B.MESSAGES.CART_SUCCESS)}handleChangeSearch(e){this.currentSearchValue=e.target.value}handleFormSubmit(e){e.preventDefault();let t=document.activeElement?.id===`search-input`,n=this.target.querySelector(`#search-input`),r=n?n.value:``;this.setState({filters:{...this.state.filters,search:r}}),t&&setTimeout(()=>{let e=this.target.querySelector(`#search-input`);if(e){e.focus();let t=e.value.length;e.setSelectionRange(t,t)}},0)}handleChangeLimit(e){this.setState({pagination:{...this.state.pagination,limit:parseInt(e.target.value)}})}handleChangeSort(e){this.setState({filters:{...this.state.filters,sort:e.target.value}})}handleProductCardClick(e){let t=e.target.closest(`#product-card`),n=t.dataset.productId;if(!n){console.error(`상품 ID를 찾을 수 없습니다.`);return}Z(Q(`/product/${n}`))}handleCategoryFilter(e){let{depth:t,category:n}=e.target.dataset;t===`1`?this.setState({filters:{...this.state.filters,category1:n}}):t===`2`&&this.setState({filters:{...this.state.filters,category2:n}})}handleBreadCrumbClick(e){let{breadcrumb:t}=e.target.dataset;t===`reset`?this.setState({filters:{...this.state.filters,category1:``,category2:``}}):t===`category1`&&this.setState({filters:{...this.state.filters,category2:``}})}getStateChanges(e,t){return{search:e.filters.search!==t.filters.search,sort:e.filters.sort!==t.filters.sort,category1:e.filters.category1!==t.filters.category1,category2:e.filters.category2!==t.filters.category2,limit:e.pagination.limit!==t.pagination.limit}}needsDataRefresh(e){return e.sort||e.category1||e.category2||e.limit}componentDidUpdate(e,t,n){if(n.loading)return;let r=this.getStateChanges(t,n);Object.values(r).some(Boolean)&&this.updateURLParams();let i=this.needsDataRefresh(r);i&&this.fetchAsyncData(!0),r.search&&this.fetchAsyncData(!0)}setupIntersectionObserver(){this.intersectionObserver&&this.intersectionObserver.disconnect();let e={root:null,rootMargin:`100px`,threshold:.1};this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&this.canLoadMore()&&this.loadMoreProducts()})},e);let t=this.target.querySelector(`#product-intersection-target`);t&&this.intersectionObserver.observe(t)}setupScrollListener(){this.handleScroll=()=>{let e=document.documentElement.scrollHeight,t=document.documentElement.scrollTop||document.body.scrollTop,n=document.documentElement.clientHeight;t+n>=e-100&&this.canLoadMore()&&this.loadMoreProducts()},window.addEventListener(`scroll`,this.handleScroll)}canLoadMore(){return!this.state.loading&&!this.isLoadingMore&&this.hasMorePages()&&!this.state.isError}hasMorePages(){let{page:e,limit:t,total:n}=this.state.pagination,r=Math.ceil(n/t);return e<r}async loadMoreProducts(){if(this.canLoadMore())try{this.isLoadingMore=!0;let e=this.state.pagination.page+1,t={page:e,limit:this.state.pagination.limit,search:this.state.filters.search,category1:this.state.filters.category1,category2:this.state.filters.category2,sort:this.state.filters.sort},n=await L(t),r=[...this.state.products,...n.products];this.setState({products:r,pagination:n.pagination,loading:!1}),setTimeout(()=>{this.setupIntersectionObserver()},0)}catch(e){console.error(`추가 상품 로드 실패:`,e),this.toast&&this.toast.show(`error`,B.MESSAGES.LOAD_MORE_ERROR)}finally{this.isLoadingMore=!1}}async fetchAsyncData(e=!0){try{this.setState({loading:!0});let t={page:e?1:this.state.pagination.page,limit:this.state.pagination.limit,search:this.state.filters.search,category1:this.state.filters.category1,category2:this.state.filters.category2,sort:this.state.filters.sort},[n,r]=await Promise.all([L(t),z()]);this.setState({loading:!1,pagination:n.pagination,products:n.products,categories:r}),e&&setTimeout(()=>{this.setupIntersectionObserver()},0)}catch{this.setState({isError:!0})}}generateSelectOptions(e,t,n=``){return e.map(e=>{let r=typeof e==`object`?e.value:e,i=typeof e==`object`?e.label:`${e}${n}`,a=t===r;return`<option value="${r}" ${a?`selected`:``}>${i}</option>`}).join(``)}template(){if(this.state.isError)return`
        <div class="min-h-screen bg-gray-50">
          <main class="max-w-md m-auto px-4 py-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div class="flex flex-col gap-2 text-center text-red-500">
                <p>${B.MESSAGES.ERROR_GENERAL}</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick="window.location.reload()">${B.MESSAGES.REFRESH_BUTTON}</button>
              </div>
            </div>
          </main>
        </div>
      `;let e=Object.keys(this.state.categories),t=Object.keys(this.state.categories[this.state.filters.category1]??{}),n=this.state.filters.category1===``,r=this.state.filters.category1!==``;return`
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <form id="search-form">
              <input
                type="text"
                id="search-input"
                placeholder="${B.MESSAGES.SEARCH_PLACEHOLDER}"
                value="${this.state.filters.search}"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                
              />
            </form>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${B.MESSAGES.CATEGORY_LABEL}</label>

              <button id="bread-crumb-btn" data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
                ${B.MESSAGES.CATEGORY_ALL}
              </button>

              ${this.state.filters.category1===``?``:`
                    <span class="text-xs text-gray-500">&gt;</span>
                    <button id="bread-crumb-btn" data-breadcrumb="category1" data-category1="${this.state.filters.category1}" class="text-xs hover:text-blue-800 hover:underline">
                      ${this.state.filters.category1}
                    </button>
                  `}
              
              ${this.state.filters.category2===``?``:`
                    <span class="text-xs text-gray-500">&gt;</span>
                    <button id="bread-crumb-btn" data-breadcrumb="category2" data-category2="${this.state.filters.category2}" class="text-xs hover:text-blue-800 hover:underline">
                      ${this.state.filters.category2}
                    </button>
                  `}
            </div>
            <div class="flex flex-wrap gap-2">
              ${this.state.loading?`<div class="text-sm text-gray-500 italic">${B.MESSAGES.LOADING_CATEGORIES}</div>`:``}
            </div>
          </div>
          <div class="space-y-2">
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              ${n?e.map(e=>{let t=this.state.filters.category1===e,n=H(`category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 hover:bg-gray-50`,t?`text-blue-800`:`text-gray-700`);return`
                          <button
                            id="category-filter-btn"
                            data-depth="1"
                            data-category="${e}"
                            class="${n}"
                          >
                            ${e}
                          </button>
                      `}).join(``):``}
            </div>
            <!-- 2depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              ${r?t.map(e=>{let t=this.state.filters.category2===e,n=H(`category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 hover:bg-gray-50`,t?`text-blue-800`:`text-gray-700`);return`
                          <button
                            id="category-filter-btn"
                            data-depth="2"
                            data-category="${e}"
                            class="${n}"
                          >
                            ${e}
                          </button>
                      `}).join(``):``}
            </div>
          </div>
          
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${B.MESSAGES.COUNT_LABEL}</label>
              <select 
                id="limit-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value="${this.state.pagination.limit}"
              >
                ${this.generateSelectOptions(B.LIMIT_OPTIONS,this.state.pagination.limit,`개`)}
              </select>
            </div>
            
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${B.MESSAGES.SORT_LABEL}</label>
              <select 
                id="sort-select" 
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                ${this.generateSelectOptions(B.SORT_OPTIONS,this.state.filters.sort)}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          ${this.state.loading?`
              <div class="mb-4 text-sm text-gray-600">
                ${B.MESSAGES.LOADING_PRODUCTS}
              </div>
              `:`
              <div class="mb-4 text-sm text-gray-600">
              ${B.MESSAGES.TOTAL_PRODUCTS} <span class="font-medium text-gray-900">${this.state.pagination.total}${B.MESSAGES.PRODUCTS_UNIT}</span>${B.MESSAGES.PRODUCTS_SUFFIX}
              </div>
            `}
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${this.state.loading?this.productSkeletonTemplate().repeat(this.state.pagination.limit):this.productGridTemplate(this.state.products)}
          </div>

          <div id="product-intersection-target" class="h-4 w-full"></div>

          ${this.state.loading&&this.state.products.length===0?`
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path 
                    class="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span class="text-sm text-gray-600">${B.MESSAGES.LOADING_PRODUCTS}</span>
              </div>
            </div>  
          `:this.isLoadingMore?`
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path 
                    class="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                                <span class="text-sm text-gray-600">${B.MESSAGES.LOADING_MORE_PRODUCTS}</span>
              </div>
            </div>  
          `:this.state.products.length>0&&!this.hasMorePages()?`
            <div class="text-center py-8">
              <p class="text-sm text-gray-500">${B.MESSAGES.ALL_PRODUCTS_LOADED}</p>
            </div>
          `:``}
        </div>
      </div>
    `}productSkeletonTemplate(){return`
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    `}productGridTemplate(e=[]){return e.map(e=>`
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" id="product-card" data-product-id="${e.productId}">
            <!-- 상품 이미지 -->
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img
                src="${e.image}"
                alt="${e.title}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
            
            <!-- 상품 정보 -->
            <div class="p-3">
              <div class="cursor-pointer product-info mb-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  ${e.title}
                </h3>
                <p class="text-xs text-gray-500 mb-2">${e.brand}</p>
                <p class="text-lg font-bold text-gray-900">
                  ${parseInt(e.lprice).toLocaleString()}원
                </p>
              </div>
              
              <!-- 장바구니 버튼 -->
              <button 
                class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${e.productId}"
                id="add-to-cart-btn"
              >
                ${B.MESSAGES.CART_BUTTON}
              </button>
            </div>
          </div>
        `).join(``)}initializeEventHandlers(){this.addEventDelegate(`submit`,`form`,e=>{this.handleFormSubmit(e)}),this.addEventDelegate(`input`,`#search-input`,e=>{this.handleChangeSearch(e)}),this.addEventDelegate(`change`,`#limit-select`,e=>{this.handleChangeLimit(e)}),this.addEventDelegate(`change`,`#sort-select`,e=>{this.handleChangeSort(e)}),this.addEventDelegate(`click`,`#add-to-cart-btn`,e=>{e.stopPropagation(),this.handleAddToCart(e)}),this.addEventDelegate(`click`,`#category-filter-btn`,e=>{e.stopPropagation(),this.handleCategoryFilter(e)}),this.addEventDelegate(`click`,`#bread-crumb-btn`,e=>{e.stopPropagation(),this.handleBreadCrumbClick(e)}),this.addEventDelegate(`click`,`#product-card`,e=>{e.target.closest(`button`)||this.handleProductCardClick(e)})}},W=class extends i{constructor(e){super(e)}componentDidMount(){this.initializeEventHandlers()}initializeEventHandlers(){this.target.addEventListener(`click`,e=>{e.target.matches(`[data-action="go-home"]`)&&(e.preventDefault(),this.handleGoHome()),e.target.matches(`[data-action="go-back"]`)&&(e.preventDefault(),this.handleGoBack())})}handleGoHome(){Z(Q(`/`))}handleGoBack(){window.history.length>1?window.history.back():Z(Q(`/`))}template(){return`
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
          <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="404 페이지를 찾을 수 없습니다">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
              </linearGradient>
              <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
              </filter>
            </defs>
            
            <!-- 404 Numbers -->
            <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">
              404
            </text>
            
            <!-- Icon decoration -->
            <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            
            <!-- Message -->
            <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">
              페이지를 찾을 수 없습니다
            </text>
            
            <!-- Subtle bottom accent -->
            <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
          </svg>
          
          <a href="/" data-link="/" data-action="go-home" class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
        </div>
      </main>
    `}},G=class{static INITIAL_STATE={loading:!0,isError:!1,quantity:1}},K=class extends i{constructor(e,t={}){super(e),this.productId=t.id,this.toast=null}initialState(){this.setState(G.INITIAL_STATE)}initializeEventHandlers(){this.addEventDelegate(`click`,`#quantity-increase`,()=>{this.handleIncreaseQuantity()}),this.addEventDelegate(`click`,`#quantity-decrease`,()=>{this.handleDecreaseQuantity()}),this.addEventDelegate(`click`,`#add-to-cart-btn`,e=>{this.handleAddToCart(e)}),this.addEventDelegate(`click`,`#related-product-card`,e=>{this.handleRelatedProductClick(e)}),this.addEventDelegate(`input`,`#quantity-input`,e=>{this.handleChangeQuantity(e)})}initializeToast(){let e=document.getElementById(`toast-container`);e&&(this.toast=new F(e))}async componentDidMount(){await this.fetchAsyncData(),this.initializeEventHandlers(),this.initializeToast()}async fetchAsyncData(){try{this.setState({loading:!0});let e=await R(this.productId),t=await L({category1:e.category1,category2:e.category2,limit:20});this.setState({loading:!1,product:e,relatedProducts:t.products})}catch{this.setState({isError:!0})}}handleChangeQuantity(e){let t=parseInt(e.target.value);t<1&&(e.target.value=1),this.setState({quantity:t})}handleIncreaseQuantity(){this.state.quantity<this.state.product.stock&&this.setState({quantity:this.state.quantity+1})}handleDecreaseQuantity(){this.state.quantity>1&&this.setState({quantity:this.state.quantity-1})}handleAddToCart(e){e.preventDefault();let t={id:this.state.product.productId,title:this.state.product.title,lprice:this.state.product.lprice,image:this.state.product.image},n=te(t,this.state.quantity);n&&this.showAddToCartFeedback()}handleRelatedProductClick(e){e.preventDefault();let t=e.target.closest(`#related-product-card`).dataset.productId;Z(Q(`/product/${t}`))}showAddToCartFeedback(){this.toast&&this.toast.show(`success`,`장바구니에 추가되었습니다!`)}template(){return this.state.loading?`
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>
      `:`
      <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" data-link="/" class="hover:text-blue-600 transition-colors">홈</a>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category1="${this.state.product.category1}">
            ${this.state.product.category1}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category2="${this.state.product.category2}">
            ${this.state.product.category2}
          </button>
        </div>
      </nav>
      
      <!-- 상품 상세 정보 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <!-- 상품 이미지 -->
        <div class="p-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src="${this.state.product.image}" alt="${this.state.product.title}" class="w-full h-full object-cover product-detail-image">
          </div>
          <!-- 상품 정보 -->
          <div>
            <p class="text-sm text-gray-600 mb-1">${this.state.product.brand}</p>
            <h1 class="text-xl font-bold text-gray-900 mb-3" data-testid="product-title">${this.state.product.title}</h1>
            <!-- 평점 및 리뷰 -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                ${Array.from({length:5},(e,t)=>{let n=t<Math.floor(this.state.product.rating);return`
                    <svg class="w-4 h-4 ${n?`text-yellow-400`:`text-gray-300`}" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `}).join(``)}
              </div>
              <span class="ml-2 text-sm text-gray-600">${this.state.product.rating} (${this.state.product.reviewCount}개 리뷰)</span>
            </div>
            <!-- 가격 -->
            <div class="mb-4">
              <span class="text-2xl font-bold text-blue-600">${parseInt(this.state.product.lprice).toLocaleString()}원</span>
            </div>
            <!-- 재고 -->
            <div class="text-sm text-gray-600 mb-4">
              재고 ${this.state.product.stock}개
            </div>
            <!-- 설명 -->
            <div class="text-sm text-gray-700 leading-relaxed mb-6">
              ${this.state.product.description}
            </div>
          </div>
        </div>
        
        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-900">수량</span>
            <div class="flex items-center">
              <button 
                id="quantity-decrease" 
                class="${H(`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100`)}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input
                type="number"
                id="quantity-input"
                value="${this.state.quantity}"
                min="1"
                max="${this.state.product.stock}"
                class="${H(`w-16 h-8 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`,this.state.quantity===this.state.product.stock&&`border-red-500`)}"
              >
              <button 
                id="quantity-increase" 
                class="${H(`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100`)}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
          <!-- 액션 버튼 -->
          <button 
            id="add-to-cart-btn"
            data-product-id="${this.state.product.productId}" 
            class="${H(`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium`)}"
          >
            장바구니 담기
          </button>
        </div>
      </div>
      
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <a href="/" data-link="/">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
          </button>
        </a>
      </div>
      
      <!-- 관련 상품 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
          <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-3 responsive-grid">
            ${this.state.relatedProducts.filter(e=>e.productId!==this.state.product.productId).map(e=>`
                  <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${e.productId}" id="related-product-card">
                    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                      <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${e.title}</h3>
                    <p class="text-sm font-bold text-blue-600">${parseInt(e.lprice).toLocaleString()}원</p>
                  </div>
                `).join(``)}
          </div>
        </div>
      </div>
    `}},q=class extends i{constructor(e,t){super(e,t)}componentDidMount(){this.initializeEventHandlers(),j(()=>{this.reRender()})}componentWillUnmount(){super.componentWillUnmount()}initializeEventHandlers(){this.addEventDelegate(`click`,`#cart-icon-btn`,e=>{e.preventDefault(),T()})}template(){let e=O();return`
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="/" class="hover:text-blue-600 transition-colors">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">

                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                <!-- 장바구니 카운트 배지 -->
                ${e>0?`
                    <span id="cart-count-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        ${e>99?`99+`:e}
                    </span>
                    `:``}
              </button>
            </div>
          </div>
        </div>
      </header>
    `}},J=class extends i{constructor(e,t){super(e,t)}componentDidMount(){this.initializeEventHandlers(),j(()=>{this.reRender()})}componentWillUnmount(){super.componentWillUnmount()}initializeEventHandlers(){this.addEventDelegate(`click`,`#cart-icon-btn`,e=>{e.preventDefault(),T()})}template(){let e=O();return`
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="/" class="hover:text-blue-600 transition-colors">상품 상세</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">

                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                <!-- 장바구니 카운트 배지 -->
                ${e>0?`
                    <span id="cart-count-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      ${e>99?`99+`:e}
                    </span>
                `:``}
              </button>
            </div>
          </div>
        </div>
      </header>
    `}};const Y=e=>{let t=document.querySelector(e);return t},X=`/front_6th_chapter1-1`,re=e=>RegExp(`^`+e.replace(/\//g,`\\/`).replace(/:\w+/g,`(.+)`)+`$`),Z=e=>{console.log(Q(e),e),history.pushState(null,``,e),$()},ie=()=>new URLSearchParams(window.location.search),ae=(e,t={})=>{let n=new URL(window.location.href),r=n.searchParams;Object.entries(e).forEach(([e,n])=>{if(n!=null&&n!==``){let i=t.defaults&&t.defaults[e]===n;i?r.delete(e):r.set(e,n.toString())}else r.delete(e)});let i=n.pathname+(r.toString()?`?`+r.toString():``);window.history.replaceState(null,``,i)},Q=e=>X+e,$=async()=>{let e=[{path:Q(`/`),view:U,header:q},{path:Q(`/product/:id`),view:K,header:J}],t=e.map(e=>({route:e,result:location.pathname.match(re(e.path))})),n=t.find(e=>e.result!==null);n||={route:{path:`/404`,view:W,header:null},result:[location.pathname]};let r={};if(n.result&&n.route.path!==`/404`){let e=n.route.path.match(/:(\w+)/g);e&&e.forEach((e,t)=>{let i=e.substring(1);r[i]=n.result[t+1]})}let i=Y(`#main`),a=Y(`#header-container`);if(!i){console.warn(`Main element not found. Skipping routing.`);return}if(!a){console.warn(`Header element not found Skipping routing.`);return}i._viewInstance&&i._viewInstance.componentWillUnmount&&i._viewInstance.componentWillUnmount(),a._viewInstance&&a._viewInstance.componentWillUnmount&&a._viewInstance.componentWillUnmount();let o=new n.route.view(i,r),s=n.route.header?new n.route.header(a,r):null;i.innerHTML=o.template(),a.innerHTML=s?s.template():``,i._viewInstance=o,o.componentDidMount&&o.componentDidMount(),s&&s.componentDidMount&&s.componentDidMount()},oe=()=>r(async()=>{let{worker:e,workerOptions:t}=await import(`./browser-DvH8zzVn.js`);return{worker:e,workerOptions:t}},[]).then(({worker:e,workerOptions:t})=>e.start(t));window.addEventListener(`popstate`,$),document.addEventListener(`DOMContentLoaded`,()=>{document.body.addEventListener(`click`,e=>{if(e.target&&e.target.matches(`[data-link]`)){e.preventDefault();let t=e.target.dataset.link;Z(Q(t))}})});const se=()=>{let e=document.querySelector(`#root`);new I(e),$()};oe().then(se);