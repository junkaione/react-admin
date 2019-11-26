import React, {Component} from 'react';
import {Card, Table, Icon, Button} from 'antd'
import {reqCategories} from '../../api'

class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    loading: false,
    parentId: '0',
    parentName: '',
    subCategories: [], // 子分类列表
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
            <button className="link-btn">修改分类</button>
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

  componentWillMount() {
    this.initColumns()
  };

  componentDidMount() {
    this.getCategories()
  };

  render() {
    const {categories, loading, parentId, parentName, subCategories} = this.state;
    return (
      <div>
        <Card title={parentId === '0' ? '一级分类列表' : (
          <span>
            <button className="link-btn" onClick={this.showCategories}>一级分类列表</button>
            <Icon type="arrow-right" style={{marginRight: '5px'}} />
            <span>{parentName}</span>
          </span>
        )} extra={(
          <Button type="primary">
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
      </div>
    );
  }
}

export default Category;