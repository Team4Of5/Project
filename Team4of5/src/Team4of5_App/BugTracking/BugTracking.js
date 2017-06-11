import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../Navbar/Nav.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import BugTypeTable from './BugTypes.js';
import BugNotification from './BugNotification.js';

class BugTracking extends React.Component {
  constructor(props){
		super(props);
  }


  render() {

    return (
      <div>
        <div>
            <BugNotification />
        </div>

        <div>
            <BugTypeTable />
        </div>

      </div>

    );
  }
}

export default BugTracking;
