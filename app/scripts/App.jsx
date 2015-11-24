import React from 'react';
import Joyride from 'react-joyride';
import Header from'./components/Header';
import Panels from'./components/Panels';
import Charts from'./components/Charts';
import Tables from'./components/Tables';
import Loader from'./components/Loader';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            joyrideOverlay: false,
            joyrideType: 'single',
            ready: false,
            steps: []
        };
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({
                ready: true
            });
        }, 1000);
    }

    componentDidUpdate (prevProps, prevState) {
        if (!prevState.ready && this.state.ready) {
            this.refs.joyride.start();
        }
    }

    _addSteps (steps) {
        let joyride = this.refs.joyride;

        if (!Array.isArray(steps)) {
            steps = [steps];
        }

        if (!steps.length) {
            return false;
        }

        this.setState(currentState => {
            currentState.steps = currentState.steps.concat(joyride.parseSteps(steps));
            return currentState;
        });
    }

    _addTooltip (data) {
        this.refs.joyride.addTooltip(data);
    }

    _stepCallback (step) {
        console.log('••• stepCallback', step);
    }

    _completeCallback (steps, skipped) {
        console.log('••• completeCallback', steps, skipped);
    }

    _onClickSwitch (e) {
        e.preventDefault();
        let el    = e.currentTarget,
            state = {};

        if (el.dataset.key === 'joyrideType') {
            this.refs.joyride.reset();

            setTimeout(() => {
                this.refs.joyride.start();
            }, 300);

            state.joyrideType = e.currentTarget.dataset.type;
        }

        if (el.dataset.key === 'joyrideOverlay') {
            state.joyrideOverlay = el.dataset.type === 'active';
        }

        this.setState(state);
    }

    render () {
        var state = this.state,
            html;

        if (state.ready) {
            html = (
                <div>
                    <Joyride ref="joyride" debug={true} steps={state.steps}
                             type={state.joyrideType} showSkipButton={true}
                             showOverlay={state.joyrideOverlay} stepCallback={this._stepCallback}
                             completeCallback={this._completeCallback} />
                    <Header joyrideType={state.joyrideType} joyrideOverlay={state.joyrideOverlay}
                            onClickSwitch={this._onClickSwitch.bind(this)}
                            addSteps={this._addSteps.bind(this)}
                            addTooltip={this._addTooltip.bind(this)} />

                    <div id="page-wrapper">

                        <div className="container-fluid">

                            <Panels addSteps={this._addSteps.bind(this)} />
                            <Charts addSteps={this._addSteps.bind(this)} />
                            <Tables addSteps={this._addSteps.bind(this)} />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            html = <Loader />;
        }

        return (
            <div className="app">
                {html}
            </div>
        );
    }
}

export default App;
