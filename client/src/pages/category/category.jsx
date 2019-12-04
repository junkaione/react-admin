import React, {Component} from 'react';
import {Card, Table, Icon, Button, Modal, Form, Select, Input} from 'antd'
import {reqCategories, reqCategoryUpdate, reqCategoryAdd} from '../../api'

const {Item} = Form
const {Option} = Select

class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    loading: false,
    parentId: '0',
    parentName: '',
    subCategories: [], // 子分类列表
    showStatus: 0, // 添加/修改 对话框是否显示。0：都不显示，1：显示添加，2：显示修改
  };

  /* 初始化表格列显示 */
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (row) => (
          <span>
            <button className="link-btn" onClick={() => this.showUpdate(row)}>修改分类</button>
            {
              this.state.parentId === '0' ? <button className="link-btn" onClick={() => this.showSubCategories(row)}>查看子分类</button> : ''
            }
          </span>
        )
      },
    ];
  };

  /* 获取分类列表数据 */
  getCategories = async () => {
    this.setState({
      loading: true
    });
    const res = await reqCategories({parentId: this.state.parentId});
    if (this.state.parentId === '0') {
      this.setState({
        categories: res.data,
        loading: false
      })
    } else {
      this.setState({
        subCategories: res.data,
        loading: false
      })
    }
  };

  showSubCategories = (row) => {
    this.setState({
      parentId: row._id,
      parentName: row.name
    }, () => {
      this.getCategories()
    });
  };

  showCategories = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategories: []
    })
  };

  /* 对话框点击去取消 */
  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      showStatus: 0
    })
  };

  /* 显示添加对话框 */
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  };

  /* 显示修改对话框 */
  showUpdate = (row) => {
    this.category = row
    this.setState({
      showStatus: 2
    })
  };

  /* 添加分类 */
  addCategory = async () => {
    const categoryName = this.props.form.getFieldValue('categoryName')
    const parentId = this.props.form.getFieldValue('parentId')
    const res = await reqCategoryAdd({categoryName, parentId})
    if(res.status === 0) {
      Modal.success({
        content: '新增成功'
      })
      this.setState({
        showStatus: 0
      })
      this.props.form.resetFields()
      this.getCategories()
    }
  };

  /* 修改分类 */
  updateCategory = async () => {
    const categoryId = this.category._id;
    const categoryName = this.props.form.getFieldValue('categoryName')
    const res = await reqCategoryUpdate({categoryId, categoryName})
    if(res.status === 0) {
      Modal.success({
        content: '修改成功',
      });
      this.setState({
        showStatus: 0
      })
      this.props.form.resetFields()
      this.getCategories()
    }
  };

  componentWillMount() {
    this.initColumns()
  };

  componentDidMount() {
    this.getCategories()
  };

  render() {
    const {categories, loading, parentId, parentName, subCategories} = this.state;
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Card title={parentId === '0' ? '一级分类列表' : (
          <span>
            <button className="link-btn" onClick={this.showCategories}>一级分类列表</button>
            <Icon type="arrow-right" style={{marginRight: '5px'}} />
            <span>{parentName}</span>
          </span>
        )} extra={(
          <Button type="primary" onClick={this.showAdd}>
            <Icon type="plus"/>
            添加
          </Button>
        )}>
          <Table
            dataSource={parentId === '0' ? categories : subCategories}
            columns={this.columns}
            rowKey="_id"
            loading={loading}
            bordered
            pagination={{defaultPageSize: 5, showQuickJumper: true}}
          />
        </Card>
        <Modal
          title="添加分类"
          visible={this.state.showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <Form>
            <Item>
              {
                getFieldDecorator('parentId', {
                  initialValue: '0',
                })(
                  <Select>
                    <Option value='0'>一级分类</Option>
                    <Option value='1'>电脑</Option>
                  </Select>
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('categoryName', {
                  initialValue: '',
                })(
                  <Input placeholder="请输入分类名称" />
                )
              }
            </Item>
          </Form>
        </Modal>
        <Modal
          title="修改分类"
          visible={this.state.showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <Item>
            {
              getFieldDecorator('categoryName', {
                initialValue: this.category ? this.category.name : '',
              })(
                <Input placeholder="请输入分类名称" />
              )
            }
          </Item>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Category);