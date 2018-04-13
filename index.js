
$(document).ready(()=>{
    // firebase.auth().signOut().then(function() {
    //     // Sign-out successful.
    //     console.log('signed out');
    // }).catch(function(error) {
    // // An error happened.
    // console.log('error');
    // });


    // auth.onAuthStateChanged(function(user) {
    //     if (user) {
    //       console.log('logged in', user.uid);
    //     //   window.location = "/add.html";
    //     console.log(localStorage);
    //     } else {
    //       // User is signed out.
    //       // ...
    //       console.log('logged out');
    //     }
    // });
});



function signup(){
    let email=$('#signUpEmail').val();
    let password=$('#signUpPassword').val();
    console.log(email,password);
    auth.createUserWithEmailAndPassword(email, password).then(()=>{
        console.log('signed up');
        window.location = "/add.html";
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode,errorMessage);
        $("#signUpError").empty();
        $("#signUpError").append(`<p>${errorMessage}</p>`);

    });
}


function login(){
    let email=$('#loginEmail').val();
    let password=$('#loginPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
        console.log('logged in');
        window.location = "/add.html";
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode,errorMessage);
        $("#loginError").empty();
        $("#loginError").append(`<p>${errorMessage}</p>`);
      });
}