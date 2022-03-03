import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button, Table, Modal, Segment, Form, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import store from '../store/configStore'
import { stringify } from "uuid";

const Config_User = (props) => {
  const [users,setUsers] = useState([]);
  const [open,setOpen] = useState(false);
  const [value,setValue] = useState("");


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }


  const InnerSegment = {
    marginLeft: "5px",
    marginRight: "5px",
    textAlign : "center"
  }



  const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const loadUserTasks = async () => {
    const _query = `{getAllActiveTasks {pageData roles owner}}`;
    try {
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      console.log("JSON.parse(stringData)")
      console.log(stringData.data.data.getAllActiveTasks)
      if(!stringData.data.data.getAllActiveTasks){
        return([])
      }
      const filteredData = [];
      stringData.data.data.getAllActiveTasks.forEach(data => {
        const parsedOwner = JSON.parse(data.owner);
        const parsedPageData = JSON.parse(data.pageData);
        const parsedRoles = JSON.parse(data.roles);
        filteredData.push({
          owner: parsedOwner,
          roles: parsedRoles,
          pageData: parsedPageData
        });
      });
      return filteredData;
      
    } catch (error) {
      console.log("error loadUserTasks", error);
    }
  }

  const loadUsers = async () => {
    const _query = `query {getAllUser {name role tasks id} }`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      console.log("JSON.parse(stringData)")
      console.log(stringData.data.data.getAllUser)

      const _filteredActiveTasks = await loadUserTasks();
      console.log("_filteredActiveTasks");
      console.log(_filteredActiveTasks);
      
      const userRows = stringData.data.data.getAllUser.map(user => {

          let _role = JSON.parse(user.role);
          console.log("_role");
          console.log(_role);
          if(isObjectEmpty(_role) ){
            _role = ['none']
          }else{
            _role = _role.roles
          }
          let _tasks = []
          _filteredActiveTasks.forEach(obj => {
            obj.owner.owner.forEach(owner => {
              if(owner.toLowerCase() === user.name.toLowerCase()){
                const task = obj.pageData.taskPage.toLowerCase().split('.').slice(0,-1).join('.')
                _tasks.push(task);
              }
            });
          });
          const _stringifyTasks = JSON.stringify(_tasks);
          return(
                <Table.Row key={user.id} onClick={() => {
                    store.setUserSet({
                        id:user.id,
                        name:user.name,
                        role:_role,
                        tasks:user.tasks, 
                    })
                    window.location.replace('/#/userconfig')
                    
                    }}>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{_stringifyTasks}</Table.Cell>
                        <Table.Cell>{_role[0]}</Table.Cell>
                </Table.Row>

            
          )
        
      });
      setUsers(userRows);
      

    }catch (error) {
      console.log("error");
      console.log(error);
    }
    
  }


    useEffect(() => {
      loadUsers();
    }, []);

    const handleChange = (e,b) => {
        setValue(b.value);
        console.log(b.value);
       } 


    return (
        <div style={zentriert}>
          <Segment style={InnerSegment}>
            <Table celled fixed singleLine selectable color={'black'} >
                  <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Tasks</Table.HeaderCell>
                      <Table.HeaderCell>Roles</Table.HeaderCell>
                  </Table.Row>
                  </Table.Header>

                  <Table.Body>
                      {users}
                  </Table.Body>
              </Table>
            <Button secondary onClick={props.changeState}>Back</Button>
          </Segment>
            
        </div>
    );
  };
  
  export default Config_User;