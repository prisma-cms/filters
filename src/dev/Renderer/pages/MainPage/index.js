import React, { Component } from 'react';

import Context from "@prisma-cms/context";

import Users from "./Users";
import App from '../../../../App';

class MainPage extends Component {

  static contextType = Context;

  state = {
    filters: {
    },
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
          queryName="users"
          filters={filters}
          setFilters={filters => this.setFilters(filters)}
        />

      </Grid>


      <Grid
        item
        xs={12}
      >
        <Users
          where={filters}
        />
      </Grid>

    </Grid>

  }
}


export default MainPage;
