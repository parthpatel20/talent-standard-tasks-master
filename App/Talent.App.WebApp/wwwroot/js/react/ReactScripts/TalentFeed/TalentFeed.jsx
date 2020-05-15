import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import TalentDetail from './TalentDetail.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            feed: {
                number: 5,
                position: 0,
            },
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.ajaxCall = this.ajaxCall.bind(this)
        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.populateFeed = this.populateFeed.bind(this);
        this.loader = this.loader.bind(this)

    };


    ajaxCall(url, type) {
        var cookies = Cookies.get('talentAuthToken');
        var data = Object.assign({}, this.state.feed);
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: (type == 'talent') ? "POST" : "GET",
            contentType: "application/json",
            dataType: "json",
            data: (type == 'talent') ? JSON.stringify(this.state.feed) : null,
            success: function (res) {
                if (res) {
                    if (type === 'employer') {
                        this.setState({
                            companyDetails: res.employer.companyContact
                        })
                    }
                    if (type === 'talent') {
                        this.setState({
                            feedData: res.data,
                        }
                            , () => {
                                $("#load-more-loading").hide();
                                data = {
                                    position: 0,
                                    number: this.state.feedData.length + 5
                                }
                                this.setState({
                                    feed: data
                                })
                            }
                        )
                    }
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    loadData() {//"http://profileapitalent.azurewebsites.net/";
        var link = "http://localhost:60290/"

        this.ajaxCall(link + 'profile/profile/getEmployerProfile', 'employer')
        this.ajaxCall(link + 'profile/profile/getTalent', 'talent')
    }
    handleScroll() {
        const win = $(window);
        if ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1) {
            $("#load-more-loading").show();
            //var link = "http://profileapitalent.azurewebsites.net/"; 
            var link = "http://localhost:60290/"
            this.ajaxCall(link + 'profile/profile/getTalent', 'talent')
            //load ajax and update states
            //call state and update state;
        }
    };
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.loadData()
        this.init()
    };
    populateFeed() {
        if (this.state.feedData.length != 0) {
            var talData = this.state.feedData
            var populateData = talData.map((tal, i) => (
                <TalentCard key={i} talent={tal} />
            ))
            return populateData;
        } else {
            $("#load-more-loading").show();

        }
    }
    loader() {
        return <p id="load-more-loading">
            <img src="/images/rolling.gif" alt="Loading…" />
        </p>
    }
    render() {
        console.log(this.state)
        return (

            < BodyWrapper reload={this.init} loaderData={this.state.loaderData} >
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile companyDetails={this.state.companyDetails} />
                    </div>
                    <div className="eight wide column">
                        {this.populateFeed()}
                        {this.loader()}
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper >
        )
    }
}