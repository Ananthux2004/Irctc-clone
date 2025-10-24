import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { motion } from 'framer-motion';

const ValueSection = () => {
  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Safety & Security',
      description: 'Industry-standard encryption and robust security measures to protect your data and transactions.',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service to assist with bookings, cancellations, and inquiries.',
    },
    {
      icon: <PriceCheckIcon sx={{ fontSize: 40 }} />,
      title: 'Transparent Pricing',
      description: 'Clear, upfront fares with no hidden charges. What you see is what you pay.',
    },
  ];

  return (
    <Box sx={{ py: 8, background: '#f5f7fa' }}>
      <Container>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Our Core Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                sx={{
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                    display: 'inline-block',
                  }}
                >
                  {value.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {value.title}
                </Typography>
                <Typography color="text.secondary">
                  {value.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ValueSection;