/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import './Form.css';
import {SimpleReactValidator} from 'simple-react-validator';

class Form extends Component {
    constructor() {
        super();
        this.validator = new SimpleReactValidator();
    }
    state = {
        isValidated: false
    }
    validate() {
        const formLength = this.formEl.length;
        if (this.formEl.checkValidity() === false) {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem
                    .parentNode
                    .querySelector('.invalid-feedback');
                if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                    if (!elem.validity.valid) {
                        errorLabel.textContent = elem.validationMessage;
                    } else {
                        errorLabel.textContent = '';
                    }
                }
            }
            return false;
        } else {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem
                    .parentNode
                    .querySelector('.invalid-feedback');
                if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                    errorLabel.textContent = '';
                }
            }
            return true;
        }
    }
    submitHandler = (event) => {
        event.preventDefault();
        const {submit} = this.props;
        if (this.validate()) {
            submit();
        }
        this.setState({isValidated: true})
    }

    render() {
        const props = this.props;
        let classNames = [];
        if (props.className) {
            classNames = [props.className];
            // delete props.className;
        }
        if (this.state.isValidated) {
            classNames.push('.was-validated');
        }
        return (
            <form
                {...props}
                className={classNames}
                noValidate
                ref={form => (this.formEl = form)}
                onSubmit={this.submitHandler}>
                {this.props.children}
            </form>
        );
    }
}

export default Form;