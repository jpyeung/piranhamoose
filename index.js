// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {
	
	
	
	/**
	* This is a function for getting a random key from an object. I borrowed it from 
	* http://stackoverflow.com/questions/6643410/pick-random-value-from-associated-array-using-javascript
	*//*
	function randomKey(obj) {
		var ret;
		var c = 0;
		for (var key in obj)
			if (Math.random() < 1/++c)
			   ret = key;
		return ret;
	}
	
	function getNewRandomAnswerWord() {
		return randomKey(current_dict);
	}

	lang_to		= "English";
	lang_from		= "Spanish";
	current_dict	= dicts[lang_to][lang_from]; // keys: words in @lang_to, values: corresponding words in @lang_from 	
	
	/**
	* This function sets up the autocomplete. It is based in design off a function that I found at
	* http://jqueryui.com/autocomplete/
	*//*
	$(function() {
		var availableTags = Object.keys(current_dict);
		$("#input_answer").autocomplete({
			source: availableTags
		});
		$("#input_answer").autocomplete({
			// Make sure options only appear after two letters are entered
			minLength: 2
		});
		$("#input_answer").autocomplete({
			select: function(event, ui) {
				// make sure it won't fill in the autocomplete after a selection is made
				event.preventDefault();
				
				// Process the autocomplete choice made by the user
				document.getElementById("input_answer").value = ui.item.value;
				processAnswer();
			}
		});
	});
	
	// Clear the text field's value when the document refreshes
	document.getElementById("input_answer").value = "";
	
	currentAnswer = getNewRandomAnswerWord();
	
	var displayWord = current_dict[currentAnswer];
	
	// Make the first word be random
	document.getElementById("test_word").innerHTML = displayWord;
	
	// Change the text so that it reflects the languages being used
	document.getElementById("header").innerHTML = "Translate from " + lang_from + " to " + lang_to;
	document.getElementById("lang_to").innerHTML = "fart";
	document.getElementById("lang_from").innerHTML = lang_from;
	
	// Put the focus on the input field
	var inputAnswer = document.getElementById("input_answer");
	inputAnswer.focus();
	
	// These arrays hold the divs that hold old entries
	langToDivs = [];
	langFromDivs = [];
	answerDivs = [];
	
	// Pushes the old divs down to make room for the new div
	function pushAllOldDivsDown(divArray) {
		var distanceFromTop = 210;
		
		for (var i = divArray.length - 1; i >= 0; i--) {
			divArray[i].style.top = distanceFromTop + "px";
			distanceFromTop += 30;
		}
	}
	
	// Takes care of everything: setting the values of the new div, pushing the other divs down,
	// etc.
	function handleDivs(div, leftValue, stringValue, divArray) {
		document.body.appendChild(div);
		
		// If it's already a check, leave it alone, it doesn't want text
		if (!(div.className == "ui-icon ui-icon-check")) {
			div.innerHTML = stringValue;
			div.className = "std";
		}
		else {
			div.style.position = "absolute";
		}
		
		pushAllOldDivsDown(divArray);

		div.style.top = "180px";
		div.style.left = leftValue;
		
		divArray.push(div);
	}
	
	// Deals with everything that should happen when the user submits an answer.
	function processAnswer() {
		var testWord = document.getElementById("test_word");
		var inputAnswer = document.getElementById("input_answer");
		
		var isInputCorrect = inputAnswer.value == currentAnswer;
		
		// Create a new div to hold the answer
		var divAnswer = document.createElement("div");
		if (isInputCorrect) {
			divAnswer.className = "ui-icon ui-icon-check";
		}
		else {
			divAnswer.style.color = "red";
		}
		handleDivs(divAnswer, "450px", currentAnswer, answerDivs);

		
		// Create a new div to hold the old test word
		var divLangFrom = document.createElement("div");
		if (isInputCorrect) {
			divLangFrom.style.color = "blue";
		}
		else {
			divLangFrom.style.color = "red";
		}
		handleDivs(divLangFrom, "20px", testWord.innerHTML, langFromDivs);
		
		// Make a new test word
		currentAnswer = getNewRandomAnswerWord();
		testWord.innerHTML = current_dict[currentAnswer];
		
		// Create a new div to hold the user's input
		var divLangTo = document.createElement("div");
		if (isInputCorrect) {
			divLangTo.style.color = "blue";
		}
		else {
			divLangTo.style.color = "red";
			divLangTo.style.textDecoration = "line-through";
		}
		handleDivs(divLangTo, "200px", inputAnswer.value, langToDivs);
		
		// Clear the input field and focus it
		inputAnswer.value = "";
		$("#input_answer").autocomplete("close");
		inputAnswer.focus();
	}

//	$("#input_answer").on("autocompleteselect", processAnswer );
	
	$("#button_answer").click(function() {
		processAnswer();
	});
	
	$("#input_answer").keydown(function(event) {
		// If the user presses enter, process the answer
		if (event.keyCode == 13) {
			processAnswer();
		}
	}); */
	
    });

