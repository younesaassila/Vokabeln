
$('.button-list').html(`<i class="fas fa-list-ul"></i> Liste`);
$('.button-play').html(`<i class="fas fa-play"></i> S'entraîner`);

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
