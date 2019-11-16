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
  case "light":
    themeSwitch.setAttribute("title", "Activer le thème sombre");
    themeCheckbox.checked = false;
    themeIcon.className = "far fa-moon";
    break;
  case "dark":
    themeSwitch.setAttribute("title", "Désactiver le thème sombre");
    themeCheckbox.checked = true;
    themeIcon.className = "fas fa-moon";
    break;
}

// Update the current theme when the user ticks/unticks the checkbox.
themeCheckbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    // Enable dark theme.
    localStorage.setItem("theme", "dark");
    themeIcon.className = "fas fa-moon";
    themeSwitch.setAttribute("title", "Désactiver le thème sombre");
  } else {
    // Enable light theme.
    localStorage.setItem("theme", "light");
    themeIcon.className = "far fa-moon";
    themeSwitch.setAttribute("title", "Activer le thème sombre");
  }
  // Reload the webpage for the update to take effect (because light and dark
  // themes are stored in different stylesheets, thus needing a reload).
  location.reload();
}, false);

//#endregion
