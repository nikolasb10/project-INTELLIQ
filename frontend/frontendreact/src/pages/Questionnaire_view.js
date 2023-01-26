import {React, useState} from 'react';
import {Link,Navigate,useParams} from 'react-router-dom'
import '../css/AvailableQuest.css';
import axios from 'axios'

function Questionnaire_view({user, setUser}){
  const params = useParams();

  if(user.First_Name=="") {
    return <Navigate replace to="/intelliq_api/login"/>;
  } else {
  return (
    <div className="questionnaires">
      <h2> Here is your questionnaire: <span>{params.questionnaireID}!</span></h2>
      <Link to='/intelliq_api/questionnaires'>
        <button>Back</button><br/><br/><br/><br/>
      </Link>
      
    </div>
  )}
}

export default Questionnaire_view;
