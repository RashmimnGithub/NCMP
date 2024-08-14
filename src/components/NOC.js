import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Ensure the correct import path
import { doc, getDoc } from "firebase/firestore";
import companyLogo from "../yqgzPwOk.jpg"; // Update the path to your logo
import userIcon from "../R.png"; // Update the path to your user icon
import "./landingPage.css";

const NOC = () => {
  const navigate = useNavigate();
  const [department, setRole] = useState(null);
  const [userInfo, setUserInfo] = useState({ fullName: " ", email: " ", department: " " });
  const [filteredButtonData, setFilteredButtonData] = useState([]);
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleNavigation = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            const userRole = userDoc.data().department;
            setRole(userRole);

            const buttonData = [
              {
                path: "https://172.19.2.21:8061/",
                title: "OpManager",
                content: "OpManager is a comprehensive network monitoring software that provides real-time visibility into the performance of various network devices, servers, and storage systems.",
                department: ["admin", "user"]
              },
              {
                path: "https://www.zabbix.com/cloud_monitoring",
                title: "Zabbix",
                content: "Zabbix is an enterprise-class open source distributed monitoring solution. Zabbix is a software that monitors numerous parameters of a network and the health and integrity of servers, virtual machines, applications, services, databases, websites, the cloud and more.",
                department: ["admin"]
              },
              {
                path: "https://www.paessler.com/cloud-monitoring",
                title: "Prtg",
                content: "PRTG (Paessler Router Traffic Grapher) is a network monitoring software developed by Paessler GmbH. It monitors system conditions like bandwidth usage or uptime and collects statistics from miscellaneous hosts such as switches, routers, servers, and other devices and applications.",
                department: ["admin", "user"]
              },
            ];

            const filteredData = buttonData.filter(button => button.department.includes(userRole));
            setFilteredButtonData(filteredData);

            setUserInfo({
              fullName: userDoc.data().fullName,
              email: user.email,
              department: userRole
            });
          } else {
            console.error("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message);
      }
    };

    fetchUserRole();
  }, []); // Empty dependency array ensures this effect runs only once

  if (department === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-page-container">
      <div className="header">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1 className="company-name">Netcon</h1>
        <div className="user-section" onClick={toggleTooltip}>
          <img src={userIcon} alt="User Icon" className="user-icon" />
          {isTooltipVisible && (
            <div className="user-info-tooltip">
              <p>{userInfo.fullName}</p>
              <p>{userInfo.email}</p>
              <p>{userInfo.department}</p>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        <button className="back-button" onClick={handleBack}><h4>&larr; Back</h4></button>
      </div>
      <br />
      <div className="content">
        <h2>NOC</h2>
        <br />
        {filteredButtonData.map((button, index) => (
          <div key={index} className="button-wrapper">
            <h4>{button.title}</h4>
            <p>{button.content}</p>
            <button onClick={() => handleNavigation(button.path)}>
              Open {button.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NOC;
