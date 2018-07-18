const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.addNewUser = functions.auth.user().onCreate((user) => {
    console.log(user);
    console.log(user.email);
    console.log(user.displayName);
    console.log(user.uid);
    data = {
        name: user.displayName,
        email: user.email,
        status: "user"
    };
    console.log(data);
    admin.database().ref(`/users/${user.uid}`).set(data);
});