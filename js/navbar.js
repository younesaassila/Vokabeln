
const navigationBar = document.getElementById('navbar');

const menu = () => {
	if (navigationBar.className === 'navigation-bar') {
		navigationBar.className += ' responsive';
	} else {
		navigationBar.className = 'navigation-bar';
	}
}
