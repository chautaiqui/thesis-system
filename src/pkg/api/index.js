
const api_Domain = 'https://hotel-lv.herokuapp.com';

const _getRequest = async (fn, options = {}, extend = []) => {
  try {
    let _h = new Headers()
    // _h.append('authorization',api_token);
    _h.append("Content-Type", "text/plain;charset=UTF-8")
    delete options.fields;
    delete options.total;  
    let queryString = '';
    for (let x in options ) {
      if (!x || !options[x]) continue;
      queryString += `&${x}=${encodeURIComponent(options[x])}`;
    }
    const ex = extend.length === 0 ? '' : '/' + extend.join('/');
    var url = `${api_Domain}/api/${fn}${ex}?${queryString.slice(1)}`;
    let re = await fetch(url, {
        method: 'GET',
        headers: _h
    })
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    // if(_re.status === 401) return window.location.reload()
    // if(_re.status === 403) return {success: true, result: {data: []}}
    // if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    
    return {success: true, result: _re};
  } catch (e) {
    return { success: false, error: e };
  }
}

const _postRequest = async (fn, body) => {
  try {
    let _h = new Headers();
    _h.append('content-type', 'application/json');
    let url = `${api_Domain}/api/${fn}`
    let _r = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: _h
    });
    _r = await _r.json();
    if (_r.message) return { success: false, error: _r.message };
    // if (!_r.ok) return { success: false, error: 'Api error' };
    // if (_r.status !== 200)  return { success: false, error: _r.message || 'Api ok but smt error' };
    return { success: true, result: _r };
  } catch(e) {
    return { success: false, error: e };
  }
}

const _putRequest = async(fn, data, id) => {
  if (!id) return { success: false, error: '' };
  try {
    let _h = new Headers()
    _h.append("Content-Type", "application/json");
    var url = `${api_Domain}/api/${fn}/${id}`;
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

const putMethod = async(fn, data, id) => {
  try {
    let _h = new Headers()
    _h.append("Content-Type", "application/json");
    var url = `${api_Domain}/api/${fn}/${id}`;
    let re = await fetch(url, {
      method: 'PUT',
      body: data,
      headers: _h
    })
    console.log(re)
    if(!re.ok) return {success: false, error: 'Api error'}
    let _re = await re.json();
    // if(_re.status !== 200) return {success: false, error: _re.message || 'Api ok but smt error'}
    return {success: true, result: _re}
  } catch (e) {
    return { success: false, error: e };
  }
}
const postmethod = async (fn, body) => {
  try {
    let _h = new Headers();
    _h.append('content-type', 'application/x-www-form-urlencoded');
    let url = `${api_Domain}/api/${fn}`
    let _r = await fetch(url, {
      method: 'POST',
      body: body,
      headers: _h
    });
    _r = await _r.json();
    console.log(_r)
    if (_r.message) return { success: false, error: _r.message };
    // if (!_r.ok) return { success: false, error: 'Api error' };
    // if (_r.status !== 200)  return { success: false, error: _r.message || 'Api ok but smt error' };
    return { success: true, result: _r };
  } catch(e) {
    return { success: false, error: e };
  }
}
export { _getRequest, _putRequest, _postRequest, putMethod, postmethod};

 