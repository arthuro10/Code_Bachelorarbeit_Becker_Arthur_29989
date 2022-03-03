import uuid from 'react-uuid'
import axios from "axios";

class MainStore {
    constructor() {
        
    }

    selectedProcess = {
        name: "",
        id: ""
    };

    allTasks = [];
    tasksWithNoRole = [];
    tasksAndProcess = [];
    allUser = [];
    allProcesses = [];
    allActiveTasksOfUser = [];
    

    currentTaskId = "";

    setAllActiveTasksOfUser(_allActiveTasksOfUser) {
      this.allActiveTasksOfUser = _allActiveTasksOfUser
    }
    getAllActiveTasksOfUser() {
      return this.allActiveTasksOfUser;
    }
    setAllProcesses(_allProcesses) {
      this.allProcesses = _allProcesses;
    }
    getAllProcesses() {
      return this.allProcesses;
    }

    addIntoAllUser(_allUser) {
      this.allUser = _allUser;
    }
    addIntoAllTasks(taskName) {
      this.allTasks.push(taskName);
    }
    addIntoTasksWithNoRole(taskArr) {
      this.tasksWithNoRole = taskArr;
    }
    addIntoTasksAndProcess(data) {
      this.tasksAndProcess = data;
    }

    setCurrentTaskId(_id) {
      this.currentTaskId = _id;
    }
    getCurrentTaskId() {
      return this.currentTaskId;
    }

    setSelectedProcess(_name,_id) {
        this.selectedProcess.name = _name;
        this.selectedProcess.id = _id;
    }

    setUserRole(newRole) {
        this.latestUserSet.role = newRole;
    }

    getSelectedProcess(){
        return this.selectedProcess
    }

    UpdateUserSet() {
      const _role = JSON.stringify(this.latestUserSet.role);
      const newRole = _role.replace("\"roles\"","roles")
      const _query = `
      mutation {updateUsersRole(_user: { role : ${newRole} id: "${this.latestUserSet.id}" name : "${this.latestUserSet.name}" tasks : ${this.latestUserSet.tasks}})}
      `
      console.log(newRole);
      console.log(_role);
      console.log(_query);
        axios({
            url: 'http://localhost:3000/graphql',
            method: 'post',
            data: {
              query: _query
            }
          }).then((result) => {
            return result.data.data
          });
    }

   


 


}
 

const store = new MainStore();

    export default store;
