/* eslint-disable prettier/prettier */

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {getMainDefinition} from 'apollo-utilities';

//console.dir(process.env);
const httpLink=new HttpLink({
    uri:'http://localhost:4000/graphql'//process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT?process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT:window.location.hostname.includes('192.168.99.100:97')?'http://192.168.99.100:97/graphql':'http://10.11.100.48:8097/graphql'
});
const wsLink=new WebSocketLink({
    uri:'ws://localhost:4000/subscriptions',//process.env.REACT_APP_GRAPHQL_WS_ENDPOINT?process.env.REACT_APP_GRAPHQL_WS_ENDPOINT:window.location.hostname.includes('192.168.99.100:97')?'ws://192.168.99.100:97/subscriptions':'ws://10.11.100.48:8097/subscriptions',
    options:{
        reconnect:true
    }
})
const link=split(
    ({query})=>{
        const {kind,operation}= getMainDefinition(query);
        return kind==='OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);
export const Apolloclient = (cache={})=>new ApolloClient({
    ssrMode: typeof window !== 'undefined',
    cache: new InMemoryCache().restore(cache),
    link //createUploadLink({ uri:process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT })
});