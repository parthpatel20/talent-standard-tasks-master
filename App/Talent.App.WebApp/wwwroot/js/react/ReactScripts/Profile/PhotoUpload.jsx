/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Image } from 'semantic-ui-react'

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            selectedFileSource: '',
            profilePhotoUrl: 'http://localhost:60290/images/profileImg.jpg'
        }
        this.fileHandler = this.fileHandler.bind(this)
        this.imagePreview = this.imagePreview.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        (nextProps) ? this.setState({
            profilePhotoUrl: 'http://localhost:60290' + nextProps.imageId
        }) : null
    }
    uploadImage() {
        if (this.state.selectedFile) {
            var cookies = Cookies.get('talentAuthToken');
            const formData = new FormData();
            formData.append('file', this.state.selectedFile)
            $.ajax({
                url: this.props.savePhotoUrl,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                },
                type: "POST",
                processData: false,
                contentType: false,
                cache: false,
                data: formData,
                success: function (res) {
                    this.props.updateProfileData({
                        profilePhotoUrl: res.profilePath
                    })
                    this.setState({
                        selectedFile: null,
                        selectedFileSource: '',
                        profilePhotoUrl: null
                    })
                    //this.updateWithoutSave(res.data)
                }.bind(this),
                error: function (res) {
                    console.log(res, 'error')
                }.bind(this)
            })
        }
        else {
            TalentUtil.notification.show("Please Select Photo", "error", null, null)
        }

    }
    fileHandler(e) {
        this.setState({
            selectedFile: event.target.files[0]
        }, () => this.imagePreview())
    }

    imagePreview() {
        if (this.selectedFile !== null) {
            const reader = new FileReader();
            reader.onloadend = function (e) {
                this.setState({
                    profilePhotoUrl: reader.result
                })
            }.bind(this)
            reader.readAsDataURL(this.state.selectedFile)
        }
        else {
            this.setState({
                selectedFileSource: 'http://localhost:60290/images/profileImg.jpg'
            })
        }
    }
    render() {
        return (
            <div className='row'>
                <div className='ui sixteen wide column'>
                    <div style={{ marginLeft: '30%' }}>
                        <input type="file" style={{ display: 'none' }} onChange={this.fileHandler}
                            ref={fileInput => this.fileInput = fileInput} />
                        <Image style={{ height: '200px', width: '200px' }} src={(this.state.profilePhotoUrl) ? this.state.profilePhotoUrl : 'http://localhost:60290/images/profileImg.jpg'} size='medium' circular
                            onClick={() => {
                                this.setState({ selectedFile: null, selectedFileSource: '' }, () => this.fileInput.click())
                            }} />
                        {(this.state.selectedFile) ? <button type="button" style={{ marginLeft: '10%' }} className="ui teal button" onClick={this.uploadImage}><i aria-hidden="true" className="edit icon"></i>Upload</button> : ''}
                    </div>
                </div>
            </div >
        )
    }
}
