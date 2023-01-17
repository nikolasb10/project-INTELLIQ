import {Link, useNavigate} from 'react-router-dom';
import {React, useState} from 'react';
import LoginForm from '../components/LoginForm';
import Welcome from './Welcome';
import axios from 'axios';

function LoginPage({user, setUser}) {
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const [error, setError] = useState("");
  let navigate = useNavigate();

  const Login = details => {
    console.log(details);
    axios.post("http://localhost:3000/login", {
      username: details.email,
      password: details.password,
    }).then((response) => {
      if(response.data.message){
        setError("Wrong credentials!");
      } else {
        console.log("Logged in");
        setUser({
          member_id: response.data[0].member_id,
          First_Name: response.data[0].First_Name,
          email: details.email,
          password: details.password,
          mstatus: response.data[0].mstatus
        });
      }
      console.log(response.data);
    });
  }

  return (
    <div className="LoginPage">
      {(user.email != "") ? (
        <Welcome user={user} setUser={setUser} />
      ) : (
        <LoginForm Login={Login} error={error} />
      )
      }
    </div>
  );
}

export default LoginPage;
