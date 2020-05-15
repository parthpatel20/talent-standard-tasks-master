import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react'

export const SingleInput = (props) =>
    <div className={`field ${props.isError == true ? 'error' : ''} `}>
        <input
            type={props.inputType}
            placeholder={props.placeholder}
            name={props.name}
            value={props.content}
            onChange={props.controlFunc} />
        {props.isError ? <div className="ui basic red pointing prompt label transition visible">{props.errorMessage}</div> : null}
    </div>

SingleInput.propTypes = {
    inputType: PropTypes.oneOf(['text', 'number', 'password', 'date']).isRequired,
    errorMessage: PropTypes.string.isRequired,
    //title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    controlFunc: PropTypes.func.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date)
    ]).isRequired,
    placeholder: PropTypes.string,
    //isError: PropTypes.bool.isRequired
}

//Updates state in parent component
export class ChildSingleInput extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {

        return (
            <div className={(this.props.className)?this.props.className:
                'field'}>
                <label>{this.props.label}</label>
                <input
                    type={this.props.inputType}
                    name={this.props.name}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    maxLength={this.props.maxLength}
                    onChange={this.props.controlFunc}
                />
                {this.props.isError ? <div className="ui basic red pointing prompt label transition visible">{this.props.errorMessage}</div> : null}
            </div>
        )

    }
}

ChildSingleInput.propTypes = {
    inputType: PropTypes.oneOf(['text', 'number', 'password','date']).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    placeholder: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    //isError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
}

export class DrpDownComp extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (<div className= {(this.props.className)?this.props.className:
        'field'}>
            <label>{this.props.label}</label>
            <Dropdown
                placeholder={this.props.placeholder}
                fluid
                search
                selection
                options={this.props.options}
                value={this.props.value}
                type={this.props.type}
                onChange={this.props.controlFunc}
            />
            {this.props.isError ? <div className="ui basic red pointing prompt label transition visible">{this.props.errorMessage}</div> : null}
        </div>
        )
    }
}
DrpDownComp.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    placeholder: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    type: PropTypes.string,
    //isError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}


export class CharactersRemaining extends React.Component {

    render() {
        let characters = this.props.characters ? this.props.characters.length : 0

        return (
            <div className="floatRight" >Word count : {characters} / {this.props.maxLength}</div>
        )

    }
}