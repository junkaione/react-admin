import React, { Component } from 'react';
import {Card, Select, Input, Button, Icon, Table} from 'antd';
import {reqProducts, reqSearchProducts}  from '../../api';
import {PAGE_SIZE} from '../../config/CommonConfig'
const Option = Select.Option

class ProductHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], //商品数据
      total: 0, // 商品总数量
      loading: false, // 是否正在加载
      searchType: 'productName',
      searchName: ''
    };
  }
  /* 初始化表格列的数组 */
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => `￥${price}`
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (status) => {
          return (
            <span>
              <Button type="primary">下架</Button>
              <span>在售</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              <button className="link-btn">详情</button>
              <button className="link-btn">修改</button>
            </span>
          )
        }
      }
    ]
  }
  /* 获取指定页码的列表数据显示 */
  getProducts = async (pageNum) => {
    this.setState({
      loading: true
    })
    const {searchName, searchType} = this.state
    let res
    if (searchName) {
      res = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        [searchType]: searchName
      })
    } else {
      res = await reqProducts({pageNum, pageSize: PAGE_SIZE})
    }
    if(res.status === 0) {
      this.setState({
        products: res.data.list,
        total: res.data.total
      })
      this.setState({
        loading: false
      })
    }
  }
  componentDidMount() {
    this.getProducts(1)
  }
  componentWillMount() {
    this.initColumns()
  }
  render() {
    const {products, total, loading, searchType, searchName} = this.state
    
    const title = (
      <span>
        <Select 
          value={searchType} 
          onChange={value => this.setState({searchType: value})}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input 
          placeholder="请输入关键字" 
          style={{width: '200px', margin: '0 10px'}} 
          value={searchName} 
          onChange={e => this.setState({searchName: e.target.value})}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary">
        <Icon type="plus" />
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table 
          dataSource={products} 
          columns={this.columns} 
          rowKey="_id" 
          bordered 
          loading={loading}
          pagination={{
            defaultPageSize: PAGE_SIZE, 
            showQuickJumper: true, 
            total,
            onChange: this.getProducts
          }}
        />
      </Card>
    );
  }
}

export default ProductHome;