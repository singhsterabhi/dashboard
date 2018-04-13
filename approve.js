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

                var app = '<div class="alert" id="block" onclick=openPlace("' + child.key + '")>' +
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
    console.log(arg);
    selectedPlace = arg;
    let data = allPlaces[selectedPlace];
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
    for (key of Object.keys(data.images.lowres)) {
        console.log(key);
        console.log(data.images.lowres[key]);
        presentImages += '<div><img src=' + data.images.lowres[key].url + ' width="42" class="form-control" ></div>';
    }
    $('#presentImages').append(presentImages);
}



function searchPlaces() {
    $("#selectPlace").empty();
    const searchVal = $('#search').val();
    let i = 0;
    place.forEach(function (child) {
        if (child.includes(searchVal) == true) {
            $("#selectPlace").append('<div class="alert" id="block" onclick=openPlace("' + placesid[i] + '")>' +
                '<p>' + child.toUpperCase() + '</p>' +
                '</div>');
        }
        i++;
    });
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


function approve() {

    let city = allPlaces[selectedPlace].city;

    places.child(selectedPlace).set(allPlaces[selectedPlace]);

    var query = cities.orderByChild("title").equalTo(city);

    // console.log(query);
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

    query.once("child_added", function (snapshot) {
        snapshot.ref.child("places").push(selectedPlace);
    });

    placesNotApproved.child(selectedPlace + '/approved').set(true);
}

function deleteThePlace() {
    placesNotApproved.child(selectedPlace).remove();
}