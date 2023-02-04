import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, {useState} from 'react';

import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import ErrorPage from './pages/ErrorPage'
import AvailableQuest from './pages/AvailableQuest'
import Welcome from './pages/Welcome'
import AdminWelcome from './components/AdminWelcome'
import Questionnaire_upd from './pages/Questionnaire_upd'
import Questionnaire_view from "./pages/Questionnaire_view";
import Question_view from "./pages/Question_view";
import Answer_questionnaire from "./pages/Answer_questionnaire";
import Choose_questionnaire from "./pages/Choose_questionnaire";

function App() {
  const [user, setUser] = useState({member_id: "", First_Name: "", email: "", password: "", mstatus: ""});
  const [questionnairedata, setQuestionnairedata] = useState({questionnaire_id: "", questionnaire_title: "", keywords: "", member_id: ""});

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/intelliq_api" element={<MainPage />} />
        <Route exact path="/intelliq_api/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route exact path="/intelliq_api/questionnaires" element={<Choose_questionnaire questionnairedata={questionnairedata} setQuestionnairedata={setQuestionnairedata}/>}/>
        <Route exact path="/intelliq_api/admin/questionnaires" element={<AvailableQuest user={user} setUser={setUser}/>} />
        <Route exact path="/intelliq_api/welcome" element={<Welcome user={user} setUser={setUser} />} />
        <Route exact path="/intelliq_api/admin/questionnaire_upd" element={<Questionnaire_upd user={user} setUser={setUser}/>} />
        <Route exact path="/intelliq_api/questionnaire/:questionnaireID" element={<Questionnaire_view user={user} setUser={setUser}/>} />
        <Route exact path="/intelliq_api/question/:questionnaireID/:questionID" element={<Question_view user={user} setUser={setUser}/>} />
        <Route exact path="/intelliq_api/doanswer/:questionnaireID" element={<Answer_questionnaire questionnairedata={questionnairedata} setQuestionnairedata={setQuestionnairedata}/>} />
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
