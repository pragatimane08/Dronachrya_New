// src/App.jsx

import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateReferralCode } from '../../../../api/repository/referral_tutor.controller'; // adjust path as needed

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

        toast.success(
          code
            ? 'Referral code already exists.'
            : 'Referral code generated successfully!'
        );
      } else {
        setError('Referral code not found in response.');
        toast.error('Referral code not found in response.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch referral code.');
      toast.error('Failed to generate referral code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 450,
        mx: 'auto',
        mt: 6,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: '12px',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Tutor Referral Code
      </Typography>

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
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Referral Code'}
      </Button>

      {code && (
        <Typography
          variant="body1"
          color="success.main"
          align="center"
          mt={3}
          fontWeight={500}
        >
          You can now refer this code to any student or tutor!
        </Typography>
      )}
    </Paper>
  );
};

const ReferralDashboard = () => {
  return (
    <>
      {/* Replace this with your actual route setup if needed */}
      <ReferralCodeCard />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ReferralDashboard;
