import z from 'zod';

export const reviewValidate = z.object({
  id: z.string().optional(),
  userId: z.string().email('UserId incorrect'),
  productId: z.string().uuid('ProductId incorrect'),
  rating: z.number().min(1, 'Rating out of range').max(5, 'Rating out of range'),
  title: z.string().min(3, 'Tittle is too short').max(30, 'Title is too long'),
  comment: z.string().min(3, 'Comment is too short').max(300, 'Comment is too long'),
});

export const optionalReviewValidate = reviewValidate.partial();