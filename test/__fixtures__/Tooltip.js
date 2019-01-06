import React from 'react';
import PropTypes from 'prop-types';

export default class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.tooltip = React.createRef();
  }

  static propTypes = {
    Scope: PropTypes.func.isRequired,
    setScope: PropTypes.func.isRequired,
    tabbable: PropTypes.bool,
    useSelector: PropTypes.bool,
  };

  static defaultProps = {
    tabbable: true,
    useSelector: false,
  };

  componentDidMount() {
    const { setScope, Scope, useSelector } = this.props;

    this.scope = new Scope(this.tooltip.current, {
      selector: useSelector ? '.primary' : undefined,
    });
    setScope(this.scope);
  }

  componentWillUnmount() {
    this.scope.removeScope();
  }

  renderTabbable() {
    return (
      <React.Fragment>
        <footer>
          <button type="button" className="skip">
            SKIP
          </button>
          <button type="button" className="back">
            BACK
          </button>
          <button type="button" className="primary">
            GO
          </button>
        </footer>
        <a href="#close" className="close">
          X
        </a>
        <a name="end" />
      </React.Fragment>
    );
  }

  render() {
    const { tabbable } = this.props;

    return (
      <div className="tooltip" ref={this.tooltip}>
        <h2>Title</h2>
        <p>My awesome content</p>
        {tabbable && this.renderTabbable()}
      </div>
    );
  }
}
