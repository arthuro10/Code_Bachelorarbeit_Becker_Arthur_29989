import uuid from 'react-uuid'
import axios from "axios";

class ConfigStore {
    constructor() {
        
    }

    latestUserSet = {
        id: "",
        name: "",
        role: {},
        tasks: {}
    };
    latestTask = ""

    selectedProcess = ""

    latestTaskSetWithRoles = {
        name : "",
        role: {}
    }

    branchTableData = []
    combinationpredecessor = []

    allTasksFromSelectedProcess = [];

    setBranchTableData(_data) {
      this.branchTableData.push(_data);
    }
    getBranchTableData(_data) {
      return this.branchTableData;
    }
    resetBranchTableData() {
      this.branchTableData = [];
    }

    setAllTasksWithOrderFromSelectedProcess(_tasksWithOrder){
      this.allTasksFromSelectedProcess = _tasksWithOrder;
    }
    getAllTasksWithOrderFromSelectedProcess(){
      return this.allTasksFromSelectedProcess;
    }

    setSelectedProcess(_process){
      this.selectedProcess = _process;
    }

    getSelectedProcess(){
      return this.selectedProcess;
    }

    setUserSet(item) {
        this.latestUserSet = item;
    }
    setTaskSet(item) {
        this.latestTaskSetWithRoles = item;
    }
    setLatestTask(item) {
        this.latestTask = item;
    }
    getLatestTask() {
        return this.latestTask;
    }

    setUserRole(newRole) {
        this.latestUserSet.role = newRole;
    }

    getTaskSet(){
        return this.latestTaskSetWithRoles
    }
    showUserSet(){
        return this.latestUserSet
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

    UpdateTaskRole(_role) {
      
      const _query = `
      mutation {NewRoleForTask(taskName : "${this.latestTask}" role : "${_role}")}
      `
        axios({
            url: 'http://localhost:3000/graphql',
            method: 'post',
            data: {
              query: _query
            }
          }).then((result) => {
              console.log(result);
              alert("New role set");
              window.location.replace('/#/config')
            return result.data.data
          }).catch( err => {
              console.log("err in NewRoleForTask",err);
          });
    }
    UpdateTaskInitiate(initiateState) {
      const _query = `
      mutation {NewInitiateStateForTask(taskName : "${this.latestTask}" initiateState : "${initiateState}")}
      `
        axios({
            url: 'http://localhost:3000/graphql',
            method: 'post',
            data: {
              query: _query
            }
          }).then((result) => {
              console.log(result);
            return result.data.data
          }).catch( err => {
              console.log("err in NewRoleForTask",err);
          });
    }

   


 


}
 

const store = new ConfigStore();

    export default store;
