import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class Users extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static contextType = Context;


  render() {

    const {
      data: {
        objects,
      },
    } = this.props;

    const {
      UserLink,
    } = this.context;

    return objects ? <table
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
        {objects.map(n => {

          const {
            id,
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
    </table> : null

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
      users = `query users (
        $first: Int = 10
        $skip: Int
        $orderBy: UserOrderByInput
        $where:UserWhereInput
      ){
        objects: users(
          first: $first
          skip:$skip
          orderBy: $orderBy
          where: $where
        ){
          id
          username
          fullname
          image
        }
      }`,
    } = this.context.query || {};

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