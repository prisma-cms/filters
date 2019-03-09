import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";


import gql from 'graphql-tag';
import { TextField } from 'material-ui';
import InputsArray from './array';

class FilterItem extends PrismaCmsComponent {

  // static contextType = Context;

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    onChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
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
    } = this.props;

    console.log("schema", schema);


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

      inputs.push(<option
        key={name}
        value={name}
      >
        {name}
      </option>);

    });

    filters = <select
      value={name || ""}
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

        }

        onChange(value, initialValue);

      }}
    >
      <option
        value={""}
      >
        ---
      </option>
      {inputs}
    </select>


    /**
     * Это поле для ввода при выбранном типе фильтра
     */
    let input;


    if (name) {

      const Filter = inputFields.find(n => n.name === name);

      console.log("Filter", Filter);

      if (Filter) {

        const {
          name,
          defaultValue,
          description,
          type,
        } = Filter;



        let {
          Type,
          isList,
          isNonNull,
        } = this.getType(type);

        console.log("getType Type", Type, isList, isNonNull);

        const {
          kind,
          ofType,
        } = Type;


        switch (kind) {

          case "SCALAR":

            // input = <TextField
            //   name={name}
            // />

            input = this.renderField(<TextField
              key={name}
              name={name}
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

              console.log("InputsArray onChange value", [...value]);

              console.log("InputsArray onChange event", index, event, { ...event.target });

              const {
                // name,
                value: itemValue,
              } = event.target;

              let newValue = [...value];

              let item = newValue[index];

              if (item === undefined) {
                item = "";
                index = newValue.push(item) - 1;

                console.log("InputsArray onChange new index", index);

              }

              newValue[index] = itemValue;

              console.log("InputsArray onChange newValue", newValue);

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


export default FilterItem;