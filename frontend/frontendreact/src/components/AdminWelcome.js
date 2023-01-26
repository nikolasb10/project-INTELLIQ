import {React, useState} from 'react';
import {Link} from 'react-router-dom'
import '../css/AdminWelcome.css';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminWelcome({user}){

  const onHealthcheck = (e) => {
    axios.get("http://localhost:3000/admin/healthcheck")
      .then((response) => {
        if(response){
          console.log(response.data[0]);
          toast.success("Database connection status: "+response.data[0].status,{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        } else {
          console.log(response.data[0]);
          toast.error("Database connection status: "+response.data[0].status,{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        }
      })
  }

  const onResetall = (e) => {
    axios.get("http://localhost:3000/admin/resetall")
      .then((response) => {
        if(response){
          console.log(response.data[0]);
          toast.success("Reset status: "+response.data[0].status,{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        } else {
          console.log(response.data[0]);
          toast.error("Reset status: "+response.data[0].status,{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
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
      <button onClick={onResetall}> Reset </button><br/><br/>
      <button onClick={onHealthcheck}> Healthcheck </button><br/><br/>
      <ToastContainer />
    </div>
  )
}

export default AdminWelcome;
