import {React, useState, useEffect} from 'react';
import {Link,Navigate,useParams} from 'react-router-dom'
import '../css/Stats.css';
import axios from 'axios'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

function Stats_view({user, setUser}){

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  )

  const params = useParams();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  useEffect(() => {
    const questions = (e) => {
      axios.get("http://localhost:9103/intelliq_api/admin/questionnaire/"+params.questionnaireID)
        .then((response) => {
          setData(response.data)
          console.log(response.data);
        })
    }
    const getanswers1 = (e) => {
        axios.get("http://localhost:9103/intelliq_api/admin/answers/"+params.questionnaireID+"/"+params.questionnaireID+"P01")
          .then((response) => {
            setData1(response.data)
            console.log(response.data);
          })
      }
      const getanswers2 = (e) => {
        axios.get("http://localhost:9103/intelliq_api/admin/answers/"+params.questionnaireID)
          .then((response) => {
            setAnswers(response.data)
            console.log(response.data);
          })
      }
      questions();
      getanswers1();
      getanswers2();
    },[]);
/*
    const gettitles = (e) => {
        for(var i=0; i < data.length; i++){
            titles[i] = data[i]["qtext"]
        }
        console.log(titles)
    }*/
    const splitanswers = (e) => {
        var value = answers.reduce((result,options) => {if(options.qid == "QQ000P01") { result.push(options.opttext);} return result})
        console.log(value)
    }
/*
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
    }
    */

    const state =  {
        labels: answers.map((options) => {if(options.qid == 'QQ000P01') return options.opttext}),
        datasets: [
            {
                label: "Number of times picked",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(105, 99, 200, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ],
                data: answers.map((options) => {if(options.qid == 'QQ000P01') return options.num}),
                borderColor: ["pink","blue"],
                borderWidth: 0
            }
        ]
    }

/*{data.map((getcate) => (
               
            ))}*/

  if(user.First_Name==="") {
    return <Navigate replace to="/intelliq_api/login"/>;
  } else {
  return (
    
      <div className="stats">
        <h2> The answers for each question are the following: <span></span> </h2>
        <Link to={'/intelliq_api/admin/questionnaires'}>
          <button >Back</button><br/><br/>
        </Link>
        <div className="Charts">
            {data.map((getcate) => (
              <div style={{ height:400, width: 350}}>                
                <Bar name={getcate.qid} options={{
                                responsive: true,
                                plugins: {
                                legend: {
                                    display: false,
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: getcate.qtext,
                                },
                                },
                            }} data={{
                                labels: answers.reduce((result,options) => {if(options.qid == getcate.qid) {result.push(options.opttext)} return result},[]),
                                datasets: [
                                    {
                                        label: "Number of times picked",
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.5)',
                                            'rgba(105, 99, 200, 0.5)',
                                            'green',
                                            'purple'
                                        ],
                                        data: answers.reduce((result,options) => {if(options.qid == getcate.qid){result.push(options.num)} return result},[]),
                                    }
                                ]
                            }}/>
              </div>
            ))}            
        </div>        
      </div>
  )}
}

export default Stats_view;
