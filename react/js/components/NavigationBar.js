import React, { useState, useContext } from 'react'
import { Menu, Header } from 'semantic-ui-react'
import { Link } from "react-router-dom";

import AuthContext from '../store/authStore'


 const NavigationBar = () => {
    const [activeItem, setActiveItem] = useState('');
    const authCtx = useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;
    const userName = authCtx.name;

    // isLoggedIn nutzen für die Anzeige der Menu ...


    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
      }
    
    const handleLogout = () => {
        authCtx.logout();
        
      }




        let UserMenu;
        //console.log(localStorage.Username !== undefined);
        if(isLoggedIn){
          UserMenu =  
                        <Menu.Item
                          name= {userName + " is logged in"}
                          icon='user'>                        
                        </Menu.Item>
                      
        }else{
          UserMenu = ""
        }

        return (
            <Menu pointing  className={"myNavBar"}>
            <Menu.Item >                    
            <Header>   Bachelorarbeit  </Header>                    
            </Menu.Item>
            <Menu.Item></Menu.Item>
            <Menu.Item></Menu.Item>
            {
              (userName === 'Admin') && (
              <Menu.Item
                as={Link} to='/config' 
                name='Config'
                active={activeItem === '/config'}
                onClick={handleItemClick}
                icon='cogs'>                        
              </Menu.Item>
              )
            }
            {
              (userName !== 'Admin') && (
              <Menu.Item
                as={Link} to='/' 
                name='Start'
                active={activeItem === '/'}
                onClick={handleItemClick}
                icon='group'>                        
              </Menu.Item>
              )
            }
            
            <Menu.Item></Menu.Item>
            <Menu.Item></Menu.Item>
            {
              isLoggedIn && (
              <Menu.Item
                as={Link} to='/home' 
                name='Home'
                active={activeItem === '/home'}
                onClick={handleItemClick}
                icon='star'>                        
              </Menu.Item>
              )
            }
            
            <Menu.Item></Menu.Item>
            <Menu.Item></Menu.Item>
            {
              UserMenu
            }
            <Menu.Item></Menu.Item>
            <Menu.Item></Menu.Item>
            {
              isLoggedIn &&
              (<Menu.Item
              name='Logout'
              active={activeItem === 'Logout'}
              onClick={handleLogout}
              icon='sign out alternate'>                        
            </Menu.Item>)
            }
            
            
            
          </Menu>
        );
}

export default NavigationBar;
