// Initialize Firebase

// abhishek
let config = {
    apiKey: "AIzaSyBk0Q_D8Pv8GIORHSv7WkZ_5vJdXY0Sya4",
    authDomain: "dashboard-8df80.firebaseapp.com",
    databaseURL: "https://dashboard-8df80.firebaseio.com",
    projectId: "dashboard-8df80",
    storageBucket: "dashboard-8df80.appspot.com",
    messagingSenderId: "996615708415"
};

// supratim
// var config = {
//     apiKey: "AIzaSyD7ar06_cdzkS8jtjE2_HeDUUhGg_82J6s",
//     authDomain: "things-in-a-city.firebaseapp.com",
//     databaseURL: "https://things-in-a-city.firebaseio.com",
//     projectId: "things-in-a-city",
//     storageBucket: "things-in-a-city.appspot.com",
//     messagingSenderId: "984814225177"
//   };

firebase.initializeApp(config);

let auth = firebase.auth();

let database = firebase.database();
let imagesRef = firebase.storage().ref().child('images');


let places = database.ref('places');
let cities = database.ref('cities');
let placesNotApproved = database.ref('placessubmitted');
let users = database.ref('users');
let categories = database.ref('categories');
let uid = '';

let category = [];
let catelem = ``;
let status;
let catlist = {};
let db;

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        // console.log('signed out');
        window.location = "/";
    }).catch(function (error) {
        // An error happened.
        console.log('error');
    });
}