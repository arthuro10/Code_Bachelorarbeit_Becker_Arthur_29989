import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/B_store'

import mainStore from '../../../react/js/store/mainStore'



const CompB_Task_b = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [about, setAbout] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [tableData, setTableData] = useState([]);

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
      }catch(err) {
        console.log("err",err);
      }
    }



    const handleButtonClick = () => {
      console.log("Load Data...");
      store.loadKunde();
      const kunde = store.kundenData;
      console.log("kunde");
      console.log(kunde);
      
      const newTableRow = kunde.loadKunde.map(item => {
        const obj = JSON.parse(item.processData);
        console.log(obj);
        return(
          <Table.Row key={item.id} >
            <Table.Cell>{obj.fistName}</Table.Cell>
            <Table.Cell>{obj.lastName}</Table.Cell>
            <Table.Cell>{obj.about}</Table.Cell>
          </Table.Row>
        )
        

      });
      console.log(newTableRow);
      setTableData(newTableRow);
      setIsValid(true);

    } 


    return (
      <div style={zentriert}>
        <h1>Task 2</h1>
        <h1>Kunden</h1>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>FirstName</Table.HeaderCell>
              <Table.HeaderCell>LastName</Table.HeaderCell>
              <Table.HeaderCell>About</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableData}
          </Table.Body>

        </Table>
             
              <Button primary onClick={handleButtonClick}>Load Data</Button>
              {
                  isValid === true ? <Link to="/"><Button primary onClick={ButtonClickNewTask} >NEXT View</Button></Link> : ""
              }
      </div>
    );
  };
  
  export default CompB_Task_b;


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