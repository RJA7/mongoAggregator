npm i mongo-aggregator

<h3>Usage:</h3>
<pre>
var expander = require('mongo-aggregator');

There are three methods:

1. expander.expandOne(childPath, projection, [childCollectionName])
    for expand simple (not array) field.

2. expander.expandMany(childPath, projection, [childCollectionName])
    for expand array field.

3. expander.expandManyWithChildProjection =
    function (childPathName, projection, childProjection, childCollectionName)
        for expand array field with projection for child documents.

    A result of functions will be aggregation obj.

    Next:

    // mongoose
    MyModel.aggregate(aggregationObj, function(err, myModels) {
        ...
    });

    // or mongo driver
    db.collection('myCollection').aggregate(aggregationObj, function(err, myDocs) {
        ...
    });
</pre>

<pre>

    Projection example:
    {
        name: 1,
        age: 1
    }

    For running tests install mocha globally before: npm i mocha -g
    And: npm run test
</pre>
