import React from 'react';

class Cards extends React.Component {
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
                text: 'New comments sent by users',
                selector: '.card-comments',
                trigger: '.card-comments a',
                position: 'top'
            },
            {
                title: 'Tickets',
                text: 'New support tickets waiting for replies',
                selector: '.card-tickets',
                position: 'bottom-right'
            }
        ]);
    }

    render () {
        return (
            <div className="row cards">
                <div className="col-xs-12 col-sm-6 col-lg-3">
                    <div className="card card-dark card-comments">
                        <div className="card-block">
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

                        <div className="card-footer clearfix">
                            <a href="#">
                                <span className="pull-left">View Details</span>
                                <span className="pull-right">
                                    <i className="fa fa-arrow-circle-right" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-3">
                    <div className="card card-dark card-tasks">
                        <div className="card-block">
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

                        <div className="card-footer clearfix">
                            <a href="#">
                                <span className="pull-left">View Details</span>
                                <span className="pull-right">
                                    <i className="fa fa-arrow-circle-right" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-3">
                    <div className="card card-dark card-orders">
                        <div className="card-block">
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

                        <div className="card-footer clearfix">
                            <a href="#">
                                <span className="pull-left">View Details</span>
                                <span className="pull-right">
                                    <i className="fa fa-arrow-circle-right" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-3">
                    <div className="card card-dark card-tickets">
                        <div className="card-block">
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

                        <div className="card-footer clearfix">
                            <a href="#">
                                <span className="pull-left">View Details</span>
                                <span className="pull-right">
                                    <i className="fa fa-arrow-circle-right" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cards;
