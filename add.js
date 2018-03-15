// import ImageCompressor from 'image-compressor.js';
// import ImageCompressor from '@xkeshi/image-compressor';
const imageCompressor = new ImageCompressor();


function addAPlace(){
    var name,description,website,geourl,category,city,images;
    name=$('#name').val();
    description=$('#description').val();
    website=$('#website').val();
    geourl=$('#geourl').val();
    category=$('select[name=category]').val();
    city=$('#city').val();
    images=document.getElementById('images').files;
    var citycategory=city+'_'+category;
    
    // console.log(images.name);
    // console.log(category);
    

    var pushedPlace = places.push({
        category:category,
        city:city,
        citycategory: citycategory,
        description:description,
        geourl:geourl,
        name:name,
        url:website
    });

    var query = cities.orderByChild("title").equalTo(city);

    console.log(query);
    query.once('value',function(snapshot){
        console.log(snapshot.exists());
        
        if (snapshot.exists())
            console.log('exists');
        else{
            console.log("doesn't");
            cities.push({
                title:city
            });
            
        }
            
    });
    
    query.once("child_added", function (snapshot) {
        snapshot.ref.child("places").push(pushedPlace.key);
    });

    for(var i=0;i<images.length;i++){
        var imgFile=images[i];
        imageCompressor.compress(imgFile, 0.6)
            .then(function(result) {
              uploadImageAsPromise(result,pushedPlace.key,i,false);
              uploadImageAsPromise(imgFile,pushedPlace.key,i,true);
            //   console.log('compressed');
            //   console.log(result);
              
            })
            .catch((err) => {
                // Handle the error
            });
          }

}
