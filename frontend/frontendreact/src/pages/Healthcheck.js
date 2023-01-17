import React from 'react';
import axios from 'axios';

function Healthcheck() {
  axios.get("http://localhost:3000/healthcheck").then(function (response) {
    console.log(response.data);
  });
}

export default Healthcheck;
