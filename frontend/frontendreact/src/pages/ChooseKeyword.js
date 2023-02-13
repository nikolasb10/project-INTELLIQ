import {Link,Navigate} from 'react-router-dom';
import React, {useState,useEffect,Redirect,useNavigate} from 'react';
import '../css/AvailableQuest.css';
import '../css/Answer.css';
import axios from 'axios';
import { Container } from "react-bootstrap";

function ChooseKeyword({ keyword, setKeyword, user, questionnairedata, setQuestionnairedata }){

    useEffect(() => {
        setKeyword("")
        },[]);
    return (
      <React.Fragment>
        <div className="questionnaires">
          <h2> Choose a keyword if you want! </h2>
          {(user.email != "") ? 
          (
              <Link to='/intelliq_api/login'>
                  <button> Back  </button><br/><br/>
              </Link>                            
          ) : (
              <Link to='/intelliq_api'>
                  <button> Back </button><br/><br/>
              </Link>
          )
          }
          <div className="input1">
            <input type="text" placeholder="Choose a keyword" value={keyword} name="keyword" onChange={e => setKeyword(e.target.value)}></input>&nbsp;&nbsp;
            <Link to='/intelliq_api/questionnaires'>
                <button> Get questionnaires </button> 
            </Link>
          </div>
        </div>
      </React.Fragment>
    )
}


export default ChooseKeyword;