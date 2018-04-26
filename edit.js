const imageCompressor = new ImageCompressor();

let allPlaces = {};
let place = [];
let placesid = [];
let selectedPlace;
let selectedCity;
let images = {};
let formChanged = false;


FileList.prototype.forEach = function (callback) {
    [].forEach.call(this, callback)
};

// cities.orderByChild("title").equalTo(city);


$(document).ready(function () {
    let authentication = new Promise((resolve, reject) => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.uid != "g8AntULTJcWcqTSbS3gSMoBslHw2") {
                    $('.approve').remove();
                } else {
                    $('.approve').css('display', 'block');
                }
                console.log('logged in', user.uid);
                uid = user.uid;
                $('#logout').attr('title', user.email);
                resolve();
            } else {
                // User is signed out.
                // ...
                console.log('logged out');
                window.location = "/";
            }
        });
    });

    authentication.then(() => {
        console.log(uid);
        placesNotApproved.orderByChild("user").equalTo(uid).once('value', function (snapshot) {

            snapshot.forEach(function (child) {
                console.log(child);

                allPlaces[child.key] = child.val();
                place.push(child.val().name);
                placesid.push(child.key);

                var app = '<div class="alert ' + child.key + '" id="block" onclick=openPlace("' + child.key + '")>' +
                    '<p>' + child.val().name.toUpperCase() + '</p>' +
                    '</div>';
                $('#selectPlace').append(app);
            });
        });

    }).catch(function (err) {
        alert(err);
    });

});


function openPlace(arg) {
    formChanged = false;
    console.log(arg);
    selectedPlace = arg;
    let data = allPlaces[selectedPlace];
    selectedCity = data.city;
    $('#name').val(data.name);
    $('#description').val(data.description);
    $('#website').val(data.url);
    $('#city').val(data.city);
    $('#geourl').val(data.geourl);
    $('#geolabel').val(data.geolabel);
    $('#category').val(data.category);

    if (category == 'instagramhotspots') {
        $('#paired').css('display', 'block');
        $('#pairedcolor').val(data.pairedcolor);
    } else {
        $('#paired').css('display', 'none');
    }
    console.log(Object.keys(data.images.lowres).length);
    $('#presentImages').empty();
    let presentImages = "";
    let i = 0;

    function forEachPromise(items, fn) {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return fn(item);
            });
        }, Promise.resolve());
    }


    function logItem(key) {
        return new Promise((resolve, reject) => {
            console.log(key);
            console.log(data.images.lowres[key]);
            console.log(data.images.lowres[key].name);
            let highresKey;
            let highresFun = new Promise((resolve, reject) => {
                return placesNotApproved.child(selectedPlace + '/images/highres').orderByChild("name").equalTo(data.images.lowres[key].name).once('value', (snapshot) => {
                    snapshot.forEach((child) => {
                        highresKey = child.key;
                        resolve();
                    });
                });
            });

            highresFun.then(() => {
                console.log(highresKey);
                let id = 'image' + (i + 1);
                let onclk = `del('${id} ${data.images.lowres[key].name} ${key} ${highresKey}')`;
                presentImages += '<div id="' + id + '" >' +
                    '<img src=' + data.images.lowres[key].url + ' width="42" class="form-control" data-toggle="modal" data-target=".bd-example-modal-lg" data-whatever="' + data.images.highres[highresKey].url + '">' +
                    '<button type="button" onclick="' + onclk + '" class="btn btn-primary">Delete</button></div>';
                i++;
                resolve();
            });
        });
    }

    forEachPromise(Object.keys(data.images.lowres), logItem).then(() => {
        console.log('all images done');
        $('#presentImages').append(presentImages);
    });
}

$(document).ready(function () {
    $('.bd-example-modal-lg').on('show.bs.modal', function (event) {
        console.log('hiii');

        let image = $(event.relatedTarget); // Button that triggered the modal
        let url = image.data('whatever'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        let modal = $(this);
        console.log(url);
        $('#largeImage').attr('src', url);
    });
});

function changetrigger() {
    formChanged = true;
    console.log('form changed');
    if (($('select[name=category]').val()) == 'instagramhotspots') {
        $('#paired').css('display', 'block');
    } else {
        $('#paired').css('display', 'none');
    }
}


let details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];

