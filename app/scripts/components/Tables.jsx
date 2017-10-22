import React from 'react';
import PropTypes from 'prop-types';

class Tables extends React.Component {
  constructor(props) {
    super(props);

    this.orders = [
      {
        order: '3330',
        date: '08/22/2015',
        time: '8:34 PM',
        amount: '$196.30',
      },
      {
        order: '3329',
        date: '08/22/2015',
        time: '4:19 PM',
        amount: '$312.02',
      },
      {
        order: '3328',
        date: '08/22/2015',
        time: '1:21 AM',
        amount: '$217.23',
      },
      {
        order: '3327',
        date: '08/22/2015',
        time: '1:19 PM',
        amount: '$831.33',
      },
      {
        order: '3326',
        date: '08/21/2015',
        time: '3:29 PM',
        amount: '$321.33',
      },
      {
        order: '3325',
        date: '08/21/2015',
        time: '3:20 PM',
        amount: '$234.34',
      },
      {
        order: '3324',
        date: '08/21/2015',
        time: '3:03 PM',
        amount: '$724.17',
      },
      {
        order: '3323',
        date: '08/21/2015',
        time: '3:00 PM',
        amount: '$23.71',
      },
      {
        order: '3322',
        date: '08/21/2015',
        time: '2:49 PM',
        amount: '$8345.23',
      },
      {
        order: '3321',
        date: '08/21/2015',
        time: '2:23 PM',
        amount: '$245.12',
      },
    ];

    this.tasks = [
      {
        date: 'just now',
        icon: 'fa-calendar',
        text: 'Calendar updated',
      },
      {
        date: '4 minutes ago',
        icon: 'fa-comment',
        text: 'Commented on a post',
      },
      {
        date: '23 minutes ago',
        icon: 'fa-truck',
        text: 'Order 392 shipped',
      },
      {
        date: '46 minutes ago',
        icon: 'fa-money',
        text: 'Invoice 653 has been paid',
      },
      {
        date: '1 hour ago',
        icon: 'fa-user',
        text: 'A new user has been added',
      },
      {
        date: '2 hours ago',
        icon: 'fa-check',
        text: 'Completed task: "pick up dry cleaning"',
      },
      {
        date: 'yesterday',
        icon: 'fa-globe',
        text: 'Saved the world',
      },
      {
        date: 'two days ago',
        icon: 'fa-check',
        text: 'Completed task: "fix error on sales page"',
      },
      {
        date: 'just now',
        icon: 'fa-calendar',
        text: 'Calendar updated',
      },
      {
        date: '4 minutes ago',
        icon: 'fa-comment',
        text: 'Commented on a post',
      },
      {
        date: '23 minutes ago',
        icon: 'fa-truck',
        text: 'Order 392 shipped',
      },
      {
        date: '46 minutes ago',
        icon: 'fa-money',
        text: 'Invoice 653 has been paid',
      },
      {
        date: '1 hour ago',
        icon: 'fa-user',
        text: 'A new user has been added',
      },
      {
        date: '2 hours ago',
        icon: 'fa-check',
        text: 'Completed task: "pick up dry cleaning"',
      },
      {
        date: 'yesterday',
        icon: 'fa-globe',
        text: 'Saved the world',
      },
      {
        date: 'two days ago',
        icon: 'fa-check',
        text: 'Completed task: "fix error on sales page"',
      },
    ];
  }

  static propTypes = {
    addSteps: PropTypes.func.isRequired,
  };

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
          outer: '#f07b50',
        },
      },
    });

    setTimeout(() => {
      this.props.addSteps({
        title: 'Add steps after it has started',
        text: 'This step was added 2 seconds later in a setTimeout call',
        selector: '.tasks',
        position: 'right',
      });
    }, 3000);
  }

  render() {
    return (
      <div className="row tables">
        <div className="col-12 col-md-6">
          <div className="card tasks">
            <div className="card-header">
              <h3>
                <i className="fa fa-clock-o fa-fw" /> Tasks Panel
              </h3>
            </div>
            <div className="card-block">
              <ul className="list-group">
                {this.tasks.map((d, i) => (
                  <li key={i} className="list-group-item" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <i className={`fa fa-fw ${d.icon}`} />{' '}
                      <span>{d.text}</span>
                    </div>
                    <span className="badge badge-pill badge-default">{d.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <div className="text-right">
                <a href="#view">
                  View All Activity <i className="fa fa-arrow-circle-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card transactions">
            <div className="card-header">
              <h3>
                <i className="fa fa-money fa-fw" /> Transactions Panel
              </h3>
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
                    {this.orders.map(d => (
                      <tr key={d.order}>
                        <td>{d.order}</td>
                        <td>{d.date}</td>
                        <td>{d.time}</td>
                        <td>{d.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer">
              <div className="text-right">
                <a href="#view">
                  View All Transactions <i className="fa fa-arrow-circle-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tables;
