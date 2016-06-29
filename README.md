npm i mongo-aggregator

Usage:
<pre>
var expander = require('expander');

There are tree methods:

1. expander.expandOne(childPath, projection, [childCollectionName])
    for expand simple (not array) field.

2. expander.expandMany(childPath, projection, [childCollectionName])

3. expander.expandManyWithChildProjection =
    function (childPathName, projection, childProjection, childCollectionName)

    A result of functions will be aggregation obj.
    Next:

    MyModel.aggregate(aggregationObj, function(err, myModels) {
        ...
    });
</pre>

<pre>
Projection example:
    {
        name: 1,
        age: 1
    }

    Or simply pass mongo Schema obj instead.

    For running tests install mocha globally before: npm i mocha -g
</pre>
