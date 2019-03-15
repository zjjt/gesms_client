/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";
import LogIn from "./page/LoginPage";
import Admin from "./page/AdminPage";
import SelectProvider from './page/SelectProvider';
import CreateUser from './page/CreateuserPage';
import { getDataFromTree, ApolloProvider } from 'react-apollo'
import EnvoiCustom from './page/EnvoiCustom';

function Router(props) {
    return (
        <ApolloProvider client={props.client}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LogIn}/>
                <Route path="/admin" component={Admin}/>
                <Route path="/create_user" component={CreateUser}/>
                <Route path="/select_provider" component={SelectProvider}/>
                <Route path="/send_sms" component={EnvoiCustom}/> 
                    
            </Switch>
        </BrowserRouter>
        </ApolloProvider>
    );
}

export default Router;
