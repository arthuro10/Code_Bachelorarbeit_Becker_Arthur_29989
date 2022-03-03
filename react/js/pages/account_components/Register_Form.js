import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'


const Register_Form = (props) => {
    const baseURL = 'http://localhost:3000/'
    const [resultInfo,setResultInfo] = useState("");


    const zentriert = {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign : "center"
    }


      const signupHandler = (event) => {
        event.preventDefault();

        const currentForm = event.target;
        const tmpFormData = new FormData(currentForm);
        const data = {
            name: tmpFormData.get('NameOrEmail'),
            password: tmpFormData.get('Password'),
            passwordConfirm: tmpFormData.get('PasswordConfirm')
        };
        if(data.name === '' || data.password === '' || data.passwordConfirm === ''){
            alert("Please fill in all fields");
            return;
        }
        if(data.password !== data.passwordConfirm)
        {
            console.log(data.password);
            console.log(data.passwordConfirm);
            setResultInfo("Passwörter stimmen nicht überein");
            return;
        }
        
        const graphqlQuery = {
          query: `
          mutation {createUser(name : "${data.name}" password : "${data.password}")}
          `
        };
        fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphqlQuery)
        })
          .then(res => {
            return res.json();
          })
          .then(resData => {
            if (resData.errors && resData.errors[0].status === 422) {
                setResultInfo("Validation failed. Make sure the email address/ name isn't used yet!");
                throw new Error(
                    "Validation failed. Make sure the email address/ name isn't used yet!"
                );
            }
            if (resData.errors) {
                setResultInfo("User creation failed!");
                throw new Error('User creation failed!');
            }
            setResultInfo("SignUp successful");
            currentForm.reset();
            window.location.href = '/#/';
            console.log(resData);
          })
          .catch(err => {
            console.log("err",err);
            setResultInfo(err);
          });
      };



    const normalP = <div>
        <p>Hier können Sie einen Account anlegen</p>
    </div>
    const errorP = <p>{resultInfo}</p>
    const classString = "ui icon message";
    const classErrorString = "ui icon error message";
    const classPositiveString = "ui icon positive message";

    return (
        <div>
            <div class="page-login">
                <div class="ui centered grid container">
                    <div class="nine wide column">
                        <div class={resultInfo !== "SignUp successful" ? (resultInfo === "" ? classString : classErrorString) : classPositiveString}>
                            <i class="lock icon"></i>
                            <div class="content">
                                <div class="header">
                                    Sign Up!
                                </div>
                                { resultInfo === "" ? normalP : errorP }
                            </div>
                        </div>
                        <div class="ui fluid card">
                            <div class="content">
                                <form class="ui form" action="" method="post" onSubmit={signupHandler} autoComplete="off">
                                    <div class="field">
                                        <label>Name or E-Mail</label>
                                        <input type="text" name="NameOrEmail" placeholder="Admin"></input>
                                    </div>
                                    <div class="field">
                                        <label>Password</label>
                                        <input type="password" name="Password" placeholder="Password"></input>
                                    </div>
                                    <div class="field">
                                        <label>Confirm Password</label>
                                        <input type="password" name="PasswordConfirm" placeholder="Confirm Password"></input>
                                    </div>
                                    
                                    <br></br>
                                    <br></br>
                                    <div class="ui buttons">
                                        <button class="ui primary labeled icon button" type="submit">
                                            <i class="unlock alternate icon"></i>
                                            Sign Up!
                                        </button>
                                        <div class="or"></div>
                                        <Link to="/">
                                        <button class="ui positive button" >
                                            <i class="sign-in alternate icon"></i>
                                            <Link to="/">Account already set? Login! </Link>
                                        </button>
                                        </Link>
                                    </div>
                                    
                                </form>
                                <div>{resultInfo}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br><br></br><br></br>
        </div>
    );
};
  
  export default Register_Form;
