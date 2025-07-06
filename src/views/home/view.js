import BaseComponent from "@/core/component";

import { getProducts, getCategories } from "@/api/productApi";
import { HomePageViewModel } from "./view-model";
import { debounce } from "@/utils";
import { getSearchParams, updateSearchParams, addPopstateListener, removePopstateListener } from "@/core/router";
import { addToCart } from "@/store";
import { Toast } from "@/components";

export default class HomePage extends BaseComponent {
  constructor(target) {
    super(target);

    // 토스트 컴포넌트 초기화
    this.toast = null;

    // debounce 함수를 생성자에서 한 번만 생성
    this.debouncedHandleChangeSearch = debounce(
      (event) => this.handleChangeSearch(event),
      HomePageViewModel.DEBOUNCE_TIME,
    );
  }

  initialState() {
    // URL에서 읽어온 초기 상태 설정
    const initialState = this.getInitialStateFromURL();
    this.setState(initialState);
  }

  /**
   * URL에서 search params를 읽어와서 초기 상태를 설정
   */
  getInitialStateFromURL() {
    const urlParams = getSearchParams();
    const initialState = { ...HomePageViewModel.INITIAL_STATE };

    // URL 파라미터에서 필터 상태 읽기
    const search = urlParams.get("search");
    const sort = urlParams.get("sort");
    const limit = urlParams.get("limit");
    const category1 = urlParams.get("category1");
    const category2 = urlParams.get("category2");

    if (search) {
      initialState.filters.search = search;
    }

    if (sort && HomePageViewModel.SORT_OPTIONS.some((option) => option.value === sort)) {
      initialState.filters.sort = sort;
    }

    if (limit && HomePageViewModel.LIMIT_OPTIONS.includes(parseInt(limit))) {
      initialState.pagination.limit = parseInt(limit);
    }

    if (category1) {
      initialState.filters.category1 = category1;
    }
    if (category2) {
      initialState.filters.category2 = category2;
    }

    return initialState;
  }

  /**
   * 현재 상태를 기반으로 URL search params 업데이트
   */
  updateURLParams() {
    const params = {
      search: this.state.filters.search,
      sort: this.state.filters.sort,
      limit: this.state.pagination.limit,
      category1: this.state.filters.category1,
      category2: this.state.filters.category2,
    };

    updateSearchParams(params, {
      defaults: {
        sort: HomePageViewModel.INITIAL_STATE.filters.sort,
        limit: HomePageViewModel.INITIAL_STATE.pagination.limit,
      },
    });
  }

  async componentDidMount() {
    await this.fetchAsyncData();
    this.initializeEventHandlers();
    this.initializePopstateHandler();
    this.initializeToast();
  }

  /**
   * 토스트 컴포넌트 초기화
   */
  initializeToast() {
    const toastContainer = document.getElementById("toast-container");
    if (toastContainer) {
      this.toast = new Toast(toastContainer);
    }
  }

  /**
   * 브라우저 뒤로가기/앞으로가기 지원
   */
  initializePopstateHandler() {
    this.popstateHandler = () => {
      const newState = this.getInitialStateFromURL();
      this.setState({
        ...newState,
        loading: false, // 이미 로드된 상태이므로 로딩 상태는 false
      });
    };

    addPopstateListener(this.popstateHandler);
  }

  handleChangeSearch(event) {
    this.setState({ filters: { ...this.state.filters, search: event.target.value } });
  }

  handleChangeLimit(event) {
    this.setState({
      pagination: { ...this.state.pagination, limit: parseInt(event.target.value) },
    });
  }

  handleChangeSort(event) {
    this.setState({ filters: { ...this.state.filters, sort: event.target.value } });
  }

  handleCategoryFilter(event) {
    this.setState({
      filters: {
        ...this.state.filters,
        category1: event.target.dataset.category1,
        category2: event.target.dataset.category2,
      },
    });
  }

  componentDidUpdate(_, prevState, nextState) {
    // 로딩 중일 때는 추가 요청 방지 (무한 루프 방지)
    if (nextState.loading) {
      return;
    }

    // 검색어, 정렬, 페이지 제한 등이 변경되었을 때 새로운 데이터 가져오기
    const filtersChanged = JSON.stringify(prevState.filters) !== JSON.stringify(nextState.filters);
    const paginationChanged = prevState.pagination.limit !== nextState.pagination.limit;

    if (filtersChanged || paginationChanged) {
      // URL 파라미터 업데이트
      this.updateURLParams();
      this.fetchAsyncData();
    }
  }

