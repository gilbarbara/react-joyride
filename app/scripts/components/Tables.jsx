import React from 'react';

export default class Tables extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        addSteps: React.PropTypes.func.isRequired
    }

    componentDidMount () {
        this.props.addSteps({
            title: 'Transactions',
            text: 'Latest transactions',
            selector: React.findDOMNode(this.refs.transactions),
            position: 'top-right'
        });
    }

    render () {
        return (
            <div className="row tables">
                <div className="col-xs-12 col-md-6">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <i className="fa fa-clock-o fa-fw" /> Tasks Panel
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <a href="#" className="list-group-item">
                                    <span className="badge">just now</span>
                                    <i className="fa fa-fw fa-calendar" /> Calendar updated
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">4 minutes ago</span>
                                    <i className="fa fa-fw fa-comment" /> Commented on a post
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">23 minutes ago</span>
                                    <i className="fa fa-fw fa-truck" /> Order 392 shipped
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">46 minutes ago</span>
                                    <i className="fa fa-fw fa-money" /> Invoice 653 has been paid
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">1 hour ago</span>
                                    <i className="fa fa-fw fa-user" /> A new user has been added
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">2 hours ago</span>
                                    <i className="fa fa-fw fa-check" /> Completed task: "pick up dry cleaning"
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">yesterday</span>
                                    <i className="fa fa-fw fa-globe" /> Saved the world
                                </a>
                                <a href="#" className="list-group-item">
                                    <span className="badge">two days ago</span>
                                    <i className="fa fa-fw fa-check" /> Completed task: "fix error on sales page"
                                </a>
                            </div>
                            <div className="text-right">
                                <a href="#">View All Activity <i
                                    className="fa fa-arrow-circle-right" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-6">
                    <div ref="transactions" className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <i className="fa fa-money fa-fw" /> Transactions Panel</h3>
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
                                    className="fa fa-arrow-circle-right" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
