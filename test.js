var expect = require('chai').expect;
var expander = require('./index');

describe('Expander Aggregation', function () {

    it('should create aggregate object for expand simple field', function (done) {
        var aggregateObj = expander.expandOne('child', {field1: 1, field2: 1}, 'children');

        expect(aggregateObj)
            .to.be.deep.equal(
            [{
                $lookup: {
                    from        : 'children',
                    foreignField: '_id',
                    localField  : 'child',
                    as          : 'child'
                }
            }, {
                $project: {
                    field1: 1,
                    field2: 1,
                    child : {
                        $arrayElemAt: [
                            '$child',
                            0
                        ]
                    }
                }
            }
            ]);

        done();
    });

    it('should create aggregate object for expand array field', function (done) {
        var aggregateObj = expander.expandMany('children', {field1: 1, field2: 1}, 'children');

        expect(aggregateObj)
            .to.be.deep.equal(
            [{
                $unwind: {path: '$children', preserveNullAndEmptyArrays: true}
            }, {
                $lookup: {
                    from        : 'children',
                    foreignField: '_id',
                    localField  : 'children',
                    as          : 'children'
                }
            }, {
                $project: {
                    field1  : 1,
                    field2  : 1,
                    children: {
                        $arrayElemAt: [
                            '$children',
                            0
                        ]
                    }
                }
            }, {
                $group: {
                    _id     : {field1: '$field1', field2: '$field2'},
                    children: {$push: '$children'}
                }
            }, {
                $project: {field2: '$_id.field2', field1: '$_id.field1', children: 1}
            }]);

        done();
    });

    it('should create aggregate object for expand array with child projection', function (done) {
        var projection = {
            _id     : 1,
            driver  : 1,
            store   : 1,
            children: 1
        };
        var childProjection = {
            _id  : 1,
            store: 1
        };
        var aggregateObj = expander.expandManyWithChildProjection('children', projection, childProjection);

        expect(aggregateObj)
            .to.be.deep.equal([{
                $unwind: {
                    path                      : '$children',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {from: 'children', localField: 'children', foreignField: '_id', as: 'children_docs'}
            }, {
                $project: {
                    children: {$arrayElemAt: ['$children', 0]},
                    driver  : 1,
                    store   : 1,
                    _id     : 1
                }
            }, {
                $group: {
                    _id: {
                        _id   : '$_id',
                        driver: '$driver',
                        store : '$store'
                    },

                    children: {
                        $push: {
                            _id  : '$children_docs._id',
                            store: '$children_docs.store'
                        }
                    }
                }
            }, {
                $project: {
                    _id     : '$_id._id',
                    driver  : '$_id.driver',
                    store   : '$_id.store',
                    children: 1
                }
            }]
        );

        done();
    });

});
