import React, { Component } from 'react';
import { Form, TextArea } from 'semantic-ui-react'
import moment from 'moment';

export default class Validation extends React.Component {

    constructor(props) {
        super(props)
        this.lengthcheck = this, lengthcheck.bind(this);
    }
}
export const lengthCheck = (min, max, words) => {
    if (words.length >= min && words.length <= max) {
        return true
    }
    TalentUtil.notification.show("Please check your summary and description length", "error", null, null)
    return false;
};
export const dateFormat = (date) => {

    var datetoMoment = moment(new Date(date));

    return datetoMoment
}
export const readLength = (max, itemL) => {
    if (itemL) {
        return max - itemL
    }
    return 0
}
export const urlValidator = (url) => {
    var regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (url === "") {
        return false;
    }
    if (regex.test(url)) {
        return true;
    }
}
export const dateForMoment = (date) => {
    var dateArr = date.split("/");
    return dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2]
}
export const dateForView = (date) => {
    return moment(new Date(date)).format('Do MMM YYYY')
}
export const dateForDb = (date) => {
    return moment(new Date(date)).format('DD/MM/YYYY')
}


export const isNumber = (val) => {
    var drex = /^(\d)?\d+$/
    console.log(drex.test(val))
    if (isEmpty(val)) {
        return true;
    }
    return (drex.test(val))
}

export const isEmpty = (val) => {
    if (val === null) {
        return true
    }
    return (typeof val === 'undefined' || val.length === 0 || val === "" || !val)
}

export const capitalize = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
}
export const sortBy = (x, y) => {

    return ((x === y) ? 0 : ((x > y) ? 1 : -1));
}

