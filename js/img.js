// let uid;
let db;

function uploadImageAsPromise(imageFile, pushedPlaceKey, highRes, name, database) {
    return new Promise(function (resolve, reject) {
        var storageRef;

        if (highRes) {
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/highres/" + name + '.jpg');
        } else {
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/lowres/" + name + '.jpg');
        }

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                console.log(percentage);
            },
            function error(err) {
                console.log(`Error ${err}`);

            },
            function complete() {
                var downloadURL = task.snapshot.downloadURL;
                console.log(task.snapshot);
                console.log(task.snapshot.metadata.name);
                let data = {
                    name: task.snapshot.metadata.name,
                    url: task.snapshot.downloadURL
                };
                console.log("Upload done");
                if (highRes) {
                    database.child(pushedPlaceKey).child("images").child("highres").push(data);
                } else {
                    database.child(pushedPlaceKey).child("images").child("lowres").push(data);
                }
                resolve();
            }
        );
    });
}


auth.onAuthStateChanged(function (user) {
    if (user) {
        uid = user.uid;
        let status;
        users.child(uid + "/status").once('value', function (snapshot) {
            // console.log(snapshot.val());
            status = snapshot.val();
        });

        if (status != "user") {
            $('.approve').css('display', 'block');
        }

        if (status == "super") {
            $('.user').css('display', 'block');
        }
        
        console.log('logged in', user.uid);
        uid = user.uid;
        $('#logout').attr('title', user.email);
        if (uid != 'user')
            db = places;
        else
            db = placesNotApproved;
    } else {
        // User is signed out.
        // ...
        console.log('logged out');
        window.location = "/";
    }
});