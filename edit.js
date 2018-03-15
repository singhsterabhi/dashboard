var citylist=[];
var cityplaces=[];
var allPlacesInACity=[];
var citySelected='';
var placeSelected='';

$(document).ready(function(){
    cities.once('value',function(snapshot){

        snapshot.forEach(function(child) {

            var uid=child.key+'/places';
            citylist.push(child.val().title);
            var childplaces=[];
            cities.child(uid).once('value',function(snapone){
                snapone.forEach(function(childone){
                    // console.log(childone.val());
                    childplaces.push(childone.val());
                });
            });
            var city=child.val().title;
            
            cityplaces.push(childplaces);
            
        });
        // console.log(citylist);
    
        // console.log(citylist.length);
        // console.log(cityplaces);

        for(var i=0;i<citylist.length;i++){
            // console.log(citylist[i]);
            
            var app= "<option value="+citylist[i]+">"+citylist[i].toUpperCase()+"</option>";
            $('#selectCity').append(app);
        }
        
    });
    
});

var allPlacesInACity=[];

function addPlaces() {
    $('#selectPlace').empty();
    $('#selectPlace').html("<option>Default select</option>");
    var city=$('select[name=city]').val();
    citySelected=city;
    var cityPlaces = cityplaces[citylist.indexOf(city)];
    var t=0;
    
    var getPlaces = function(){
        return new Promise(function(resolve, reject){
            cityPlaces.forEach(function(child){
                places.child(child).once('value',function(snapshot){
                    allPlacesInACity.push(snapshot.val().name);
                    var app= "<option value="+child+">"+snapshot.val().name.toUpperCase()+"</option>";
                    $('#selectPlace').append(app);
                });
                
            });
            $('#placeselect').css('display','block');
        });
    };

    
    getPlaces();
    
}

var formChanged= false;
var details= ["name","description","url","citycategory","geourl"];

function changetrigger() {
    formChanged=true;
    console.log('form changed');
}

function editPlace(){
    formChanged=false;
    var place=$('select[name=place]').val();
    placeSelected=place;
    $('#presentImages').empty();
    console.log(place);
    places.child(place).once('value',function(snapshot){
        var data=snapshot.val();
        console.log(data.name);
        console.log(data.description);
        console.log(Object.keys(data.images.lowres));
        var imagesLowRes=[];
        imagesLowRes[0]=Object.keys(data.images.highres);
        imagesLowRes[1]=Object.values(data.images.highres);
        console.log(imagesLowRes);

        var imagesHighRes=[];
        imagesHighRes[0]=Object.keys(data.images.highres);
        imagesHighRes[1]=Object.values(data.images.highres);
        console.log(imagesHighRes);


        $('#name').val(data.name);
        $('#description').val(data.description);
        $('#website').val(data.url);
        $('#geourl').val(data.geourl);
        $('#category').val(data.category);

        $('#name').attr("onchange","changetrigger()");
        $('#description').attr("onchange","changetrigger()");
        $('#website').attr("onchange","changetrigger()");
        $('#geourl').attr("onchange","changetrigger()");\
        $('#category').attr("onchange","changetrigger()");
        
        var presentImages='';
        for(var i=0;i<(imagesLowRes[0].length);i++)
        {   console.log(i);
            var id='image'+(i+1);
            var onclk='del("'+id+'")';
            presentImages+="<label>IMAGE "+(i+1)+"</label>";
            presentImages+='<img src='+imagesLowRes[1][i]+' width="42" class="form-control" id="'+id+'" >';
            presentImages+="<button type='button' onclick='"+onclk+"' class='btn btn-primary'>Delete</button><br>";
            $('#presentImages').append(presentImages);

            // $('#image'+(i+1)).val(imagesLowRes[1][i]);
        }

        // $("#editPlace").css('display','inline-block');
    });

}


function editThePlace() {

    if(formChanged){
        var name,description,website,geourl,category,city,images;
        name=$('#name').val();
        description=$('#description').val();
        website=$('#website').val();
        geourl=$('#geourl').val();
        category=$('select[name=category]').val();
        city=$('#city').val();
        images=document.getElementById('images').files;
        var citycategory=city+'_'+category;

        var newData ={
            category:category,
            // city:city,
            citycategory: citycategory,
            description:description,
            geourl:geourl,
            name:name,
            url:website
        };

        // firebase.database().ref('users/' + userId).set({
        //     username: name,
        //     email: email,
        //     profile_picture : imageUrl
        //   });

        for(var i=0;i<details.length;i++){
            places.child(placeSelected+"/"+details[i]).set(newData[details[i]]);
        }


        for(var i=0;i<images.length;i++){
            var imgFile=images[i];
            imageCompressor.compress(imgFile, 0.6)
                .then(function(result) {
                  uploadImageAsPromise(result,placeSelected,i,false);
                  uploadImageAsPromise(imgFile,placeSelected,i,true);
                //   console.log('compressed');
                //   console.log(result);
                  
                })
                .catch((err) => {
                    // Handle the error
            });
        }
    }
    
}


function del(link){
    var image=$("img[id="+link+"]").attr('src');
    console.log(image);
    desertRef.delete().then(function() {
        // File deleted successfully
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
    
}