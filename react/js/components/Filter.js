import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Form, Radio, Header, Icon, Segment, Divider, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import store from '../store/configStore'
import { stringify } from "uuid";

const Filter = (props) => {
  const _filter = props.filter;
  const _search = props.search;


  const zentriert = {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign : "center"
  }


  const InnerSegment = {
    marginLeft: "5px",
    marginRight: "5px",
    textAlign : "center"
  }

  const radioBoxSegment = { 
    marginLeft: "0%",
    marginRight: "0%",
}
  const ButtonMargin = { 
    marginLeft: "0%",
    marginRight: "10%",
}



  const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

    useEffect(() => {
      
    }, []);

    



    return (
        <div style={zentriert}>
            <Header as='h1'>
              <Icon name='filter' size='small' />
                Filter
            </Header>
            <Divider></Divider>
            <Form>
                <Form.Field>
                    <h4>Selected value: <b>{_filter}</b></h4>
                </Form.Field>
                <Segment color='black' textAlign={'left'} style={radioBoxSegment}>
                    <Form.Field>
                    <Radio
                        label='Process'
                        name='radioGroup'
                        value='process'
                        checked={_filter === 'process'}
                        onChange={props.changeFilter}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Radio
                        label='Task'
                        name='radioGroup'
                        value='task'
                        checked={_filter === 'task'}
                        onChange={props.changeFilter}
                    />
                    </Form.Field>
                </Segment>
            </Form>
            <Divider></Divider>
            <h4><b>Search for...</b></h4>
            <Segment color='black' textAlign={'left'} style={radioBoxSegment}>
                <Input placeholder='Search...' onChange={props.changeSearch} size='mini' style={ButtonMargin} />
            </Segment>

        </div>
    );
  };
  
  export default Filter;