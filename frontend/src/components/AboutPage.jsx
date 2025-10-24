import React from 'react';
import { Container, Grid, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import HeroSection from './about/HeroSection';
import FeatureCard from './about/FeatureCard';
import ValueSection from './about/ValueSection';
import ContactSection from './about/ContactSection';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b63a3',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const AboutPage = () => {
  const features = [
    {
      title: 'What We Offer',
      content: (
        <ul style={{ paddingLeft: '20px', margin: '0' }}>
          <li>Search and compare train schedules and fares</li>
          <li>Secure online ticket booking and e-tickets</li>
          <li>Booking assistance and 24/7 customer support</li>
          <li>Transparent fees — no hidden charges</li>
        </ul>
      ),
    },
    {
      title: 'Safety & Compliance',
      content: (
        <Typography>
          Customer safety is our top priority. We use industry-standard encryption for payments, 
          follow data-protection best practices, and comply with all applicable regulations.
        </Typography>
      ),
    },
    {
      title: 'Our Difference',
      content: (
        <Typography>
          We focus on clarity and trust. Every fare and fee is shown upfront, and our support 
          team is always ready to help with any booking issues.
        </Typography>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <HeroSection />
        
        <Container sx={{ mb: 8 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard title={feature.title} delay={index * 0.2}>
                  {feature.content}
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>

        <ValueSection />
        <ContactSection />

        <Container sx={{ py: 4 }}>
          <Alert
            severity="info"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            sx={{ mt: 4 }}
          >
            <Typography variant="body1">
              <strong>Important legal notice:</strong> This is an independent travel platform and is <strong>not affiliated with IRCTC</strong>. 
              We operate under our own authorization and policies. Always verify ticket authenticity through official channels.
            </Typography>
          </Alert>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AboutPage;