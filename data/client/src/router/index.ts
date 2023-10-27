import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/main/home",
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProfileView.vue"),
  },
  {
    path: "/dev",
    name: "dev",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DevView.vue"),
  },
  {
    path: "/auth-2FA",
    name: "authTwoFactor",
    component: () => import("../views/AuthTwoFactor.vue"),
  },
  {
    path: "/pong",
    name: "pong",
    component: () => import("../views/PongView.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/MainView.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/PongScreen/HomeView.vue"),
      },
      {
        path: "friendless",
        name: "friendless",
        component: () => import("../views/PongScreen/FriendlessView.vue"),
      },
      {
        path: "friend-add",
        name: "friendAdd",
        component: () => import("../views/PongScreen/FriendAddView.vue"),
      },
      {
        path: "friend-play",
        name: "friendPlay",
        component: () => import("../views/PongScreen/FriendPlayView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
