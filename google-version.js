import puppeteer from 'puppeteer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { leadsPrompt, mailJsonPrompt } from './prompts.js';

dotenv.config();

async function askGemini(prompt, model) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function scrapeGoogle(searchTerm) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });

  const searchUrl = `https://www.google.com/search?q=site:${process.env.SCRAPE_SITE} "${searchTerm}" "@gmail.com"`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const content = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  return content;
}

const sendEmail = (emailDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.GOOGLE_EMAIL_PASSWORD,
    },
  });

  const { to, subject, content } = emailDetails;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: content,
  };

  return transporter.sendMail(mailOptions);
};

const sendEmailsFromJson = (jsonFile) => {
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading email file:', err);
      return;
    }

    let emailList;
    try {
      emailList = JSON.parse(data);
    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError);
      return;
    }

    if (!Array.isArray(emailList) || emailList.length === 0) {
      console.warn('⚠️  No emails found. Try a different search term.');
      return;
    }

    console.log(`📬 Sending ${emailList.length} emails...`);
    let delay = 0;

    emailList.forEach((emailDetails, index) => {
      setTimeout(() => {
        sendEmail(emailDetails)
          .then(() => {
            console.log(`✅ [${index + 1}/${emailList.length}] Email sent to ${emailDetails.to}`);
            if (index === emailList.length - 1) {
              console.log('🎉 All emails sent successfully!');
            }
          })
          .catch((error) => console.error(`❌ Failed to send email to ${emailDetails.to}:`, error.message));
      }, delay);

      delay += Math.floor(Math.random() * (90000 - 30000) + 30000);
    });
  });
};

async function main() {
  const searchQuery = process.argv.slice(2).join(' ');
  
  if (!searchQuery) {
    console.log('Usage: node google-version.js [search-term]');
    return;
  }

  console.log('🔍 Starting search for:', searchQuery);
  
  const copiedContent = await scrapeGoogle(searchQuery);
  
  if (copiedContent.includes('unusual traffic') || copiedContent.length < 500) {
    console.warn('⚠️  Google blocked the request. Try the DuckDuckGo version instead.');
    return;
  }

  console.log('✅ Web scraping completed');

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log('✨ Processing data with Gemini...');
  const leadsData = await askGemini(leadsPrompt(copiedContent), model);
  let mailJsonData = await askGemini(mailJsonPrompt(leadsData), model);

  mailJsonData = mailJsonData.replace(/```json\n?|\n?```/g, '').trim();

  try {
    const jsonObject = JSON.parse(mailJsonData);
    await fs.promises.writeFile('emails.json', JSON.stringify(jsonObject, null, 2));
    console.log(`✅ ${jsonObject.length} emails saved to emails.json`);
    
    console.log('🚀 Starting email campaign...');
    sendEmailsFromJson('emails.json');
    
  } catch (error) {
    console.error('❌ Error processing email data:', error);
  }
}

main().catch(console.error);
