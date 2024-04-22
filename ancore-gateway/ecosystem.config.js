module.exports = {
  apps: [
    /*{
      name: 'apigateway',
      script: './build/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      port: 8080,
      env: {
        'USERS_PORT': 8081,
        'PRODUCTS_PORT': 8082,
        'PAYMENT_PORT':8083
      }
    },*/
    {
      name: 'users',
      script: '../ancore-users/build/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      port: 8081,
      env: {
        'SECRET': '718c2d46-b263-46c0-8fd1-d271fab61e1a',
        'HOST': 'smtp.gmail.com',
        'EMAIL': 'tomasidalgo6@gmail.com',
        'PASSWORD': 'ipqu dtou tymp mhpi',
        'DB_USER': 'postgres',
        'DB_PASSWORD': '277353',
        'DB_HOST': 'localhost',
        'DB_NAME': 'ancoregames',
        'MONGO_URI': 'localhost:27017',
        'MONGO_NAME': 'ancoregames'
      }
    },
    {
      name: 'products',
      script: '../ancore-products/build/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      port: 8082,
      env: {
        'SECRET': '718c2d46-b263-46c0-8fd1-d271fab61e1a',
        'DB_USER': 'postgres',
        'DB_PASSWORD': '277353',
        'DB_HOST': 'localhost',
        'DB_NAME': 'ancoregames',
        'MONGO_URI': 'localhost:27017',
        'MONGO_NAME': 'ancoregames'
      }
    },
    {
      name: 'payment',
      script: '../ancore-payment/build/index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      port: 8083,
      env: {
        'STRIPE_SECRET': 'sk_test_51P1AoP074NVPZWAhxfJkKOYLy7t6g5J8UfIkH2INPDL0NZXUhr6LWgYuu9cTlTr4Cob1tfZvX8ZgdbWD1lTc9e5T00Df7onXQq',
        'SECRET': '718c2d46-b263-46c0-8fd1-d271fab61e1a',
        'HOST': 'smtp.gmail.com',
        'EMAIL': 'tomasidalgo6@gmail.com',
        'PASSWORD': 'ipqu dtou tymp mhpi',
        'DB_USER': 'postgres',
        'DB_PASSWORD': '277353',
        'DB_HOST': 'localhost',
        'DB_NAME': 'ancoregames',
        'MONGO_URI': 'localhost:27017',
        'MONGO_NAME': 'ancoregames'
      }
    }
  ],
};
  