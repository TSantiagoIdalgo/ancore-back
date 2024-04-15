import z from 'zod';

const productValidate = z.object({
  name: z.string().min(3),
  price: z.number(),
  stock: z.number(),
  platform: z.string().min(3),
  distributor: z.string().min(3),
  developer: z.string().min(3),
  genre: z.string().min(2),
  description: z.string().min(3).max(255)
});

export default productValidate;