import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import {Divider, Grid, Input, Table, Segment, Responsive, Button, Icon} from 'semantic-ui-react'
import uuid from "react-uuid";

import store from '../store/bestellung_store'

import mainStore from '../../../react/js/store/mainStore'






const A_teile_bestellen = () => {

    const [selectedArticleName, setSelectedArticleName] = useState("no articleselected");
    const [searchString, setSearchString] = useState("");
    const [priceSum, setPriceSum] = useState(0);
    const [TableRowArticle, setTableRowArticle] = useState([]);

    const [amountKugellager,setAmountKugellager] = useState();
    const [amountDrehkranz,setAmountDrehkranz] = useState();
    const [amountPlanententräger,setAmountPlanententräger] = useState();

    const [articleArray,setArticleArray] = useState([{key : '1', id: 0, name: "Kugellager", price: 15000, amount: 1},
                                                      {key : '2',id: 1, name: "Drehkranz", price: 399000, amount: 1},
                                                    {key : '3',id: 2, name: "Plantenträger", price: 5000, amount: 1}
                                                    ]);



    const _id = mainStore.getCurrentTaskId();
    console.log(_id);

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

    useEffect(() => {
      const tempArr = articleArray
			.map((article,i) => {
        console.log("article");
        console.log(article);
        console.log(article.amount);

        return <Table.Row key={article.id}  >
				<Table.Cell onClick={articleClicked(article)}> { article.name } </Table.Cell>
				<Table.Cell onClick={articleClicked(article)}> { article.price } </Table.Cell>
				<Table.Cell> <Input id={article.id} defaultValue={article.amount}  onChange = {amountChanged}/></Table.Cell>
				<Table.Cell>
					<Button basic color="red" id={article.id} onClick = {amountResetClicked}><Icon name = "delete"/>Delete</Button>
				</Table.Cell>
			</Table.Row>
      });
      setTableRowArticle(tempArr);
      return () => {
        console.log("Clean up");
      }
    }, []);



    const ButtonClickNewTask = async () => {

      const data = articleArray.map(article => {
        const _data = {
          name: article.name,
          amount: article.amount,
          price: article.price
        }
        const stringifiedData = JSON.stringify(_data).replaceAll("\"name\"","name").replaceAll("\"amount\"","amount")
        .replaceAll("\"price\"","price")
        return stringifiedData
        
      });
      

      const _query1 = `mutation {setbestellData(bestellung: [${data}] maxPrice: ${priceSum} id: "${_id}")}`;
      console.log("_query1")
      console.log(_query1)
      try{
        const stringData1 = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query1
          }
        })
      }catch(err) {
        console.log("err stringData1",err);
      }
      // set the new Task to active ... 
      const _query = `mutation {updateActiveTask(idLastActive : "${_id}")}`;
      try{
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })
        if(stringData.data.data.updateActiveTask) window.location.replace('/')
      }catch(err) {
        console.log("err updateActiveTask",err);
      }

    }
  
      // ---------------

      const articleClicked = (article) => {
        if (article.amount === 0) {
          //alert("Artikel ausverkauft");
        } else {
          article.amount--;
        }
      }
    
    
      const amountChanged =(e,{ value,id }) => {
        // console.log(e.target.value);
        let amount = parseInt(value);
        console.log("amount");
        console.log(amount);
        const tempArray = articleArray;
        tempArray.forEach(article => {
          if(article.id === id){
            article.amount = amount;
          }
        });
        let _price = 0;
        const price = tempArray.map(article => { 
          _price += article.price * article.amount; 
          return article 
        });
        setPriceSum(_price)
        setArticleArray(tempArray);
      }
    
      const amountResetClicked = (e,{id}) => {
        const tempArray = articleArray;
        tempArray.forEach(article => {
          if(article.id === id){
            article.amount = 0;
          }
        });
        let _price = 0;
        const price = tempArray.map(article => { 
          _price += article.price * article.amount; 
          return article 
        });
        setPriceSum(_price)
        setArticleArray(tempArray);
      }

			


		
		

    

    return (
      <div style={zentriert}>
        <Segment color='black' style={Segmentzentriert}>
            <Responsive as={Grid} minWidth={600}>
            <Grid celled>
            <Grid.Row>
              <Grid.Column width={12}>
              <Segment color='black' style={Segmentzentriert}>
                <h1>MAG - Metallkomponente und mehr</h1>
              </Segment>
              </Grid.Column>
              </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Preis</Table.HeaderCell>
                      <Table.HeaderCell>Menge</Table.HeaderCell>
                      <Table.HeaderCell><Icon name = "trash alternate"/></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { TableRowArticle }
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column width={2} >
              </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment style={zentriert}>
              { "Gesamtsumme: " + priceSum.toFixed(2) + " €" }
              <Button secondary style={Segmentzentriert} onClick={ButtonClickNewTask}>Bestellen!</Button>
            </Segment>
            </Responsive>
            <Segment.Group>
            <Responsive as={Segment} maxWidth={600}>
              Bitte breites Fenster verwenden.
            </Responsive>
            </Segment.Group>
          </Segment>
      </div>
    );
  };

  
  export default A_teile_bestellen;