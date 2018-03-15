
function uploadImageAsPromise(imageFile, pushedPlaceKey, i,highRes) {
    return new Promise(function (resolve, reject) {
        var storageRef;
        
        if(highRes){
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/highres/" + i+'.jpg');
        }else{
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/lowres/" + i+'.jpg');
        }
        

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                // console.log(percentage);
            },
            function error(err) {

            },
            function complete() {
                var downloadURL = task.snapshot.downloadURL;
                console.log("Upload done");
                if(highRes){
                    places.child(pushedPlaceKey).child("images").child("highres").push(downloadURL);
                }else{
                    places.child(pushedPlaceKey).child("images").child("lowres").push(downloadURL);
                }
            }
        );
    });
}