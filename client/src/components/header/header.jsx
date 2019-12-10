import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import './header.scss'
import { formatDate } from '../../utils/commonJS'
import { menuList } from '../../config/menuConfig';

class Header extends Component {

  state = {
    nowDate: formatDate(Date.now())
  }

  getTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        nowDate: formatDate(Date.now())
      })
    }, 1000)
  }

  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      }
      if (item.children) {
        const cItem = item.children.find(item => path.indexOf(item.key) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = () => {
    Modal.confirm({
      content: '确定退出吗？',
      onOk: () => {
        localStorage.clear()
        this.props.history.replace('/login')
      }
    });
  }

  componentDidMount() {
    this.getTime()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { nowDate } = this.state
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">


          
          <span>欢迎, admin</span>
          <button className="link-btn" onClick={this.logout}>退出</button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{nowDate}</span>
            <span>晴</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);