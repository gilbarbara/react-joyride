import React from 'react';

class Cards extends React.Component {
  static propTypes = {
    addSteps: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.addSteps([
      {
        title: 'Trigger Action',
        text: 'It can be `click` (default) or `hover` (reverts to click on touch devices',
        selector: '.card-comments',
        position: 'top',
        type: 'hover'
      },
      {
        title: 'Advance customization',
        text: 'You can set individual styling options for beacons and tooltips',
        selector: '.card-tickets',
        position: 'bottom-right',
        style: {
          backgroundColor: '#ccc',
          mainColor: '#000',
          beacon: {
            inner: '#000',
            outer: '#000'
          },
          skip: {
            color: '#FF67B4'
          }
        }
      }
    ]);
  }

  render() {
    return (
      <div className="row cards">
        <div className="col-xs-12 col-sm-6 col-lg-3">
          <div className="card card-dark card-comments">
            <div className="card-block">
              <div className="row">
                <div className="col-xs-4">
                  <i className="fa fa-comments fa-3x" />
                </div>
                <div className="col-xs-8 text-xs-right">

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
                <div className="col-xs-4">
                  <i className="fa fa-tasks fa-3x" />
                </div>
                <div className="col-xs-8 text-xs-right">
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
                <div className="col-xs-4">
                  <i className="fa fa-shopping-cart fa-3x" />
                </div>
                <div className="col-xs-8 text-xs-right">
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
                <div className="col-xs-4">
                  <i className="fa fa-support fa-3x" />
                </div>
                <div className="col-xs-8 text-xs-right">
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
