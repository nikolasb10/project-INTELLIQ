import {React, useState, useEffect} from 'react';
import {createRoutesFromChildren, Link,useParams} from 'react-router-dom';
import axios from 'axios'

import '../css/Answer.css';

function Answer_questionnaire({ questionnairedata, setQuestionnairedata }) {
    const params = useParams();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{qid: '', qtext: '', required: '', qtype: ''}]);
    const [options, setOptions] = useState([{optid: '', opttext: '', nextqid: ''}]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [finish, setFinish] = useState(false);
    const [input, setInput] = useState('');
    const [session, setSession] = useState('');

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const getoptions1 = (nextQuestion) => {
        axios.get("http://localhost:3000/admin/question/"+params.questionnaireID+"/"+params.questionnaireID+"P00")
        .then((response) => {
            setOptions(response.data)
          console.log(response.data);
        }) 
    }

    useEffect(() => {
        const gettitle = (e) => {
            axios.get("http://localhost:3000/admin/"+params.questionnaireID)
            .then((response) => {
              console.log(response.data);
              setTitle(response.data)
            })
        }
        const getquestions = (e) => {
            axios.get("http://localhost:3000/admin/questionnaire/"+params.questionnaireID)
            .then((response) => {
              console.log(response.data);
              setQuestions(response.data)
            })
        }
          getquestions();
          getoptions1();
          setSession(makeid(4));
          console.log(session);
        },[]);

    const handleAnswerOptionClick = (isCorrect) => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setFinish(true);
        }
    };
    const handleOptionClick = (optid) => {
        const nextQuestion = currentQuestion + 1;
        console.log(optid)
        const getoptions = (nextQuestion) => {
            axios.get("http://localhost:3000/admin/question/"+params.questionnaireID+"/"+questions[nextQuestion]["qid"])
            .then((response) => {
                setOptions(response.data)
              console.log(response.data);
            }) 
        }

        const submitoption = (nextQuestion) => {
            axios.post("http://localhost:3000/doanswer/"+params.questionnaireID+"/"+questions[currentQuestion]["qid"]+"/"+session+"/"+optid)
            .then((response) => {
              console.log(response);
            }) 
        }
        submitoption();
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            getoptions(nextQuestion);
        } else {
            setFinish(true);
        }
    };

    const isrequired = () =>{
        if(questions[currentQuestion]["required"]=="TRUE" || options[0]["opttext"]=="<open string>") return
        else return <button onClick={() => handleOptionClick()}>Next</button>
    }

    const handleChange = (event) =>{
       setInput(event.target.value);
    }

    const showoptions = (option) => {
        if(option.opttext=="<open string>") {
            return (
                <div><br/><br/><br/><br/><br/>
                    <input type="text" name="name" placeholder="Email" onChange={handleChange}/><br/><br/><br/>
                    <button1 onClick={() => handleOptionClick(option.optid)}>Next</button1>
                </div>
            )}
        else return (
        <div><button onClick={() => handleOptionClick(option.optid)}>{option.opttext}</button></div>
        )
    }
    return (
        <div className='back'>
        <h1> Here is the questionnaire: <span> "{questionnairedata.questionnaire_title}" </span></h1>
        <div className='app0'>
            <div className='app'>
                {finish ? (
                    <div className='finish'><br/>
                        Finished! <br/><br/>
                        <Link to='/intelliq_api'>
                            <button1>Exit</button1>
                        </Link>
                    </div>          
                ) : (
                    <>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {currentQuestion + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>{questions[currentQuestion]["qtext"]}</div><br/><br/><br/><br/><br/>
                            <Link to='/intelliq_api'>
                                <button1> Exit </button1>
                            </Link>
                        </div>
                        <div className='answer-section'>
                            {options.map((answerOption) => (
                                showoptions(answerOption)
                            ))}<div>{isrequired()}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}


export default Answer_questionnaire;