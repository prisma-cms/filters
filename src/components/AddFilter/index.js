import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

import FilterList from 'material-ui-icons/FilterList';

class AddFilter extends Component {

  static propTypes = {
    inputFields: PropTypes.array.isRequired,
  };


  state = {
    opened: false,
  }

  render() {

    const {
      inputFields,
      onChange,
      ...other
    } = this.props;

    const {
      opened,
    } = this.state;

    let content = null;

    if (opened) {

      content = <select
        {...other}
        onChange={event => {
          onChange(event);
          this.setState({
            opened: false,
          });
        }}
      >
        <option
          value=""
        >

        </option>

        {inputFields.map(n => {
          const {
            name,
          } = n;

          return <option
            key={name}
            value={name}
          >
            {name}
          </option>
        })}
      </select>

    }
    else {

      content = <IconButton
        onClick={event => {
          this.setState({
            opened: true,
          });
        }}
      >
        <FilterList />
      </IconButton>
    }

    return content;
  }
}


export default AddFilter;