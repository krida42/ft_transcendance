import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useMainStore } from "@/stores/main";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    redirect: "/auth/sign-in",
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
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProfileView.vue"),
  },
  {
    path: "/profile/:userId",
    name: "otherProfile",
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
    path: "/auth",
    name: "auth",
    component: () => import("../views/AuthScreen/AuthMainView.vue"),
    children: [
      {
        path: "sign-in",
        name: "signIn",
        component: () => import("../views/AuthScreen/AuthSignInView.vue"),
      },
      {
        path: "2FA-enable",
        name: "2FAEnable",
        component: () => import("../views/AuthScreen/Auth2FAEnableView.vue"),
      },
      {
        path: "2FA-QR",
        name: "2FAQR",
        component: () => import("../views/AuthScreen/Auth2FAQRView.vue"),
      },
      {
        path: "2FA-code",
        name: "2FACode",
        component: () => import("../views/AuthScreen/Auth2FACodeView.vue"),
      },
    ],
  },
  {
    path: "/pong",
    name: "pong",
    component: () => import("../views/PongView.vue"),
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("../views/FriendsView.vue"),
  },
  {
    path: "/channels",
    name: "channels",
    component: () => import("../views/Channels/ChannelsView.vue"),
    children: [
      {
        path: "my-channels",
        name: "myChannels",
        component: () => import("../views/Channels/MyChannelsView.vue"),
      },
      {
        path: "explore",
        name: "exploreChannels",
        component: () => import("../views/Channels/ExploreChannelsView.vue"),
      },
      {
        path: "create",
        name: "createChannel",
        component: () => import("../views/Channels/CreateChannelView.vue"),
      },
    ],
  },
  {
    path: "/channels/:channelId/settings",
    name: "channelSettings",
    component: () => import("../views/Channels/ChannelSettingsView.vue"),
    children: [
      {
        path: "general",
        name: "channelSettingsGeneral",
        component: () =>
          import("../views/Channels/ChannelSettingsGeneralView.vue"),
      },
      {
        path: "members",
        name: "channelSettingsMembers",
        component: () =>
          import("../views/Channels/ChannelSettingsMembersView.vue"),
      },
      {
        path: "bans",
        name: "channelSettingsBans",
        component: () =>
          import("../views/Channels/ChannelSettingsBansView.vue"),
      },
    ],
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
      {
        path: "join-queue",
        name: "joinQueue",
        component: () => import("../views/PongScreen/JoinQueueView.vue"),
      },
      {
        path: "waiting",
        name: "waiting",
        component: () => import("../views/PongScreen/WaitingOpponentView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const mainStore = useMainStore();

  if (!mainStore.loggedIn && to.matched[0].path !== "/auth") {
    await mainStore.refreshUserInfo();
    if (!mainStore.loggedIn) router.push("/auth/sign-in");
  }
});

export default router;
