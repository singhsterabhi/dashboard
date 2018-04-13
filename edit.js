const imageCompressor = new ImageCompressor();

var citylist = [];
var cityplaces = [];
var cityids = [];
var allPlacesInACity = [];
var allPlacesInACityIds = [];
var citySelected = '';
var placeSelected = '';
var images = {};
var formChanged = false;


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
    } else {
        // User is signed out.
        // ...
        console.log('logged out');
        window.location = "/";
    }
});


FileList.prototype.forEach = function (callback) {
    [].forEach.call(this, callback)
};

$(document).ready(function () {
    cities.once('value', function (snapshot) {

        snapshot.forEach(function (child) {

            var uid = child.key + '/places';
            citylist.push(child.val().title);
            cityids.push(child.key);
            var childplaces = [];
            cities.child(uid).once('value', function (snapone) {
                snapone.forEach(function (childone) {
                    // console.log(childone.val());
                    childplaces.push(childone.val());
                });
            });
            var city = child.val().title;

            cityplaces.push(childplaces);

        });
        // console.log(citylist);

        // console.log(citylist.length);
        // console.log(cityplaces);

        for (var i = 0; i < citylist.length; i++) {
            // console.log(citylist[i]);

            var app = "<option value=" + cityids[i] + ">" + citylist[i].toUpperCase() + "</option>";
            $('#selectCity').append(app);
        }

    });

});



function addPlaces() {
    allPlacesInACity = [];
    $('#selectPlace').empty();
    var city = $('select[name=city]').val();
    citySelected = city;
    var cityPlaces = cityplaces[cityids.indexOf(city)];
    var t = 0;

    var getPlaces = function () {
        return new Promise(function (resolve, reject) {
            cityPlaces.forEach(function (child) {
                places.child(child).once('value', function (snapshot) {

                    if (snapshot.val().user == uid) {
                        allPlacesInACity.push(snapshot.val().name);
                        allPlacesInACityIds.push(child);
                        var app = '<div class="alert" id="block" onclick=editPlace("' + child + '")>' +
                            '<p>' + snapshot.val().name.toUpperCase() + '</p>' +
                            '</div>';
                        $('#selectPlace').append(app);
                    }

                });

            });
            // $('#placeselect').css('display','block');
        });
    };

    getPlaces();

}



function changetrigger() {
    formChanged = true;
    console.log('form changed');
    if (($('select[name=category]').val()) == 'instagramhotspots') {
        $('#paired').css('display', 'block');
    } else {
        $('#paired').css('display', 'none');
    }
}

function editPlace(place) {
    formChanged = false;
    console.log(place);

    // var place=$('select[name=place]').val();
    placeSelected = place;
    $('#presentImages').empty();
    // $('#presentImages').append("<label>IMAGES</label><br>");
    console.log(place);
    places.child(place).once('value', function (snapshot) {
        var data = snapshot.val();


        $('#name').val(data.name);
        $('#description').val(data.description);
        $('#website').val(data.url);
        $('#geourl').val(data.geourl);
        $('#geolabel').val(data.geolabel);
        $('#category').val(data.category);

        if (category == 'instagramhotspots') {
            $('#paired').css('display', 'block');
            $('#pairedcolor').val(data.pairedcolor);
        } else {
            $('#paired').css('display', 'none');
        }

        $('#name').attr("onchange", "changetrigger()");
        $('#description').attr("onchange", "changetrigger()");
        $('#website').attr("onchange", "changetrigger()");
        $('#geourl').attr("onchange", "changetrigger()");
        $('#geolabel').attr("onchange", "changetrigger()");
        $('#category').attr("onchange", "changetrigger()");
        $('#pairedcolor').attr("onchange", "changetrigger()");
        $('#images').attr("onchange", "changetrigger()");

        console.log(data.name);
        console.log(data.description);

        if (data.images != undefined) {
            console.log(Object.keys(data.images.lowres));
            var imagesLowRes = [];
            imagesLowRes[0] = Object.keys(data.images.lowres);
            imagesLowRes[1] = Object.values(data.images.lowres);
            console.log(data.images);

            var imagesHighRes = [];
            imagesHighRes[0] = Object.keys(data.images.highres);
            imagesHighRes[1] = Object.values(data.images.highres);
            console.log(imagesHighRes);


            var presentImages = '';
            console.log((imagesLowRes[0].length));

            for (var i = 0; i < (imagesLowRes[0].length); i++) {
                console.log(i);

                var id = 'image' + (i + 1);
                var onclk = 'del("' + id + '","' + imagesLowRes[0][i] + ' ' + imagesLowRes[1][i].name + ' ' + imagesHighRes[0][i] + ' ' + imagesHighRes[1][i].name + ' ' + place + '")';
                presentImages += '<div id="' + id + '" >';
                // presentImages+="<label>IMAGE "+(i+1)+"</label>";
                presentImages += '<img src=' + imagesLowRes[1][i].url + ' width="42" class="form-control" >';
                presentImages += "<button type='button' onclick='" + onclk + "' class='btn btn-primary'>Delete</button></div>";

                // $('#image'+(i+1)).val(imagesLowRes[1][i]);
            }
            $('#presentImages').append(presentImages);
            // $("#editPlace").css('display','inline-block');
            console.log(images);
        }
    });

}

