const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fileUpload = require("express-fileupload");
const csv = require('csv-stringify');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());

app.listen(9103,()=>console.log('Express server is running'));

// create connection and export it
var db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'softeng_mysql',
  database: 'intelliq22',
  multipleStatements: true
});

db.connect(err => {
  if(err) console.log(err)
  else console.log("Connected to database")
})

module.exports = { db };


app.post('/intelliq_api/login', function(req, res, next) {
  const email = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM member WHERE email = ? AND password = ?", [email,password], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      if(result.length>0) {
        res.send(result);
      } else {
        res.send({ message: "Wrong username/password combination!"})
      }
    }
  )
});

// Admin Endpoints
// 1. healthcheck
app.get('/intelliq_api/admin/healthcheck', function(req, res, next) {
  const format = req.query.format;

  db.ping((err) => {
    if(err) {
      console.log('{"status":"failed", "dbconnection": ["localhost","root","softeng_mysql","intelliq22","true"]}');
      if(format==='json' || format===undefined) {
        res.json([
          {
            "status":"failed", 
            "dbconnection": [
              'localhost',
              'root',
              'softeng_mysql',
              'intelliq22',
              'true'
            ]
          }
        ])
      }      
    } else {
      json_obj = [
          {
            "status":"OK", 
            "dbconnection": [
              'localhost',
              'root',
              'softeng_mysql',
              'intelliq22',
              'true'
            ]
          }
        ]
      if(format==='csv'){
        const values = json_obj.map(obj => Object.values(obj));
        const csvString = values.map(row => row.join(',')).join('\n');
        const csvresult = 'status, dbconnection' + '\n' + csvString;
        console.log(csvresult)
        
        res.status(200).send(csvresult);
      }
      else if(format==='json' || format===undefined) {
        console.log('{"status":"OK", "dbconnection": ["localhost","root","softeng_mysql","intelliq22","true"]}');
        res.status(200).send(json_obj[0])
      } else {
        // Invalid format parameter
        res.status(400).send('Invalid format parameter');
      } 
    }
  })
});

// 2. for questionnaire upload
app.post('/intelliq_api/admin/questionnaire_upd', (req, res) => {
  const filename =  Date.now() + '-' + req.files.file.name;
  const md5 = req.files.file.md5;
  const saveAs = `${md5}_${filename}`;
  req.files.file.mv(`${__dirname}/public/${saveAs}`,(err)=>{
    if(err){
      return res.send(err);
    } else {
      const fs = require('fs');
      const readableStream = fs.createReadStream("./public/"+saveAs.toString());
      readableStream.on('data', (chunk) => {
        str = chunk.toString();
        json_data = JSON.parse(str);
        var q_id = json_data["questionnaireID"];
        var q_title = json_data["questionnaireTitle"];
        var member_id = req.body.member_id;
        //console.log(json_data["questions"][0]["qID"]);

        var keywords = "";
        for(const i in json_data["keywords"]) {
          keywords +=  json_data["keywords"][i]+", ";
        }

        keywords = keywords.slice(0, -2);
        db.query(
          "INSERT INTO questionnaire_form VALUES (?,?,?,?)", [q_id,q_title,keywords,member_id], (err, result) => {
            if(err) {
              res.send(400, err);
              console.log(err);
            } else {
              console.log(result);
              for(const i in json_data["keywords"]) {
                db.query(
                  "INSERT INTO keyword VALUES (?,?)", [json_data["keywords"][i],q_id], (err1, result1) => {
                    if(err1) {
                      console.log(err1);
                      res.send(400, err1);
                    } else console.log(result1);
                  }
                )
              }
              for(const i in json_data["questions"]) {
                var question_id = q_id+json_data["questions"][i]["qID"];
                var q_text = json_data["questions"][i]["qtext"]
                var required = json_data["questions"][i]["required"]
                var type = json_data["questions"][i]["type"]

                db.query(
                  "INSERT INTO question VALUES (?,?,?,?)", [question_id,q_text,required,type], (err1, result1) => {
                    if(err1) {
                      console.log(err1);
                      res.send(400, err1);
                    } else {
                      console.log(result1);
                      for(const j in json_data["questions"][i]["options"]) {
                        var optID = q_id+json_data["questions"][i]["options"][j]["optID"]
                        if(optID.length>10) optID = optID.slice(0, -1);
                        var opttxt = json_data["questions"][i]["options"][j]["opttxt"]
                        var nextqID = q_id+json_data["questions"][i]["options"][j]["nextqID"]     
                        var question_id = q_id+json_data["questions"][i]["qID"];
                        db.query(
                          "INSERT INTO _options VALUES (?,?,?)", [optID,opttxt,nextqID], (err2, result2) => {
                            if(err2) {
                              console.log(err2);
                              res.send(400, err2);
                            } else console.log(result2);
                          }
                        )
                        db.query(
                          "INSERT INTO form_opt_and_questions VALUES (?,?,?)", [q_id,question_id,optID], (err2, result2) => {
                            if(err2) {
                              console.log(err2);
                              res.send(400, err2);
                            } else {
                              console.log(question_id," ",result2);
                            }
                            res.end("200");
                          }
                        )
                      }
                    }
                  }
                )

              }
            } 
          }
        )
      })
      
    }
  });
});

