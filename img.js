
function uploadImageAsPromise(imageFile, pushedPlaceKey, i,highRes) {
    return new Promise(function (resolve, reject) {
        var storageRef;
        var name=uuidv4();
        if(highRes){
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/highres/" + name+'.jpg');
        }else{
            storageRef = firebase.storage().ref('images/' + pushedPlaceKey + "/lowres/" + name+'.jpg');
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


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
  
//   console.log(uuidv4());