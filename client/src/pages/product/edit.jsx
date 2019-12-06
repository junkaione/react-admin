import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Upload, Button, Icon } from 'antd';
const { Item } = Form
const { TextArea } = Input

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  addProduct = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log(values);
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
  render() {
    const title = (
      <span>
        <button className="link-btn" onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{color: '#1890ff', marginRight: 15}}></Icon>
        </button>
        <span>添加商品</span>
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
                rules: [{required: true, message: '必须输入商品名称'}]
              })(
                <Input placeholder="请输入商品名称" />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                rules: [{required: true, message: '必须输入商品描述'}]
              })(
                <TextArea placeholder="请输入商品描述" />
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
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
            <div>商品分类</div>
          </Item>
          <Item label="商品图片">
            <div>商品图片</div>
          </Item>
          <Item label="商品详情">
            <div>商品详情</div>
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