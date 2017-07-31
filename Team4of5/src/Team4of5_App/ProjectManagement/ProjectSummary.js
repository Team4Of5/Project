import React from 'react';
import ReactDOM from 'react-dom';
import * as ChatProj from '../../Team4of5_Service/ChatProject.js';
import * as Users from '../../Team4of5_Service/Users.js';
import CreateProject from '../Chat/CreateProject';
import ChartistGraph from 'react-chartist';
import './chartist.css';
import './chart.css';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter
} from 'react-router-dom';

class ProjectSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projdata: [],
            thisUser: '',
            projectList: []
        };

        this.getData = this.getData.bind(this);
    }
    componentDidMount() {

        let self = this;
        this.state.thisUser = Users.getCurrentUser().uid;

        ChatProj.getProjects().then(function (data) {

            self.getData(data);

        },
            function (err) {
                //Error occur
                console.log("Promise Error");
                console.log(err);
            }
        );

    }

    getData(data) {
        const projdata = data.val();
        var projArray = []
        const keys = Object.keys(projdata);
        var listProjArray = []
        projArray.push({ name: 'Project Name', id: '0' })
        for (var i = 0; i < keys.length; i++) {
            var members = []
            var projname = ''
            var user_in_proj = false
            const k = keys[i];

            projname = projdata[k].name

            for (var x = 0; x < projdata[k].members.length; x++) {
                if (projdata[k].members[x] == this.state.thisUser) {
                    user_in_proj = true
                }
            }

            if (user_in_proj == true) {
                projArray.push({ name: projname, id: k });
                projdata[k].key = k;
                listProjArray.push(projdata[k]);
            }

        }
        this.setState({ projdata: projArray });
        this.setState({ projectList: listProjArray });
        console.log("outside");
        console.log(this.state.projectList);
        //this.displayedCards(this.state.projectList[0])


    }


    render() {

        function data(item) {
            var labels = ['Backlog', 'Next', 'In Progress', 'Staged', 'QA', 'Live'];
            var series = [];
            if (item.data != undefined) {
                for (var i = 0; i < item.data.lanes.length; i++) {
                    if (item.data.lanes[i].cards != undefined) {
                        series.push(item.data.lanes[i].cards.length);
                    }
                    else {
                        series.push(0);
                    }
                }
            }
            //var series =  [item.data.lanes[0].cards.length, item.data.lanes[1].cards.length, item.data.lanes[2].cards.length, item.data.lanes[3].cards.length, item.data.lanes[4].cards.length, item.data.lanes[5].cards.length];
            var data = {};
            data.labels = labels;
            data.series = series;
            return data;
        };
        var type = 'Pie';
        var style = {
            height:300,
            width: 300
        }
        return (

            <div>
                <ul className="projectList">
                    {this.state.projectList.map(item => <li className="projects" onClick={() => { /*this.displayedCards(item);*/ console.log(item); console.log("MY ITEMS") }}>
                        <Link to={{
                            pathname: '/menu/ProjectManagement',
                            state: { startingProject: item }
                        }}>
                            {item.name}
                            {console.log("info")}
                            {console.log(item)}
                        </Link>
                    </li>)}
                </ul>
                <div className="mydummyname">
                    {this.state.projectList.map(item => <div className="chartImage panel panel-primary" >
                        <div className="panel-heading clearfix">
                            <h1 className='panel-title pull-left'>
                                {item.name}
                            </h1>
                        </div>
                        <div className='panel-body'>
                            <ChartistGraph
                                data={data(item)}
                                type={'Pie'}
                                style={style}
                            />
                        </div>
                    </div>)}
                </div>
                <div className="createProjectContainer">
                    <CreateProject />
                </div>

            </div>


        );
    }
}

export default ProjectSummary;
