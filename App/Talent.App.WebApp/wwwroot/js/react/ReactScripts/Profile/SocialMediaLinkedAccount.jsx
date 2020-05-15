/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup, Button, Icon } from 'semantic-ui-react';
import { urlValidator } from './Validation.jsx'


export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            linkedIn: "",
            github: "",
            editview: false
        }
        this.renderEdit = this.renderEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderView = this.renderView.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.saveData = this.saveData.bind(this);
        //  this.isError = this.isError.bind(this);
        
    }
    componentWillReceiveProps(nextProps) {
        
        this.setState({
            linkedIn: nextProps.linkedAccounts.linkedIn,
            github: nextProps.linkedAccounts.github
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: [event.target.value]
        });
       
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
        this.setState({
            linkedIn: (this.props) ? this.props.linkedAccounts.linkedIn : " ",
            github: (this.props) ? this.props.linkedAccounts.github : " "
        })

    }
    toggleEdit() {
        this.setState({
            editview: !this.state.editview
        })
    }
    saveData() {
        
        const soical = { linkedAccounts: { linkedIn: "", github: "" } }
        if (urlValidator(this.state.linkedIn.toString())) {
            soical.linkedAccounts.linkedIn = this.state.linkedIn.toString();
        }
        if (urlValidator(this.state.github.toString())) {
            soical.linkedAccounts.github = this.state.github.toString();
        }

        const data = Object.assign({}, soical);
        this.props.updateProfileData(data);
        this.props.saveProfileData(data);
        this.toggleEdit();
    }

    isError(url) {
        const chk = (url === "") ? true : false;
        if (!chk) {
            return !urlValidator(url)
        }
        return false
    }
    renderEdit() {
        return (<div className="ui sixteen wide column">
            <ChildSingleInput
                inputType="text"
                label="Linked In"
                name="linkedIn"
                value={this.state.linkedIn}
                controlFunc={this.handleChange}
                maxLength={200}
                placeholder="Enter your linked in url"
                errorMessage="Please enter a valid url"
                isError={this.isError(this.state.linkedIn.toString())}
            />

            <ChildSingleInput
                inputType="text"
                label="GitHub"
                name="github"
                value={this.state.github}
                controlFunc={this.handleChange}
                maxLength={200}
                placeholder="Enter your GitHub url"
                errorMessage="Please enter a valid url"
                isError={this.isError(this.state.github.toString())}
            />
            <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
            <button type="button" className="ui button" onClick={this.toggleEdit}>Cancel</button>
        </div>)
    }
    renderView() {
        return (

            <div className="ui sixteen wide column ">
                <a href={this.state.linkedIn}  target="_blank" type="button" className="ui linkedin large button">
                    <i aria-hidden="true" target="_blank" className="linkedin icon"></i>
                    LinkedIn
      </a>
                <a href={this.state.github} type="button" target="_blank" className="ui teal large button">
                    <i aria-hidden="true" className="github icon"></i>
                    GitHub
      </a>

                <button type="button" className="ui right floated teal button" onClick={this.toggleEdit}>Edit</button>  </div>)
    }
    render() {
        return (
            (this.state.editview) ? this.renderEdit() : this.renderView()
        )
    }

}