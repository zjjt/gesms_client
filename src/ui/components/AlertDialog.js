/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';

export default class AlertDialog extends Component{
    state={
        open:false
    }
    render(){
        const {title,message,open}=this.props;
        return(
            <Dialog open={this.state.open} onClose={()=>this.setState({open})}>
                <DialogTitle>{title}</DialogTitle>
                <div>
                    <center>
                        <p>{message}</p>
                    </center>
                </div>
            </Dialog>
        );
    }
}