import Login from "../../components/auth/login";

const _promise = obj => new Promise(resolve => setTimeout(() => resolve(obj), 1000));

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
const getRequest = async (fn, api_token, meta = {}) => {
  try {
    let _h = new Headers()
    _h.append('authorization',api_token);
    delete meta.qui;
    delete meta.fields;
    delete meta.total;  
    var queryString = '';
    let temp;
    for (let x in meta ) {
      if (!x || !meta[x]) continue;
      queryString += `&${x}=${encodeURIComponent(meta[x])}`;
    }
    var url = `${apiDomain}/api/${fn}?${queryString.slice(1)}`;
    let re = await fetch(url, {
        method: 'GET',
        headers: _h
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    return {success: true, result: _re} // result {data, meta}
  } catch (e) {
    return { success: false, error: e };
  }
}
const _getRequest = async (fn, api_token, meta) => {    
  try {
    let _h = new Headers()
    _h.append('authorization',api_token);
    var queryString = '';
    if (Object.keys(meta).length !== 0) {
      var options = {
        offset: meta.offset,
        limit: meta.limit
      }
      for (let x in options ) {
        queryString += `${x}=${options[x]}&`;
      }
    }
    var url = `http://localhost:3000/user/`;
    let re = await fetch(url, {
        method: 'GET'
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    let tem = {data: _re, meta: {}}
    return {success: true, result: tem} // result {data, meta}
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
    if (_re.status === 500) return {success: false, error: 'The name has already been taken.'}
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
    console.log(url)
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
  plans: () => _promise({
    success: true,
    result: [
      {
        id: 1,
        name: 'a',
        diamond: 1,
        price: 1,
        enabled: true
      },
      {
        id: 2,
        name: 'b',
        diamond: 2,
        price: 2,
        enabled: true
      },
      {
        id: 3,
        name: 'c',
        diamond: 3,
        price: 3,
        enabled: true
      }
    ]
  }),
  users: () => {},
  transaction: () => {},
  flights: (api_token, meta) => getRequest('flights', api_token, meta),
  permissions: (api_token, meta) => getRequest('permissions', api_token, meta),
  roles: (api_token, meta) => getRequest('roles', api_token, meta),
  user: (api_token, meta) => _getRequest('user', api_token, meta)
}

const postData = {
  plans: () => _promise({
    success: true,
    result: {
      id: 1,
      name: 'a',
      diamond: 1,
      price: 1,
      enabled: true
    }
  }),
  users: () => {},
  transaction: () => {},
  flights: (api_token, data) => postRequestItem('flights', api_token, data),
  roles: (api_token, data) => postRequestItem('roles', api_token, data),
  user: (api_token, data) => postRequestItem('user', api_token, data)
}

const putData = {
  plans: () => _promise({
    success: true,
    result: {
      id: 1,
      name: 'a',
      diamond: 1,
      price: 1,
      enabled: true
    }
  }),
  users: () => {},
  transaction: () => {},
  flights: (api_token, data) => putRequest('flights', api_token, data, data.id),
  roles: (api_token, data) => putRequest('roles', api_token, data, data.id),
  user: (api_token, data) => putRequest('user', api_token, data, data.id)
}
export { signin, fetchData, postData, putData };


