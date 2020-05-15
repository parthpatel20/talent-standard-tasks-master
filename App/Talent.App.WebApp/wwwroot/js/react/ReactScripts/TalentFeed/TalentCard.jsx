import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'
export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleProfile: false
        }
        this.toggleProfile = this.toggleProfile.bind(this);
        this.onImageError = this.onImageError.bind(this);
    }

    toggleProfile() {
        this.setState({
            toggleProfile: !this.state.toggleProfile
        })
    }

    onImageError(e) {
        e.target.src = "http://localhost:60290/images/defaultProfile.png";
    }
    renderProfile() {
        var talent = (this.props) ? this.props.talent : null
        if (talent) {
            return (
                <div className='content'>
                    <div className='ui equal width grid'>
                        <div className='column'>
                            <img loading='eager' onError={this.onImageError} src={(talent.photoId) ? talent.photoId : "http://localhost:60290/images/defaultProfile.png"} alt='Image not available' height='270' width='250' />
                        </div>
                        <div className='column'>
                            <div className='content'>
                                <div><b>Talent Snapshot</b></div>
                                <br />
                                {(talent.currentEmployment) ?
                                    <div>
                                        <div> <b>CURRENT EMPLOYER</b><br />{talent.currentEmployment.position} At {talent.currentEmployment.company}</div>
                                        <br />
                                        <div> <b>POSITION</b><br />{talent.currentEmployment.company}</div></div> : ""
                                }
                                <div> <b>VISA STATUS</b><br />{talent.visa}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (<p id="load-more-loading">
            <img src="/images/rolling.gif" alt="Loading…" />
        </p>)

    }
    renderFoorter() {
        var skills = (this.props) ? this.props.talent.skills : null;
        return (<div>
            {(skills) ? skills.map((skill, i) => {
                return <a key={i} className="ui blue basic label">{skill}</a>
            }) : null}
        </div>)
    }
    renderPlayer() {
        var videoUrl = (this.props) ? this.props.talent.videoUrl : '';
        return (
            <div className="ui embed">
                <ReactPlayer url={videoUrl} playing />
            </div>
        )
    }
    render() {
        var cvUrl = (this.props) ? this.props.talent.cvUrl : null;
        var lkUrl = (this.props) ? this.props.talent.linkedAccounts.linkedIn : null;
        var gtUrl = (this.props) ? this.props.talent.linkedAccounts.github : null;
        var name = (this.props) ? this.props.talent.name : null;
        return (<div className="ui raised link job card">
            <div className="header content">
                <div className="left floated header">{name}</div>
                <div className="right floated author">
                    <i className="star icon interested"></i></div>
                <br />
            </div>
            {(this.state.toggleProfile) ? this.renderProfile() : this.renderPlayer()}
            <div className="content" style={{ margin: '1px', padding: '1px' }}>
                <div className="ui five buttons" >
                    {
                        (this.state.toggleProfile) ? <a className="ui button" onClick={this.toggleProfile} style={{ backgroundColor: 'white' }}>
                            <i aria-hidden="true" className="video large  icon" ></i>
                        </a> : <a className="ui button" onClick={this.toggleProfile} style={{ backgroundColor: 'white' }}>
                                <i aria-hidden="true" className="user large  icon" ></i>
                            </a>
                    }

                    <a className="ui button" href={cvUrl} target="_blank" style={{ backgroundColor: 'white' }}>
                        <i aria-hidden="true" className="file pdf outline large icon"></i>
                    </a>
                    <a className="ui button" href={lkUrl} target="_blank" style={{ backgroundColor: 'white' }}>
                        <i aria-hidden="true" className="github large icon"></i>
                    </a>
                    <a className="ui button" href={gtUrl} target="_blank" style={{ backgroundColor: 'white' }}>
                        <i aria-hidden="true" className="linkedin large icon"></i>
                    </a>

                </div>
            </div >
            <div className="extra content">
                <div className="left floated">
                    {this.renderFoorter()}
                </div>
            </div>
        </div >)
    }
}

