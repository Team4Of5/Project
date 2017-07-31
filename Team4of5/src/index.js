/**
 * Kyle, this is the starting point of the the program
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Navbar, Jumbotron, Button, Input, Nav } from 'react-bootstrap';
import * as Users from './Team4of5_Service/Users.js';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';
import RouteMap from './Team4of5_App/RouteMap.js';
import Menu from './Team4of5_App/Menu.js';
import UserLoginSignup from './Team4of5_App/UserLoginSignup/UserLoginSignup.js'

ReactDOM.render(

 <Router>
    <div>

      <Route path="/login" component={UserLoginSignup}/>
      <Route path="/menu" component={Menu}/>
      <Redirect to="/login"/>

    </div>
  </Router>,


  document.getElementById('root')
);
