import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Header, Segment, Table, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import configStore from '../store/configStore'

const ProcessConfig = () => {

    const [value,setValue] = useState("");
    const [valueTwo,setValueTwo] = useState("");
    const [tasks,setTasks] = useState("");

    const options = [
      { key: 'none', text: 'none', value: 'none' },
      { key: 'or', text: 'or', value: 'or' },
      { key: 'and', text: 'and', value: 'and' },
    ]

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

    const loadTasks = async () => {
      const _process = configStore.getSelectedProcess();
      const _query = `{ getAllProcessTasks(process : "${_process}") {task order} }`
      const processData = await axios({
        url:'http://localhost:3000/graphql',
        method:'post',
        data: {
          query : _query
        }
      });

      // Funktioniert nur wenn es die Namen so her geben, anonsten über einen anderen Weg die Reihenfolge definieren. TODO()
      const _tasksAndOrder = processData.data.data.getAllProcessTasks.sort().reverse();

      // Einen Weg finden das Letzte Element an die erste Stelle zu positionieren und das erste am Ende. 
      // Dabei ist wichtig zu markieren welche Task als Start angesehen werden kann und welche Task das Ende markiert. 
      console.log("configStore.getBranchTableData()");
      console.log(configStore.getBranchTableData());

      
      
      const tempArr = _tasksAndOrder.map( taskAndOrder => {

        let predecessor = [];
        if(configStore.getBranchTableData() !== null || configStore.getBranchTableData().length > 0){
          configStore.getBranchTableData().forEach(branchData => {
            if(branchData.parent === taskAndOrder.task){
              const stringifiedBranchData = JSON.stringify(branchData.predecessor)
              if(stringifiedBranchData === '[]') return
              predecessor.push(branchData.predecessor);
            }
          });
        }
        let stringPredecessor = JSON.stringify(predecessor);

        if(stringPredecessor === '[]') stringPredecessor = '-'


        return(
          <Table.Row key={taskAndOrder.task} onClick={() => {
              configStore.setLatestTask(taskAndOrder.task);
              configStore.setAllTasksWithOrderFromSelectedProcess(_tasksAndOrder);
              window.location.replace('/#/branchconfig')
              }}>

            <Table.Cell>{taskAndOrder.task}</Table.Cell>
            <Table.Cell>{stringPredecessor}</Table.Cell>
          </Table.Row>
        )

      });
      setTasks(tempArr);

      
    }

    useEffect(() => {
      console.log('Process Config --> Use Effect');
      loadTasks();
    }, []);

    


    const SubmitUpdateTask = () => {
      
      configStore.UpdateTaskRole(value);
      configStore.UpdateTaskInitiate(valueTwo);
    }

    const onClickBack = () => {
      window.location.replace('/#/config');
    }

    const setpredecessor = async () => {
      const ChangedDataArray = configStore.getBranchTableData().map(data => {
        return {
          branchState : data.branchState,
          parent : data.parent,
          predecessor : data.predecessor,
        }
      })
      const sortedArray = [];
      ChangedDataArray.forEach(obj => {
        if(sortedArray.length === 0){
          sortedArray.push({
            parent : obj.parent,
            predecessor: [{
              branchState : obj.branchState,
              predecessor: obj.predecessor
            }]
          })
        }else{
          let isAlreadyInArray = false;
          sortedArray.forEach(sortedObj => {
            console.log(sortedObj);
            console.log(obj);
            console.log(sortedObj.parent);
            console.log(obj.parent);
            if(sortedObj.parent === obj.parent){
              sortedObj.predecessor.push({
                branchState : obj.branchState,
                predecessor: obj.predecessor
              })
              isAlreadyInArray = true;
            }
          });
          if(!isAlreadyInArray){
            sortedArray.push({
              parent : obj.parent,
              predecessor: [{
                branchState : obj.branchState,
                predecessor: obj.predecessor
              }]
            })
          }
        }
      });
      const stringifiedArray = JSON.stringify(sortedArray);
      const stringifiedArrayFinal = stringifiedArray.replaceAll("\"parent\"","parent").replaceAll("\"predecessor\"","predecessor").replaceAll("\"branchState\"","branchState")
      const _query = `mutation {setPredecessors(predecessorData: ${stringifiedArrayFinal})}`;
      console.log("_query");
      console.log(_query);
      try {
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })

        alert("Data sended");
        window.location.replace('/#/home');
        
      } catch (error) {
        console.log("error",error);
        alert("Failed sending data...");
      }
    }


    return (
      <div style={zentriert}>
        <Segment style={Segmentzentriert}>
          <h1>Set branches</h1>  
          <h2>Set the predecessor from each task. Starting with the last one</h2>  
                    <Table color='black'>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Taskname</Table.HeaderCell>
                            <Table.HeaderCell>Selected Predecessor</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {tasks}
                        </Table.Body>
                    </Table>
                    <Button secondary onClick={onClickBack} >Back!</Button>
                    <Button secondary onClick={setpredecessor} >Set</Button>
        </Segment>
                  
            </div>
    );
};
  
  export default ProcessConfig;