var dataRef = new Firebase('https://dazzling-fire-3845.firebaseIO.com/');

var usersRef = dataRef.child('users');
var tripsRef = dataRef.child('trips');
var tripRef = tripsRef.child('-JLeXrIle3d9iPujp8-9');
var peopleRef = tripRef.child('people');
