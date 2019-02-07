/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Paper from '@material-ui/core/Paper';
import {withStyles, Typography} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

const AddUser = gql `
mutation AddUser($username:String!,$password:String!,$direction:String!){
    addUser(username:$username,password:$password,direction:$direction){
    id
    username
    textPassword
    direction
  }
}
`;
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidated: false,
            username: '',
            password: '',
            direction: ''
        };
        this.changeUser=this.changeUser.bind(this);
        this.changePassword=this.changePassword.bind(this);
        this.changeDirection=this.changeDirection.bind(this);
    }
    changeUser(e) {
        this.setState({username: e.target.value});
        console.log(e.target.value);
        console.dir(this.state);
    }
    changeDirection(e) {
        this.setState({direction: e.target.value});
    }
    changePassword(e) {
        this.setState({password: e.target.value});
    }
    submitForm() {
        console.dir(this.state);
        if (this.state.email === "CreateUsersms@groupensia.com" && this.state.password === "sms2019") {
            alert("rediriger a la creation d'un user");
        } else {
            alert("Mauvais identifiants !!!");
        }

    }
    render() {
        const {classes} = this.props;
        const {username, password, direction} = this.state;
        return (

            <main className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>verified°user</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Créer un utilisateur
                    </Typography> 
                    <ValidatorForm
                        ref = "CreateUserform"
                       onSubmit={()=>{}} 
                        onError = {
                            errors => console.log(errors)
                        } > <div>
                            <FormControl margin="normal" required fullWidth>
                                <TextValidator
                                    label="Nom d'utilisateur"
                                    value={this.state.email}
                                    name="email"
                                    validators={['required']}
                                    onChange={this
                                    .changeUser
                                    }
                                    errorMessages={['ce champs est requis']}
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
                                    }
                                    errorMessages={['ce champs est requis']}/>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <TextValidator
                                    label="Direction ou département de l'utilisateur"
                                    value={this.state.direction}
                                    name="direction"
                                    validators={['required']}
                                    onChange={this
                                    .changeDirection
                                    }
                                    errorMessages={['ce champs est requis']}
                                    autoFocus/>
                            </FormControl>
                        </div> 
                        
                    </ValidatorForm >
                    <Mutation
                        mutation={AddUser}
                        variables={{
                            username,
                            password,
                            direction
                        }}
                        onCompleted={(data)=>{
                            if(data.addUser){
                                alert("l'utilisateur "+username+" a été bien enregistré");
                                this.setState({username: '', password: '', direction: ''});
                                    
                                    //rediriger vers la page d'envoi sms
                                
                            }else{
                                alert("Il se peut que cet utilisateur soit deja existant re-verifiez");
                            }
                        }}
                    >
                        {(addUserMutation, {data},) =>
                        <Button
                        onClick={(data)=>{
                            addUserMutation({
                                variables: {
                                    username,
                                    password,
                                    direction
                                }
                            });
                        }}
                        variant = "contained"
                        color = "primary"
                        className = {
                            classes.submit
                        } > Connexion 
                        </Button>

}
                    </Mutation>
                </Paper>
            </main>
        );
    }
}
CreateUser.propTypes = {
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

export default withStyles(styles)(CreateUser);