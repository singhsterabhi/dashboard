// Initialize Firebase
var config = {
    apiKey: "AIzaSyBk0Q_D8Pv8GIORHSv7WkZ_5vJdXY0Sya4",
    authDomain: "dashboard-8df80.firebaseapp.com",
    databaseURL: "https://dashboard-8df80.firebaseio.com",
    projectId: "dashboard-8df80",
    storageBucket: "dashboard-8df80.appspot.com",
    messagingSenderId: "996615708415"
};
firebase.initializeApp(config);

var auth = firebase.auth();

var database = firebase.database();
// var storage = firebase.storage();
// var storageRef = storage.ref();
var imagesRef = firebase.storage().ref().child('images');


var places = database.ref('places');
var cities = database.ref('cities');
var placesNotApproved = database.ref('placestobeapproved');
var uid = '';

var category = ['coworkingspaces', 'instagramspots', 'cafes'];


function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log('signed out');
        window.location = "/";
    }).catch(function (error) {
        // An error happened.
        console.log('error');
    });
}





// g8AntULTJcWcqTSbS3gSMoBslHw2