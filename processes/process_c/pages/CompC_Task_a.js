import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/C_store'

import mainStore from '../../../react/js/store/mainStore'

import Form_Antrag from '../components/Form_Antrag'




const CompC_Task_a = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [abteilung, setAbteilung] = useState("");
    const [info, setInfo] = useState("");
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
      const handleAbteilungChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setAbteilung(event.target.value);
      } 
      const handleInfoChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setInfo(event.target.value);
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
        if(firstName === "" || lastName === "" | abteilung === "" || info === "") alert("Null String");
        const _id = mainStore.getCurrentTaskId();
        console.log(_id);
        const isSend = store.sendAntragsData({
            firstName : firstName,
            lastName : lastName,
            abteilung : abteilung,
            info : info,
            id : _id
          })
          if(isSend){
            alert("Send Antrags Daten!");
            setIsValid(true);
          }else{
            alert("Fehler beim Senden");
          }
        
        
  
      } 


    return (
      <div style={zentriert}>
        <h1>Urlaubsantrag beantragen (Task 1)</h1>
        <Form_Antrag
        handleFirstNameChange={handleFirstNameChange}
        handleLastNameChange={handleLastNameChange}
        handleAbteilungChange={handleAbteilungChange}
        handleInfoChange={handleInfoChange}
        />
        <br/>
        <Button primary onClick={handleButtonClick}>Send to Server</Button>
              {
                  isValid === true ? <Link to="/"><Button primary onClick={ButtonClickNewTask}>NEXT View</Button></Link> : ""
              }
      </div>
    );
  };
  
  export default CompC_Task_a;