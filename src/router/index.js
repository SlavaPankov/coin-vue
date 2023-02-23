import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage";
import AuthPage from "@/views/AuthPage";
import BanksPage from "@/views/BanksPage";
import AccountsPage from "@/views/AccountsPage";
import CurrenciesPage from "@/views/CurrenciesPage";
import AccountPage from "@/views/AccountPage";

const routes = [
  {
    name: "home",
    path: "/",
    component: HomePage,
  },
  {
    name: "auth",
    path: "/auth",
    component: AuthPage,
  },
  {
    name: "banks",
    path: "/banks",
    component: BanksPage,
  },
  {
    name: "accounts",
    path: "/accounts",
    component: AccountsPage,
  },
  {
    name: "account",
    path: "/account/:account",
    component: AccountPage,
  },
  {
    name: "currencies",
    path: "/currencies",
    component: CurrenciesPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
