import { purchaseEmail } from './purchaseTemplate';
import { declinedEmail } from './declinedTemplate';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USER } from '../../config/api';
import { IUserCart } from '../../types/userCart';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

export async function sendPurchaseEmail(adress: string, name: string, cart: IUserCart) {
  transporter.sendMail({
    from: 'AncoreGaming',
    to: adress,
    subject: 'Purchase confirmation',
    html: purchaseEmail(name, cart)
  });
}

export async function  sendRejectedEmail(adress: string, name: string, cart: IUserCart) {
  transporter.sendMail({
    from: 'AncoreGaming',
    to: adress,
    subject: 'Purchase rejected',
    html: declinedEmail(name, cart)
  });
}