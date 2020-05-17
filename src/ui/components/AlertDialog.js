/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import { Dialog, DialogTitle, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from "graphql-tag";
import { Subscription } from 'react-apollo';


const NOTIFICATION=gql`
    subscription newNotification{
        newNotification{
            id,
        message
        }
        
    }
`;

const styles= theme=>({
    progress:{
        margin:theme.spacing.unit*2,
    },
});

 class AlertDialog extends Component{
    state={
        open:false,
        nbEnvoyer:0,
        
    }
    componentDidMount(){
        this.setState({
            open:this.props.open,
            nbEnvoyer:0
        });
    }
    componentDidUpdate(props){
        if(props.shouldClose && this.state.open){
            setTimeout(()=>{
                this.setState({
                    open:false,
                })
            },1000)
        }
    }
    componentWillUnmount(){
        this.setState({
             nbEnvoyer:0
        }); 
    }
    render(){
        const {title,message,open,classes}=this.props;
        console.log(this.state);
        return(
            <Dialog open={open} onClose={()=>this.setState({open})}>
                <DialogTitle>{title}</DialogTitle>
                <Subscription 
                    subscription={NOTIFICATION}
                    onSubscriptionData={
                        ()=>{
                            this.setState({
                                nbEnvoyer:this.state.nbEnvoyer+1
                            });
                        }
                    }
                    fetchPolicy="cache-and-network"
                >
                {
                    ({data,loading})=>{
                        console.dir(data);
                        return (
                            <div style={{flexDirection:"column",}}>
                            <center>
                                <CircularProgress className={classes.progress}/>
                            </center>
                            <div styles={{textAlign:'center'}}>
                                <center>
                                    <p>{`${this.state.nbEnvoyer}/${this.props.totalSms} envois`}</p>
                                    <p>{`${loading?'':data.newNotification.message}`}</p>
                                </center>
                            </div>
                            <center>
                                <marquee>{message}</marquee>
                            </center>
                        </div>
                        );
                    }
                       
                    
                }
                
                </Subscription>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AlertDialog);