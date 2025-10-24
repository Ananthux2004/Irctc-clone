import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, children, delay }) => {
  const theme = useTheme();

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: theme.shadows[4],
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
          {title}
        </Typography>
        <Box sx={{ color: 'text.secondary' }}>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;