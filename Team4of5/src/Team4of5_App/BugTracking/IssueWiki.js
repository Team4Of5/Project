import React from 'react';
import IssueTrackerNav from './IssueTrackerNav.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import css
import './IssueTracker.css';

//wiki type table
const IssueTypeData=[
    {
        id:1,
        name: "Blocker",
        type: "Reserved for catastrophic failures - exceptions, crashes, corrupt data, etc.",
    },
    {
        id:2,
        name: "Critical",
        type: "These may refer to unhandled exceptions or to other serious bugs that only happen under certain specific conditions. ",
    },
    {
        id:3,
        name: "Major",
        type: "Usually reserved for perf issues. Anything that seriously hampers productivity but does not actually prevent work from being done. ",
    },
    {
        id:4,
        name: "Minor",
        type: "These are 'nuisance' bugs. A default setting not being applied, a read-only field showing as editable, a race condition in the UI, a misleading error message, etc.",
    },
    {
        id:5,
        name: "Trivial",
        type: "Cosmetic issues. Scroll bars appearing where they should not, window does not remember saved size/location, typos, last character of a label being cut off, that sort of thing. ",
    },
]
//wiki Priority tabel
const IssuePriorityData=[
    {
        id:1,
        name:"Immediate",
        type:  "All work stops except for this item, we release the fix as soon as it is tested.",
    },
    {
        id:2,
        name:"High",
        type: "The next release will not go out without this item resolved.",
    },
    {
        id:3,
        name:"Medium",
        type: "Really desired in this release, but if we run out of time we will push it.",
    },
    {
        id:4,
        name:"Low",
        type: "We really don't expect to get to this in this release, but if you run out of tasks, work on it.",
    },
    {
        id:5,
        name:"Fix if time",
        type: " Don't work on it now.",
    },
]
//wiki Severity table
const IssueSeverityData=[
    {
        id:1,
        name:"Critical",
        type:  "The issue causes a failure of the complete software system, subsystem or a program within the system.",
    },
    {
        id:2,
        name:"High",
        type: "The issue does not cause a failure, but causes the system to produce incorrect, incomplete, inconsistent results or impairs the system usability.",
    },
    {
        id:3,
        name:"Medium",
        type: "The issue does not cause a failure, does not impair usability, and does not interfere in the fluent work of the system and programs.",
    },
    {
        id:4,
        name:"Low",
        type: "The issue is an aesthetic, is an enhancement or is a result of non-conformance to a standard.",
    },
    {
        id:5,
        name:"None",
        type: "The issue is at the level of severity.",
    },
]
export default class IssueType extends React.Component {

  render() {
    return (
        <div>
            <IssueTrackerNav/>

        <div id="issueUpdateBody">


        <div className="panel panel-primary">

            <div className="panel-heading clearfix">
            <h2 className="pull-left">Issue WiKi</h2>
    </div>
    <div className='panel-body'>
<div className="AlignerWiki">

        <div className='IssueType'>
      <BootstrapTable
      data={ IssueTypeData}
      exportCSV = {false}
      striped={ true }
      hover={ true }

      >
        <TableHeaderColumn isKey={true} dataField='id' hidden={true}>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' width='150px'>Issue Type</TableHeaderColumn>
        <TableHeaderColumn dataField='type' tdStyle={ { whiteSpace: 'normal' } }>Details</TableHeaderColumn>

      </BootstrapTable>
      </div>
<div className='IssuePriority'>
    <BootstrapTable
    data={ IssuePriorityData}
    exportCSV = {false}
    striped={ true }
    hover={ true }
    >
      <TableHeaderColumn isKey={true} dataField='id' hidden={true}>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='name' width='150px' >Issue Priority</TableHeaderColumn>
      <TableHeaderColumn dataField='type' tdStyle={ { whiteSpace: 'normal' } }>Details</TableHeaderColumn>

    </BootstrapTable>
</div>
<div className='IssueSeverity'>
    <BootstrapTable
    data={ IssueSeverityData}
    exportCSV = {false}
    striped={ true }
    hover={ true }

    >
      <TableHeaderColumn isKey={true} dataField='id' hidden={true}>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='name' width='150px'>Issue Severity</TableHeaderColumn>
      <TableHeaderColumn dataField='type' tdStyle={ { whiteSpace: 'normal' } }>Details</TableHeaderColumn>

    </BootstrapTable>
    </div>
</div>
</div>
      </div>
          </div>
          </div>

    );
  }
}
