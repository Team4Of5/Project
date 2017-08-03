
import * as firebase from 'firebase';
import * as Config from './Config.js';
import * as Tools from '../Team4of5_App/Tools.js';

let ref = firebase.app().database().ref();
let usersRef = ref.child('users');
let chatProject = ref.child('chatProject');


export const getProjectData = function () {


    return chatProject.orderByKey().once("value");


}

export const getProjects = function () {


    return chatProject.once("value");


}




export const addNewCard = function (laneID, id, title, description, project) {


    var card_lane;
    switch (laneID) {
        case "Backlog":
            card_lane = 0;
            break;
        case "Next":
            card_lane = 1;
            break;
        case "InProgress":
            card_lane = 2;
            break;
        case "Staged":
            card_lane = 3;
            break;
        case "QA":
            card_lane = 4;
            break;
        case "Live":
            card_lane = 5;
            break;
        default:
            card_lane = 0;
    }
    getProjectData().then(function (data) {

        //var Project = '0be3f584-33ce-11e2-7b8c-72fe4d59dc4f';

        const projdata = data.val();
        var projArray = [];
        var lanes = [];
        var cards = [];
        const keys = Object.keys(projdata);
        var indexOfProject = keys.indexOf(project);
        if (projdata[keys[indexOfProject]].data != undefined) {
            projArray.push(projdata[keys[indexOfProject]].data.lanes);
            lanes = projArray[0];

            if (lanes[card_lane] != undefined) {
                if (lanes[card_lane].cards != undefined) {
                    cards = lanes[card_lane].cards;
                }
            }
        }
        cards.push({ id: id, title: title, description: description });
        //chatProject.push(lanes);

        var path = project + '/data/lanes/' + card_lane;

        var thisRef = chatProject.child(path);

        //f (user_display_name && user_role) {
        return thisRef.update({
            cards: cards,
            id: laneID,
            label: '0/0',
            title: laneID
        });
        //}

    },
        function (err) {
            //Error occur
            console.log("Promise Error");
            console.log(err);
        }
    );
}


export const removeCard = function (laneID, id, project) {

    var card_lane;
    switch (laneID) {
        case "Backlog":
            card_lane = 0;
            break;
        case "Next":
            card_lane = 1;
            break;
        case "InProgress":
            card_lane = 2;
            break;
        case "Staged":
            card_lane = 3;
            break;
        case "QA":
            card_lane = 4;
            break;
        case "Live":
            card_lane = 5;
            break;
        default:
            card_lane = 0;
    }
    getProjectData().then(function (data) {

        const projdata = data.val();
        var projArray = [];
        var lanes = [];
        var cards = [];
        const keys = Object.keys(projdata);
        var indexOfProject = keys.indexOf(project);
        projArray.push(projdata[keys[indexOfProject]].data.lanes);
        lanes = projArray[0];
        //cards = lanes[card_lane].cards;
        //cards.push({ id: id, title: title, description: description });


        if (lanes[card_lane].cards != undefined) {
            for (let i = 0; i < lanes[card_lane].cards.length; i++) {
                cards[i] = lanes[card_lane].cards[i];
            }
        }

        //var array = [2, 5, 9];
        //var index = cards.indexOf({id:id});
        var index = cards.findIndex(x => x.id == id);

        if (index > -1) {
            cards.splice(index, 1);
        }

        //chatProject.push(lanes);

        var path = project + '/data/lanes/' + card_lane;

        var thisRef = chatProject.child(path);
        //console.log("Checking");
        //console.log(thisRef);

        //f (user_display_name && user_role) {
        return thisRef.update({
            cards: cards
        });
        //}

    },
        function (err) {
            //Error occur
            console.log("Promise Error");
            console.log(err);
        }
    );
}




export const updateCard = function (id, laneID, targetLaneId, project) {

    var card_lane;
    switch (laneID) {
        case "Backlog":
            card_lane = 0;
            break;
        case "Next":
            card_lane = 1;
            break;
        case "InProgress":
            card_lane = 2;
            break;
        case "Staged":
            card_lane = 3;
            break;
        case "QA":
            card_lane = 4;
            break;
        case "Live":
            card_lane = 5;
            break;
        default:
            card_lane = 0;
    }
    getProjectData().then(function (data) {

        const projdata = data.val();
        var projArray = [];
        var lanes = [];
        var cards = [];
        const keys = Object.keys(projdata);
        var indexOfProject = keys.indexOf(project);
        if (projdata[keys[indexOfProject]] != undefined) {
            projArray.push(projdata[keys[indexOfProject]].data.lanes);
            lanes = projArray[0];
            //cards = lanes[card_lane].cards;
            //cards.push({ id: id, title: title, description: description });

            if (lanes[card_lane] != undefined) {
                if (lanes[card_lane].cards != undefined) {
                    for (let i = 0; i < lanes[card_lane].cards.length; i++) {
                        cards[i] = lanes[card_lane].cards[i];
                    }
                }
            }
        }


        //var array = [2, 5, 9];
        //var index = cards.indexOf({id:id});
        var index = cards.findIndex(x => x.id == id);

        var newDesc = '';
        var newTitle = '';
        var newId = '';

        if (index > -1) {
            newDesc = cards[index].description;
            newTitle = cards[index].title;
            newId = cards[index].id;
            addNewCard(targetLaneId, newId, newTitle, newDesc, project);

            cards.splice(index, 1);
        }

        //chatProject.push(lanes);

        var path = project + '/data/lanes/' + card_lane;

        var thisRef = chatProject.child(path);
        //console.log("Checking");
        //console.log(thisRef);

        //f (user_display_name && user_role) {
        return thisRef.update({
            cards: cards
        });

    },
        function (err) {
            //Error occur
            console.log("Promise Error");
            console.log(err);
        }
    );
}