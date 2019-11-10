const navigationBar = document.getElementById('navbar');

// Toggles the nav menu on mobile devices.
const menu = () => {
  if (navigationBar.className === 'navigation-bar') {
    navigationBar.className += ' responsive';
  } else {
    navigationBar.className = 'navigation-bar';
  }
}

const logo = document.querySelector('header .logo');

// Theme toggle to let the user choose a light or dark appearance.
const themeSwitch = document.querySelector('header .theme-switch');
const themeCheckbox = document.querySelector(
  'header .theme-switch input[type="checkbox"]'
);
const moonIcon = document.querySelector('header #moon-icon');

const setLightAppearance = () => {
  logo.src = "/images/logo-light.png";
  themeSwitch.setAttribute("title", "Activer le thème sombre");
  moonIcon.className = "far fa-moon";
}

const setDarkAppearance = () => {
  logo.src = "/images/logo-dark.png";
  themeSwitch.setAttribute("title", "Désactiver le thème sombre");
  moonIcon.className = "fas fa-moon";
}

const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    setDarkAppearance();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    setLightAppearance();
  }
}

// When the user clicks on the toggle, switch theme.
themeCheckbox.addEventListener("change", switchTheme, false);

// Get the current theme when the navbar loads.
let currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

// If the current theme is null but the user prefers a dark appearance.
if (!(currentTheme)
&& (window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  currentTheme = "dark";
}

// If the current theme is defined.
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    themeCheckbox.checked = true;
    setDarkAppearance();
  }
}
