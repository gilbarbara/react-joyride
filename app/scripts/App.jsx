var React        = require('react/addons'),
    _            = require('lodash'),
    ReactJoyride = require('react-joyride').Mixin,
    Loader       = require('./components/Loader');

var App = React.createClass({

    mixins: [React.addons.PureRenderMixin, ReactJoyride],

    getInitialState () {
        return {
            ready: false
        };
    },

    componentDidMount: function () {
        setTimeout(() => {
            this.setState({
                ready: true
            }, () => {
                this.setState({
                    joyrideType: 'guided',
                    joyrideSteps: [
                        {
                            title: 'Joyride Type',
                            text: 'It can be a guided tour or single steps',
                            selector: '.switch-wrapper',
                            position: 'bottom'
                        },
                        {
                            title: 'Comments',
                            text: 'New comments sent by your users',
                            selector: '.panel:nth-of-type(1)',
                            position: 'bottom-left'
                        },
                        {
                            title: 'Visits',
                            text: 'New visits in your site overtime',
                            selector: '#area-chart',
                            position: 'top'
                        },
                        {
                            title: 'Sales',
                            text: 'Total of sales by type',
                            selector: '#donut-chart',
                            position: 'left'
                        },
                        {
                            title: 'Transactions',
                            text: 'Latest transactions',
                            selector: '#transactions',
                            position: 'top-right'
                        }
                    ]
                });
            });

        }, 1000);
    },

    _onClickSwitch (e) {
        e.preventDefault();

        this.setState({
            joyrideType: e.currentTarget.dataset.type,
            joyrideCurrentIndex: 0
        });
    },

    render () {
        var state = this.state,
            html;

        if (state.ready) {
            html = (
                <div>
                    <header className="main-header">
                        <h1>React Joyride</h1>

                        <div className="switch-wrapper">
                            <h4>Joyride Type</h4>

                            <div className="switch">
                                <a href="#" className={state.joyrideType === 'guided' ? 'active' : ''}
                                   data-type="guided"
                                   onClick={this._onClickSwitch}>Guided</a>
                                <a href="#" className={state.joyrideType === 'single' ? 'active' : ''}
                                   data-type="single"
                                   onClick={this._onClickSwitch}>Single</a>
                            </div>
                        </div>
                    </header>

                    <div id="page-wrapper">

                        <div className="container-fluid">

                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="panel panel-dark">
                                        <div className="panel-heading">
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="fa fa-comments fa-5x"></i>
                                                </div>
                                                <div className="col-xs-9 text-right">
                                                    <div className="huge">26</div>
                                                    <div>New Comments!</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#">
                                            <div className="panel-footer">
                                                <span className="pull-left">View Details</span>
                                            <span className="pull-right"><i
                                                className="fa fa-arrow-circle-right"></i></span>

                                                <div className="clearfix"></div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="panel panel-dark">
                                        <div className="panel-heading">
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="fa fa-tasks fa-5x"></i>
                                                </div>
                                                <div className="col-xs-9 text-right">
                                                    <div className="huge">12</div>
                                                    <div>New Tasks!</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#">
                                            <div className="panel-footer">
                                                <span className="pull-left">View Details</span>
                                            <span className="pull-right"><i
                                                className="fa fa-arrow-circle-right"></i></span>

                                                <div className="clearfix"></div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="panel panel-dark">
                                        <div className="panel-heading">
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="fa fa-shopping-cart fa-5x"></i>
                                                </div>
                                                <div className="col-xs-9 text-right">
                                                    <div className="huge">124</div>
                                                    <div>New Orders!</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#">
                                            <div className="panel-footer">
                                                <span className="pull-left">View Details</span>
                                            <span className="pull-right"><i
                                                className="fa fa-arrow-circle-right"></i></span>

                                                <div className="clearfix"></div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="panel panel-dark">
                                        <div className="panel-heading">
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="fa fa-support fa-5x"></i>
                                                </div>
                                                <div className="col-xs-9 text-right">
                                                    <div className="huge">13</div>
                                                    <div>Support Tickets!</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#">
                                            <div className="panel-footer">
                                                <span className="pull-left">View Details</span>
                                            <span className="pull-right"><i
                                                className="fa fa-arrow-circle-right"></i></span>

                                                <div className="clearfix"></div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-md-8">
                                    <div id="area-chart" className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title"><i
                                                className="fa fa-bar-chart-o fa-fw"></i> Area Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <svg height="347" version="1.1" width="100%"
                                                 xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                                <defs ></defs>
                                                <text x="49.21875" y="313" textAnchor="end"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif"
                                                      font-weight="normal">
                                                    <tspan dy="4"
                                                        >0
                                                    </tspan>
                                                </text>
                                                <path fill="none" stroke="#aaaaaa" d="M61.71875,313H948"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                <text x="49.21875" y="241" textAnchor="end"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif"
                                                      font-weight="normal">
                                                    <tspan dy="4"
                                                        >7,500
                                                    </tspan>
                                                </text>
                                                <path fill="none" stroke="#aaaaaa" d="M61.71875,241H948"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                <text x="49.21875" y="169" textAnchor="end"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif"
                                                      font-weight="normal">
                                                    <tspan dy="4"
                                                        >15,000
                                                    </tspan>
                                                </text>
                                                <path fill="none" stroke="#aaaaaa" d="M61.71875,169H948"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                <text x="49.21875" y="97.00000000000003" textAnchor="end"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif"
                                                      font-weight="normal">
                                                    <tspan dy="4.000000000000028"
                                                        >22,500
                                                    </tspan>
                                                </text>
                                                <path fill="none" stroke="#aaaaaa"
                                                      d="M61.71875,97.00000000000003H948"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                <text x="49.21875" y="25" textAnchor="end"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif"
                                                      font-weight="normal">
                                                    <tspan dy="4"
                                                        >30,000
                                                    </tspan>
                                                </text>
                                                <path fill="none" stroke="#aaaaaa" d="M61.71875,25H948"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                <text x="848.9260328068043" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2015-03
                                                    </tspan>
                                                </text>
                                                <text x="750.8840861052045" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2014-12
                                                    </tspan>
                                                </text>
                                                <text x="652.9318803159174" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2014-09
                                                    </tspan>
                                                </text>
                                                <text x="553.8579131227217" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2014-06
                                                    </tspan>
                                                </text>
                                                <text x="454.7839459295261" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2014-03
                                                    </tspan>
                                                </text>
                                                <text x="357.8188901756784" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2013-12
                                                    </tspan>
                                                </text>
                                                <text x="259.8666843863912" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2013-09
                                                    </tspan>
                                                </text>
                                                <text x="160.7927171931956" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2013-06
                                                    </tspan>
                                                </text>
                                                <text x="61.71875" y="325.5" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#888888"
                                                      fontSize="12px" fontFamily="sans-serif" font-weight="normal"
                                                      transform="matrix(1,0,0,1,0,7)">
                                                    <tspan dy="4"
                                                        >2013-03
                                                    </tspan>
                                                </text>
                                                <path fill="#7cb47c" stroke="none"
                                                      d="M61.71875,261.9952C86.4872417982989,256.7152,136.02422539489672,245.758,160.7927171931956,240.8752C185.5612089914945,235.9924,235.09819258809233,229.61865014803007,259.8666843863912,222.93280000000001C284.354735833713,216.32265014803008,333.33083872835664,189.6631364640884,357.8188901756784,187.6912C382.06015411414035,185.7391364640884,430.54268199106417,205.80160714122226,454.7839459295261,207.23680000000002C479.552437727825,208.70320714122226,529.0894213244228,198.32080000000002,553.8579131227217,199.29760000000002C578.6264049210206,200.2744,628.1633885176185,232.39458492370758,652.9318803159174,215.0512C677.4199317632392,197.9041849237076,726.3960346578826,69.69856923076924,750.8840861052045,61.33600000000001C775.3945727806044,52.96576923076924,824.4155461314043,135.84978010471204,848.9260328068043,148.12C873.6945246051032,160.51938010471204,923.2315082017011,157.04080000000002,948,160.01440000000002L948,313L61.71875,313Z"
                                                      fillOpacity="1"></path>
                                                <path fill="none" stroke="#4da74d"
                                                      d="M61.71875,261.9952C86.4872417982989,256.7152,136.02422539489672,245.758,160.7927171931956,240.8752C185.5612089914945,235.9924,235.09819258809233,229.61865014803007,259.8666843863912,222.93280000000001C284.354735833713,216.32265014803008,333.33083872835664,189.6631364640884,357.8188901756784,187.6912C382.06015411414035,185.7391364640884,430.54268199106417,205.80160714122226,454.7839459295261,207.23680000000002C479.552437727825,208.70320714122226,529.0894213244228,198.32080000000002,553.8579131227217,199.29760000000002C578.6264049210206,200.2744,628.1633885176185,232.39458492370758,652.9318803159174,215.0512C677.4199317632392,197.9041849237076,726.3960346578826,69.69856923076924,750.8840861052045,61.33600000000001C775.3945727806044,52.96576923076924,824.4155461314043,135.84978010471204,848.9260328068043,148.12C873.6945246051032,160.51938010471204,923.2315082017011,157.04080000000002,948,160.01440000000002"
                                                      strokeWidth="3"
                                                    ></path>
                                                <circle cx="61.71875" cy="261.9952" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="160.7927171931956" cy="240.8752" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="259.8666843863912" cy="222.93280000000001" r="2"
                                                        fill="#4da74d" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="357.8188901756784" cy="187.6912" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="454.7839459295261" cy="207.23680000000002" r="2"
                                                        fill="#4da74d" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="553.8579131227217" cy="199.29760000000002" r="2"
                                                        fill="#4da74d" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="652.9318803159174" cy="215.0512" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="750.8840861052045" cy="61.33600000000001" r="2"
                                                        fill="#4da74d" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="848.9260328068043" cy="148.12" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="948" cy="160.01440000000002" r="2" fill="#4da74d"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <path fill="#a7b3bc" stroke="none"
                                                      d="M61.71875,287.4064C86.4872417982989,281.632,136.02422539489672,269.3668,160.7927171931956,264.3088C185.5612089914945,259.2508,235.09819258809233,249.70845930312004,259.8666843863912,246.94240000000002C284.354735833713,244.20765930312004,333.33083872835664,244.52840055248623,357.8188901756784,242.30560000000003C382.06015411414035,240.10520055248622,430.54268199106417,232.33484916456854,454.7839459295261,229.2496C479.552437727825,226.09724916456855,529.0894213244228,217.22440000000003,553.8579131227217,217.35520000000002C578.6264049210206,217.48600000000002,628.1633885176185,243.66407979959007,652.9318803159174,230.296C677.4199317632392,217.07927979959007,726.3960346578826,118.850810989011,750.8840861052045,111.01600000000002C775.3945727806044,103.17401098901101,824.4155461314043,159.35811937172778,848.9260328068043,167.58880000000002C873.6945246051032,175.90611937172775,923.2315082017011,174.8032,948,177.208L948,313L61.71875,313Z"
                                                      fillOpacity="1"
                                                    ></path>
                                                <path fill="none" stroke="#7a92a3"
                                                      d="M61.71875,287.4064C86.4872417982989,281.632,136.02422539489672,269.3668,160.7927171931956,264.3088C185.5612089914945,259.2508,235.09819258809233,249.70845930312004,259.8666843863912,246.94240000000002C284.354735833713,244.20765930312004,333.33083872835664,244.52840055248623,357.8188901756784,242.30560000000003C382.06015411414035,240.10520055248622,430.54268199106417,232.33484916456854,454.7839459295261,229.2496C479.552437727825,226.09724916456855,529.0894213244228,217.22440000000003,553.8579131227217,217.35520000000002C578.6264049210206,217.48600000000002,628.1633885176185,243.66407979959007,652.9318803159174,230.296C677.4199317632392,217.07927979959007,726.3960346578826,118.850810989011,750.8840861052045,111.01600000000002C775.3945727806044,103.17401098901101,824.4155461314043,159.35811937172778,848.9260328068043,167.58880000000002C873.6945246051032,175.90611937172775,923.2315082017011,174.8032,948,177.208"
                                                      strokeWidth="3"
                                                    ></path>
                                                <circle cx="61.71875" cy="287.4064" r="2" fill="#7a92a3"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="160.7927171931956" cy="264.3088" r="2" fill="#7a92a3"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="259.8666843863912" cy="246.94240000000002" r="2"
                                                        fill="#7a92a3" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="357.8188901756784" cy="242.30560000000003" r="2"
                                                        fill="#7a92a3" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="454.7839459295261" cy="229.2496" r="2" fill="#7a92a3"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="553.8579131227217" cy="217.35520000000002" r="2"
                                                        fill="#7a92a3" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="652.9318803159174" cy="230.296" r="2" fill="#7a92a3"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="750.8840861052045" cy="111.01600000000002" r="2"
                                                        fill="#7a92a3" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="848.9260328068043" cy="167.58880000000002" r="2"
                                                        fill="#7a92a3" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="948" cy="177.208" r="2" fill="#7a92a3" stroke="#ffffff"
                                                        strokeWidth="1"
                                                    ></circle>
                                                <path fill="#2577b5" stroke="none"
                                                      d="M61.71875,287.4064C86.4872417982989,287.1376,136.02422539489672,289.0264,160.7927171931956,286.3312C185.5612089914945,283.636,235.09819258809233,267.03835700296065,259.8666843863912,265.8448C284.354735833713,264.66475700296064,333.33083872835664,279.1259348066298,357.8188901756784,276.8368C382.06015411414035,274.57073480662984,430.54268199106417,249.8830339208057,454.7839459295261,247.62400000000002C479.552437727825,245.3158339208057,529.0894213244228,256.18,553.8579131227217,258.568C578.6264049210206,260.95599999999996,628.1633885176185,278.07584276930083,652.9318803159174,266.728C677.4199317632392,255.50864276930088,726.3960346578826,175.3363763736264,750.8840861052045,168.2992C775.3945727806044,161.25557637362638,824.4155461314043,202.47732356020944,848.9260328068043,210.40480000000002C873.6945246051032,218.41572356020944,923.2315082017011,226.6408,948,232.0528L948,313L61.71875,313Z"
                                                      fillOpacity="1"></path>
                                                <path fill="none" stroke="#0b62a4"
                                                      d="M61.71875,287.4064C86.4872417982989,287.1376,136.02422539489672,289.0264,160.7927171931956,286.3312C185.5612089914945,283.636,235.09819258809233,267.03835700296065,259.8666843863912,265.8448C284.354735833713,264.66475700296064,333.33083872835664,279.1259348066298,357.8188901756784,276.8368C382.06015411414035,274.57073480662984,430.54268199106417,249.8830339208057,454.7839459295261,247.62400000000002C479.552437727825,245.3158339208057,529.0894213244228,256.18,553.8579131227217,258.568C578.6264049210206,260.95599999999996,628.1633885176185,278.07584276930083,652.9318803159174,266.728C677.4199317632392,255.50864276930088,726.3960346578826,175.3363763736264,750.8840861052045,168.2992C775.3945727806044,161.25557637362638,824.4155461314043,202.47732356020944,848.9260328068043,210.40480000000002C873.6945246051032,218.41572356020944,923.2315082017011,226.6408,948,232.0528"
                                                      strokeWidth="3"
                                                    ></path>
                                                <circle cx="61.71875" cy="287.4064" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="160.7927171931956" cy="286.3312" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="259.8666843863912" cy="265.8448" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="357.8188901756784" cy="276.8368" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="454.7839459295261" cy="247.62400000000002" r="2"
                                                        fill="#0b62a4" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="553.8579131227217" cy="258.568" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="652.9318803159174" cy="266.728" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="750.8840861052045" cy="168.2992" r="2" fill="#0b62a4"
                                                        stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="848.9260328068043" cy="210.40480000000002" r="2"
                                                        fill="#0b62a4" stroke="#ffffff" strokeWidth="1"
                                                    ></circle>
                                                <circle cx="948" cy="232.0528" r="2" fill="#0b62a4" stroke="#ffffff"
                                                        strokeWidth="1"
                                                    ></circle>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-4">
                                    <div id="donut-chart" className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title"><i
                                                className="fa fa-long-arrow-right fa-fw"></i> Donut Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <svg height="347" version="1.1" width="283"
                                                 xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                                <path fill="none" stroke="#0b62a4"
                                                      d="M141.5,263.6666666666667A87.66666666666667,87.66666666666667,0,0,0,224.4125105355438,204.47736015043859"
                                                      strokeWidth="2" opacity="0"
                                                    ></path>
                                                <path fill="#0b62a4" stroke="#ffffff"
                                                      d="M141.5,266.6666666666667A90.66666666666667,90.66666666666667,0,0,0,227.24982078200725,205.4518705738376L261.13991539254323,217.09185618665947A126.5,126.5,0,0,1,141.5,302.5Z"
                                                      strokeWidth="3"
                                                    ></path>
                                                <path fill="none" stroke="#3980b5"
                                                      d="M224.4125105355438,204.47736015043859A87.66666666666667,87.66666666666667,0,0,0,62.8718822023325,137.23063663096116"
                                                      strokeWidth="2" opacity="1"
                                                    ></path>
                                                <path fill="#3980b5" stroke="#ffffff"
                                                      d="M227.24982078200725,205.4518705738376A90.66666666666667,90.66666666666667,0,0,0,60.181186156024495,135.90392837878875L23.557823303498765,117.84595494644175A131.5,131.5,0,0,1,265.8687658033157,218.71604022565785Z"
                                                      strokeWidth="3"
                                                    ></path>
                                                <path fill="none" stroke="#679dc6"
                                                      d="M62.8718822023325,137.23063663096116A87.66666666666667,87.66666666666667,0,0,0,141.47245870485656,263.6666623404901"
                                                      strokeWidth="2" opacity="0"></path>
                                                <path fill="#679dc6" stroke="#ffffff"
                                                      d="M60.181186156024495,135.90392837878875A90.66666666666667,90.66666666666667,0,0,0,141.471516227076,266.66666219244604L141.46025885358583,302.4999937574753A126.5,126.5,0,0,1,28.042316714012117,120.05713536672914Z"
                                                      strokeWidth="3"
                                                    ></path>
                                                <text x="141.5" y="166" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#000000"

                                                      fontSize="15px" font-weight="800"
                                                      transform="matrix(1.577,0,0,1.577,-81.6475,-100.689)"
                                                      strokeWidth="0.6341096324461343">
                                                    <tspan dy="5.5"
                                                        >In-Store Sales
                                                    </tspan>
                                                </text>
                                                <text x="141.5" y="186" textAnchor="middle"
                                                      font="10px &quot;Arial&quot;" stroke="none" fill="#000000"

                                                      fontSize="14px"
                                                      transform="matrix(1.8264,0,0,1.8264,-116.934,-147.0972)"
                                                      strokeWidth="0.5475285171102661">
                                                    <tspan dy="5"
                                                        >30
                                                    </tspan>
                                                </text>
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <a href="#">View Details <i
                                                className="fa fa-arrow-circle-right"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-md-6">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title"><i
                                                className="fa fa-clock-o fa-fw"></i> Tasks Panel
                                            </h3>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-group">
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">just now</span>
                                                    <i className="fa fa-fw fa-calendar"></i> Calendar updated
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">4 minutes ago</span>
                                                    <i className="fa fa-fw fa-comment"></i> Commented on a post
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">23 minutes ago</span>
                                                    <i className="fa fa-fw fa-truck"></i> Order 392 shipped
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">46 minutes ago</span>
                                                    <i className="fa fa-fw fa-money"></i> Invoice 653 has been paid
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">1 hour ago</span>
                                                    <i className="fa fa-fw fa-user"></i> A new user has been added
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">2 hours ago</span>
                                                    <i className="fa fa-fw fa-check"></i> Completed task: "pick up dry cleaning"
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">yesterday</span>
                                                    <i className="fa fa-fw fa-globe"></i> Saved the world
                                                </a>
                                                <a href="#" className="list-group-item">
                                                    <span className="badge">two days ago</span>
                                                    <i className="fa fa-fw fa-check"></i> Completed task: "fix error on sales page"
                                                </a>
                                            </div>
                                            <div className="text-right">
                                                <a href="#">View All Activity <i
                                                    className="fa fa-arrow-circle-right"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6">
                                    <div id="transactions" className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title"><i
                                                className="fa fa-money fa-fw"></i> Transactions Panel</h3>
                                        </div>
                                        <div className="panel-body">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover table-striped">
                                                    <thead>
                                                    <tr>
                                                        <th>Order #</th>
                                                        <th>Order Date</th>
                                                        <th>Order Time</th>
                                                        <th>Amount (USD)</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>3326</td>
                                                        <td>08/21/2015</td>
                                                        <td>3:29 PM</td>
                                                        <td>$321.33</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3325</td>
                                                        <td>08/21/2015</td>
                                                        <td>3:20 PM</td>
                                                        <td>$234.34</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3324</td>
                                                        <td>08/21/2015</td>
                                                        <td>3:03 PM</td>
                                                        <td>$724.17</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3323</td>
                                                        <td>08/21/2015</td>
                                                        <td>3:00 PM</td>
                                                        <td>$23.71</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3322</td>
                                                        <td>08/21/2015</td>
                                                        <td>2:49 PM</td>
                                                        <td>$8345.23</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3321</td>
                                                        <td>08/21/2015</td>
                                                        <td>2:23 PM</td>
                                                        <td>$245.12</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-right">
                                                <a href="#">View All Transactions <i
                                                    className="fa fa-arrow-circle-right"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            html = <Loader/>;
        }

        return (
            <div className="app">
                {html}
            </div>
        );
    }
});

module.exports = App;
