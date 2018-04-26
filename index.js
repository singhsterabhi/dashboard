$(document).ready(() => {
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



function signup() {
    let email = $('#signUpEmail').val();
    let password = $('#signUpPassword').val();
    console.log(email, password);
    auth.createUserWithEmailAndPassword(email, password).then(() => {
        console.log('signed up');
        window.location = "/add.html";
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        $("#signUpError").empty();
        $("#signUpError").append(`<p>${errorMessage}</p>`);

    });
}


function login() {
    let email = $('#loginEmail').val();
    let password = $('#loginPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('logged in');
            window.location = "/add.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            $("#loginError").empty();
            $("#loginError").append(`<p>${errorMessage}</p>`);
        });
}


function fblogin() {
    var provider = new firebase.auth.FacebookAuthProvider();

    // firebase.auth().signInWithRedirect(provider);
    // firebase.auth().getRedirectResult().then(function (result) {
    //     if (result.credential) {
    //         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //         var token = result.credential.accessToken;
    //         // ...
    //     }
    //     // The signed-in user info.
    //     var user = result.user;
    //     console.log('logged in');
    //     // window.location = "/add.html";
    // }).catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // ...
    // });



    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        window.location = "/add.html";

        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...

        if (error.code === 'auth/account-exists-with-different-credential') {
            // Step 2.
            // User's email already exists.
            // The pending Facebook credential.
            var pendingCred = error.credential;
            // The provider account's email address.
            var email = error.email;
            // Get registered providers for this email.
            auth.fetchProvidersForEmail(email).then(function (providers) {
                // Step 3.
                // If the user has several providers,
                // the first provider in the list will be the "recommended" provider to use.
                if (providers[0] === 'password') {
                    // Asks the user his password.
                    // In real scenario, you should handle this asynchronously.
                    var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
                    auth.signInWithEmailAndPassword(email, password).then(function (user) {
                        // Step 4a.
                        return user.link(pendingCred);
                    }).then(function () {
                        // Facebook account successfully linked to the existing Firebase user.
                        goToApp();
                    });
                    return;
                }
                // All the other cases are external providers.
                // Construct provider object for that provider.
                // TODO: implement getProviderForProviderId.
                var provider = getProviderForProviderId(providers[0]);
                // At this point, you should let the user know that he already has an account
                // but with a different provider, and let him validate the fact he wants to
                // sign in with this provider.
                // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                // so in real scenario you should ask the user to click on a "continue" button
                // that will trigger the signInWithPopup.
                auth.signInWithPopup(provider).then(function (result) {
                    // Remember that the user may have signed in with an account that has a different email
                    // address than the first one. This can happen as Firebase doesn't control the provider's
                    // sign in flow and the user is free to login using whichever account he owns.
                    // Step 4b.
                    // Link to Facebook credential.
                    // As we have access to the pending credential, we can directly call the link method.
                    result.user.link(pendingCred).then(function () {
                        // Facebook account successfully linked to the existing Firebase user.
                        goToApp();
                    });
                });
            });
        }

    });
}