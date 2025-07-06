import BaseComponent from "@/core/component";
import { Header, Footer, CartModal, Toast } from "@/components";

export default class AppComponent extends BaseComponent {
  constructor($el) {
    super($el, {
      preserveSelectors: ["#main"], // 메인 뷰 보존
    });
    this.state = {
      cartModalVisible: true,
    };

    // 헤더와 푸터 컴포넌트 인스턴스
    this.headerComponent = null;
    this.footerComponent = null;
    this.cartModalComponent = null;
    this.toastComponent = null;
  }

  initialState() {
    super.initialState();
  }

  componentDidMount() {
    this.initializeComponent();
    this.initializeToast();

    const modalElement = this.target.querySelector("#cart-modal-container");
    if (modalElement) {
      this.cartModalComponent = new CartModal(modalElement, {
        isVisible: this.state.cartModalVisible,
        onClose: () => this.closeCartModal(),
        toast: this.toastComponent,
      });
    }
  }

  componentWillUnmount() {
    // 컴포넌트 정리
    if (this.headerComponent) {
      this.headerComponent.componentWillUnmount?.();
    }
    if (this.footerComponent) {
      this.footerComponent.componentWillUnmount?.();
    }
    if (this.cartModalComponent) {
      this.cartModalComponent.componentWillUnmount?.();
    }
    if (this.toastComponent) {
      this.toastComponent.componentWillUnmount?.();
    }
  }

  initializeComponent() {
    const headerElement = this.target.querySelector("#header-container");

    if (headerElement) {
      this.headerComponent = new Header(headerElement, {
        openCartModal: () => this.openCartModal(),
      });
    }

    // 푸터 컴포넌트 초기화
    const footerElement = this.target.querySelector("#footer-container");
    if (footerElement) {
      this.footerComponent = new Footer(footerElement, {});
    }
  }

  /**
   * 토스트 컴포넌트 초기화
   */
  initializeToast() {
    const toastContainer = this.target.querySelector("#toast-container");
    if (toastContainer && !this.toastComponent) {
      this.toastComponent = new Toast(toastContainer);
    }
  }

  componentDidUpdate(_, __, nextState) {
    this.initializeComponent();
    this.initializeToast();

    // 모달 상태가 변경되면 CartModal 재생성
    if (nextState.cartModalVisible) {
      // 새로운 CartModal 생성
      const modalElement = this.target.querySelector("#cart-modal-container");
      if (modalElement) {
        this.cartModalComponent = new CartModal(modalElement, {
          isVisible: nextState.cartModalVisible,
          onClose: () => this.closeCartModal(),
          toast: this.toastComponent,
        });
      }
    }
  }

  /**
   * 장바구니 모달 열기
   */
  openCartModal() {
    this.setState({ cartModalVisible: true });
    document.body.style.overflow = "hidden";
  }

  /**
   * 장바구니 모달 닫기
   */
  closeCartModal() {
    this.setState({ cartModalVisible: false });
    document.body.style.overflow = "";
  }

  template() {
    return /* html */ `
      <div class="min-h-screen flex flex-col">
        <!-- 헤더 컨테이너 -->
        <div id="header-container"></div>
        
        <!-- 메인 콘텐츠 -->
        <main id="main" class="flex-1"></main>
        
        <!-- 푸터 컨테이너 -->
        <div id="footer-container"></div>
        
        <!-- 장바구니 모달 컨테이너 -->
        <div id="cart-modal-container"></div>

        <!-- 토스트 컨테이너 -->
        <div id="toast-container"></div>
      </div>
    `;
  }
}
