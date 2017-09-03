"use strict";
const crypto = require("crypto");
const rp = require('request-promise-native');

module.exports = class Router {
    constructor(ip) {
        this.RIP = ip;
        this.rawcookie = '';
    }

    async login(username, password) {
        let toppage = await rp({
            method: 'GET',
            uri: `http://${this.RIP}/html/toppage.html`,
            resolveWithFullResponse: true
        });
        this.rawcookie = toppage.headers['set-cookie'][0];

        let g_requestVerificationToken = toppage.body.match(/<meta name="csrf_token" content="([^"]+)/g).map(s => s.split('content="')[1]);

        // g_requestVerificationToken[0] = "0dHFZmC52lmrLabKosQuynPo0FHlXctO";
        // g_requestVerificationToken[1] = "0gFartVtMNlYNN40MQkoH7YSXf2aXcTs";

        let SHA256BASE64 = body => Buffer.from(crypto.createHash('sha256').update(body).digest('hex')).toString('base64');

        let authhash = `${username}${SHA256BASE64(password)}${g_requestVerificationToken[0]}`;
        let loginxml = `<?xml version="1.0" encoding="UTF-8"?><request>\n` +
            `<Username>${username}</Username>\n` +
            `<Password>${SHA256BASE64(authhash)}</Password>\n` +
            `<password_type>4</password_type>\n` +
            `</request>\n`;

        // ZjAxY2Y1YjYzMjgwMTE1YTMzMGNjZjU1NTFlYTY0NDk3YzE3YzZmOGVmMjgzODUzNDQyOGMyOTQxZWFiODU4MQ==

        let login = await rp({
            method: 'POST',
            uri: `http://${this.RIP}/api/user/login`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                '__RequestVerificationToken': g_requestVerificationToken[0],
                'Cookie': this.rawcookie,
            },
            body: loginxml,
            resolveWithFullResponse: true
        });

        if (login.body !== '<?xml version="1.0" encoding="UTF-8"?><response>OK</response>') return false;
        this.rawcookie = login.headers['set-cookie'][0];
        return true;
    }
    async get(uri) {
        let response = await rp({
            method: 'GET',
            uri: `http://${this.RIP}/${uri}`,
            headers: {
                'Cookie': this.rawcookie,
            },
            resolveWithFullResponse: true
        });
        return response;
    }
};