import {React, useState} from 'react';
import {Link} from 'react-router-dom'
import '../css/AdminWelcome.css';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminWelcome({user}){

  const onHealthcheck = (e) => {
    axios.get("http://localhost:9103/intelliq_api/admin/healthcheck")
      .then((response) => {
        if(response){
          console.log(response.data.status);
          toast.success("Database connection status: "+response.data.status,{
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
          toast.error("Database connection status: "+response.data.status,{
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

  const onResetall = () => {
    const confirmed = window.confirm('Are you sure you want to reset everything?');

    if(confirmed){
      axios.post("http://localhost:9103/intelliq_api/admin/resetall/",{member_id: user.member_id})
      .then((response) => {
        console.log(response);
        if(response.status=='200'){
          toast.success("Everything Deleted",{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            console.log('Resetall success');
        }    
      }).catch(error => {
        console.log(error.response);
        toast.error(error.response.data.sqlMessage,{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      });
    } else return;
  }

  return (
    <div>
      <Link to='/intelliq_api/admin/questionnaires'>
        <button> View your questionnaires </button><br/><br/>
      </Link>
      <Link to='/intelliq_api/admin/questionnaire_upd'>
        <button> Create a questionnaire </button><br/><br/>
      </Link>
      <Link to='/intelliq_api/chooseKeyword'>
        <button> Answer a questionnaire </button><br/><br/><br/>
      </Link>
      <button onClick={onResetall}> Reset </button><br/><br/>
      <button onClick={onHealthcheck}> Healthcheck </button><br/><br/>
      <ToastContainer />
    </div>
  )
}

export default AdminWelcome;
