import React, {Component} from 'react';
import {Card, Button, Table, Modal, Form, Input, message} from 'antd'
import {PAGE_SIZE} from '../../config/CommonConfig'
import {reqRoles, reqAddRole} from '../../api'
const { Item } = Form

class Role extends Component {
  state = {
    roles: [], // 所有角色列表
    role: {}, // 选中角色
    isShowAdd: false, // 
  }
  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time'
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time'
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        width: 300,
        render: (row) => (
          <span>
            111
          </span>
        )
      },
    ];
  }
  getRole = async () => {
    const res = await reqRoles()
    if(res.status === 0) {
      this.setState({
        roles: res.data
      })
    }
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({
          role
        })
      }
    }
  }
  /* 添加角色 */
  addRole = () => {
    this.props.form.validateFields(async (error, values) => {
      if(!error) {
        const {roleName} = values
        const res = await reqAddRole({roleName})
        if(res.status === 0) {
          message.success('添加角色成功')
          this.setState({
            isShowAdd: false
          })
          this.props.form.resetFields()
          this.getRole()
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getRole()
  }
  render() {
    const {roles, role, isShowAdd} = this.state
    const {getFieldDecorator} = this.props.form
    /* 指定Item布局的配置对象 */
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 16
      },
    }
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
        <Button type="primary" disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table 
          dataSource={roles}
          columns={this.columns}
          rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
          rowKey="_id"
          bordered
          pagination={{defaultPageSize: PAGE_SIZE}}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <Form {...formItemLayout}>
            <Item label="角色名称">
              {
                getFieldDecorator('roleName', {
                  rules: [
                    { required: true, message: '角色名称必须输入' }
                  ]
                })(
                  <Input placeholder="请输入角色名称" />
                )
              }
            </Item>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default Form.create()(Role);