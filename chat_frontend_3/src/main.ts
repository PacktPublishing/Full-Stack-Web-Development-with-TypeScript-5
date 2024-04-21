import "./styles/app.css";
import "./i18n";
import App from "./App.svelte";
const app = new App({
  target: document.getElementById("app")!,
});

export default app;
