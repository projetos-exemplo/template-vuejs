import auth from "./services/auth";
import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/login-page";

import Home from "./views/home-page";
import Profile from "./views/profile-page";
import Clientes from "./views/clientes-page";
import defaultLayout from "./layouts/side-nav-outer-toolbar";
import simpleLayout from "./layouts/single-card";

function loadView(view) {
  return () => import (/* webpackChunkName: "login" */ `./views/${view}.vue`)
}

const router = new createRouter({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Profile
    },
    {
      path: "/clientes",
      name: "clientes",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Clientes
    },
    {
      path: "/login",
      name: "login",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
      },
      component: Login
    },
    {
      path: "/reset-password",
      name: "reset-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Reset Password",
        description: "Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
      },
      component: loadView("reset-password-form")
    },
    {
      path: "/create-account",
      name: "create-account",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Sign Up"
      },
      component: loadView("create-account-form"),
    },
    {
      path: "/change-password/:recoveryCode",
      name: "change-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Change Password"
      },
      component: loadView("change-password-form")
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/recovery",
      redirect: "/home"
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home"
    }
  ],
  history: createWebHistory()
});

router.beforeEach((to, from, next) => {
  if (to.name === "login" && auth.loggedIn()) {
    next({ name: "home" });
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) { 
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
