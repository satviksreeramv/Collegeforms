import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material'; // Added Snackbar and Alert for feedback
import { makeStyles } from '@mui/styles';
import image from '../assets/ESqr.jpg';
import axios from 'axios';

// Define the type for the form data state
interface FormData {
  studentId: string;
  name: string;
  courseName: string;
  email: string;
  collegename: string;
  mobilenumber: string;
  utr: string;
}

// Create styles using MUI's makeStyles
const useStyles = makeStyles({
  formContainer: {
    maxWidth: 500,
    margin: '0 auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  formGroup: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  qrImage: {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
    margin: '10px 0',
  },
  submitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 16,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
});

const Form: React.FC = () => {
  const classes = useStyles();

  // Initialize state for each field with TypeScript's type annotations
  const [formData, setFormData] = useState<FormData>({
    studentId: '1',
    name: '',
    courseName: '',
    email: '',
    collegename: '',
    mobilenumber: '',
    utr: '',
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes for all fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name==='utr'){
      if(value.length===12){
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
      else{
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        setError('UTR must be exactly 12 characters');
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,

    }));
  };


  console.log(formData);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Post data to the server
      const response = await axios.post('http://localhost:3002/api/student/add', formData);

      console.log(response.data);

      // Show success feedback
      setSuccess(true);

      // Reset form data and auto-increment studentId
      setFormData((prevData) => ({
        ...prevData,
        studentId: (parseInt(prevData.studentId) + 1).toString(),
        name: '',
        email:'',
        courseName: '',
        collegename: '',
        mobilenumber: '',
        utr: '',
      }));
    } catch (err: any) {
      // Capture and display error response
      setError(err.response?.data?.message || 'An error occurred');

    }
  };

  // Close success or error notifications
  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box className={classes.formContainer} component="div">
      <Typography variant="h4" align="center" gutterBottom  style={{color:'black'}}>
        Student PaymentForm
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box className={classes.formGroup}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            label="Course Name"
            variant="outlined"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </Box>
        <Box className={classes.formGroup}>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            label="College Name"
            variant="outlined"
            name="collegename"
            value={formData.collegename}
            onChange={handleChange}
            required
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            label="Mobile Number"
            variant="outlined"
            name="mobilenumber"
            value={formData. mobilenumber}
            onChange={handleChange}
            inputProps={{ pattern: '^[0-9]{10}$' }}
            required
            placeholder="10-digit mobile number"
          />
        </Box>

        <Box className={classes.formGroup}>
          <Typography variant="subtitle1" gutterBottom>
            Scan the QR Code to Pay
          </Typography>
          <img
            src={image} // Replace with the actual path to the QR code image
            alt="GPay QR Code"
            className={classes.qrImage}
          />
       <TextField
      label="UTR"
      variant="outlined"
      name="utr"
      value={formData.utr}
      onChange={handleChange}
      required
      inputProps={{
        maxLength: 12, // Restrict the maximum length to 12
      }}
      helperText={formData.utr.length !== 12 ? 'UTR must be exactly 12 characters' : ''}
      error={formData.utr.length !== 12 && formData.utr.length > 0}
    />
        </Box>

        <Button type="submit" variant="contained" className={classes.submitButton}>
          Submit
        </Button>
      </form>

      {/* Success Notification */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Form submitted successfully!
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
