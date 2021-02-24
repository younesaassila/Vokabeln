// If the variable storing the user's preferred color scheme is not defined,
// check for browser support of this feature and if the user has expressed
// a preference.
if (!localStorage.getItem("theme")) {
  const browserSupport = !(
    window.matchMedia("(prefers-color-scheme: dark)").media === "not all"
  );
  const prefersDarkColorScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (browserSupport && prefersDarkColorScheme) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

const stylesheetColorSchemeLink = document.createElement("link");
stylesheetColorSchemeLink.rel = "stylesheet";
stylesheetColorSchemeLink.href = "css/light.css";
stylesheetColorSchemeLink.id = "stylesheet-color-scheme";
stylesheetColorSchemeLink.onload = () => {
  document.documentElement.style.display = "";
};

// Hide the document element to let the browser fully load the appropriate
// stylesheet in order to avoid a 'light flash' effect if the user prefers
// the dark color scheme.
document.documentElement.style.display = "none";

if (localStorage.getItem("theme") === "dark") {
  stylesheetColorSchemeLink.href = "css/dark.css";
}

document.head.appendChild(stylesheetColorSchemeLink);
