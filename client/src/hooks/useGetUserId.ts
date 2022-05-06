import React from 'react'
import useAxios from './useAxios';
import { useEffect, useState } from 'react';
import { useStorage } from "./useStorage";

function useGetUserId(params: any) {
    const [auth, setAuth] = useStorage("userId", null);
    const {response, error, loading} = useAxios(params)

    useEffect(() => {
        const getUserId = () => {
          setAuth(response);
        };
        getUserId()
    },  [setAuth]);

    return auth
 
}

export default useGetUserId;