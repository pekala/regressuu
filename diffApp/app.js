const React = require('react');
const ReactDOM = require('react-dom');
const ImageDiff = require('react-image-diff');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const ScreenshotDiff = React.createClass({
    getInitialState: function () {
        return {
            slider: 50,
        };
    },
    onSlide: function (e) {
        this.setState({
            slider: e.target.value
        })
    },
    render: function() {
        return (
            <div className="ScreenshotDiff">
                <div className="ScreenshotDiff--header">
                    <h1>{this.props.componentName} <code>{this.props.fixture.name}</code></h1>
                    <span className="ScreenshotDiff--browser">{this.props.browserName}</span>
                </div>
                <div className="ScreenshotDiff--diff">
                    <ImageDiff before={this.props.baselinePath} after={this.props.regressionPath} type="swipe" value={this.state.slider / 100} />
                </div>
                <div className="ScreenshotDiff--slider">
                    <span>Original</span>
                    <span style={{float: 'right'}}>New</span>
                    <input type="range" defaultValue={this.state.slider} min="0"  max="100" name="range" onChange={this.onSlide}/>
                </div>
                <p>Difference <small>{this.props.misMatchPercentage}%</small></p>
                <div>
                    <img src={this.props.diffPath} />
                </div>
            </div>
        );
    }
});

const ScreenshotDiffs = React.createClass({
    render: function() {
        return (
            <div className="ScreenshotDiffs">
                {this.props.screenshots.length === 1
                    ? <h1>There is one potential regression</h1>
                    : <h1>There are {this.props.screenshots.length} potential regressions</h1>
                }
                <p>Inspect the changes and if everything looks as expected,
                you can <button onClick={this.props.acceptChanges}>Accept all changes</button>.</p>
                <p>Otherwise, fix the regressions and rerun the tests.</p>

                {this.props.screenshots.map(screenshot =>
                    <ScreenshotDiff  key={screenshot.baselineImagePath} {...screenshot} />
                )}
            </div>
        );
    }
});

const App = React.createClass({
    getInitialState: function () {
        return {};
    },
    acceptChanges: function() {
        this.setState({
            isProcessing: true,
        });
        fetch('/accept', {
            method: 'POST'
        }).then(() => {
            this.setState({
                isProcessing: false,
                hasSucceeded: true,
            });
        });
    },
    render: function() {
        return (
            <div className="App">
                {this.state.isProcessing
                    ? <span>Processing...</span>
                    : this.state.hasSucceeded
                        ? <span>Success!</span>
                        : <ScreenshotDiffs
                            screenshots={this.props.screenshots}
                            acceptChanges={this.acceptChanges}
                        />
                }
            </div>
        );
    }
});

ReactDOM.render(
    <App screenshots={window.__SCREENSHOTS} />,
    document.getElementById('root')
);
