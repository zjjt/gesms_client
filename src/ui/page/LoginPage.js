/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import Paper from '@material-ui/core/Paper';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {withStyles, Typography} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {Redirect} from 'react-router-dom';

const loginUser=gql`
   mutation loginUser($username:String!,$password:String!) {
        loginUser(username:$username,password:$password){
            id
            username
            direction
        }
  }
`;


class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidated: false,
            email: '',
            password: '',
            user:null,
            changeRoute:null

        };

    }
    changeEmail(e) {
        this.setState({email: e.target.value});
    }
    changePassword(e) {
        this.setState({password: e.target.value});
    }
    submitForm() {
        alert("the form will be submitted");
        console.log(this.state);
    }
    componentDidUpdate(){
        if(this.state.user){
            this.setState({
                changeRoute:<Redirect to={{pathname:"/send_sms",state:{user:this.state.user}}}/>
            });
        }
        
    }
    render() {
        const {classes} = this.props;
        const username=this.state.email;
        const {password,user,changeRoute}=this.state;
        console.dir(this.state);
        return (
            
            <main className={classes.main}>
            {changeRoute}
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>https</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Identifiez vous.
                    </Typography>
                    <Mutation
                        mutation={loginUser}
                        variables={{
                            username,
                            password,
                        }}
                        onCompleted={(data)=>{
                            if(data.loginUser){
                                    alert("Bienvenue "+this.state.email);
                                    this.setState({
                                        user:data.loginUser,
                                        email: '', 
                                        password: '',
                                        
                                    });
                                    
                                    //acceder aux donner via this.props.location.state.id
                                
                            }else{
                                alert("Veuillez re verifier vos accès");
                            }
                        }}
                        >
                        {(loginUserMutation, {data}) =>
                    <ValidatorForm
                        ref="loginform"
                        onSubmit={(data)=>{
                            loginUserMutation({
                                 variables: {
                                     username,
                                     password
                                 }
                             });
                             
                         }}
                        onError={errors => console.log(errors)}>
                        <div>
                            <FormControl margin="normal" required fullWidth>
                                <TextValidator
                                    label="Email"
                                    value={this.state.email}
                                    name="email"
                                    validators={['required', 'isEmail']}
                                    onChange={this
                                    .changeEmail
                                    .bind(this)}
                                    errorMessages={['ce champs est requis', 'email invalide']}
                                    autoFocus/>

                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <TextValidator
                                    label="Mot de passe"
                                    value={this.state.password}
                                    name="password"
                                    type="password"
                                    validators={['required']}
                                    onChange={this
                                    .changePassword
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}/>
                            </FormControl>
                        </div>
                        
                        
                        <div>
                        <Button
                        onClick={()=>{
                            this.submitter.click();
                        }}
                        variant = "contained"
                        color = "primary"
                        className = {
                            classes.submit
                        } > Connexion 
                        </Button>
                        <input type="submit" style={{display:'none'}} ref={el=>this.submitter=el}/>
                        </div>

                    
                    </ValidatorForm>
                }
                    </Mutation>
                </Paper>
            </main>
        );
    }
}
LogIn.propTypes = {
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
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    }
});

export default withStyles(styles)(LogIn);