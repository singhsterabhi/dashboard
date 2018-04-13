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


FileList.prototype.forEach = function (callback) {
    [].forEach.call(this, callback)
};

function addAPlace() {

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

    // console.log(images.name);
    // console.log(geolabel);

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

    // console.log(data);

    var pushedPlace = placesNotApproved.push(data);

    var i = 0;
    images.forEach(element => {
        // console.log(element);
        var imgFile = images[i];
        i++;
        imageCompressor.compress(imgFile, 0.6)
            .then(function (result) {
                uploadImageAsPromise(result, pushedPlace.key, i, false);
                uploadImageAsPromise(imgFile, pushedPlace.key, i, true);

            })
            .catch((err) => {
                // Handle the error
            });
    });

}