// import ImageCompressor from 'image-compressor.js';
// import ImageCompressor from '@xkeshi/image-compressor';
const imageCompressor = new ImageCompressor();

function cat() {
    category = $('select[name=category]').val();
    console.log(category);

    if (category == 'instagramhotspots') {
        $('#paired').css('display', 'block');
    } else {
        $('#paired').css('display', 'none');
    }
}

function addAPlace() {
    
    let promise = new Promise(function (resolve, reject) {
        $('#submit').attr('disabled','');
        $('#loader').css('display','block');
        var name, description, website, geourl, category, city, images, pairedcolor, geolabel;
        name = $('#name').val();
        description = $('#description').val();
        website = $('#website').val();
        geourl = $('#geourl').val();
        geolabel = $('#geolabel').val();
        category = $('select[name=category]').val();
        city = $('#city').val();
        images = document.getElementById('images').files;
        var citycategory = city + '_' + category;

        var data = {
            user: uid,
            category: category,
            city: city,
            citycategory: citycategory,
            description: description,
            geourl: geourl,
            geolabel: geolabel,
            name: name,
            url: website,
            approved: false
        };

        if (category == 'instagramhotspots') {
            pairedcolor = $('#pairedcolor').val();
            data[pairedcolor] = pairedcolor;
        }

        var i = 0;
        var pushedPlace = placesNotApproved.push().key;
        placesNotApproved.child(pushedPlace).update(data)
            .then(function () {

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
                                return uploadImageAsPromise(result, pushedPlace, false, name);
                            })
                            .then(() => {
                                return uploadImageAsPromise(imgFile, pushedPlace, true, name);
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

            })
            .then(function () {
                console.log('Place Successfully Added');
                reset();
                resolve('Place Successfully Added');
            }).catch((err) => {
                console.log(err);
            });
    });

    promise.then(function (val) {
        alert(val);
    }).catch(function (err) {
        alert(err);
    });
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
    $('#submit').removeAttr('disabled');
    $('#loader').css('display','none');
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}