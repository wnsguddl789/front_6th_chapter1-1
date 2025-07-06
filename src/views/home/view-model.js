export class HomePageViewModel {
  static INITIAL_STATE = {
    loading: true,
    isError: false,
    products: [],
    categories: [],
    pagination: { hasNext: false, hasPrev: false, limit: 20, page: 1, total: 0, totalPages: 0 },
    filters: {
      search: "",
      category1: "",
      category2: "",
      sort: "price_asc",
    },
  };

  static SORT_OPTIONS = [
    { value: "price_asc", label: "가격 낮은순" },
    { value: "price_desc", label: "가격 높은순" },
    { value: "name_asc", label: "이름순" },
    { value: "name_desc", label: "이름 역순" },
  ];

  static LIMIT_OPTIONS = [10, 20, 50, 100];

  static DEBOUNCE_TIME = 300;
}
