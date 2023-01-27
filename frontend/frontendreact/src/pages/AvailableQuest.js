import {Link,Routes, Route,Navigate} from 'react-router-dom';
import React, {useState,useEffect,Redirect,useNavigate} from 'react';
import '../css/AvailableQuest.css';
import axios from 'axios';
import { Container } from "react-bootstrap";

function AvailableQuest({user, setUser}){
  const [data, setData] = useState([]);

  useEffect(() => {
    const questionnaires = (e) => {
      console.log(user.member_id);
      axios.post("http://localhost:3000/admin/questionnaires",{ id: user.member_id })
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
      questionnaires();
    },[]);
  if(user.First_Name=="") {
    return <Navigate replace to="/intelliq_api/login"/>;
  } else {

    return (
      <React.Fragment>
        <div className="questionnaires">
          <h2> Here are your questionnaires <span>{user.First_Name}!</span> </h2>
          <Link to='/intelliq_api/login'>
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
                  <Link to={'/intelliq_api/questionnaire/'+getcate.questionnaire_id}>
                    <button> View </button>
                  </Link>&nbsp;&nbsp;
                  <Link to={'/intelliq_api/questionnaire/'+getcate.questionnaire_id}>
                    <button> Delete </button>
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
}

export default AvailableQuest;
