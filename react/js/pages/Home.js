import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Segment,Dimmer, Loader, Image, Grid, Responsive, Header, Icon, Statistic, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import mainStore from '../store/mainStore';

import AuthContext from '../store/authStore'
import Filter from '../components/Filter'
import Progress from '../components/semantic_ui/Progress'

const Home = ({ postId }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const userName = authCtx.name;
  const userRole = authCtx.role;

  const [loading,setLoading] = useState(true);
  const [buttons,setButtons] = useState([]);
  const [filter,setFilter] = useState("process");
  const [search,setSearch] = useState("");
  const [taskAnzahl,setTaskAnzahl] = useState(-1);
  const [currentTask,setCurrentTask] = useState([<h2>Choose your own Tasks</h2>]);

  let statisticColor = 'green'
  taskAnzahl <= 0 ? statisticColor = 'red' : statisticColor = 'green'
  

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

  const onClickButtonProcess = async (e, {id}) => {
    
    const _name = id;
    const _query = `{getProcessId(name: "${_name}")}`
    const _processId = await axios({
      url: 'http://localhost:3000/graphql',
      method: 'post',
      data: {
        query: _query
      }
    });
    const _parsedProcessId = _processId.data.data.getProcessId
    mainStore.setSelectedProcess(_name,_parsedProcessId);
    window.location.replace('/#/processes_overview');
  }
  const onClickButtonTask = (e, {id}) => {
    const taskArray = mainStore.getAllActiveTasksOfUser().map(task => {
      if(task.id === id){
        console.log("CHECK ||||");
        console.log(task);
        console.log(task.id);
        const parsedData = JSON.parse(task.pageData);
        const parsedOwner = JSON.parse(task.owner);
        return(
          <Card key={task.id} style={zentriert}>
            <Card.Content>
              <Card.Header>{parsedData.taskPage.toLowerCase().split('.').slice(0,-1).join('.')}</Card.Header>
              <Card.Meta>Identifier: {task.chain_identifier}</Card.Meta>
              <Card.Description>
                Created At: <strong>{task.created_at}</strong>
              </Card.Description>
              <Card.Description>
                Owner: <strong>{parsedOwner.owner[0]}</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                <Button key={task.id} id={task.id} inverted color='violet' onClick={setOnClickTask}>
                  Go to Task
                </Button>
              </div>
            </Card.Content>
          </Card>
        )
      }
    });

    setCurrentTask(taskArray);
  }

  const setOnClickTask = (e, {id}) => {
    console.log(id);
    let _roleSame = false;
    mainStore.getAllActiveTasksOfUser().forEach(task => {
      if(task.id === id){
        console.log("userRole");
                    console.log(userRole);
        const userRoles = JSON.parse(userRole)
        const parsedTaskRole = JSON.parse(task.roles)
        const parsedpageData = JSON.parse(task.pageData);
        
        userRoles.roles.forEach(roleUser => {
          console.log("roleUser");
          console.log(roleUser);
          console.log("parsedTaskRole");
          console.log(parsedTaskRole.roles);
         
            if(parsedTaskRole.roles === roleUser || roleUser.toLowerCase() === 'admin'){
              alert("SAME");
              _roleSame = true;
              mainStore.setCurrentTaskId(id);
              const path = `/#${parsedpageData.path}`
              console.log(path);
              window.location.replace(path);
            }

        });
        
        

      }
    });
    console.log("roleSame");
    console.log(_roleSame);
    if(!_roleSame) {
      alert('Sie haben nicht die passende Rolle');
      return;
    }
    
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
      const _btns = _processes.map(processName => {
        return(
          <Segment key={processName} color='violet'>
              <Button id={processName} secondary onClick={onClickButtonProcess}>
                {processName}
              </Button>

          </Segment>
          
        )
      });
      setButtons(_btns);
    }catch (error) {
      console.log("error loadProcesses");
      console.log(error);
    }
    
  }

  const loadActiveTasks = async () => {
    const _query = `{getAllActiveTasksOfUser(_userName : "${userName}"){pageData chain_identifier created_at owner id roles}}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })

      console.log("stringData getAllActiveTasksOfUser");
      console.log(stringData.data.data.getAllActiveTasksOfUser);
      if(stringData.data.errors !== undefined){
        if(stringData.data.errors.length > 0) {
        stringData.data.errors.forEach(err => {
          alert(err.message);
        });
        setTaskAnzahl(0)
        return;
      } 
      }
      const _tasks = stringData.data.data.getAllActiveTasksOfUser;
      mainStore.setAllActiveTasksOfUser(_tasks);
      setTaskAnzahl(_tasks.length)
    }catch (error) {
      console.log("error loadActiveTasks|||");
      console.log(error);
    }

  }

  const insertNewTasks = async () => {
    // Wenn neue Prozesse hinzugefügt werden ... werden deren Tasks in die DB hinzugefügt...
    const taskStrings = JSON.stringify(mainStore.allTasks);
    const _query = `mutation {setRolesToNewTasks(taskNames: ${taskStrings})}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })


    } catch (error) {
      console.log("error setRolesToNewTasks");
      console.log(error);
    }



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
      if(stringData.data.data.getTasksWithNoRoles.length > 0){
        if(userName !== 'Admin'){
          alert("There are tasks with no roles. Please contact the Admin, who can solve this problem.");
        }else{
          alert("There are tasks with no roles. As a Admin you can change that in the section \"Config\"");
        }
      }
      
    } catch (error) {
      console.log("error getTasksWithNoRoles");
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
        setLoading(false);

    
  }

  const loadUserToStore = async () => {
    const _query = `query {getAllUser {name role tasks id} }`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })

      mainStore.addIntoAllUser(stringData.data.data.getAllUser);

  } catch (error) {
    console.log("error loadUserToStore",error);
  }
}


    const handleChangeFilter = (e,{ value }) => {
      setFilter(value);
      console.log("Filter value");
      console.log(value);
    } 
    const handleOnChangeInput = (e,{ value }) => {
      setSearch(value);
      console.log("Search value");
      console.log(value);
    } 


    useEffect(() => {
      loadProcesses();
      loadActiveTasks();
      insertNewTasks();
      getTasksWithNoRoles();
      getTaskProcessConnection();
      loadUserToStore();

      return () => {
        console.log("Clean up");
        setCurrentTask([]);
      }
    }, []);


    const setProcessButtons = (_search) => {
      if(_search !== ''){
        console.log("Search String is ",_search);
        const _btns = mainStore.getAllProcesses().map(processName => {
          if(processName.search(_search) !== -1){
            return(
              <Segment key={processName} color='violet'>
                  <Button id={processName} secondary onClick={onClickButtonProcess}>
                    {processName}
                  </Button>
    
              </Segment>
              
            )
          }
          
        });
        setButtons(_btns);

      }else{
        console.log("Search String is empty");
        const _btns = mainStore.getAllProcesses().map(processName => {
          return(
            <Segment key={processName} color='violet'>
                <Button id={processName} secondary onClick={onClickButtonProcess}>
                  {processName}
                </Button>
  
            </Segment>
            
          )
        });
        setButtons(_btns);
      }
      
    }

    const setTaskButtons = (_search) => {
      if(_search !== ''){
        console.log("Search String is ",_search);
        if(mainStore.getAllActiveTasksOfUser() === null){
          alert("Keine Tasks!");
          setButtons([<h1>No Tasks...</h1>])
          return 
        }
        const _btns = mainStore.getAllActiveTasksOfUser().map( task => {
          console.log("task");
          console.log(task);
          const parsedTask = JSON.parse(task.pageData);
          const convertedTask = parsedTask.taskPage.toLowerCase().split('.').slice(0,-1).join('.')
          console.log(task);
          if(convertedTask.search(_search) !== -1){
            return(
              <Segment key={task.id} color='violet'>
                  <Button id={task.id} secondary onClick={onClickButtonTask}>
                    {convertedTask}
                  </Button>
    
              </Segment>
              
            )
          }
          
        });
        setButtons(_btns);

      }else{
        console.log("Search String is empty");
        if(mainStore.getAllActiveTasksOfUser() === null){
          alert("Keine Tasks!");
          setButtons([<h1>No Tasks...</h1>])
          return 
        }
        const _btns = mainStore.getAllActiveTasksOfUser().map(task => {
          console.log("task|||");
          console.log(task);
          const parsedTask = JSON.parse(task.pageData);
          const convertedTask = parsedTask.taskPage.toLowerCase().split('.').slice(0,-1).join('.')
          return(
            <Segment key={task.id} color='violet'>
                <Button id={task.id} secondary onClick={onClickButtonTask}>
                  {convertedTask}
                </Button>
  
            </Segment>
            
          )
        });
        setButtons(_btns);
      }
      
    }

    useEffect(() => {
      console.log("RUN UseEffect cause of filter");
      console.log(filter);
      if(filter === "process"){
        // load processes
        setProcessButtons(search)
      }else if(filter === "task"){
        // load tasks
        setTaskButtons(search);
      }
      
    }, [filter,search]);

    
      if(loading) return (
        <Segment style={Segmentzentriert} color='black'>
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Segment>
      )
        

    return (
      <div style={zentriert}>
        <Responsive as={Grid} minWidth={750}>
          <Grid celled>
          <Grid.Row>
            <Grid.Column width={9} verticalAlign={"middle"}>
            
              <Header as='h1'>
              <Icon name='dashboard' size='big' />
                Dashboard
              </Header>
            </Grid.Column>
            <Grid.Column width={4} verticalAlign={"middle"}>
              <Header as='h2'>
                <Icon name='tasks' size='large' />
                  {filter.toUpperCase()}
                </Header>
            </Grid.Column>
            <Grid.Column width={3} >
            <Statistic color={statisticColor}>
              <Statistic.Value >{taskAnzahl}</Statistic.Value>
              <Statistic.Label>Active Tasks</Statistic.Label>
            </Statistic>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={12} verticalAlign={"middle"}>
              <Segment color='black' style={Segmentzentriert} >
                {currentTask}
              </Segment>
            </Grid.Column>
            </Grid.Row>
            <Grid.Row >
            <Grid.Column width={4} >
            <Filter search={search} filter={filter} changeSearch={handleOnChangeInput} changeFilter={handleChangeFilter} />
            </Grid.Column>
            <Grid.Column width={12} >
            {buttons}
            </Grid.Column>
            </Grid.Row>
          </Grid>
        </Responsive>
          <Segment.Group>
          <Responsive as={Segment} maxWidth={749}>
            Bitte breites Fenster verwenden.
          </Responsive>
          </Segment.Group>
          
        
      </div>
    );
  };
  
  export default Home;





  /**
   * const Home = ({ postId }) => {
  const [routeA,setRouteA] = useState("");
  const [routeB,setRouteB] = useState("");
  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }

  const loadActiveTask1 = async () => {
    const _query = `query {getActiveTask {id pageData processInkrement}}`;
    try{
      const stringData = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
          query: _query
        }
      })
      console.log("JSON.parse(stringData)")
      console.log(stringData.data.data.getActiveTask)
      const data = stringData.data.data.getActiveTask;
      data.forEach(whichIsActive => {
        console.log("whichIsActive");
        console.log(whichIsActive.pageData);
        console.log(JSON.parse(whichIsActive.pageData));
      });
      const filt = data.filter( item => {
        const ele = JSON.parse(item.processInkrement);
        return ele.active === true;
      })
      console.log(filt);
      const pathA = JSON.parse(filt[0].pageData).path;
      const pathB = JSON.parse(filt[1].pageData).path;
      setRouteA(pathA);
      setRouteB(pathB);

    }catch (error) {
      console.log("error");
      console.log(error);
    }
    
  }

  const loadActiveTask2 = async () => {
    
  }

    useEffect(() => {
      loadActiveTask1();
      loadActiveTask2();
    }, []);



    return (
      <div style={zentriert}>
          <Link to={routeA}>
          <Button primary >Prozess 1</Button>
          </Link>
          <Link to={routeB}>
          <Button secondary >Prozess 2</Button>
          </Link>
        
      </div>
    );
  };
   */