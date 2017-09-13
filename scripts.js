$(document).ready(function() {
	$('.title-input').focus();
	getStoredCards()
	showCards(10);
});
($('.title-input'), $('.body-input')).on('keyup', enableSaveButton);
$('section').on('click', '.upvote-button', upvoteCard);
$('section').on('click', '.downvote-button', downvoteCard);
$('section').on('click', '.delete-button', deleteCard);
$('section').on('click', 'h2', editTitle);
$('section').on('click', 'p', editBody);
$('section').on('focusout', '.edit-title', editTitleSave);
$('section').on('focusout', '.edit-body', editBodySave);
$('.search').on('keyup', realtimeSearch)

$('section').on('keyup', '.edit-title', function(e) {
	if (e.keyCode === 13) {
		$(this).blur();
	}
});

$('section').on('keyup', '.edit-body', function(e) {
	if (e.keyCode === 13) {
		$(this).blur();
	}
});




//setting focus in title input, retrieve local storage

function enableSaveButton() {
  if ($('.title-input').val() !== "" && $('.body-input').val() !== "") {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true)
  }
};

//constructor function and prototypes
var ToDoCard = function(title, body, id = Date.now(), importance = 2) {
	this.title = title;
	this.body = body;
	this.id = id;
	this.importance = importance;
};

//connects the quailty index to the string in that index
ToDoCard.prototype.importanceString = function() {
	var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
	return importanceArray[this.importance];
};

//increments the importance value
ToDoCard.prototype.importanceIncrement = function() {
	if (this.importance < 4) {
		this.importance++;
	}
};

//decrements the importance value
ToDoCard.prototype.importanceDecrement = function() {
	if (this.importance > 0) {
		this.importance--;
	}
};

//checks for matches in title, body and importance in the search input
ToDoCard.prototype.doYouMatch = function(searchTerm) {
	if (this.title.toUpperCase().includes(searchTerm) || this.body.toUpperCase().includes(searchTerm) || this.importanceString().toUpperCase().includes(searchTerm)) {
		return true;
	} else {
		return false;
	}
};

//event listeners
$('.save-button').on('click', function(e) {
	e.preventDefault();
	formSubmit();
});


//collects title and body, runs constructor
function formSubmit() {
	var title = $('.title-input').val();
	var body = $('.body-input').val();
	var toDoCard = new ToDoCard(title, body);
	$('section').prepend(populateCard(toDoCard));
	resetHeader();
	sendToLocalStorage();
};

//extracts values from HTML, inputs those values to constructor function which creates an toDoCard
function extractCard(elementInsideArticle) {
	var article = $(elementInsideArticle).closest('article');
	var title = $('.card-title', article).text();
	var body = $('.body', article).text();
	var id = article.data('id');
	var importance = $('.importance-span', article).data('importance');
	var toDoCard = new ToDoCard(title, body, id, importance);
	return toDoCard;
};

//takes values from toDoCard and inserts those values to HTML
function populateCard(toDoCard) {
	var newTitle = toDoCard.title;
	var newBody = toDoCard.body;
	var newId = toDoCard.id;
	var newImportance = toDoCard.importanceString();
	return (`<article data-id="${newId}">
				<div class="h2-wrapper">
					<h2 class="card-title">${newTitle}</h2>
					<button class="delete-button"></button>
				</div>
				<p class="body">${newBody}</p>
				<div class="importance-wrapper">
					<button class="upvote-button"></button>
					<button class="downvote-button"></button>
					<h5 class="importance">Importance:
						<span data-importance="${toDoCard.importance}" class="importance-span">${newImportance}</span>
					</h5>
				</div>
			</article>`);
	$(section).empty();
	showCards(10);
};

function upvoteCard() {
 	var toDoCard = extractCard(this);
	toDoCard.importanceIncrement();
	$(this).closest('article').replaceWith(populateCard(toDoCard));
	sendToLocalStorage();
};

function downvoteCard() {
 	var toDoCard = extractCard(this);
	toDoCard.importanceDecrement();
	$(this).closest('article').replaceWith(populateCard(toDoCard));
	sendToLocalStorage();
};

function deleteCard(e) {
	e.preventDefault();
	$(this).closest('article').remove();
	sendToLocalStorage();
};

//edits and saves title and body
function editTitle() {
	var article = $(this).closest('article');
	$('h2', article).replaceWith(`<textarea class="card-title edit-title">${$(this).text()}</textarea>`);
	$('.edit-title').focus();
};

