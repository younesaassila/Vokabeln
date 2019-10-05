function toggleMenu() {
	var navigationBar = document.getElementById("nav-bar");
	if (navigationBar.className === "navigation-bar") {
		navigationBar.className += " responsive";
	} else {
		navigationBar.className = "navigation-bar";
	}
}
