import React from 'react';

class Cards extends React.Component {
  static propTypes = {
    addSteps: React.PropTypes.func.isRequired,
    next: React.PropTypes.func.isRequired,
    selector: React.PropTypes.string.isRequired,
  }

  componentDidMount() {
    const steps = [
      {
        title: 'Trigger Action',
        text: 'It can be `click` (default) or `hover` <i>(reverts to click on touch devices</i>.',
        selector: '.card-comments',
        position: 'top',
        type: 'hover',
      },
      {
        title: 'Advance customization',
        text: 'You can set individual styling options for beacons and tooltips. <br/>To advance click `NEXT` inside the hole.',
        selector: '.card-tickets',
        position: 'bottom',
        allowClicksThruHole: true,
        style: {
          backgroundColor: '#ccc',
          mainColor: '#000',
          header: {
            color: '#f04',
            fontSize: '3rem',
            textAlign: 'center',
          },
          footer: {
            display: 'none',
          },
          beacon: {
            inner: '#000',
            outer: '#000',
          },
        },
      },
    ];

    if (location.hostname === 'localhost') {
      steps.push(
        {
          title: 'Tasks',
          text: 'Hey look! Tasks!',
          selector: '.card-tasks',
          position: 'right',
        },
        {
          title: 'Orders',
          text: 'Mo\' Money',
          selector: '.card-orders',
          position: 'left',
        }
      );
    }

    this.props.addSteps(steps);
  }

  handleClick = (e) => {
    e.preventDefault();
    const { next } = this.props;

    next();
  }

  render() {
    const { selector } = this.props;
    let commentLink = (
      <span className="pull-right">
        <i className="fa fa-arrow-circle-right" />
      </span>
    );

    if (selector === '.card-tickets') {
      commentLink = (
        <a href="#next" className="is-link pull-right" onClick={this.handleClick}>
          <i className="fa fa-arrow-circle-right" />
          <span>NEXT</span>
        </a>
      );
    }

    return (
      <div className="row cards">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-dark card-comments">
            <div className="card-block">
              <div className="row">
                <div className="col-4">
                  <i className="fa fa-comments fa-3x" />
                </div>
                <div className="col-8 text-right">

                  <div className="huge">26</div>
                  <div>New Comments!</div>
                </div>
              </div>
            </div>

            <div className="card-footer clearfix">
              <a href="#details">
                <span className="pull-left">View Details</span>
                <span className="pull-right">
                  <i className="fa fa-arrow-circle-right" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-dark card-tasks">
            <div className="card-block">
              <div className="row">
                <div className="col-4">
                  <i className="fa fa-tasks fa-3x" />
                </div>
                <div className="col-8 text-right">
                  <div className="huge">12</div>
                  <div>New Tasks!</div>
                </div>
              </div>
            </div>

            <div className="card-footer clearfix">
              <a href="#details">
                <span className="pull-left">View Details</span>
                <span className="pull-right">
                  <i className="fa fa-arrow-circle-right" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-dark card-orders">
            <div className="card-block">
              <div className="row">
                <div className="col-4">
                  <i className="fa fa-shopping-cart fa-3x" />
                </div>
                <div className="col-8 text-right">
                  <div className="huge">124</div>
                  <div>New Orders!</div>
                </div>
              </div>
            </div>

            <div className="card-footer clearfix">
              <a href="#details">
                <span className="pull-left">View Details</span>
                <span className="pull-right">
                  <i className="fa fa-arrow-circle-right" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-dark card-tickets">
            <div className="card-block">
              <div className="row">
                <div className="col-4">
                  <i className="fa fa-support fa-3x" />
                </div>
                <div className="col-8 text-right">
                  <div className="huge">13</div>
                  <div>Support Tickets!</div>
                </div>
              </div>
            </div>

            <div className="card-footer clearfix">
              <a href="#details" className="pull-left">
                View Details
              </a>
              {commentLink}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cards;
