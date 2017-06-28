import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Navbar, Jumbotron, Button, Input, Nav } from 'react-bootstrap';
import database from './database'
import * as Bugs from '../../Team4of5_Service/Bugs.js'


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

//th
function dateFormatter(cell, row) {
  cell = new Date();
  return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
}


const cellEditProp = {
  mode: 'click',
  blurToSave: true
};


class IssueTrackerBody extends React.Component{
  constructor(props) {
  super(props);

  this.state = {
    issues:[],
    bug_id: ''
  };

    //connect to database
    this.issueRef = database.ref().child('issues');
    //Click the save button; then the data will save to firebase
    this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
}
//After the connect, what the state will do--gotdata
componentDidMount() {
  this.issueRef.on('value', this.gotData, this.errData, this.saveData);
}

//get the data from the firebase and push them out
  gotData = (data) => {
      let newIssue = []
      const issuedata = data.val();
      const keys = Object.keys(issuedata);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        newIssue.push({
          id: issuedata[k].id, status: issuedata[k].status,
          issueDate: issuedata[k].issueDate,
          owner: issuedata[k].owner, expComDate: issuedata[k].expComDate,
          details: issuedata[k].details,
         completionDate: issuedata[k].completionDate,
         project: issuedata[k].project
        });
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


/** +New insertRow Header*/
createCustomModalHeader(onClose, onSave) {

  const headerStyle = {
       fontWeight: 'bold',
       fontSize: 'large',
       textAlign: 'center',
     };
return (
       <div className='modal-header' style={ headerStyle }>
         <h3>Report New Issue</h3>
       </div>
     );
   }

/** +New insertRow Footer*/
handleModalClose(onClose) {
    // Custom your onCloseModal event here,
    // it's not necessary to implement this function if you have no any process before modal close
    console.log('Close without saving the data');
    onClose();
  }
//I try to connect database and write It back
  handleSaveBtnClick(){
    this.state.bug_id = 99;
    Bugs.addNewBug(this.state.bug_id, 'a','b','c','d','e','f','g');
};


  createCustomModalFooter = (onClose, onSave) => {
    return (
        <div className='modal-footer' >
          <button className='btn btn-xs btn-info' onClick={ onClose }>Close</button>
          <button className='btn btn-xs btn-danger' onClick={this.handleSaveBtnClick}>Report</button>
        </div>
    );

  }


  render(){

   const options = {
         insertModalHeader: this.createCustomModalHeader,
         insertModalFooter: this.createCustomModalFooter,
        //  afterInsertRow: this.onAfterInsertRow
       };


return (
      <BootstrapTable
        ref='table'
        data={ this.state.issues }
        cellEdit={ cellEditProp }
        exportCSV={ true }
        options={ options }
        pagination={true}
        insertRow
        search={true}>

        <TableHeaderColumn dataField='id' isKey={true} width='50'>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='status'  editable={ { type: 'select', options: { values: issueStatus }, defaultValue: 'C' }}>Status</TableHeaderColumn>
        <TableHeaderColumn dataField='owner' tdStyle={ { whiteSpace: 'nowrap' } }>Owner</TableHeaderColumn>
        <TableHeaderColumn dataField='issueDate' dataFormat={ dateFormatter }>IssueDate</TableHeaderColumn>
        <TableHeaderColumn dataField='expComDate' >Expected Completed in Days</TableHeaderColumn>
        <TableHeaderColumn dataField='details' editable={ { type: 'textarea', defaultValue: 'Please write something'} } tdStyle={ { whiteSpace: 'normal' } } width='250'>Details</TableHeaderColumn>
        <TableHeaderColumn dataField='completionDate' editable={ { type: 'datetime' }} dataFormat={ dateFormatter }>Actual Completion Date</TableHeaderColumn>
        <TableHeaderColumn dataField='project' tdStyle={ { whiteSpace: 'nowrap' } }>Project</TableHeaderColumn>

      </BootstrapTable>
    );

  }
}
export default IssueTrackerBody
