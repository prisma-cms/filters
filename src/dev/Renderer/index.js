import React, { Component } from 'react';
import PropTypes from "prop-types";

import App, {
  ContextProvider,
  SubscriptionProvider,
} from "../../App";

import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import MainMenu from './MainMenu';

import MainPage from "./pages/MainPage";

class DevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  componentDidMount(){

    /**
     * Бывает, не сразу перерендеривается после получения схемы,
     * поэтому обновляем компонент
     */
    setTimeout(() => this.forceUpdate(), 1000);

    super.componentDidMount && super.componentDidMount();
  }

  getRoutes() {

    let routes = super.getRoutes();

    return [
      {
        exact: true,
        path: "/",
        component: MainPage,
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

    return <ContextProvider>
      <SubscriptionProvider>
        {super.renderWrapper()}
      </SubscriptionProvider>
    </ContextProvider>;

  }


  render() {

    const {
      pure,
      ...other
    } = this.props;

    return pure ? <App
      {...other}
    /> : super.render();

  }

}

export default DevRenderer;