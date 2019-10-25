
var navigationBar = document.getElementById('navbar');

function menu() {
	if (navigationBar.className === 'navigation-bar') {
		navigationBar.className += ' responsive';
	} else {
		navigationBar.className = 'navigation-bar';
	}
}
