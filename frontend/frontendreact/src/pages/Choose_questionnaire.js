import {Link,Navigate} from 'react-router-dom';
import React, {useState,useEffect,Redirect,useNavigate} from 'react';
import '../css/AvailableQuest.css';
import '../css/Answer.css';
import axios from 'axios';
import { Container } from "react-bootstrap";

function Choose_questionnaire({ keyword, user, questionnairedata, setQuestionnairedata }){
  const [data, setData] = useState([]);

  useEffect(() => {
    const questionnaires = (e) => {
      axios.get("http://localhost:9103/intelliq_api/questionnaires")
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
    const questionnaires_key = (e) => {
      axios.get("http://localhost:9103/intelliq_api/questionnaires/"+keyword)
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
      if(keyword!="") questionnaires_key();
      else questionnaires();
    },[]);

    
/*<div className="input1">
            <input type="text" placeholder="Choose a keyword" value={keyword} name="keyword" onChange={e => setKeyword(e.target.value)}></input>&nbsp;&nbsp;
            <button onClick={questionnaires_key}> Get questionnaires </button> 
          </div>*/
    const handleHover = (data) => {
      setQuestionnairedata({
        questionnaire_id: data.questionnaire_id, questionnaire_title: data.questionnaire_title, keywords: data.keywords, member_id: data.member_id
      });
      console.log(questionnairedata)
    }

    return (
      <React.Fragment>
        <div className="questionnaires">
          <h2> Choose a questionnaire to answer! </h2>
          {(user.email != "") ? 
          (
              <Link to='/intelliq_api/choosekeyword'>
                  <button> Back  </button><br/><br/>
              </Link>                            
          ) : (
              <Link to='/intelliq_api/choosekeyword'>
                  <button> Back </button><br/><br/>
              </Link>
          )
          }
          
          <div className="table">
          <table>
            <thead>
              <tr>
                <th>Questionnaire Title</th>
                <th>Keywords</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((getcate) => (
              <tr key={getcate.questionnaire_id}>
                <td>{getcate.questionnaire_title}</td>
                <td> {getcate.keywords}</td>
                <td>
                  <Link to={'/intelliq_api/doanswer/'+getcate.questionnaire_id}>
                    <button onMouseOver={handleHover(getcate)}> Answer </button>
                  </Link>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </React.Fragment>
    )
}


export default Choose_questionnaire;
