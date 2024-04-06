import { IUserCart } from '../../types/userCart';

export function purchaseEmail (name: string, cart: IUserCart) {
  let content = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
  </head>
  <body>
      <div style="background-color: #111; width: 100%; height: 300px; font-family: sans-serif; padding: 10px; text-align: center;">
        <h1 style="color: #fff;">Hi 👋 <span style="color: #7648ffc7;">${name}</span></h1>
        <p>Your purchase of: ${cart.total} has been made successfully, enjoy it!</p>
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px; width: 100%; height: 100%;">
    `;
  
  cart.products.forEach(product => {
    content += `
      <p style="font-size: 16px; color: #fff;">${product.name} - ${product.price}</p>
      <img style="width: 200px; height: 200px;" src=${product.mainImage}" alt="${product.name}" />
    `;
  });

  content += `
        </div>
        <p>Thanks for your purchase!</p>
        <p>Ancore Gaming</p>
      </div>
  </body>
  </html>
  `;

  return content;
}