// 3. reset everything
app.get('/intelliq_api/admin/resetall', function(req, res, next) {
  db.ping((err) => {
    if(err) {
      console.log('{"status":"failed", "reason": '+ err +'}');
      return res.json([
        {
          "status":"failed", 
          "reason": err
        }
      ])
    }
    console.log('{"status":"OK"}');
    res.json([
      {
        "status":"OK", 
      }
    ])
  })
});

// 4. Reset all answers of a questionaire
app.post('/intelliq_api/admin/resetq/:questionnaireID', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  db.query(
    "DELETE FROM ans_consist_of \
     WHERE _session IN ( \
     SELECT _session FROM questionnaire_answer \
     WHERE questionnaire_id = ?",
     [questionnaireID], (err, result) => {
      if(err) {
        console.log('{"status":"failed", "reason": '+ err +'}');
        return res.json([
        {
          "status":"failed", 
          "reason": err
        }
        ])     
      }
      else {
        db.query(
          "DELETE FROM questionnaire_answer \
           WHERE questionnaire_id = ?"
          [questionnaireID], (err, result) => {
                  if(err) {
                    console.log('{"status":"failed", "reason": '+ err +'}');
                    return res.json([
                      {
                        "status":"failed", 
                        "reason": err
                      }
                    ])
                  }
                  console.log('{"status":"OK"}');
                  res.json([
                    {
                      "status":"OK", 
                    }
                  ])
                  }
            )
          }
        }
  )
});

// 5. Insert or update user


// 6. view a user's data
app.get('/intelliq_api/admin/users/:username', function(req, res, next) {
  const email = req.params.username;
  const format = req.query.format;

  db.query(
    "SELECT * FROM member WHERE email = ?", [email], (err, result) => {
      if(err) {
        console.log(err)
      }
      
      jsonstring = JSON.stringify(result)
      json_result =JSON.parse(jsonstring)

      if(format==='csv') {
        // Define the CSV header and columns
        const csvHeader = 'member id, mstatus, First Name, Last_Name, email, password, Gender, Date of Birth';
        const values = json_result.map(obj => Object.values(obj));
        console.log(values)
        // Convert the list of values to a comma-separated string
        const csvString = values.map(row => row.join(',')).join('\n');
        const csv_result = csvHeader + '\n' + csvString;
        console.log(csv_result)
        
        res.status(200).send(csv_result);
      } else if(format==='json' || format===undefined) {
        json_result = json_result[0];
        res.send(json_result);
        console.log(json_result);
      } else {
        // Invalid format parameter
        res.status(400).send('Invalid format parameter');
      }    
    }
  )
});