function editBody() {
	var article = $(this).closest('article');
	$('p', article).replaceWith(`<textarea class="body edit-body">${$(this).text()}</textarea>`);
	$('.edit-body').focus();
};

function editTitleSave() {
	$(this).replaceWith(`<h2 class="card-title">${$(this).val()}</h2>`);
	var toDoCard = extractCard(this);
	$(this).closest('article').replaceWith(populateCard(toDoCard));
	sendToLocalStorage();
};

function editBodySave() {
	$(this).replaceWith(`<p class="body">${$(this).val()}</p>`);
	var toDoCard = extractCard(this);
	$(this).closest('article').replaceWith(populateCard(toDoCard));
	sendToLocalStorage();
};

//local storage functions
function sendToLocalStorage() {
	var cardArray = [];
	$('article').each(function (index, element) {
		cardArray.push(extractCard(element));
	});
	localStorage.setItem("storedCards", JSON.stringify(cardArray));
};

function getStoredCards() {
	var retrievedCards = JSON.parse(localStorage.getItem("storedCards")) || [];
	
	appendCards(retrievedCards);
	// retrievedCards.forEach(function (retrievedCard) {
	// 	var toDoCard = new ToDoCard(retrievedCard.title, retrievedCard.body, retrievedCard.id, retrievedCard.importance);
	// 	$('section').append(populateCard(toDoCard));
	// });
};

function appendCards (arr){
	arr.forEach(function (card) {
		var toDoCard = new ToDoCard(card.title, card.body, card.id, card.importance);
		$('section').append(populateCard(toDoCard));
	});
}

//resets inpus and focus after save
function resetHeader() {
	$('.title-input').focus();
	$('.title-input').val('');
	$('.body-input').val('');
};

//runs .doYouMatch prototype and adds or removes class to display search matches
function realtimeSearch() {
	var searchTerm = $('.search').val().toUpperCase();
	$('article').each(function (index, element) {
		var toDoCard = extractCard(element);
		if (toDoCard.doYouMatch(searchTerm)) {
			$(element).removeClass('card-display-none');
		} else {
			$(element).addClass('card-display-none');
		};
	});
};

// function showAllCards(){
// 	for (var i = 0 ; i < $('article').length ; i++){
// 		($($('article')[i])).show();
// 	}
// }

$('.show-button').on('click', showMore)

function showMore(){
	var cardCount = $('article').length;
	console.log(cardCount);
	showCards(cardCount);
};

function showCards(n){
	var cardLength = $('article').length;
		for (var i = 0 ; i < cardLength ; i++){
			if (i < n){
				$($('article')[i]).show();
			}else{
				$($('article')[i]).hide();	
			}
		}
};

// function for marking tasks completed 

ToDoCard.completed = function() {
	$('.completed').on('click', )
}

function addCompletedClass() {

}

$('.critical-button').on('click', filterCritical)
$('.high-button').on('click', filterHigh)
$('.normal-button').on('click', filterNormal)
$('.low-button').on('click', filterLow)
$('.none-button').on('click', filterNone)

function filterCritical() {
	var storedCards = JSON.parse(localStorage.getItem('storedCards'));
	var criticalCards = storedCards.filter(function(card){
		return card.importance === 4;
	}) 
	$('section').empty()
	appendCards(criticalCards);
}
function filterHigh() {
	var storedCards = JSON.parse(localStorage.getItem('storedCards'));
	var highCards = storedCards.filter(function(card){
		return card.importance === 3;
	}) 
	$('section').empty()
	appendCards(highCards);
}
function filterNormal() {
	var storedCards = JSON.parse(localStorage.getItem('storedCards'));
	var normalCards = storedCards.filter(function(card){
		return card.importance === 2;
	}) 
	$('section').empty()
	appendCards(normalCards);
}
function filterLow() {
	var storedCards = JSON.parse(localStorage.getItem('storedCards'));
	var lowCards = storedCards.filter(function(card){
		return card.importance === 1;
	}) 
	$('section').empty()
	appendCards(lowCards);
}
function filterNone() {
	var storedCards = JSON.parse(localStorage.getItem('storedCards'));
	var noneCards = storedCards.filter(function(card){
		return card.importance === 0;
	}) 
	$('section').empty()
	appendCards(noneCards);
}