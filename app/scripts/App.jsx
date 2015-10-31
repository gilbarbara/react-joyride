import React from 'react/addons';
import reactMixin from 'react-mixin';
import { Mixin as ReactJoyride } from 'react-joyride';
import Header from'./components/Header';
import Panels from'./components/Panels';
import Charts from'./components/Charts';
import Tables from'./components/Tables';
import Loader from'./components/Loader';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            joyrideType: 'guided',
            ready: false
        };
    }

    componentWillMount () {
        this.joyrideSetOptions({
            debug: true,
            showSkipButton: true,
            stepCallback: (step) => {
                console.log('stepCallback', step);
            },
            completeCallback: (steps, skipped) => {
                console.log('completeCallback', steps, skipped);
            }
        });
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
            this.joyrideStart();
        }
    }

    _addSteps (steps) {
        this.setState({
            steps: this.joyrideAddSteps(steps)
        });
    }

    _onClickSwitch (e) {
        e.preventDefault();

        this.joyrideSetOptions({
            type: e.currentTarget.dataset.type
        });

        this.joyrideReplaceSteps(this.state.steps, false);

        setTimeout(() => {
            this.joyrideStart();
        }, 300);

        this.setState({
            joyrideType: e.currentTarget.dataset.type
        });
    }

    render () {
        var state = this.state,
            html;

        if (state.ready) {
            html = (
                <div>
                    <Header joyrideType={state.joyrideType} onClickSwitch={this._onClickSwitch.bind(this)}
                            addSteps={this._addSteps.bind(this)} />

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

reactMixin.onClass(App, ReactJoyride);

export default App;
