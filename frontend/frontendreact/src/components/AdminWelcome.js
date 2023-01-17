import {React, useState} from 'react';
import {Link} from 'react-router-dom'
import '../css/AdminWelcome.css';
import axios from 'axios';

function AdminWelcome({user}){

  const onHealthcheck = (e) => {
    axios.get("http://localhost:3000/admin/healthcheck")
      .then((response) => {
        if(response.message){
          console.log(response.message);
        } else {
          console.log("Database connected");
        }
      })
  }

  return (
    <div>
      <Link to='/intelliq_api/questionnaires'>
        <button> View your questionnaires </button><br/><br/>
      </Link>
      <Link to='/intelliq_api/admin/questionnaire_upd'>
        <button> Create a questionnaire </button><br/><br/>
      </Link>
      <Link to='/intelliq_api/questionnaire'>
        <button> Answer a questionnaire </button><br/><br/><br/>
      </Link>
      <button onClick={onHealthcheck}> Healthcheck </button><br/><br/>
    </div>
  )
}

export default AdminWelcome;
