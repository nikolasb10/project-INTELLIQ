import {React, useState, useEffect} from 'react';
import {Link,Navigate,useParams} from 'react-router-dom'
import '../css/AvailableQuest.css';
import axios from 'axios'
import { Container } from "react-bootstrap";

function Question_view({user, setUser}){
  const params = useParams();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  useEffect(() => {
    const questionnaire = (e) => {
      console.log(user.member_id);
      axios.get("http://localhost:3000/admin/question/"+params.questionID)
        .then((response) => {
          setData1(response.data)
          console.log(response.data);
        })
      axios.get("http://localhost:3000/admin/question/"+params.questionnaireID+"/"+params.questionID)
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
        <h2> The options for question: <span>{data1.map((getcate) => (getcate.qtext))}</span> </h2>
        <Link to={'/intelliq_api/questionnaire/'+params.questionnaireID}>
          <button >Back</button><br/><br/>
        </Link>
        <div className="table">
        <table>
          <thead>
            <tr>
              <th>Option ID</th>
              <th>Option Text</th>
              <th>Next Question ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((getcate) => (
            <tr key={params.questionID}>
              <td>{getcate.optid.slice(5, 10)}</td>
              <td> {getcate.opttext}</td>
              <td> {getcate.nextqid.slice(5, 8)}</td>
            </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    
  )}
}

export default Question_view;
