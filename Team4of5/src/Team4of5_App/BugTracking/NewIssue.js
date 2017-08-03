import React, {Component} from 'react';
import registerServiceWorker from '../../registerServiceWorker.js';
import Navbar from '../Navbar/Nav.js';
import IssueTrackerNav from './IssueTrackerNav.js';
import IssueTracker from './IssueTracker.js';
import Menu from '../Menu.js';
import * as Users from '../../Team4of5_Service/Users.js';


//Connect Firebase
import * as Config from '../../Team4of5_Service/Config.js';
import * as Issues from '../../Team4of5_Service/Issues.js';

import {BrowserRouter as Router, Route, Link, Redirect, withRouter} from 'react-router-dom';

import fetch from 'isomorphic-fetch';
//reference: https://github.com/JedWatson/react-select
import Select from 'react-select';

//import css
import './IssueTracker.css';
//import react-bootstrap
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Button,
    Col
} from 'react-bootstrap';

class NewIssue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curUserCompany: '',
            value: [],
            project:[],
            formBtnTxt: 'Add Issue',
            redirectToIssue: false,

        };
    //binding the states
        this.handleChange = this.handleChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOwnerChange = this.handleOwnerChange.bind(this);
        this.handleProjectChange = this.handleProjectChange.bind(this);
        this.getProjectID = this.getProjectID.bind(this);

    }
