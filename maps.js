var geocoder, location1, location2, gDir, map, directionsPanel;

function initialize() {
    geocoder = new GClientGeocoder();
    map = new GMap2(document.getElementById("map_canvas"));
    directionsPanel = document.getElementById("directions");    
    gDir = new GDirections(map, directionsPanel);
    GEvent.addListener(gDir, "load", function() {
        var drivingDistanceMiles = (gDir.getDistance().meters / 1609.344).toFixed(2);
        var drivingDistanceKilometers = (gDir.getDistance().meters / 1000).toFixed(2);
        var drivingDuration = gDir.getDuration().html;
        document.getElementById('results').innerHTML = '<strong>Address 1: </strong>' + location1.address + '<br /><strong>Address 2: </strong>' + location2.address + '<br /><strong>Driving Distance: </strong>' + drivingDistanceMiles + ' miles (' + drivingDistanceKilometers + ' kilometers)' + '<br /><strong>Driving Duration: </strong>' + drivingDuration;
        document.getElementById('map_canvas').innerHTML = "<iframe width='100%' height='450' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/directions?origin=" + encodeURIComponent(location1.address) + '&destination=' + encodeURIComponent(location2.address) + "&key=AIzaSyDh3WHCnH2nQFF0JNYGV_OBMFO9nGF67ts'></iframe>"
    });
}

function showLocation() {
    geocoder.getLocations(document.getElementById("leaving-from-val").innerHTML, function (response) {
        if (!response || response.Status.code != 200)
        {
            alert("Sorry, we were unable to geocode the departure address");
        }
        else
        {
            location1 = {lat: response.Placemark[0].Point.coordinates[1], lon: response.Placemark[0].Point.coordinates[0], address: response.Placemark[0].address};
            geocoder.getLocations(document.getElementById("resort-address").innerHTML, function (response) {
                if (!response || response.Status.code != 200)
                {
                    alert("Sorry, we were unable to geocode the resort address");
                }
                else
                {
                    location2 = {lat: response.Placemark[0].Point.coordinates[1], lon: response.Placemark[0].Point.coordinates[0], address: response.Placemark[0].address};
                    gDir.load('from: ' + location1.address + ' to: ' + location2.address);
                }
            });
        }
    });
}