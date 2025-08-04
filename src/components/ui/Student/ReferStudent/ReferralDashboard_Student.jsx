// src/components/ReferralCodeCard.jsx

import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { generateReferralCode } from '../../../../api/repository/referral_tutor.controller';

const ReferralCodeCard = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await generateReferralCode();

      if (result?.code) {
        setCode(result.code);
      } else {
        setError('Referral code not found in response.');
      }
    } catch (err) {
      setError('Failed to fetch referral code.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      {/* <Typography variant="h6" gutterBottom>
        Tutor Referral Code
      </Typography> */}

      <TextField
        label="Referral Code"
        fullWidth
        variant="outlined"
        value={code}
        InputProps={{ readOnly: true }}
        margin="normal"
      />

      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Referral Code'}
      </Button>
    </Box>
  );
};

export default ReferralCodeCard;