import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";

import {
  Query,
} from "react-apollo";

import Filters from "../../../../App";
import gql from 'graphql-tag';
import { TextField } from 'material-ui';

import FilterItem from "./item";
import Users from "./Users";

class MainPage extends PrismaCmsComponent {

  // static contextType = Context;

  // static propTypes = {
  //   // type: PropTypes.string.isRequired,
  // };

  // static defaultProps = {
  //   // type: "User",
  // };


  state = {
    ...super.state,
    filters: {
      AND: [
        {
          id_in: [
            "cjp2dj1d701vq0960ikvuumbz",
            "cjt0j077700vo09602jmy6ntd",
          ],
        },
        {
          username: "Fi1osof",
        }
        // {},
      ],
    },
  }

  // constructor(props){

  //   super(props);

  //   this.state = {

  //   }
  // }


  render() {

    const {
      schema,
      Grid,
      // query: {
      //   users,
      // },
    } = this.context;

    const {
      filters,
      // filter,
      _dirty,
    } = this.state;

    console.log("schema", schema);

    if (!schema) {

      return null;
    }


    let queryName = "users";
    let whereType = "where";
    let orderType = "orderBy";


    const {
      queryType,
      types,
    } = schema;

    const QueryType = types.find(n => n.kind === "OBJECT" && n.name === queryType.name);

    console.log("Query", QueryType);

    const {
      fields,
    } = QueryType;

    const queryField = fields.find(n => n.name === queryName);

    console.log("Query queryField", queryField);

    if (!queryField) {
      return null;
    }

    const {
      args,
    } = queryField;

    console.log("Query queryField args", args);

    if (!args) {
      return null;
    }

    const whereArg = args.find(n => n.name === whereType);

    console.log("Query queryField whereArg", whereArg);

    if (!whereArg) {
      return null;
    }

    const {
      type: {
        name: whereInputTypeName,
      },
    } = whereArg;


    console.log("Query queryField whereInputTypeName", whereInputTypeName);

    if (!whereInputTypeName) {
      return null;
    }

    const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === whereInputTypeName);

    console.log("Query queryField WhereInputType", WhereInputType);

    const {
      inputFields,
    } = WhereInputType;

    console.log("Query queryField WhereInputType inputFields", inputFields);

    if (!inputFields) {
      return null;
    }

    let inputs = []

    // inputFields.map(n => {

    //   const {
    //     name,
    //     type,
    //   } = n;

    //   inputs.push(<option
    //     key={name}
    //     value={name}
    //   >
    //     {name}
    //   </option>);

    // });

    let {
      AND,
    } = filters;

    let filtersView = AND.map((n, index) => {

      return <Grid
        key={index}
        item
      >

        <FilterItem
          fields={inputFields}
          item={n}
          // onChange={event => {

          //   const {
          //     value,
          //   } = event.target;

          //   console.log("onChange filter", event.target);

          //   // Object.assign(n, {
          //   //   [value]: null,
          //   // });

          //   // this.forceUpdate();

          //   AND = [...AND]


          //   if (value) {
          //     AND[index] = {
          //       [value]: null,
          //     }
          //   }
          //   else {
          //     AND[index] = {}
          //   }


          //   this.setState({
          //     filters: {
          //       AND,
          //     },
          //   });

          // }}
          onChange={(name, value) => {

            console.log("onChange filter", name, value);

            // Object.assign(n, {
            //   [value]: null,
            // });

            // this.forceUpdate();

            AND = [...AND]


            if (name && value !== undefined) {
              AND[index] = {
                [name]: value,
              }
            }
            else {
              AND[index] = {}
            }


            this.setState({
              filters: {
                AND,
              },
            });

          }}
          onValueChange={(item) => {


            AND = [...AND]


            console.log("onValueChange item", item);


            AND[index] = item;

            this.setState({
              filters: {
                AND,
              },
            });

          }}
        />

      </Grid>
    })


    return super.render(<Grid
      container
      spacing={8}
    >
      <Grid
        item
        xs={12}
      >

        <Grid
          container
          spacing={8}
        >

          {filtersView}


        </Grid>

      </Grid>
      <Grid
        item
        xs={12}
      >
        <Users
          // where={{
          //   AND: [
          //     filters.AND[0],
          //   ]
          // }}
          where={filters}
        />
      </Grid>
      <Grid
        item
        xs={12}
      >
        {/* {_dirty ? JSON.stringify(_dirty, true) : null} */}
        {filters ? JSON.stringify(filters, true) : null}
      </Grid>
    </Grid>);

    // return (
    //   schema ? <Filters /> : "DSfsdf"
    // );
  }
}


export default MainPage;