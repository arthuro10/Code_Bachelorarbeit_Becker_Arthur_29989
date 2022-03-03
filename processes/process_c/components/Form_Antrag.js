import React, { Component } from 'react'
import { Form, Dropdown } from 'semantic-ui-react'


class Form_User extends Component {
    constructor(props){
        super(props);
    
    
    }
  render() {
    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Vorname' placeholder='Vorname...' onChange={this.props.handleFirstNameChange} />
          <Form.Input fluid label='Nachname' placeholder='Nachname...' onChange={this.props.handleLastNameChange}  />
          <Form.Input fluid label='Abteilung' placeholder='Abteilung' onChange={this.props.handleAbteilungChange}  />
        </Form.Group>
        <Form.TextArea label='Weitere Infos' placeholder='Grund...' onChange={this.props.handleInfoChange}/>
      </Form>
    )
  }
}

export default Form_User