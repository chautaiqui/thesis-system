// import Login from "../../components/auth/login";

// const _promise = obj => new Promise(resolve => setTimeout(() => resolve(obj), 1000));

const apiDomain = 'https://a.adsplay.xyz';
const postRequest = async (fn, body) => {
  try {
    let _h = new Headers();
    _h.append('content-type', 'application/json');
    let _r = await fetch(`${apiDomain}/${fn}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: _h
    });
    if (!_r.ok) return { success: false, error: 'Api error' };
    _r = await _r.json();
    if (_r.status !== 200)  return { success: false, error: _r.message || 'Api ok but smt error' };
    return { success: true, result: _r };
  } catch(e) {
    return { success: false, error: e };
  }
}
const getRequest = async (fn, api_token, meta = {}, extend = []) => {
  try {
    let _h = new Headers()
    _h.append('authorization',api_token);
    delete meta.fields;
    delete meta.total;  
    let queryString = '';
    for (let x in meta ) {
      if (!x || !meta[x]) continue;
      queryString += `&${x}=${encodeURIComponent(meta[x])}`;
    }
    const ex = extend.length === 0 ? '' : '/' + extend.join('/');
    var url = `${apiDomain}/api/${fn}${ex}?${queryString.slice(1)}`;
    let re = await fetch(url, {
        method: 'GET',
        headers: _h
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    if(_re.status === 401) return window.location.reload()
    if(_re.status === 403) return {success: true, result: {data: []}}
    if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    
    return {success: true, result: _re} // result {data, meta}
  } catch (e) {
    return { success: false, error: e };
  }
}

const postRequestItem = async(fn, api_token, data) => {
  try {
    let _h = new Headers()
    _h.append('authorization',api_token);
    _h.append('Content-Type', 'application/json');
    var url = `${apiDomain}/api/${fn}`;
    let re = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: _h
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    // if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    if (_re.status === 500) return {success: false, error: 'The name has already been taken.'} /* */
    return {success: true, result: _re}
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}
const putRequest = async(fn, api_token, data, id) => {
  if (!id) return { success: false, error: '' };
  try {
    let _h = new Headers()
    _h.append('authorization',api_token);
    _h.append('Content-Type', 'application/json');
    var url = `${apiDomain}/api/${fn}/${id}`;
    
    let re = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: _h
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    // if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    return {success: true, result: _re}
  } catch (e) {
    return { success: false, error: e };
  }
}

const signin = {
  withPw: (email, password) => postRequest('login', { email, password }),
  withToken: (email, api_token) => postRequest('info', { email, api_token })
}

const fetchData = {
  transaction: () => {},
  campaigns: (api_token, meta) => getRequest('campaigns', api_token, meta),
  flights: (api_token, meta) => getRequest('flights', api_token, meta),
  accounts: (api_token, meta) => getRequest('accounts', api_token, meta),
  provinces: (api_token, meta) => getRequest('provinces', api_token, meta),
  categories: (api_token, meta) => getRequest('categories', api_token, meta),
  websiteapps: (api_token, meta) => getRequest('website-apps', api_token, meta),
  users: (api_token, meta) => getRequest('users', api_token, meta)
}

const postData = {
  transaction: () => {},
  flights: (api_token, data) => postRequestItem('flights', api_token, data),
  roles: (api_token, data) => postRequestItem('roles', api_token, data),
  user: (api_token, data) => postRequestItem('user', api_token, data),
  campaigns: (api_token, data) => postRequestItem('campaigns', api_token, data),
}
// putData -> update, postData -> create
const putData = {
  transaction: () => {},
  flights: (api_token, data) => putRequest('flights', api_token, data, data.id),
  roles: (api_token, data) => putRequest('roles', api_token, data, data.id),
  user: (api_token, data) => putRequest('user', api_token, data, data.id),
  campaigns: (api_token, data) => putRequest('campaigns', api_token, data, data.id),
  accounts: (api_token, data) => putRequest('accounts', api_token, data, data.id)
}

const requires = {
  accounts: (api_token, meta) => getRequest('accounts', api_token, meta),
  flights: (api_token, meta) => getRequest('flights', api_token, meta),
  provinces: (api_token, meta) => getRequest('provinces', api_token, meta),
  categories: (api_token, meta) => getRequest('categories', api_token, meta),
  websiteapps: (api_token, meta) => getRequest('website-apps', api_token, meta),
  users: (api_token, meta) => getRequest('users', api_token, meta)
}

export { signin, fetchData, postData, putData, requires };

export {getRequest};
