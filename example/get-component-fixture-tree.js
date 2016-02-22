module.exports = function(withPaths) {
    var requireComponent = require.context('COSMOS_COMPONENTS', true);
    var isComponent = /^\.\/(.+)\.jsx?$/;
    var components = {};

    requireComponent.keys().forEach(function(componentPath) {
        var match = componentPath.match(isComponent);
        if (!match) {
            return;
        }

        // Fixtures are grouped per component
        var componentName = match[1];
        components[componentName] = {
            class: requireComponent(componentPath),
            fixtures: getFixturesForComponent(componentName, withPaths),
        };
    });
    return components;
};

var getFixturesForComponent = function(componentName, withPaths) {
    var requireFixture = require.context('COSMOS_FIXTURES', true, /.js$/),
        isFixtureOfComponent = new RegExp('./' + componentName + '/([^/]+).js$'),
        fixtures = {};

    requireFixture.keys().forEach(function(fixturePath) {
        var match = fixturePath.match(isFixtureOfComponent);
        if (match) {
            const props = requireFixture(fixturePath);
            fixtures[match[1]] = !withPaths ? props : {
                props: props,
                path: fixturePath,
            };
        }
    });

    return fixtures;
};
