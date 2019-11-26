export const menuList = [
  {
    title: '首页',
    icon: 'pie-chart',
    key: '/home'
  },
  {
    title: '商品',
    key: '/products',
    icon: 'pie-chart',
    children: [
      {
        title: '品类管理',
        icon: 'pie-chart',
        key: '/category'
      },
      {
        title: '商品管理',
        icon: 'pie-chart',
        key: '/product'
      },
    ]
  },
  {
    title: '用户管理',
    icon: 'pie-chart',
    key: '/user'
  },
  {
    title: '角色管理',
    icon: 'pie-chart',
    key: '/role'
  }
]