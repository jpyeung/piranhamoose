var geocoder, location1, location2, gDir, map, directionsPanel;

function initialize() {
    geocoder = new GClientGeocoder();
    map = new GMap2(document.getElementById("map_canvas"));
    directionsPanel = document.getElementById("directions");    
    gDir = new GDirections(map, directionsPanel);
    GEvent.addListener(gDir, "load", function() {
        var drivingDistanceMiles = gDir.getDistance().meters / 1609.344;
        var drivingDistanceKilometers = gDir.getDistance().meters / 1000;
        var drivingDuration = gDir.getDuration().html;
        console.log(drivingDuration);
        document.getElementById('results').innerHTML = '<strong>Address 1: </strong>' + location1.address + ' (' + location1.lat + ':' + location1.lon + ')<br /><strong>Address 2: </strong>' + location2.address + ' (' + location2.lat + ':' + location2.lon + ')<br /><strong>Driving Distance: </strong>' + drivingDistanceMiles + ' miles (or ' + drivingDistanceKilometers + ' kilometers)' + '<br /><strong>Driving Duration: </strong>' + drivingDuration;
    });
}

function showLocation() {
    console.log("Location!");
    geocoder.getLocations(document.getElementById("leaving-from-val").innerHTML, function (response) {
        if (!response || response.Status.code != 200)
        {
            alert("Sorry, we were unable to geocode the first address");
        }
        else
        {
            location1 = {lat: response.Placemark[0].Point.coordinates[1], lon: response.Placemark[0].Point.coordinates[0], address: response.Placemark[0].address};
            geocoder.getLocations(document.getElementById("resort-address").innerHTML, function (response) {
                if (!response || response.Status.code != 200)
                {
                    alert("Sorry, we were unable to geocode the second address");
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