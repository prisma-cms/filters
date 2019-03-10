import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';


class Users extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static contextType = Context;

  componentWillMount() {

    const {
      query: {

      },
    } = this.context;

    super.componentWillMount && super.componentWillMount()
  }


  render() {

    const {
      data: {
        objects,
      },
    } = this.props;

    return objects && <table
      border="1"
      cellSpacing={2}
    >
      <tbody>
        <tr>
          <th>
            id
          </th>
          <th>
            username
          </th>
          <th>
            fullname
          </th>
        </tr>
        {objects.map(n => {

          const {
            id,
            username,
            fullname,
          } = n;

          return <tr
            key={id}
          >
            <td>
              {id}
            </td>
            <td>
              {username}
            </td>
            <td>
              {fullname}
            </td>
          </tr>
        })}
      </tbody>
    </table> || null

  }
}

class UsersConnector extends Component {

  static contextType = Context;

  static propTypes = {
    first: PropTypes.number,
  }

  static defaultProps = {
    first: 10,
  }


  componentWillMount() {

    const {
      query: {
        users,
      },
    } = this.context;

    this.Renderer = graphql(gql(users))(Users);


    super.componentWillMount && super.componentWillMount();
  }

  render() {

    const {
      Renderer,
    } = this;

    return <Renderer
      {...this.props}
    />
  }
}


export default UsersConnector;