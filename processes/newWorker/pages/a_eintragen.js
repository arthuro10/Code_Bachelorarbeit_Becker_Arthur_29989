import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form, Segment } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/NewWorker_store'

import mainStore from '../../../react/js/store/mainStore'






const A_Eintragen = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [job, setJob] = useState("");
    const [about, setAbout] = useState("");

    const _id = mainStore.getCurrentTaskId();
    console.log(_id);

    const options = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
      { key: 'o', text: 'Other', value: 'other' },
    ]
    const jobOptions = [
      { key: 'it', text: 'IT', value: 'IT' },
      { key: 'masch', text: 'Maschinenbau', value: 'Maschinenbau' },
      { key: 'ele', text: 'Elektriker', value: 'Elektriker' },
    ]


    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    const Segmentzentriert = {
      marginLeft: "10px",
      marginRight: "10px",
      textAlign : "center"
    }

    useEffect(() => {
      //getData();
      return () => {
        console.log("Clean up");
      }
    }, []);

    const getData = async () => {
      const _query = `{getProcessData(id "${_id}")}`
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })

        console.log(stringData.data.data.getProcessData);
      }catch(err) {
        console.log("err",err);
      }
    }

    const check = (event) => {
      event.preventDefault();
      console.log("job");
      console.log(job);
      console.log("gender");
      console.log(gender);
      console.log("firstName");
      console.log(firstName);
      console.log("lastName");
      console.log(lastName);
      console.log("about");
      console.log(about);
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
    const handleAbout = (event) => {
      event.preventDefault();
      console.log(event.target.value);
      setAbout(event.target.value);
    } 
    const handleGender = (event) => {
      event.preventDefault();
      setGender(event.target.value);
    } 
    const handleJob = (event) => {
      event.preventDefault();
      setJob(event.target.value);
    } 

    const ButtonClickNewTask = async () => {
      const data = {
        firstName : firstName,
        lastName: lastName,
        about: about,
        gender: gender,
        job: job
      }
      const stringifiedData = JSON.stringify(data).replace("\"firstName\"","firstName").replace("\"lastName\"","lastName")
      .replace("\"about\"","about").replace("\"gender\"","gender").replace("\"job\"","job");

      const _query1 = `mutation {setProcessData(id : "${_id}" data : ${stringifiedData})}`;
      console.log("_query1")
      console.log(_query1)
      try{
        const stringData1 = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query1
          }
        })
      }catch(err) {
        console.log("err stringData1",err);
      }
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
        if(stringData.data.data.updateActiveTask) window.location.replace('/')
      }catch(err) {
        console.log("err updateActiveTask",err);
      }
    }

    

    return (
      <div style={zentriert}>
        <h1>NewWorker - Task 1 - Daten Eintragen</h1>
        <Segment color='black' style={Segmentzentriert}>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input fluid label='First name' placeholder='First name' onChange={handleFirstNameChange} />
              <Form.Input fluid label='Last name' placeholder='Last name' onChange={handleLastNameChange} />
              <Form.Input fluid label='Gender' placeholder='Gender' onChange={handleGender} />
              <Form.Input fluid label='Job' placeholder='Job' onChange={handleJob} />
            </Form.Group>
           
            <Form.TextArea label='About' placeholder='Tell us more about you...' onChange={handleAbout} />
            <Form.Button onClick={ButtonClickNewTask}>Submit</Form.Button>
        </Form>
        </Segment>
      </div>
    );
  };
  
  export default A_Eintragen;