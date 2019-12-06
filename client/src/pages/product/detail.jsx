import React, { Component } from 'react';
import {Card, Icon, List} from 'antd';
import {reqCategory} from '../../api';
const Item = List.Item

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cName1: '', // 一级分类名称
      cName2: '', // 二级分类名称
    };
  }
  getCategory = async () => {
    const {categoryId, pCategoryId} = this.props.location.state.product
    if (pCategoryId === '0') {
      const res = await reqCategory({categoryId})
      this.setState({
        cName1: res.data.name
      })
    } else {
      const results = await Promise.all([reqCategory({categoryId: pCategoryId}), reqCategory({categoryId})])
      this.setState({
        cName1: results[0].data.name,
        cName2: results[1].data.name
      })
    }
  }
  componentDidMount() {
    this.getCategory()
  }
  render() {
    const {product} = this.props.location.state
    const {cName1, cName2} = this.state
    const title = (
      <span>
        <button className="link-btn" onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{color: '#1890ff', marginRight: 15}}></Icon>
        </button>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称: </span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="left">商品描述: </span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格: </span>
            <span>{product.price}</span>
          </Item>
          <Item>
            <span className="left">所属分类: </span>
            <span>{cName1} {cName2 ? `---> ${cName2}` : ''}</span>
          </Item>
          <Item>
            <span className="left">商品图片: </span>
            <span>
              {
                product.imgs.map(img => (
                  <img src={img} alt="" className="item-img" key={img}/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情: </span>
            <span dangerouslySetInnerHTML={{__html: product.detail}}></span>
          </Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;