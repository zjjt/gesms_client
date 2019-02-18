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
    uri:process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT
});
const wsLink=new WebSocketLink({
    uri:process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
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