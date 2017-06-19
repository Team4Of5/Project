

import * as firebase from 'firebase';
import * as Config from './Config.js';


firebase.initializeApp(Config.firebase_config);
var ref = firebase.app().database().ref();
var usersRef = ref.child('users');



export const find_role = function (){
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var user_uid = user.uid;
            var thisUserRef = usersRef.child(user_uid);
            // alert("user " + user.uid + " logged in");
            thisUserRef.on("value", function(snapshot) {
              var userInfo = snapshot.val();
              var x = userInfo.display_name + ", "  + userInfo.role;
              return x;
            });
            }
        });
}

export const create_user = function (user_email, user_pass) {
    return firebase.auth().createUserWithEmailAndPassword(user_email, user_pass);
}

export const sign_in_user = function (user_email, user_pass) {
    return firebase.auth().signInWithEmailAndPassword(user_email, user_pass);
}

export const saveUserinfo = function () {
    return firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    // alert("user " + user.uid + " logged in");
		    var user_uid = user.uid;
		    var thisUserRef = usersRef.child(user_uid);
		          thisUserRef.update({
			      last_login_dtm: Date.now()
     		});
		    } 
        });
}

// this is reset password if email in manually given
export const resetPwd = function(user_email){
    return firebase.auth().sendPasswordResetEmail(user_email);
}

// this function resets the password if the user is logged in
export const resetPwdWhenLoggedOn = function(){
       return firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // alert("user " + user.email + " wants to reset their passwords");
         var user_email  = user.email;
         firebase.auth().sendPasswordResetEmail(user_email);
        } // end if
       }) // end function
}

// this allows a user to update their display name in the settings tab
export const updateUserDisplayName = function(user_display_name){
   return firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
       // alert("user " + user.uid + " changed their display name to " + user_display_name);
        var user_uid = user.uid;
		var thisUserRef = usersRef.child(user_uid);
              thisUserRef.update({
              display_name: user_display_name
                });
        } // end if
    }) //end function
}

// this allows a user to update their role in the settings tab
export const updateRole = function(user_role){
       return firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var user_uid = user.uid;
            var thisUserRef = usersRef.child(user_uid);
            thisUserRef.update({
                role: user_role,  
                last_login_dtm: Date.now(),
            });
        }
    })
}

// this allows a user to logout
// it shouldn't need any parameters if the user is logged in
export const logoutUser = function(){
    return firebase.auth().signOut();
}



    // .then(function (user) {
    //     // user signed in
    //     return null;
    // }).catch(function (error) {
    //     console.log(error);
    //     //var errorCode = error.code;
    //     //var errorMessage = error.message;
    //     console.log(error.message);
    //     return error.message;
    // });

    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         console.log("user " + user.uid + " logged in");
    //         let user_uid = user.uid;
    //         let thisUserRef = firebase.app().database().ref().child('users').child(user_uid);

    //         thisUserRef.update({
    //             display_name: user.displayName,
    //             last_login_dtm: Date.now(),
    //         });
    //         return;
    //     }
    // });
    // return;
