let allPlaces = {};
let place = [];
let placesid = [];
let selectedPlace;
let formChanged = false;

$(document).ready(() => {

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
                let onclk = `del('${id} ${key} ${highresKey}')`;
                presentImages += '<div id="' + id + '" >' +
                    '<img src=' + data.images.lowres[key].url + ' width="42" class="form-control"  data-toggle="modal" data-target=".bd-example-modal-lg" data-whatever="' + data.images.highres[highresKey].url + '">' +
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

function changetrigger() {
    formChanged = true;
    console.log('form changed');
    if (($('select[name=category]').val()) == 'instagramhotspots') {
        $('#paired').css('display', 'block');
    } else {
        $('#paired').css('display', 'none');
    }
}


function approve() {
    $('.submit').attr('disabled', '');
    $('#loader').css('display', 'block');
    let city;
    let data;
    if (!formChanged) {
        city = allPlaces[selectedPlace].city;
        data = allPlaces[selectedPlace];
        delete data.approved;
    } else {
        details = ["name", "description", "url", "citycategory", "geourl", "geolabel"];
        var name, description, website, geourl, category, images, geolabel, pairedcolor;
        name = $('#name').val();
        description = $('#description').val();
        website = $('#website').val();
        geourl = $('#geourl').val();
        geolabel = $('#geolabel').val();
        category = $('select[name=category]').val();
        city = $('#city').val();
        images = document.getElementById('images').files;
        var citycategory = city + '_' + category;

        data = {
            category: category,
            citycategory: citycategory,
            description: description,
            geourl: geourl,
            geolabel: geolabel,
            name: name,
            url: website,
            images: allPlaces[selectedPlace].images
        };

        if (category == 'instagramhotspots') {
            pairedcolor = $('#pairedcolor').val();
            data["pairedcolor"] = pairedcolor;
            details.push("pairedcolor");
        }
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
}