import React from 'react'
import { Form, Radio } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobSeekingStatus: '',
            jobSeekingStatusOption: {
                active: 'Actively looking For Job',
                not: 'Not looking for job at the moment',
                current: 'Currently employe but open for the offers',
                later: 'Will be available on later date'
            }
        }
        this.renderView = this.renderView.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveData = this.saveData.bind(this);
    }

    componentWillReceiveProps(nextprops) {
        (nextprops.status) ? this.setState({
            jobSeekingStatus: nextprops.status.status
        }) : ''
    }

    handleChange(e, { value }) {
        this.setState({
            jobSeekingStatus: value
        }, () => this.saveData())
    }
    saveData() {
        var data = (this.state.jobSeekingStatus) ? { jobSeekingStatus: {status:this.state.jobSeekingStatus}  } : { jobSeekingStatus: '' }
        this.props.saveProfileData(Object.assign({}, data))
    }
    renderView() {
        return (<Form>
            <Form.Field>
                <b>Current Status </b>
            </Form.Field>
            <Form.Field>
                <Radio
                    label={this.state.jobSeekingStatusOption.active}
                    name='radioGroup'
                    value={this.state.jobSeekingStatusOption.active}
                    checked={this.state.jobSeekingStatus === this.state.jobSeekingStatusOption.active}
                    onChange={this.handleChange}
                />
            </Form.Field>
            <Form.Field>
                <Radio
                    label={this.state.jobSeekingStatusOption.not}
                    name='radioGroup'
                    value={this.state.jobSeekingStatusOption.not}
                    checked={this.state.jobSeekingStatus === this.state.jobSeekingStatusOption.not}
                    onChange={this.handleChange}
                />
            </Form.Field>
            <Form.Field>
                <Radio
                    label={this.state.jobSeekingStatusOption.current}
                    name='radioGroup'
                    value={this.state.jobSeekingStatusOption.current}
                    checked={this.state.jobSeekingStatus === this.state.jobSeekingStatusOption.current}
                    onChange={this.handleChange}
                />
            </Form.Field>
            <Form.Field>
                <Radio
                    label={this.state.jobSeekingStatusOption.later}
                    name='radioGroup'
                    value={this.state.jobSeekingStatusOption.later}
                    checked={this.state.jobSeekingStatus === this.state.jobSeekingStatusOption.later}
                    onChange={this.handleChange}
                />
            </Form.Field>

        </Form>)
    }
    render() {
        return (<div className='sixteen wide column'>
            {this.renderView()}
        </div>)
    }
}