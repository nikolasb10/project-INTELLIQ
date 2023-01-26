import {React, useState} from 'react';
import {Link,Navigate} from 'react-router-dom'
import '../css/AvailableQuest.css';
import axios from 'axios'
import { useForm } from "react-hook-form";
import FormData from 'form-data'

function Questionnaire_upd({user, setUser}){
  const [file, setFile] = useState({
      selectedFile: null
  });
  const [loading, setLoading] = useState({
      Loading: null
  });

  const onInputChange = (e) => {
    setFile({selectedFile: e.target.files[0]});
    setLoading({Loading: null});
  };

  const onUpload = (e) => {
    console.log(file)
    e.preventDefault();
    const data = new FormData();
    data.append('file',file.selectedFile,file.selectedFile.name);
    console.log(data)
    axios.post("http://localhost:3000/upload/"+user.member_id,data,{
        onUploadProgress: (ProgressEvent) => {
          setLoading({ Loading: (ProgressEvent.loaded / ProgressEvent.total) * 100});
        }
      })
      .then((response) => {
                console.log('Upload Success');
            })
            .catch((response) => {
                console.log('Upload Error')
            })
    setFile({selectedFile: null});
  }

  if(user.First_Name=="") {
    return <Navigate replace to="/intelliq_api/login"/>;
  } else {
  return (
    <div className="questionnaires">
      <h2> Upload a new questionnaire <span>{user.First_Name}!</span></h2>
      <Link to='/intelliq_api/login'>
        <button>Back</button><br/><br/><br/><br/>
      </Link>
      <div className="letters">
        <label> Select File </label>
        <input  id="file" type="file" name="file" onChange={onInputChange}/>
        <span>{Math.round(loading.Loading)}%</span>
        <br/><br/>
        <button onClick={onUpload}>Upload</button>
      </div>
    </div>
  )}
}

export default Questionnaire_upd;
