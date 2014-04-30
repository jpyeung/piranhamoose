// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

$(document).ready(function() {
	resorts = ["blue-hills", "nashoba-valley", "wachusett-mountain"];

	// The below is a function to attach a listener to the appropriate choice button in the resort form,
	// given the name of the resort form.
	var makeResortListener = function(resort) {
		$("#" + resort + "-button").click(function() {
	
	    document.getElementById("resort-name").innerHTML = 
		  document.getElementById("" + resort + "-name").innerHTML;

        document.getElementById("resort-address").innerHTML = 
		  document.getElementById("" + resort + "-address").innerHTML;
	  
	    document.getElementById("resort-difficulty").innerHTML = 
		  document.getElementById("" + resort + "-difficulty").innerHTML;
	  
	    document.getElementById("resort-price").innerHTML = 
		  document.getElementById("" + resort + "-price").innerHTML;
	  
	    document.getElementById("ski-patrol-number").innerHTML = 
		  document.getElementById("" + resort + "-ski-patrol-number").innerHTML;

        showLocation();
    	});
  	}
  
  	// This for loop iterates over all the resorts in the form and gives all their choice buttons 
  	// listeners, so that this process doesn't have to be done by hand.
  	for (var i=0; i<resorts.length; i++) {
		makeResortListener(resorts[i]);
  	}
});
