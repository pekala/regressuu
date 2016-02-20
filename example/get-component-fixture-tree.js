module.exports = function() {
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
            fixtures: getFixturesForComponent(componentName),
        };
    });
    return components;
};

var getFixturesForComponent = function(componentName) {
    var requireFixture = require.context('COSMOS_FIXTURES', true),
        isFixtureOfComponent = new RegExp('./' + componentName + '/([^/]+).js$'),
        fixtures = {};

    requireFixture.keys().forEach(function(fixturePath) {
        var match = fixturePath.match(isFixtureOfComponent);
        if (match) {
            fixtures[match[1]] = requireFixture(fixturePath);
        }
    });

    return fixtures;
};
