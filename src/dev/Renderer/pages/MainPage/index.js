import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import Filter from "./Filter";

import Users from "./Filter/Users";
import { TextField, IconButton } from 'material-ui';

import CloseIcon from "material-ui-icons/Close";
import { Typography } from 'material-ui';

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
      username: "Fi1osof",
      id_contains: "iddd",
      // // username_contains: "test",
      // fullname_contains: "Ник",
      // id_in: [
      //   // "123",
      //   "435",
      // ],
      CreatedBy: {
        fullname_contains: "Nikol",
        id_not_in: [
          "123",
          // "435",
        ],
        ProjectsCreated_some: {
          name: "fffe",
          CreatedBy: {
            username: "Fi1osof",
            id_in: ["123", "435"],
          },
        },
      },

      // AND: [
      //   {
      //     CreatedBy: {
      //       username: "Fi1osof",
      //       id_in: [
      //         "123",
      //         "435",
      //       ],
      //     },
      //   },
      //   {
      //     CreatedBy: {
      //       username: "Fi1osof",
      //       id_in: [
      //         "123",
      //         "435",
      //       ],
      //     },
      //     id_in: [
      //       "435",
      //       "123",
      //     ],
      //   },
      // ],
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


  renderInputBlock(field, name, key, filters, setFilters, deleteItem, title) {

    // console.log("renderInputBlock key", key);

    const {
      Grid,
    } = this.context;

    // return <Grid
    //   key={key}
    //   container
    //   spacing={8}
    //   style={{
    //     border: "1px solid grey",
    //   }}
    // >

    return <Fragment
      key={key}
    >

      <Grid
        item
      >

        {title ?
          <Typography
            variant="subheading"
          >
            {title}
          </Typography>
          : null
        }

        {field}
      </Grid>

      <Grid
        item
      >
        <IconButton
          onClick={deleteItem ? deleteItem : event => {

            let newFilters = { ...filters };

            delete newFilters[name];

            setFilters(newFilters);

          }}
        // onClick={deleteItem}
        >
          <CloseIcon

          />
        </IconButton>
      </Grid>
    </Fragment>

    {/* </Grid> */ }
  }


  renderFilters(filters, setFilters, deleteItem, props) {

    const {
      Grid,
    } = this.context;

    if (!filters) {
      return null;
    }

    const {
      style,
      ...other
    } = props || {};

    let inputs = [];

    const names = Object.keys(filters);
    const values = Object.values(filters);


    names.map((name, index) => {

      const newName = name;

      // const value = filters[name];
      const value = values[index];

      let input;

      // console.log("input value", name, value);

      if (value && Array.isArray(value)) {

        let fields = [];

        value.map((n, index) => {

          const fieldName = `${name} (${index + 1})`;

          fields.push(this.renderFilters(
            {
              [fieldName]: n,
            },
            (newFilters) => {

              let values = [...value];

              values[index] = Object.values(newFilters)[0];


              const NewFilters = Object.assign({ ...filters }, {
                [name]: values,
              })

              setFilters(NewFilters);

            },
            event => {

              // let newFilters = { ...filters };

              // delete newFilters[name];

              // setFilters(newFilters);

              let values = [...value];

              values.splice(index, 1);


              let newFilters = { ...filters };

              newFilters[name] = values;

              setFilters(newFilters);

            },
            {
              key: fieldName,
            }
          ));

        });


        // input = <Grid
        //   key={index}
        //   container
        //   spacing={8}
        // >

        //   <Grid
        //     item
        //     style={{
        //       border: "1px solid grey",
        //     }}
        //   >
        //     <Typography
        //       variant="subheading"
        //     >
        //       {name}
        //     </Typography>

        //     {fields}

        //   </Grid>

        //   <Grid
        //     item
        //   >
        //     <IconButton
        //       onClick={deleteItem ? deleteItem : event => {

        //         let newFilters = { ...filters };

        //         delete newFilters[name];

        //         setFilters(newFilters);

        //       }}
        //     // onClick={deleteItem}
        //     >
        //       <CloseIcon

        //       />
        //     </IconButton>
        //   </Grid>

        // </Grid>

        input = this.renderInputBlock(fields, name, index, filters, setFilters, deleteItem, name);

      }
      else if (value && value instanceof Object) {

        const field = this.renderFilters(value, (newFilters) => {

          const NewFilters = Object.assign({ ...filters }, {
            [name]: newFilters,
          })

          setFilters(NewFilters);

        });

        // input = <Grid
        //   key={index}
        //   container
        //   spacing={8}
        // >

        //   <Grid
        //     item
        //     style={{
        //       border: "1px solid grey",
        //     }}
        //   >
        //     <Typography
        //       variant="subheading"
        //     >
        //       {name}
        //     </Typography>

        //     {field}
        //   </Grid>

        //   <Grid
        //     item
        //   >
        //     <IconButton
        //       onClick={deleteItem ? deleteItem : event => {

        //         let newFilters = { ...filters };

        //         delete newFilters[name];

        //         setFilters(newFilters);

        //       }}
        //     // onClick={deleteItem}
        //     >
        //       <CloseIcon

        //       />
        //     </IconButton>
        //   </Grid>

        // </Grid>

        input = <Grid
          key={index}
          item
        >
          <Grid
            container
            spacing={8}
            style={{
              border: "1px solid grey",
            }}
          >
            {this.renderInputBlock(field, name, index, filters, setFilters, deleteItem, name)}
          </Grid>
        </Grid>;

      }
      else {

        const field = <TextField
          name={name}
          label={name}
          value={value || ""}
          onChange={event => {

            const {
              name,
              value,
            } = event.target;

            setFilters(Object.assign({ ...filters }, {
              [name]: value,
            }));

          }}
        />


        // input = <Grid
        //   key={index}
        //   container
        //   spacing={8}
        // >

        //   <Grid
        //     item
        //   >
        //     {field}
        //   </Grid>

        //   <Grid
        //     item
        //   >
        //     <IconButton
        //       onClick={deleteItem ? deleteItem : event => {

        //         let newFilters = { ...filters };

        //         delete newFilters[name];

        //         setFilters(newFilters);

        //       }}
        //     // onClick={deleteItem}
        //     >
        //       <CloseIcon

        //       />
        //     </IconButton>
        //   </Grid>

        // </Grid>


        input = this.renderInputBlock(field, name, index, filters, setFilters, deleteItem);

      }


      if (input) {
        inputs.push(input);
      }

    });

    // return inputs;

    return <Grid
      container
      spacing={8}
      style={{
        overflow: "auto",
        ...style,
      }}
      {...other}
    >

      {inputs}

    </Grid>;

    // return <Grid
    //   container
    //   spacing={8}
    // >

    //   <Grid
    //     item
    //   >
    //     {inputs}
    //   </Grid>

    //   <Grid
    //     item
    //   >
    //     <IconButton
    //       onClick={event => {

    //       }}
    //     >
    //       <CloseIcon

    //       />
    //     </IconButton>
    //   </Grid>

    // </Grid>;
  }


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

        {/* <Filter
          types={types}
          filters={filters}
          onChange={this.onNameChange}
          // onValueChange={this.onValueChange}
          setFilters={this.setFilters}
          // queryName="users"
          // whereType="where"
          inputFields={inputFields}
        /> */}

        {this.renderFilters(filters, filters => {

          console.log("renderFilters 1 filters", filters);

          this.setState({
            filters,
          });
        })}

      </Grid>

      <Grid
        item
        xs={12}
      >

        <div
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {filters ? JSON.stringify(filters, null, 2) : null}
        </div>

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