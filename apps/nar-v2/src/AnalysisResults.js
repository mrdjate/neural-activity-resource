import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';



const AN_EXAMPLE = false;
const baseUrl ="https://neural-activity-resource.brainsimulation.eu/analyses/?attributed_to=Davison&size=10";
/*"https://neural-activity-resource.brainsimulation.eu"*/


function get_analysis(auth) {
    let url = baseUrl /*+ "/analyses/"*/
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    console.log("Getting analysis from " + url); //1
    return axios.get(url, config) 

}

function getFile(tab)
{
  var i=0;
  let theOutput = [];
      
      while( i < tab.length) {
        
        
        theOutput.push(tab[i])
        i++
  
      }
      return theOutput
}

function linkRewriter(linkToRewrite)
{
    /*var myRe = https:\/\/github.com\/(?<project>[a-zA-Z]+\/[a-zA-Z]+)\/blob\/(?<path>\S+);*/
    var url = linkToRewrite;
     

    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = urlParts[0];
    
    urlParts[0] = "raw.githubusercontent.com";
    
    
    var urlRaw = urlParts.unshift('https:/');
    var removeBlob = urlParts.splice(4,1);
    urlRaw=urlParts.join("/");
    
    
    return urlRaw 
}


const useStyles = makeStyles ((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    cardGrid:{
        paddingTop: '32px',
        paddingBottom: '32px',

    },
    cardContent: {
        flexGrow: 1,
      },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    paragraph: {
        fontSize: 16,
      fontWeight: 'lighter',
    },

  }));


function AnalysisResults(props) {

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const classes = useStyles();

    
    useEffect(()=> {
        if(AN_EXAMPLE) {
            console.log("todoom");
        } else {
        setLoading(true)
        get_analysis(props.auth)
        .then(
        results => {
            console.log(results.data);
            setAnalyses(results.data);
            setLoading(false);
        } 
        ).catch( error => {
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
            
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                    {
                    analyses.map((analyse, index) => 
                    <Grid item key={index} xs={12} sm={6} md={4}>
                    
                        <Card className={classes.card} >
                            
                            <CardContent className={classes.cardContent}>
                                    <Typography className={classes.title} >
                                    {analyse.id}
                                    </Typography>
                                    <Typography className={classes.paragraph} >
                                    {analyse.description}
                                    </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton href={analyse.code.location} target="_blank" color="primary">
                                    <OpenInNewIcon /> 
                                </IconButton>     
                                <div>
                                {
                                    getFile(analyse.outputs).map(
                                    (outputs, index) => 
                                    {

                                    return (
                                        <a key={index} href={outputs.download_url} target="_blank" rel="noopener noreferrer" download>
                                            <Button>
                                                <i className="fas fa-download"/>
                                                Download File
                                            </Button>
                                        </a> ) ;
                                    },) 
                                }
                                </div> 
                            </CardActions>
                            {
                                console.log("card here"),
                                
                                <Typography component ='span' >
                                
                                <div>{console.log(linkRewriter(analyse.code.location)) }</div>    
                                
                                </Typography>
                            }    
                        </Card> 
                    </Grid>       
                    )} 
                    </Grid> 
                </Container> 
        );    
    }
                        

    

}

export default AnalysisResults