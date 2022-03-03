import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/Email_Processing'

import mainStore from '../../../react/js/store/mainStore'

const validateEmail = require('../../../react/js/utils/utils').validateFunc;


const Comp_Task_a = () => {
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [isValid, setIsValid] = useState(false);

    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    const handleSenderChange = (event) => {
      event.preventDefault();
      setSender(event.target.value);
    } 
    const handleReceiverChange = (event) => {
      event.preventDefault();
      setReceiver(event.target.value);
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
      if(sender === "" || receiver === ""){
        alert("Null String");
        return;
      }
     
      store.setEmailProcess({
        id : uuid(),
        sender : sender,
        receiver : receiver
      })
      alert("Validate!");
      
      const _query = validateEmail(sender,receiver);
      console.log(_query);
      axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      }).then((result) => {
        
        console.log(result.data)
        console.log(result.data.data.validateEmail)
        if(result.data.data.validateEmail.senderValid === false && result.data.data.validateEmail.receiverValid === false){
          alert("Both are not valid");
          return;
        }
        if(result.data.data.validateEmail.senderValid === true && result.data.data.validateEmail.receiverValid === true){
          alert("Both are VALID");
          setIsValid(true);
        }
        if(!result.data.data.validateEmail.senderValid){
          alert("Sender is not Valid");
        }
        if(!result.data.data.validateEmail.receiverValid){
          alert("Receiver is not Valid");
        }
      }).catch(err => {
        console.log("err");
        console.log(err);
      });
      

    } 


    return (
      <div style={zentriert}>
               <Form>
                <Form.Group widths='equal'>
                  <Form.Input fluid label='Sender' value={sender} onChange={handleSenderChange} />
                  <Form.Input fluid label='Receiver' value={receiver} onChange={handleReceiverChange} />
                </Form.Group>
              
                <Form.Button secondary onClick={handleButtonClick}>Are they Valid?</Form.Button>
              </Form>
      </div>
    );
  };
  
  export default Comp_Task_a;


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