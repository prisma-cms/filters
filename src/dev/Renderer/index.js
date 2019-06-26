import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";

import App, {
  // ContextProvider,
  // SubscriptionProvider,
} from "../../App";

import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import {
  ContextProvider as FrontEditorContextProvider,
  SubscriptionProvider as FrontEditorSubscriptionProvider,
  // FrontEditorRoot,
} from "@prisma-cms/front-editor"

import MainMenu from './MainMenu';

import RootPage from "./pages/Root";
import MainPage from "./pages/MainPage";
import UserPage from './pages/User';

class DevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  getRoutes() {

    let routes = super.getRoutes();

    return [
      {
        exact: true,
        path: "/users",
        component: MainPage,
      },
      {
        exact: true,
        path: "/users/:userId",
        render: (props) => {
          const {
            params,
          } = props.match;

          const {
            userId,
          } = params || {};

          return <UserPage
            key={userId}
            userId={userId}
            // where={{
            //   id: userId,
            // }}
            {...props}
          />
        }
      },
      {
        exact: false,
        path: "/",
        component: RootPage,
      },
      // {
      //   path: "*",
      //   render: props => this.renderOtherPages(props),
      // },
    ].concat(routes);

  }



  renderMenu() {

    return <MainMenu />
  }


  renderWrapper() {

    return <FrontEditorContextProvider>
      <FrontEditorSubscriptionProvider>
        <Fragment>
          {this.renderMenu()}
          {super.renderWrapper()}
        </Fragment>
      </FrontEditorSubscriptionProvider>
    </FrontEditorContextProvider>;

  }


  render() {

    const {
      pure,
      ...other
    } = this.props;

    return pure ? <App
      {...other}
    /> : super.render()

  }

}

export default DevRenderer;