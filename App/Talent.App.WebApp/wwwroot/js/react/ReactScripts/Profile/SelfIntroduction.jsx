/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { Form, TextArea } from 'semantic-ui-react'
import { relativeTimeThreshold } from 'moment';
import { lengthCheck, readLength } from './Validation.jsx'

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        const summary = props.summary ? Object.assign({}, props.summary) : "";
        const description = props.description ? Object.assign({}, props.description) : "";
        this.state = {
            isEditMode: false,
            summary: summary,
            description: description,
            summaryLength: 0,
            descriptionLength: 0

        }
        this.handleChange = this.handleChange.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            summary: nextProps.summary,
            description: nextProps.description,
            descriptionLength: (nextProps.description) ? nextProps.description.length : 0,
            summaryLength: (nextProps.summary) ? nextProps.summary.length : 0
        })
    }

    handleChange(event) {

        this.setState({
            [event.target.name]: [event.target.value],
            [[event.target.name] + "Length"]: [event.target.value.length]
        });
    }
    saveContent() {

        const sd = { summary: this.state.summary.toString(), description: this.state.description.toString() }
        const data = Object.assign({}, sd);
        const isSummeryLengthCheck = lengthCheck(1, 150, data.summary);
        const isDescriptionLengthCheck = lengthCheck(150, 600, data.description);
        
        if (isSummeryLengthCheck == true && isDescriptionLengthCheck == true) {

            this.props.updateProfileData(data);
        }

    }

    render() {
        return (<div className='ui sixteen wide column'>
            <TextArea className="field" name='summary' rows={1} value={this.state.summary} onChange={this.handleChange} placeholder='Please provide sort summary of your self' />
            <span>Summary must be no more than 150 characters   <b>{(this.state.summary) ? readLength(150, this.state.summaryLength) : 0}</b> character left</span>
            <br></br>
            <TextArea className="field" name='description' rows={4} value={this.state.description} onChange={this.handleChange} placeholder='Please tell us about any hobbies,additional expertise or anything you want to add' />
            <span>Description must be between 150-600 characters  <b>{(this.state.description) ? readLength(600, this.state.descriptionLength) : 0}</b> left</span>
            <br></br>
            <button type="button" className="ui right floated teal button" onClick={this.saveContent}>Save</button>
        </div>
        )

    }
}



