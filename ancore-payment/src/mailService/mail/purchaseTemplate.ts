import { CartForEmails } from '../../types/userCart';

export function purchaseEmail (name: string, cart: CartForEmails) {
  let content =  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
  </head>
  <body style="margin: 0; padding: 0; box-sizing: border-box;">
    <div style="
    background-image: url('https://gaming-cdn.com/img/products/7911/pcover/1400x500/7911.jpg?v=1711626178'); 
    height: 200px; 
    width: 100%; 
    background-size: cover;
    text-align: center;
    position: relative;">
      <div style="
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background-color: rgba(0, 0, 0, 0.8);">
      </div>
    </div>
    <div style="
      background-color: #111; 
      width: 100%;
      min-height: 600px; 
      height: 100%; 
      font-family: sans-serif; 
      text-align: center;
      position: relative;">
      <div style="
        height: 100%;
        width: 80%;
        background-color: #272727;
        margin: 0 auto;
        border-radius: 14px;">
          <h1 style="color: #fff; font-size: 2.5rem; display: inline-block">Hi 👋 <span style="color: #ff5400;">${name}</span></h1>

          <p style="color: #fff;font-size: 1.5rem;">Your purchase of: $${cart.total} has been made successfully, enjoy it!</p>

        <div style="width: 100%; height: 100%;">`;

  cart.products.forEach(product => {
    content += `<img style="display: inline-block; width: 125px; height: 125px; border-radius: 50%;" src="${product.mainImage}" alt="${product.name}" />`;
  });

  content += `<div style="display: block;">
            <span style="font-size: 16px; color: #fff; font-size: 1.4rem;">
              You buyed ${cart.products[0].name} ${cart.products.length > 1 ? `and another ${cart.products.length - 1} products` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>


  `;

  return content;
}
