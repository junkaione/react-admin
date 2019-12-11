import React, {Component} from 'react';
import {Card, Button, Table, Modal, Form, Input, message, Tree} from 'antd'
import {PAGE_SIZE} from '../../config/CommonConfig'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import {menuList} from '../../config/menuConfig'
const { Item } = Form
const { TreeNode } = Tree

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [], // 所有角色列表
      role: {}, // 选中角色
      isShowAdd: false,
      isShowAuth: false,
      checkedKeys: []
    }
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
          role,
          checkedKeys: role.menus
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
  /* 更新角色 */
  updateRole = async () => {
    const {role, checkedKeys} = this.state
    const newRole = {...role}
    newRole.menus = checkedKeys
    const res = await reqUpdateRole(newRole)
    if(res.status === 0) {
      message.success('更新权限成功')
      this.setState({
        isShowAuth: false
      })
      this.getRole()
    }
  }
  getTreeNodes = (menuList) => {
    return menuList.map((item) => (
      <TreeNode title={item.title} key={item.key}>
        {item.children ? this.getTreeNodes(item.children) : null}
      </TreeNode>
    ))
  }
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }
  componentWillMount() {
    this.initColumns()
    this.treeNodes = this.getTreeNodes(menuList)
  }
  componentDidMount() {
    this.getRole()
  }
  render() {
    const {roles, role, isShowAdd, isShowAuth, checkedKeys} = this.state
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
        <Button type="primary" disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
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
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => this.setState({isShowAuth: false, checkedKeys: role.menus})}
        >
          <Form {...formItemLayout}>
            <Item label="角色名称">
              <Input disabled value={role.name} />
            </Item>
            <Tree
              checkable
              defaultExpandAll={true}
              checkedKeys={checkedKeys}
              onCheck={this.onCheck}
            >
              <TreeNode title="平台权限" key="all">
                {this.treeNodes}
              </TreeNode>
            </Tree>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default Form.create()(Role);