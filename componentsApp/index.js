const ReactQuerystringRouter = require('react-querystring-router');
const ComponentPlayground = require('react-component-playground');
const getComponentFixtureTree = require('GET_FIXTURE_TREE');

module.exports = new ReactQuerystringRouter.Router({
    container: document.getElementById('root'),
    defaultProps: {
        components: getComponentFixtureTree(),
    },
    getComponentClass: function() {
        return ComponentPlayground;
    },
});
