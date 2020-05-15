/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput, DrpDownComp } from '../Form/SingleInput.jsx';
import { isEmpty } from './Validation.jsx';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            languages: (props) ? props.languageData : [],
            name: "",
            level: "",
            isAdd: false,
            isEditRawId: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.toggleAdd = this.toggleAdd.bind(this);
        this.handleDrpChange = this.handleDrpChange.bind(this);
        this.saveData = this.saveData.bind(this),
        this.onRowEdit = this.onRowEdit.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onRowDelete = this.onRowDelete.bind(this);
    }



    handleChange(event) {
        this.setState({
            name: event.target.value
        })
    }
    componentWillReceiveProps(nextprops) {
        const languages = [];

        (nextprops.languageData) ? this.setState({
            languages: nextprops.languageData
        }) : languages
    }
    handleDrpChange(event, options) {

        this.setState({
            level: options.value
        })
    }
    saveData() {
        const LanguagesJson = (this.state.languages) ? this.state.languages : [];
        var checkLangName = false;
        
        if (!isEmpty(this.state.name) && !isEmpty(this.state.level)) {
            if (this.state.isEditRawId) {
                LanguagesJson.forEach(lang => {
                    if (lang.id === this.state.isEditRawId) {
                        lang.name = this.state.name;
                        lang.level = this.state.level;
                    }
                });
            }
            else {
                for (let index = 0; index < LanguagesJson.length; index++) {
                    if (LanguagesJson[index].name.toLowerCase() === this.state.name.toLowerCase()) {
                        checkLangName = true;
                    }
                }
                if (!checkLangName) {
                    const data = {
                        name: this.state.name,
                        level: this.state.level
                    }
                    LanguagesJson.push(data);
                    this.toggleAdd();
                }
            }
            if (!checkLangName) {

                const Ldata = { languages: LanguagesJson }
                this.props.updateProfileData(Object.assign({}, Ldata));
                this.toggleEdit();
            }
            else {
                TalentUtil.notification.show("Already Inserted Please Edit if you want change", "error", null, null)
                this.toggleAdd();
                this.toggleEdit();
            }
        }
        else {
            TalentUtil.notification.show("Please write your Language for save ", "error", null, null);
        }
    }
    toggleAdd() {
        this.setState({
            isAdd: !this.state.isAdd,
        })
    }
    toggleEdit() {
        this.setState({
            isEditRawId: "",
            level: "",
            name: "",
        })
    }
    onRowDelete(i) {
        if (confirm('Are you sure ,you want to delete this row?')) {
            
            const languages = (this.state.languages) ? this.state.languages : [];
            languages.splice(i,1);
            const data = { languages: languages }
            
            this.props.updateProfileData(Object.assign({}, data));
       }

    }
    renderInsert() {
        const option = [{
            key: "basic", value: "basic", text: "basic"
        }, { key: "Conversational", value: "Conversational", text: "Conversational" }, { key: "Fluent", value: "Fluent", text: "Fluent" }, { key: "Native/Bilingual", value: "Native/Bilingual", text: "Native/Bilingual" }];
        return ((this.state.isAdd) ?
            <div className="ui equal width grid" style={{ padding: '5px', paddingLeft: '0px' }}>

                <ChildSingleInput
                    inputType="text"
                    className="column"
                    name="number"
                    value={this.state.name}
                    controlFunc={this.handleChange}
                    maxLength={20}
                    placeholder="Add Language"
                    errorMessage="Please Write language that you know"
                />
                <DrpDownComp
                    placeholder='Level'
                    className="six wide column"
                    options={option}
                    value={this.state.level}
                    type='skill'
                    controlFunc={this.handleDrpChange}
                    errorMessage='Please Select City'
                />
                <div className="column" >
                    <button type="button" className="ui teal button" onClick={this.saveData} >Save</button>
                    <button type="button" className="ui button" onClick={this.toggleAdd}>Cancel</button>
                </div>
            </div> : "")
    }
    onRowEditForm() {
        const option = [{
            key: "basic", value: "basic", text: "basic"
        }, { key: "Conversational", value: "Conversational", text: "Conversational" }, { key: "Fluent", value: "Fluent", text: "Fluent" }, { key: "Native/Bilingual", value: "Native/Bilingual", text: "Native/Bilingual" }];
        return (<div className="ui equal width grid" style={{ padding: '5px' }}>
            <ChildSingleInput
                inputType="text"
                className="column"
                name="number"
                value={this.state.name}
                controlFunc={this.handleChange}
                maxLength={20}
                placeholder="Add Language"
                errorMessage="Please Write language that you know"
            />
            <DrpDownComp
                placeholder='Level'
                className="six wide column"
                options={option}
                value={this.state.level}
                type='skill'
                controlFunc={this.handleDrpChange}
                errorMessage='Please Select City'
            />
            <div className="column" >
                <button type="button" className="ui blue basic button" onClick={this.saveData} >Update</button>
                <button type="button" className="ui red basic button" onClick={this.toggleEdit}>Cancel</button>

            </div>
        </div>)
    }

    onRowEdit(lang) {
        this.setState({
            isEditRawId: lang.id,
            name: lang.name,
            level: lang.level
        })
    }
    renderViewRecord() {
        const s = this.state.languages
        const ln = s.map((lang, i) => (
            (this.state.isEditRawId === lang.id) ? <tr key={i}><td colSpan='3'>{this.onRowEditForm()}</td></tr> :
                <tr key={i}>
                    <td>{lang.name.toString()}</td>
                    <td>{lang.level.toString()}</td>
                    <td> <div className="ui right floated" style={{ float: 'right' }}>
                        <a onClick={() => this.onRowEdit(lang)}><i aria-hidden="true" className="black edit icon"></i></a>
                        <a onClick={() => this.onRowDelete(i)}><i aria-hidden="true" className="black delete icon"></i></a>
                    </div>
                    </td>
                </tr>
        ))
        return ln
    }
    renderView() {

        return (<div className="sixteen wide column">
            <div className=''>{this.renderInsert()}</div>
            <div>
                <table className="ui very compact table">
                    <thead>
                        <tr>
                            <th>Language</th>
                            <th>Level</th>
                            <th> <button type="button" className="ui right floated teal button" onClick={this.toggleAdd} >+ Add New</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.state.languages) ? this.renderViewRecord() : "Sorry Data Not Available. Please Insert Data"}

                    </tbody>
                </table>
            </div>
        </div>)
    }

    render() {

        return (this.renderView())

    }
}