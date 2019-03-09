import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';

class InputsArray extends Component {

  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {

    const {
      value,
      onChange,
      ...other
    } = this.props;

    let inputs = [];

    value && Array.isArray(value) && value.map((n, index) => {

      inputs.push(<div
        key={index}
      >
        <TextField
          value={n}
          onChange={event => {
            onChange(event, index);
          }}
          {...other}
        />
      </div>);

    });

    return (
      inputs
    );
  }
}


export default InputsArray;