//connect the database
    componentDidMount() {
        //
        let self = this;
        Users.getCurUserCompany().then(function (company) {
            self.setState({ curUserCompany: company.val() })
            console.log(self.state.curUserCompany)
        }).catch(function (err) {
            console.log("Error:" + err)
        })
    }

    handleChange(name, event) {
        let items = this.state;
        items[name] = event.target.value;
        this.setState(items);
    }
    // for user email auto completion
    handleOwnerChange(value) {
        console.log("change happening")
        console.log(value)
        this.setState({
            value: value,
        });
    }
    //for project auto completion
    handleProjectChange(project) {
        console.log("change happening")
        console.log(project)
        this.setState({
            project: project,
        });
    }
    //handle data back to firebase
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.details && this.state.expComDate && this.state.value.owner && this.state.project.project && this.state.status && this.state.type && this.state.priority && this.state.severity) {
            if (!this.state.completionDate) {
                this.state.completionDate = 'null'
            }

            Issues.addNewIssue(this.state.completionDate, this.state.details, this.state.expComDate, this.state.value.owner, this.state.project.project, this.state.status, this.state.type, this.state.priority, this.state.severity)
            {
                console.log('Issue!');
                this.setState({redirectToIssue: true});
            }
        } else {
            alert("Please fill all fields except the completion date");
        }
        this.state.completionDate = '';
        this.state.details = '';
        this.state.expComDate = '';
        this.state.value = [];
        //this.state.project = '';
        this.state.status = '';
        this.state.type = '';
        this.state.priority = '';
        this.state.severity = '';

    }
    getUsers(input) {

        let self = this;

        if (!input) {
            console.log('here');
            return Promise.resolve({ options: [] });
        }

        let contactEmails = []
        return fetch('https://team4of5-8d52e.firebaseio.com/users.json?&orderBy=%22email%22&startAt=%22'
            + input + '%22&endAt=%22' + input + '\uf8ff%22')

            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                for (let key in json) {
                    //console.log(self.state.curUserCompany) self.state.curUserCompany
                    if (json[key].company == self.state.curUserCompany) {
                        contactEmails.push({ owner: json[key].email, label: json[key].email })
                    }
                }
                self.setState({ options: contactEmails })
                return {
                    options: contactEmails,
                    complete: true
                };
            });
    }
    getProjectID(input) {
        let self = this;

        if (!input) {
            console.log('Project')
            return Promise.resolve({ options: [] });
        }
//https://team4of5-8d52e.firebaseio.com/issues.json?orderBy=%22project%22&startAt=%22A%22&endAt=%22A%5Cuf8ff%22
        let projectID = []
        return fetch('https://team4of5-8d52e.firebaseio.com/chatProject.json?orderBy=%22name%22&startAt=%22'
            + input + '%22&endAt=%22' + input + '\uf8ff%22')

            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                for (let key in json) {
                    //console.log(self.state.curUserCompany) self.state.curUserCompany
                    projectID.push({ project: json[key].name, label: json[key].name })

                }
                self.setState({ options: projectID })
                return {
                    options: projectID,
                    complete: true
                };
            });
    }

    render() {
        const AsyncComponent = Select.Async

        const {from} = this.props.location.state || {
            from: {
                pathname: '/menu/IssueTracker'
            }
        }
        const {redirectToIssue} = this.state

        if (redirectToIssue) {
            return (<Redirect to={from}/>)
        }
        return (
            <div>
                <IssueTrackerNav/>
                <div className="AlignerNew">

                    <div className='createIssue1'>

                        <div className="panel panel-primary">
                            <div className="panel-heading clearfix">
                                <h1 className="pull-left">Report a New Issue</h1>
                            </div>
                            <div className='panel-body'>
                                <h3 >Please enter issue information</h3>

                        <Form onSubmit={this.handleSubmit}>

                            <FormGroup controlId="formControlsText">
                                <ControlLabel>Owner</ControlLabel>
                                {/* <FormControl type="text" placeholder="Enter Owner email"
                                    value={this.state.owner}
                                    onChange={this.handleChange.bind(this, 'owner')}

                                /> */}
                                <AsyncComponent
                                    multi={false}
                                    value={this.state.value}
                                    onChange={this.handleOwnerChange}
                                    //onValueClick={this.gotoUser}
                                    //Options={this.state.options}
                                    valueKey="value"
                                    labelKey="label"
                                    ignoreCase={false}
                                    loadOptions={this.getUsers}
                                    backspaceRemoves={true} />
                            </FormGroup>
                            <FormGroup controlId="formControlsText">

                                <ControlLabel>Expected completion days</ControlLabel>

                                <FormControl type="text" value={this.state.expComDate} placeholder='Estimated days to solve issue' onChange={this.handleChange.bind(this, 'expComDate')}/>

                            </FormGroup>
                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Details</ControlLabel>

                                <FormControl componentClass="textarea" value={this.state.details} placeholder='Issue details' onChange={this.handleChange.bind(this, 'details')}/>

                            </FormGroup>
                            <FormGroup controlId="formControlsText">

                                <ControlLabel>Project</ControlLabel>

                                {/* <FormControl type="text" value={this.state.project} placeholder='Enter project ID associated with this issue' onChange={this.handleChange.bind(this, 'project')}/> */}
                                <AsyncComponent
                                    multi={false}
                                    value={this.state.project}
                                    onChange={this.handleProjectChange}
                                    //onValueClick={this.gotoUser}
                                    //Options={this.state.options}
                                    valueKey="value"
                                    labelKey="label"
                                    ignoreCase={false}
                                    loadOptions={this.getProjectID}
                                    backspaceRemoves={true} />
                            </FormGroup>

                            <FormGroup controlId="formControlsSelect">

                                <ControlLabel>Status</ControlLabel>

                                <FormControl componentClass="select" value={this.state.status} onChange={this.handleChange.bind(this, 'status')}>

                                    <option value=""></option>
                                    <option value="New">New</option>
                                    <option value="Open">Open</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Closed">Closed</option>
                                </FormControl>

                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Type</ControlLabel>
                                <FormControl componentClass="select" value={this.state.type} onChange={this.handleChange.bind(this, 'type')}>

                                    <option value=""></option>
                                    <option value="Blocker">Blocker</option>
                                    <option value="Critical">Critical</option>
                                    <option value="Major">Major</option>
                                    <option value="Minor">Minor</option>
                                    <option value="Trivial">Trivial</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Priority</ControlLabel>
                                <FormControl componentClass="select" value={this.state.priority} onChange={this.handleChange.bind(this, 'priority')}>

                                    <option value=""></option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Fix if time">Fix if time</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Severity</ControlLabel>
                                <FormControl componentClass="select" value={this.state.severity} onChange={this.handleChange.bind(this, 'severity')}>

                                    <option value=""></option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="None">None</option>
                                </FormControl>
                            </FormGroup>

                            <FormGroup controlId="formControlsText">

                                <ControlLabel>Actual completion date</ControlLabel>

                                <FormControl type="date" value={this.state.completionDate} onChange={this.handleChange.bind(this, 'completionDate')}/>

                            </FormGroup>

                            <button type="submit" id="newIssueBtn" className="btn btn-primary">
                                Submit
                            </button>
                            <Link to='/menu/IssueTracker' className='btn btn-danger'>Cancel</Link>

                        </Form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default NewIssue;
