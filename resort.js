$(document).ready(function() {
  resorts = ["blue-hills", "nashoba-valley", "boston-ski", "ski-bradford", "weston", "wachusett-mountain", "ski-ward"];

  // Change the displayed info about the resort given the name of the resort
  function changeResort(resort) {
    
    document.getElementById("resort-name").innerHTML = 
      document.getElementById("" + resort + "-name").innerHTML;

    document.getElementById("resort-address").innerHTML = 
      document.getElementById("" + resort + "-address").innerHTML;

    document.getElementById("resort-difficulty").innerHTML = 
      document.getElementById("" + resort + "-difficulty").innerHTML;

    document.getElementById("resort-price").innerHTML = 
      document.getElementById("" + resort + "-price").innerHTML;

    document.getElementById("resort-phone-number").innerHTML = 
      document.getElementById("" + resort + "-phone-number").innerHTML;

    document.getElementById("resort-website").innerHTML = 
      document.getElementById("" + resort + "-website").innerHTML;

    showLocation();
    var address = document.getElementById("resort-address").innerHTML;
    updateWeatherFromLocation(address.substring(address.length - 6));
  }

  $('#myModal').on('shown.bs.modal', function (e) {
    // This saves other things that might be being edited at this time
    saveOtherEditedThings();
    thingBeingEdited = undefined;
  });
  
  resortInfoRef.on('value', function(snapshot) {
    changeResort(snapshot.val());
  });

  // The below is a function to attach a listener to the appropriate choice button in the resort form,
  // given the name of the resort form.
  var makeResortListener = function(resort) {
    $("#" + resort).css('cursor','pointer');

    $("#" + resort).hover(function() {
        this.style.backgroundColor = '#d9edf7';
    }, function() {
        this.style.backgroundColor = 'white';
    });

    $("#" + resort).click(function() {
      resortInfoRef.set(resort);
      //changeResort(resort);
      $('#myModal').modal('hide');
    });
  }
  
  // This for loop iterates over all the resorts in the form and gives all their choice buttons 
  // listeners, so that this process doesn't have to be done by hand.
  for (var i=0; i<resorts.length; i++) {
    makeResortListener(resorts[i]);
  }
});
