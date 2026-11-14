import { browser } from "wxt/browser";
import { initApp } from "./App";
import "./style.css";

void browser.action.setBadgeText({ text: "" });
initApp();