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

This works when `canonical(a)` and `canonical(b)` both return the same of either `a` or `b`.

Well, `canonical-instance` provides just that functionality!


```javascript
import { canonical } from "canonical-instance";
```

It also provides its internal `bisect` method used for efficient object lookup in a sorted array.

```javascript
import { bisect } from "canonical-instance";
```

Have fun!


## Assumptions

Of course, the `canonical(a)` and `canonical(b)` are only safe if you are not mutating either of
a or b!

## Data Types

canonical works well with `Number`, `String`, `Boolean`, `Array`, `Date`, and plain Objects as you
might expect.


For `functions`, it considers every function completely unique (thus having no extensionality), and
thus returns the value passed to `canonical` every time.

For Obects that contain properties or prototypes, `canonical` only cares about the iterable
properties returned from `Object.keys` for the purpose of extensional equality.
