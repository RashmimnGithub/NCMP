// otp.js
import { auth, db } from "./firebase"; 
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; 

const OTPVerification = () => {
  const [phone, setPhone] = useState("+91");
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState("");
  const { setUser } = useAuth(); 
  const navigate = useNavigate();

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  };

  const checkUserExists = async (phoneNumber) => {
    try {
      const q = query(collection(db, 'Users'), where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot:', querySnapshot.docs);
      return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
    } catch (error) {
      console.error('Error checking user:', error);
      return null;
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const userData = await checkUserExists(phone);
    if (!userData) {
      alert("User with this phone number does not exist.");
      return;
    }

    setHasFilled(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
  };

  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then(async (result) => {
          let user = result.user;
          console.log("User signed in successfully:", user);
          // alert("User signed in successfully");

          // Save user data to Firestore
          const userData = {
            phoneNumber: user.phoneNumber,
            uid: user.uid,
            // Add any other fields you need to store
          };

          try {
            await setDoc(doc(db, "Users", user.uid), userData);
            console.log("User data saved successfully to Firestore");
          } catch (error) {
            console.error("Error saving user data:", error);
          }

          setUser(user); 
          navigate("/landing"); // Redirect to the landing page
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
          // alert("Error verifying OTP: " + error.message);
        });
    }
  };

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="container">

    <div className="app__container">
      <Card sx={{ width: "300px" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <Typography sx={{ padding: "20px" }} variant="h5" component="div">
            {hasFilled ? "Enter the OTP" : "Enter your phone number"}
          </Typography>
          <form onSubmit={handleSend}>
            {!hasFilled && (
              <TextField
                sx={{ width: "240px" }}
                variant="outlined"
                autoComplete="off"
                label="Phone Number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            )}
            {hasFilled && (
              <TextField
                sx={{ width: "240px" }}
                variant="outlined"
                label="OTP"
                value={otp}
                onChange={(event) => verifyOtp(event)}
              />
            )}
            <Button type="submit" variant="contained" sx={{ width: "240px", marginTop: "20px" }}>
              {hasFilled ? "Verify OTP" : "Send Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div id="recaptcha"></div>
    </div>
    </div>
      </div>
    </div>
    </div>
  );
};

export default OTPVerification;
