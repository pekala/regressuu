const React = require('react');

module.exports = function(props) {
    const style = {
        borderRadius: props.isRounded ? 20 : 0,
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
    };

    return React.createElement('button', {
        style: style,
        onClick: props.onClick,
    }, props.children);
};