// Backend endpoints, mandatory
// a) get all questions for specific questionnaire
app.get('/intelliq_api/questionnaire/:questionnaireID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  const format = req.query.format;

  db.query(
    "SELECT * \
     FROM question \
     WHERE qid in ( SELECT qid \
                   FROM form_opt_and_questions \
                   WHERE questionnaire_id = ?)", 
      [questionnaire_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        db.query(
          "SELECT questionnaire_id,questionnaire_title \
           FROM questionnaire_form \
           WHERE questionnaire_id = ?", 
            [questionnaire_id], (err, result1) => {
            if(err) {
              console.log(err)
              res.send({err: err})
            }
            else {
              db.query(
                "SELECT key_word \
                FROM keyword \
                WHERE questionnaire_id = ?", 
                  [questionnaire_id], (err, result2) => {
                  if(err) {
                    console.log(err)
                    res.send({err: err})
                  }
                  else {
                    // below we change the three responses to create the result that is asked
                    jsonstring = JSON.stringify(result)
                    json_questions =JSON.parse(jsonstring)

                    jsonstring1 = JSON.stringify(result1)
                    json_everything =JSON.parse(jsonstring1)

                    jsonstring2 = JSON.stringify(result2)
                    json_keywords =JSON.parse(jsonstring2)

                    json_everything[0]["keywords"] = [];
                    var counter = 0;
                    for(const j in json_keywords) {
                      json_everything[0]["keywords"].push(json_keywords[counter]["key_word"]);
                      counter = counter + 1;
                    }

                    const values_csv = json_everything.map(obj => Object.values(obj)); // help for csv
                    json_everything[0]["questions"] = [];
                    var counter = 0;
                    for(const j in json_questions) {
                      json_questions[counter]["qid"] = json_questions[counter]["qid"].slice(5, 8)
                      json_everything[0]["questions"].push(json_questions[counter]);
                      counter = counter + 1;
                    }
    
                    if(format==='csv') {
                      const csvHeader1 = 'questionnaire_id, questionnaire_title, keywords';
                      const csvHeader2 = 'qid, qtext, required, qtype';

                      console.log(values_csv)
                      // Convert the list of values to a comma-separated string
                      const csvString = values_csv.map(row => row.join(',')).join('\n');

                      const json_questions = json_everything[0]["questions"];
                      console.log(json_questions)
                      const values = json_questions.map(obj => Object.values(obj)); 
                      const csvString_questions = values.map(row => row.join(',')).join('\n');
                      const csv_result = csvHeader1 + '\n' + csvString + '\n' + csvHeader2 + '\n' + csvString_questions;
                      console.log(csv_result)
                      
                      res.status(200).send(csv_result);
                    } else if(format==='json' || format===undefined) {
                      final = json_everything[0];
                      console.log(final);
                      res.send(final);
                    } else {
                      // Invalid format parameter
                      res.status(400).send('Invalid format parameter');
                    }     
                  }
                }
              )
            }
          }
        )
      }
    }
  )
});

// b) Get data of a specific question of a specific questionnaire 
app.get('/intelliq_api/question/:questionnaireID/:questionID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  const questionID = questionnaire_id + req.params.questionID; 

  db.query(
    "SELECT * \
     FROM _options \
     WHERE optid in ( SELECT optid \
                   FROM form_opt_and_questions \
                   WHERE questionnaire_id = ? and qid = ?)", 
      [questionnaire_id,questionID], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        db.query(
          "SELECT distinct questionnaire_id,Q.qid,qtext,required,qtype \
           FROM question as Q  \
           LEFT JOIN form_opt_and_questions as F\
           ON Q.qid = F.qid \
           WHERE Q.qid = ?", 
            [questionID], (err, result1) => {
            if(err) {
              console.log(err)
              res.send({err: err})
            }
            else {
              jsonstring = JSON.stringify(result)
              json_options =JSON.parse(jsonstring)

              jsonstring1 = JSON.stringify(result1)
              json_everything =JSON.parse(jsonstring1)

              console.log(json_options);
              console.log(json_everything);

              json_everything[0]["options"] = [];
              var counter = 0;
              for(const j in json_options) {
                json_options[counter]["optid"] = json_options[counter]["optid"].slice(5, 10)
                json_options[counter]["nextqid"] = json_options[counter]["nextqid"].slice(5, 8)
                json_everything[0]["options"].push(json_options[counter]);
                counter = counter + 1;
              }
              
              final = json_everything[0];

              final["qid"] = final["qid"].slice(5,8);

              console.log(final);
              res.send(final);
            }
          }
        )
      }
    }
  )
});

// c) post option to question for specific questionnaire and session
app.post('/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  const questionID = questionnaire_id + req.params.questionID;  
  const session = req.params.session;
  const optid = req.params.optionID;

  db.query(
    "INSERT INTO questionnaire_answer VALUES (?,?)", 
      [session,questionnaire_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
      }
    }
  )
  db.query(
    "INSERT INTO ans_consist_of VALUES (?,?,?)", 
      [session,questionID,optid], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
      }
    }
  )
});

