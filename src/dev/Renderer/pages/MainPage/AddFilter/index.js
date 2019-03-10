import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from 'material-ui';

import AddIcon from "material-ui-icons/AddCircleOutline";
import { FilterList } from 'material-ui-icons';

class AddFilter extends Component {


  static propTypes = {
    inputFields: PropTypes.array.isRequired,
    // opened: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    // opened: false,
  }


  state = {
    opened: false,
  }

  render() {

    const {
      inputFields,
      // opened,
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
            type,
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

      // content = <Button
      //   size="small"
      //   onClick={event => {
      //     this.setState({
      //       opened: true,
      //     });
      //   }}
      // >
      //   <AddIcon

      //   /> Add filter
      // </Button>

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