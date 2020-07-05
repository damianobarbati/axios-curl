import { strict as assert } from 'assert';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import axiosCurl from './index.js';
import AxiosMock from 'axios-mock-adapter';

axiosCurl(axios);

const axiosMock = new AxiosMock(axios);
axiosMock
    .onGet('https://google.com').reply(200, null)
    .onPost('https://google.com').reply(200, null)
    .onAny().passThrough();

(async () => {
    // double output because of https://github.com/ctimmerm/axios-mock-adapter/pull/200
    // await axios.post('http://localhost:8080', { ciao: 1 });
    // await axios.post('http://localhost:8080', 'ciao=1');

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.get('https://google.com');
            assert.strictEqual(curl, 'curl -X GET "https://google.com"');
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.get('https://google.com', { params: { a: 1, b: 2 } });
            assert.strictEqual(curl, 'curl -X GET "https://google.com?a=1&b=2"');
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.get('https://google.com', { params: 'a=1&b=2' });
            assert.strictEqual(curl, 'curl -X GET "https://google.com?a=1&b=2"');
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.get('https://google.com', {
                timeout: 3000,
                auth: {
                    username: 'johndoe',
                    password: 'secret',
                },
            });
            assert.strictEqual(curl, 'curl -X GET "https://google.com" -u "johndoe:secret" -m 3');
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.post('https://google.com');
            //tofix, json here
            assert.strictEqual(curl, 'curl -X POST "https://google.com" -H "Content-Type: application/x-www-form-urlencoded"');
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.post('https://google.com', { a: 1, b: 2 });
            //tofix, json here
            assert.strictEqual(curl, `curl -X POST "https://google.com" -H "Content-Type: application/json;charset=utf-8" -d '{"a":1,"b":2}'`);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.post('https://google.com', 'a=1&b=2');
            //tofix, json here
            assert.strictEqual(curl, `curl -X POST "https://google.com" -H "Content-Type: application/x-www-form-urlencoded" -d 'a=1&b=2'`);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.post('https://google.com', { a: 1, b: 2 }, {
                headers: {
                    x: 1,
                    y: 2,
                },
            });

            //tofix, json here
            assert.strictEqual(curl, `curl -X POST "https://google.com" -H "Content-Type: application/json;charset=utf-8" -H "x: 1" -H "y: 2" -d '{"a":1,"b":2}'`);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        try {
            const { config: { curl } } = await axios.post('https://google.com', { a: 1, b: 2 }, {
                headers: {
                    x: 1,
                    y: 2,
                },
            });

            //tofix, json here
            assert.strictEqual(curl, `curl -X POST "https://google.com" -H "Content-Type: application/json;charset=utf-8" -H "x: 1" -H "y: 2" -d '{"a":1,"b":2}'`);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    test: { // eslint-disable-line
        const stream = fs.createReadStream('./index.js');
        const abspath = path.resolve('./index.js');

        const data = new FormData();
        data.append('a', 1);
        data.append('b', true);
        data.append('file', stream);
        const headers = data.getHeaders();

        try {
            const { config: { curl } } = await axios.post('https://google.com', data, { headers });

            //tofix, json here
            assert.strictEqual(curl, `curl -X POST "https://google.com" -F 'a=1' -F 'b=true' -F 'file=@"${abspath}"'`);
        }
        catch (error) {
            console.error(error.message);
        }
    }
})().then(console.log).catch(console.error);