// d) Get answers for specific questionnaire and specific session
app.get('/intelliq_api/getsessionanswers/:questionnaireID/:session', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  const session = req.params.session;
  db.query(
    "SELECT qid, optid \
     FROM ans_consist_of AS A \
     LEFT JOIN questionnaire_answer AS Q \
     ON A._session = Q._session \
     WHERE A._session = ?", 
      [session], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        jsonstring = JSON.stringify(result)
        json_result =JSON.parse(jsonstring)

        const others = {
          questionnaireID: questionnaireID,
          session: session
        };

        jsonstring_others = JSON.stringify(others)
        json_others =JSON.parse(jsonstring_others)

        json_others["answers"] = [];

        var counter = 0;
        for(const j in json_result) {
          json_result[counter]["qid"] = json_result[counter]["qid"].slice(5, 8);
          json_result[counter]["optid"] = json_result[counter]["optid"].slice(5, 10);
          json_others["answers"].push(json_result[counter]);
          counter = counter + 1;
        }

        res.send(json_others);
      }
    }
  )
});

// e) Get answers for specific questionnaire and specific question
app.get('/intelliq_api/getquestionanswers/:questionnaireID/:questionID', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  const questionID = questionnaireID + req.params.questionID;

  db.query(
    "SELECT A._session,optid \
     FROM questionnaire_answer as Q \
     LEFT JOIN ans_consist_of as A \
     ON Q._session = A._session \
     WHERE Q.questionnaire_id = ? AND A.qid = ?", 
      [questionnaireID,questionID], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);

        jsonstring = JSON.stringify(result)
        json_result =JSON.parse(jsonstring)

        const others = {
          questionnaireID: questionnaireID,
          questionID: questionID
        };

        jsonstring_others = JSON.stringify(others)
        json_others =JSON.parse(jsonstring_others)

        json_others["questionID"] = json_others["questionID"].slice(5,8);
        json_others["answers"] = [];

        var counter = 0;
        for(const j in json_result) {
          json_result[counter]["optid"] = json_result[counter]["optid"].slice(5, 10);
          json_others["answers"].push(json_result[counter]);
          counter = counter + 1;
        }

        res.send(json_others);
      }
    }
  )
});


