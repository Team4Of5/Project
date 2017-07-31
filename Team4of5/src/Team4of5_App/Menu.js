import React from 'react';
import ReactDOM from 'react-dom';
import IssueTracker from './BugTracking/IssueTracker.js';
import IssueReports from './BugTracking/IssueReports.js';
import NewIssue from './BugTracking/NewIssue.js';
import IssueWiki from './BugTracking/IssueWiki.js';
import Chat from './Chat/Chat.js';
import ProjectManagement from './ProjectManagement/ProjectManagement.js';
import Settings from './Settings/Settings.js';
import AdminSettings from './Settings/AdminSettings.js';
import NavbarHeaderC from './Navbar/Nav.js';
import ProjectSummary from './ProjectManagement/ProjectSummary.js'

import './menu.css'

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter

} from 'react-router-dom';
import PropTypes from "prop-types";


const Home = () => (
  <div className="container">
        <h1>Project Summary</h1>
    <div>

    <ProjectSummary/>

    </div>
    </div>
)

class Menu extends React.Component {
    constructor(props) {
        super(props);
        // this.basePath = '/Menu/',
        //     this.state = {
        //         directDest: '',
        //         redirect: false
        //     };
        // this.props.hi
    }

    previousLocation = this.props.location

    componentWillUpdate(nextProps) {
        const { location } = this.props
        // set previousLocation if props.location is not modal
        if (
            nextProps.history.action !== 'POP' &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location
        }
    }
    render() {
        const { location } = this.props
        const isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location // not initial render
        )
        return (
          <div>

              <NavbarHeaderC />

            <div>
                <Switch location={isModal ? this.previousLocation : location}>
                    <Route exact path='/menu' component={Home} />
                    <Route path='/menu/IssueTracker' component={IssueTracker} />
                    <Route path='/menu/IssueReports' component={IssueReports} />
                    <Route path='/menu/NewIssue' component={NewIssue} />
                    <Route path='/menu/IssueWiki' component={IssueWiki} />
                    <Route path='/menu/Chat' component={Chat} />
                    <Route path='/menu/ProjectManagement' component={ProjectManagement} />
                    <Route path='/menu/Settings' component={Settings} />
                    <Route path='/menu/AdminSettings' component={AdminSettings} />
                </Switch>
            </div>
            </div>
        )
    }
}

export default Menu;
