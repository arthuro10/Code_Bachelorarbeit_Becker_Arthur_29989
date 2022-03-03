import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/B_store'

import mainStore from '../../../react/js/store/mainStore'

import Form_User from '../components/Form_User'




const CompB_Task_a = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [about, setAbout] = useState("");
    const [isValid, setIsValid] = useState(false);

    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    const handleFirstNameChange = (event) => {
      event.preventDefault();
      console.log(event.target.value);
      setFirstName(event.target.value);
    } 
    const handleLastNameChange = (event) => {
      event.preventDefault();
      console.log(event.target.value);
      setLastName(event.target.value);
    } 
    const handleAboutChange = (event) => {
      event.preventDefault();
      console.log(event.target.value);
      setAbout(event.target.value);
    } 

    const ButtonClickNewTask = async () => {
      const _id = mainStore.getCurrentTaskId();
      console.log(_id);
      // set the new Task to active ... 
      const _query = `mutation {updateActiveTask(idLastActive : "${_id}")}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })
      }catch(err) {
        console.log("err",err);
      }
    }


    const handleButtonClick = () => {
      if(firstName === "" || lastName === "" | about === "") alert("Null String");
     
      const isSend = store.sendKunde({
          firstName : firstName,
          lastName : lastName,
          about : about
        })
        if(isSend){
          alert("Send Kunde!");
          setIsValid(true);
        } 
      
      

    } 


    return (
      <div style={zentriert}>
        <h1>Task 1</h1>
              <Form_User handleFirstNameChange={handleFirstNameChange} 
              handleLastNameChange={handleLastNameChange}
              handleAboutChange={handleAboutChange}
              />
              <br/>
              <Button primary onClick={handleButtonClick}>Send to Server</Button>
              {
                  isValid === true ? <Link to="/"><Button primary onClick={ButtonClickNewTask}>NEXT View</Button></Link> : ""
              }
      </div>
    );
  };
  
  export default CompB_Task_a;


  /*
  
  

query {mailset {sender receiver text}}

mutation {
  createMailset(mailSet: {
    sender : "r@r",
    receiver : "q@q",
    text : "das ist ein Test"
  }){sender receiver text}
   
}

  
  
  */