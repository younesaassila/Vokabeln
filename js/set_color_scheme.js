// If the current theme variable is undefined, set it in regard to the user's
// theme preference if possible.
if (!localStorage.getItem("theme")) {
  if (!(window.matchMedia("(prefers-color-scheme: dark)").media === "not all")
  && (window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    // Browser supports dark mode and the user prefers it!
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Insert the stylesheet corresponding to the current theme in the head tag.
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.style.display = 'none';
  document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="/css/dark.css" id="link-css-theme" onload="document.documentElement.style.display = \'\'">'
  );
} else {
  document.documentElement.style.display = 'none';
  document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="/css/light.css" id="link-css-theme" onload="document.documentElement.style.display = \'\'">'
  );
}

// TODO: Replace this with a declaration let link = new element
// and just change the href depending on the theme.
