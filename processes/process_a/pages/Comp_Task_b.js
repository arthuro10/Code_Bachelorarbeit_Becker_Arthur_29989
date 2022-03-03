import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/Email_Processing'

import mainStore from '../../../react/js/store/mainStore'

const _sendEmail = require('../../../react/js/utils/utils').sendEmail


const Comp_Task_b = () => {
    const [text, setText] = useState("");
    const [subject, setSubject] = useState("");
    const [isValid, setIsValid] = useState(false);

    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    const handleSubjectChange = (event) => {
      event.preventDefault();
      setSubject(event.target.value);
    } 
    const handleTextChange = (event) => {
      event.preventDefault();
      setText(event.target.value);
    } 
    const handleButtonClick = () => {
      if(text === ""){
        alert("Null String");
        return;
      }
     
      alert("Set Variable");
      
      
      const _query = _sendEmail(store.showEmailProcesses().sender,store.showEmailProcesses().receiver,text,subject)
      console.log(_query);
      axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      }).then((result) => {
        setIsValid(true);
        console.log(result.data)
      }).catch(err => {
        console.log("err");
        console.log(err);
      });
      

    } 


    return (
      <div style={zentriert}>
        <h1>Sender: {store.showEmailProcesses().sender}</h1>
        <h1>Receiver: {store.showEmailProcesses().receiver}</h1>
               <Form>
                <Form.TextArea label='Subject' placeholder='Thema XY' value={subject} onChange={handleSubjectChange} />
                <Form.TextArea label='Write your Email' placeholder='Sehr geehrte Damen und Herren, ' value={text} onChange={handleTextChange} />
                <Form.Button secondary onClick={handleButtonClick}>Send to Server</Form.Button>
                {
                  isValid === true ? <Link to="/"><Button primary>NEXT View</Button></Link> : ""
                }
              </Form>
      </div>
    );
  };
  
  export default Comp_Task_b;