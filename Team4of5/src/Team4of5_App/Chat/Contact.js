import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {
    Grid, Row, Col, Thumbnail, Button, MenuItem,
    DropdownButton, ButtonToolbar, Media, Image, FormGroup, FormControl
} from 'react-bootstrap';
import TiGroup from 'react-icons/lib/ti/group'
import * as actions from '../App_Redux/ActionCreator'
import { bindActionCreators } from 'redux';
import createStore from '../App_Redux/CreateStores'

import FaCircle from 'react-icons/lib/fa/circle'
import FaCircleThin from 'react-icons/lib/fa/circle-thin'

import InfiniteScroll from 'react-infinite-scroll-component';
import FaChild from 'react-icons/lib/fa/child';
import * as ChatService from '../../Team4of5_Service/Chat.js';

//Reference: https://github.com/ankeetmaini/react-infinite-scroll-component

const style = {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    flexFlow: 'row wrap',
    fontFamily:'sans-serif',
    justifyContent:'space-around',
};

const title = 'Recent';
const colors = ['#ffffff'];

const ScrollStyle = {
    height: 530,
    overflowY: true
};


// .HistoryScroll {
//   width: 700px;
//   height: 615px;
//   overflow-y: scroll;
//   position: relative;
// }

class Contact extends React.Component {
    constructor() {
        super();

        this.generateDivs = this.generateProject.bind(this);
        this.switchToChat = this.switchToChat.bind(this);
        this.generateContact = this.generateContact.bind(this);
        this.getData = this.getData.bind(this);

        let projectData = [];
        let contactData = [];
        let countProject = 0;
        let countContact = 0;

        this.state = {
            projectData: projectData,
            contactData: contactData,
            hasMoreI: true,
            hasMoreP: true
        };
        //this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        //
        let self = this;
        ChatService.getUserContacts().then(function (data) {
            self.getData(data);
        }).catch(function (err) {
            console.log("Error:" + err)
        })
    }

    switchToChat(contactUid, data) {
        this.props.SwitchAction({ GotoContent: "GotoChatRoom", ContactUid: contactUid, ContactData: data })
    }

    getData(data) {
        let self = this;
        let moreDivs = [];
        let moreProject = [];
        let temp = [];
        for (let index in data) {
            if (index == 'status') continue;
            let element = data[index];
            console.log(index);
            //console.log(element);



            ChatService.listenOnOffline(index).on('value', function (snapshot) {



                let content = null;
                if (element.type == 'Individual') {
                    content = snapshot.val() == true ? <FaCircle size={20} style={{ marginBottom: -10 }}/> 
                        : <FaCircleThin size={20} style={{ marginBottom: -10 }}/>
                    //<h5>(online)</h5> : <h5>(offline)</h5>
                } else {
                    content = <FaChild size={30} />
                }

                for (let i = 0; i < self.state.contactData.length; i++) {
                    console.log("here!!")
                    console.log(i)
                    console.log(self.state.contactData.length)
                    if (self.state.contactData[i].key == index) {
                        self.state.contactData.splice(i, 1);
                        console.log("get away")
                        console.log(self.state.contactData.length)
                        break;
                    }
                }

                let data = (

                    <div className="panel panel-body" key={index} style={{ height: 50, marginBottom: 5, marginLeft:5, background: '#00ffffff', ...style }}>
                        <Row onClick={self.switchToChat.bind(self, index, element)} style={{ marginLeft: 0 }}>
                            <Media.Left >
                                {content}
                            </Media.Left>
                            <Media.Body>
                                <h5> {element.name}</h5>
                            </Media.Body>
                        </Row>
                    </div>

                )


                if (element.type == 'Individual') {
                    let oriData = self.state.contactData;
                    oriData.unshift(data)
                    self.setState({
                        contactData: oriData,
                        hasMoreI: false,
                        hasMoreP: false
                    });
                } else {
                    //temp = moreProject
                    self.setState({
                        projectData: self.state.projectData.concat(data),
                        hasMoreI: false,
                        hasMoreP: false
                    });
                }

            });


        }
        //setTimeout(() => {

        //}, 500);
    }

