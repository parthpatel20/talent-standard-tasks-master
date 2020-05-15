/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput, DrpDownComp } from '../Form/SingleInput.jsx';
import { isEmpty } from './Validation.jsx';


export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skills: (props) ? props.skillData : [],
            name: "",
            level: "",
            isAdd: false,
            isEditRawId: "",
            options: [{
                key: "Beginner", value: "Beginner", text: "Beginner"
            }, { key: "Intermediate", value: "Intermediate", text: "Intermediate" },
            { key: "Expert", value: "Expert", text: "Expert" }]

        }
        this.handleChange = this.handleChange.bind(this)
        this.toggleAdd = this.toggleAdd.bind(this);
        this.handleDrpChange = this.handleDrpChange.bind(this);
        this.saveData = this.saveData.bind(this),
            this.onRowEdit = this.onRowEdit.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onRowDelete = this.onRowDelete.bind(this);

    };
    handleChange(event) {
        this.setState({
            name: event.target.value
        })
    }
    componentWillReceiveProps(nextprops) {
        const skills = [];

        (nextprops.skillData) ? this.setState({
            skills: nextprops.skillData
        }) : skills
    }

    handleDrpChange(event, options) {

        this.setState({
            level: options.value
        })
    }
    saveData() {
        const skillsJson = (this.state.skills) ? this.state.skills : [];
        var checkskillName = false;
        
        if (!isEmpty(this.state.name) && !isEmpty(this.state.level)) {
            if (this.state.isEditRawId) {
                skillsJson.forEach(skill => {
                    if (skill.id === this.state.isEditRawId) {
                        skill.name = this.state.name;
                        skill.level = this.state.level;
                    }
                });
            }
            else {
                for (let index = 0; index < skillsJson.length; index++) {
                    if (skillsJson[index].name.toLowerCase() === this.state.name.toLowerCase()) {
                        checkskillName = true;
                    }
                }
                if (!checkskillName) {
                    const data = {
                        name: this.state.name,
                        level: this.state.level
                    }
                    skillsJson.push(data);
                    this.toggleAdd();
                }
            }
            if (!checkskillName) {

                const Ldata = { skills: skillsJson }
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
            TalentUtil.notification.show("Please write your skill for save ", "error", null, null);
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

            const skills = (this.state.skills) ? this.state.skills : [];
            skills.splice(i, 1);
            const data = { skills: skills }
            
            this.props.updateProfileData(Object.assign({}, data));
        }

    }
    renderInsert() {

        return ((this.state.isAdd) ?
            <div className="ui equal width grid" style={{ padding: '5px', paddingLeft: '0px' }}>

                <ChildSingleInput
                    inputType="text"
                    className="column"
                    name="number"
                    value={this.state.name}
                    controlFunc={this.handleChange}
                    maxLength={20}
                    placeholder="Add skill"
                    errorMessage="Please Write skill that you know"
                />
                <DrpDownComp
                    placeholder='Level'
                    className="six wide column"
                    options={this.state.options}
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
        return (<div className="ui equal width grid" style={{ padding: '5px' }}>
            <ChildSingleInput
                inputType="text"
                className="column"
                name="number"
                value={this.state.name}
                controlFunc={this.handleChange}
                maxLength={20}
                placeholder="Add skill"
                errorMessage="Please Write skill that you know"
            />
            <DrpDownComp
                placeholder='Level'
                className="six wide column"
                options={this.state.options}
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

    onRowEdit(skill) {
        
        this.setState({
            isEditRawId: skill.id,
            name: skill.name,
            level: skill.level
        })
    }
    renderViewRecord() {
        const s = this.state.skills
        
        const ln = s.map((skill, i) => (
            (this.state.isEditRawId === skill.id) ? <tr key={i}><td colSpan='3'>{this.onRowEditForm()}</td></tr> :
                <tr key={i}>
                    <td>{skill.name.toString()}</td>
                    <td>{skill.level.toString()}</td>
                    <td> <div className="ui right floated" style={{ float: 'right' }}>
                        <a onClick={() => this.onRowEdit(skill)}><i aria-hidden="true" className="black edit icon"></i></a>
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
                            <th>Skill</th>
                            <th>Level</th>
                            <th> <button type="button" className="ui right floated teal button" onClick={this.toggleAdd} >+ Add New</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.state.skills) ? this.renderViewRecord() : "Sorry Data Not Available. Please Insert Data"}

                    </tbody>
                </table>
            </div>
        </div>)
    }

    render() {

        return (this.renderView())

    }
}