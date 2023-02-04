import {Link,Navigate} from 'react-router-dom';
import React, {useState,useEffect,Redirect,useNavigate} from 'react';
import '../css/AvailableQuest.css';
import '../css/Answer.css';
import axios from 'axios';
import { Container } from "react-bootstrap";

function Choose_questionnaire({ questionnairedata, setQuestionnairedata }){
  const [data, setData] = useState([]);

  useEffect(() => {
    const questionnaires = (e) => {
      axios.post("http://localhost:3000/questionnaires")
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
      questionnaires();
    },[]);

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
          <Link to='/intelliq_api'>
            <button >Back</button><br/><br/>
          </Link>
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
