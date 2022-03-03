import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom'
import AuthContext from '../../store/authStore'


const Login_Form = (props) => {
    const baseURL = 'http://localhost:3000/'
    const [resultInfo,setResultInfo] = useState("");

    const authCtx = useContext(AuthContext);


    const zentriert = {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign : "center"
    }


      const handleSubmit = (event) => {
        event.preventDefault();

        const currentForm = event.target;
        const tmpFormData = new FormData(currentForm);
        const data = {
            name: tmpFormData.get('loginNameOrEmail'),
            password: tmpFormData.get('loginPassword')
        };

        if(!data.name) {
            setResultInfo('Name / E-Mail darf nicht leer sein');
        } else if(!data.password) {
            setResultInfo('Passwort darf nicht leer sein');
        } else {
            console.log("Send POST");
            const graphqlQuery = {
                query: `
                query 
                {
                    login(name : "${data.name}" password : "${data.password}")
                    {token userId name role tasks}
                }
                `
              };
            fetch(baseURL+'graphql', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(graphqlQuery)
            }).then(res => res.json())
            .then(
                result => {
                    console.log("result");
                    console.log(result);
                    if(result.errors !== undefined){
                        console.log("error");
                        const errorMessage = result.errors[0].message;
                        setResultInfo(errorMessage);
                        return;
                    }
                    
    
                    currentForm.reset();
                    if(result.data.login.token === undefined || result.data.login.token === null){
                        setResultInfo("Failed");
                        return;
                    } 
                    /*const expirationTime = new Date(
                        new Date().getTime() + +data.expiresIn * 1000
                      );*/
                      // 60 wären 1 Minute ... 3600 sind 1h  // Am besten von der DB beziehen diese Zeitangabe ...
                    const expirationTime = new Date(
                        new Date().getTime() + 360000 * 1000
                      );
                      console.log("result.data.login");
                      console.log(result.data.login);
                      const role = result.data.login.role;
                      authCtx.login(result.data.login.token, expirationTime.toISOString(),result.data.login.name,role);
                      //window.location.reload();
                    /*
                    console.log("sessionStorage");
                    console.log(result.data.login);
                    const role = result.data.login.role;
                    sessionStorage.setItem('jwt',result.data.login.token);
                    sessionStorage.setItem('username',result.data.login.name);
                    sessionStorage.setItem('role',role);
                    console.log("sessionStorage");
                    console.log(sessionStorage);
                    setResultInfo("Auth successful");
                    window.location.reload();*/
                },
                (error) => {
                    console.log("Error: " + JSON.stringify(error));
                    setResultInfo('Name / E-Mail oder Passwort stimmen nicht!');
                }
            );
        }
    }

    const btnClick = () => {
        window.location.href = '/#/signup';
        
    }

        console.log(resultInfo);
        const normalP = <p>Wenn Sie einen Account haben, können Sie sich hier anmelden</p>
        const errorP = <p>{resultInfo}</p>
        const classString = "ui icon message";
        const classErrorString = "ui icon error message";
        const classPositiveString = "ui icon positive message";


    return (
        <div>
            <div class="page-login">
                <div class="ui centered grid container">
                    <div class="nine wide column">
                        <div class={resultInfo !== "Auth successful" ? (resultInfo === "" ? classString : classErrorString) : classPositiveString}>
                            <i class="lock icon"></i>
                            <div class="content">
                                <div class="header">
                                    Login!
                                </div>
                                { resultInfo === "" ? normalP : errorP }
                            </div>
                        </div>
                        <div class="ui fluid card">
                            <div class="content">
                                <form class="ui form" action="" method="post" onSubmit={handleSubmit} autoComplete="off">
                                    <div class="field">
                                        <label>Name or E-Mail</label>
                                        <input type="text" name="loginNameOrEmail" placeholder="Admin"></input>
                                    </div>
                                    <div class="field">
                                        <label>Password</label>
                                        <input type="password" name="loginPassword" placeholder="Password"></input>
                                    </div>
                                    
                                    <br></br>
                                    <br></br>
                                    <div class="ui buttons">
                                        <button class="ui primary labeled icon button" type="submit">
                                            <i class="unlock alternate icon"></i>
                                            Login!
                                        </button>
                                        <div class="or"></div>
                                        <button class="ui positive button" onClick={btnClick} >
                                            <i class="sign-in alternate icon"></i>
                                            <Link to="/signup">Sign Up!</Link>
                                        </button>
                                    </div>
                                    
                                </form>
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
  
  export default Login_Form;
