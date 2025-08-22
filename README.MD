# AI cold email automation

Automated email marketing tool that scrapes social media for business contacts and sends personalized cold emails.Advanced automated email marketing solution that intelligently scrapes social media platforms to discover business contacts, then leverages AI-powered personalization engines to craft and deliver highly targeted cold email campaigns. This comprehensive tool combines cutting-edge web scraping technology, artificial intelligence content generation, and smart email delivery systems to streamline lead generation and maximize outreach effectiveness for businesses across all industries.

## Features

- 🔍 **Web Scraping**: Extracts business emails from Instagram using search terms
- 🤖 **AI-Powered**: Uses Google Gemini to generate personalized email content
- 📧 **Bulk Email**: Sends emails with random delays to avoid spam detection
- 🎯 **Targeted Search**: Finds restaurants, cafes, and businesses by keywords
- 🔒 **Secure**: Uses Gmail with app passwords for authentication

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials

3. **Setup Gmail**
   - Enable 2-factor authentication
   - Generate an app password
   - Add credentials to `.env`

## Usage

### DuckDuckGo Version (Recommended)
```bash
node duckduckgo-version.js "coffee shop"
node duckduckgo-version.js "restaurant"
```

### Google Version
```bash
node google-version.js "pizza place"
```

## Configuration

Edit `.env` file:
- `GOOGLE_API_KEY`: Your Gemini API key
- `EMAIL_USER`: Your Gmail address
- `GOOGLE_EMAIL_PASSWORD`: Your Gmail app password
- `SCRAPE_SITE`: Target social media site (default: instagram.com)
- `AGENCY_NAME`: Your business name
- `AGENCY_WEBSITE`: Your website URL

## Output

- `emails.json`: Generated email list with personalized content
- Emails sent with 30-90 second random delays
- Progress tracking in console

## Notes

- Use DuckDuckGo version to avoid bot detection
- Respect email sending limits
- Test with small batches first
- Check spam folder if emails don't appear