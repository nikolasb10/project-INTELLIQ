import {React, useState} from 'react';
import {Link,Navigate} from 'react-router-dom'
import '../css/AvailableQuest.css';
import axios from 'axios'
import { useForm } from "react-hook-form";
import FormData from 'form-data'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    axios.post("http://localhost:9103/intelliq_api/admin/questionnaire_upd/",data,{member_id: user.member_id})
      .then((response) => {
                console.log(response)
                if(response.status=='200'){
                  toast.success("Questionnaire Uploaded",{
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                    console.log('Upload Success');
                }            
            })
            .catch(error => {
              console.log(error.response);
              toast.error(error.response.data.sqlMessage,{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            });
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
        <br/><br/>
        <button onClick={onUpload}>Upload</button>
      </div>
      <ToastContainer />
    </div>
  )}
}

export default Questionnaire_upd;
