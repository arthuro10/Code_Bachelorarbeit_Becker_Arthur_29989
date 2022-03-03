import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button, Table, Modal, Segment, Form, Header, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import configStore from '../store/configStore'
import mainStore from '../store/mainStore'

import Config_UserTable from '../components/Config_UserTable'
import Config_TaskTable from '../components/Config_TaskTable'
import Config_TaskWithRolesTable from '../components/Config_TaskTableWithRoles'
import Config_Branches from '../components/Config_Branches'

const Configuration = () => {
  //const [users,setUsers] = useState([]);
  //const [open,setOpen] = useState(false);
  //const [value,setValue] = useState("");
  const [userConfig,setUserConfigBoolean] = useState(false);
  const [branchConfig,setBranchConfigBoolean] = useState(false);
  const [taskRolesConfig,setTaskRolesConfigBoolean] = useState(false);
  const [taskConfig,setTaskConfigBoolean] = useState(false);


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
  const InnerSegment = {
    marginLeft: "5px",
    marginRight: "5px",
    textAlign : "center"
  }

  const loadProcesses = async () => {
    const _query = `query {getAllProcesses}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })

      console.log("stringData loadProcesses");
      console.log(stringData.data.data.getAllProcesses);
      const _processes = stringData.data.data.getAllProcesses;
      mainStore.setAllProcesses(_processes)
    }catch (error) {
      console.log("error loadProcesses");
      console.log(error);
    }
    
  }

  const getTaskProcessConnection = async () => {
        const _query = `{getAllTaskProcessConnections {task process}}`
        const dataBundle = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        });

        mainStore.addIntoTasksAndProcess(dataBundle.data.data.getAllTaskProcessConnections);
  }

  const getTasksWithNoRoles = async () => {
    const _query = `{getTasksWithNoRoles}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      mainStore.addIntoTasksWithNoRole(stringData.data.data.getTasksWithNoRoles);
    } catch (error) {
      console.log("error getTasksWithNoRoles");
      console.log(error);
    }

  }

  const resetData = () => {
    configStore.resetBranchTableData();
  }

  const setUserConfig = () => {
    setUserConfigBoolean(!userConfig)
  }
  const setBranchConfig = () => {
    setBranchConfigBoolean(!branchConfig);
  }
  const setRoleTaskConfig = () => {
    setTaskRolesConfigBoolean(!taskRolesConfig);
  }
  const setTasksConfig = () => {
    setTaskConfigBoolean(!taskConfig)
  }

  useEffect(() => {
    resetData();
    // Ist in Home und hier vertreten. Falls man sofort auf config startet, hat man auch gleich die notwendigen Daten. 
    // So muss man nicht erstmal auf Home um die Daten zu laden und dann wieder auf Config navigieren...
    loadProcesses();
    getTasksWithNoRoles();
    getTaskProcessConnection();
  }, []);

  if(userConfig){
    return(
      <Segment style={Segmentzentriert}>
        <h1 style={zentriert}>Configuration: User </h1>
        <Config_UserTable changeState={setUserConfig} />
      </Segment>
    )
  }
  if(branchConfig){
    return(
      <Segment style={Segmentzentriert} >
        <h1 style={zentriert}>Configuration: AND, OR or DIRECT </h1>
        <h2 style={zentriert}>Select a process </h2>
        <Config_Branches changeState={setBranchConfig} />
      </Segment>
    )
  }
  if(taskRolesConfig){
    return(
      <Segment style={Segmentzentriert}>
        <h1 style={zentriert}>Configuration: Tasks with no roles </h1>
        <Config_TaskTable changeState={setRoleTaskConfig} />
      </Segment>
    )
  }
  if(taskConfig){
    return(
      <Segment style={Segmentzentriert}>
        <h1 style={zentriert}>Configuration: Tasks with roles </h1>
        <Config_TaskWithRolesTable changeState={setTasksConfig} />
      </Segment>
    )
  }

  if(!userConfig && !branchConfig && !taskRolesConfig && !taskConfig){
    return (
      <div >
        <Segment style={Segmentzentriert}>
          <h1 style={zentriert}>Configuration</h1>
          <Segment style={InnerSegment} color='black'>
              <h1 style={zentriert}>User </h1>
              <Button secondary onClick={setUserConfig}>Config: User role</Button>
              <Divider></Divider>
              <h1 style={zentriert}>Branches: AND, OR or DIRECT </h1>
              <Button secondary onClick={setBranchConfig}>Config: branches</Button>
              <Divider></Divider>
              <h1 style={zentriert}>Tasks with no roles </h1>
              <Button secondary onClick={setRoleTaskConfig}>Config: set Roles for Tasks</Button>
              <Divider></Divider>
              <h1 style={zentriert}>Tasks with roles </h1>
              <Button secondary onClick={setTasksConfig}>Config: Tasks with roles</Button>
          </Segment>
        </Segment>
        
          
      </div>
  );

  }

    
  };
  
  export default Configuration;