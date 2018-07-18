let allUsers = {};
let userId = [];
let userStatus = [];

$(document).ready(function () {
    let authentication = new Promise((resolve, reject) => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.uid != "g8AntULTJcWcqTSbS3gSMoBslHw2") {
                    $('.approve').remove();
                } else {
                    $('.approve').css('display', 'block');
                }
                console.log('logged in', user.uid);
                uid = user.uid;
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

        users.orderByChild("status").equalTo("admin").once('value', function (snapshot) {

            snapshot.forEach(function (child) {
                // console.log(child);
                // console.log(child.val());


                allUsers[child.key] = child.val();
                userId.push(child.key);
                userStatus.push(child.val().status);

                let app = `<tr>
                <td>${child.val().email}</td>
                <td>
                    <label class="switch">
                        <input id="${child.key}" type="checkbox" checked  onclick="ckecked('${child.key}')">
                        <span class="slider round"></span>
                    </label>
                </td>
            </tr>`;
                $('tbody').append(app);
            });
        });

        users.orderByChild("status").equalTo("user").once('value', function (snapshot) {

            snapshot.forEach(function (child) {
                // console.log(child);
                // console.log(child.val());


                allUsers[child.key] = child.val();
                userId.push(child.key);
                userStatus.push(child.val().status);

                let app = `<tr>
                <td>${child.val().email}</td>
                <td>
                    <label class="switch"  >
                        <input id="${child.key}" type="checkbox" onclick="ckecked('${child.key}')">
                        <span class="slider round" ></span>
                    </label>
                </td>
            </tr>`;
                $('tbody').append(app);
            });
        });

    }).catch(function (err) {
        alert(err);
    });

    // $('.switch').click(function () {
    //     var id = $(this).attr('id');
    //     console.log(id);
    // });
});

function ckecked(id) {
    // console.log(id);
    users.child(id).once('value').then((snapshot) => {
        // console.log(snapshot.val());

        // console.log(snapshot.val().status);
        if (snapshot.val().status == 'admin') {
            users.child(id + "/status").set('user').then(() => {
                // console.log('changed to user');

            });
        } else if (snapshot.val().status == 'user') {
            users.child(id + "/status").set('admin').then(() => {
                // $("#"+id).prop('checked',true);
                // console.log('changed to admin');
            });
        }
    })
}