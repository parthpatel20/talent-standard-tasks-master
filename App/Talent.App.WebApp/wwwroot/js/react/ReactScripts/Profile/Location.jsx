import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput, DrpDownComp } from '../Form/SingleInput.jsx';
import { isEmpty, isNumber, capitalize } from './Validation.jsx';
import { countryOptions } from '../Employer/common.js';


export class Address extends React.Component {
    constructor(props) {
        super(props)
        const address = {
            city: "",
            country: "",
            number: "",
            postCode: 0,
            street: "",
            suburb: ""
        }
        this.state = {
            address: (props.addressData) ? props.addressData : address,
            isEdit: false,
        }
        this.renderEdit = this.renderEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDrpChange = this.handleDrpChange.bind(this);
        this.renderView = this.renderView.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.saveData = this.saveData.bind(this);

    }
    componentWillReceiveProps(nextprops) {
        const address = {
            city: "",
            country: "",
            number: "",
            postCode: 0,
            street: "",
            suburb: ""
        };

        (nextprops.addressData) ? this.setState({
            address: nextprops.addressData
        }) : Address
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.address)
        data[event.target.name] = event.target.value
        this.setState({
            address: data
        })
    }

    handleDrpChange(event, options) {
        const data = Object.assign({}, this.state.address);
        data[options.type] = options.value;
        this.setState({
            address: data
        })

    }
    saveData() {
        const addressjsn = Object.assign({}, this.state.address)
        if (!isEmpty(addressjsn.number) && !isEmpty(addressjsn.street) && !isEmpty(addressjsn.suburb) && !isEmpty(addressjsn.country) && !isEmpty(addressjsn.city) && !isEmpty(addressjsn.postCode)) {
            const data = {
                address: {
                    city: addressjsn.city,
                    country: addressjsn.country,
                    number: addressjsn.number,
                    postCode: addressjsn.postCode,
                    street: capitalize(addressjsn.street.toString()),
                    suburb: capitalize(addressjsn.suburb.toString())
                }
            }
            this.props.updateProfileData(Object.assign({}, data));
            this.props.saveProfileData(Object.assign({}, data));
            this.toggleEdit()
        }
        else {
            TalentUtil.notification.show("Please write your address for save ", "error", null, null)
        }
    }
    toggleEdit() {
        this.setState({
            isEdit: !this.state.isEdit
        })
    }
    renderCities() {
        const CityList = [];
        const value = this.state.address.city ? this.state.address.city : "";
        const Country = (this.state.address.country) ? this.state.address.country : ""
        if (Country) {
            Object.values(Countries[Country]).map((ct, i) => {
                CityList.push({
                    key: i, value: ct, text: ct
                })
            })
        }
        return (
            <DrpDownComp
                placeholder='Select City'
                label='City'
                options={CityList}
                value={value}
                type='city'
                controlFunc={this.handleDrpChange}
                errorMessage='Please Select City'
            />
        )
    }
    renderConturies() {
        const contry = Object.keys(Countries);
        const value = (this.state.address.country) ? this.state.address.country : ""
        const Coptions = [];
        contry.map((cntry, i) => {
            Coptions.push({
                key: i, value: cntry, text: cntry
            })
        })
        return (<DrpDownComp
            placeholder='Select Country'
            label='Country'
            options={Coptions}
            value={value}
            type='country'
            controlFunc={this.handleDrpChange}
            errorMessage='Please Select Country'
        />
        )
    }

    renderView() {
        const number = (this.state.address) ? this.state.address.number : null;
        const street = (this.state.address) ? this.state.address.street : null;
        const suburb = (this.state.address) ? this.state.address.suburb : null;
        const postCode = (this.state.address) ? this.state.address.postCode : null;
        const city = (this.state.address) ? this.state.address.city : "";
        const country = (this.state.address) ? this.state.address.country : "";
        const address = (number && street && suburb && postCode) ? `${number}` + "," + `${street}` + "," + `${suburb}` + "," + `${postCode}` : null

        return (<div className='row'>
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <p>Address:{address}</p>
                    <p>City: {city}</p>
                    <p>Country: {country}</p>
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.toggleEdit}>Edit</button>
            </div>
        </div>)
    }
    renderEdit() {
        const number = (this.state.address) ? this.state.address.number : "";
        const street = (this.state.address) ? this.state.address.street : "";
        const suburb = (this.state.address) ? this.state.address.suburb : "";
        const postCode = (this.state.address) ? this.state.address.postCode : 0;
        return (<div className="ui sixteen wide column">
            <div className="ui equal width grid">
                <div className="column">
                    <ChildSingleInput
                        inputType="text"
                        label="Number"
                        name="number"
                        value={number}
                        controlFunc={this.handleChange}
                        maxLength={5}
                        placeholder="Street Number"
                        errorMessage="Please write Street Number"
                    />
                </div>
                <div className="eight wide column">
                    <ChildSingleInput
                        inputType="text"
                        label="Street Name"
                        name="street"
                        value={street}
                        controlFunc={this.handleChange}
                        maxLength={50}
                        placeholder="Street Name"
                        errorMessage="Please write Street Name"
                    />
                </div>
                <div className="column">
                    <ChildSingleInput
                        inputType="text"
                        label="Suburb"
                        name="suburb"
                        value={suburb}
                        controlFunc={this.handleChange}
                        maxLength={30}
                        placeholder="Suburb"
                        errorMessage="Please write Suburb Area"
                    />
                </div>
            </div>
            <div className="ui equal width grid">
                <div className="six wide column">
                    {this.renderConturies()} </div>
                <div className="six wide column">{this.renderCities()}</div>
                <div className="column"><ChildSingleInput
                    inputType="text"
                    label="postCode"
                    name="postCode"
                    value={postCode}
                    controlFunc={this.handleChange}
                    maxLength={7}
                    placeholder="postCode"
                    errorMessage="Please write Area Code in Numeric Format"
                    isError={!isNumber(this.state.address.postCode)}
                /></div>
            </div>
            <div style={{ padding: '5px', paddingLeft: '0px' }}>
                <button type="button" className="ui teal button" onClick={this.saveData} >Save</button>
                <button type="button" className="ui button" onClick={this.toggleEdit}>Cancel</button>
            </div>
        </div>)
    }
    render() {
        return ((this.state.isEdit) ? this.renderEdit() : this.renderView())
    }
}


export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nationality: (props) ? props.nationalityData : ""
        }
        this.saveData = this.saveData.bind(this);
        this.handleDrpChange = this.handleDrpChange.bind(this);
    }
    handleDrpChange(event, options) {
        this.setState({
            nationality: options.value
        }, () => { this.saveData() })

    }
    saveData() {
        this.props.saveProfileData(Object.assign({}, this.state));
    }

    renderConturies() {
        const value = (this.props.nationalityData) ? this.props.nationalityData : ""
        return (<DrpDownComp
            placeholder='Select Nationality'
            options={countryOptions}
            value={value}
            type='nationality'
            controlFunc={this.handleDrpChange}
            errorMessage='Please Select Contry'
        />
        )
    }

    render() {
        return (
            <div className="six wide column">
                <div >
                    {this.renderConturies()}
                </div>
            </div>

        )
    }
}