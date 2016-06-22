'use strict';
const express = require('express');
const app = express();
const request = require('request');

var versionOSX;
var versionLinux32;
var versionLinux64;

const FETCH_INTERVAL_OSX = 300000;
const FETCH_INTERVAL_LINUX64 = 305000;
const FETCH_INTERVAL_LINUX32 = 310000;

app.use(require('morgan')('dev'));


app.get('/updates/latest/osx', (req, res) => {
    if (versionOSX) {
        const clientVersion = req.query.v;

        if (clientVersion === versionOSX) {
            res.status(204).end();
        } else {
            res.json({
                url: `${getBaseUrl()}updates/latest/osx/TUM Demand Manager-${versionOSX}-mac.zip`
            });
        }
    }
    else {
        res.status(204).end();
    }
});


app.get('/updates/latest/linux64', (req, res) => {
    if (versionLinux64) {
        const clientVersion = req.query.v;

        if (clientVersion === versionLinux64) {
            res.status(204).end();
        } else {
            res.json({
                url: `${getBaseUrl()}updates/latest/linux64/tumdmdesktop-${versionLinux64}.deb`
            });
        }
    }
    else {
        res.status(204).end();
    }
});


app.get('/updates/latest/linux32', (req, res) => {
    if (versionLinux32) {
        const clientVersion = req.query.v;

        if (clientVersion === versionLinux32) {
            res.status(204).end();
        } else {
            res.json({
                url: `${getBaseUrl()}updates/latest/linux64/tumdmdesktop-${versionLinux32}-ia32.deb`
            });
        }
    }
    else {
        res.status(204).end();
    }
});

let getBaseUrl = () => {
    return 'https://s3.eu-central-1.amazonaws.com/demand-manager-resources/'
}

let getVersionForOSX = () => {
    console.log(`Fetching latest version from ${versionOSXUrl}`);
    request.get(versionOSXUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            versionOSX = body;
            console.log(versionOSX)
        }
        else if (error) {
            console.error(error);
        }
    });

    setTimeout(getVersionForOSX, FETCH_INTERVAL_OSX);
}

let getVersionForLinux64 = () => {
    console.log(`Fetching latest version from ${versionLinux64Url}`);
    request.get(versionLinux64Url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            versionLinux64 = body;
            console.log(versionLinux64)
        }
        else if (error) {
            console.error(error);
        }
    });

    setTimeout(getVersionForLinux64, FETCH_INTERVAL_LINUX64);
}

let getVersionForLinux32 = () => {
    console.log(`Fetching latest version from ${versionLinux32Url}`);
    request.get(versionLinux32Url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            versionLinux32 = body;
            console.log(versionLinux32)
        }
        else if (error) {
            console.error(error);
        }
    });

    setTimeout(getVersionForLinux32, FETCH_INTERVAL_LINUX32);
}


const versionOSXUrl = `${getBaseUrl()}updates/latest/osx/buildVersion`;
const versionLinux64Url = `${getBaseUrl()}updates/latest/linux64/buildVersion`;
const versionLinux32Url = `${getBaseUrl()}updates/latest/linux32/buildVersion`;
getVersionForOSX();
getVersionForLinux64();
getVersionForLinux32();

app.listen('2500', '127.0.0.1', () => {
    console.log(`Express server listening on port 2500`);
});
