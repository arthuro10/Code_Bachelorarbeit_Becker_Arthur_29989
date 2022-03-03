import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/C_store'

import mainStore from '../../../react/js/store/mainStore'

import Form_Antrag from '../components/Form_Antrag'




const CompD_Task_d = () => {


    const zentriert = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign : "center"
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
        window.location.replace('/');
      }catch(err) {
        console.log("err",err);
      }
    }


    

    return (
      <div style={zentriert}>
        <h1>Task 4 -- Chef B</h1>
        <Button primary onClick={ButtonClickNewTask}>NEXT View</Button>
      </div>
    );
  };
  
  export default CompD_Task_d;