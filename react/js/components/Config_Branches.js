import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button, Table, Modal, Segment, Form, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import mainStore from '../store/mainStore'
import configStore from '../store/configStore'

const Config_Branches = (props) => {
  const [users,setUsers] = useState([]);
  const [processes,setProcesses] = useState([]);
  const [open,setOpen] = useState(false);
  const [value,setValue] = useState("");


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }


  const loadProcesses = () => {

      //create Array
      const processArr = mainStore.getAllProcesses().map( process => {
        console.log("process");
        console.log(process);
        return(
          <Table.Row key={process} onClick={() => {
              configStore.setSelectedProcess(process)
              window.location.replace('/#/processconfig')
              }}>
                  <Table.Cell>{process}</Table.Cell>
          </Table.Row>
        )    
      });
      setProcesses(processArr)
   
    
  }


    useEffect(() => {
      loadProcesses();
    }, []);

    const handleChange = (e,b) => {
        setValue(b.value);
        console.log(b.value);
       } 


    return (
        <div style={zentriert}>
            <Table celled fixed singleLine selectable color={'black'}>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Process</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    {processes}
                </Table.Body>
            </Table>
            <Button secondary onClick={props.changeState}>Back</Button>
        </div>
    );
  };
  
  export default Config_Branches;