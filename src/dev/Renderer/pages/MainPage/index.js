import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import Filter from "./Filter";

import Users from "./Filter/Users";
import { TextField, IconButton } from 'material-ui';

import CloseIcon from "material-ui-icons/Close";
import { Typography } from 'material-ui';
import AddFilter from './AddFilter';

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



  renderInputBlock(field, name, key, filters, setFilters, deleteItem, title) {


    const {
      Grid,
    } = this.context;


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
        >
          <CloseIcon

          />
        </IconButton>
      </Grid>
    </Fragment>

  }


  getType(type, isList = false, isNonNull = false) {

    const {
      kind,
      ofType,
    } = type;


    switch (kind) {

      case "LIST":

        return this.getType(ofType, true, isNonNull);

        break;

      case "NON_NULL":

        return this.getType(ofType, isList, true);

        break;
    }

    return {
      Type: type,
      isList,
      isNonNull,
    };
  }


  renderFilters(filters, setFilters, deleteItem, props, __inputFields, inputFields) {


    // console.log("Query queryField", queryField);

    // if (!queryField) {
    //   return null;
    // }

    // const {
    //   args,
    // } = queryField;

    // // // console.log("Query queryField args", args);

    // if (!args) {
    //   return null;
    // }

    // // const whereArg = args.find(n => n.name === whereType);
    // const whereArg = args.find(n => n.name === "where");

    // // // console.log("Query queryField whereArg", whereArg);

    // if (!whereArg) {
    //   return null;
    // }

    // const {
    //   type: {
    //     name: whereInputTypeName,
    //   },
    // } = whereArg;


    // // console.log("Query queryField whereInputTypeName", whereInputTypeName);

    // if (!whereInputTypeName) {
    //   return null;
    // }

    // // const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === whereInputTypeName);

    // // // // console.log("Query queryField WhereInputType", WhereInputType);

    // // const {
    // //   inputFields,
    // // } = WhereInputType;

    // const inputFields = this.getInputFields(whereInputTypeName);

    // // // console.log("Query queryField WhereInputType inputFields", inputFields);

    if (!inputFields) {
      return null;
    }



    console.log("renderFilters filters", filters);
    console.log("renderFilters inputFields", inputFields);

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



        input = this.renderInputBlock(fields, name, index, filters, setFilters, deleteItem, name);

      }
      else if (value && value instanceof Object) {

        console.log("instanceof Object name", name);

        // const inputFields = this.getInputFields(whereInputTypeName);

        console.log("instanceof Object inputFields", inputFields);

        const inputType = inputFields.find(n => n.name === name);

        console.log("instanceof Object Type", inputType);


        const {
          type: {
            name: whereTypeName,
          },
        } = inputType;


        console.log("instanceof Object Type whereTypeName", whereTypeName);

        const fieldInputFields = this.getInputFields(whereTypeName);

        console.log("instanceof Object Type fieldInputFields", fieldInputFields);

        const field = this.renderFilters(
          value,
          (newFilters) => {

            const NewFilters = Object.assign({ ...filters }, {
              [name]: newFilters,
            })

            setFilters(NewFilters);

          },
          null,
          null,
          null,
          // inputType,
          fieldInputFields,
        );

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


        input = this.renderInputBlock(field, name, index, filters, setFilters, deleteItem);

      }


      if (input) {
        inputs.push(input);
      }

    });

    // return inputs;

    let addFilter;

    if (inputFields) {

      addFilter = <AddFilter
        inputFields={inputFields}
        onChange={event => {

          const {
            // name,
            value,
          } = event.target;

          const inputField = inputFields.find(n => n.name === value);

          const {
            name,
            type,
          } = inputField;

          let {
            Type,
            isList,
            isNonNull,
          } = this.getType(type);

          const {
            kind,
          } = Type;

          console.log("addFilter item", value, inputField, Type, isList, isNonNull);

          let newFilters = { ...filters }

          let newValue;


          switch (kind) {

            case "INPUT_OBJECT":

              newValue = {}

              break;

            default:
              newValue = isList ? undefined : isNonNull ? "" : null;
          }


          if (isList) {
            newValue = newValue !== undefined ? [newValue] : []
          }

          newFilters[name] = newValue;

          setFilters(newFilters);

        }}
      />

      // addFilter = <select
      //   onChange={event => {

      //     const {
      //       // name,
      //       value,
      //     } = event.target;

      //     const inputField = inputFields.find(n => n.name === value);

      //     const {
      //       name,
      //       type,
      //     } = inputField;

      //     let {
      //       Type,
      //       isList,
      //       isNonNull,
      //     } = this.getType(type);

      //     const {
      //       kind,
      //     } = Type;

      //     console.log("addFilter item", value, inputField, Type, isList, isNonNull);

      //     let newFilters = { ...filters }

      //     let newValue;


      //     switch (kind) {

      //       case "INPUT_OBJECT":

      //         newValue = {}

      //         break;

      //       default:
      //         newValue = isList ? undefined : isNonNull ? "" : null;
      //     }


      //     if (isList) {
      //       newValue = newValue !== undefined ? [newValue] : []
      //     }

      //     newFilters[name] = newValue;

      //     setFilters(newFilters);

      //   }}
      // >
      //   {inputFields.map(n => {

      //     const {
      //       name,
      //       type,
      //     } = n;


      //     return <option
      //       key={name}
      //       value={name}
      //     >
      //       {name}
      //     </option>
      //   })}
      // </select>

    }

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

      <Grid
        item
      >
        {addFilter}
      </Grid>

    </Grid>;

  }


  getInputFields(name) {

    const {
      schema: {
        types,
      },
    } = this.context;



    const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === name);

    // // console.log("Query queryField WhereInputType", WhereInputType);

    const {
      inputFields,
    } = WhereInputType;

    return inputFields;
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

    console.log("schema", schema);

    if (!schema) {

      return null;
    }


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


    console.log("Query queryField", queryField);

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

    // const whereArg = args.find(n => n.name === whereType);
    const whereArg = args.find(n => n.name === "where");

    // // console.log("Query queryField whereArg", whereArg);

    if (!whereArg) {
      return null;
    }

    const {
      type: {
        name: whereInputTypeName,
      },
    } = whereArg;


    // console.log("Query queryField whereInputTypeName", whereInputTypeName);

    if (!whereInputTypeName) {
      return null;
    }

    // const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === whereInputTypeName);

    // // // console.log("Query queryField WhereInputType", WhereInputType);

    // const {
    //   inputFields,
    // } = WhereInputType;

    const inputFields = this.getInputFields(whereInputTypeName);

    // // console.log("Query queryField WhereInputType inputFields", inputFields);

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

        {this.renderFilters(
          filters,
          filters => {

            // console.log("renderFilters 1 filters", filters);

            this.setState({
              filters,
            });
          },
          null,
          null,

          // inputFields,
          null,

          inputFields,

          // queryField,
        )}

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