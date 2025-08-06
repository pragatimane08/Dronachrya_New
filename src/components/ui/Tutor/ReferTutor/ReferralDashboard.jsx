// src/components/ui/Tutor/ReferralDashboard.jsx
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
import { generateReferralCode } from '../../../../api/repository/referral_tutor.controller';

const ReferralCodeCard = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    setCode('');

    try {
      const result = await generateReferralCode();

      if (result?.code) {
        setCode(result.code);
        setMessage(result.message || 'Referral code ready.');

        toast.success(result.message || 'Referral code generated.');
      } else {
        toast.error('Referral code not found.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate referral code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 4,
        borderRadius: '12px',
        border: '1px solid #ddd',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Generate Your Tutor Referral Code
      </Typography>

      <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
        Use this code to invite other tutors or students and earn rewards.
      </Typography>

      <TextField
        label="Referral Code"
        fullWidth
        variant="outlined"
        value={code}
        InputProps={{ readOnly: true }}
        margin="normal"
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleGenerate}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : code ? 'Regenerate Code' : 'Generate Referral Code'}
      </Button>

      {code && (
        <Typography
          variant="body2"
          color="success.main"
          align="center"
          mt={3}
          fontWeight={500}
        >
          {message || 'You can now share this code!'}
        </Typography>
      )}
    </Paper>
  );
};

const ReferralDashboard = () => {
  return (
    <>
      <ReferralCodeCard />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ReferralDashboard;
