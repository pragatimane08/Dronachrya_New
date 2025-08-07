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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.success('Referral code generated successfully!');
      } else {
        setError('Referral code not found in response.');
        toast.error('Referral code not found in response.');
      }
    } catch (err) {
      setError('Failed to fetch referral code.');
      toast.error('Failed to fetch referral code.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
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

      {/* Toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default ReferralCodeCard;
