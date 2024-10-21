import React from 'react';

let globalSession = "session";

export const getGlobalSession = () => globalSession;
export const setGlobalSession = (newGlobalSession : any) => {
    globalSession = newGlobalSession;
};