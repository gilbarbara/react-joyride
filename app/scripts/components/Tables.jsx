import React from 'react';

class Tables extends React.Component {
  static propTypes = {
    addSteps: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.addSteps({
      title: 'Tooltip Position',
      text: 'Relative position of you beacon and tooltip. It can be one of these:`top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right`, `right` and `left`. This defaults to `top`.',
      selector: '.transactions',
      position: 'top-right',
      style: {
        mainColor: '#f07b50',
        beacon: {
          inner: '#f07b50',
          outer: '#f07b50'
        }
      }
    });

    setTimeout(() => {
      this.props.addSteps({
        title: 'Add steps after it has started',
        text: 'This step was added 2 seconds later in a setTimeout call',
        selector: '.tasks',
        position: 'right'
      });
    }, 3000);
  }

  render() {
    return (
      <div className="tables">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <div className="card tasks">
              <div className="card-header">
                <h3>
                  <i className="fa fa-clock-o fa-fw" /> Tasks Panel
                </h3>
              </div>
              <div className="card-block">
                <ul className="list-group">
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">just now</span>
                    <i className="fa fa-fw fa-calendar" /> Calendar updated
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">4 minutes ago</span>
                    <i className="fa fa-fw fa-comment" /> Commented on a post
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">23 minutes ago</span>
                    <i className="fa fa-fw fa-truck" /> Order 392 shipped
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">46 minutes ago</span>
                    <i className="fa fa-fw fa-money" /> Invoice 653 has been paid
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">1 hour ago</span>
                    <i className="fa fa-fw fa-user" /> A new user has been added
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">2 hours ago</span>
                    <i className="fa fa-fw fa-check" /> Completed task: "pick up dry cleaning"
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">yesterday</span>
                    <i className="fa fa-fw fa-globe" /> Saved the world
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">two days ago</span>
                    <i className="fa fa-fw fa-check" /> Completed task: "fix error on sales page"
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">just now</span>
                    <i className="fa fa-fw fa-calendar" /> Calendar updated
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">4 minutes ago</span>
                    <i className="fa fa-fw fa-comment" /> Commented on a post
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">23 minutes ago</span>
                    <i className="fa fa-fw fa-truck" /> Order 392 shipped
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">46 minutes ago</span>
                    <i className="fa fa-fw fa-money" /> Invoice 653 has been paid
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">1 hour ago</span>
                    <i className="fa fa-fw fa-user" /> A new user has been added
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">2 hours ago</span>
                    <i className="fa fa-fw fa-check" /> Completed task: "pick up dry cleaning"
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">yesterday</span>
                    <i className="fa fa-fw fa-globe" /> Saved the world
                  </li>
                  <li className="list-group-item">
                    <span className="label label-pill label-default pull-right">two days ago</span>
                    <i className="fa fa-fw fa-check" /> Completed task: "fix error on sales page"
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <div className="text-right">
                  <a href="#">View All Activity <i
                    className="fa fa-arrow-circle-right" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="card transactions">
              <div className="card-header">
                <h3>
                  <i className="fa fa-money fa-fw" /> Transactions Panel</h3>
              </div>
              <div className="card-block">
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
              </div>

              <div className="card-footer">
                <div className="text-right">
                  <a href="#">View All Transactions <i
                    className="fa fa-arrow-circle-right" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tables;
