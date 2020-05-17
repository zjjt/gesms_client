/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import {ValidatorForm,SelectValidator} from 'react-material-ui-form-validator';
import Paper from '@material-ui/core/Paper';
import {withStyles, Typography} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import {Redirect} from 'react-router-dom';
import MenuItem from'@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import {Mutation,Query} from "react-apollo";
import gql from "graphql-tag";


const chooseSmsProvider=gql`
   mutation chooseSmsProvider($provider:String!){
    chooseSmsProvider(provider:$provider)
  }
`;
class SelectProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidated: false,
            provider: '',
            changeRoute:null
        };
    }
    changeProvider(e) {
        this.setState({provider: e.target.value});
    }
    submitForm() {
        console.dir(this.state);
        this.forceUpdate();
          document.getElementById("#subBtn").click();

    }
    render() {
        const {classes} = this.props;
        const {provider}=this.state;
        return (
            
            <main className={classes.main}>
            {this.state.changeRoute}
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>https</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Choisissez un API
                    </Typography>
                    <ValidatorForm
                        ref={el=>this.form=el}
                        onSubmit={this
                        .submitForm
                        .bind(this)}
                        onError={errors => console.log(errors)}>
                        <div>
                        <FormControl margin="normal" required fullWidth>
                            <Tooltip title="le fournisseur de service sms">
                                <SelectValidator
                                    label="API SMS"
                                    value={this.state.provider}
                                    name="expeditor"
                                    validators={['required']}
                                    onChange={this
                                    .changeProvider
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}
                                    >
                                    <MenuItem value="ORANGE">ORANGE</MenuItem>
                                    <MenuItem value="MTN">MTN</MenuItem>
                                    <MenuItem value="SYMTEL">SYMTEL</MenuItem>
                                    </SelectValidator>
                                </Tooltip>
                            </FormControl> 
                        </div>
                        <Mutation
                        mutation={chooseSmsProvider}
                        variables={{provider}}
                        onCompleted={(data)=>{
                            if(data.chooseSmsProvider){
                                this.setState({
                                    loading:false
                                });
                                console.dir(data.chooseSmsProvider);
                                alert("Les envois se feront avec "+provider);
                            }
                        }}
                        >
                        {(chooseSmsProvider, {data,loading}) =>
                        <Button
                            variant="contained"
                            color="primary"
                            id="#subBtn"
                            onClick={()=>{
                                
                                    this.setState({
                                        loading:true,
                                    });
                                    chooseSmsProvider({
                                        variables:{
                                            provider
                                        }
                                    }); 
                                    this.forceUpdate();
                                

                            }}
                            className={classes.submit}
                            ref={el=>this.submitBtn=el}
                            >Choisir</Button>
                            }
                         </Mutation>
                         <input type="submit" style={{display:'none'}} ref={el=>this.submitter=el}/>
                    </ValidatorForm>
                </Paper>
            </main>
        );
    }
}
SelectProvider.propTypes = {
    classes: PropTypes.object.isRequired
};
const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [
            theme
                .breakpoints
                .up(400 + theme.spacing.unit * 3 * 2)
        ]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit *2}px ${theme.spacing.unit *3}px ${theme.spacing.unit * 3}px`
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    }
});

export default withStyles(styles)(SelectProvider);