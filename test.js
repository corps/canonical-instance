var assert = require("assert");
var canonical = require("./index").canonical;
var cmp = require("./index").cmp;

var copy


var testables = [];
var allValues = [];

function newHead(v) {
  testables.push([]);
  push(v);
}

function lastHead() {
  return testables[testables.length - 1][0];
}

function duplicate(v) {
  if (v == null) return v;
  return JSON.parse(JSON.stringify(v));
}

function push(v) {
  var row = testables.length - 1;
  var col = testables[row];
  allValues.push([row, col.length, v])
  col.push(v);
}

function shuffleArray(a) {
  for (var i = 0; i < a.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (a.length - i));

    var temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }

  return a;
}

function shuffleObject(o) {
  var original = Object.assign({}, o);
  var keys = Object.keys(o);
  keys.forEach(function(k) { delete o[k]; });

  shuffleArray(keys);

  keys.forEach(function(k) {
    var value = original[k];
    o[k] = value;
  });

  return o;
}

function sample() {
  return duplicate(allValues[Math.floor(Math.random() * allValues.length)][2]);
}


newHead(null);

// Numbers
for (var i = 0; i < 10; ++i) {
  newHead(Math.random());
}

// Strings
for (var i = 0; i < 10; ++i) {
  newHead(Math.random() + "");
}

// booleans
newHead(true);
newHead(false);

newHead({});
push({});

newHead([]);
push([]);

newHead([-10000]);

newHead({ b: sample(), a: sample(), c: sample() });
push(duplicate(lastHead()));

newHead([sample(), sample(), sample()]);
push(duplicate(lastHead()));

newHead({ b: sample(), e: sample(), c: sample() });
push(duplicate(lastHead()));
push(shuffleObject(duplicate(lastHead())));
push(shuffleObject(duplicate(lastHead())));

newHead([sample(), sample(), sample()]);
push(duplicate(lastHead()));

newHead({ a: sample(), c: sample() });
push(duplicate(lastHead()));

newHead(undefined);

newHead(function() {});
newHead(function() {});

newHead(new Date(4817));
push(new Date(4817));

newHead(new Date(2217));
push(new Date(2217));

var mixtTestables = testables.slice();
shuffleArray(mixtTestables);

mixtTestables.forEach(function(row) {
  row.forEach(function(v) {
    assert.deepEqual(v, row[0]);
    assert.equal(cmp(v, row[0]), 0, JSON.stringify(v) + " " + JSON.stringify(row[0]));
  });
});

mixtTestables.forEach(function(row) {
  assert.equal(cmp(row[0], row[0]), 0);
  assert.equal(canonical(row[0]), row[0]);
});

for (var i = 0; i < 10000; ++i) {
  shuffleArray(allValues).forEach(function(v) {
    var rowIdx = v[0];
    var colIdx = v[1];

    v = v[2];

    assert.equal(canonical(v), testables[rowIdx][0])
  });
}
