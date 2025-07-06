import BaseComponent from "@/core/component";
import {
  getCartItems,
  getCartSummary,
  subscribeToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "@/store";

export default class CartModal extends BaseComponent {
  constructor(target, props) {
    super(target, props);

    // 구독 해제 함수 저장
    this.unsubscribeCart = null;
  }

  initialState() {
    this.state = {
      items: [],
      summary: {
        itemCount: 0,
        totalQuantity: 0,
        totalPrice: 0,
        isEmpty: true,
      },
    };
    super.initialState();
  }

  componentDidMount() {
    this.initializeEventHandlers();
    this.initializeCartSubscription();
  }

  componentWillUnmount() {
    // 구독 해제
    if (this.unsubscribeCart) {
      this.unsubscribeCart();
    }
  }

  initializeEventHandlers() {
    this.target.addEventListener("click", (event) => {
      // 모달 닫기 (오버레이 클릭 또는 닫기 버튼)
      if (event.target.matches(".cart-modal-overlay") || event.target.closest('[data-action="close-modal"]')) {
        this.close();
      }

      // 아이템 삭제
      const removeButton = event.target.closest('[data-action="remove-item"]');
      if (removeButton) {
        const productId = removeButton.dataset.productId;
        this.handleRemoveItem(productId);
      }

      // 수량 증가
      const increaseButton = event.target.closest('[data-action="increase-quantity"]');
      if (increaseButton) {
        const productId = increaseButton.dataset.productId;
        this.handleIncreaseQuantity(productId);
      }

      // 수량 감소
      const decreaseButton = event.target.closest('[data-action="decrease-quantity"]');
      if (decreaseButton) {
        const productId = decreaseButton.dataset.productId;
        this.handleDecreaseQuantity(productId);
      }

      // 장바구니 비우기
      if (event.target.closest('[data-action="clear-cart"]')) {
        this.handleClearCart();
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.props.isVisible) {
        this.close();
      }
    });
  }

  initializeCartSubscription() {
    // 초기 데이터 설정
    this.updateCartData();

    // 장바구니 전체 상태 구독
    this.unsubscribeCart = subscribeToCart(() => {
      this.updateCartData();
    });
  }

  updateCartData() {
    const items = getCartItems();
    const summary = getCartSummary();

    this.setState({
      items,
      summary,
    });
  }

  // 모달 닫기
  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleRemoveItem(productId) {
    if (confirm("이 상품을 장바구니에서 제거하시겠습니까?")) {
      removeFromCart(productId);
    }
  }

  handleIncreaseQuantity(productId) {
    const item = this.state.items.find((item) => item.id === productId);
    if (item) {
      updateCartItemQuantity(productId, item.quantity + 1);
    }
  }

  handleDecreaseQuantity(productId) {
    const item = this.state.items.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(productId, item.quantity - 1);
    }
  }

  handleClearCart() {
    if (confirm("장바구니를 모두 비우시겠습니까?")) {
      clearCart();
    }
  }

  template() {
    // 모달이 보이지 않으면 빈 HTML 반환
    if (!this.props.isVisible) {
      return "";
    }

    return /* html */ `
      <!-- 모달 오버레이 -->
      <div class="cart-modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <!-- 모달 컨테이너 -->
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold text-gray-900">
              장바구니 (${this.state.summary.itemCount}개)
            </h2>
            <button 
              data-action="close-modal"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 장바구니 내용 -->
          <div class="flex-1 overflow-y-auto max-h-96">
            ${this.state.summary.isEmpty ? this.emptyCartTemplate() : this.cartItemsTemplate()}
          </div>

          <!-- 푸터 (총 가격 및 액션 버튼) -->
          ${!this.state.summary.isEmpty ? this.cartFooterTemplate() : ""}
        </div>
      </div>
    `;
  }

  emptyCartTemplate() {
    return /* html */ `
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
          <p class="text-gray-600">원하는 상품을 담아보세요!</p>
        </div>
      </div>
    `;
  }

  cartItemsTemplate() {
    return /* html */ `
      <div class="p-4 space-y-4">
        ${this.state.items.map((item) => this.cartItemTemplate(item)).join("")}
      </div>
    `;
  }

  cartItemTemplate(item) {
    return /* html */ `
      <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
        <!-- 상품 이미지 -->
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          class="w-16 h-16 object-cover rounded-md"
        >
        
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 truncate">${item.title}</h3>
          <p class="text-sm text-gray-500">${parseInt(item.lprice).toLocaleString()}원</p>
          
          <!-- 수량 조절 -->
          <div class="flex items-center space-x-2 mt-2">
            <button 
              data-action="decrease-quantity" 
              data-product-id="${item.id}"
              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-sm font-medium w-8 text-center">${item.quantity}</span>
            <button 
              data-action="increase-quantity" 
              data-product-id="${item.id}"
              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 개별 총가격 및 삭제 버튼 -->
        <div class="flex flex-col items-end space-y-2">
          <p class="text-sm font-semibold text-gray-900">
            ${(parseInt(item.lprice) * item.quantity).toLocaleString()}원
          </p>
          <button 
            data-action="remove-item" 
            data-product-id="${item.id}"
            class="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  cartFooterTemplate() {
    return /* html */ `
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <!-- 선택된 아이템 정보 -->
        <div class="flex justify-between items-center mb-3 text-sm">
          <span class="text-gray-600">선택한 상품 (1개)</span>
          <span class="font-medium">440원</span>
        </div>
        
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">670원</span>
        </div>
        
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          <button
            id="cart-modal-remove-selected-btn"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            선택한 상품 삭제 (1개)
          </button>
          <div class="flex gap-2">
            <button 
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
    `;
  }
}
