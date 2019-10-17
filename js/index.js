
function list(id) {
	if ((typeof id === 'string')) {
		location.href = `list.html?id=${id}`;
	}
}

function play(id) {
	if ((typeof id === 'string')) {
		location.href = `play.html?id=${id}`;
	}
}
