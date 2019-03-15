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
import {Redirect} from 'react-router-dom';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidated: false,
            email: '',
            password: '',
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
        console.dir(this.state);
        if (this.state.email === "adminsms@groupensia.com" && this.state.password === "sms2019") {
            
            this.setState({
                changeRoute:<Redirect to="/create_user"/>
            })
            
        } else {
            alert("Mauvais identifiants !!!");
        }

    }
    render() {
        const {classes} = this.props;
        return (
            
            <main className={classes.main}>
            {this.state.changeRoute}
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>https</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Identifiez vous Administrateur
                    </Typography>
                    <ValidatorForm
                        ref="Adminloginform"
                        onSubmit={this
                        .submitForm
                        .bind(this)}
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}>Connexion</Button>
                    </ValidatorForm>
                </Paper>
            </main>
        );
    }
}
Admin.propTypes = {
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

export default withStyles(styles)(Admin);