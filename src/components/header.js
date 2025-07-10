import BaseComponent from "@/core/component";
import { getCartCount, subscribeToCartCount, showCartModal } from "@/store";

export default class Header extends BaseComponent {
  constructor(target, props) {
    super(target, props);

    // 구독 해제 함수 저장
    this.unsubscribeCartCount = null;
  }

  initialState() {
    this.state = { cartCount: 0 };
    super.initialState();
  }

  componentDidMount() {
    this.initializeEventHandlers();
    this.initializeCartSubscription();
  }

  componentWillUnmount() {
    // 구독 해제
    if (this.unsubscribeCartCount) {
      this.unsubscribeCartCount();
    }
  }

  initializeEventHandlers() {
    // 장바구니 아이콘 클릭 이벤트
    this.target.addEventListener("click", (event) => {
      if (event.target.closest("#cart-icon-btn")) {
        event.preventDefault();
        showCartModal();
      }
    });
  }

  /**
   * 장바구니 스토어 구독 설정
   */
  initializeCartSubscription() {
    // 초기 카운트 설정
    this.updateCartCount(getCartCount());

    // 장바구니 카운트 변경 구독
    this.unsubscribeCartCount = subscribeToCartCount((count) => {
      this.updateCartCount(count);
    });
  }

  updateCartCount(count) {
    if (this.state.cartCount !== count) {
      this.setState({ cartCount: count });
    }
  }

  template() {
    return /* html */ `
      <header class="bg-white shadow-sm sticky top-0 z-40">
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
                ${
                  this.state.cartCount > 0
                    ? `
                  <span id="cart-count-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    ${this.state.cartCount > 99 ? "99+" : this.state.cartCount}
                  </span>
                `
                    : ""
                }
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
