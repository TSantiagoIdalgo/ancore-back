import { mailTemplate } from './template';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USER } from '../../config/api';
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

export async function sendVerifyMail(adress: string, name: string, token: string) {
  transporter.sendMail({
    from: 'AncoreGaming',
    to: adress,
    subject: 'Verify your email',
    html: mailTemplate(name, token)
  });
}