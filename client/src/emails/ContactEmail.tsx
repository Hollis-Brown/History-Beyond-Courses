import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  subject,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Message</Heading>
          <Section style={section}>
            <Text style={subheading}>From:</Text>
            <Text style={text}>{name} ({email})</Text>
            
            <Text style={subheading}>Subject:</Text>
            <Text style={text}>{subject}</Text>
            
            <Text style={subheading}>Message:</Text>
            <Text style={text}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This email was sent from the History Beyond Headlines contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
  padding: "0",
};

const section = {
  marginBottom: "24px",
};

const subheading = {
  color: "#666",
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "8px",
  marginTop: "16px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "24px 0",
};

const footer = {
  color: "#666",
  fontSize: "12px",
  fontStyle: "italic",
  textAlign: "center" as const,
};

export default ContactEmail;