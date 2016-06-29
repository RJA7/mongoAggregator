var expander = {};

expander.expandOne = function one(childPathName, projection, childCollectionName) {
    projection[childPathName] = {$arrayElemAt: ['$' + childPathName, 0]};

    return [{
        $lookup: {
            from        : childCollectionName || childPathName,
            foreignField: '_id',
            localField  : childPathName,
            as          : childPathName
        }
    }, {
        $project: projection
    }];
};

expander.expandMany = function many(childPathName, projection, childCollectionName) {
    var projectObj1 = Object.assign({}, projection);
    var projectionKeys = Object.keys(projection);
    var itKeys = projectionKeys.length;
    var groupObj = {_id: {}};
    var groupObjId = groupObj._id;
    var projectObj2 = {};
    var projectionKey;
    projectObj1[childPathName] = {$arrayElemAt: ['$' + childPathName, 0]};

    while (itKeys--) {
        projectionKey = projectionKeys[itKeys];
        groupObjId[projectionKey] = '$' + projectionKey;

        projectObj2[projectionKey] = '$_id.' + projectionKey;
    }
    delete groupObjId[childPathName];
    groupObj[childPathName] = {$push: '$' + childPathName};

    projectObj2[childPathName] = 1;

    return [{
        $unwind: {
            path                      : '$' + childPathName,
            preserveNullAndEmptyArrays: true
        }
    }, {
        $lookup: {
            from        : childCollectionName || childPathName,
            foreignField: '_id',
            localField  : childPathName,
            as          : childPathName
        }
    }, {
        $project: projectObj1
    }, {
        $group: groupObj
    }, {
        $project: projectObj2
    }];
};

expander.expandManyWithChildProjection = function (childPathName, projection, childProjection, childCollectionName) {
    var projectObj1 = Object.assign({}, projection);
    var projectionKeys = Object.keys(projection);
    var childKeys = Object.keys(childProjection);
    var itChildKeys = childKeys.length;
    var itKeys = projectionKeys.length;
    var groupObj = {_id: {}};
    var groupObjId = groupObj._id;
    var projectObj2 = {};
    var key;
    projectObj1[childPathName] = {$arrayElemAt: ['$' + childPathName, 0]};

    while (itKeys--) {
        key = projectionKeys[itKeys];
        groupObjId[key] = '$' + key;

        projectObj2[key] = '$_id.' + key;
    }
    delete groupObjId[childPathName];

    while (itChildKeys--) {
        key = childKeys[itChildKeys];
        childProjection[key] = '$' + childPathName + '_docs.' + key;
    }
    groupObj[childPathName] = {$push: childProjection};

    projectObj2[childPathName] = 1;

    return [{
        $unwind: {
            path                      : '$' + childPathName,
            preserveNullAndEmptyArrays: true
        }
    }, {
        $lookup: {
            from        : childCollectionName || childPathName,
            foreignField: '_id',
            localField  : childPathName,
            as          : childPathName + '_docs'
        }
    }, {
        $project: projectObj1
    }, {
        $group: groupObj
    }, {
        $project: projectObj2
    }];
};

module.exports = expander;