    //  refresh () {
    //   this.generateDivs();
    // }

    generateProject() {
        let moreDivs = [];
        let count = this.state.projectData.length;
        for (let i = 0; i < 30; i++) {
            moreDivs.push(
                //onClick={this.switchToChat.bind(this, count, "Project" + count)}
                <div key={'div' + count++} style={{ height: 50, marginTop: 10, marginLeft:5, background: '#00ffffff', ...style }}>
                    <h5 >User{count} Last Msg</h5>
                    <span id="hisDateSpan">  June 17 2017</span>
                </div>
            );
        }
        setTimeout(() => {
            this.setState({ projectData: this.state.projectData.concat(moreDivs) });
        }, 500);
    }

    generateContact() {
        let moreDivs = [];
        let count = this.state.contactData.length;
        for (let i = 0; i < 10; i++) {
            moreDivs.push(
                //         <div key={'div' + count++} style={{ height: 50, marginTop: 10, background: '#00ffffff', ...style }}>
                //             <h4 onClick={this.switchToChat.bind(this, count)}>User{count} Last Msg

                //   </h4>
                //             <span id="hisDateSpan">  June 17 2017</span>
                //         </div>
                //onClick={this.switchToChat.bind(this, count, "Name" + count)}

                <div key={'div' + count++} style={{ height: 50, marginBottom: 20, background: '#00ffffff', ...style }}>
                    <Row style={{ marginLeft: 0 }}>
                        <Media.Left>
                            <FaChild size={30} />
                        </Media.Left>
                        <Media.Body>
                            <h4>Name{count}</h4>
                        </Media.Body>
                    </Row>
                </div>

            );
        }
        setTimeout(() => {
            this.setState({ contactData: this.state.contactData.concat(moreDivs) });
        }, 500);
    }

    render() {
        return (
            <div className="panel panel-info">
                    <div className="panel-heading clearfix">
                <h1 className="panel-title">Contact</h1>
                </div>
                <Grid>

                    <Row id='funcsRow'>

                        <Col xs={3} >

                            <div className="panel panel-primary">
                                <div className="panel-heading clearfix">
                            <h1 className="panel-title">Project</h1>
                            </div>
                            <div className='panel-body'>
                            <div type={ScrollStyle}>
                                <InfiniteScroll
                                    /*pullDownToRefresh
                                    pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
                                    releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
                                    refreshFunction={this.refresh}*/
                                    //next={this.generateProject.bind(this)}
                                    hasMore={this.state.hasMoreP}
                                    height={530}
                                    //loader={<h4>Loading...</h4>}
                                    >
                                    {this.state.projectData}
                                </InfiniteScroll>
                            </div>
                            </div>
                            </div>

                        </Col>


                        <Col xs={3}  xsOffset={1}>
                            <div className="panel panel-primary">

                                    <div className="panel-heading clearfix">
                                <h1 className="panel-title">Individual</h1>
                                </div>
                                <div className='panel-body'>

                            <div type={ScrollStyle}>
                                <InfiniteScroll
                                    /*pullDownToRefresh
                                    pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
                                    releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
                                    refreshFunction={this.refresh}*/
                                    //next={this.generateContact.bind(this)}
                                    hasMore={this.state.hasMoreI}
                                    height={530}
                                    //loader={<h4>Loading...</h4>}
                                    >
                                    {this.state.contactData}
                                </InfiniteScroll>
                            </div>
                                </div>
                        </div>
                        </Col>

                    </Row>
                </Grid>


            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return { SwitchAction: bindActionCreators(actions.switchContent, dispatch) };
};

export default connect(null, mapDispatchToProps)(Contact);
