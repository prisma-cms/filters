import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import Filter from "./Filter";

import Users from "./Filter/Users";

class MainPage extends Component {

  static contextType = Context;


  static propTypes = {
    queryName: PropTypes.string.isRequired,
    whereType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    queryName: "users",
    whereType: "where",
  };

  state = {
    filters: {
      // username: "Fi1osof",
      username_contains: "test",
      // fullname_contains: "Ник",
      CreatedBy: {
        fullname_contains: "Nikol",
      },
      // CreatedBy: {
      //   username: "Fi1osof",
      // },
      // ProjectsCreated_some: {
      //   CreatedBy: {
      //     username: "Fi1osof",
      //   },
      // },
    },
  }


  /**
   * Устанавливаем новые фильтры
   */
  setFilters = (filters) => {

    this.setState({
      filters,
    });
  }


  /**
   * Меняется имя элемента
   */
  onNameChange = (name, value, index) => {

    // console.log("onChange filter", name, value);

    const {
      filters,
    } = this.state;

    const names = Object.keys(filters);

    /**
    При изменении меняется и положение активного элемента.
    Надо предыдущий элемент удалить, а вместо него поставить другой объект
     */

    let newFilters = { ...filters }

    if (index !== undefined) {
      delete newFilters[names[index]];
    }


    if (value !== undefined) {
      newFilters[name] = value;
    }


    this.setFilters(newFilters);

  }


  /**
   * Меняется значение элемента
   */
  onValueChange = (filters, item) => {

    console.log("onValueChange onChange filters", filters);
    console.log("onValueChange onChange item", item);

    return;

    // const {
    //   filters,
    // } = this.state;

    // AND = [...AND]




    // AND[index] = item;

    // this.setState({
    //   filters: {
    //     AND,
    //   },
    // });

    let newFilters = { ...filters }

    // newFilters[name]

    Object.assign(newFilters, { ...item });

    this.setState({
      filters: newFilters,
    });

  }

  // onValueChange = (item) => {

  //   // console.log("onValueChange item", item);

  //   const {
  //     filters,
  //   } = this.state;

  //   // AND = [...AND]




  //   // AND[index] = item;

  //   // this.setState({
  //   //   filters: {
  //   //     AND,
  //   //   },
  //   // });

  //   let newFilters = { ...filters }

  //   // newFilters[name]

  //   Object.assign(newFilters, { ...item });

  //   this.setState({
  //     filters: newFilters,
  //   });

  // }


  render() {

    const {
      filters,
    } = this.state;


    const {
      schema,
      Grid,
    } = this.context;

    const {
      queryName,
      whereType,
    } = this.props;

    // // console.log("schema", schema);

    if (!schema) {

      return null;
    }


    // let queryName = "users";
    // let whereType = "where";
    // let orderType = "orderBy";


    const {
      queryType,
      types,
    } = schema;

    const QueryType = types.find(n => n.kind === "OBJECT" && n.name === queryType.name);

    // // console.log("Query", QueryType);

    const {
      fields,
    } = QueryType;

    const queryField = fields.find(n => n.name === queryName);

    // // console.log("Query queryField", queryField);

    if (!queryField) {
      return null;
    }

    const {
      args,
    } = queryField;

    // // console.log("Query queryField args", args);

    if (!args) {
      return null;
    }

    const whereArg = args.find(n => n.name === whereType);

    // // console.log("Query queryField whereArg", whereArg);

    if (!whereArg) {
      return null;
    }

    const {
      type: {
        name: whereInputTypeName,
      },
    } = whereArg;


    // // console.log("Query queryField whereInputTypeName", whereInputTypeName);

    if (!whereInputTypeName) {
      return null;
    }

    const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === whereInputTypeName);

    // // console.log("Query queryField WhereInputType", WhereInputType);

    const {
      inputFields,
    } = WhereInputType;

    // // console.log("Query queryField WhereInputType inputFields", inputFields);

    if (!inputFields) {
      return null;
    }

    return <Grid
      container
      spacing={16}
    >
      <Grid
        item
        xs={12}
      >

        <Filter
          types={types}
          filters={filters}
          onChange={this.onNameChange}
          // onValueChange={this.onValueChange}
          setFilters={this.setFilters}
          // queryName="users"
          // whereType="where"
          inputFields={inputFields}
        />

      </Grid>

      <Grid
        item
        xs={12}
      >

        {filters ? JSON.stringify(filters, true) : null}

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

    </Grid>

  }
}


export default MainPage;