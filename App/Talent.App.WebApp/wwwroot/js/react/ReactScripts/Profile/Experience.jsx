/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';
import { isEmpty, isNumber, dateForMoment, dateForDb, dateFormat, sortBy, dateForView } from './Validation.jsx';
export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experience: {
                id: null,
                company: "",
                position: "",
                start: "",
                end: "",
                responsibilities: ""
            },
            toggleAdd: false,
            isEditRawId: null,
            isDelete: 0,
            experiencelist: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.saveData = this.saveData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.onRowEdit = this.onRowEdit.bind(this);
        this.onRowDelete = this.onRowDelete.bind(this);
        this.toggleAdd = this.toggleAdd.bind(this);
        //this.toggleEdit = this.toggleEdit.bind(this);

        // this.ondateChange = this.ondateChange.bind(this)
    };
    componentWillReceiveProps(nextprops) {
        const experience = [];

        (nextprops.experienceData) ? this.setState({
            experiencelist: nextprops.experienceData
        }) : experience
    }

    toggleAdd() {
        this.setState({ toggleAdd: !this.state.toggleAdd, }, this.clearData())
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.experience)
        data[event.target.name] = event.target.value
        this.setState({
            experience: data,
        })
    }


    clearData() {
        const data = Object.assign({}, this.state.experience)
        data.company = data.position = data.start = data.end = data.responsibilities = data.id = null
        this.setState({
            experience: data,
            isEditRawId: null
        })
    }
    saveData() {
        const exList = (this.state.experiencelist) ? this.state.experiencelist : [];
        const data = Object.assign({}, this.state.experience)
        if (!isEmpty(data.company) && !isEmpty(data.position) && !isEmpty(data.start) && !isEmpty(data.end) && !isEmpty(data.responsibilities) && Date.parse(new Date(data.start)) < Date.parse(new Date(data.end))) {
            if (this.state.isEditRawId === null && this.state.toggleAdd === true) {
                exList.push(data);
                console.log(exList)
                this.toggleAdd()
            }
            else {
                exList.map((ex, i) => {
                    if (this.state.isEditRawId === ex.id) {
                        ex.start = data.start,
                            ex.end = data.end,
                            ex.company = data.company,
                            ex.position = data.position,
                            ex.responsibilities = data.responsibilities
                    }
                })
            }
            const expList = { experience: exList }
            this.props.updateProfileData(Object.assign({}, expList))
            this.clearData()
        }
        else {
            TalentUtil.notification.show("Please Input all items in form or Check Your Start date. It has to be less then end date", "error", null, null)
        }
    }
    onRowEdit(experience) {
        experience.start = moment(new Date(experience.start)).format("YYYY-MM-DD")
        experience.end = moment(new Date(experience.end)).format("YYYY-MM-DD")
        this.setState({
            experience: experience,
            isEditRawId: experience.id
        })
    }
    onRowDelete(i) {
        if (confirm('Are you sure ,you want to delete this row?')) {

            const experiencelist = (this.state.experiencelist) ? this.state.experiencelist : [];
            experiencelist.splice(i, 1);
            const data = { experiencelist: experiencelist }
            console.log(data);
            this.props.updateProfileData(Object.assign({}, data));
        }

    }
    renderInsert() {
        return (<div className="ui grid" style={{ padding: '5px', paddingLeft: '0px' }}>
            <ChildSingleInput
                inputType="text"
                className="eight wide column"
                label="Company:"
                name="company"
                value={this.state.experience.company}
                controlFunc={this.handleChange}
                maxLength={50}
                placeholder="Company Name"
                errorMessage="Please Write Company Name"
            />
            <ChildSingleInput
                inputType="text"
                className=" eight wide column"
                label="Positon:"
                name="position"
                value={this.state.experience.position}
                controlFunc={this.handleChange}
                maxLength={50}
                placeholder="Position"
                errorMessage="Please Write Position name that you hold"
            />
            <ChildSingleInput
                inputType="date"
                className="eight wide column"
                label="Start Date:"
                name="start"
                value={this.state.experience.start}
                controlFunc={this.handleChange}
                maxLength={20}
                placeholder="Start Date"
                errorMessage="Please Write Start Date"
            />
            <ChildSingleInput
                inputType="date"
                className=" eight wide column"
                label="End Date"
                name="end"
                value={this.state.experience.end}
                controlFunc={this.handleChange}
                maxLength={20}
                placeholder="End Date"
                errorMessage="Please Write End Date"
            />
            <ChildSingleInput
                inputType="text"
                className=" sixteen wide column"
                label="Responsibilities"
                name="responsibilities"
                value={this.state.experience.responsibilities}
                controlFunc={this.handleChange}
                maxLength={500}
                placeholder="Responsibilities"
                errorMessage="Please Write Responsibilities."
            />
            <div className="sixteen wide column">
                <button type="button" className="ui teal button" onClick={this.saveData} >Save</button>
                <button type="button" className="ui button" onClick={(this.state.isEditRawId) ? this.clearData : this.toggleAdd}>Cancel</button>
            </div>
        </div>)
    }
    renderViewRecord() {
        const experiencelist = this.state.experiencelist
        const list = experiencelist.sort((a, b) => sortBy(Date.parse(new Date(a.start)), Date.parse(new Date(b.start)))).reverse().map((ex, i) => (
            (this.state.isEditRawId === ex.id) ? <tr key={i}><td colSpan='6'>{this.renderInsert()}</td></tr> :
                <tr key={i}>
                    <td>{ex.company.toString()}</td>
                    <td>{ex.position.toString()}</td>
                    <td>{dateForView(ex.start.toString())}</td>
                    <td>{dateForView(ex.end.toString())}</td>
                    <td>{ex.responsibilities.toString()}</td>
                    <td> <div className="ui right floated" style={{ float: 'right' }}>
                        <a onClick={() => this.onRowEdit(ex)}><i aria-hidden="true" className="black edit icon"></i></a>
                        <a onClick={() => this.onRowDelete(i)}><i aria-hidden="true" className="black delete icon"></i></a>
                    </div>
                    </td>
                </tr>
        ))
        return list
    }
    renderView() {

        return (<div className="sixteen wide column">
            <div className=''>{(this.state.toggleAdd) ? this.renderInsert() : ""}</div>
            <div>
                <table className="ui very compact table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Start Date </th>
                            <th>End Date</th>
                            <th>Responsibilities</th>
                            <th> <button type="button" className="ui right floated teal button" onClick={() => { this.toggleAdd() }} >+ Add New</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.state.experiencelist) ? this.renderViewRecord() : "Sorry Data Not Available. Please Insert Data"}
                    </tbody>
                </table>
            </div>
        </div>)
    }

    render() {
        return (this.renderView())
    }
}
