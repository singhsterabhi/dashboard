// import ImageCompressor from 'image-compressor.js';
// import ImageCompressor from '@xkeshi/image-compressor';
const imageCompressor = new ImageCompressor();

function cat(){
    category=$('select[name=category]').val();
    console.log(category);
    
    if(category=='instagramhotspots'){
        $('#paired').css('display','block');
    }
    else{
        $('#paired').css('display','none');
    }
}


function addAPlace(){

    // var addtheplace= function(){
    //     return new Promise(function(resolve, reject){
            var name,description,website,geourl,category,city,images,pairedcolor,geolabel;
            name=$('#name').val();
            description=$('#description').val();
            website=$('#website').val();
            geourl=$('#geourl').val();
            geolabel=$('#geolabel').val();
            category=$('select[name=category]').val();
            city=$('#city').val();
            images=document.getElementById('images').files;
            var citycategory=city+'_'+category;
            
            // console.log(images.name);
            // console.log(geolabel);
            
            var data={
                category:category,
                city:city,
                citycategory: citycategory,
                description:description,
                geourl:geourl,
                geolabel:geolabel,
                name:name,
                url:website
            };


            if(category=='instagramhotspots'){
                pairedcolor=$('#pairedcolor').val();
                data[pairedcolor]=pairedcolor;
            }

            // console.log(data);
            
            var pushedPlace = places.push(data);

            var query = cities.orderByChild("title").equalTo(city);

            // console.log(query);
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
                    
                    })
                    .catch((err) => {
                        // Handle the error
                });
            }
        // });
    // };


    // return addtheplace().then(function(){
    //     return window.location.reload();
    // });
    

}
