import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link for navigation

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully!");
      toast.success("Password reset email sent to your inbox!", {
        position: "top-center",
      });
      setEmail(""); // Clear email field after successful submission
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      toast.error("Error sending password reset email!", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="container">
            <h3>Forgot Password!!</h3>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Send Reset Link
              </button>
            </form>
            <p className="mt-3">
              Back to Login? <Link to="/login">Click Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
