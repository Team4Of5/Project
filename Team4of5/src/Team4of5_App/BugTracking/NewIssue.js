import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '../../registerServiceWorker.js';
import { Navbar, Jumbotron, Button, Input, Nav } from 'react-bootstrap';

//Connect Firebase
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';
import * as Issues from '../../Team4of5_Service/Issues.js';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

//import css
import './IssueTracker.css'

class NewIssue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            formBtnTxt: 'Update Settings',
            redirectToIssue: false,
            };
        this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       //connect with firebase
       this.issueRef = firebase.database().ref().child('issues');
    }

    handleChange(name, event) {
      let items = this.state;
      items[name] = event.target.value;
      this.setState(items);
    }

 handleSubmit(event) {
     if (this.state.issue_id || this.state.completionDate
         ||this.state.details||this.state.expComDate
         ||this.state.issueDate||this.state.owner
         ||this.state.project||this.state.issue_status) {
             Issues.addNewIssue(this.state.issue_id,
                  this.state.completionDate,this.state.details,
                  this.state.expComDate,this.state.issueDate,
                  this.state.owner,this.state.project,
                  this.state.issue_status)
                  .then((Issue)=>{
                      console.log(Issue);
                     this.setState({redirectToIssue: true});
                  })
         };
  event.preventDefault();
}

 render() {
     const { from } = this.props.location.state ||{ from: { pathname: '/menu/BugTracking' }}
     const { redirectToIssue } = this.state

     if (redirectToIssue) {
           return (
            <Redirect to={from}/>
           )
         }
    return (
      <form className='createIssue' onSubmit={this.handleSubmit}>
          <div className="title">
              <h1>Create New Issue</h1>
              <p>Please enter any issue information</p>
          </div>
          <div>
              <label>
                ID:
                <input type="text" value={this.state.id} placeholder='id' onChange={this.handleChange.bind(this, 'id')} />
              </label>
          </div>
        <div>
            <label>
              Status:
              <input type="text" value={this.state.status} placeholder='Enter Status' onChange={this.handleChange.bind(this, 'status')} />
            </label>
        </div>
        <div>
            <label>
              Owner:
              <input type="text" value={this.state.owner} placeholder='Who do you want to own this issue' onChange={this.handleChange.bind(this, 'owner')} />
            </label>
        </div>
        <div>
            <label>
              IssueDate:
              <input type="text" value={this.state.issueDate}  onChange={this.handleChange.bind(this, 'issueDate')} />
            </label>
        </div>
        <div>
            <label>
              Expected Completed in Days:
              <input type="text" value={this.state.expComDate} placeholder='how many days will be sovled' onChange={this.handleChange.bind(this, 'expComDate')} />
            </label>
        </div>
        <div>
            <label>
              Details:
              <input type="text" value={this.state.details} placeholder='Issue Details' onChange={this.handleChange.bind(this, 'details')} />
            </label>
        </div>
        <div>
            <label>
              Actual Completion Date:
              <input type="text" value={this.state.completionDate} placeholder='Completion Date' onChange={this.handleChange.bind(this, 'completionDate')} />
            </label>
        </div>
        <div>
            <label>
              Project:
              <input type="text" value={this.state.project} placeholder='Enter Project'  onChange={this.handleChange.bind(this, 'project')} />
            </label>
        </div>


        <input type="submit" id="submitBtn" value={this.state.formBtnTxt} />
      </form>
    );
  }

}
export default NewIssue;