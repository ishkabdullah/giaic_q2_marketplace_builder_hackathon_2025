import { type SchemaTypeDefinition } from 'sanity'
import products from './products'
import orders from './orders'
import customers from './customers'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    products,
    orders,
    customers,
  ],
}
