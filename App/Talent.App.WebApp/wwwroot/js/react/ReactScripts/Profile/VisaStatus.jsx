import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { ChildSingleInput, DrpDownComp } from '../Form/SingleInput.jsx';
import { isEmpty } from './Validation.jsx';
import moment from 'moment';
export default class visaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visaStatusOption: [{
                key: "Citizen", value: "Citizen", text: "Citizen"
            }, { key: "Permanent Resident", value: "Permanent Resident", text: "Permanent Resident" },
            { key: "Work Visa", value: "Work Visa", text: "Work Visa" },
            { key: "Student Visa", value: "Student Visa", text: "Student Visa" }],
            visaStatus: '',
            visaExpiryDate: '',
            apiVisaDetail:{
                visaStatus: '',
                visaExpiryDate: '',        
            }
        }
        this.handleDrpChange = this.handleDrpChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderView = this.renderView.bind(this);
        this.renderVisaDateView = this.renderVisaDateView.bind(this)
        this.saveData = this.saveData.bind(this);
    }

    componentWillReceiveProps(nextprops) {
        const visaExpiryDate = '';
        const visaStatus = '';
        (nextprops.visaStatus) ? this.setState({
            visaStatus: nextprops.visaStatus,
            visaExpiryDate: moment(new Date(nextprops.visaExpiryDate)).format("YYYY-MM-DD"),
            apiVisaDetail:{
                visaStatus: nextprops.visaStatus,
                visaExpiryDate: moment(new Date(nextprops.visaExpiryDate)).format("YYYY-MM-DD"),        
            }
        }) : ''
    }

    handleChange(event) {
        this.setState({
            visaExpiryDate: event.target.value
        })
    }

    handleDrpChange(event, options) {
        this.setState({
            visaStatus: options.value
        }, () => {
            let checkVal = ['Citizen', 'Permanent Resident'];
                if(this.state.apiVisaDetail.visaStatus!==this.state.visaStatus){
                    if(checkVal.includes(this.state.visaStatus)) {
                        this.saveData()
                    }
                else{
                    this.setState({
                        visaExpiryDate:''
                    })
                
                }

            }
        })
    }

    saveData() {
        var data;
        if (this.state.visaStatus === 'Citizen' || this.state.visaStatus === 'Permanent Resident') {
            const visaExpiryDate = '';
            data = { visaExpiryDate: visaExpiryDate, visaStatus: this.state.visaStatus }
        }
        else {
            
            if (!isEmpty(this.state.visaExpiryDate)) {
                const visaExpiryDate = this.state.visaExpiryDate
                data = { visaExpiryDate: visaExpiryDate, visaStatus: this.state.visaStatus }
            }
            else {
                return TalentUtil.notification.show("Please input date of visa expiry", "error", null, null)
            }
        }
        this.props.saveProfileData(Object.assign({}, data))
    }
    renderVisaDateView() {
        let checkVal = ['Citizen', 'Permanent Resident'];
        if (!checkVal.includes(this.state.visaStatus)) {
            return (<div className='ui grid'>
                <ChildSingleInput
                    inputType="date"
                    className="eight wide column"
                    name="number"
                    value={this.state.visaExpiryDate}
                    controlFunc={this.handleChange}
                    maxLength={20}
                    placeholder="dd/mm/yyyy"
                    errorMessage="Please Write date of visa expiry"
                />

                <div className="eight column" >
                    <button type="button" className="ui teal button" onClick={this.saveData} >Save</button>
                </div>
            </div>)
        }
        else {
            return ('')
        }
    }

    renderView() {
        return (<div className="ui equal width grid" style={{ padding: '5px', paddingLeft: '0px' }}>
            <DrpDownComp
                placeholder='Select Status'
                className="six wide column"
                options={this.state.visaStatusOption}
                value={this.state.visaStatus}
                type='visaStatus'
                controlFunc={this.handleDrpChange}
                errorMessage='Please Select Status'
            />
            <div className='ten wide column'>{
                (!isEmpty(this.state.visaStatus)) ? this.renderVisaDateView() : ""
            }</div>

        </div>)
    }
    render() {
        return (<div className='ui sixteen wide column'>
            {this.renderView()}
        </div>)
    }
}