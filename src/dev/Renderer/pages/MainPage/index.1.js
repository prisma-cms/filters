import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

// import Filter from "./Filter";

import Users from "./Users";
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



    if (!inputFields) {
      return null;
    }



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

      const value = values[index];

      let input;


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


        const inputType = inputFields.find(n => n.name === name);



        const {
          type: {
            name: whereTypeName,
          },
        } = inputType;


        const fieldInputFields = this.getInputFields(whereTypeName);


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


    if (!schema) {

      return null;
    }


    const {
      queryType,
      types,
    } = schema;

    const QueryType = types.find(n => n.kind === "OBJECT" && n.name === queryType.name);


    const {
      fields,
    } = QueryType;

    const queryField = fields.find(n => n.name === queryName);


    if (!queryField) {
      return null;
    }

    const {
      args,
    } = queryField;


    if (!args) {
      return null;
    }

    const whereArg = args.find(n => n.name === "where");


    if (!whereArg) {
      return null;
    }

    const {
      type: {
        name: whereInputTypeName,
      },
    } = whereArg;



    if (!whereInputTypeName) {
      return null;
    }


    const inputFields = this.getInputFields(whereInputTypeName);


    let filtersJson;

    if (filters && Object.keys(filters).length) {

      filtersJson = JSON.stringify(filters, null, 2);
    }


    return <Grid
      container
      spacing={16}
    >
      <Grid
        item
        xs={12}
      >


        {this.renderFilters(
          filters,
          filters => {


            this.setState({
              filters,
            });
          },
          null,
          null,

          null,

          inputFields,

        )}

      </Grid>

      {filtersJson ?
        <Grid
          item
          xs={12}
        >

          <div
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {filtersJson}
          </div>

        </Grid>
        : null
      }

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