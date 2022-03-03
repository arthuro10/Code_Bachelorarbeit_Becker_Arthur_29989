import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Header, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import configStore from '../store/configStore'

const TaskConfig = () => {

    const [value,setValue] = useState("");
    const [valueTwo,setValueTwo] = useState("");
    const [task,setTask] = useState("");
    const [first,setFirst] = useState(false);

    const handleChange = (e, { value }) => {
      setValue(value);
      console.log(value);
     } 
    const handleChangeTwo = (e, { value }) => {
      setValueTwo(value);
      console.log(value);
     } 


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

    const radioBoxSegment = {
      marginLeft: "30%",
      marginRight: "30%",
  }

    const setTasks = async () => {
      const _task = configStore.getLatestTask();
      const _query = `{ isFirstTask(task : "${_task}") }`
      const isFirst = await axios({
        url:'http://localhost:3000/graphql',
        method:'post',
        data: {
          query : _query
        }
      });
      setFirst(isFirst.data.data.isFirstTask);
      setTask(_task);
    }

    useEffect(() => {
      setTasks();
    }, []);

    


    const SubmitUpdateTask = () => {
      if(value === ''){
        alert("Please select a role");
        return;
      }
      if(first && valueTwo === ''){
        alert("Please set Init");
        return;
      }
      configStore.UpdateTaskRole(value);
      configStore.UpdateTaskInitiate(valueTwo);
    }

    const onClickBack = () => {
      window.location.replace('/#/config');
    }


    return (
      <div style={zentriert}>
        <Segment style={Segmentzentriert}>
          <h1>Name: {task}</h1>
            <Segment color='black'>
              <Header>Rolle?</Header>
              <Segment color='black' textAlign={'left'} style={radioBoxSegment}>
                <Form.Group >
                  <Form.Radio
                    label='User'
                    value='user'
                    checked={value === 'user'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Supervisor'
                    value='supervisor'
                    checked={value === 'supervisor'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Chain_Admin'
                    value='chain_admin'
                    checked={value === 'chain_admin'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Admin'
                    value='admin'
                    checked={value === 'admin'}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Segment>
            </Segment>
            {
              first && <Segment color='black'>
                <h1>Initiate: {task}</h1>
                <Header>Müssen Tasks initiiert werden ...</Header>
                <Segment color='black' textAlign={'left'} style={radioBoxSegment}>
                  <Form.Group >
                    <Form.Radio
                      label='Supervisor+'
                      value='supervisor+'
                      checked={valueTwo === 'supervisor+'}
                      onChange={handleChangeTwo}
                    />
                    <Form.Radio
                      label='User'
                      value='user'
                      checked={valueTwo === 'user'}
                      onChange={handleChangeTwo}
                    />
                </Form.Group>
                </Segment>
              </Segment>
            }
            <Button secondary onClick={onClickBack} >Back!</Button>
            <Button secondary onClick={SubmitUpdateTask} >Bestätigen!</Button>
          </Segment>
      </div>
    );
};
  
  export default TaskConfig;