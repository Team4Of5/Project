
import * as firebase from 'firebase';
import * as Config from './Config.js';
import * as Tools from '../Team4of5_App/Tools.js';
import * as userService from './Users.js';

let ref = firebase.app().database().ref();
let usersRef = ref.child('users');
let contactRef = ref.child('chatContact');
let chatroomRef = ref.child('chatRoom');
let projectRef = ref.child('chatProject');
let historyRef = ref.child('chatHistory');



//listen contact online/offline
export const listenOnOffline = function (Uuid) {
    return firebase.database().ref("presence/" + Uuid);
}

export const listenCurUserOnOffline = function () {
    let amOnline = firebase.database().ref(".info/connected");
    let userRef = firebase.database().ref("presence/" + userService.getCurrentUser().uid);
    amOnline.on('value', function (snapshot) {
        if (snapshot.val()) {

            contactRef.child(userService.getCurrentUser().uid).child('status').once('value').then(function (status) {
                if (status.val() != null && status.val() == 'Active') {
                    console.log("connected");
                    userRef.onDisconnect().remove();
                    userRef.set(true);
                }
            })

        } else {
            console.log("not connected");
            userRef.set(false);
        }
    });
}


//History
export const listenHistoryChange = function (chatRoomUid) {

    return historyRef.child(userService.getCurrentUser().uid)
}

export const updateHistory = function (chatroomUid, lastMsg) {
    return new Promise(function (resolve, reject) {
        try {
            chatroomRef.child(chatroomUid).child('members').once('value').then(function (memData) {
                for (let key in memData.val()) {

                    historyRef.child(key).update({
                        [chatroomUid]: {
                            lastMsg: lastMsg
                        }
                    })
                }
            })

        } catch (err) {
            return reject(err)
        }
    });
}


export const queryChatHistory = function () {
    return new Promise(function (resolve, reject) {
        try {
            let hisData = [];
            contactRef.child(userService.getCurrentUser().uid).once('value').then(function (data) {
                let contactData = data.val();
                let count = 0;
                let dataSize = 0;
                for (let index in contactData) {

                    if (index == 'status') continue;

                    chatroomRef.child(contactData[index].chatroomUid).child('messages').orderByKey().
                        limitToLast(1).once('value').then(function (msgData) {

                            if (msgData.val() != null) {
                                dataSize = dataSize + 1;
                            }

                            const checkReturn = () => {
                                if (count == dataSize) {
                                    hisData.sort(function (a, b) {
                                        return parseInt(b.sendDate) - parseInt(a.sendDate);
                                    })
                                    return resolve(hisData);
                                }
                            }

                            for (let dateKey in msgData.val()) {


                                getUserName(msgData.val()[dateKey].senderUid).then(function (name) {




                                    if (contactData[index].type == 'Project') {

                                        getProjectName(index).then(function (pName) {
                                            count = count + 1;
                                            hisData.push({
                                                sendDate: dateKey,
                                                chatroomUid: contactData[index].chatroomUid,
                                                senderUid: msgData.val()[dateKey].senderUid,
                                                senderName: name.val(),
                                                content: msgData.val()[dateKey].content,
                                                type: contactData[index].type,
                                                contactUid: index,
                                                title: pName.val()
                                            })
                                            checkReturn();
                                        })
                                    } else {
                                        getUserName(index).then(function (UserName) {
                                            count = count + 1;
                                            hisData.push({
                                                sendDate: dateKey,
                                                chatroomUid: contactData[index].chatroomUid,
                                                senderUid: msgData.val()[dateKey].senderUid,
                                                senderName: name.val(),
                                                content: msgData.val()[dateKey].content,
                                                type: contactData[index].type,
                                                title: UserName.val()
                                            })
                                            checkReturn();
                                        })

                                    }

                                }).catch(function (err) {
                                    return reject(err)
                                })
                            }
                        })
                }
            }).catch(function (err) {
                return reject(err);
            })
        } catch (err) {
            return reject(err);
        }
    });
}

