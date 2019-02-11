/* eslint-disable prettier/prettier */

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client'


export const Apolloclient = (cache={})=>new ApolloClient({
    ssrMode: typeof window !== 'undefined',
    cache: new InMemoryCache().restore(cache),
    link: createUploadLink({ uri: "http://localhost:4000/graphql" })
});