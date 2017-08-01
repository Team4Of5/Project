

import * as firebase from 'firebase';
import * as Config from './Config.js';


firebase.initializeApp(Config.firebase_config);
var ref = firebase.app().database().ref();
var usersRef = ref.child('users');
var issueRef = ref.child('issues');

const issueStatus = ['New', 'Open', 'Assiged', 'Fixed', 'Verified', 'Closed'];

firebase.auth().onAuthStateChanged(function (user) {
    if(user){
        localStorage.setItem("currentUser", JSON.stringify(user))
    }else{
        localStorage.setItem("currentUser", "")
    }
    
});

export const create_user = function (user_email, user_pass) {
    return firebase.auth().createUserWithEmailAndPassword(user_email, user_pass);
}

export const sign_in_user = function (user_email, user_pass) {
    return firebase.auth().signInWithEmailAndPassword(user_email, user_pass);
}

export const saveUserinfo = function () {
    return firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // alert("user " + user.uid + " logged in");
            var user_uid = user.uid;
            var user_email = user.email;


            var thisUserRef = usersRef.child(user_uid);
            thisUserRef.update({
                last_login_dtm: Date.now(),
                email: user_email
            });
            thisUserRef.on("value", function (snapshot) {
                var role = snapshot.val().role;
                var company = snapshot.val().company
                if (role == null) {
                    thisUserRef.update({
                        role: 'Customer'
                    });



                }
            });
        }
    });
}

export const updateRole = function (email, company, new_role) {
    var user = getCurrentUser();
    var user_email = user.email;
    return usersRef.once("value", function (snap) {
        const keys = Object.keys(snap.val());
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const uid = k
            var thisUserRef = usersRef.child(k)
            thisUserRef.once("value", function (snap2) {
                if (snap2.val().email == email) {
                    if (snap2.val().company != company) {
                        alert("You cannot edit someone outside of your company")
                    } else if (snap2.val().role == "Sysadmin") {
                        alert("You cannot edit Sysadmin privileges")
                    }
                    else {
                        alert("User " + this.state.value.email + " has been changed to role " + this.state.newRole)
                        usersRef.child(k).update({
                            role: new_role
                        });
                    }

                }

            });

        }
    });

}

export const updateCompany = function (email, user_company) {
    return usersRef.once("value", function (snap) {
        const keys = Object.keys(snap.val());
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const uid = k
            var thisUserRef = usersRef.child(k)
            thisUserRef.once("value", function (snap2) {
                if (snap2.val().email == email) {

                    usersRef.child(k).update({
                        company: user_company
                    });
                }


            });

        }
    });

}


// this is reset password if email in manually given
export const resetPwd = function (user_email) {
    return firebase.auth().sendPasswordResetEmail(user_email);
}

// this function resets the password if the user is logged in
export const resetPwdWhenLoggedOn = function () {
    return firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // alert("user " + user.email + " wants to reset their passwords");
            var user_email = user.email;
            var user_uid = user.uid;
            var thisUserRef = usersRef.child(user_uid);
            firebase.auth().sendPasswordResetEmail(user_email);
        } // end if
    }) // end function
}

// this allows a user to update their display name in the settings tab
export const updateSettings = function (user_display_name, user_role) {
    var user = getCurrentUser()
    var user_uid = user.uid;
    var thisUserRef = usersRef.child(user_uid);


    if (user_display_name && user_role) {
        return thisUserRef.update({
            display_name: user_display_name,
            role: user_role
        });
    }
    else if (user_display_name) {
        //Kyle: Update display_name to current user profile(firebase build-in) as well
        user.updateProfile({
            displayName: user_display_name
        }).then(function () {
            // Update successful.
        }, function (error) {
            // An error happened.
        });
        return thisUserRef.update({
            display_name: user_display_name
        });
    }
    else if (user_role) {
        return thisUserRef.update({
            role: user_role
        });
    }

}


// this allows a user to logout
// it shouldn't need any parameters if the user is logged in
export const logoutUser = function () {
    firebase.database().ref("presence/" + getCurrentUser().uid).set(false);
    return firebase.auth().signOut();
}

export const getCurUserCompany = function () {
    return usersRef.child(getCurrentUser().uid).child('company').once('value')
}

//Must check current user exist before calling this function!!!!!
export const getUserData = function () {
    let user = getCurrentUser();
    return firebase.database().ref().child('users/' + user.uid).once('value')
}


export const getCurrentUser = function () {
    if(firebase.auth().currentUser != null){
        return firebase.auth().currentUser;
    }
    else if(JSON.parse(localStorage.getItem("currentUser") != "")){
        return JSON.parse(localStorage.getItem("currentUser"))
    }else{
        console.log("User loggout!!!")
    }
}

export const getAllUserData = function () {

    return issueRef.orderByKey().once("value");

}


export const getAllUsersData = function () {

    return usersRef.orderByKey().once("value");

}



