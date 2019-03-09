import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";

// import {
//   Query,
// } from "react-apollo";

// import Filters from "../../../../App";
// import gql from 'graphql-tag';
// import { TextField } from 'material-ui';

// import FilterItem from "./item";
import Users from "./Users";
import AddFilter from "./addFilter";
import { TextField, MenuItem } from 'material-ui';
import InputsArray from './item/array';
import { Select } from 'material-ui';
import { FormControl } from 'material-ui';


class FilterItem extends PrismaCmsComponent {

  // static contextType = Context;

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    onChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    // type: PropTypes.string.isRequired,
  };

  // static defaultProps = {
  //   // type: "User",
  // };


  state = {
    ...super.state,
    filter: null,
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


  render() {

    const {
      schema,
      Grid,
      query: {
        users,
      },
      UserAutocomplete,
    } = this.context;

    const {
      filter,
      _dirty,
    } = this.state;

    const {
      onChange,
      onValueChange,
      item,
      fields: inputFields,
      types,
    } = this.props;

    // console.log("schema", schema);


    let name = Object.keys(item)[0];
    let value = Object.values(item)[0];


    let filters = null;


    if (!inputFields) {
      return null;
    }

    let inputs = []

    inputFields.map(n => {

      const {
        name,
        type,
      } = n;

      let label = name;

      // const parts = name.split("_");


      // switch (parts[0]) {

      //   case "username":

      //     parts[0] = "Имя пользователя";

      //     break;
      // }


      // label = parts.join("_");

      inputs.push(<MenuItem
        key={name}
        value={name}
      >
        {label}
      </MenuItem>);

    });

    filters = <FormControl
      style={{
        minWidth: 120,
      }}
    >
      <Select
        value={name || ""}
        // defaultValue={""}
        onChange={event => {

          let {
            value,
          } = event.target;

          let initialValue = null;

          // this.setState({
          //   filter: value,
          // });

          if (value) {

            // if (value.endsWith("not_contains")) {
            //   initialValue = undefined;
            // }

            // else 

            if (value.endsWith("_contains")) {
              initialValue = "";
            }

            else if (value.endsWith("_in")) {
              initialValue = [];
            }

            else if (value.endsWith("_some")) {
              initialValue = {};
            }

          }

          onChange(value, value === "" ? undefined : initialValue);

        }}
      >
        <MenuItem
          value={""}
        >
          ---
      </MenuItem>
        {inputs}
      </Select>
    </FormControl>

    /**
     * Это поле для ввода при выбранном типе фильтра
     */
    let input;


    if (name) {

      const inputField = inputFields.find(n => n.name === name);

      // console.log("inputField", inputField);

      if (inputField) {

        const {
          name,
          defaultValue,
          description,
          type,
        } = inputField;



        let {
          Type,
          isList,
          isNonNull,
        } = this.getType(type);

        // console.log("getType Type", Type, isList, isNonNull);

        const {
          name: typeName,
          kind,
          ofType,
          // description,
        } = Type;


        switch (kind) {

          case "SCALAR":

            // input = <TextField
            //   name={name}
            // />

            input = this.renderField(<TextField
              key={name}
              name={name}
              value={value || ""}
              helperText={description}
              onChange={event => {

                const {
                  name,
                  value,
                } = event.target;

                onValueChange({
                  [name]: value,
                });

              }}
            />);

            break;

          case "INPUT_OBJECT":
            {

              // console.log("INPUT_OBJECT types", types);

              const WhereInputType = types.find(n => n.kind === "INPUT_OBJECT" && n.name === typeName);

              // console.log("INPUT_OBJECT WhereInputType", WhereInputType);
              // // console.log("INPUT_OBJECT inputField", inputField);

              const {
                inputFields
              } = WhereInputType;

              // console.log("INPUT_OBJECT inputFields", inputFields);

              // switch(name) {

              //   case ""
              // }

              input = Filter ? <Filter
                types={types}
                filters={value}
                // filters={{}}
                // onChange={this.onChange}
                onChange={(name, value, index) => {

                  // console.log("FilterItem onChange", name, value, index);

                  const {
                    onChange,
                  } = this.props;

                  // onChange(name, value, index);
                  // onChange("id", "", 0);

                  onValueChange({
                    "id": "sdfds",
                  });

                }}
                setFilters={(name, value, index) => {

                  console.log("FilterItem setFilters", filters, name, value, index);

                  // const {
                  //   onChange,
                  // } = this.props;

                  // // onChange(name, value, index);
                  // // onChange("id", "", 0);

                  // onValueChange({
                  //   "id": "sdfds",
                  // });

                }}
                // onValueChange={this.onValueChange}
                inputFields={inputFields}
              // test={true}
              /> : "Filter"

              // input = "Sdfdsf"

            }

            break;
        }


        // if (isList) {
        //   input = [input]
        // }

        if (Array.isArray(value)) {

          // let inputArray = [];

          // value.map((n, index) => {
          //   inputArray.push(input);
          // });

          input = <InputsArray
            value={value.length ? value : [""]}
            onChange={(event, index) => {

              // console.log("InputsArray onChange value", [...value]);

              // console.log("InputsArray onChange event", index, event, { ...event.target });

              const {
                // name,
                value: itemValue,
              } = event.target;

              let newValue = [...value];

              let item = newValue[index];

              if (item === undefined) {
                item = "";
                index = newValue.push(item) - 1;

                // console.log("InputsArray onChange new index", index);

              }

              newValue[index] = itemValue;

              // console.log("InputsArray onChange newValue", newValue);

              onValueChange({
                [name]: newValue,
              });

            }}
          />

        }

      }

    }


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

          <Grid
            item
          >

            {filters}

          </Grid>

          <Grid
            item
          >
            {input}
          </Grid>

        </Grid>

      </Grid>
    </Grid>);

  }
}


