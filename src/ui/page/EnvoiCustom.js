/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import {ValidatorForm, TextValidator,SelectValidator} from 'react-material-ui-form-validator';
import Paper from '@material-ui/core/Paper';
import {withStyles, Typography} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { getSmsNo, customSmsParser, interPlace,processXlFile, checkFileValidity,generateSmsTable} from '../../utils/utils';
import {DropzoneArea} from 'material-ui-dropzone';
import {Redirect} from 'react-router-dom';
import classNames from 'classnames';
import MenuItem from'@material-ui/core/MenuItem';
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import AlertDialog from '../components/AlertDialog';

const sendSmsMutation=gql`
   mutation sendSmsMutation($data:SmsRapport_Inputs!) {
    sendSmsMutation(data:$data){
        sender
        number
        sms
        heure_envoi
        status
        }
  }
`;

class EnvoiCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidated: false,
            typesms: '',
            message: '',
            charno:0,
            columns:[],
            smsNo:1,
            delimiters:{first:'{',last:'}'},//par defaut on prend {}
            files:[],
            file:null,
            envoi:null,
            loading:false,
            messageClient:'',
            expeditor:"NSIA VIE CI",
            user:props.location.state?props.location.state.user:null

        };
        if (!window.classNames) {
            // cheat to fix crash DropzoneArea v2.2.0
            window.classNames = classNames
        }
    }

    changeType(e) {
        this.setState({typesms: e.target.value});
    }
    changeExpeditor(e) {
        this.setState({expeditor: e.target.value});
    }
    changeDelimiter1(e) {
        console.log(e.target.value);
        let delimiters=Object.assign({},this.state.delimiters);
        delimiters.first=e.target.value;
        this.setState({delimiters});
    }
    changeDelimiter2(e) {
        console.log(e.target.value);
        let delimiters=Object.assign({},this.state.delimiters);
        delimiters.last=e.target.value;
        this.setState({delimiters});
    }
    changeFile(files){
        this.setState({
            files,
          file:files[0]
        });
        console.log(files[0] instanceof Blob);
      }
    getFileToBlob(files){
        
    }
    changeMsg(e) {
        let message=e.target.value;
        let columns=[...customSmsParser(message,this.state.delimiters[0]?this.state.delimiters[0]:'{',this.state.delimiters[1]?this.state.delimiters[1]:'}')];
        //message=message.replace("{","").replace("}","");
        let smsNo=getSmsNo(message.length);
        /*if(columns)
        columns=columns.map((e)=>{
            return e.replace("{","").replace("}","");
        });*/
        this.setState({message,columns,charno:message.length,smsNo});
        console.log("message: "+message+"\n nbSms "+smsNo+"\nColumns:");
        console.dir(columns)
        console.log("state\n");
        console.dir(this.state);
    }

    reset(e){
        this.setState({
            typesms: '',
            message: '',
            charno:0,
            columns:[],
            smsNo:1,
            files:[],
            file:null,
            envoi:null,
            loading:false,
            expeditor:"NSIA VIE CI",
            messageClient:'',
        });
        document.querySelector('[aria-label="Delete"]').click();
    }
    
    async submitForm() {
        if(!this.state.file)
        {
            alert("Veuillez entrer un fichier valide");
            return;
        }
        let allColumns=this.state.columns.filter(e=>!e.includes(this.state.delimiters.first));
        let shouldContinue=window.confirm(`Voici ci dessous les colonnes à remplir:\nAppuyez sur OK pour confirmer et effectuer l'envoi\n${!allColumns.length?"Aucune colonne détectée":[...interPlace(allColumns,'\n')]}`);
        if(shouldContinue)
        {
            //send sms
            let res=await processXlFile(this.state.file);
            console.dir(res);
            let itsok=checkFileValidity(res,allColumns);
            //check if a column TELEPHONE exists in the file uploaded
            if(!itsok){
                document.querySelector('[aria-label="Delete"]').click();
                //this.dropzone.removeFile(this.state.file);
                this.setState({
                    files:[],
                    file:null
                });
            }else{
                //envoi des sms ici
                let smsData=generateSmsTable(res,this.state);
                smsData=smsData.map((e)=>{
                    e.number=e.number.toString();
                    return e;
                })
                console.dir(smsData);
                this.setState({
                    envoi:{
                        messages:smsData,
                        senderId:this.state.user.id,
                        direction:this.state.user.direction,
                        typeSms:this.state.typesms,
                        expeditor:this.state.expeditor
                    }
                });
                this.forceUpdate();
                document.getElementById("#subBtn").click();
            }
            
        }
       
    }
    componentWillMount(){
        if(!this.props.location.state){
            this.setState({
                changeRoute:<Redirect to={{pathname:"/"}}/>
            });
        }
    }
    componentDidMount(){
        if(this.props.location.state)
        {
            this.setState({
                user:this.props.location.state.user
            });
        }
       
       console.dir(this.props);
    }
    componentDidUpdate(){
        console.dir(this.state);
    }
    render() {
        const {classes} = this.props;
        const {typesms,message,charno,columns,smsNo,envoi,loading,messageClient,expeditor}=this.state;
        const tooltipsms="Entrez votre sms ici. Si vous avez des valeurs dynamiques à y inserer, veuillez alors encapsuler le nom de la colonne de votre fichier Excel par des parenthèses.Example de sms dynamique: \"Bienvenue cher {CLIENT}\" ou CLIENT est le nom de la colonne à insérer";
        return (//
            <main className={classes.main}>
            {this.state.changeRoute}
            {loading?(<AlertDialog open={true} title={`Envoi des sms ${typesms}`} message={messageClient} totalSms={envoi?envoi.messages.length:null} shouldClose={false}/>):(<AlertDialog open={false} title={`Envoi des sms ${typesms}`} message='' totalSms={envoi?envoi.messages.length:null} shouldClose={true}/>)}
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>speaker_notes</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Envoyez vos sms
                    </Typography>
                    <ValidatorForm
                        ref={el=>this.form=el}
                        onSubmit={this.submitForm.bind(this)}
                        onError={errors => console.log(errors)}>
                        <div>
                            {/*<div className={classes.spandiv}>
                            <FormControl margin="normal"  fullWidth>
                            <Tooltip title="permet au logiciel de savoir que la chaine de caract&egrave;res qui suit est &agrave; remplacer par une valeur de la colonne correspondante dans le fichier Excel">
                                    <TextValidator
                                        label="d&eacute;limiteur d&eacute;but"
                                        value={this.state.delimiters.first}
                                        name="delimiterdebut"
                                        helperText="example: {"
                                        validators={['required']}
                                        inputProps={{maxLength:1}}
                                        onChange={this
                                        .changeDelimiter1
                                        .bind(this)}
                                        errorMessages={['ce champs est requis']}
                                        autoFocus/>
                                    </Tooltip>
                            </FormControl>
                            <div style={{width:30}}></div>
                            <FormControl margin="normal" required fullWidth>
                            <Tooltip title="permet au logiciel de savoir que la chaine de caract&egrave;res qui pr&eacute;c&egrave;de est &agrave; remplacer par une valeur de la colonne correspondante dans le fichier Excel">
                                <TextValidator
                                    label="d&eacute;limiteur fin"
                                    value={this.state.delimiters.last}
                                    name="delimiterfin"
                                    helperText="example: }"
                                    validators={['required']}
                                    inputProps={{maxLength:1}}
                                    onChange={this
                                    .changeDelimiter2
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}
                                    />
                                    </Tooltip>
                            </FormControl>
                            </div>*/}
                        <FormControl margin="normal" required fullWidth>
                            <Tooltip title="l'exp&eacute;diteur du sms">
                                <SelectValidator
                                    label="Expéditeur"
                                    value={this.state.expeditor}
                                    name="expeditor"
                                    validators={['required']}
                                    onChange={this
                                    .changeExpeditor
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}
                                    >
                                    <MenuItem value="NSIA VIE CI">Nsia Vie CI</MenuItem>
                                    <MenuItem value="MoovEpargne">MoovEpargne</MenuItem>
                                    <MenuItem value="MoovSoutien">MoovSoutien</MenuItem>
                                    </SelectValidator>
                                </Tooltip>
                            </FormControl> 
                            <FormControl margin="normal" required fullWidth>
                            <Tooltip title="le nom que vous donnez &agrave; cet envoi particulier que vous aller ex&eacute;cuter">
                                <TextValidator
                                    label="Type de sms"
                                    value={this.state.typesms}
                                    name="typesms"
                                    validators={['required']}
                                    onChange={this
                                    .changeType
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}
                                    />
                                </Tooltip>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Tooltip title={tooltipsms}>

                                <TextValidator
                                    label="Votre sms"
                                    value={this.state.message}
                                    name="sms"
                                    multiline
                                    validators={['required']}
                                    onChange={this
                                    .changeMsg
                                    .bind(this)}
                                    errorMessages={['ce champs est requis']}/>
                            </Tooltip>
                            </FormControl>
                            <Tooltip title="le nombre de caractères et le nombre de sms sont approximatifs car sont dépendant de valeurs dynamiques.">
                                    <div className={classes.spandiv}>
                            
                                    <span>Nombre de caract&egrave;res: {charno}</span>
                                    <span>{smsNo} sms</span>
                            
                                    </div>
                            </Tooltip>
                           <FormControl>
                                <DropzoneArea 
                                    onChange={this.changeFile.bind(this)}
                                    onDrop={this.getFileToBlob.bind(this)}
                                    ref={el=>this.dropzone=el}
                                    acceptedFiles={['application/vnd.ms-excel','application/vnd.openxmlformat-officedocument.spreadsheetml.sheet','.xls','.xlsx']}
                                    filesLimit={1}
                                    maxFileSize={3000000}
                                    dropzoneText="Glissez votre fichier excel ici. Les .xls et les .xlsx sont accept&eacute;s"
                                 />
                            </FormControl>
                        </div>
                        <div className={classes.spandiv}>
                        <Button
                            variant="contained"
                            onClick={this.reset.bind(this)}
                            className={classes.submit}>Reset</Button>
                        <Mutation
                        mutation={sendSmsMutation}
                        variables={{envoi}}
                        onCompleted={(data)=>{
                            if(data.sendSmsMutation){
                                this.setState({
                                    loading:false
                                });
                                this.reset();
                                console.dir(data.sendSmsMutation);
                                alert("Sms bien envoyés");
                            }
                            this.setState({
                                envoi:null,
                                messageClient:'',
                            });
                        }}
                        >
                        {(sendSmsMutation, {data,loading}) =>
                        <Button
                            variant="contained"
                            color="primary"
                            id="#subBtn"
                            onClick={()=>{
                                if(this.state.envoi){
                                    this.setState({
                                        loading:true,
                                        messageClient:'veuillez patienter opendant l\'envoi des sms',
                                    });
                                    sendSmsMutation({
                                        variables:{
                                            data:envoi
                                        }
                                    }); 
                                    this.forceUpdate();
                                }else{
                                    this.submitter.click();
                                }

                            }}
                            className={classes.submit}
                            ref={el=>this.submitBtn=el}
                            >Envoyer</Button>
                            }
                         </Mutation>
                         <input type="submit" style={{display:'none'}} ref={el=>this.submitter=el}/>
                        </div>
                        
                    </ValidatorForm>
                </Paper>
            </main>
        );
    }
}
EnvoiCustom.propTypes = {
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
    },
    spandiv:{
        marginTop:theme.spacing.unit * 2,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around'
    }
});

export default withStyles(styles)(EnvoiCustom);