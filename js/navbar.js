//#region NAVIGATION BAR MENU

// The navigation bar element.
const navigationBar = document.getElementById('navbar');
// Toggle the nav menu on mobile devices.
const menu = () => {
  if (navigationBar.className === 'navigation-bar') {
    navigationBar.className += ' responsive';
  } else {
    navigationBar.className = 'navigation-bar';
  }
}

//#endregion

//#region THEME MANAGEMENT

// Theme management's HTML elements.
const themeSwitch = document.querySelector('header .theme-switch');
const themeCheckbox = document.querySelector(
  'header .theme-switch input[type="checkbox"]'
);
const themeIcon = document.querySelector('header #moon-icon');

switch (localStorage.getItem("theme")) {
  case "dark":
    themeSwitch.setAttribute("title", "Désactiver le thème sombre");
    themeCheckbox.checked = true;
    themeIcon.className = "fas fa-moon";
    break;
  default:
    themeSwitch.setAttribute("title", "Activer le thème sombre");
    themeCheckbox.checked = false;
    themeIcon.className = "far fa-moon";
    break;
}

// Update the current theme when the user ticks/unticks the checkbox.
themeCheckbox.addEventListener("change", (e) => {
  const stylesheetLink = document.getElementById("stylesheet-color-scheme");
  if (e.target.checked) {
    // Enable dark theme.
    localStorage.setItem("theme", "dark");
    themeIcon.className = "fas fa-moon";
    themeSwitch.setAttribute("title", "Désactiver le thème sombre");
    stylesheetLink.href = "/css/dark.css";
  } else {
    // Enable light theme.
    localStorage.setItem("theme", "light");
    themeIcon.className = "far fa-moon";
    themeSwitch.setAttribute("title", "Activer le thème sombre");
    stylesheetLink.href = "/css/light.css"
  }
}, false);

//#endregion
