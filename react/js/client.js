import React from "react"
import ReactDOM from "react-dom"
// Async und await funktionieren wenn dies hier importiert wird.
import 'regenerator-runtime/runtime'
import Layout from "./Layout/Layout"

import { AuthContextProvider } from './store/authStore';

const app = document.getElementById('app');

ReactDOM.render(
    <AuthContextProvider>
        <Layout />
    </AuthContextProvider>,
    app);