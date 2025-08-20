import dotenv from 'dotenv';
dotenv.config();

const leadsPrompt = (copiedContent) => `
Please extract the following details from the provided data:

Name: The name of the client or their business.
Bio: A brief description of the client or their business.
Email ID: The email address of the client or their business.

Important: If the email address is not provided, do not return any data for that user. and give me output in plain txt format (Don't forget to write name, bio, email befor data).

Here's the data: ${copiedContent}
`;

const mailJsonPrompt = (leadsData) => `
I need help writing a cold email to potential clients. I'll provide you with client data in the following format:

Name: The name of the client or their business
Bio: A brief description of the client or their business
Email ID: The email address of the client or their business

Your task is to craft a professional, personalized email for each client. The email should:

Address the client by their name or business name.
Mention my agency "${process.env.AGENCY_NAME}" as the sender.
Clearly state that ${process.env.AGENCY_NAME} can help them with building websites, apps, or automation tools, and provide any technical support they might need.

Highlight that ${process.env.AGENCY_NAME} offers competitive and reasonable pricing for its services.
Mention that our website (${process.env.AGENCY_WEBSITE}) serves as our portfolio, showcasing our work and expertise.
Encourage them to reply if they are interested in discussing further.
Please make sure the email is well-written, respectful, and persuasive, while focusing on the client's needs.

After generating the emails, provide the output like the following JSON format:
[
  {
    "to": "recipient1@gmail.com",
    "subject": "Professional Digital Solutions for [Client's Business Name]",
    "content": "Dear [Client's Name],\\n\\n[Personalized introduction and offer details...]\\n\\nThank You,\\n${process.env.AGENCY_NAME} Team"
  }
]

IMPORTANT: Return ONLY the raw JSON array without any markdown formatting, code blocks, or backticks. The response should start with '[' and end with ']'.

Here's the data: ${leadsData}
`;

export { leadsPrompt, mailJsonPrompt };
