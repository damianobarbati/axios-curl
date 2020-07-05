import axios from 'axios';
import axiosCurl from './index.js';
import qs from 'querystring';
import FormData from 'form-data';

axiosCurl(axios);

await axios.get('https://www.google.com').catch(Function.prototype);

await axios.post('https://www.google.com', {
    hello: 'world',
    ciao: 'mondo',
}).catch(Function.prototype);

await axios.post('https://www.google.com', qs.stringify({
    hello: 'world',
    ciao: 'mondo',
}), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
}).catch(Function.prototype);

const formData = new FormData();
formData.append('hello','world');
formData.append('ciao','mondo');

await axios.post('https://www.google.com', formData, {
    headers: {
        'Authorization': 'Bearer 123',
    },
}).catch(Function.prototype);
