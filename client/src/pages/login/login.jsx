import React, {Component} from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import {Redirect} from 'react-router-dom'
import './login.scss'
import {reqLogin} from '../../api'

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const res = await reqLogin(values)
        localStorage.setItem('user_info', JSON.stringify(res.data))
        localStorage.setItem('token', res.token)
        message.success('登录成功')
        this.props.history.replace('/')
      }
    });
  }
  render() {
    const user = JSON.parse(localStorage.getItem('user_info') || '{}')
    if(user && user._id){
      return <Redirect to="/" />
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login-header">React项目: 后台管理系统</div>
        <div className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                    { required: true, message: '请输入用户名!' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须为英文、数字或下划线' },
                  ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码!' },
                  { min: 4, message: '密码至少4位' },
                  { max: 12, message: '密码最多12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须为英文、数字或下划线' },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrapLogin = Form.create()(Login)

export default WrapLogin;