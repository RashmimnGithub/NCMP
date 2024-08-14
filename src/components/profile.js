import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from './AuthContext';

function Profile() {
  const { user } = useAuth(); // Use user state from AuthContext
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            console.log("User data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("User not logged in");
      }
    };

    fetchUserData();
  }, [user]); // Trigger effect when user changes

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      // Redirect or navigate to login page after logout
      // You can use React Router's useNavigate hook for navigation
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="container">

    <div>
      {userDetails ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={userDetails.photo} // Adjust based on your Firestore schema
              width={"40%"}
              style={{ borderRadius: "50%" }}
              alt="User"
            />
          </div>
          <h3>{userDetails.firstName}, Welcome to NCMP</h3>
          <div>
            <p>First Name: {userDetails.firstName}</p>
            <p>Email: {userDetails.email}</p>
            <p>Phone Number: {userDetails.phoneNumber}</p>
            {/* Add other fields as needed */}
          </div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
      </div>
    </div>
    </div>
  );
}

export default Profile;
