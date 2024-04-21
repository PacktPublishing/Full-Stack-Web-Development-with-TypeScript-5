import { init, getLocaleFromNavigator, addMessages } from "svelte-i18n";
import ua from "./locales/ua.json";
import en from "./locales/en.json";

addMessages("en-US", en);
addMessages("uk-UA", ua);

init({
  fallbackLocale: "en-US",
  initialLocale: getLocaleFromNavigator(),
});
