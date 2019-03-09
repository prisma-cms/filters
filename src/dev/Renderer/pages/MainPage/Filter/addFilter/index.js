import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterItem from '../item';

class AddFilter extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
  };

  render() {

    const {
      fields,
      ...other
    } = this.props;
    return (
      <FilterItem
        fields={fields}
        item={{
          // [name]: value,
        }}
        {...other}
      />
    );
  }
}


export default AddFilter;