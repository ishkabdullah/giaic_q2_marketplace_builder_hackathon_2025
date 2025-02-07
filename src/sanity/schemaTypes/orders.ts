export default {
    name: 'order',
    type: 'document',
    fields: [
      { name: 'orderId', type: 'string', title: 'Order ID' },
      { name: 'customerId', type: 'string', title: 'Customer ID' },
      {
        name: 'products',
        type: 'array',
        title: 'Products',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'id', type: 'string', title: 'Product ID' },
              { name: 'name', type: 'string', title: 'Product Name' },
              { name: 'price', type: 'number', title: 'Price' },
              { name: 'image', type: 'string', title: 'Image URL' },
              {
                name: 'color',
                type: 'array',
                title: 'Colors',
                of: [{ type: 'string' }],
              },
              {
                name: 'size',
                type: 'array',
                title: 'Sizes',
                of: [{ type: 'string' }],
              },
              { name: 'quantity', type: 'number', title: 'Quantity' },
            ],
          },
        ],
      },
      { name: 'status', type: 'string', title: 'Order Status' },
      { name: 'createdAt', type: 'datetime', title: 'Order Created At' },
    ],
  };
  