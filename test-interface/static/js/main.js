import * as todayPage from "./page/today.js";

window.addEventListener("load", () => {
  // swap function - page
  const main = document.querySelector("#main");
  const sidebarLinkList = document.querySelectorAll(".js-sidebar-link");
  sidebarLinkList.forEach((link) => {
    link.addEventListener("click", () => {
      sidebarLinkList.forEach((link) => {
        link.style.backgroundColor = "transparent";
      });
      link.style.backgroundColor = "#fff";

      const functionName = link.getAttribute("href");
      switch (functionName) {
        case "#all-task":
          main.innerHTML = todayPage.renderContent("New");
          break;
        case "#upcoming":
          main.innerHTML = "upcoming";
          break;
        case "#label":
          main.innerHTML = "label";
          break;
        case "#today":
        default:
          main.innerHTML = "today";
          break;
      }
    });
  });
  // swap function - page
});
