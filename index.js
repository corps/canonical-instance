var toString = new Object().toString;
var isArray = Array.isArray || function (v) {
  return toString.call(v) === "[object Array]";
}

function bisect(array, e, l, r) {
  if (l === void 0) l = 0;
  if (r === void 0) r = array.length;

  var mid;
  var c;

  while (l < r) {
    mid = l + r >>> 1;
    c = cmp(e, array[mid]);
    if (c > 0) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return l;
}

function arrayCmp(a, b) {
  var bLength = b.length;
  var aLength = a.length;

  var aVal;
  var bVal;
  var cmpResult;

  for (var i = 0; i < aLength && i < bLength; ++i) {
    aVal = a[i];
    bVal = b[i];

    cmpResult = cmp(aVal, bVal);
    if (0 === cmpResult) continue;
    return cmpResult;
  }

  if (aLength === bLength) return 0;
  if (aLength > bLength)
    return 1;

  return -1;
}

/*
 * undefined < null < non objects < Dates < arrays < non array objects
 */
function cmp(a, b) {
  if (a === b) return 0;

  if (undefined === a) return -1;
  if (undefined === b) return 1;

  if (null === a) return -1;
  if (null === b) return 1;

  var typeA = typeof a;
  var typeB = typeof b;

  if (typeA !== "object") {
    if (typeB === "object") return -1;
    return a < b ? -1 : 1;
  } else if (typeB !== "object") return 1;

  var dateA = a instanceof Date;
  var dateB = b instanceof Date;

  if (dateA) {
    if (dateB) return cmp(a.getTime(), b.getTime());
    return -1;
  } else if (dateB) return 1;

  var arrayA = isArray(a);
  var arrayB = isArray(b);

  if (arrayA) {
    if (arrayB) return arrayCmp(a, b);
    return -1;
  } else if (arrayB) return 1

  var keysA = Object.keys(a).sort();
  var keysB = Object.keys(b).sort();
  var cmpResult = arrayCmp(keysA, keysB);

  if (0 !== cmpResult) return cmpResult;

  var length = keysA.length;
  for (var i = 0; i < length; ++i) {
    var key = keysA[i];
    cmpResult = cmp(a[key], b[key]);
    if (0 !== cmpResult) return cmpResult;
  }

  return 0;
}

var values = [];
var results = [];

function fillOutCanonical(result, container) {
  var length;

  if (container instanceof Date) {
    return result;
  }

  if (isArray(container)) {
    length = container.length;

    for (var i = 0; i < length; ++i) {
      result.push(canonical(container[i]));
    }

    return result;
  }

  var keys = Object.keys(container);
  length = keys.length;

  for (var i = 0; i < length; ++i) {
    var k = keys[i];
    result[k] = canonical(container[k]);
  }

  return result;
}

function canonical(value) {
  if (value == null) return value;
  if (typeof value !== "object") return value;

  var idx = bisect(values, value);
  if (cmp(values[idx], value) === 0) {
    return results[idx];
  }

  var result;
  if (value instanceof Date) {
    result = value;
  } else if (isArray(value)) {
    result = [];
  } else {
    result = {};
  }

  values.splice(idx, 0, result);
  results.splice(idx, 0, result);

  fillOutCanonical(result, value);

  return result;
}

canonical.values = values;
canonical.results = results;

module.exports = {
  canonical: canonical,
  bisect: bisect,
  arrayCmp: arrayCmp,
  cmp: cmp,
};
