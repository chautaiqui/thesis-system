/* eslint no-useless-escape: 0 */

import numeral from 'numeral';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import reduce from 'lodash/reduce';

export const safelyParseJSON = (string, defaultValue = '') => {
  if (!string) {
    return defaultValue;
  }

  if (typeof string !== 'string') {
    return string;
  }

  let result = string;
  try {
    let count = 0;
    do {
      result = JSON.parse(result);
      count++;
    } while (typeof result !== typeof defaultValue && count < 3)
  } catch (e) {
    result = defaultValue;
  }

  return typeof result !== typeof defaultValue ? defaultValue : result;
}

export const validURL = str => {
  /*const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\:\\d+)?(\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\\d_]*)?$','i'); // fragment locater */
  const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\.)+[a-z]{2,}', 'i'); // domain name

  return pattern.test(str);
}

export const slugify = (str, char) => {
  char = char || char === '' ? char : '-';

  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, char)
    .replace(/ă|ắ|ằ|ặ|ẳ|ẵ|á|à|ả|ã|ạ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
    .replace(/è|é|ẻ|ẽ|ẹ|ê|ế|ể|ề|ệ|ễ/g, 'e')
    .replace(/u|ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ự|ử|ữ/g, 'u')
    .replace(/i|í|ì|ị|ỉ|ĩ/g, 'i')
    .replace(/y|ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
    .replace(/o|ó|ò|ọ|ỏ|õ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ợ|ỡ/g, 'o')
    .replace(/đ/g, 'd')
    .replace(/đ/g, 'd')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, char)
    .replace(/' '/g, '')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const downloadFileFromUrl = url => {
  if (url.length > 0) {
    const $anchor = document.createElement('a');

    $anchor.download = 'Report';
    $anchor.href = url;
    // $anchor.target = '_blank';
    $anchor.style.display = 'none';
    document.body.appendChild($anchor);
    $anchor.click();
    $anchor.parentNode.removeChild($anchor);
  }
};

export const formatAdFrequency = flight => {
  if (!flight || !flight.ad_frequency) return '1';

  let result = safelyParseJSON(flight.ad_frequency, []);
  if (!Array.isArray(result) || result.length < 2) return '1';
            
  return formatNumber(Number(result[0]));
}

export const formatFlightsPlacesZones = flight => {
  if (!flight || !flight.flights_places_zones) return [];

  let result = flight.flights_places_zones;
  if (!Array.isArray(result) || result.length === 0) return [];

  return result.map(item => `${item.place_id}_${item.zone_id}`);
}

export const formatFlightsRegions = flight => {
  if (!flight || !flight.flights_regions) return [];

  let result = flight.flights_regions;
  if (!Array.isArray(result) || result.length === 0) return [];

  return result.map(item => `${item.id}`);
}

export const formatNumber = (number, format = '0,0') => {
  if (Number.isNaN(number) || !Number.isFinite(number)) return '-';
  return numeral(number).format(format);
}

export const formatInputNumber = (e, format = '0,0', min = null, max = null) => {
  if (!e || !e.target) {
    return e;
  }
  
  let value = e.target.value.match(/\d{1,4}(,\d{1,4})*/);

  if (value === null || value[0] === '') return '';

  value = Number(value[0].replace(/,/g, ''));

  if (!isEmpty(min) && value < min) {
    return formatNumber(Number(min), format);
  }

  if (!isEmpty(max) && value > max) {
    return formatNumber(Number(max), format);
  }

  return formatNumber(Number(value), format);
}

export const filterSelectOption = (input, option) => 
  slugify(option.props.children.toLowerCase()).match(slugify(input.toLowerCase()));

export const precisionRound = number => {
  if (Number.isNaN(number) || !Number.isFinite(number)) return 0;
  return Math.round(number * 100) / 100;
}

export const getArrayFromQuery = params => typeof params === 'string' ? params.split(',') : params;

export const getNumberFromString = string => Number(string.replace(/,/g, ''));

export const getWepappTypes = (flight, webapps) => {
  const flightWebapps = safelyParseJSON(flight.webapps, []).map(item => `${item}`);

  return uniq(
    webapps
      .filter(wA => flightWebapps.indexOf(`${wA.id}`) > -1)
      .map(wA => `${wA.type}`)
  );
}

export const getTypeCreative = creative => {
  if (creative && creative.creative_type==='video') return 'youtube';
  return 'picture';
}

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires;
}

export const getCookie = (cname) => {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export const filterEmptyInObject = obj => 
  reduce(obj,
    (res, item, key) => {
      if (typeof item === 'number' || !isEmpty(item)) {
        return Object.assign({}, res, {
          [key]: item
        })
      } else {
        return res;
      }
    }, {}
  );

export const formatText = (string = '') => {
  let result = '';
  if (!string) return result;
  for (let i = 0; i< string.length; i++) {
    result = result + `${(i===0 || string.charAt(i-1) === ' ') ? string.charAt(i).toUpperCase() : string.charAt(i)}`;
  }
  return result;
}

export const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}