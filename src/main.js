import AppComponent from "@/app";
import { navigateTo, router } from "@/core/router";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
});

const initializeApp = () => {
  const $root = document.querySelector("#root");
  new AppComponent($root);

  if (import.meta.env.MODE === "test") {
    setTimeout(() => {
      router();
    }, 0);
  } else {
    router();
  }
};

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(initializeApp);
} else {
  initializeApp();
}
