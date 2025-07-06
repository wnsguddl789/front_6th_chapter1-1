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
      // 선택된 아이템 관리
      selectedItems: new Set(),
      isAllSelected: false,
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

      // 전체 선택 토글
      if (event.target.matches("#cart-modal-select-all-checkbox")) {
        this.handleSelectAll(event.target.checked);
      }

      // 개별 아이템 선택
      const itemCheckbox = event.target.closest(".cart-item-checkbox");
      if (itemCheckbox) {
        const productId = itemCheckbox.dataset.productId;
        this.handleItemSelect(productId, itemCheckbox.checked);
      }

      // 선택된 아이템 삭제
      if (event.target.closest('[data-action="remove-selected"]')) {
        this.handleRemoveSelected();
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

    // 기존 선택 상태 유지하면서 없는 아이템 제거
    const selectedItems = new Set();
    const itemIds = new Set(items.map((item) => item.id));

    this.state.selectedItems.forEach((id) => {
      if (itemIds.has(id)) {
        selectedItems.add(id);
      }
    });

    this.setState({
      items,
      summary,
      selectedItems,
      isAllSelected: items.length > 0 && selectedItems.size === items.length,
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
      // 선택 상태에서도 제거
      const newSelectedItems = new Set(this.state.selectedItems);
      newSelectedItems.delete(productId);
      this.setState({ selectedItems: newSelectedItems });
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
    clearCart();
    this.setState({ selectedItems: new Set(), isAllSelected: false });

    // 토스트 표시
    if (this.props.toast) {
      this.props.toast.show("info", "장바구니가 모두 비워졌습니다.");
    }
  }

  handleSelectAll(checked) {
    if (checked) {
      const allItemIds = new Set(this.state.items.map((item) => item.id));
      this.setState({ selectedItems: allItemIds, isAllSelected: true });
    } else {
      this.setState({ selectedItems: new Set(), isAllSelected: false });
    }
  }

  handleItemSelect(productId, checked) {
    const newSelectedItems = new Set(this.state.selectedItems);
    if (checked) {
      newSelectedItems.add(productId);
    } else {
      newSelectedItems.delete(productId);
    }

    const isAllSelected = this.state.items.length > 0 && newSelectedItems.size === this.state.items.length;
    this.setState({ selectedItems: newSelectedItems, isAllSelected });
  }

  handleRemoveSelected() {
    if (this.state.selectedItems.size === 0) {
      if (this.props.toast) {
        this.props.toast.show("info", "선택된 상품이 없습니다.");
      } else {
        alert("선택된 상품이 없습니다.");
      }
      return;
    }

    this.state.selectedItems.forEach((productId) => {
      removeFromCart(productId);
    });
    this.setState({ selectedItems: new Set(), isAllSelected: false });

    // 토스트 표시
    if (this.props.toast) {
      this.props.toast.show("info", "선택된 상품들이 삭제되었습니다.");
    }
  }

  // 선택된 아이템들의 총 가격 계산
  getSelectedItemsTotal() {
    let total = 0;
    this.state.items.forEach((item) => {
      if (this.state.selectedItems.has(item.id)) {
        total += parseInt(item.lprice) * item.quantity;
      }
    });
    return total;
  }

  template() {
    // 모달이 보이지 않으면 빈 HTML 반환
    if (!this.props.isVisible) {
      return "";
    }

    return /* html */ `
      <!-- 모달 오버레이 -->
      <div class="cart-modal-overlay flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4 fixed inset-0 bg-black bg-opacity-50 z-50">
        <!-- 모달 컨테이너 -->
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
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
              ${
                this.state.summary.itemCount > 0
                  ? `<span class="text-sm font-normal text-gray-600 ml-1">(${this.state.summary.itemCount})</span>`
                  : ""
              }
            </h2>
            <button 
              data-action="close-modal"
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
            ${this.state.summary.isEmpty ? this.emptyCartTemplate() : this.cartWithItemsTemplate()}
          </div>

          <!-- 푸터 (총 가격 및 액션 버튼) -->
          ${!this.state.summary.isEmpty ? this.cartFooterTemplate() : ""}
        </div>
      </div>
    `;
  }

  emptyCartTemplate() {
    return /* html */ `
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
    `;
  }

  cartWithItemsTemplate() {
    return /* html */ `
      <!-- 전체 선택 섹션 -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <label class="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            id="cart-modal-select-all-checkbox" 
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            ${this.state.isAllSelected ? "checked" : ""}
          >
          전체선택 (${this.state.summary.itemCount}개)
        </label>
      </div>
      
      <!-- 아이템 목록 -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-4">
          ${this.state.items.map((item) => this.cartItemTemplate(item)).join("")}
        </div>
      </div>
    `;
  }

  cartItemTemplate(item) {
    const isSelected = this.state.selectedItems.has(item.id);

    return /* html */ `
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input 
            type="checkbox" 
            class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
            data-product-id="${item.id}"
            ${isSelected ? "checked" : ""}
          >
        </label>
        
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img 
            src="${item.image}" 
            alt="${item.title}" 
            class="w-full h-full object-cover cursor-pointer cart-item-image" 
            data-product-id="${item.id}"
          >
        </div>
        
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" 
              data-product-id="${item.id}">
            ${item.title}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            ${parseInt(item.lprice).toLocaleString()}원
          </p>
          
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button 
              data-action="decrease-quantity" 
              data-product-id="${item.id}"
              class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input 
              type="number" 
              value="${item.quantity}" 
              min="1" 
              class="w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
              disabled 
              data-product-id="${item.id}"
            >
            <button 
              data-action="increase-quantity" 
              data-product-id="${item.id}"
              class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
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
            ${(parseInt(item.lprice) * item.quantity).toLocaleString()}원
          </p>
          <button 
            data-action="remove-item" 
            data-product-id="${item.id}"
            class="mt-1 text-xs text-red-600 hover:text-red-800"
          >
            삭제
          </button>
        </div>
      </div>
    `;
  }

  cartFooterTemplate() {
    const selectedCount = this.state.selectedItems.size;
    const selectedTotal = this.getSelectedItemsTotal();

    return /* html */ `
      <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <!-- 선택된 아이템 정보 -->
        ${
          selectedCount > 0
            ? /* html */ `
            <div class="flex justify-between items-center mb-3 text-sm">
              <span class="text-gray-600">선택한 상품 (${selectedCount}개)</span>
              <span class="font-medium">${selectedTotal.toLocaleString()}원</span>
            </div>
          `
            : ""
        }
        
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">
            ${this.state.summary.totalPrice.toLocaleString()}원
          </span>
        </div>
        
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${
            selectedCount > 0
              ? /* html */ `
              <button
                data-action="remove-selected"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                선택한 상품 삭제 (${selectedCount}개)
              </button>
            `
              : ""
          }
          <div class="flex gap-2">
            <button 
              data-action="clear-cart"
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
