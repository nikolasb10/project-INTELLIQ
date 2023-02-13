import {React, useState, useEffect} from 'react';
import {Link,Navigate,useParams} from 'react-router-dom'
import '../css/AvailableQuest.css';
import axios from 'axios'
import { Container } from "react-bootstrap";

function Questionnaire_view({user, setUser}){
  const params = useParams();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  useEffect(() => {
    const questionnaire = (e) => {
      console.log(user.member_id);
      axios.get("http://localhost:9103/intelliq_api/admin/"+params.questionnaireID)
        .then((response) => {
          setData1(response.data)
          console.log(response.data);
        })
      axios.get("http://localhost:9103/intelliq_api/admin/questionnaire/"+params.questionnaireID)
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
      questionnaire();
    },[]);

  if(user.First_Name==="") {
    return <Navigate replace to="/intelliq_api/login"/>;
  } else {
  return (
    
      <div className="questionnaires">
        <h2> The questions for your questionnaire: <span>{data1.map((getcate) => (getcate.questionnaire_title))}</span> </h2>
        <Link to='/intelliq_api/admin/questionnaires'>
          <button >Back</button><br/><br/>
        </Link>
        <div className="background">
        <div className="table">
        <table>
          <thead>
            <tr>
              <th>qID</th>
              <th>Question</th>
              <th>Required</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((getcate) => (
            <tr key={params.questionnaireID}>
              <td>{getcate.qid.slice(5, 8)}</td>
              <td> {getcate.qtext}</td>
              <td> {getcate.required}</td>
              <td> {getcate.qtype}</td>
              <td>
                <Link to={'/intelliq_api/question/'+params.questionnaireID+"/"+getcate.qid}>
                  <button> View options </button>
                </Link>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
      </div>
    
  )}
}

export default Questionnaire_view;
