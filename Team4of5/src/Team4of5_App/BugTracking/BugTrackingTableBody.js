import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import BugTrackTableSearch from './BugTrackingToolBar.js';
import { Navbar, Jumbotron, Button, Input, Nav } from 'react-bootstrap';

//import database from './database'
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';
import * as Issues from '../../Team4of5_Service/Issues.js';

const bugData = []
const bugDataTypes = [ {
  value: 'A',
  text: 'A'
}, {
  value: 'B',
  text: 'B'
}, {
  value: 'C',
  text: 'C'
}];

const bugDataStatus =[{
  value: 'A',
  text: 'Completed'
}, {
  value: 'B',
  text: 'In progress'
}, {
  value: 'C',
  text: 'Unread'
}, {
  value: 'D',
  text: 'Unassigned'
}]

function dateFormatter(cell, row) {
  cell = new Date();
  return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
}

// function addBugs(quantity) {
//   const startId = bugData.length;
//   for (let i = 0; i < quantity; i++) {
//     const id = startId + i;
//     bugData.push({
//       id: id,
//       Type: 'A',
//       Reporter: 'Tom',
//       Assignee: 'Bill',
//       IssueDate: '',
//       Details: 'Bugs!! Run! Tick is comming',
//       Status: 'unread',
//       ExpComDate: '200' + i + '-12-28T14:57:00',
//       ActComDate: '200' + i + '-12-28T14:57:00'
//     });
//   }
// }
//
// addBugs(5);

const cellEditProp = {
  mode: 'click',
  blurToSave: true
};

class BugTrackingTableBody extends React.Component{
  constructor(props) {
  super(props);

  this.state = {
    bugs:[]
  };

    //connect to database
    this.bugRef = firebase.database().ref().child('bugs');
}
//After the connect, what the state will do--gotdata
componentDidMount() {
  this.bugRef.on('value', this.gotData, this.errData);
}
//get the data from the firebase and push them out
  gotData = (data) => {
      let newBug = []
      const bugdata = data.val();
      const keys = Object.keys(bugdata);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        newBug.push({
          id: bugdata[k].id, Type: bugdata[k].Type, Status: bugdata[k].Status,
          Role: bugdata[k].Role, IssueDate: bugdata[k].IssueDate,
          Reporter: bugdata[k].Reporter, ExpComDate: bugdata[k].ExpComDate, Details: bugdata[k].Details,
          Assignee: bugdata[k].Assignee, ActComDate: bugdata[k].ActComDate
        });
      }
      this.setState({bugs: newBug});
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
/**new header*/
createCustomModalHeader(onClose, onSave) {
  const headerStyle = {
       fontWeight: 'bold',
       fontSize: 'large',
       textAlign: 'center',
     };
     return (
       <div className='modal-header' style={ headerStyle }>
         <h3>Report New Bug</h3>
         <button className='btn btn-info' onClick={ onClose }>Report</button>
       </div>
     );
   }




  render(){
    const selectRowProp = {
     mode: 'checkbox'
   };
   const options = {
         insertModalHeader: this.createCustomModalHeader
       };

return (
      <BootstrapTable
        ref='table'
        data={ this.state.bugs }
        cellEdit={ cellEditProp }
        selectRow={ selectRowProp }
        exportCSV={ true }
        options={ options }
        pagination
        insertRow
        search>

        <TableHeaderColumn dataField='id' isKey={true} width='50'>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='Type' width='50' dataFormat={ this.formatType } editable={ { type: 'select', options: { values: bugDataTypes }, defaultValue: 'C' } }>Type</TableHeaderColumn>
        <TableHeaderColumn dataField='Reporter' tdStyle={ { whiteSpace: 'nowrap' } }>Reporter</TableHeaderColumn>
        <TableHeaderColumn dataField='Assignee'>Assignee</TableHeaderColumn>
        <TableHeaderColumn dataField='IssueDate' dataFormat={ dateFormatter }>IssueDate</TableHeaderColumn>
        <TableHeaderColumn dataField='Details' editable={ { type: 'textarea', defaultValue: 'Please write something'} } tdStyle={ { whiteSpace: 'normal' } } width='250'>Details</TableHeaderColumn>
        <TableHeaderColumn dataField='Status' dataFormat={ this.formatType } editable={ { type: 'select', options: { values: bugDataStatus }, defaultValue: 'C' }}>Status</TableHeaderColumn>
        <TableHeaderColumn dataField='ExpComDate' editable={ { type: 'datetime' }} dataFormat={ dateFormatter }>Expected Completion Date</TableHeaderColumn>
        <TableHeaderColumn dataField='ActComDate' editable={ { type: 'datetime' }} dataFormat={ dateFormatter }>Actual Completion Date</TableHeaderColumn>
      </BootstrapTable>
    );

  }
}
export default BugTrackingTableBody
