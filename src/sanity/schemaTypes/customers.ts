import { Rule } from 'sanity';
import { client } from '@/sanity/lib/client';


export default {
  name: 'customers',
  type: 'document',
  fields: [
    {
      name: 'Customer_id',
      type: 'string',
      title: 'Customer ID',
      readOnly: true, // This field will be auto-generated
      initialValue: () => `customer-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    },
    {
      name: 'user_name',
      type: 'string',
      title: 'User Name',
      validation: (Rule: Rule) => Rule.required().min(2).error('User name must be at least 2 characters long'),
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule: Rule) =>
        Rule.required()
          .email()
          .custom(async (email, context) => {
            if (!email) return true; // Skip if empty
            const isUnique = await client.fetch(
              `count(*[_type == "customers" && email == $email && !(_id in [$currentId])])`,
              { email, currentId: context.document?._id }
            );
            return isUnique === 0 || 'This email is already in use';
          }),
    },
    {
      name: 'Contact',
      type: 'string',
      title: 'Contact',
      validation: (Rule: Rule) =>
        Rule.required()
          .regex(/^\d{10}$/, { name: 'Phone Number', invert: false })
          .custom(async (contact, context) => {
            if (!contact) return true; // Skip if empty
            const isUnique = await client.fetch(
              `count(*[_type == "customers" && Contact == $contact && !(_id in [$currentId])])`,
              { contact, currentId: context.document?._id }
            );
            return isUnique === 0 || 'This phone number is already in use';
          }),
    },
    {
      name: 'address',
      type: 'string',
      title: 'Address',
      validation: (Rule: Rule) => Rule.required().min(5).error('Address must be at least 5 characters long'),
    },
  ],
};
