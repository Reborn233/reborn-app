export const menus = [
  {
    name: '转二维码',
    url: '#qrcode',
    icon: require('@/assets/images/qrcode.png')
  },
  {
    name: '图片转base64',
    url: '#imageToBase64',
    icon: require('@/assets/images/imageToBase64.png')
  },
  {
    name: '像素化图片',
    url: '#pixel',
    icon: require('@/assets/images/pixel.png')
  },
  {
    name: '减肥热量计算器(傻瓜版)',
    url: '#kcal',
    icon: require('@/assets/images/calc.png')
  },
  {
    name: 'canvas3D',
    url: '#canvas3D',
    icon: require('@/assets/images/calc.png')
  }
];

export const fineMenusName = (name) => {
  const menu = menus.find(m => m.url === `#${name}`);
  return menu ? menu.name : '';
}
