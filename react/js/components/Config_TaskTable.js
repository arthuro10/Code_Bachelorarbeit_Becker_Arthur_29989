  import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button, Table, Modal, Segment, Form, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import mainStore from '../store/mainStore'
import configStore from '../store/configStore'

const Config_TaskTable = (props) => {
  const [users,setUsers] = useState([]);
  const [tasks,setTasks] = useState([]);
  const [open,setOpen] = useState(false);
  const [value,setValue] = useState("");


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }


  const loadTasks = () => {


      //create Array
      const taskArr = mainStore.tasksWithNoRole.map( task => {
        let process = "";
        mainStore.tasksAndProcess.forEach(processTaskObj => {
          if(processTaskObj.task === task) process = processTaskObj.process;
        });
        return(
          <Table.Row key={task} onClick={() => {
              configStore.setLatestTask(task)
              window.location.replace('/#/taskconfig')
              }}>
                  <Table.Cell>{task}</Table.Cell>
                  <Table.Cell>{process}</Table.Cell>
          </Table.Row>
        )    
      });
      setTasks(taskArr)
   
    
  }


    useEffect(() => {
      loadTasks();
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
                    <Table.HeaderCell>Taskname</Table.HeaderCell>
                    <Table.HeaderCell>Process</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    {tasks}
                </Table.Body>
            </Table>
            <Button secondary onClick={props.changeState}>Back</Button>
        </div>
    );
  };
  
  export default Config_TaskTable;
