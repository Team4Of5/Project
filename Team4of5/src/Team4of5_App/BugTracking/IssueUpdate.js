import React from 'react';
import ReactDOM from 'react-dom';

//Connect Firebase
import * as Config from '../../Team4of5_Service/Config.js';
import * as Issues from '../../Team4of5_Service/Issues.js';

//import css
import './IssueTracker.css'
//import react-bootstrap
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Button,
    Modal
} from 'react-bootstrap';

class IssueUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            formBtnTxt: 'Update Issue',
            redirectToIssue: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        //connect with firebase
    }
    getInitialState=()=>{
        return {show: false};
    }
    close=()=> {
   this.setState({ showModal: false });
}

    handleChange(name, event) {
        let items = this.state;
        items[name] = event.target.value;
        this.setState(items);
    }

    handleSubmit(event) {
        if (this.state.completionDate || this.state.status || this.state.priority || this.state.severity) {
            Issues.issueUpdate(this.state.issue_id, this.state.completionDate, this.state.status, this.state.priority, this.state.severity).then((Issue) => {
                console.log(Issue);
            })
        }
        this.state.priority = '';
        this.state.severity = '';
        this.state.completionDate = '';
        this.state.status = '';
        this.state.issue_id = '';

        event.preventDefault();
    }


    render() {
        let close = () => this.setState({show: false});
        return (
            <div className="modal-container" style={{
            marginTop:20
            }}>
                <Button block onClick={() => this.setState({show: true})}>
                    Update Issue
                </Button>
                <Modal id="modleTitle" show={this.state.show} onHide={close} container={this}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please Fill In Issue Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="formControlsText">
                                <ControlLabel>ID</ControlLabel>
                                <FormControl type="text" value={this.state.issue_id} placeholder='enter ID' onChange={this.handleChange.bind(this, 'issue_id')} required/>
                            </FormGroup>

                            <FormGroup controlId="formControlsSelect">

                                <ControlLabel>Status</ControlLabel>

                                <FormControl componentClass="select" value={this.state.status} onChange={this.handleChange.bind(this, 'status')}>

                                    <option value=""></option>
                                    <option value="New">New</option>
                                    <option value="Open">Open</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Closed">Closed</option>
                                </FormControl>

                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Priority</ControlLabel>
                                <FormControl componentClass="select" value={this.state.priority} onChange={this.handleChange.bind(this, 'priority')}>

                                    <option value=""></option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Fix if time">Fix if time</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Severity</ControlLabel>
                                <FormControl componentClass="select" value={this.state.severity} onChange={this.handleChange.bind(this, 'severity')}>

                                    <option value=""></option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="None">None</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="formControlsText">

                                <ControlLabel>Actual completion date</ControlLabel>

                                <FormControl type="date" value={this.state.completionDate} onChange={this.handleChange.bind(this, 'completionDate')}/>

                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.formBtnTxt} />
                        </Form>
                    </Modal.Body>
                     <Modal.Footer>
                            <Button bsStyle="success" onClick={() => {this.setState({show: false}); this.state.severity = ''; this.state.issue_id = ''; this.state.priority = ''; this.state.status = '';  this.state.completionDate = ''; }}>Close</Button>
                     </Modal.Footer>
                </Modal>
            </div>
        );
    }

}
export default IssueUpdate;
