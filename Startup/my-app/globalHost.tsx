import React from 'react';

let displayHostname = "localhost";

export const getDisplayHostname = () => displayHostname;
export const setDisplayHostname = (newHostname : any) => {
    displayHostname = newHostname;
};