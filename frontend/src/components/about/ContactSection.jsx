import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HelpIcon from '@mui/icons-material/Help';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      content: 'support@gmail.com',
      link: 'mailto:support@gmail.com',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      content: '+91 8547063259',
      subtext: '(Mon–Sun, 7am–11pm IST)',
    },
    {
      icon: <HelpIcon />,
      title: 'Support Center',
      content: 'Help & FAQs',
      link: '/help',
    },
  ];

  return (
    <Box sx={{ py: 8, background: '#fff' }}>
      <Container>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Get in Touch
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                    '& svg': { fontSize: 40 },
                  }}
                >
                  {info.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {info.title}
                </Typography>
                {info.link ? (
                  <Typography
                    component="a"
                    href={info.link}
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {info.content}
                  </Typography>
                ) : (
                  <Typography>{info.content}</Typography>
                )}
                {info.subtext && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {info.subtext}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;