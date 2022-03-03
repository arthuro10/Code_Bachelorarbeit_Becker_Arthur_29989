import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

//import store from '../store/B_store'

import mainStore from '../../../react/js/store/mainStore'

//import Form_User from '../components/Form_User'




const CompC_Task_c = () => {


  const [isValid, setIsValid] = useState(false);
  const [erlaubnis, setErlaubnis] = useState("");


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }

  const loadAntrag = async () => {
    const _id = mainStore.getCurrentTaskId();
    console.log("_id");
    console.log(_id);
    const _query = `query {getAntrag(id : "${_id}") {vorname nachname abteilung info erlaubnis}}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      const _erlaubnis = stringData.data.data.getAntrag.erlaubnis;
      console.log(_erlaubnis);
      if(_erlaubnis){
        setErlaubnis("angenommen.Schönen Urlaub!")
      }else{
        setErlaubnis("nicht angenommen...")
      }
      


    }catch(err) {
      console.log("err",err);
    }

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

  useEffect(() => {
    loadAntrag();
  }, []);



  const handleButtonClick = async () => {
    
    

  } 


  return (
    <div style={zentriert}>
      <h1>Prozess C: Task 3</h1>
      <h1>Antrag wurde {erlaubnis}</h1>

      <Segment>
      <Link to="/">
      <Button primary onClick={handleButtonClick}>Prozess beenden</Button>
      </Link>
      </Segment>

    </div>
  );
};
  
  export default CompC_Task_c;