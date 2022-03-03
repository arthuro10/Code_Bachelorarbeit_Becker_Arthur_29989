import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button, Table, Modal, Segment, Form, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import mainStore from '../store/mainStore'
import store from '../store/configStore'

const TaskWithRolesConfiguration = (props) => {
  const [tasks,setTasks] = useState([]);
  const [open,setOpen] = useState(false);
  const [value,setValue] = useState("");


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }



  const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const loadTasks = async () => {
    const _query = `{getAllTasks {name role}}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      console.log("JSON.parse(stringData)")
      console.log(stringData.data.data.getAllTasks)
      
      const taskRows = stringData.data.data.getAllTasks.map(task => {

          let process = "";
          mainStore.tasksAndProcess.forEach(processTaskObj => {
            if(processTaskObj.task === task.name) process = processTaskObj.process;
          });

          let _role = JSON.parse(task.role);
          console.log("_role");
          console.log(_role);
          _role = _role.role

          return(
                <Table.Row key={task.name} onClick={() => {
                    store.setLatestTask(task.name)
                    window.location.replace('/#/taskconfig')
                    
                    }}>
                        <Table.Cell>{task.name}</Table.Cell>
                        <Table.Cell>{_role}</Table.Cell>
                        <Table.Cell>{process}</Table.Cell>
                </Table.Row>

            
          )
        
      });
      setTasks(taskRows);
      

    }catch (error) {
      console.log("error");
      console.log(error);
    }
    
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
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Roles</Table.HeaderCell>
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
  
  export default TaskWithRolesConfiguration;