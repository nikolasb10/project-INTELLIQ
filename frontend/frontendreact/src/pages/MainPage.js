import {Link} from 'react-router-dom'
import React from 'react';


function MainPage() {
  return (
    <div>
      <h1> Welcome to our App!</h1>
      <h2> Choose what you would like to do: </h2>
      <Link to='/questionaire'>
        <button type="button" className="btn btn-info">Answer a questionaire anonymously</button>
      </Link><br/><br/>
      <Link to='/login'>
        <button type="button" className="btn btn-info">Login</button>
      </Link>
    </div>
  );
}

export default MainPage;
