import axios from 'axios';
import axiosCurl from './index.browser.js';

axiosCurl(axios);
axios.post('http://localhost:8080', { ciao: 1 }, { transformResponse: value => value }).then(({ data }) => document.write(`<pre>${data}</pre>`)).catch(console.error);