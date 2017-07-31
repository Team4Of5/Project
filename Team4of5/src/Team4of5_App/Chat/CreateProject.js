import React from 'react';
import ReactDOM from 'react-dom';
//reference: https://github.com/JedWatson/react-select
import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {
    Button,
    FormGroup,
    FormControl,
    ControlLabel
 } from 'react-bootstrap';
import * as ChatService from '../../Team4of5_Service/Chat.js';


const style = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    width: 470,
    height: 40,
};

const buttonStyle = {
    marginBottom: 20,
    marginTop: 20
};


class CreateProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            value: [],
            inputTitle: ''
        }
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.getData = this.getData.bind(this);
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

    getData(data) {
        let moreDivs = [];
        for (let index in data) {
            let element = data[index];
            console.log(index);
            console.log(element);
            //Only "indivdual" type can be added into a project
            if (element.type == "Individual") {
                moreDivs.push(
                    { value: element.name, label: element.name, extraData: element, Uuid: index }
                );
            }

        }
        //setTimeout(() => {
        this.setState({ options: this.state.options.concat(moreDivs) });
        //}, 500);
    }

    handleSelectChange(value) {
        console.log('You\'ve selected:  ', value);
        this.setState({ value });
    }

    handleConfirm() {
        let self = this;
        let title = this.state.inputTitle.value
        if (title == "") {
            alert("Please input your project name!");
        } else if (this.state.value == "") {
            alert("Please choose your members!");
        } else {
            ChatService.checkProjectNameExist(title).then(function () {
                let memUids = [];
                let users = ""
                for (let i = 0; i < self.state.value.length; i++) {
                    users = users.concat(self.state.value[i].value + " ")
                    memUids.push(self.state.value[i].Uuid);
                }
                console.log(title)
                ChatService.createProject(memUids, title).then(function (data) {
                    alert("Project name: " + title + "\n Project Members: " + users
                        + "\n Successfully added!");
                }).catch(function (err) {
                    alert("Error: " + err);
                })

                self.state.inputTitle.value = "";
                self.setState({ value: [] })
            }).catch(function (err) {
                alert(err);
            })

        }
    }

    render() {
        return (
            <div className="panel panel-info" id="title">
                <div className="panel-heading clearfix">
                <h1  className="panel-title">Create a New Project</h1>
                <p>Please Select members from your chat contact list</p>
            </div>
            <div className="panel-body">

                <FormControl style={style}
                     inputRef={title => this.state.inputTitle = title}
                     placeholder="Project Name" className="message-input" />

                <Select multi={true}
                    disabled={false}
                    value={this.state.value}
                    placeholder="Select members from Chat Create Project"
                    options={this.state.options}
                    onChange={this.handleSelectChange} />

                <Button bsStyle="primary"
                    style={buttonStyle}
                    onClick={this.handleConfirm}>Confirm</Button>
            </div>
            </div>

        )
    }
}

export default CreateProject;
