import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFname] = useState("");
  // const [lname, setLname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [department, setDepartment] = useState("");
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("User registered Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate phone number format
    const phoneRegex = /^\+\d{1,3}\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid phone number format. Please use the format +1234567890.", {
        position: "top-center",
      });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.", {
        position: "top-center",
      });
      return; // Prevent form submission if passwords don't match
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullName: fullname,
          // lastName: lname,
          phoneNumber: phoneNumber,
          department: department,
          photo : ""
        });
        console.log("User Registered Successfully!!");
        toast.success("User Registered Successfully!!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  const handleFormSubmit = (e) => {
    handleRegister(e);
    handleSubmit(e);
  };

  return (
    <div className="App">
      <h1>Welcome to Netcon CMP</h1>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="container">
          
    <form onSubmit={handleFormSubmit}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>Full Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          value={fullname}
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Department</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Phone Number</label>
        <input
          type="tel"
          className="form-control"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Confirm Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered? <a href="/login">Login</a>
      </p>
    </form>
    </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
