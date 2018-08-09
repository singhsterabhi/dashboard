let allPlaces = {};
let place = [];
let placesid = [];
let selectedPlace;
let formChanged = false;
let categs = [];
let spuid = "";

$(document).ready(() => {

    let authentication = new Promise((resolve, reject) => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                uid = user.uid;

                console.log('logged in', user.uid);
                $('#logout').attr('title', user.email);

                cats();
                return users.child(uid + "/status").once('value', function (snapshot) {
                    console.log(snapshot.val());
                    status = snapshot.val();
                }).then(() => {
                    if (status != "user") {
                        console.log(status);
                        $('.approve').css('display', 'block');
                    } else {
                        logout();
                    }

                    if (status != "user" && status != 'admin') {
                        console.log(status);
                        $('.user').css('display', 'block');
                        $('.category').css('display', 'block');
                    }

                    if (status != 'user')
                        db = places;
                    else
                        db = placesNotApproved;
                    resolve();
                });
            } else {
                // User is signed out.
                // ...
                // console.log('logged out');
                window.location = "/";
            }
        });
    });

    authentication.then(() => {
        placesNotApproved.once('value', function (snapshot) {
            snapshot.forEach((child) => {
                console.log(child.key);
                if (child.val().approved == false) {
                    allPlaces[child.key] = child.val();
                    place.push(child.val().name);
                    placesid.push(child.key);
                    var app = '<div class="alert ' + child.key + '" id="block" onclick=openPlace("' + child.key + '")>' +
                        '<p>' + child.val().name.toUpperCase() + '</p>' +
                        '</div>';
                    $('#selectPlace').append(app);
                }
            });
        }).then(() => {
            console.log(allPlaces);
        });
    }).catch(function (err) {
        alert(err);
    });

});

function cats() {
    categories.once('value', (snapshot) => {
        snapshot.forEach(element => {
            category.push(element.val());
            let a = (element.val().toLowerCase()).split(' ').join('_')
            catelem = `${catelem}<div class="inputGroup" >
                <input id="${a}" name="${a}" type="checkbox" onclick="cat('${a}')"/>
                <label for="${a}" >${element.val()}</label>
            </div>`;
        });
    }).then(() => {
        console.log(catelem);
        $('.form').append(catelem);
    });
}

function cat(c) {
    formChanged = true;
    console.log(c);
    console.log($(`#${c}`).prop('checked'));

    if ($(`#${c}`).prop('checked')) {
        categs.push(c);
    } else {
        categs.splice(categs.indexOf(c), 1);
    }
    console.log(categs);
}

function openPlace(arg) {
    formChanged = false;
    $('.form').empty();
    $('.form').append(catelem);
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
    spuid = data.user;
    let c = data.category;
    if (c != undefined)
        for (let t = 0; t < c.length; t++) {
            $(`#${c[t]}`).prop('checked', 'true');
            categs.push(c[t]);
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
                let onclk = `del('${id} ${key} ${highresKey}')`;
                presentImages += '<div id="' + id + '" >' +
                    '<img src=' + data.images.lowres[key].url + ' width="42" class="form-control"  data-toggle="modal" data-target=".bd-example-modal-lg" data-whatever="' + data.images.highres[highresKey].url + '">' +
                    '<button type="button" onclick="' + onclk + '" class="btn btn-primary">Delete</button></div>';
                i++;
                resolve();
            });
        });
    }
    
    if (data.images != undefined && data.images != null)
        forEachPromise(Object.keys(data.images.lowres), logItem).then(() => {
            console.log('all images done');
            $('#presentImages').append(presentImages);
        });
}



function searchPlaces() {
    $("#selectPlace").empty();
    const searchVal = $('#search').val();
    let i = 0;
    place.forEach(function (child) {
        if (child.includes(searchVal) == true) {
            let element = '<div class="alert ' + placesid[i] + '" id="block" onclick=openPlace("' + placesid[i] + '")>' +
                '<p>' + child.toUpperCase() + '</p>' +
                '</div>';
            $("#selectPlace").append(element);
        }
        i++;
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


function approve() {
    $('.submit').attr('disabled', '');
    $('#loader').css('display', 'block');
    let city;
    let data;
    if (!formChanged) {
        city = allPlaces[selectedPlace].city;
        data = allPlaces[selectedPlace];
        delete data.approved;
    } else if (name != '' && description != '' && website != '' && geourl != '' && geolabel != '') {
        details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];
        var name, description, website, geourl, images, geolabel;
        name = $('#name').val();
        description = $('#description').val();
        website = $('#website').val();
        geourl = $('#geourl').val();
        geolabel = $('#geolabel').val();
        city = $('#city').val();

        data = {
            category: categs,
            description: description,
            geourl: geourl,
            geolabel: geolabel,
            name: name,
            url: website,
            images: allPlaces[selectedPlace].images,
            user: spuid,
            city: city,
            approved: true
        };
        let z = {};
        for (let t = 0; t < categs.length; t++) {
            z[`${city.toLowerCase().split(' ').join('_')}_${categs[t]}`] = true;
        }
        data[`${city}_tags`] = z;
        console.log(data);
    }


    places.child(selectedPlace).set(data).then(() => {
        let query = cities.orderByChild("title").equalTo(city);
        query.once('value', function (snapshot) {
            console.log(snapshot.exists());

            if (snapshot.exists())
                console.log('exists');
            else {
                console.log("doesn't");
                cities.push({
                    title: city
                });
            }
        });
        return query.once("child_added", function (snapshot) {
            snapshot.ref.child("places").push(selectedPlace);
        });
    }).then(() => {
        data.approved = true;
        return placesNotApproved.child(selectedPlace).set(data).then(() => {
            $("." + selectedPlace).remove();
        });
    }).then(() => {
        reset();
        alert("Place Approved");
    });
}

function deleteThePlace() {
    placesNotApproved.child(selectedPlace).remove();
}

function del(details) {
    console.log(details);
    let detailArray = details.split(" ");
    console.log(detailArray);

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

    delete allPlaces[selectedPlace].images.highres[detailArray[2]];
    delete allPlaces[selectedPlace].images.lowres[detailArray[1]];

    $('#' + detailArray[0]).remove();
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
    $('.submit').removeAttr('disabled');
    $('#loader').css('display', 'none');
    $('.form').empty();
    $('.form').append(catelem);
}