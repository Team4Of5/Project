import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '../../registerServiceWorker.js';

import Navbar from '../Navbar/Nav.js';
import Menu from '../Menu.js';
import * as Users from '../../Team4of5_Service/Users.js';
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';
import AdminSettings from './AdminSettings.js';

import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
// style
import './Settings.css';
//import react-bootstrap
import {
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Button
} from 'react-bootstrap';


function AdminPanal(props) {
    if (!props.show) {
        return null;
    }

    return (
        <AdminSettings />
    );
}

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            role: '',
            displayname: '',
            redirectToMenu: false,
            userInfo: [],
            formBtnTxt: 'Update Settings',
            isAdmin: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.userRef = firebase.database().ref().child('users');
    }

    componentDidMount() {

        var user = Users.getCurrentUser();
        var name,
            email,
            photoUrl,
            uid,
            emailVerified;

        if (user != null) {
            name = user.displayName;
            uid = user.uid;

            var thisUser = firebase.database().ref().child('users/' + uid);
            thisUser.on('value', this.gotData, this.errData);
        }

    }
    gotData = (data) => {
        let newUser = []
        const userdata = data.val();
        //const keys = Object.keys(userdata);

        newUser.push(userdata.role);
        newUser.push(userdata.display_name);
        this.setState({ userInfo: newUser });
        if(newUser[0] == 'Sysadmin') {
            this.setState({isAdmin: true});
        }
    }

    handleChange(name, event) {
        let items = this.state;
        items[name] = event.target.value;
        this.setState(items);
    }

    handlePasswordChange(event) {
        if (this.state.email != '') {
            Users.resetPwdWhenLoggedOn()
        }
    }

    handleSubmit(event) {
        if (this.state.displayname || this.state.role) {

            Users.updateSettings(this.state.displayname, this.state.role).then((User) => {
                //         //handle redirect
                this.setState({ redirectToMenu: false });
            })
        };

        this.state.displayname = '';
        this.state.role = '';

        event.preventDefault();

    }

    render() {

        const { from } = this.props.location.state || {
            from: {
                pathname: '/menu'
            }
        }
        const { redirectToMenu } = this.state

        if (redirectToMenu) {
            return (<Redirect to={from} />)
        }

        return (
            <div className='AlignerSeting'>
                <div className='setingPanel'>
                    <div className="panel panel-primary">
                        <div className="panel-heading clearfix">
                            <h1 className="panel-title pull-left">Settings</h1>
                            <div className="pull-right">
                                <p>Please enter any user information that you want to reset</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>

                        <div className="panel panel-info" id="restName">
                            <div className="panel-heading clearfix">
                                <h1 className="panel-title pull-left">
                                    Reset Display Name</h1>
                                <div className="pull-right">
                                    <p>Your current display name is
                                        &nbsp;<strong>{this.state.userInfo[1]}</strong>
                                    </p>
                                </div>
                            </div>
                            <div className="panel-body">
                                <FormGroup controlId="formControlsText">
                                    <ControlLabel>Display Name</ControlLabel>
                                    <FormControl type="text" value={this.state.displayname} onChange={this.handleChange.bind(this, 'displayname')} />
                                </FormGroup>
                                {/* <input type="text" value={this.state.displayname} onChange={this.handleChange.bind(this, 'displayname')} /> */}
                            </div>
                        </div>

                        <div className="panel panel-info" id="restRole">
                            <div className="panel-heading clearfix">
                                <h1 className="panel-title pull-left">
                                    Reset Role</h1>
                                <div className="pull-right">
                                    <p>Your current role is
                                    &nbsp;<strong>{this.state.userInfo[0]}</strong>
                                    </p>
                                </div>
                            </div>
                            <div className='panel-body'>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Role</ControlLabel>
                                    <FormControl componentClass="select" value={this.state.role} onChange={this.handleChange.bind(this, 'role')}>

                                        <option value=""></option>
                                        <option value="Customer">Customer</option>
                                        <option value="Project Contributor">Project Contributor</option>
                                    </FormControl>
                                </FormGroup>
                            </div>

                        </div>
                        <div className="panel panel-info" id="restRole">
                            <div className="panel-heading clearfix">
                                <h1 className="panel-title pull-left">
                                    Reset Password</h1>
                            </div>
                            <div className='panel-body'>

                                <a onClick={this.handlePasswordChange} href="javascript:void(0);">Reset Password</a>
                                <p>
                                    This will send a reset password email to your associated email
                                </p>

                            </div>
                        </div>
                        <button type="submit" id="setingBtn" className="btn btn-primary"> Update </button>
                        <Link to='/menu' className='btn btn-danger'>Cancel</Link>
                    </form>
                </div>
                <div className='setingPanel'>
                    <AdminPanal show={this.state.isAdmin} />
                </div>
            </div>
        );
    }
}

export default Settings
