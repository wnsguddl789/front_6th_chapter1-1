import { HomePageView, NotFoundPageView } from "@/views";
import { getElement } from "@/utils";

const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const navigateTo = (url) => {
  history.pushState(null, "", url);
  router();
};

/**
 * 현재 URL의 search params를 가져오는 함수
 * @returns {URLSearchParams} 현재 URL의 search params
 */
const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

/**
 * URL의 search params를 업데이트하는 함수 (히스토리에 추가하지 않음)
 * @param {Object} params - 업데이트할 파라미터 객체
 * @param {Object} options - 옵션 (기본값 제거 등)
 */
const updateSearchParams = (params, options = {}) => {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;

  // 각 파라미터를 순회하며 처리
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      // 기본값과 같은지 확인
      const isDefaultValue = options.defaults && options.defaults[key] === value;

      if (isDefaultValue) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value.toString());
      }
    } else {
      urlParams.delete(key);
    }
  });

  // URL 업데이트 (히스토리에 추가하지 않음)
  const newUrl = url.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
  window.history.replaceState(null, "", newUrl);
};

/**
 * 현재 URL을 새로운 URL로 교체하는 함수 (히스토리에 추가하지 않음)
 * @param {string} newUrl - 새로운 URL
 */
const replaceURL = (newUrl) => {
  window.history.replaceState(null, "", newUrl);
};

/**
 * 특정 search param 값을 가져오는 함수
 * @param {string} key - 파라미터 키
 * @param {string} defaultValue - 기본값
 * @returns {string} 파라미터 값 또는 기본값
 */
const getSearchParam = (key, defaultValue = "") => {
  const params = getSearchParams();
  return params.get(key) || defaultValue;
};

/**
 * popstate 이벤트 리스너를 추가하는 함수
 * @param {Function} handler - 이벤트 핸들러
 */
const addPopstateListener = (handler) => {
  window.addEventListener("popstate", handler);
};

/**
 * popstate 이벤트 리스너를 제거하는 함수
 * @param {Function} handler - 이벤트 핸들러
 */
const removePopstateListener = (handler) => {
  window.removeEventListener("popstate", handler);
};

const router = async () => {
  const routes = [
    { path: "/", view: HomePageView },
    // { path: "/login", view: LoginView },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => ({
    route: route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

  // 매치되지 않는 경우 404 페이지 표시
  if (!match) {
    match = {
      route: { path: "/404", view: NotFoundPageView },
      result: [location.pathname],
    };
  }

  // #main 요소를 타겟으로 변경
  const mainElement = getElement("#main");

  // 새로운 컴포넌트 인스턴스 생성 및 렌더링
  const view = new match.route.view(mainElement);
  mainElement.innerHTML = view.template();

  // 컴포넌트 마운트 이벤트 호출
  if (view.componentDidMount) {
    view.componentDidMount();
  }
};

export {
  router,
  navigateTo,
  getSearchParams,
  updateSearchParams,
  replaceURL,
  getSearchParam,
  addPopstateListener,
  removePopstateListener,
};