function editThePlace() {
    let promise = new Promise(function (resolve, reject) {
        $('#submit').attr('disabled','');
        $('#loader').css('display','block');
        if (formChanged) {
            details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];
            let name, description, website, geourl, category, city, images, geolabel, pairedcolor;
            name = $('#name').val();
            description = $('#description').val();
            website = $('#website').val();
            geourl = $('#geourl').val();
            geolabel = $('#geolabel').val();
            category = $('select[name=category]').val();
            city = $('#city').val();
            images = document.getElementById('images').files;
            let citycategory = city + '_' + category;


            let newData = {
                category: category,
                citycategory: citycategory,
                description: description,
                geourl: geourl,
                geolabel: geolabel,
                name: name,
                url: website,
            };

            if (category == 'instagramhotspots') {
                pairedcolor = $('#pairedcolor').val();
                newData["pairedcolor"] = pairedcolor;
                details.push("pairedcolor");
            }

            for (let i = 0; i < details.length; i++) {
                placesNotApproved.child(selectedPlace + "/" + details[i]).set(newData[details[i]]);
            }
            let i = 0;
            placesNotApproved.child(selectedPlace + '/approved').set(false).then(() => {
                function forEachPromise(items, fn) {
                    return Array.from(items).reduce(function (promise, item) {
                        return promise.then(function () {
                            return fn(item);
                        });
                    }, Promise.resolve());
                }

                function logItem(element) {
                    return new Promise((resolve, reject) => {
                        // console.log(element);
                        var imgFile = images[i];
                        var name = uuidv4();
                        i++;
                        imageCompressor.compress(imgFile, 0.2)
                            .then(function (result) {
                                return uploadImageAsPromise(result, selectedPlace, false, name);
                            })
                            .then(() => {
                                return uploadImageAsPromise(imgFile, selectedPlace, true, name);
                            })
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                // Handle the error
                                console.log(`Error ${err}`);
                            });
                        // resolve(compress);
                    });
                }

                return forEachPromise(images, logItem).then(() => {
                    console.log('all images done');
                });

            }).then(function () {
                console.log('Place Successfully Edited');
                // allPlaces[selectedPlace]=
                return placesNotApproved.child(selectedPlace).once('value', function (snapshot) {
                    console.log(snapshot.val());
                    $("."+selectedPlace+' p').html(snapshot.val().name.toUpperCase());
                    place[placesid.indexOf(selectedPlace)]=snapshot.val().name;
                    allPlaces[selectedPlace] = snapshot.val();
                }).then(() => {
                    resolve('Place Successfully Edited');
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    });
    promise.then(function (val) {
        reset();
        alert(val);
    }).catch(function (err) {
        alert(err);
    });
}


function del(details) {
    // let image=$("img[id="+link+"]").attr('src');

    console.log(details);
    let detailArray = details.split(" ");
    console.log(detailArray);
    // console.log(name);

    firebase.storage().ref('images/' + selectedPlace + "/highres/" + detailArray[1]).delete().then(function () {
        placesNotApproved.child(selectedPlace + "/images/highres/" + detailArray[3]).remove();
        console.log('highres image deleted');
    }).catch(function (error) {
        console.log(error);
    });

    delete allPlaces[selectedPlace].images.highres[detailArray[3]];

    firebase.storage().ref('images/' + selectedPlace + "/lowres/" + detailArray[1]).delete().then(function () {
        placesNotApproved.child(selectedPlace + "/images/lowres/" + detailArray[2]).remove();
        console.log('lowres image deleted');
    }).catch(function (error) {
        console.log(error);
    });

    delete allPlaces[selectedPlace].images.lowres[detailArray[2]];
    delete allPlaces[selectedPlace].images.highres[detailArray[3]];

    $('#' + detailArray[0]).remove();

}

function deleteThePlace() {
    // console.log(selectedCity);
    // console.log(selectedPlace);

    let delFromCity = new Promise(function (resolve, reject) {

        return cities.child(selectedCity + '/places/' + selectedPlace).remove().then(() => {

            return places.child(selectedPlace).remove().then(() => {
                return placesNotApproved.child(selectedPlace).remove().then(() => {
                    let imagesNames = [];
                    Object.keys(allPlaces[selectedPlace].images.highres).forEach((element) => {
                        imagesNames.push(allPlaces[selectedPlace].images.highres[element].name);
                    });
                    // console.log(imagesNames);
                    imagesNames.forEach((element) => {
                        firebase.storage().ref('images/' + selectedPlace + "/lowres/" + element).delete();
                        firebase.storage().ref('images/' + selectedPlace + "/highres/" + element).delete();
                    });

                });
            });
        }).then(() => {
            $("#selectPlace ." + selectedPlace).remove();
            resolve();
        });
    });

    delFromCity.then(() => {
        reset();
        console.log('Place deleted');
        alert('Place deleted');
        delete allPlaces[selectedPlace]
    });
}

function searchPlaces() {
    $("#selectPlace").empty();
    const searchVal = $('#search').val();
    let i = 0;
    place.forEach(function (child) {
        if (child.includes(searchVal) == true) {
            $("#selectPlace").append('<div class="alert '+placesid[i]+'" id="block" onclick=openPlace("' + placesid[i] + '")>' +
                '<p>' + child.toUpperCase() + '</p>' +
                '</div>');
        }
        i++;
    });
}



function uploadImageAsPromise(imageFile, pushedPlaceKey, highRes, name) {
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
                    placesNotApproved.child(pushedPlaceKey).child("images").child("highres").push(data);
                } else {
                    placesNotApproved.child(pushedPlaceKey).child("images").child("lowres").push(data);
                }
                resolve();
            }
        );
    });
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function reset() {
    $('#name').val('');
    $('#description').val('');
    $('#website').val('');
    $('#geourl').val('');
    $('#geolabel').val('');
    $('#category').val('default');
    $('#images').val('');
    $('#city').val('');
    $('#paired').val('');
    $('#paired').css('display', 'none');
    selectedPlace = '';
    selectedCity = '';
    images = {};
    formChanged = false;
    $('#presentImages').empty();
    $('#submit').removeAttr('disabled');
    $('#loader').css('display','none');
}