export const checkProjectNameExist = function (newName) {
    return new Promise(function (resolve, reject) {
        try {
            let size = 0
            let count = 0
            projectRef.once('value').then(function (data){
                for(let key in data.val()){
                    size = size + 1
                    getProjectName(key).then(function(pName){
                        count = count + 1;
                        if(pName.val() == newName){
                            return reject('Project name already existed, change your project name!!')
                        }
                        if(count == size){
                            return resolve();
                        }
                    })
                }
            }) 
        } catch (err) {
            return reject(err)
        }
    })
}

export const getProjectName = function (Puid) {
    return projectRef.child(Puid).child('name').once('value')
}

export const getUserName = function (Uuid) {
    return usersRef.child(Uuid).child('display_name').once('value')
}

export const getUserEmail = function (Uuid) {
    return usersRef.child(Uuid).child('email').once('value')
}

//Project related
export const createProject = function (memberUids, projectName) {
    return new Promise(function (resolve, reject) {
        try {
            let pUid = Tools.guid();
            let thisProjectRef = projectRef.child(pUid);
            let pMembersUpdate = {}

            //1. update name
            pMembersUpdate['name'] = projectName;
            thisProjectRef.update(pMembersUpdate);

            //auto included the current user into the project
            memberUids.push(userService.getCurrentUser().uid);
            //No need to save name there, users may update their display names
            pMembersUpdate = {
                members: memberUids
            }
            //2. update members
            thisProjectRef.update(pMembersUpdate);

            //3. update project to each individual
            let pChatRoomUid = Tools.guid();
            memberUids.forEach(function (Uuid) {
                addProjectToContact(pUid, Uuid, projectName, pChatRoomUid)
            }, this);
            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
}

//Chatroom related
export const checkSenderIsCurrentUser = function (senderUid) {
    return (senderUid == userService.getCurrentUser().uid)
}

export const listenChatRoomChange = function (chatRoomUid) {

    return chatroomRef.child(chatRoomUid).child('messages').orderByKey().limitToLast(1)

}


export const pushMsg = function (msg, chatRoomUid) {
    return new Promise(function (resolve, reject) {
        console.log(chatRoomUid)
        try {
            let timestamp = Date.now();
            chatroomRef.child(chatRoomUid).child('messages').update({
                [timestamp]: {
                    senderUid: userService.getCurrentUser().uid,
                    content: msg,
                    senderName: userService.getCurrentUser().displayName
                }
            });
            return resolve();
        } catch (err) {
            return reject(err);
        }


    });
}

//must be called after chatroom has been created
export const getChatroomMembers = function (chatRoomUid) {
    return new Promise(function (resolve, reject) {
        try {
            chatroomRef.child(chatRoomUid).child('members').once('value').then(function (data) {
                let userDNames = [];
                let totalSize = 0;
                let count = 0;
                let check = () => {
                    count = count + 1;
                    if (count == totalSize) {
                        return resolve(userDNames);
                    }
                }
                for (let key in data.val()) {
                    totalSize = totalSize + 1
                    getUserName(key).then(function (UserDName) {
                        if (UserDName.val() != null) {

                            userDNames.push(UserDName.val());
                            check()
                        } else {
                            getUserEmail(key).then(function (userEmail) {
                                userDNames.push(UserDName.val());
                                check()
                            }).catch(function (err) {
                                return reject(err)
                            })
                        }
                    }).catch(function (err) {
                        return reject(err)
                    })
                }
            }).catch(function (err) {
                return reject(err)
            })
        } catch (err) {
            return reject(err)
        }
    });
}


//Pass the members other than the current user
export const getChatroomMsg = function (contact, chatRoomUid) {
    return new Promise(function (resolve, reject) {
        try {
            let thisContactRef = chatroomRef.child(chatRoomUid);

            thisContactRef.once('value').then(function (data) {
                //create chat room
                if (data.val() == null) {

                    let membersUpdate = {}
                    let currentUserUid = userService.getCurrentUser().uid;



                    membersUpdate['/members/' + currentUserUid] = {
                        name: firebase.auth().currentUser.displayName,
                        status: 'online'
                    }
                    // contactData = [{ uid: this.props.extraData.ContactUid, data: this.props.extraData.ContactData }];
                    console.log("0:")
                    if (contact.data.type == 'Project') {
                        console.log("0-1")
                        projectRef.child(contact.uid).child('members').once('value').then(function (Uuids) {
                            console.log("1:")
                            for (let i = 0; i < Uuids.val().length; i++) {
                                console.log("2:")
                                if (Uuids.val()[i] != currentUserUid) {
                                    usersRef.child(Uuids.val()[i]).once('value').then(function (data) {
                                        console.log("3:")
                                        membersUpdate['/members/' + Uuids.val()[i]] = {
                                            name: data.val().display_name,
                                            status: 'online'
                                        }
                                        thisContactRef.update(membersUpdate);
                                    }).catch(function (err) {
                                        return reject(err);
                                    })
                                }
                            }
                        }).catch(function (err) {
                            return reject(err);
                        })
                    } else {
                        membersUpdate['/members/' + contact.uid] = {
                            name: contact.data.name,
                            status: 'online'
                        }
                    }
                    console.log("4")
                    thisContactRef.update(membersUpdate);

                    //If new chat room created, create history at the same time
                    updateHistory(chatRoomUid, '');

                    return resolve('');
                } else {
                    return thisContactRef.child('messages').orderByKey().once('value')
                }
            }).then(function (data) {
                let value;
                data == undefined ? value = '' : value = data.val()
                return resolve(value);
            })

                , (err) => {
                    return reject(err);
                }

        } catch (err) {
            return reject(err);
        }
    });
}


const addProjectToContact = function (projectUid, userUid, projectName, pRoomUid) {

    contactRef.child(userUid).update({
        [projectUid]: {
            type: 'Project',
            name: projectName,
            chatroomUid: pRoomUid,
        }

    });
}

export const getUserStatus = function () {
    return contactRef.child(userService.getCurrentUser().uid).child('status').once('value')
}

export const updateStatus = function (status) {
    return new Promise(function (resolve, reject) {
        try {
            contactRef.child(userService.getCurrentUser().uid).update({
                status: status
            })
            if (status == 'Active') {
                firebase.database().ref("presence/" + userService.getCurrentUser().uid).set(true)
            } else {
                firebase.database().ref("presence/" + userService.getCurrentUser().uid).set(false)
            }
            return resolve();
        } catch (err) {
            return reject(err);
        }
    })
}

export const addContact = function (contactUid, type) {
    return new Promise(function (resolve, reject) {
        let user = userService.getCurrentUser();
        if (contactUid == user.uid) return reject("You cannot add yourself!!!")

        contactRef.child(user.uid).child(contactUid).once('value').then(function (data) {
            console.log(data.val());
            if (data.val() == null) {
                return usersRef.child(contactUid).once('value')
            } else {
                return reject("User already exists")
            }
        }).then((snapshot) => {
            try {
                //Assign chatRoom Uid first
                let chatRoomUid = Tools.guid();
                const updateContact = (selfUid, contactUid, type, name) => {
                    console.log(selfUid, contactUid, type, name)
                    let thisContactRef = contactRef.child(selfUid);
                    thisContactRef.update({
                        [contactUid]: {
                            type: type,
                            name: name,
                            chatroomUid: chatRoomUid,
                        }

                    });
                }

                console.log(snapshot.val())
                console.log(user)
                updateContact(user.uid, contactUid, type, snapshot.val().display_name);
                updateContact(contactUid, user.uid, type, user.displayName);
                return resolve();
            } catch (err) {
                return reject(err)
            }

        }, (err) => {
            // The Promise was rejected.
            return reject(err)
        }).catch(function (err) {
            return reject(err)
        })


    });
}

export const getUserContacts = function () {
    return new Promise(function (resolve, reject) {
        contactRef.child(userService.getCurrentUser().uid).once('value').then(function (data) {
            console.log(data.val());
            return resolve(data.val())
        }, (err) => {
            return reject(err)
        })
    });
}





export const findUser = function (user_email) {
    ;
    return new Promise(function (resolve, reject) {
        usersRef.on("child_added", function (snapshot) {

            if (snapshot.val().email == user_email) {
                //console.log(snapshot.key);
                return resolve(snapshot.key);
            }

        });

        setTimeout(function () {
            return reject("User not found!! Promise timed out after 500 ms");
        }, 500);
    });
}


