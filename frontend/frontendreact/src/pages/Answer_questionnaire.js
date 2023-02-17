import {React, useState, useEffect} from 'react';
import {createRoutesFromChildren, Link,useParams} from 'react-router-dom';
import axios from 'axios'

import '../css/Answer.css';

function Answer_questionnaire({ user, questionnairedata, setQuestionnairedata }) {
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
        axios.get("http://localhost:9103/intelliq_api/admin/question/"+params.questionnaireID+"/"+params.questionnaireID+"P00")
        .then((response) => {
            setOptions(response.data)
          console.log(response.data);
        }) 
    }

    useEffect(() => {
        const getquestions = (e) => {
            axios.get("http://localhost:9103/intelliq_api/admin/questionnaire/"+params.questionnaireID)
            .then((response) => {
              console.log(response.data);
              setQuestions(response.data)
            })
        }
        /*const postses = (e) => {
            axios.get("http://localhost:9103/intelliq_api/admin/questionnaire/"+params.questionnaireID)
            .then((response) => {
              console.log(response.data);
              setQuestions(response.data)
            })
        }*/
          getquestions();
          getoptions1();
          const ses = makeid(4);
          setSession(ses);
          console.log(session);
          axios.post("http://localhost:9103/intelliq_api/doanswer/"+params.questionnaireID+"/"+ses)
            .then((response) => {
              console.log(response);
            }) 
        },[]);

    const handleOptionClick = (option) => {
        const qid = questions[currentQuestion]["qid"].slice(5,8);
        const optid = option.optid.slice(5,10);
        console.log(option.optid)

        const getoptions = (option) => {
            console.log(option.nextqid)
            axios.get("http://localhost:9103/intelliq_api/admin/question/"+params.questionnaireID+"/"+option.nextqid)
            .then((response) => {
                setOptions(response.data)
              console.log(response.data);
            }) 
        }

        const submitoption = (nextQuestion) => {
            axios.post("http://localhost:9103/intelliq_api/doanswer/"+params.questionnaireID+"/"+qid+"/"+session+"/"+optid)
            .then((response) => {
              console.log(response);
            }) 
        }
        var counter = 0;
        var nextQuestion = 0;
        for(const j in questions){
            if(questions[counter]["qid"] == option.nextqid) nextQuestion = counter;
            counter = counter + 1;
        }
        console.log(questions[nextQuestion]["qid"])
        if (nextQuestion >= questions.length || option.nextqid===params.questionnaireID+'-') {
            /*setQuestionnairedata({
                questionnaire_id: "", questionnaire_title: '', keywords: '', member_id: ''
              });*/
            setFinish(true);
            console.log(option.nextqid)
        } else {
            submitoption(nextQuestion);
            setCurrentQuestion(nextQuestion);
            console.log(option.nextqid)
            getoptions(option);
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
                <div><br/><br/><br/><br/>
                    <input type="text" name="name" onChange={handleChange}/><br/><br/><br/>
                    <button1 onClick={() => handleOptionClick(option)}>Next</button1>
                </div>
            )}
        else return (
        <div><button onClick={() => handleOptionClick(option)}>{option.opttext}</button></div>
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
                        {(user.email != "") ? 
                        (
                            <Link to='/intelliq_api/login'>
                                <button1> Exit  </button1><br/><br/>
                            </Link>                            
                        ) : (
                            <Link to='/intelliq_api'>
                                <button1> Exit </button1>
                            </Link>
                        )
                        }
                    </div>          
                ) : (
                    <>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {currentQuestion + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>{questions[currentQuestion]["qtext"]}</div><br/><br/><br/><br/><br/>
                            {(user.email != "") ? 
                            (
                                <Link to='/intelliq_api/login'>
                                    <button1> Exit  </button1><br/><br/>
                                </Link>                            
                            ) : (
                                <Link to='/intelliq_api'>
                                    <button1> Exit </button1>
                                </Link>
                            )
                            }
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