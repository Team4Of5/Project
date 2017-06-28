

import * as firebase from 'firebase';
import * as Config from './Config.js';


var ref = firebase.app().database().ref();
var issueRef = ref.child('issues');


export const addNewIssue = function(
    issue_id, completionDate, details,
    expComDate, issueDate, owner, project,
       issue_status){
        var thisIssueRef = issueRef.child(issue_id);
	    thisIssueRef.update({
              id: issue_id,
              owner: owner,
              completionDate: completionDate,
              details: details,
              expComDate: expComDate,
              issuedate: issueDate,
              project: project,
              status: issue_status,
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

export const updateOwner = function(issue_id,owner){
              var thisIssueRef = issueRef.child(issue_id);
              thisIssueRef.update({
              owner: owner,
              issue_last_edited_dtm: Date.now()
              });
}

export const update_completion_dt = function(issue_id,completionDate){
              var thisIssueRef = issueRef.child(issue_id);
              thisIssueRef.update({
              completiondate: completionDate,
              bug_last_edited_dtm: Date.now()
              });
}
