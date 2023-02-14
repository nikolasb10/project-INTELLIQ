import {Link} from 'react-router-dom'
import React from 'react';
import '../css/MainPage.css';

/*const background = new URL("../components/backgroundMain.jpg",import.meta.url)*/
/*<h2> Choose what you would like to do: </h2>*/
function MainPage() {
  return (
    <div className="MainPage">
      <h1 className="Title"> Welcome to Intelliq!</h1>
      <div className="Box">
        <Link to='/intelliq_api/choosekeyword'>
          <button type="button" className="btn">Answer a questionnaire anonymously</button>
        </Link>
        <Link to='/intelliq_api/login'>
          <button type="button" className="btn">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
