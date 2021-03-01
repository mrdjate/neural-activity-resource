import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';


const AN_EXAMPLE = false;
const baseUrl ="https://neural-activity-resource.brainsimulation.eu"; 



function get_data(auth) {
    let url = baseUrl + "/recordings/"  
    
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    console.log("Getting data from " + url); //1
    return axios.get(url,  config) 

}




export default function PatchClampDetails(props) {

  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(()=>{
    if(AN_EXAMPLE){
      console.log("nnnn");
    }else{
      setLoading(true)
      get_data(props.auth)
      .then( results => {
        console.log(results.data.results)
        /*console.log(results.data.results.identifier)*///undefined
        setLoading(false)
        setRecordings(results.data.results)
      }
      ).catch(error => {
        console.log('Error', error.message);
    });
    }
  }, [])
  if(loading) {
    console.log("loading...")
    return(
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '200px'}}>
            <CircularProgress />
        </div>
    );


} else {

    return (
      <ul>
        <li>
          {
            recordings.map((recording, index)=>
            <div>
              {recording.identifier} <br/>
              {recording.label} <br/>
              {recording.modality} <br/>
              {recording.part_of.name} <br/>           
            </div>         
            )              
          }   
        </li>  
      </ul>    
          
    
    );
  } 
}