/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import { Dialog, DialogTitle, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles= theme=>({
    progress:{
        margin:theme.spacing.unit*2,
    },
});

 class AlertDialog extends Component{
    state={
        open:false
    }
    componentDidMount(){
        this.setState({
            open:this.props.open
        });
    }
    render(){
        const {title,message,open,classes}=this.props;
        return(
            <Dialog open={open} onClose={()=>this.setState({open})}>
                <DialogTitle>{title}</DialogTitle>
                <div style={{flexDirection:"column",}}>
                    <center>
                        <CircularProgress className={classes.progress}/>
                    </center>
                    <center>
                        <marquee>{message}</marquee>
                    </center>
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AlertDialog);