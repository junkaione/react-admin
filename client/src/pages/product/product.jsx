import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import ProductHome from './home';
import ProductEdit from './edit';
import ProductDetail from './detail';
import './product.scss'

class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product" exact component={ProductHome} />
        <Route path="/product/edit" component={ProductEdit} />
        <Route path="/product/detail" component={ProductDetail} />
        <Redirect to="/product" />
      </Switch>
    );
  }
}

export default Product;