//
// Below are the endpoints created for frontend usage
//
// Get all the questionnaires available
app.get('/intelliq_api/questionnaires', function(req, res, next) {
  const id = req.body.id;
  db.query(
    "SELECT * FROM questionnaire_form", [id], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get all the questionnaires available with specific keyword
app.get('/intelliq_api/questionnaires/:keyword', function(req, res, next) {
  const keyword = req.params.keyword;
  db.query(
    "SELECT * \
    FROM questionnaire_form \
    WHERE questionnaire_id in (SELECT questionnaire_id \
                               FROM keyword \
                               WHERE key_word = ? ) ", [keyword], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get all the questionnaires of a user
app.post('/intelliq_api/admin/questionnaires', function(req, res, next) {
  const id = req.body.id;
  db.query(
    "SELECT * FROM questionnaire_form WHERE member_id = ?", [id], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get attributes of only one questionnaire
app.get('/intelliq_api/admin/:questionnaireID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  db.query(
    "SELECT * \
     FROM questionnaire_form \
     WHERE questionnaire_id = ?", 
      [questionnaire_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get questions of a specific questionnaire
app.get('/intelliq_api/admin/questionnaire/:questionnaireID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  db.query(
    "SELECT distinct Q.qid, qtext, required, qtype \
     FROM question as Q \
     LEFT JOIN form_opt_and_questions as F \
     ON Q.qid = F.qid \
     WHERE questionnaire_id = ?", 
      [questionnaire_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get options of specific question for specific questionnaire
app.get('/intelliq_api/admin/question/:questionnaireID/:questionID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  const qid = req.params.questionID;
  console.log(qid)
  db.query(
    "SELECT * \
     FROM _options \
     WHERE optid in ( SELECT optid \
                   FROM form_opt_and_questions \
                   WHERE questionnaire_id = ? and qid = ?)", 
      [questionnaire_id,qid], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get attributes of only one question
app.get('/intelliq_api/admin/question/:questionID', function(req, res, next) {
  const question_id = req.params.questionID;
  db.query(
    "SELECT * \
     FROM question \
     WHERE qid = ?", 
      [question_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get answers for specific questionnaire and specific question (for stats)
app.get('/intelliq_api/admin/answers/:questionnaireID/:questionID', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  const questionID = req.params.questionID;
  db.query(
    "SELECT N.qid,O.optid,opttext, num \
     FROM (SELECT distinct qid,optid, (SELECT count(*) \
                                       FROM (SELECT A._session,qid,optid \
                                             FROM questionnaire_answer as Q \
                                             LEFT JOIN ans_consist_of as A \
                                             ON Q._session = A._session \
                                             WHERE Q.questionnaire_id = ?) as B \
                                       WHERE ans_consist_of.qid = B.qid and ans_consist_of.optid = B.optid) as num \
                                       FROM ans_consist_of) as N \
    LEFT JOIN _options as O \
    ON O.optid = N.optid \
    WHERE N.qid = ?", 
      [questionnaireID,questionID], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// Get answers for specific questionnaire
app.get('/intelliq_api/admin/answers/:questionnaireID', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  db.query(
    "SELECT N.qid,O.optid,opttext, num \
     FROM (SELECT distinct qid,optid, (SELECT count(*) \
                                       FROM (SELECT A._session,qid,optid \
                                             FROM questionnaire_answer as Q \
                                             LEFT JOIN ans_consist_of as A \
                                             ON Q._session = A._session \
                                             WHERE Q.questionnaire_id = ?) as B \
                                       WHERE ans_consist_of.qid = B.qid and ans_consist_of.optid = B.optid) as num \
                                       FROM ans_consist_of) as N \
    LEFT JOIN _options as O \
    ON O.optid = N.optid", 
      [questionnaireID], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result);
        res.send(result);
      }
    }
  )
});

// get questions and options for a specific questionnaire
app.get('/intelliq_api/doanswer2/:questionnaireID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  db.query(
    "SELECT qid,qtext,required,qtype,o.optid,opttext,nextqid \
     FROM (SELECT q.qid,qtext,required,qtype,optid \
           FROM question as q \
           LEFT join form_opt_and_questions as f \
           on q.qid = f.qid \
           WHERE questionnaire_id = ?) as mid \
     LEFT JOIN _options as o \
     on o.optid = mid.optid", 
      [questionnaire_id], (err, result) => {
      if(err) {
        console.log(err)
        res.send({err: err})
      }
      else {
        console.log(result[0]);
        res.json(result);
      }
    }
  )
});


/*

"SELECT * \
    FROM _options \
    WHERE optid in (SELECT optid \
                    FROM form_opt_and_questions \
                    WHERE questionnaire_id = ?)"

//route setup for homepage
app.get('/intelliq_api', (req, res) =>{
    res.render('../views/index.ejs')
})

// set view engine
app.set("view engine","ejs")

// load assets
//app.use(express.static(path.resolve(__dirname,"assets")))

// Routes
const viewRoutes = require('./routes/routes');
app.use('/',viewRoutes);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage});
app.post('/upload',upload.single('file'), (req, res) => {
  upload(req, res, (err) => {
      if (err) {
          return res.status(500).json(err)
      }

      return res.status(200).send(req.files)
  })
});




var when = function() {
          var args = arguments;  // the functions to execute first
          return {
            then: function(done) {
              var counter = 0;
              for(var i = 0; i < args.length; i++) {
                // call each function with a function to call on done
                args[i](function() {
                  counter++;
                  if(counter === args.length) {  // all functions have notified they're done
                    done();
                  }
                });
              }
            }
          };
        };
        when(
          function(done) {
            for(const i in result){
              questionnaire_id = result[i]["questionnaire_id"]
              db.query(
                "SELECT key_word FROM keyword WHERE questionnaire_id = ?", [questionnaire_id], (err1, result1) => {
                  if(err1) {
                    console.log(err1)
                  } else{
                    var keywords = "";
                    for(const j in result1){
                      keywords += result1[j]["key_word"]+", ";
                    }
                    keywords = keywords.slice(0, -2);
                    result[i]["keyword"] = keywords;
                    console.log(result);
                  }
                }
              )
            }
            done();
          }).then(function() {
            console.log(result);
            res.send(result);
        });      
*/
