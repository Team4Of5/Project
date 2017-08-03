import React from 'react';

import { Navbar, NavItem, Nav,  NavDropdown, MenuItem } from 'react-bootstrap';
import './Nav.css';
import { LinkContainer } from 'react-router-bootstrap';

//load the firebase
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';
import * as userService from '../../Team4of5_Service/Users.js';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
  NavLink
} from 'react-router-dom';

class NavbarHeaderC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: '',
      displayname: '',
      redirectToMenu: false,
      userInfo: [],
    };
    this.userRef = firebase.database().ref().child('users');
  }
  componentDidMount() {

    var user = userService.getCurrentUser();
    var name, email, photoUrl, uid, emailVerified;

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
    userService.getCurrentUser().updateProfile({
      displayName: userdata.display_name
    }).then(function () {
      // Update successful.
    }, function (error) {
      // An error happened.
    });
    //const keys = Object.keys(userdata);

    newUser.push(userdata.role);
    newUser.push(userdata.display_name);
    newUser.push(userdata.company);
    this.setState({ userInfo: newUser });
  }
  render() {


    return (

      <Navbar collapseOnSelect className="navbar navbar-default">
        <Navbar.Header>
          <Navbar.Brand >
            <Link to='/menu'>Team 4 of 5</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>

        <LinkContainer  to='/menu/Chat'>
              <NavItem  eventKey={1}>Chat</NavItem>
          </LinkContainer>


            <LinkContainer  to='/menu/ProjectManagement'>
              <NavItem  eventKey={2}>Project Management</NavItem>
          </LinkContainer>

            <LinkContainer  to="/menu/IssueTracker">
                  <NavItem  eventKey={3}>Issue Tracker</NavItem>
            </LinkContainer>


              <LinkContainer  to='/menu/Settings'>
              <NavItem  eventKey={4}>Settings</NavItem>
          </LinkContainer>


        </Nav>
         <Nav pullRight>
             <NavDropdown title="More" id="basic-dropdown" eventKey={5}>

              <LinkContainer to='/menu'>
              <MenuItem  eventKey={5.1}>Menu</MenuItem>
          </LinkContainer>


              <LinkContainer  to='/login'>
              <MenuItem  eventKey={5.2} onClick={()=>{
                userService.logoutUser();
              }}>Logout</MenuItem>
          </LinkContainer>

            </NavDropdown>
            <MenuItem>Welcome, {this.state.userInfo[1]}</MenuItem>
            <MenuItem>Company {this.state.userInfo[2]}</MenuItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    );
  }
}

export default NavbarHeaderC;
