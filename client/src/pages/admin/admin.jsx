import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import LeftNav from "../../components/left-nav/left-nav";
import Header from "../../components/header/header";
import Home from '../home/home'
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";

const {Content, Footer, Sider} = Layout;

class Admin extends Component {
  render() {
    const user = JSON.parse(localStorage.getItem('user_info') || '{}')
    if (!user || !user._id) {
      return <Redirect to="/login"/>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header/>
          <Content style={{backgroundColor: '#fff', margin: '20px'}}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#999'}}>推荐使用谷歌浏览器访问，效果更佳</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Admin;