var details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];

function editThePlace() {

    if (formChanged) {
        details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];
        var name, description, website, geourl, category, city, images, geolabel, pairedcolor;
        name = $('#name').val();
        description = $('#description').val();
        website = $('#website').val();
        geourl = $('#geourl').val();
        geolabel = $('#geolabel').val();
        category = $('select[name=category]').val();
        city = $('#city').val();
        images = document.getElementById('images').files;
        var citycategory = city + '_' + category;


        var newData = {
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

        for (var i = 0; i < details.length; i++) {
            places.child(placeSelected + "/" + details[i]).set(newData[details[i]]);
        }


        var i = 0;
        images.forEach(element => {
            // console.log(element);
            var imgFile = images[i];
            i++;
            imageCompressor.compress(imgFile, 0.6)
                .then(function (result) {
                    uploadImageAsPromise(result, placeSelected, i, false);
                    uploadImageAsPromise(imgFile, placeSelected, i, true);

                })
                .catch((err) => {
                    // Handle the error
                });
        });
    }

}


function del(link, detail) {
    // var image=$("img[id="+link+"]").attr('src');

    console.log(link);
    var detailArray = detail.split(" ");
    console.log(detailArray);


    firebase.storage().ref('images/' + detailArray[4] + "/highres/" + detailArray[3]).delete().then(function () {
        places.child(detailArray[4] + "/images/highres/" + detailArray[2]).remove();
        console.log('highres image deleted');
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });

    firebase.storage().ref('images/' + detailArray[4] + "/lowres/" + detailArray[1]).delete().then(function () {
        places.child(detailArray[4] + "/images/lowres/" + detailArray[0]).remove();
        console.log('lowres image deleted');
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });

    $('#' + link).remove();

}


function deleteThePlace() {
    console.log(citySelected);
    console.log(placeSelected);
    // delete place
    places.child(placeSelected).remove();


    var delFromCity = function () {
        return new Promise(function (resolve, reject) {
            cities.child(citySelected + '/places/').once('value', function (snapshot) {
                snapshot.forEach(function (child) {
                    if (child.val() == placeSelected) {
                        console.log(child.val());
                        cities.child(citySelected + '/places/' + child.key).remove();
                        // firebase.storage().ref('images/' + placeSelected).delete().then(function() {
                        //     // places.child(detailArray[4]+"/images/lowres/"+detailArray[0]).remove(); 
                        //     console.log('lowres image deleted');
                        //     console.log('place deleted');
                        // }).catch(function(error) {
                        // // Uh-oh, an error occurred!
                        // });
                        // firebase.storage().ref('images/' + placeSelected).remove();
                        console.log('place deleted');
                    }
                });
            });
        });
    };


    delFromCity();
}


function searchPlaces() {
    $("#selectPlace").empty();
    const searchVal = $('#search').val();
    let i = 0;
    allPlacesInACity.forEach(function (child) {
        if (child.includes(searchVal) == true) {
            $("#selectPlace").append('<div class="alert" id="block" onclick=editPlace("' + allPlacesInACityIds[i] + '")>' +
                '<p>' + child.toUpperCase() + '</p>' +
                '</div>');
        }
        i++;
    });
}



function uploadImageAsPromise(imageFile, pushedPlaceKey, i, highRes) {
    return new Promise(function (resolve, reject) {
        var storageRef;
        var name = uuidv4();
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
                    places.child(pushedPlaceKey).child("images").child("highres").push(data);
                } else {
                    places.child(pushedPlaceKey).child("images").child("lowres").push(data);
                }
            }
        );
    });
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

//   console.log(uuidv4());