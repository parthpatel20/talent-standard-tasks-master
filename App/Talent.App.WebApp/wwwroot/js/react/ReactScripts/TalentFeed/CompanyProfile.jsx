import React from 'react';
import { Loader, Icon } from 'semantic-ui-react';
import Cookies from 'js-cookie';


export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var companyName = '';
        var number = '';
        var address = '';
        var email = '';
        // var des = '';
        if (this.props.companyDetails) {
            companyName = this.props.companyDetails.name;
            number = this.props.companyDetails.phone;
            address = this.props.companyDetails.location.city + ',' + this.props.companyDetails.location.country;
            email = this.props.companyDetails.email;
        }
        console.log(this.props.companyDetails)
        return (<div className="ui card">
            <div className="content">
                <div className="center aligned author">
                    <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                </div>
                <br />
                <div className="center aligned header">{companyName}</div>
                <div className="center aligned meta category">
                    <p>{address}</p>
                </div>
            </div>
            <div className="extra content">
                <div className='ui'><Icon name='call'></Icon> : {number}</div>
                <div className='ui'><Icon name='mail'></Icon> : {email}</div>
            </div>
        </div>)
    }
}