import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";


import mainStore from '../../../react/js/store/mainStore'

import Form_Antrag from '../components/Form_Antrag'




const D_Beantragen = () => {
  const _id = mainStore.getCurrentTaskId();
  const [information, setInformation] = useState({});

    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
    }

    useEffect(() => {
      getData();
      return () => {
        console.log("Clean up");
      }
    }, []);

    const getData = async () => {
      console.log("GET DATA");
      const _query = `{getProcessDataFromPreviousTask(id : "${_id}")}`
      console.log("_query");
      console.log(_query);
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })

        stringData.data.data.getProcessDataFromPreviousTask.forEach(data => {
          const parsedData = JSON.parse(data);
          setInformation(parsedData)
        });

        console.log(stringData.data.data.getProcessData);
      }catch(err) {
        console.log("err",err);
      }
    }

    const ButtonClickNewTask = async () => {
      const data = {
        firstName : information.firstName,
        lastName: information.lastName,
        about: information.about,
        gender: information.gender,
        job: information.job
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
        <h1>Beantragen Versicherung ...für <strong>{information.firstName} {information.lastName}</strong></h1>
        <Button>Beantragen</Button>
        <Link to="/"><Button primary onClick={ButtonClickNewTask}>NEXT View</Button></Link>
      </div>
    );
  };
  
  export default D_Beantragen;