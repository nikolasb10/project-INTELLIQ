const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fileUpload = require("express-fileupload");

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

// for file upload
app.post('/intelliq_api/upload/:member_id', (req, res) => {
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
        console.log(str);
        json_data = JSON.parse(str);
        var q_id = json_data["questionnaireID"];
        var q_title = json_data["questionnaireTitle"];
        var member_id = req.params.member_id;
        //console.log(json_data["questions"][0]["qID"]);
        var keywords = "";
        for(const i in json_data["keywords"]) {
          keywords +=  json_data["keywords"][i]+", ";
        }
        keywords = keywords.slice(0, -2);
        db.query(
          "INSERT INTO questionnaire_form VALUES (?,?,?,?)", [q_id,q_title,keywords,member_id], (err, result) => {
            if(err) {
              console.log(err);
            } else {
              console.log(result);
              for(const i in json_data["keywords"]) {
                db.query(
                  "INSERT INTO keyword VALUES (?,?)", [json_data["keywords"][i],q_id], (err1, result1) => {
                    if(err1) {
                      console.log(err1);
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
                            } else console.log(result2);
                          }
                        )
                        db.query(
                          "INSERT INTO form_opt_and_questions VALUES (?,?,?)", [q_id,question_id,optID], (err2, result2) => {
                            if(err2) {
                              console.log(err2);
                            } else console.log(question_id," ",result2);
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
  //console.log(req.files);
});

app.get('/intelliq_api/admin/healthcheck', function(req, res, next) {
  db.ping((err) => {
    if(err) {
      console.log('{"status":"failed", "dbconnection": ["localhost","root","softeng_mysql","intelliq22","true"]}');
      return res.json([
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
    console.log('{"status":"OK", "dbconnection": ["localhost","root","softeng_mysql","intelliq22","true"]}');
    res.json([
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
    ])
  })
});

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

app.get('/intelliq_api/admin/users/:username', function(req, res, next) {
  const id = req.params.username;
  db.query(
    "SELECT * FROM member WHERE member_id = ?", [id], (err, result) => {
      if(err) {
        console.log(err)
      }
      res.send(result);
      console.log(result);
    }
  )
});

// Get all the questionnaires available
app.post('/intelliq_api/questionnaires', function(req, res, next) {
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
app.post('/intelliq_api/questionnaires/:keyword', function(req, res, next) {
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

// get all questions for specific questionnaire
app.get('/intelliq_api/admin/questionnaire/:questionnaireID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
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

// Get data of a specific question of a specific questionnaire 
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

// Get answers for specific questionnaire
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

app.post('/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID', function(req, res, next) {
  const questionnaire_id = req.params.questionnaireID;
  const q_id = req.params.questionID;
  const session = req.params.session;
  const optid = req.params.optionID;
  console.log(optid)

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
      [session,q_id,optid], (err, result) => {
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

// Get answers for specific questionnaire and specific question
app.get('/intelliq_api/getquestionanswers/:questionnaireID/:questionID', function(req, res, next) {
  const questionnaireID = req.params.questionnaireID;
  const questionID = req.params.questionID;
  db.query(
    "SELECT A._session,questionnaire_id,qid,optid \
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
        res.send(result);
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
