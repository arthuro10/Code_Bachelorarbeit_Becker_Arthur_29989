import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

//import store from '../store/B_store'

import mainStore from '../../../react/js/store/mainStore'

//import Form_User from '../components/Form_User'




const CompC_Task_b = () => {

    const [isValid, setIsValid] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [abteilung, setAbteilung] = useState("");
    const [info, setInfo] = useState("");

    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    const loadAntrag = async () => {
      const _id = mainStore.getCurrentTaskId();
      console.log("_id");
      console.log(_id);
      const _query = `query {getAntrag(id : "${_id}") {vorname nachname abteilung info}}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })

        const data = stringData.data.data.getAntrag;
        setFirstName(data.vorname);
        setLastName(data.nachname);
        setAbteilung(data.abteilung);
        setInfo(data.info);
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


    const handleButtonClickAnnehmen = async () => {
      
      const _id = mainStore.getCurrentTaskId();
      console.log(_id);
      // set the new Task to active ... 
      const _query = `mutation {updateAntrag(type : true antragsDaten: {vorname : "${firstName}" nachname : "${lastName}" abteilung : "${abteilung}" info : "${info}" id :"${_id}"} )}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })
        if(stringData.data.data.updateAntrag){
          setIsValid(true);
        }
      }catch(err) {
        console.log("err",err);
      }
      

    } 
    const handleButtonClickAblehnen = async () => {
      const _id = mainStore.getCurrentTaskId();
      console.log(_id);
      // set the new Task to active ... 
      const _query = `mutation {updateAntrag(type : false antragsDaten: {vorname : "${firstName}" nachname : "${lastName}" abteilung : "${abteilung}" info : "${info}" id :"${_id}"} )}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })
        if(stringData.data.data.updateAntrag){
          setIsValid(true);
        }
      }catch(err) {
        console.log("err",err);
      }
      

    } 


    return (
      <div style={zentriert}>
        <h1>Prozess C: Task 2</h1>
        <h1>Vorname: {firstName}</h1>
        <h1>Nachname: {lastName}</h1>
        <h1>Abteilung: {abteilung}</h1>
        <h1>Grund: {info}</h1>
        <Segment>
        <Button primary onClick={handleButtonClickAnnehmen}>Antrag annehmen</Button>
        <Button secondary onClick={handleButtonClickAblehnen}>Antrag ablehnen</Button>
        </Segment>
        {
                  isValid === true ? <Link to="/"><Button primary onClick={ButtonClickNewTask}>NEXT View</Button></Link> : ""
        }
      </div>
    );
  };
  
  export default CompC_Task_b;