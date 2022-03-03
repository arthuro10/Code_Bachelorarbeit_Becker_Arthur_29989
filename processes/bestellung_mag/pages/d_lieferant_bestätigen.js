import React, { useState, useEffect } from "react";
import axios from "axios";
import {Divider, Grid, Input, Table, Segment, Responsive, Button, Icon, Form} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import uuid from "react-uuid";


import mainStore from '../../../react/js/store/mainStore'

import ownStore from '../store/bestellung_store'

import Form_Antrag from '../components/Form_Antrag'




const d_lieferant_bestätigen = () => {
  const _id = mainStore.getCurrentTaskId();
  const [information, setInformation] = useState({});
  const [sender, setSender] = useState("ArthurBecker10@gmx.de");
  const [receiver, setReceiver] = useState("ab-171729@hs-weingarten.de");
  const [text, setText] = useState("Sehr geehrte Damen und Herren, ");
  const [subject, setSubject] = useState("Sende Bestätigung für Ihre Lieferung");
  const [TableRowArticle, setTableRowArticle] = useState([]);
  const [loadedData, setLoadedData] = useState([]);

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
      getData();
      return () => {
        console.log("Clean up");
      }
    }, []);

    const handleSubjectChange = (event) => {
      event.preventDefault();
      setSubject(event.target.value);
    } 
    const handleTextChange = (event) => {
      event.preventDefault();
      setText(event.target.value);
    } 

    const handleSenderChange = (event) => {
      event.preventDefault();
      setSender(event.target.value);
    } 
    const handleReceiverChange = (event) => {
      event.preventDefault();
      setReceiver(event.target.value);
    } 

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

        const _data = stringData.data.data.getProcessDataFromPreviousTask[0];
          const parsedData = JSON.parse(_data);
          console.log(parsedData);
          parsedData.bestellung.forEach(bestellData => {
            tempArray.push(<Table.Row key={bestellData.maxPrice}  >
              <Table.Cell > { bestellData.name } </Table.Cell>
              <Table.Cell > { bestellData.price + " €" }  </Table.Cell>
              <Table.Cell>  {bestellData.amount}</Table.Cell>
            </Table.Row>)
          });

        setTableRowArticle(tempArray);
        setLoadedData(stringData.data.data.getProcessDataFromPreviousTask[0]);
  
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
      // Send Email
      const _queryEmail = ownStore.sendEmail(sender,receiver,text,subject);
      console.log(_queryEmail);
      try {
        const sendEmail = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _queryEmail
          }
        })
      } catch (error) {
        console.log("err sendEmail",error);
      }
      // set the new Task to active ... 
      const _queryUpdate = `mutation {updateActiveTask(idLastActive : "${_id}")}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _queryUpdate
          }
        })
        if(stringData.data.data.updateActiveTask) window.location.replace('/')
      }catch(err) {
        console.log("err updateActiveTask",err);
      }
    }

    

    return (
      <div style={zentriert}>
        <Segment color='black' style={Segmentzentriert}>
        <h1>Firma MAG</h1>
          <Segment>
          <h1>Bestätigung der Lieferung</h1>
          <Table celled >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Preis</Table.HeaderCell>
                    <Table.HeaderCell>Menge</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { TableRowArticle }
                </Table.Body>
              </Table>
          <Segment color='black'>
            <Form>
                <Form.Group widths='equal'>
                  <Form.Input fluid label='Sender' value={sender} onChange={handleSenderChange} />
                  <Form.Input fluid label='Receiver' value={receiver} onChange={handleReceiverChange} />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.TextArea label='Subject' placeholder='Thema XY' value={subject} onChange={handleSubjectChange} />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.TextArea label='Write your Email' placeholder='Sehr geehrte Damen und Herren, ' value={text} onChange={handleTextChange} />
                </Form.Group>
            </Form>
          </Segment>
            <Button primary onClick={ButtonClickNewTask}>Abschicken</Button>
          </Segment>
        
        </Segment>
      </div>
    );
  };
  
  export default d_lieferant_bestätigen;