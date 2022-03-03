import React, { useState, useContext } from 'react'
import {Button,Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Login from "../pages/account_components/Login_Form"

import AuthContext from '../store/authStore'


const Start_Page = (props) => {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    const userName = authCtx.name;
    const userRole = authCtx.role;

    const zentriert = {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign : "center"
      }

      if(isLoggedIn){
        location.replace('/#/home')
      }

    const loggedIn = <div style={zentriert}>
        <h1 >Start Page</h1>
        <h2 >Sie sind eingeloggt als {userName}</h2>
        <Link to='/home'>
            <Button color='black'>Home!</Button>
        </Link>
        
    </div>

    const notLoggedIn = <div >
        <h1 style={zentriert}>Start Page</h1>
        <Login />
    </div>  

    if(isLoggedIn) {
        return loggedIn
    }else{
        return notLoggedIn
    }


}


export default Start_Page;
