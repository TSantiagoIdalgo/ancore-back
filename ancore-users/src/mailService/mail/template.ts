export function mailTemplate (name: string, token: string) {
  return `
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
          position: 
          absolute; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background-color: rgba(0, 0, 0, 0.8);">
            <h1 style="
                color: #fff; 
                font-size: 2.5rem;
                padding-top: 30px;
                font-family: sans-serif;
            ">Welcome to <span style="color: #ff5400">Ancore Gaming</span></h1>
        </div>
    </div>
      <div style="
        background-color: #111; 
        height: 320px; 
        font-family: sans-serif; 
        padding: 10px; 
        text-align: center;">
          <h2 style="font-size: 2rem; color: #fff;">Hi 👋 <span style="color: #ff5400;">${name}</span></h2>
          <p style="font-size: 20px; color: #ddd;">It's great that you consider using our services, we offer the best products at the lowest price on the market.</p>
          <p style="font-size: 20px; color: #ddd;">Please click on the link below to verify your email address:</p>
          <a style="
            text-decoration: none; 
            color: #fff; 
            border: 2px solid #ff5400; 
            border-radius: 10px; 
            padding: 15px; 
            background: transparent; 
            cursor: pointer; 
            font-size: 15px;" 
            href="http://localhost:5173/verify?token=${token}">verify yourself now</a>
      </div>
  </body>
  </html>
    `;
}
