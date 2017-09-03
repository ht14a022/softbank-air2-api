Softbank Air2 Settings API wrapper for nodejs
=========

A wrapper to connect and query the Softbank Air2 Settings API.

Softbank Air2 is Custom Model of Huawei B618.

Installation
------------

`npm install https://github.com/ht14a022/softbank-air2-api`

Usage
-----

```
const Router = require('softbank-air2-api');

// setting
const RIP = '192.168.8.1';
const USER = 'user';
const PASSWORD = 'password';

(async () => {
    let r = new Router(RIP);

    if (await r.login(USER, PASSWORD)) {
        console.log("Login Success");
    } else {
        return console.log('Login Failed');
    }

    // Demo: get all wifi hosts 

    let xml = (await r.get('api/wlan/host-list')).body;
    let hosts = (await xml2js(xml)).response.Hosts[0].Host;

    console.log(hosts);
})();
```