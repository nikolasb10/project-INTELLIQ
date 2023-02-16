import {Link,Navigate} from 'react-router-dom';
import React, {useState,useEffect,Redirect,useNavigate} from 'react';
import '../css/AvailableQuest.css';
import axios from 'axios';
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AvailableQuest({user, setUser}){
  const [data, setData] = useState([]);

  useEffect(() => {
    const questionnaires = (e) => {
      console.log(user.member_id);
      axios.post("http://localhost:9103/intelliq_api/admin/questionnaires",{ id: user.member_id })
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
      questionnaires();
    },[]);

    const deleteq = (questionaire_id) => {
      const confirmed = window.confirm('Are you sure you want to delete the answers to this questionnaire?');

      if(confirmed){
        axios.post("http://localhost:9103/intelliq_api/admin/resetq/"+questionaire_id)
        .then((response) => {
          console.log(response);
          if(response.status=='200'){
            toast.success("Questionnaire Answers Deleted",{
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
              console.log('Resetq success');
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

    const resetq = (questionaire_id) => {
      const confirmed = window.confirm('Are you sure you want to delete the answers to this questionnaire?');

      if(confirmed){
        axios.post("http://localhost:9103/intelliq_api/admin/resetq/"+questionaire_id)
        .then((response) => {
          console.log(response);
          if(response.status=='200'){
            toast.success("Questionnaire Answers Deleted",{
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
              console.log('Resetq success');
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
                  <button onClick={() => deleteq(getcate.questionnaire_id)}> Delete </button>
                  &nbsp;&nbsp;
                  <Link to={'/intelliq_api/stats/'+getcate.questionnaire_id}>
                    <button> Stats </button>
                  </Link>&nbsp;&nbsp;
                  <button onClick={() => resetq(getcate.questionnaire_id)}> Reset </button>                
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <ToastContainer />
      </React.Fragment>
    )
  }
}

export default AvailableQuest;
