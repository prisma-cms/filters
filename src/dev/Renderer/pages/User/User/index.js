import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';


class User extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static contextType = Context;

  // componentWillMount() {

  //   const {
  //     query: {

  //     },
  //   } = this.context;

  //   super.componentWillMount && super.componentWillMount()
  // }


  render() {

    const {
      data: {
        object,
      },
    } = this.props;

    const {
      UserLink,
    } = this.context;

    if (!object) {
      return null;
    }


    return <table
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
        </tr>
        {[object].map(n => {

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
              <UserLink
                user={n}
              />
            </td>
          </tr>
        })}
      </tbody>
    </table>

  }
}

class UserConnector extends Component {

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
        user,
      },
    } = this.context;

    this.Renderer = graphql(gql(user))(User);


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


export default UserConnector;