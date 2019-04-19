import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import "./styles/less/styles.css";

import Context from '@prisma-cms/context';

import SubscriptionProvider from "./components/SubscriptionProvider";
import ContextProvider from "./components/ContextProvider";
import { Typography, IconButton } from 'material-ui';
import CloseIcon from "material-ui-icons/Close";
import { TextField } from 'material-ui';
import AddFilter from './dev/Renderer/pages/MainPage/AddFilter';
import { FormControlLabel } from 'material-ui';
import { Switch } from 'material-ui';
import { Button } from 'material-ui';
import { FormControl } from 'material-ui';
import { Select } from 'material-ui';
import { MenuItem } from 'material-ui';
import { InputLabel } from 'material-ui';

export {
  ContextProvider,
  SubscriptionProvider,
}


class App extends Component {

  static contextType = Context;


  static propTypes = {
    queryName: PropTypes.string.isRequired,
    whereType: PropTypes.string.isRequired,
    setFilters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // queryName: "users",
    whereType: "where",
  };



  componentDidMount() {

    /**
     * Бывает, не сразу перерендеривается после получения схемы,
     * поэтому обновляем компонент
     */
    setTimeout(() => this.forceUpdate(), 1000);

    super.componentDidMount && super.componentDidMount();
  }


  /**
   * Устанавливаем новые фильтры
   */
  setFilters = (filters) => {

    // console.log("setFilters filters", filters);

    const {
      setFilters,
    } = this.props;

    return setFilters(filters);
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

    console.log("inputFields", inputFields);

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

      /**
       * Вложенные объекты
       */
      else if (value && value instanceof Object) {


        const inputType = inputFields.find(n => n.name === name);

        console.log("inputType", inputType);

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

            <Grid
              item
            >
              <Button
                size="small"
                onClick={event => {

                  setFilters(Object.assign({ ...filters }, {
                    [name]: null,
                  }));

                }}
              >
                Set null
              </Button>
            </Grid>

          </Grid>

        </Grid>;

      }
      else {

        /**
         * Выводим конечное поле.
         * Здесь сразу еще и определяем тип поля (строка/число/логическое/список)
         */
        let field;

        console.log("name", name);

        const fieldByName = inputFields.find(n => n.name === name);

        console.log("fieldByName", fieldByName);

        if (fieldByName) {

          const {
            type: {
              kind: typeKind,
              name: typeName,
            },
          } = fieldByName;


          switch (typeKind) {

            case "SCALAR":

              switch (typeName) {

                case "Boolean":

                  console.log("value", value);

                  if (typeof value === "boolean") {

                    field = <FormControlLabel
                      control={
                        <Switch
                          name={name}
                          checked={value === true}
                          color="primary"
                          onChange={(event, checked) => {

                            console.log("checked", checked);

                            // const {
                            //   name,
                            //   value,
                            // } = event.target;

                            setFilters(Object.assign({ ...filters }, {
                              [name]: checked,
                            }));

                          }}
                        // {...other}
                        />
                      }
                      label={name}
                    // fullWidth
                    />

                  }
                  else {
                    field = <Grid
                      container
                      spacing={8}
                    >
                      <Grid
                        item
                      >
                        <Button
                          size="small"
                          color="primary"
                          onClick={event => {
                            setFilters(Object.assign({ ...filters }, {
                              [name]: true,
                            }));
                          }}
                        >
                          True
                              </Button>
                      </Grid>
                      <Grid
                        item
                      >
                        <Button
                          size="small"
                          color="secondary"
                          onClick={event => {
                            setFilters(Object.assign({ ...filters }, {
                              [name]: false,
                            }));
                          }}
                        >
                          False
                              </Button>
                      </Grid>
                    </Grid>
                  }


                  break;


                case "Int":
                case "Float":

                  field = <TextField
                    name={name}
                    label={name}
                    value={value || ""}
                    type="number"
                    onChange={event => {

                      const {
                        name,
                        value,
                      } = event.target;

                      setFilters(Object.assign({ ...filters }, {
                        [name]: Number(value),
                      }));

                    }}
                  />

                  break;

                default:

                  field = <TextField
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


              }

              break;


            case "ENUM":

              {


                const Type = this.getSchemaType(n => n.name === typeName && n.kind === typeKind);

                if (Type) {


                  const {
                    enumValues,
                  } = Type;

                  field = <FormControl
                    fullWidth
                    style={{
                      minWidth: 150,
                    }}
                  >
                    <InputLabel>{name}</InputLabel>
                    <Select
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
                      inputProps={{
                        name,
                        // id: 'age-simple',
                      }}
                    >
                      {enumValues.map(n => {

                        const {
                          name: fieldName,
                        } = n;

                        return <MenuItem
                          key={fieldName}
                          value={fieldName}
                        >
                          {fieldName}
                        </MenuItem>
                      })}
                    </Select>
                  </FormControl>;

                }
              }

              break;

            default:

              field = <FormControl
                style={{
                  minWidth: 80,
                }}
              >
                <Typography
                  variant="caption"
                >
                  {name}
                </Typography>

                <Typography>
                  {value === undefined ? null :
                    value === null ? "null" :
                      value === true ? "true" :
                        value === false ? "false" :
                          typeof value !== "object" ? value : null
                  }
                </Typography>

              </FormControl>

          }

        }
        else {
          field = <InputLabel>
            {name}
          </InputLabel>
        }


        // if (field) {
        input = this.renderInputBlock(field, name, index, filters, setFilters, deleteItem);
        // }

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

          // console.log("addFilter item", value, inputField, Type, isList, isNonNull);

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
    } = WhereInputType || {};

    return inputFields ? inputFields.filter(n => {

      const {
        name,
      } = n || {};

      return name && ["AND", "OR", "NOT"].indexOf(name) === -1 && !/(\_in)$/.test(name) ? true : false

    }) : [];
  }



  getSchemaType(filter) {

    const {
      schema,
    } = this.context;


    const {
      types,
    } = schema;

    const Field = types.find(filter);

    return Field;

  }


  render() {

    const {
      schema,
      Grid,
    } = this.context;

    const {
      filters,
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


    // console.log("queryField", queryField);

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

    // console.log("whereArg", whereArg);

    if (!whereArg) {
      return null;
    }

    let {
      type: {
        name: whereInputTypeName,
        kind,
        ofType,
      },
    } = whereArg;


    // console.log("whereInputTypeName", whereInputTypeName);

    // console.log("whereInputTypeName kind", kind);
    // console.log("whereInputTypeName ofType", ofType);

    if (!whereInputTypeName && kind === "NON_NULL" && ofType) {

      const {
        name,
      } = ofType;

      whereInputTypeName = name;

    }

    // console.log("whereInputTypeName 2", whereInputTypeName);

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

            this.setFilters(filters)

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

    </Grid>

  }
}

export default App;