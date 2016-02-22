const React = require('react');

module.exports = function(props) {
    const style = {
        fontSize: '2em',
        fontFamily: 'Comic Sans',
        textDecoration: props.underline ? 'underline' : 'none',
    };

    return React.createElement('h1', {
        style: style,
    }, props.children);
};
