export function getQuery(text) {
  if(text === "") return {}
  return text.slice(1).split('&').reduce((r, i) => Object.assign({}, r, { [i.split('=')[0]]: i.split('=')[1] }), {});
}

export function pushQuery(param) {
  var query = "";
  for (const [key, value] of Object.entries(param)) {
    query += `${key}=${encodeURIComponent(value)}&`
  }
  return query.substring(0, query.length - 1);
}
