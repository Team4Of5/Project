import React from 'react';
import ReactDOM from 'react-dom';
import {
    Grid, Row, Col, Thumbnail, Button, ButtonGroup, MenuItem,
    DropdownButton, ButtonToolbar, Media, Image
} from 'react-bootstrap';
import './MenuFuncs.css'
//Reference: https://gorangajic.github.io/react-icons/fa.html
import TiContactsIcon from 'react-icons/lib/ti/contacts'
import TiUserIcon from 'react-icons/lib/ti/user'
import TiUserAddIcon from 'react-icons/lib/ti/user-add'
import AddProjectIcon from 'react-icons/lib/fa/file-code-o'
import FaHistoryIcon from 'react-icons/lib/fa/history'

import * as actionCreators from '../App_Redux/ActionCreator'
import ContentSwitcher from './ContentSwitcher'

//reference: https://github.com/JedWatson/react-select
import Select from 'react-select';

import { connect } from 'react-redux'
import * as actions from '../App_Redux/ActionCreator'
import { bindActionCreators } from 'redux';
import createStore from '../App_Redux/CreateStores'
import PropTypes from 'prop-types';
import * as User from '../../Team4of5_Service/Users.js';
import * as ChatService from '../../Team4of5_Service/Chat.js';

const store = createStore();

const BUTTONS = ['Active'];



class MenuFuncs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [{ value: 'Active', label: 'Active' },
            { value: 'Hide', label: 'Hide' }],
            selectValue: 'Active',
            userInfo: [],
        }
        this.updateValue = this.updateValue.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        let self = this;
        console.log("User.userExist: " + User.userExist());
        if (User.userExist() == true) {
            User.getUserData().then(function (data) {
                self.getData(data);
            }, function (err) {
                //Error occur
                console.log("Promise Error");
                console.log(err);
            })
        }

        ChatService.getUserStatus().then(function (data) {
            if (data.val() == null) {
                ChatService.updateStatus('Active').then(function () {
                }).catch(function (err) {
                    alert(err);
                })
            } else {
                self.setState({ selectValue: data.val() });
            }
        })

    }
    getData(data) {
        let newUser = []
        const userdata = data.val();
        //const keys = Object.keys(userdata);

        newUser.push(userdata.display_name);
        this.setState({ userInfo: newUser });
    }

    updateValue(newValue) {
        let self = this;
        ChatService.updateStatus(newValue).then(function () {
            self.setState({
                selectValue: newValue
            });
        }).catch(function (err) {
            alert(err);
        })

    }

    render() {
        console.log("CCCCCHHHAATTT!!!")
        return (
            <Grid id="funcsGrid">
                <Row id='funcsRow'>

                    <Col xs={1} md={1}> <Media.Left>
                        <TiUserIcon size={38} />
                    </Media.Left></Col>
                    <Col xs={1} md={1}>
                        <div >
                            <h4>{this.state.userInfo[0]}</h4>
                            <Select
                                style={{ width: 150 }}
                                autosize
                                ref="stateSelect"
                                autofocus
                                options={this.state.options}
                                simpleValue
                                clearable={false}
                                name="selected-state"
                                disabled={false}
                                value={this.state.selectValue}
                                onChange={this.updateValue}
                                searchable={false} />
                        </div>

                    </Col>
                </Row>
                <Row id='funcsRow'>
                    <Col xs={1} md={1}> <Media.Left>
                        {/*<Image width={64} height={64} src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png" alt="Image" />*/}
                        <TiContactsIcon size={28} />
                    </Media.Left></Col>
                    <Col xs={1} md={1}><button className="menuBtn"
                        //!!! Name tag cannot be removed name={["GotoContact"]}

                        onClick={() => { return this.props.SwitchAction({ GotoContent: "GotoContact" }) }}>Contacts</button></Col>

                </Row>
                <Row id='funcsRow'>
                    <Col xs={1} md={1}> <Media.Left>
                        <TiUserAddIcon size={28} />
                    </Media.Left></Col>
                    <Col xs={1} md={1}><button className="menuBtn"
                        //I found the trick, use the name to pass the data to the component

                        //name={["GotoAdd", "123"]}
                        onClick={() => { return this.props.SwitchAction({ GotoContent: "GotoAdd" }) }}>Add Contact</button></Col>
                </Row>
                <Row id='funcsRow'>
                    <Col xs={1} md={1}> <Media.Left>
                        <AddProjectIcon size={28} />
                    </Media.Left></Col>
                    <Col xs={1} md={1}><button className="menuBtn"

                        //name={["GotoProject"]}
                        onClick={() => { return this.props.SwitchAction({ GotoContent: "GotoProject" }) }}>Create Project</button></Col>
                </Row>
                <Row id='funcsRow'>
                    <Col xs={1} md={1}> <Media.Left>
                        <FaHistoryIcon size={28} />
                    </Media.Left></Col>
                    <Col xs={1} md={1}><button className="menuBtn"

                        //name={["GotoHistory"]}
                        onClick={() => { return this.props.SwitchAction({ GotoContent: "GotoHistory" }) }}>History</button></Col>
                </Row>
            </Grid>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return { SwitchAction: bindActionCreators(actions.switchContent, dispatch) };
};

export default connect(null, mapDispatchToProps)(MenuFuncs);
