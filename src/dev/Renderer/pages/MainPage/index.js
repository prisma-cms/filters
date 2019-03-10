import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

// import Filter from "./Filter";

import Users from "./Users";
import { TextField, IconButton } from 'material-ui';

import CloseIcon from "material-ui-icons/Close";
import { Typography } from 'material-ui';
import AddFilter from './AddFilter';
import App from '../../../../App';

class MainPage extends Component {

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


  /**
   * Устанавливаем новые фильтры
   */
  setFilters(filters) {

    this.setState({
      filters,
    });

  }




  // getType(type, isList = false, isNonNull = false) {

  //   const {
  //     kind,
  //     ofType,
  //   } = type;


  //   switch (kind) {

  //     case "LIST":

  //       return this.getType(ofType, true, isNonNull);

  //       break;

  //     case "NON_NULL":

  //       return this.getType(ofType, isList, true);

  //       break;
  //   }

  //   return {
  //     Type: type,
  //     isList,
  //     isNonNull,
  //   };
  // }



  // getInputFields(name) {

  //   const {
  //     schema: {
  //       types,
  //     },
  //   } = this.context;

  //   const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === name);

  //   const {
  //     inputFields,
  //   } = WhereInputType;

  //   return inputFields;
  // }

  render() {

    const {
      filters,
    } = this.state;


    const {
      // schema,
      Grid,
    } = this.context;

    // const {
    //   queryName,
    //   whereType,
    // } = this.props;


    // if (!schema) {

    //   return null;
    // }


    // const {
    //   queryType,
    //   types,
    // } = schema;

    // const QueryType = types.find(n => n.kind === "OBJECT" && n.name === queryType.name);


    // const {
    //   fields,
    // } = QueryType;

    // const queryField = fields.find(n => n.name === queryName);


    // if (!queryField) {
    //   return null;
    // }

    // const {
    //   args,
    // } = queryField;


    // if (!args) {
    //   return null;
    // }

    // const whereArg = args.find(n => n.name === "where");


    // if (!whereArg) {
    //   return null;
    // }

    // const {
    //   type: {
    //     name: whereInputTypeName,
    //   },
    // } = whereArg;



    // if (!whereInputTypeName) {
    //   return null;
    // }


    // const inputFields = this.getInputFields(whereInputTypeName);




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