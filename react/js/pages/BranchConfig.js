import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Header, Segment, Table, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import configStore from '../store/configStore'
import uuid from 'react-uuid'

const BranchConfig = () => {

    const [value,setValue] = useState("");
    const [valueTwo,setValueTwo] = useState("");
    const [task,setTask] = useState("");
    const [tasks,setTasks] = useState("");
    //const [tableData,setTableData] = useState([]);
    const [predecessor,setpredecessor] = useState([]);
    const [firstTask,setFirstTask] = useState(false);
    const [disable,setDisabled] = useState(false);
    const [useOptions,setUseOptions] = useState([]);

    let predecessorCount = 0;
    //const useOptions = [];
    let _taskName = ''

    const options = [
      { key: 'direct', text: 'direct', value: 'direct' },
      { key: 'or', text: 'or', value: 'or' },
      { key: 'and', text: 'and', value: 'and' },
    ]
    const options2 = [
      { key: 'direct', text: 'direct', value: 'direct' },
    ]


    const handleChange = (e, { value }) => {
      setValue(value);
      console.log(value);
     } 

    const handleChangeOptions = (e, { value,id }) => {
      console.log("id");
      console.log(id);
      configStore.getBranchTableData().forEach(data => {
        console.log("data");
        console.log(data);
        console.log(data.dropdown1);
        if(data.dropdown1 === id){
          data.branchState = value
          if(value === 'direct'){
            setDisabled(true)
          }
        }
      });
      
     } 

    const handlepredecessorChange = (e, { value,id }) => {
      console.log("id");
      console.log(id);
      configStore.getBranchTableData().forEach(data => {
        console.log("data");
        console.log(data);
        console.log(data.dropdown2);
        if(data.dropdown2 === id){
          data.predecessor = value
        }
      });
      
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

    const loadTask = () => {
      const _task = configStore.getLatestTask();
      setTask(_task);
      const _allTasksWithOrder = configStore.getAllTasksWithOrderFromSelectedProcess();
      const tempPredecessor = [];
      let onlyDirect = false;
      let orderLatestTask = 0;
      _allTasksWithOrder.forEach(taskWithOrder => {
        if(taskWithOrder.task === _task) orderLatestTask = taskWithOrder.order 
      });
      // TODO entferne die Tasks die schon beim Vorgänger in einer Verbindung stehen.
      _allTasksWithOrder.forEach(taskWithOrder => {
        if(taskWithOrder.order > orderLatestTask) return
        let isInString = false;
        configStore.getBranchTableData().forEach(branchData => {
          const stringifiedBranchData = JSON.stringify(branchData.predecessor);
          const isInStringPair = stringifiedBranchData.search(taskWithOrder.task);
          console.log(taskWithOrder.task);
          console.log(stringifiedBranchData.search(taskWithOrder.task));
          if(isInStringPair !== -1 && branchData.branchState !== 'direct'){
            isInString = true;
            onlyDirect = true;
          } 
        });
        if(isInString) return;
        predecessorCount++;
        if(taskWithOrder.order === orderLatestTask) return;
        tempPredecessor.push({
          key: taskWithOrder.order, text: taskWithOrder.task, value: taskWithOrder.task 
       })
      });
      if(tempPredecessor.length === 0){
        setFirstTask(true);
      }
      const tempOptions = []
      predecessorCount === 1 || onlyDirect ? tempOptions.push(...options2) : tempOptions.push(...options);
      setUseOptions(tempOptions);
      setpredecessor(tempPredecessor)

      console.log(_allTasksWithOrder)


      const id = uuid();
      const dropdown1 = uuid();
      const dropdown2 = uuid();
      const dropdown3 = uuid();
      configStore.setBranchTableData({
        id: id,
        dropdown1: dropdown1,
        dropdown2: dropdown2,
        dropdown3: dropdown3,
        parent: _task,
        branchState : '',
        predecessor: []
      });

      


      const tempArr = [];
      tempArr.push(<Table.Row key={id}>
                        <Table.Cell><Dropdown id={dropdown1} placeholder='AND;OR;DIRECT' fluid  selection options={tempOptions}  onChange={handleChangeOptions} /></Table.Cell>
                        <Table.Cell><Dropdown id={dropdown2} placeholder='Predecessors' fluid multiple selection options={tempPredecessor}  onChange={handlepredecessorChange} /></Table.Cell>
                      </Table.Row>)
 
      
      setTasks(tempArr);
      if(tempPredecessor.length <= 2){
        console.log("WUSA");
        setDisabled(true);
      }
      

      
    }

    useEffect(() => {
      loadTask();
    }, []);


    const onClickBack = () => {
      window.location.replace('/#/processconfig')
    }

    


    const SubmitUpdateTask = () => {
      
      configStore.UpdateTaskRole(value);
      configStore.UpdateTaskInitiate(valueTwo);
    }
    const setData = () => {
      console.log("tableData");
      console.log(configStore.getBranchTableData());
      configStore.getBranchTableData().forEach(item => {
        configStore.combinationpredecessor.push(item.predecessor);
      });
      console.log("combinations");
      console.log(configStore.combinationpredecessor);
      // Array checks ... nicht das gleiche Inhalte verfügbar sind!
      // Wahrscheinlich die üblichen FOR Schleifen nötig! oder jedenfalls irgendwie mit Indexe arbeiten
      window.location.replace('/#/processconfig')
    }

    const addTableRow = () => {
      const tempArray = tasks.concat();
      const tempPredecessor = predecessor.concat();
      const tiedTasks = JSON.stringify(configStore.getBranchTableData()[configStore.getBranchTableData().length-1].predecessor)
      .replaceAll("\"","").replaceAll("[","").replaceAll("]","");
      console.log("configStore.getBranchTableData()");
      console.log(configStore.getBranchTableData());
      console.log(configStore.getBranchTableData()[configStore.getBranchTableData().length-1]);
      console.log("tiedTasks");
      console.log(tiedTasks);
      tempPredecessor.push({key: tiedTasks, text: tiedTasks , value: tiedTasks})

      const uniquePredecessor = tempPredecessor.filter((predecessor, index) => {
        const _predecessor = JSON.stringify(predecessor);
        //console.log("_predecessor");
        //console.log(_predecessor);
        return index === tempPredecessor.findIndex(obj => {
          //console.log("obj");
          //console.log(obj);
          return JSON.stringify(obj) === _predecessor
        })
      });

      const id = uuid();
      const dropdown1 = uuid();
      const dropdown2 = uuid();
      const dropdown3 = uuid();
      configStore.setBranchTableData({
        id: id,
        dropdown1: dropdown1,
        dropdown2: dropdown2,
        dropdown3: dropdown3,
        parent: configStore.getLatestTask(),
        branchState : '',
        predecessor: []
      });

      const newRow = <Table.Row key={id}>
          <Table.Cell><Dropdown id={dropdown1} placeholder='AND;OR;DIRECT' fluid  selection options={useOptions}  onChange={handleChangeOptions} /></Table.Cell>
          <Table.Cell><Dropdown id={dropdown2} placeholder='Predecessors' fluid multiple selection options={uniquePredecessor}  onChange={handlepredecessorChange} /></Table.Cell>
        </Table.Row>
      tempArray.push(newRow);
      setTasks(tempArray);
      setpredecessor(uniquePredecessor)
    }

    {
      if(firstTask){
        return(
            <div style={zentriert}>
              <h1>Start Task has no Predecessor!</h1>   
              <Button secondary onClick={onClickBack} >Back</Button>   
            </div>
        );
      }
      
      
    }


    return (
      <div style={zentriert}>
        <Segment style={Segmentzentriert}>
                  <h1>Set Predecessor for Task: {task}</h1>  
                  <Table color='black'>
                      <Table.Header>
                      <Table.Row>
                          <Table.HeaderCell>AND;OR;DIRECT</Table.HeaderCell>
                          <Table.HeaderCell>Predecessors</Table.HeaderCell>
                      </Table.Row>
                      </Table.Header>

                      <Table.Body>
                          {tasks}
                      </Table.Body>
                  </Table>
                    <Button color='violet' disabled={disable} onClick={addTableRow} >additional</Button>
                  <Segment >
                  <Link to='/processconfig'>
                    <Button secondary onClick={onClickBack} >Back</Button>
                    </Link>
                    <Button secondary onClick={setData} >Set</Button>
                  </Segment>
        </Segment> 
            </div>
    );
};
  
  export default BranchConfig;