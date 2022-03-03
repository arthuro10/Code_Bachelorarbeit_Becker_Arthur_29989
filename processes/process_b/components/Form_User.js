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
          <Form.Input fluid label='First name' placeholder='First name' onChange={this.props.handleFirstNameChange} />
          <Form.Input fluid label='Last name' placeholder='Last name' onChange={this.props.handleLastNameChange}  />
        </Form.Group>
        <Form.TextArea label='About' placeholder='Tell us more about you...' onChange={this.props.handleAboutChange}/>
      </Form>
    )
  }
}

export default Form_User