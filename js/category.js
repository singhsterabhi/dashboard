// let category

$(document).ready(function () {
    let authentication = new Promise((resolve, reject) => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                uid = user.uid;
                let status;

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
                    else{
                        logout();
                    }

                    if (status != 'user')
                        db = places;
                    else
                        db = placesNotApproved;

                });

                console.log('logged in', user.uid);

                $('#logout').attr('title', user.email);

                resolve();
            } else {
                // User is signed out.
                // ...
                console.log('logged out');
                window.location = "/";
            }
        });
    });

    authentication.then(() => {
        console.log(uid);

        update();

    }).catch(function (err) {
        alert(err);
    });
});


function add() {
    console.log($('#cat').val());
    categories.push($('#cat').val()).then(() => {
        $('#cat').val('');
        $('tbody').empty();
        update();
    });
}

function update() {
    category=[];
    categories.once('value', function (snapshot) {

        snapshot.forEach(function (child) {
            category.push(child.key);

            let app = `<tr>
            <td>${child.val()}</td>
            <td>
                <label class="switch"  >
                    <button id="${child.key}" class="btn btn-danger btn-sm" onclick="remove('${child.key}')" style="margin:0;">X</button>
                </label>
            </td>
        </tr>`;
            $('tbody').append(app);
        });
    });
}

function remove(t){
    console.log(t);
    
    categories.child(t).remove().then(()=>{
        $('tbody').empty();
        update();
        console.log('deleted');
    })
}