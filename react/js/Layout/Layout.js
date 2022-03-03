import React, { useState, useEffect, useContext } from "react"
import { HashRouter, Route, Redirect } from 'react-router-dom';
import AuthContext from '../store/authStore'

import mainStore from "../store/mainStore"

// pages
import NavigationBar from "../components/NavigationBar";
import Start from "../pages/Start_Page";
import Configuration from "../pages/Configuration";
import UserConfig from "../pages/UserConfig";
import TaskConfig from "../pages/TaskConfig";
import ProcessConfig from "../pages/ProcessConfig";
import BranchConfig from "../pages/BranchConfig";
import Home from "../pages/Home";
import Processes_Overview from "../pages/Processes_Overview";
import SignUp from "../pages/account_components/SignUp";
// Alle Prozess_Pages werden geladen
import Pages from '../../../processes/react_all_pages/manuell_allPages'


 const Layout = () => {
    const [newRoutes, setNewRoutes] = useState([]);
    const authCtx = useContext(AuthContext);
    const userName = authCtx.name;
    const isLoggedIn = authCtx.isLoggedIn;

    const setRoutesWithModules =  () => {
        setNewRoutes(Pages);
        Pages.forEach(page => {
            mainStore.addIntoAllTasks(page.default.name.toLowerCase());
        })
    }

    const containerStyle = { 
        marginTop: "5px"
    };

    useEffect(() => {
        setRoutesWithModules();
      }, []);

      const dynamicallyLoadedRoutes = newRoutes.map(modules => {
        console.log("modules");
        console.log(modules);
        let path = "/" + modules.default.name.toLowerCase();
        console.log("path");
        console.log(path);
        return(<Route key={path} exact path={path} component={modules.default}/>);
        });

        return (
            <HashRouter>
                <div>
                    <NavigationBar location={location}/>
                    <div class="container" style={containerStyle}>
                        <div class="row">
                            <div class="col-xs-12">
                            <Route exact path="/" component={Start}/>
                            <Route exact path="/signup" component={SignUp}/>
                            {
                                (userName === 'Admin') &&
                                (<Route exact path="/config" component={Configuration}/>) 
                            }
                            {
                                (userName === 'Admin') &&
                                (<Route exact path="/userconfig" component={UserConfig}/>)
                            }
                            {
                                (userName === 'Admin') &&
                                (<Route exact path="/taskconfig" component={TaskConfig}/>)
                            }
                            {
                                (userName === 'Admin') &&
                                (<Route exact path="/processconfig" component={ProcessConfig}/>)
                            }
                            {
                                (userName === 'Admin') &&
                                (<Route exact path="/branchconfig" component={BranchConfig}/>)
                            }
                            {
                                isLoggedIn && (
                                    <Route exact path="/home" component={Home}/>
                                )
                            }
                            {
                                isLoggedIn && (
                                    <Route exact path="/processes_overview" component={Processes_Overview}/>
                                )
                            }
                            {
                                isLoggedIn &&
                                dynamicallyLoadedRoutes
                            }
                            {console.log("dynamicallyLoadedRoutes")}
                            {console.log(dynamicallyLoadedRoutes)}
                            </div>
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
}

export default Layout;