import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
        color: 'white',
        py: 8,
        mb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component={motion.h1}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          About IRCTC Clone
        </Typography>
        <Typography
          component={motion.p}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          variant="h5"
          sx={{ mb: 3, maxWidth: '800px' }}
        >
          Your trusted platform for simple, secure, and transparent train travel across India
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;