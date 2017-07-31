import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '../../registerServiceWorker.js';
import * as Users from '../../Team4of5_Service/Users.js';
import Menu from '../Menu.js';
import * as ChatService from '../../Team4of5_Service/Chat.js';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
// style
import './UserLoginSignup.css';
//import react-bootstrap
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Button,
    Col,
    InputGroup,
    Glyphicon
} from 'react-bootstrap';
//import FormErrors
import { FormErrors } from './FormError.js';

class UserLoginSignup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        email : '',
        password : '',
        formBtnTxt : 'Login',
        redirectToMenu : false,
        formErrors : {
            email: '',
            password: ''
        },
        emailValid : false,
        passwordValid : false,
        formValid : false

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.switchLoginSignup = this.switchLoginSignup.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  // handleChange(name, event) {
  //   let items = this.state;
  //   items[name] = event.target.value;
  //   this.setState(items);
  // }

  //credit to https://github.com/learnetto/react-form-validation-demo/blob/master/src/Form.js
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
   let fieldValidationErrors = this.state.formErrors;
   let emailValid = this.state.emailValid;
   let passwordValid = this.state.passwordValid;

   switch(fieldName) {
     case 'email':
       emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
       fieldValidationErrors.email = emailValid ? '' : ' is invalid';
       break;
     case 'password':
       passwordValid = value.length >= 6;
       fieldValidationErrors.password = passwordValid ? '': ' is too short';
       break;
     default:
       break;
   }
   this.setState({formErrors: fieldValidationErrors,
                   emailValid: emailValid,
                   passwordValid: passwordValid
                 }, this.validateForm);
 }

 validateForm() {
   this.setState({formValid: this.state.emailValid && this.state.passwordValid});
 }

 errorClass(error) {
   return(error.length === 0 ? '' : 'has-error');
 }


   handlePasswordChange(event){
    if (this.state.email != ''){
      Users.resetPwd(this.state.email)
    }
    else {
      alert("Please enter your email")
    }
  }

  handleSubmit(event) {
    if (document.getElementById("submitBtn").value == "Login") {

      Users.sign_in_user(this.state.email, this.state.password)
      .then((User) => {
        console.log(User);
        //alert("Login Succeed!!");
          console.log('User Confirm!!');
          //handle redirect
          ChatService.listenCurUserOnOffline();
          this.setState({redirectToMenu: true});
      }).then((User) => {
        Users.saveUserinfo();
      }).catch((error) => {
        console.log(error);
        alert(error.message);
      });
    } else {
      Users.create_user(this.state.email, this.state.password)
        .then((User) => {
          console.log(User);
          alert('Sign up succeeded, please login');
        }).then((User) => {
        Users.saveUserinfo();
        })
        .then((User) => {
          this.setState({email: ''});
          this.setState({password: ''});
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    }
    event.preventDefault();

  }

  switchLoginSignup(event) {
    let submitBtn = document.getElementById("submitBtn");
    if (submitBtn.value == "Login"){
      this.state.formBtnTxt = "SignUp";
      submitBtn.value = "SignUp";
    } else{
      submitBtn.value = "Login";
      this.state.formBtnTxt = "Login";
    }
  }

  render() {
    const { from } = this.props.location.state ||{ from: { pathname: '/menu' }}
    const { redirectToMenu } = this.state

    if (redirectToMenu) {
          return (
           <Redirect to={from}/>
          )
        }

    return (
    <div className="AlignerLogin">
            <div className='setingPanel'>
                <div className="panel panel-info">
                    <div className="panel-heading clearfix">
                        <h1 className="panel-title text-center"><strong>Please enter Login or Signup information</strong></h1>
                    </div>
    <div className='panel-body text-center'>
      <Form horizontal onSubmit={this.handleSubmit} >
        <button type="button"
          id="switchBtn"
          onClick={this.switchLoginSignup}>Login &nbsp;&nbsp;|&nbsp;&nbsp; Signup</button>

            <FormGroup controlId="formHorizontalEmail"
                className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
     <Col componentClass={ControlLabel} sm={2}>
       Email
     </Col>
     <Col sm={10}>
         <InputGroup>
         <InputGroup.Addon>
         <Glyphicon glyph="user" />
         </InputGroup.Addon>
       <FormControl type="text" placeholder="Email" name="email"
           required value={this.state.email} onChange={this.handleChange}/>

</InputGroup>
     </Col>
   </FormGroup>

   <FormGroup controlId="formHorizontalPassword" className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
     <Col componentClass={ControlLabel} sm={2}>
       Password
       <small> at least 6 digits</small>
     </Col>
     <Col sm={10}>
         <InputGroup>
         <InputGroup.Addon>
         <Glyphicon glyph="lock" />
         </InputGroup.Addon>
       <FormControl type="password" placeholder="Password" name="password"
           value={this.state.password} onChange={this.handleChange}/>

</InputGroup>
     </Col>
   </FormGroup>
   <FormGroup>

             <a onClick={this.handlePasswordChange} href="javascript:void(0);">Forgot Password?</a>

      </FormGroup>
      <FormErrors formErrors={this.state.formErrors} />
      <FormGroup>

                <input type="submit"
                 id = "submitBtn"
                 disabled={!this.state.formValid}
                  value={this.state.formBtnTxt}/>

          </FormGroup>

      </Form>
      </div>
          </div>
      </div>
    </div>
    );
  }
}
export default UserLoginSignup
