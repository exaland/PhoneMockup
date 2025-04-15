export const deviceTypes = [
  {
    id: 'iphone',
    name: 'iPhone',
    value: 'iphone',
    enabled: true,
    screens: [
      {
        id: 'iphone69',
        name: '6.9"',
        dimensions: {
          width: 1290,
          height: 2796
        }
      },
      {
        id: 'iphone65',
        name: '6.5"',
        dimensions: {
          width: 1284,
          height: 2778
        }
      }
    ]
  },
  {
    id: 'ipad',
    name: 'iPad',
    value: 'ipad',
    enabled: true,
    screens: [
      {
        id: 'ipad_portrait',
        name: 'Portrait',
        dimensions: {
          width: 2048,
          height: 2732
        }
      },
      {
        id: 'ipad_landscape',
        name: 'Landscape',
        dimensions: {
          width: 2732,
          height: 2048
        }
      }
    ]
  }
]; 