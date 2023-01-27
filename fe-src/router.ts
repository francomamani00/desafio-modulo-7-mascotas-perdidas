import { Router } from "@vaadin/router";
const rootEl = document.querySelector(".root");
const router = new Router(rootEl);
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/home-page", component: "home-page" },
  { path: "/perdidas", component: "perdidas-page" },
  { path: "/login", component: "login-page" },
  { path: "/usuario-nuevo", component: "usuario-nuevo" },
  { path: "/profile", component: "profile-me" },
  { path: "/edit-name", component: "edit-name" },
  { path: "/datos-guardados", component: "datos-guardados" },
  { path: "/edit-password", component: "edit-password" },
  { path: "/reportar-mascota", component: "reportar-mascota" },
  { path: "/mis-mascotas", component: "mis-mascotas" },
  { path: "/edit-pet", component: "edit-pet" },
]);
