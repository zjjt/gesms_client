/* eslint-disable prettier/prettier */

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

//console.dir(process.env);
const httpLink=new HttpLink({
    uri:'http://192.168.8.104:97/graphql'//`${process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT}`,
});
const wsLink=new WebSocketLink({
    uri:'ws://192.168.8.104:97/subscriptions',//`${process.env.REACT_APP_GRAPHQL_WS_ENDPOINT}`,
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