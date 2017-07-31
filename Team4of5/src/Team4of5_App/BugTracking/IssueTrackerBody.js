import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Navbar, Jumbotron, Button, Input, Nav } from 'react-bootstrap';

//Connect Firebase
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';
import * as Issues from '../../Team4of5_Service/Issues.js';
import IssueUpdate from './IssueUpdate.js';
import './IssueTracker.css';
import * as ChatProj from '../../Team4of5_Service/ChatProject.js';
import * as Users from '../../Team4of5_Service/Users.js';

const issueData = []
const issueStatus = [{
  value: 'New',
  text: 'New'
}, {
  value: 'Open',
  text: 'Open'
}, {
  value: 'Assigned',
  text: 'Assigned'
}, {
  value: 'Fixed',
  text: 'Fixed'
},
{
  value: 'Verified',
  text: 'Verified'
},
{
  value: 'Closed',
  text: 'Closed'
}]
const issueType = [{
  value: 'Blocker',
  text: 'Blocker'
}, {
  value: 'Critical',
  text: 'Critical'
}, {
  value: 'Major',
  text: 'Major'
}, {
  value: 'Minor',
  text: 'Minor'
},
{
  value: 'Trivial',
  text: 'Trivial'
}]
const issuePriority = [{
  value: 'Immediate',
  text: 'Immediate'
}, {
  value: 'High',
  text: 'High'
}, {
  value: 'Medium',
  text: 'Medium'
}, {
  value: 'Low',
  text: 'Low'
},
{
  value: 'Verified',
  text: 'Verified'
},
{
  value: 'Fix if time',
  text: 'Fix if time'
}]
const issueSeverity = [{
  value: 'Critical',
  text: 'Critical'
}, {
  value: 'High',
  text: 'High'
}, {
  value: 'Medium',
  text: 'Medium'
}, {
  value: 'Low',
  text: 'Low'
},
{
  value: 'None',
  text: 'None'
}]
const issueFilterStyle = {
  width:150,
  height:20,
  fontSize: 12,

};

class IssueTrackerBody extends React.Component{
  constructor(props) {
  super(props);

  this.state = {
    issues:[],
    projdata: [],
    thisUser: ''
  };

    this.issueRef = firebase.database().ref().child('issues');
    this.getData = this.getData.bind(this);

}
//After the connect, what the state will do--gotdata
componentDidMount() {

  let self = this;
  this.state.thisUser = Users.getCurrentUser().uid;

  ChatProj.getProjects().then(function (data) {

      self.getData(data);

  },
      function (err) {
          //Error occur
          console.log("Promise Error");
          console.log(err);
      }
  );

}
    getData(data) {
        const projdata = data.val();
        var projArray = []
        const keys = Object.keys(projdata);
        for (var i = 0; i< keys.length; i++){
          var members = []
          var projname =''
          var user_in_proj = false
          const k = keys[i];

          projname = projdata[k].name

          for (var x = 0; x< projdata[k].members.length; x++){
            if (projdata[k].members[x] == this.state.thisUser){
              user_in_proj = true
            }
          }

          if (user_in_proj == true){
              projArray.push({name: projname});
          }
            
        }
        this.setState({projdata: projArray});
        this.issueRef.on('value', this.gotData, this.errData);


      }

//get the data from the firebase and push them out
 gotData = (data) => {
      let newIssue = []
      const issuedata = data.val();
      const keys = Object.keys(issuedata);

      for (let i = 0; i < keys.length; i++) {
        var projMatch = false
        const k = keys[i];

        //reformat the dates
        var issuedate_reformat = new Date(issuedata[k].issuedate);
        issuedate_reformat =  (issuedate_reformat.getMonth() + 1) + '/' + (issuedate_reformat.getDate() +1) + '/'+ issuedate_reformat.getFullYear();

        if (issuedata[k].completionDate == 'null') {
        var completionDate_reformat = 'N/A'
        }
        else{
        var completionDate_reformat = new Date(issuedata[k].completionDate);

        completionDate_reformat =  (completionDate_reformat.getMonth() + 1) + '/' + (completionDate_reformat.getDate()+1) + '/'+ completionDate_reformat.getFullYear();
        }
        for (var y = 0; y< this.state.projdata.length; y++){
          if (this.state.projdata[y].name == issuedata[k].project){
              projMatch= true
          }
        }
        if (projMatch == true) {

        newIssue.push({
          id: issuedata[k].surrogate_id, status: issuedata[k].status,
          type:issuedata[k].type,
          priority:issuedata[k].priority,
          severity: issuedata[k].severity,
          issueDate: issuedate_reformat,
          owner: issuedata[k].owner,
          expComDate: issuedata[k].expComDate,
          details: issuedata[k].details,
         completionDate: completionDate_reformat,
         project: issuedata[k].project
        });
    }

      }
      this.setState({issues: newIssue});
    }


errData = (err) => {
    console.log(err);
    }

formatType(cell) {
    return `${cell}`;
  }

handleClick = (rowKey) => {
  alert(this.refs.table.getPageByRowKey(rowKey));
}


render(){

return (

    <div id="issueUpdateBody">

    <div className="panel panel-primary">
        <div className="panel-heading clearfix">
    <h2 className="pull-left">Issue List</h2>
    <div className='pull-right'>
            <IssueUpdate />
    </div>
    </div>
    <div className='panel-body'>
      <BootstrapTable
        ref='table'
        data={ this.state.issues }
        exportCSV={ true }
        pagination={true}
        insertRow={false}
        search={true}
        strictSearch={ false }
        multiColumnSearch={ true }
        >

        <TableHeaderColumn dataField='id' isKey={true} width='100'>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='status'
            editable={ { type: 'select', options: { values: issueStatus },
            defaultValue: 'C' }}
            dataSort={true}
            >Status</TableHeaderColumn>
        <TableHeaderColumn dataField='type'
            editable={ { type: 'select', options: { values: issueType },
            defaultValue: 'A' }}
            dataSort={true}
            >Type</TableHeaderColumn>
        <TableHeaderColumn dataField='priority'
            editable={ { type: 'select', options: { values: issuePriority },
            defaultValue: 'A' }}
            dataSort={true}
            >Priority</TableHeaderColumn>
        <TableHeaderColumn dataField='severity'
            editable={ { type: 'select', options: { values: issueSeverity },
            defaultValue: 'A' }}
            dataSort={true}
            >Severity</TableHeaderColumn>
        <TableHeaderColumn dataField='owner' dataSort={true} tdStyle={ { whiteSpace: 'nowrap' } } width='150'>Owner</TableHeaderColumn>
        <TableHeaderColumn dataField='issueDate' dataSort={true}>IssueDate</TableHeaderColumn>
        <TableHeaderColumn dataField='expComDate' dataSort={true}>Expected Completed in Days</TableHeaderColumn>
        <TableHeaderColumn dataField='details' filter={ { type: 'TextFilter', style: issueFilterStyle} } tdStyle={ { whiteSpace: 'normal' } } width='250'>Details</TableHeaderColumn>
        <TableHeaderColumn dataField='completionDate' dataSort={true} >Actual Completion Date</TableHeaderColumn>
        <TableHeaderColumn dataField='project' filter={ { type: 'TextFilter', style: issueFilterStyle} } tdStyle={ { whiteSpace: 'nowrap' } } width='100'>Project</TableHeaderColumn>

      </BootstrapTable>
      </div>
   </div>
      </div>
    );

  }
}
export default IssueTrackerBody
