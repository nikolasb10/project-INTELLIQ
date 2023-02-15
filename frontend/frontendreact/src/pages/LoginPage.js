import {Link, useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import LoginForm from '../components/LoginForm';
import Welcome from './Welcome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage({user, setUser}) {

  const [error, setError] = useState("");

  const Login = details => {
    console.log(details);
    axios.post("http://localhost:9103/intelliq_api/login", {
      username: details.email,
      password: details.password,
    }).then((response) => {
      if(response.data.message){
        //setError("Wrong credentials!");
        toast.error("Wrong credentials!",{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      } else {
        console.log("Logged in");
        toast.success("Logged in",{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
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
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
