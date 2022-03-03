import React from 'react'

import Register from "./Register_Form"


export default class SignUp extends React.Component {
    constructor(props){
        super(props);

    }



    render(){


        const zentriert = {
            marginLeft: "auto",
            marginRight: "auto",
            textAlign : "center"
          }
        const background = {
            backgroundColor : "blue"
          }


        return (
            <div >
                <h1 style={zentriert}>SignUp Page</h1>
                <Register />
            </div>
        )
    }
}
