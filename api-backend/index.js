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

app.listen(3000,()=>console.log('Express server is running'));

// create connection and export it
var db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'softeng_mysql',
  database: 'intelliq22',
  multipleStatements: true
});

module.exports = { db };

// for file upload
app.post('/upload/:member_id', (req, res) => {
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
        //var keywords = [];
        
        db.query(
          "INSERT INTO questionnaire_form VALUES (?,?,?)", [q_id,q_title,member_id], (err, result) => {
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
                var question_id = json_data["questions"][i]["qID"]
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
                        var optID = json_data["questions"][i]["options"][j]["optID"]
                        var opttxt = json_data["questions"][i]["options"][j]["opttxt"]
                        var nextqID = json_data["questions"][i]["options"][j]["nextqID"]     

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
                            } else console.log(result2);
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

app.get('/admin/healthcheck', function(req, res, next) {
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

app.get('/admin/resetall', function(req, res, next) {
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

app.post('/login', function(req, res, next) {
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

app.get('/admin/users/:username', function(req, res, next) {
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

app.post('/admin/questionnaires', function(req, res, next) {
  const id = req.body.id;
  console.log(id);
  db.query(
    "SELECT * FROM questionnaire_form WHERE member_id = ?", [id], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      res.send(result);
      console.log(result);
    }
  )
});


/*
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
*/
