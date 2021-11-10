import React, { useState, useContext, useEffect } from 'react'
import {Form, Button} from "react-bootstrap"
import Path from 'path';

import funcs, { isStorageConfigured } from './azureBlob';
import Axios from 'axios'
import { LoginContext } from '../Contexts/LoginContext'

// const serverURL = "http://localhost:8000/upload"

const serverURL = 'http://localhost:3001/uploadmetadata';
const serverURL2 = 'http://localhost:3001/deletefile';
const serverURL3 = 'http://localhost:3001/downloadBlob';

// const storageConfigured = isStorageConfigured();

const FileUpload = (props) => {
    const {USERNAME} = useContext(LoginContext);

    const storageConfigured = isStorageConfigured(USERNAME);

    const [ username, setUsername ] = useState("");
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ loaded, setLoaded ] = useState(null);

    console.log(USERNAME);
  

    const [error, setError] = useState("");
    const [blobList, setBlobList] = useState([]);
    const [fileSelected, setFileSelected] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [inputKey, setInputKey] = useState(Math.random().toString(36));

    const handleDelete = file => {

      Axios.post(serverURL2, {
        username: USERNAME,
        filename: file
      }).then((res) => {
        if (res.data.deleted) {
          onShowFiles();
        }
        setError(res.data.error);
      }).catch((err) => {
        console.log(err)
        setError(err)
      })
    }

    const handleDownload = file => {
      Axios.post(serverURL3, {
        username: USERNAME,
        filename: file
      }).then((res) => {
        if (res.data.downloaded) {
          window.alert("Download completed! in folder c:/az....")
        }
      })
    }
    

    const handleMetadata = () => {
      // console.log("yo!", email, username, phonenumber);
        Axios.post(serverURL , {
          username: USERNAME,
          filename: fileSelected.name
        }).then((res) => {
          setError(res.data.error);
        }).catch((err) => {
          console.log(err);
          setError(err);
        })
    }

    const onFileChange = (event) => {
        console.log(event.target.files[0].name);
        setFileSelected(event.target.files[0]);
    }

    const onShowFiles = async () => {
      const blobsInContainer = await funcs.listFiles();
      setBlobList(blobsInContainer);
    }

    const onFileUpload = async () => {
        // prepare UI
        setUploading(true);
    
        // *** UPLOAD TO AZURE STORAGE ***
        const blobsInContainer = await funcs.uploadFileToBlob(fileSelected);
    
        // prepare UI for results
        setBlobList(blobsInContainer);
    
        // reset state/form
        setFileSelected(null);
        setUploading(false);
        setInputKey(Math.random().toString(36));
        handleMetadata();
    }

    const DisplayForm = () => (
        <div>
            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control type="file" onChange={onFileChange} key={inputKey || ''} />
            </Form.Group>
          {/* <input type="file" onChange={onFileChange} key={inputKey || ''} /> */}
            <div>
            <Button variant="secondary" onClick={onFileUpload} style={{maxWidth:"700px", marginLeft:"Auto", marginRight:"40px"}}>
                Upload
            </Button>{' '}
            <Button variant="success" onClick={onShowFiles} style={{maxWidth:"700px", marginLeft:"Auto", marginRight:"Auto"}}>
                Show Files in Storage
            </Button>{' '}
            </div>
          {/* <button type="submit" onClick={onFileUpload}>
            Upload!
          </button> */}
        </div>
    )

    const DisplayImagesFromContainer = () => (
        <div>
          <h2>Container items</h2>
          <br />
          <ul>
            {blobList.map((item) => {
              return (
                <li key={item}>
                  <div className="d-flex " style={{fontSize:"18px"}}>
                    {Path.basename(item)} 
                    <div className="d-flex justify-content-end flex-grow-1">
                    <Button className="mt-0 mb-0 mr-3 pt-0 pb-0" variant="outline-success" onClick={() => handleDownload(Path.basename(item))}>Download</Button>{' '}
                    <Button className="mt-0 mb-0 pt-0 pb-0" variant="outline-danger" onClick={() => handleDelete(Path.basename(item))}>
                      Delete
                    </Button>{' '}
                    </div>
                    {/* <img src={item} alt={item} height="200" /> */}
                  </div>
                  <hr />
                </li>
              );
            })}
          </ul>
        </div>
    )

    // const changeHandler = (e) => {
    //     console.log(e.target.files[0])
    //     setSelectedFile(e.target.files[0])
    //     setLoaded(0);
    // }
    
    // const onClickHandler = () => {
    //     const data = new FormData() 
    //     data.append('file', selectedFile)
    //     axios.post(serverURL, data, {

    //     }). then(res => {
    //         console.log(res.statusText);
    //     })
    // }


    return (
        <>
        <div className="d-flex flex-column">
            <h4>Welcome, {USERNAME}</h4>
            {storageConfigured && !uploading && DisplayForm()}
            {storageConfigured && uploading && <div>Uploading</div>}
            <hr />
            {storageConfigured && DisplayImagesFromContainer()}
            {/* {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()} */}
            {!storageConfigured && <div>Storage is not configured.</div>}            
        </div>
        </>
    )
}

export default FileUpload
