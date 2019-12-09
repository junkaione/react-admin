import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Upload, Button, Icon } from 'antd';
import {reqCategories} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
    this.pw = React.createRef()
    this.editor = React.createRef()
  }
  addProduct = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        console.log(detail,111);
      } else {
        console.log(values,111);
      }
    })
  }
  validatePrice = (rule, value, callback) => {
    if (Number(value) > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }
  /* 异步获取一级/二级分类列表 */
  getCategories = async (parentId) => {
    const res = await reqCategories({parentId})
    if(res.status === 0) {
      const categories = res.data
      if (parentId === '0') {
        this.initOptions(categories)
      } else {
        return categories
      }
    }
  }
  initOptions = async (categories) => {
    const options = categories.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))
    const {isUpdate, product} = this
    const {pCategoryId, categoryId} = product
    if(isUpdate && pCategoryId !== '0') {
      const subCategories = await this.getCategories(pCategoryId)
      const childOptions = subCategories.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = childOptions
    }
    this.setState({
      options
    })
  }
  /* 用于加载下一级列表的回调函数 */
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    const subCategories = await this.getCategories(targetOption.value)
    if (subCategories && subCategories.length > 0) {
      const childOptions = subCategories.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true
    }
    targetOption.loading = false;
    this.setState({
      options: [...this.state.options],
    })
  }
  componentDidMount() {
    this.getCategories('0')
  }
  componentWillMount() {
    this.isUpdate = !!this.props.location.state
    this.product = this.isUpdate ? this.props.location.state.product : {}
    const {pCategoryId, categoryId} = this.product
    this.categoryIds = []
    if (this.isUpdate) {
      if (pCategoryId === '0') {
        this.categoryIds.push(categoryId)
      } else {
        this.categoryIds.push(pCategoryId)
        this.categoryIds.push(categoryId)
      }
    }
  }
  render() {
    const title = (
      <span>
        <button className="link-btn" onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{color: '#1890ff', marginRight: 15}}></Icon>
        </button>
        <span>{this.isUpdate ? '修改' : '添加'}商品</span>
      </span>
    )
    /* 指定Item布局的配置对象 */
    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 8
      },
    }
    const {getFieldDecorator} = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: this.product.name,
                rules: [{required: true, message: '必须输入商品名称'}]
              })(
                <Input placeholder="请输入商品名称" />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: this.product.desc,
                rules: [{required: true, message: '必须输入商品描述'}]
              })(
                <TextArea placeholder="请输入商品描述" />
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: this.product.price,
                rules: [
                  {required: true, message: '必须输入商品价格'},
                  {validator: this.validatePrice}
                ]
              })(
                <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
              )
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: this.categoryIds,
                rules: [
                  {required: true, message: '必须输入商品价格'},
                ]
              })(
                <Cascader
                  placeholder="请输入商品分类"
                  options={this.state.options}
                  loadData={this.loadData}
                />
              )
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={this.props.imgs} />
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={this.product.detail} />
          </Item>
          <Item>
            <Button type="primary" onClick={this.addProduct}>提交</Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(ProductEdit);