import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";


import App from '../../../../App';
import User from "./User";

class UserPage extends Component {

  static contextType = Context;

  static propTypes = {
    // queryName: PropTypes.string.isRequired,
    // whereType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    // queryName: "users",
    // whereType: "where",
  };

  state = {
    filters: {
    },
  }

  
  componentWillMount() {

    const {
      userId,
    } = this.props;

    if (userId) {
      Object.assign(this.state.filters, {
        id: userId,
      });
    }

    super.componentWillMount && super.componentWillMount();
  }

  /**
   * Устанавливаем новые фильтры
   */
  setFilters(filters) {

    this.setState({
      filters,
    });

  }

  render() {

    const {
      filters,
    } = this.state;


    const {
      // schema,
      Grid,
    } = this.context;


    return <Grid
      container
      spacing={16}
    >
      <Grid
        item
        xs={12}
      >

        <App
          queryName="user"
          filters={filters}
          setFilters={filters => this.setFilters(filters)}
        />

      </Grid>


      <Grid
        item
        xs={12}
      >
        <User
          where={filters}
        />
      </Grid>

    </Grid>

  }
}


export default UserPage;