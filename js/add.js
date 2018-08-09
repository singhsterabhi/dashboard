// import ImageCompressor from 'image-compressor.js';
// import ImageCompressor from '@xkeshi/image-compressor';
const imageCompressor = new ImageCompressor();

let categs = [];

auth.onAuthStateChanged(function (user) {
    if (user) {
        uid = user.uid;

        users.child(uid + "/status").once('value', function (snapshot) {
            console.log(snapshot.val());
            status = snapshot.val();
        }).then(() => {
            if (status != "user") {
                console.log(status);
                $('.approve').css('display', 'block');
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

        });

        console.log('logged in', user.uid);
        $('#logout').attr('title', user.email);

        categories.once('value', (snapshot) => {
            snapshot.forEach(element => {
                // category.push(element.val());
                let a = (element.val().toLowerCase()).split(' ').join('_');
                catlist[a] = element.val();
            });
        });
        cats();

    } else {
        console.log('logged out');
        window.location = "/";
    }
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
    console.log(c);
    console.log($(`#${c}`).prop('checked'));

    if ($(`#${c}`).prop('checked')) {
        categs.push(c);
    } else {
        categs.splice(categs.indexOf(c), 1);
    }
    console.log(categs);
}


function addAPlace() {
    let promise = new Promise(function (resolve, reject) {
        var name, description, website, geourl, category, city, images, pairedcolor, geolabel;
        name = $('#name').val();
        description = $('#description').val();
        website = $('#website').val();
        geourl = $('#geourl').val();
        geolabel = $('#geolabel').val();
        city = $('#city').val();
        images = document.getElementById('images').files;
        console.log(images);

        var data = {
            user: uid,
            category: categs,
            city: city,
            description: description,
            geourl: geourl,
            geolabel: geolabel,
            name: name,
            url: website
        };
        for (let t = 0; t < categs.length; t++) {
            data[`${city.toLowerCase().split(' ').join('_')}_${categs[t]}`] = true;
        }


        var i = 0;
        if (name != '' && description != '' && website != '' && geourl != '' && geolabel != '' && city != '' && categs.length != 0 && images.length != 0) {

            var pushedPlace = db.push().key;
            db.child(pushedPlace).update(data)
                .then(function () {
                    $('#submit').attr('disabled', '');
                    $('#loader').css('display', 'block');
                    if (status != 'user')
                        db.child(pushedPlace + '/approved').set(true);
                    else
                        db.child(pushedPlace + '/approved').set(false);

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
                            console.log(imgFile);

                            var name = uuidv4();
                            i++;
                            imageCompressor.compress(imgFile, 0.2)
                                .then(function (result) {
                                    return uploadImageAsPromise(result, pushedPlace, false, name, db);
                                })
                                .then(() => {
                                    return uploadImageAsPromise(imgFile, pushedPlace, true, name, db);
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

                }).then(() => {
                    var query = cities.orderByChild("title").equalTo(city);
                    if (status != 'user')
                        return query.once('value', function (snapshot) {
                            console.log(snapshot.exists());

                            if (snapshot.exists())
                                console.log('exists');
                            else {
                                console.log("doesn't");
                                cities.push({
                                    title: city
                                });
                            }
                        }).then(() => {
                            return query.once("child_added", function (snapshot) {
                                snapshot.ref.child("places").push(pushedPlace);
                            });
                        });
                    else
                        return;
                })
                .then(() => {
                    console.log('Place Successfully Added');
                    reset();
                    resolve('Place Successfully Added');
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            alert('All fields are required');
        }
    });

    promise.then(function (val) {
        alert(val);
    }).catch(function (err) {
        alert(err);
    });

}

function reset() {
    categ = [];
    // catelem='';
    $('#name').val('');
    $('#description').val('');
    $('#website').val('');
    $('#geourl').val('');
    $('#geolabel').val('');
    $('#images').val('');
    $('#city').val('');
    $('#submit').removeAttr('disabled');
    $('#loader').css('display', 'none');
    $('.form').empty();
    // cats();
    $('.form').append(catelem);
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}