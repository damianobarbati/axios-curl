export default (axios, { log = console.log, include = undefined, exclude = undefined } = {}) => {
    axios.interceptors.request.use(request => {
        if (include && !include(request))
            return request;

        if (exclude && exclude(request))
            return request;

        try {
            const curl = request.curl = curlize(request);
            log(curl);
        }
        catch (error) {
            console.error('axiosCurl error');
            console.error(error);
        }
        return request;
    });
};

const formDataToBody = formData => {
    let body = '';

    const data = Object.fromEntries([...formData]);

    for (const name in data) {
        const value = data[name];
        body += ` -F '${name}=${value}'`;
    }

    body = body.trim();

    return body;
};

const curlize = request => {
    // METHOD, URL, PARAMS
    let { method, url, params } = request;
    method = method.toUpperCase();
    url = url.trim();

    if (method === 'GET' && params) {
        const searchParams = new URLSearchParams(typeof params === 'string' ? params : Object.entries(params));
        url += '?' + searchParams.toString();
    }

    // AUTH AND TIMEOUT
    const { auth, timeout } = request;

    // HEADERS
    // default headers
    const headers = {
        ...(request.headers.common || {}),
        ...(request.headers[request.method.toLowerCase()] || {}),
    };

    // custom headers
    for (const key in request.headers)
        if (!['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(key))
            headers[key] = request.headers[key];

    // remove useless accept header
    delete headers['Accept'];

    // BODY
    let { data } = request;
    let body;

    if (request.method.toUpperCase() !== 'GET' && data !== undefined && data !== '' && Object.keys(data).length) {
        if (data.constructor.name === 'FormData') {
            body = formDataToBody(data);
            delete headers['Content-Type'];
            delete headers['content-type'];
        }
        // if not a string (thus urlencoded) is a JSON
        else if (typeof data !== 'string') {
            headers['Content-Type'] = 'application/json;charset=utf-8';
            body = JSON.stringify(data);
        }
        else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            body = data;
        }
    }

    let curl = `curl -X ${method} "${url}"`;

    if (auth)
        curl += ` -u "${auth.username}:${auth.password}"`;

    if (timeout)
        curl += ` -m ${parseInt(timeout / 1000)}`;

    for (const property in headers)
        curl += ` -H "${property}: ${headers[property]}"`;

    if (body)
        curl += !body.startsWith('-F') ? ` -d '${body}'` : ` ${body}`;

    return curl;
};