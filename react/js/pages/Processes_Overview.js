import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Divider, Table, Dropdown, Segment, Header, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import mainStore from '../store/mainStore'
import uuid from 'react-uuid'
import AuthContext from '../store/authStore'

const Processes_Overview = ({ postId }) => {
  const authCtx = useContext(AuthContext);
  const userRole = authCtx.role;
  const userName = authCtx.name

  const [processData,setProcessData] = useState({});
  const [activeTasks,setActiveTasks] = useState([]);
  const [title,setTitle] = useState("");
  const [init,setInit] = useState("");
  const [open,setOpen] = useState(false);
  const [tasks,setTasks] = useState([]);
  const [loading,setLoading] = useState(true);
  const [newChain,setNewChain] = useState(false);
  const [disabled,setDisabled] = useState(false);

  const [ownerWithTasks,setOwnerWithTasks] = useState([]);

  const roleOption = [
    {key:"user",text:"user",value:"user"},
    {key:"supervisor",text:"supervisor",value:"supervisor"},
    {key:"chain_admin",text:"chain_admin",value:"chain_admin"},
    {key:"admin",text:"admin",value:"admin"},
  ]


  //const ownerWithTasks = [];

  let _processNameData = {};

  let tasksIdWithData = [];

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
    marginLeft: "7px",
    marginRight: "7px",
    textAlign : "center"
  }
  const headerColor = {
    color: "red"
  }

  const setOnClickTask = (e, {id}) => {
    console.log(id);
    console.log(tasksIdWithData);
    let _roleSame = false;
    tasksIdWithData.forEach(task => {
      if(task.id === id){
        console.log("userRole");
                    console.log(userRole);
        const userRoles = JSON.parse(userRole)

        
        userRoles.roles.forEach(roleUser => {
          console.log("roleUser");
          console.log(roleUser);
          console.log("task.roles");
          console.log(task.roles);
            if(task.roles === roleUser || roleUser.toLowerCase() === 'admin'){
              if(task.owner.length > 0){
                task.owner.forEach(_owner => {
                  if(_owner.toLowerCase() === userName.toLowerCase()){
                      alert("SAME");
                    _roleSame = true;
                    mainStore.setCurrentTaskId(id);
                    const path = `/#${task.path}`
                    console.log(path);
                    window.location.replace(path);
                  }
                });
              }else{
                alert("SAME");
                _roleSame = true;
                mainStore.setCurrentTaskId(id);
                const path = `/#${task.path}`
                console.log(path);
                window.location.replace(path);
              }
              
            }

        });
        
      }
    });
    console.log("roleSame");
    console.log(_roleSame);
    if(!_roleSame) {
      alert('You have no access with that role');
      return;
    }
    
  }

  const loadStuff =  () => {
    const _processData = mainStore.getSelectedProcess();
    _processNameData = _processData;
    setProcessData(_processData);
    setTitle(_processData.name);
    setLoading(false);
  }
  const loadActiveTasks = async () => {
    console.log(_processNameData);
    console.log(userRole);
    console.log(JSON.parse(userRole));
    const userRoles = JSON.parse(userRole).roles[0];
    console.log(userRoles);

    const _query = `{getActiveTasks(processId : "${_processNameData.id}" user : "${userName}" role : "${userRoles}") {id pageData
                    chain_identifier roles owner created_at}}`
    /*const _query = `{getActiveTasks(processId : "cc58e88d-8cfa-4e1f-acd8-49c264175504") {id pageData
                    chain_identifier roles}}`*/
    try {
      const _activeTasks = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      });

      if(_activeTasks.data.errors !== undefined){
        if(_activeTasks.data.errors.length > 0) {
        _activeTasks.data.errors.forEach(err => {
          alert(err.message);
        });
        return;
      } 
      }
      
      console.log(_activeTasks.data.data)
      if(_activeTasks.data.data.getActiveTasks === null){
        console.log("GET ACTIVE TASK NULL");
        return;
      }
      console.log("_activeTasks");
      console.log(_activeTasks.data.data.getActiveTasks);
      const activeTasksArr = _activeTasks.data.data.getActiveTasks;
      const tempArr = activeTasksArr.map( data => {
        const parsedOwner = JSON.parse(data.owner);
        const parsedRoleData = JSON.parse(data.roles);
        const parsedPageData = JSON.parse(data.pageData);
        tasksIdWithData.push({
          id: data.id,
          roles: parsedRoleData.roles,
          owner: parsedOwner.owner,
          path: parsedPageData.path
        })
        return(
            <Card  key={data.id}>
              <Card.Content>
                <Card.Header>{parsedPageData.taskPage.toLowerCase().split('.').slice(0,-1).join('.')}</Card.Header>
                <Card.Meta>Identifier: {data.chain_identifier}</Card.Meta>
                <Card.Description>
                  Owner: <strong>{parsedOwner.owner}</strong>
                </Card.Description>
                <Card.Description>
                  Role: <strong>{parsedRoleData.roles}</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button key={data.id} id={data.id} inverted color='violet' onClick={setOnClickTask}>
                    Go to Task
                  </Button>
                </div>
              </Card.Content>
            </Card>
        )
      });
      setActiveTasks(tempArr);
      
      
    } catch (error) {
      console.log("error",error);
    }
    
  }

  const isBranchSet = async () => {
    if(mainStore.getSelectedProcess().name === "") return;
    const _query = `query { getBranchSetState(processName : "${mainStore.getSelectedProcess().name}")}`
    console.log(_query);
    try {
      const booleanData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      });
      const branchState = booleanData.data.data.getBranchSetState;
      if(!branchState){
        alert("Combinations like AND, OR are not set. Please navigate to Config and set the Branches of the process");
        setDisabled(true);
      }

    } catch (error) {
        console.log("error in isBranchSet",error);
    }
  }

  const whichInitiateState = async () => {
    console.log("mainStore.getSelectedProcess().name");
    console.log(mainStore.getSelectedProcess().name);
    const _query = `query { getInitiateState(processName : "${mainStore.getSelectedProcess().name}")}`
    try {
      const _initiateState = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      });
      const initiateState = _initiateState.data.data.getInitiateState;
      console.log("initiateState");
      console.log(initiateState);
      setInit(initiateState);
      
    } catch (error) {
      console.log("error",error);
      return "error";
    }
  }
  const createProcessChain = async (_ownerWithTasks,type) => {
    
    const ownerWithTaskString = JSON.stringify(_ownerWithTasks);
    console.log(ownerWithTaskString);
    const ownerWithTaskFormatted = ownerWithTaskString.replaceAll("\"owner\"","owner").replaceAll("\"task\"","task")
    console.log("ownerWithTaskFormatted");
    console.log(ownerWithTaskFormatted);
    const _query = `mutation {createNewProcessChain(processId : "${processData.id}" ownerWithTasks: ${ownerWithTaskFormatted} type: "${type}")}`;
    console.log(_query);
    try {
      const _createNewChain = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      });
      console.log(_createNewChain.data.data);
      console.log(_createNewChain.data.data.createNewProcessChain);
      _createNewChain.data.data.createNewProcessChain === "0" ? alert("Failed") : alert("Created Chain");
      window.location.replace('/')
    } catch (error) {
      console.log("error",error);
    }
  }

  const onClickNewChain = async () => {
    //const state = await whichInitiateState();
    const state = init;
    if(state === 'user'){
      const newChain = await createProcessChain([{owner : [userName], task : 'all'}],'user');
    }else if(state === 'supervisor+'){

      const _role = JSON.parse(userRole);
      let _isUser = false;
      _role.roles.forEach(role => {
        if(role.toLowerCase() === 'user' || role.toLowerCase() === 'supervisor'){
          alert('Nicht die passende Rolle. Chain_admin oder Admin können hierauf zugreifen.');
          _isUser = true;
        }
      });
      if(_isUser) return;
      setOpen(true);
    }else{
      if(mainStore.getSelectedProcess().name === ''){
        alert("You have to select a process. \nredirecting to Home");
        window.location.replace('/');
        return;
      }
      alert("Init must be set. Please contact the Admin");
    }

    console.log(state);

    console.log("processData");
    console.log(processData.id);
    
  }

  const onClickBack = () => {
    setOpen(false);
  }

  const onClickCreateNewChain = async () => {
    console.log(ownerWithTasks);
    /*if(ownerWithTasks.length <= 0){
      alert("Bitte Owner hinzufügen");
      return;
    }*/
    const newChain = await createProcessChain(ownerWithTasks,'supervisor+');
    setOpen(false)

  }
  const handleChange = (e,current) => {
    let _arr = ownerWithTasks; 
    if(ownerWithTasks.length > 0){
      const alreadyInArray = _arr.filter( _ownerAndTask => {
          return (_ownerAndTask.task === current.id)
      });

      if(alreadyInArray.length <= 0){
        _arr.push({
          owner: current.value,
          task: current.id
        })
      }else{
        _arr.forEach( _ownerAndTask => {
          if(_ownerAndTask.task === current.id){
            _ownerAndTask.owner = current.value;
          }
      });

      }
    }else{
      _arr.push({
        owner: current.value,
        task: current.id
      })
    }
    setOwnerWithTasks(_arr);
  }


  const loadTasks = async () => {
    // Nicht unbedingt alle Tasks holen. Lieber mit process filtern und nur die Tasks die nötig sind holen.
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

      const _tasks = [];
      mainStore.tasksAndProcess.forEach(processTaskObj => {
        //console.log(processTaskObj);
        //console.log(processTaskObj.process);
        //console.log(mainStore.getSelectedProcess().name);
        if(processTaskObj.process === mainStore.getSelectedProcess().name) {
          _tasks.push(processTaskObj.task);
        }
      });
      const userArray = mainStore.allUser.map( user => {
        //console.log("user");
        //console.log(user);
        return({
          key: user.name.toLowerCase(),
          text: user.name,
          value: user.name.toLowerCase(),
          role: JSON.parse(user.role)
        })
      });
      const taskArr = _tasks.sort().map( task => {
        // Bei der Iteration soll die Filterung durchgeführt werden
        console.log("getAllTasks");
        console.log(stringData.data.data.getAllTasks);
        const _user = [];
        const _role = [];
        stringData.data.data.getAllTasks.forEach( UserTasks => {
          let _match = false;
          if(UserTasks.name.toLowerCase() === task.toLowerCase() && !_match){
            _match = true;
            const parsedRole = JSON.parse(UserTasks.role);
            userArray.forEach(u => {
              if(u.role.roles[0] === parsedRole.role){
                _user.push(u);
              }
            });
            roleOption.forEach(r => {
              //console.log(r.value)
              //console.log(parsedRole.role);
              if(parsedRole.role === r.value){
                _role.push(r);
              }
            });
              
          }
          
        })

        return(
          <Table.Row key={task} >
                  <Table.Cell>{task}</Table.Cell>
                  <Table.Cell><Dropdown id={task} placeholder='User' fluid multiple selection options={_user}  onChange={handleChange} /></Table.Cell>
          </Table.Row>
        )   
      });
      setTasks(taskArr)


    }catch(error){
      console.log("error in loadTasks",error);
    }

}

    useEffect(() => {
      loadStuff();
      loadActiveTasks();
      loadTasks();
      whichInitiateState();
      isBranchSet();
      
    }, []);


    useEffect(() => {
      // Soll nur dann geladen werden, wenn eine neue Chain erstellt wurde
      loadActiveTasks();
      
    }, [newChain]);


    {if(loading)
        return (
            <div style={zentriert}>
                  <h1>Process Overview</h1>  
            </div>
          )
    }

    {if(open)
        return (
            <div style={zentriert}>
              <Segment style={Segmentzentriert}>
                  <h1>Initiate Tasks</h1>  
                    <Segment  color='black'>
                      <Header as='h2' color='red'>
                        Attention!
                       </Header>
                       <Divider></Divider>
                      <h3>If no User is selected, the role of the task will be used</h3>  
                    </Segment>
                  <Table color='black' >
                      <Table.Header>
                      <Table.Row>
                          <Table.HeaderCell>Taskname</Table.HeaderCell>
                          <Table.HeaderCell>Select User</Table.HeaderCell>
                      </Table.Row>
                      </Table.Header>

                      <Table.Body>
                          {tasks}
                      </Table.Body>
                  </Table>
                  <Button secondary onClick={onClickBack}>Back</Button>
                  <Button secondary onClick={onClickCreateNewChain}>Create new Chain</Button>
                  </Segment>
            </div>
          )
    }
    

    return (
      <div style={zentriert}>
        <Segment style={Segmentzentriert}>
            <h1>Process Overview: {title}</h1>
            <br/>
            <Segment color='black' style={zentriert}>
              <h2>Active Tasks</h2>
              <h3>Init State: {init}</h3>
              <Card.Group textAlign={'center'} itemsPerRow={3}>
                {activeTasks}
              </Card.Group>
            </Segment> 
            <Divider></Divider>
            <br/>
            <Segment  color='black'>
              <h2>Create new Chain</h2>
              <Button disabled={disabled} secondary onClick={onClickNewChain}>Create new Chain</Button>
            </Segment>
        </Segment>
      </div>
    );


  };
  
  export default Processes_Overview;



  /**
   * const handleChange = (e,current) => {
    console.log(current);
    console.log(current.value);
    if(ownerWithTasks.length > 0){
      const alreadyInArray = ownerWithTasks.filter( ownerAndTask => {
          return (ownerAndTask.task === current.id)
      });
      console.log(alreadyInArray);
      if(alreadyInArray.length <= 0){
        ownerWithTasks.push({
          owner: current.value,
          task: current.id
        })
      }else{
        ownerWithTasks.forEach( ownerAndTask => {
          if(ownerAndTask.task === current.id){
            ownerAndTask.owner = current.value;
          }
      });

      }
    }else{
      ownerWithTasks.push({
        owner: current.value,
        task: current.id
      })
    }
    console.log(ownerWithTasks);
  }
   */