  async fetchAsyncData() {
    try {
      this.setState({ loading: true });

      const searchParams = {
        page: this.state.pagination.page,
        limit: this.state.pagination.limit,
        search: this.state.filters.search,
        category1: this.state.filters.category1,
        category2: this.state.filters.category2,
        sort: this.state.filters.sort,
      };

      const [productResponse, categoryResponse] = await Promise.all([getProducts(searchParams), getCategories()]);

      this.setState({
        loading: false,
        pagination: productResponse.pagination,
        products: productResponse.products,
        categories: categoryResponse,
      });
    } catch {
      this.setState({ isError: true });
    }
  }

  categoriesTemplate(categories = {}) {
    return Object.entries(categories)
      .map(([oneDepthCategoryLabel, twoDepthCategories]) =>
        Object.keys(twoDepthCategories)
          .map((twoDepthCategoryLabel) => {
            const isSelected =
              this.state.filters.category1 === oneDepthCategoryLabel &&
              this.state.filters.category2 === twoDepthCategoryLabel;
            return /* html */ `
              <button
                id="category-filter-btn"
                data-category1="${oneDepthCategoryLabel}"
                data-category2="${twoDepthCategoryLabel}"
                class='${
                  isSelected
                    ? "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-blue-800 hover:bg-gray-50"
                    : "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }'
              >
                ${twoDepthCategoryLabel}
              </button>
            `;
          })
          .join(""),
      )
      .join("");
  }

  template() {
    if (this.state.isError) {
      return /* html */ `
        <div class="min-h-screen bg-gray-50">
          <main class="max-w-md m-auto px-4 py-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div class="flex flex-col gap-2 text-center text-red-500">
                <p>오류가 발생했습니다. 다시 시도해주세요.</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick="window.location.reload()">새로고침</button>
              </div>
            </div>
          </main>
        </div>
      `;
    }

    return /* html */ `
      <div class="min-h-screen bg-gray-50">
        
        <main class="max-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <!-- 검색창 -->
            <div class="mb-4">
              <div class="relative">
                <input
                  type="text"
                  id="search-input"
                  placeholder="상품명을 검색해보세요..."
                  value="${this.state.filters.search}"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  
                />
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
                  <label class="text-sm text-gray-600">카테고리:</label>

                  ${
                    this.state.filters.category1 === ""
                      ? /* html */ `
                    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
                      전체
                    </button>
                  `
                      : /* html */ `
                    <button data-breadcrumb="category1" data-category1="${this.state.filters.category1}" class="text-xs hover:text-blue-800 hover:underline">
                      ${this.state.filters.category1}
                    </button>
                  `
                  }
                  
                  ${
                    this.state.filters.category2 !== ""
                      ? /* html */ `
                      
                      <span class="text-xs text-gray-500">&gt;</span>
                  
                      <button data-breadcrumb="category2" data-category2="${this.state.filters.category2}" class="text-xs hover:text-blue-800 hover:underline">
                        ${this.state.filters.category2}
                      </button>
                  `
                      : ""
                  }
                </div>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    ${this.categoriesTemplate(this.state.categories)}
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <!-- 1depth 카테고리 -->
                <div class="flex flex-wrap gap-2">
                  ${this.state.loading ? '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>' : ""}
                </div>
                <!-- 2depth 카테고리 -->
              </div>
              
              <!-- 기존 필터들 -->
              <div class="flex gap-2 items-center justify-between">
                <!-- 페이지당 상품 수 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">개수:</label>
                  <select 
                    id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value="${this.state.pagination.limit}"
                  >
                  ${HomePageViewModel.LIMIT_OPTIONS.map((limit) => {
                    const isSelected = this.state.pagination.limit === limit ? "selected" : "";

                    if (isSelected) {
                      return /* html */ `<option value="${limit}" selected>${limit}개</option>`;
                    }

                    return /* html */ `<option value="${limit}">${limit}개</option>`;
                  }).join("")}
                  </select>
                </div>
                
                <!-- 정렬 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">정렬:</label>
                  <select 
                    id="sort-select" 
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                  ${HomePageViewModel.SORT_OPTIONS.map(({ label, value }) => {
                    const isSelected = this.state.filters.sort === value ? "selected" : "";

                    if (isSelected) {
                      return /* html */ `<option value="${value}" selected>${label}</option>`;
                    }

                    return /* html */ `<option value="${value}">${label}</option>`;
                  }).join("")}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 상품 목록 -->
          <div class="mb-6">
            <!-- 상품 개수 정보 -->
            ${
              this.state.loading
                ? ""
                : /*html */ `
                <div class="mb-4 text-sm text-gray-600">
                  총 <span class="font-medium text-gray-900">${this.state.pagination.total}개</span>의 상품
                </div>
              `
            }
            <div>
              <!-- 상품 그리드 -->
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${
                  this.state.loading
                    ? this.productSkeletonTemplate().repeat(this.state.pagination.limit)
                    : this.productGridTemplate(this.state.products)
                }
              </div>

              ${
                this.state.loading
                  ? /* html */ `
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
                    <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                  </div>
                </div>  
              `
                  : ""
              }

              
            </div>
          </div>
        </main>
      </div>
    `;
  }

