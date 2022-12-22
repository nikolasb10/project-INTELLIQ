import {Link} from 'react-router-dom'
import React, {useState} from 'react';
import LoginForm from '../components/LoginForm'


function LoginPage() {
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const [user, setUser] = useState({name: "", email: ""});
  const [error, setError] = useState("");

  const Login = details => {
    console.log(details);

    if(details.email == adminUser.email && details.password == adminUser.password) {
      console.log("Logged in");
      setUser({
        name: details.name,
        email: details.email
      });
    }
    else {
      console.log("Wrong credentials!")
      setError("Wrong credentials!");
    }
  }

  const Logout = () => {
    console.log("Logout");
    setUser({name: "", email: ""});
  }

  return (
    <div className="LoginPage">
      {(user.email != "") ? (
        <div className="welcome">
          <h1> Welcome!</h1>
          <button onClick={Logout}> Logout </button>
        </div>
      ) : (
        <LoginForm Login={Login} error={error} />
      )
      }
    </div>
  );
}

export default LoginPage;
