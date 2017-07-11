

import * as firebase from 'firebase';
import * as Config from './Config.js';


var ref = firebase.app().database().ref();
var issueRef = ref.child('issues');
var usersRef = ref.child('users');


export const addNewIssue = function(
    completionDate, details,
    expComDate, owner, project,
       issue_status, type, priority, severity){

	    issueRef.push({
              owner: owner,
              completionDate: completionDate,
              details: details,
              expComDate: expComDate,
              issuedate: Date.now(),
              type: type,
              project: project,
              status: issue_status,
              priority:priority,
              severity:severity,
              issue_last_edited_dtm: Date.now()
              });
}

export const updateIssueStatus = function(issue_id,status){
              var thisIssueRef = issueRef.child(issue_id);
              thisIssueRef.update({
              status: status,
              issue_last_edited_dtm: Date.now()
              });
}

// export const updateOwner = function(issue_id,owner){
//               var thisIssueRef = issueRef.child(issue_id);
//               thisIssueRef.update({
//               owner: owner,
//               issue_last_edited_dtm: Date.now()
//               });
// }

export const update_completion_dt = function(issue_id,completionDate){
              var thisIssueRef = issueRef.child(issue_id);
              thisIssueRef.update({
              completiondate: completionDate,
              bug_last_edited_dtm: Date.now()
              });
}
// this allows a user to update their display name in the settings tab
export const issueUpdate = function (issueID, completionDate, status,priority,severity) {

    var issue_id = issueID;
    var exists = false
    var comp, pri, stat, sev;

    issueRef.child(issue_id).once('value', function(snapshot) {
      exists = (snapshot.val() !== null);
      comp = snapshot.val().completionDate;
      stat = snapshot.val().status;
      pri  = snapshot.val().priority;
      sev = snapshot.val().severity;
    });
    completionDate = completionDate ? completionDate : comp;
    status = status ? status : stat;
    priority = priority ? priority : pri;
    severity = severity ? severity : sev;

    if (exists){
    var thisIssueRef = issueRef.child(issue_id);

    if (completionDate  ||  status || priority || severity) {
        return thisIssueRef.update({
            completionDate: completionDate,
             status: status,
             priority:priority,
             severity:severity,
              issue_last_edited_dtm: Date.now()
        });
    }

}
else {
  alert("Issue not found; please enter a valid issue ID")
}
}
