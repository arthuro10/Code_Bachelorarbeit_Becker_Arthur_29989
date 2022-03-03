import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Header, Segment,Card, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import store from '../store/configStore'

const UserConfig = () => {

    const [value,setValue] = useState("");

    const handleChange = (e, { value }) => {
      setValue(value);
      console.log(value);
     } 

    


    const zentriert = {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign : "center"
    }
    const radioBoxSegment = {
        marginLeft: "30%",
        marginRight: "30%",
    }
    const CardStyle = {
        marginLeft: "auto",
        marginRight: "auto",
        textAlign : "center",
        width: "220px",
        height: "330px"
    }

    const userData = store.showUserSet();

    const SubmitUpdateUser = () => {
      if(value === ''){
        alert("Please select a role!");
        return;
      }
      const _roles = [];
      _roles.push(value);
      store.setUserRole({
        roles: _roles
      });
      store.UpdateUserSet();
      alert(`${value} has been set`);
      window.location.replace('/#/');
    }
    const onClickBack = () => {
      window.location.replace('/#/config');
    }


    return (
      <div style={zentriert}>
        <Segment>
          <Segment style={zentriert} color='black'>
            <Card style={CardStyle} >
              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
              <Card.Content>
                <Card.Header>{userData.name}</Card.Header>
                <Card.Description>
                Role: {userData.role}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name='cog' />
                  Tasks: {userData.tasks}
                </a>
              </Card.Content>
            </Card>
          </Segment>
          <Segment color='black'  >
            <Header>Rolle?</Header>
              <Segment color='black' textAlign={'left'} style={radioBoxSegment}>
                <Form.Group grouped>
                  <Form.Radio
                    label='User'
                    value='user'
                    checked={value === 'user'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Supervisor'
                    value='supervisor'
                    checked={value === 'supervisor'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Chain_Admin'
                    value='chain_admin'
                    checked={value === 'chain_admin'}
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='Admin'
                    value='admin'
                    checked={value === 'admin'}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Segment>
            </Segment>
            <Button secondary onClick={onClickBack} >Back!</Button>
            <Button secondary onClick={SubmitUpdateUser} >Bestätigen!</Button>

          </Segment>
      </div>
    );
};
  
  export default UserConfig;