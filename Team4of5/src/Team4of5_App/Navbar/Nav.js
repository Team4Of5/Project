import React from 'react';
import { Navbar, NavItem, Nav, Jumbotron, Button, Input} from 'react-bootstrap';
import * as firebase from 'firebase';
import * as Config from '../../Team4of5_Service/Config.js';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    NavLink
} from 'react-router-dom';

class  NavbarHeaderC extends React.Component {
     constructor(props) {
     super(props);
     this.state = {
       user: []
     };
//   //this is connect to the firebase
    this.userRef = firebase.app().database().ref().child('users');
    }
//   //After the connect, what the state will do--gotdata
  componentDidMount() {
    this.userRef.on('value', this.gotData, this.errData);
    }
//   //get the data from the firebase and push them out
  gotData = (data) => {
      let newuser = []
      const userdata = data.val();
      const keys = Object.keys(userdata);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        newuser.push({
          role: userdata[k].role
        });
      }
      this.setState({user: newuser});
      alert(this.state.user)
    }
    errData = (err) => {
  console.log(err);
  }

render(){
  return (
      <Navbar inverse>
         <Navbar.Header>
           <Navbar.Brand>
                 <a>Team 4 of 5</a> 
                  {this.state.user}
            </Navbar.Brand>
         </Navbar.Header>
         <Navbar.Collapse>
        <Nav >
          <NavItem>
            <Button><NavLink activeStyle={{fontWeight: 'bold',color: 'black'}} activeClassName='active' to='/menu/Chat'>Chat</NavLink></Button>
          </NavItem>
          <NavItem>
            <Button><NavLink activeStyle={{fontWeight: 'bold',color: 'black'}} exact activeClassName='active' to='/menu/Settings'>Settings</NavLink></Button>
          </NavItem>
          <NavItem>
              <Button><NavLink activeStyle={{fontWeight: 'bold',color: 'black'}} activeClassName='active' to='/menu/BugTracking'>Bug Tracking</NavLink></Button>
          </NavItem>
          <NavItem>
            <Button><NavLink activeStyle={{fontWeight: 'bold', color: 'black'}} activeClassName='active' to='/menu/ProjectManagement'>Project Management</NavLink></Button>
          </NavItem>
          <NavItem>
            <Button><NavLink activeStyle={{fontWeight: 'bold',color: 'black'}} activeClassName='active' to='/menu'>Menu</NavLink></Button>
          </NavItem>
          <NavItem>
            <Button><NavLink activeStyle={{fontWeight: 'bold', color: 'black'}} activeClassName='active' to='/login'>LogOut</NavLink></Button>
          </NavItem>
        </Nav>
        </Navbar.Collapse>
     </Navbar>

 );
}
}

export default NavbarHeaderC;
