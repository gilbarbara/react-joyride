import React from 'react';

export default class Panels extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        addSteps: React.PropTypes.func.isRequired
    }

    componentDidMount () {
        this.props.addSteps([
            {
                title: 'Comments',
                text: 'New comments sent by your users',
                selector: '.panel-comments',
                position: 'bottom'
            },
            {
                title: 'Tickets',
                text: 'New support tickets waiting for replies',
                selector: '.panel-tickets',
                position: 'bottom'
            }
        ]);
    }

    render () {
        return (
            <div className="row panels">
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="panel panel-dark panel-comments">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-xs-3">
                                    <i className="fa fa-comments fa-5x" />
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
                                                className="fa fa-arrow-circle-right" /></span>

                                <div className="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="panel panel-dark panel-tasks">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-xs-3">
                                    <i className="fa fa-tasks fa-5x" />
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
                                                className="fa fa-arrow-circle-right" /></span>

                                <div className="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="panel panel-dark panel-orders">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-xs-3">
                                    <i className="fa fa-shopping-cart fa-5x" />
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
                                            <span className="pull-right">
                                                <i className="fa fa-arrow-circle-right" /></span>

                                <div className="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="panel panel-dark panel-tickets">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-xs-3">
                                    <i className="fa fa-support fa-5x" />
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
                                                className="fa fa-arrow-circle-right" /></span>

                                <div className="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