class Filter extends PrismaCmsComponent {

  // static contextType = Context;

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    types: PropTypes.array.isRequired,
    inputFields: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    // onValueChange: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ...PrismaCmsComponent.defaultProps,
  };


  state = {
    ...super.state,
    // filters: {
    //   // username_contains: "test",
    //   // fullname_contains: undefined,
    // },
    // filters: {
    //   AND: [
    //     {
    //       id_in: [
    //         "cjp2dj1d701vq0960ikvuumbz",
    //         "cjt0j077700vo09602jmy6ntd",
    //       ],
    //     },
    //     {
    //       username: "Fi1osof",
    //     }
    //     // {},
    //   ],
    // },
  }

  // constructor(props){

  //   super(props);

  //   this.state = {

  //   }
  // }


  onChange = (name, value, index) => {

    const {
      onChange,
    } = this.props;

    return onChange(name, value, index);

  }


  onValueChange = (item) => {

    const {
      onValueChange,
    } = this.props;

    return onValueChange(item);

  }


  render() {

    const {
      // schema,
      Grid,
      // query: {
      //   users,
      // },
    } = this.context;

    const {
      // filters,
      // filter,
      // _dirty,
    } = this.state;

    const {
      filters: propsFilters,
      // queryName,
      // whereType,
      inputFields,
      setFilters,
      types,
    } = this.props;


    let filters = { ...propsFilters }

    // let inputs = []

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


    const names = filters ? Object.keys(filters) : [];
    const values = filters ? Object.values(filters) : [];

    let filtersView = values.map((n, index) => {

      const name = names[index];

      const value = n;

      if (value === undefined) {
        return;
      }

      return <Grid
        key={index}
        item
      >

        <FilterItem
          types={types}
          fields={inputFields}
          item={{
            [name]: value,
          }}
          // onChange={event => {

          //   const {
          //     value,
          //   } = event.target;

          //   // console.log("onChange filter", event.target);

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
          onChange={(name, value) => this.onChange(name, value, index)}
          // onValueChange={this.onValueChange}

          onValueChange={(item) => {

            console.log("onValueChange onChange onValueChange item", item);

            // let newFilters = { ...filters }

            // Object.assign(newFilters, item)

            // setFilters(newFilters);

            // let newFilters = { ...filters }

            Object.assign(filters, item)

            setFilters(filters);
          }}
          setFilters={(a, b, c) => {

            console.log("setFilters a,b,c", a, b, c);

          }}


        />

      </Grid>
    })


    return super.render(<Grid
      container
      spacing={8}
      style={{
        border: "1px solid grey",
      }}
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

          <Grid
            item
          >
            <AddFilter
              fields={inputFields}
              onChange={this.onChange}
            />
          </Grid>


        </Grid>

      </Grid>
    </Grid>);

    // return (
    //   schema ? <Filters /> : "DSfsdf"
    // );
  }
}


export default Filter;