import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 0;
  font-family: 'Arial', sans-serif;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
`;

const FooterHeading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px;
    height: 2px;
    background-color: #3498db;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLinkItem = styled.a`
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #3498db;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.span`
  margin-right: 1rem;
  color: #3498db;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled.a`
  color: #ecf0f1;
  font-size: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #3498db;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* About Section */}
        <FooterSection>
          <FooterHeading>About Us</FooterHeading>
          <p>
            We are a company dedicated to providing the best service in the industry. 
            Our team of professionals works tirelessly to meet your needs.
          </p>
          <SocialIcons>
            <SocialIcon href="#"><FaFacebook /></SocialIcon>
            <SocialIcon href="#"><FaTwitter /></SocialIcon>
            <SocialIcon href="#"><FaInstagram /></SocialIcon>
            <SocialIcon href="#"><FaLinkedin /></SocialIcon>
            <SocialIcon href="#"><FaGithub /></SocialIcon>
          </SocialIcons>
        </FooterSection>

        {/* Quick Links */}
        <FooterSection>
          <FooterHeading>Quick Links</FooterHeading>
          <FooterLinks>
            <FooterLink><FooterLinkItem href="#">Home</FooterLinkItem></FooterLink>
            <FooterLink><FooterLinkItem href="#">Services</FooterLinkItem></FooterLink>
            <FooterLink><FooterLinkItem href="#">About</FooterLinkItem></FooterLink>
            <FooterLink><FooterLinkItem href="#">Features</FooterLinkItem></FooterLink>
            <FooterLink><FooterLinkItem href="#">Pricing</FooterLinkItem></FooterLink>
            <FooterLink><FooterLinkItem href="#">Contact</FooterLinkItem></FooterLink>
          </FooterLinks>
        </FooterSection>

        {/* Contact Info */}
        <FooterSection>
          <FooterHeading>Contact Us</FooterHeading>
          <ContactInfo>
            <ContactIcon><MdLocationOn /></ContactIcon>
            <span>123 Main Street, City, Country</span>
          </ContactInfo>
          <ContactInfo>
            <ContactIcon><MdEmail /></ContactIcon>
            <span>info@example.com</span>
          </ContactInfo>
          <ContactInfo>
            <ContactIcon><MdPhone /></ContactIcon>
            <span>+1 (123) 456-7890</span>
          </ContactInfo>
        </FooterSection>

        {/* Newsletter */}
        <FooterSection>
          <FooterHeading>Newsletter</FooterHeading>
          <p>Subscribe to our newsletter for the latest updates.</p>
          <form style={{ display: 'flex', marginTop: '1rem' }}>
            <input 
              type="email" 
              placeholder="Your email" 
              style={{
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                flex: '1'
              }} 
            />
            <button 
              style={{
                padding: '0.5rem 1rem',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}
            >
              Subscribe
            </button>
          </form>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;