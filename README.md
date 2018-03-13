# canonical-instance

A Javascript library that reduces the need for deepEquals by simply producing a canonical 
instance for all extensionally equivalent values.


## Use Cases

Wouldn't it be nice if === worked like deepEquals?  It would simplify alot of testing at the least.
Well, === would work like deepEquals *if Javascript gave us the same instance for objects that were
deepEquals in the first place*.

For instance, suppose we had a function `canonical`:

```javascript
var a = { a: 1 };
var b = { a: 1 };

canonical(a) === canonical(b); // True!
```

Well, `canonical-instance` provides just that functionality!


```javascript
import { canonical } from "canonical-instance";
```

It also provides its internal `bisect` method used for efficient object lookup in a sorted array.

```javascript
import { bisect } from "canonical-instance";
```

## It Works Recursively!

It's worth noting that the return value from canonical will __never be the same instance as the
object passed in__.

```javascript
var a = { a: 1 };
var b = { a: 1 };

canonical(a) === canonical(b); // True!
a === canonical(a); // False!
b === canonical(b); // False!
```

That's because the objects need to be reconstructed such that *inner properties are also canonical*!
Check this out:

```javascript
var a = { b: [ {c: {}, d: {}] };
var b = { b: [ {c: {}, d: {}] };

canonical(a.b[0].d) === canonical(b).b[0].c; // True!
```

## Limitations

Of course, the `canonical(a)` and `canonical(b)` are only safe if you are not mutating either of
a, b, or `canonical`'s result, so make sure you are accessing these objects in a read only way.

`canonical` works well with `Number`, `String`, `Boolean`, `Array`, `Date`, and plain
Objects as you might expect.  Notably, however, strings that are created with the `new String()`
constructor are treated as unique instances due to the special case of these values.  But really,
you should probably never be doing this.

For `functions`, it considers every function completely unique (thus having no extensionality), and
thus returns the value passed to `canonical` every time.

For Objects that contain dynamic properties or prototypes, `canonical` only cares about the iterable
properties returned from `Object.keys` for the purpose of extensional equality.