  productSkeletonTemplate() {
    return /* html */ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    `;
  }

  productGridTemplate(products = []) {
    return products
      .map((product) => {
        return /* html */ `
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${product.productId}">
            <!-- 상품 이미지 -->
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img
                src="${product.image}"
                alt="${product.title}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
            
            <!-- 상품 정보 -->
            <div class="p-3">
              <div class="cursor-pointer product-info mb-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  ${product.title}
                </h3>
                <p class="text-xs text-gray-500 mb-2"></p>
                <p class="text-lg font-bold text-gray-900">
                  ${parseInt(product.lprice).toLocaleString()}원
                </p>
              </div>
              
              <!-- 장바구니 버튼 -->
              <button 
                class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${product.productId}"
                id="add-to-cart-btn"
              >
                장바구니 담기
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  initializeEventHandlers() {
    // 이벤트 위임 사용 - 상위 요소에 이벤트 부착
    this.target.addEventListener("input", (event) => {
      switch (event.target.id) {
        case "search-input": {
          this.debouncedHandleChangeSearch(event);
          break;
        }
      }
    });

    this.target.addEventListener("change", (event) => {
      switch (event.target.id) {
        case "limit-select": {
          this.handleChangeLimit(event);
          break;
        }
        case "sort-select": {
          this.handleChangeSort(event);
          break;
        }
      }
    });

    // 클릭 이벤트 처리 (장바구니 담기 버튼)
    this.target.addEventListener("click", (event) => {
      switch (event.target.id) {
        case "add-to-cart-btn": {
          this.handleAddToCart(event);
          break;
        }
        case "category-filter-btn": {
          this.handleCategoryFilter(event);
          break;
        }
      }
    });
  }

  /**
   * 장바구니 담기 버튼 클릭 핸들러
   * @param {Event} event - 클릭 이벤트
   */
  handleAddToCart(event) {
    event.preventDefault();

    const productId = event.target.dataset.productId;
    if (!productId) {
      console.error("상품 ID를 찾을 수 없습니다.");
      return;
    }

    // 현재 상품 목록에서 해당 상품 찾기
    const product = this.state.products.find((p) => p.productId === productId);
    if (!product) {
      console.error("상품 정보를 찾을 수 없습니다.");
      return;
    }

    // 장바구니에 추가할 상품 정보 구성
    const cartItem = {
      id: product.productId,
      title: product.title,
      lprice: product.lprice,
      image: product.image,
    };

    // 장바구니에 추가
    const success = addToCart(cartItem);

    if (success) {
      // 성공 시 시각적 피드백
      this.showAddToCartFeedback();
    }
  }

  /**
   * 장바구니 추가 성공 시 시각적 피드백
   */
  showAddToCartFeedback() {
    if (this.toast) {
      this.toast.show("success", "장바구니에 추가되었습니다!");
    }
  }

  /**
   * 컴포넌트 정리 시 이벤트 리스너 제거
   */
  componentWillUnmount() {
    if (this.popstateHandler) {
      removePopstateListener(this.popstateHandler);
    }
  }
}
