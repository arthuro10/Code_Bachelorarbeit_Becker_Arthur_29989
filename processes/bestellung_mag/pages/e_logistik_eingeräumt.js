import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import {Divider, Grid, Input, Table, Segment, Responsive, Button, Icon, Checkbox} from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/bestellung_store'

import mainStore from '../../../react/js/store/mainStore'

import Form_Antrag from '../components/Form_Antrag'




const e_logistik_eingeräumt = () => {
  const _id = mainStore.getCurrentTaskId();
  const [TableRowArticle, setTableRowArticle] = useState([]);
  const [loadedData, setLoadedData] = useState([]);

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
        console.log("stringData.data.data.getProcessDataFromPreviousTask");
        console.log(stringData.data.data.getProcessDataFromPreviousTask);
        
        const tempArray = [];
        stringData.data.data.getProcessDataFromPreviousTask.forEach(data => {
          const parsedData = JSON.parse(data);
          console.log(parsedData);
          parsedData.bestellung.forEach(bestellData => {
            tempArray.push(<Table.Row key={bestellData.maxPrice}  >
              <Table.Cell > { bestellData.name } </Table.Cell>
              <Table.Cell>  {bestellData.amount}</Table.Cell>
              <Table.Cell> <Checkbox label='finished?' /></Table.Cell>
            </Table.Row>)
          });
          
        });
        setTableRowArticle(tempArray);
        setLoadedData(stringData.data.data.getProcessDataFromPreviousTask);

        console.log(stringData.data.data.getProcessData);
      }catch(err) {
        console.log("err",err);
      }
    }

    const ButtonClickNewTask = async () => {

      const parsedData = JSON.parse(loadedData);
      const stringifiedBestellung = JSON.stringify(parsedData.bestellung).replaceAll("\"name\"","name").replaceAll("\"amount\"","amount")
      .replaceAll("\"price\"","price")
  
      const _query1 = `mutation {setbestellData(bestellung: ${stringifiedBestellung} maxPrice: ${parsedData.maxPrice} id: "${_id}")}`;
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
        <h1>Logisitk</h1>
        <h2>Einlagerung der Bestellung bestätigen</h2>
        <Segment color='black'>
          <h3>Einlagerung der folgenden Produkte</h3>
          <Table singleLine color='brown'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Menge</Table.HeaderCell>
                      <Table.HeaderCell>Check</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { TableRowArticle }
                  </Table.Body>
                </Table>
        </Segment>
        <Button primary onClick={ButtonClickNewTask}>Eingelagert!</Button>
      </div>
    );
  };
  
  export default e_logistik_eingeräumt;