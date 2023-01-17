import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import AdminWelcome from '../components/AdminWelcome';
import '../css/AdminWelcome.css';


function Welcome({user, setUser}){
  const [details, setDetails] = useState({name: "", email: "", password: ""});
  const Logout = () => {
    console.log("Logout");
    setUser({First_Name: "", email: "", password: "", mstatus: ""});
  }
  return (
    <div className="welcome">
      <h2> Welcome <span>{user.First_Name}!</span> </h2>
      <button onClick={Logout}> Logout </button><br/><br/><br/>
      {(user.mstatus === "a") ? (
          <AdminWelcome user={user} Logout={Logout} />
        ) : (
          <Link to='/intelliq_api/questionnaire'>
            <button> Answer a questionnaire </button>
          </Link>
        )
      }
    </div>
  )
}

export default Welcome;
