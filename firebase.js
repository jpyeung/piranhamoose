var dataRef = new Firebase('https://dazzling-fire-3845.firebaseIO.com/');

var usersRef = dataRef.child('users');
var tripsRef = dataRef.child('trips');
var tripRef = tripsRef.child('-JLeXrIle3d9iPujp8-9');
tripRef.set({leaving_at: 'time', 
    returning_at: 'time', 
    leaving_from: 'Student Center', 
    organizer_number: '617-682-5966', 
    predicted_weather: 'Snowy', 
    car_ride_length: '2 hours', 
    resort_name: 'Snowy Peaks Resort', 
    resort_address: '39 Beach St, Westford MA 02446', 
    resort_difficulty: "<img src='images/green_circle_16x16.png' alt='green circle'><b> &mdash; </b><img src='images/double_black_diamond_16x16.png' alt='double black diamond'>", 
    resort_price: "$80", 
    ski_patrol_number: "617-623-4582", 
    resort_distance: "46.0 miles"
});

var peopleRef = tripRef.child('people');
