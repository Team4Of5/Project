import React from 'react';
import { Navbar, NavItem, Nav, Jumbotron, Button, Input} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink
} from 'react-router-dom';
import IssueReports from './IssueReports.js';

class  IssueTrackerNav extends React.Component {
    constructor(props) {
        super(props);

     this.state = {
      redirectToMenu: false,
    };
  }

render(){

return (
      <div>
        <Nav bsStyle="tabs" >
            <LinkContainer  to='/menu/IssueTracker'>
                  <NavItem  eventKey={1}>Issue List</NavItem>
              </LinkContainer>


                <LinkContainer  to='/menu/IssueReports'>
                  <NavItem  eventKey={2}>Issue Reports</NavItem>
              </LinkContainer>

                  <LinkContainer  to='/menu/NewIssue'>
                  <NavItem  eventKey={4}>Report a New Issue</NavItem>
              </LinkContainer>
            <LinkContainer  to="/menu/IssueWiki">
                  <NavItem  eventKey={3}>Issue Wiki</NavItem>
            </LinkContainer>
        </Nav>

    </div>
 );

}
}

export default IssueTrackerNav;
