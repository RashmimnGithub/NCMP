import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Document, Page } from "react-pdf"; // Import react-pdf components
import "./landingPage.css";
import companyLogo from "../yqgzPwOk.jpg"; // Update the path to your logo
import userIcon from "../R.png"; // Update the path to your user icon
import monitoring from "../images/Monitoring_image.jpg";
import itsm from "../images/itsm_image.png";
import automation from "../images/automation_image.jpg";
import reporting from "../images/reporting_image.jpg";
import finops from "../images/finops_image.png";
import soc from "../images/soc_image.png";
import asset from "../images/asset.jpg";
import cloud from "../images/cloud management_image.png";
import noc from "../images/noc_images.webp";
// import reporting_images from "../images/reporting_image.png";
import customerLogo from "../images/customer_logo.png";
import adminLogo from "../images/admin_logo.webp";
import managerLogo from "../images/manager_logo.png";
import "./Modal.css"
import customerpdf from "../DC_IT_Infra_Customer.pdf"

const buttonData = [
  {
    path: "https://172.19.2.21:8061/",
    title: "Monitoring",
    content: "Monitoring is a process to periodically collect, analyse and use information to actively manage performance, maximise positive impacts and minimise the risk of adverse impacts.",
    department: ["admin"],
    image: monitoring,
    icon: "fa-solid fa-chart-line" // FontAwesome class
  },
  {
    path: "https://support.netcon.in:8448/",
    title: "ITSM",
    content: "ITSM in cloud refers to IT Service Management solutions that are deployed and delivered through cloud infrastructure. ITSM cloud solutions can simplify the operations, planning, and implementation of IT services for businesses.",
    department: ["admin", "user"],
    image: itsm,
    icon: "fa-solid fa-cogs"
  },
  {
    path: "https://20.197.35.43:443",
    title: "Automation",
    content: "AWX makes it possible for users across an organization to share, vet, and manage automation content by means of a simple, powerful, and agentless technical implementation. IT managers can provide guidelines on how automation is applied to individual teams",
    department: ["admin"],
    image: automation,
    icon: "fas fa-desktop"
  },
  {
    path: "https://20.197.35.43:443",
    title: "Evergreen Patching",
    content: "AWX makes it possible for users across an organization to share, vet, and manage automation content by means of a simple, powerful, and agentless technical implementation. IT managers can provide guidelines on how automation is applied to individual teams",
    department: ["admin"],
    image: automation,
    icon: "fa fa-cloud"
  },
  {
    path: "/up",
    title: "Asset Management",
    content: "Cloud Asset Management (CAM) is a crucial practice in today’s digital era. It focuses on managing and tracking resources essential for delivering cloud services. These assets include both tangible elements, such as physical or virtual storage and servers, as well as intangible components like software licenses and undocumented staff knowledge",
    department: ["admin", "user"],
    image: asset,
    icon: "fas fa-database"
  },
  {
    path: "https://netconzone.surpaascompaas.com/surpaas/#",
    title: "Finops",
    content: "FinOps is an operational framework and cultural practice which maximizes the business value of cloud, enables timely data-driven decision making, and creates financial accountability through collaboration between engineering, finance, and business teams.",
    department: ["admin", "user"],
    image: finops,
    icon: "fas fa-hand-holding-usd"
  },
  {
    path: "/up",
    title: "SoC",
    content: "A Cloud SOC monitors cloud applications and infrastructure 24/7 to detect vulnerabilities, respond to threats, and prevent attacks. It ensures continuous vigilance over an organization’s IT infrastructure, maintaining security while adhering to compliance requirements.",
    department: ["admin"],
    image: soc,
    icon: "fas fa-shield-alt"
  },
  {
    path: "/up",
    title: "CMP",
    content: "A Cloud Management Platform (CMP) is a software tool that helps organizations manage and optimize their cloud infrastructure across multiple cloud providers and services. CMPs provide a centralized interface for monitoring, provisioning, deploying, and managing cloud resources, such as virtual machines, containers, storage, and networking",
    department: ["admin", "user"],
    image: cloud,
    icon: "fas fa-server"
  },
  // {
  //   path: "/noc",
  //   title: "NoC",
  //   content: "The Network Operations Center (NOC) is a centralized location where 24/7 monitoring and management of events affecting technology services and infrastructure take place. Originating in the late 1970s by telecommunication service providers, today’s NOCs monitor not only networking equipment but also cloud, power, environmental, and service aspects.",
  //   department: ["admin"],
  //   image: noc
  // },
  {
    // path: "https://app.powerbi.com/links/G56uML9AUH?ctid=3865b44b-651f-4df8-a0c8-2625494f6198&pbi_source=linkSharea",
    title: "Dashboard",
    content: "Cloud reporting involves collecting, analyzing, and presenting data generated in a cloud environment to derive valuable insights for better decision-making. It transforms raw data into meaningful charts, graphs, and tables, enabling real-time insights and timely decisions.",
    department: ["admin"],
    image: reporting,
    icon: "fas fa-poll-h"
  },
];


const subButtons = {
  customer: [
    {
      title: "Customer Button 1",
      pdf: customerpdf, // Use PDF file instead of image
    },
    {
      title: "Customer Button 2",
      pdf: "../path-to-another-pdf-file.pdf", // Another PDF file
    },
  ],
  manager: [
    {
      title: "Manager Button 1",
      pdf: "../path-to-manager-pdf-file.pdf", // Manager's PDF
    },
    {
      title: "Manager Button 2",
      pdf: "../path-to-another-manager-pdf-file.pdf", // Another Manager's PDF
    },
  ],
  admin: [
    {
      title: "Admin Button 1",
      pdf: "../path-to-admin-pdf-file.pdf", // Admin's PDF
    },
    {
      title: "Admin Button 2",
      pdf: "../path-to-another-admin-pdf-file.pdf", // Another Admin's PDF
    },
  ],
};


const LandingPage = () => {
  const navigate = useNavigate();
  const [department, setRole] = useState(null);
  const [filteredButtonData, setFilteredButtonData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [userInfo, setUserInfo] = useState({ fullName: " ", email: " ", department: " " });
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [subButtonCategory, setSubButtonCategory] = useState(null);

  // New state for modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setSubButtonCategory(null);
  };

  const handleSubButtonClick = (category) => {
    setSubButtonCategory(category);
  };

  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  const showModal = (pdf) => {
    setSelectedPdf(pdf);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPdf(null);
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
  }, []);

  if (department === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-page-container">
      <div className="header">
        <div className="logo-wrapper" onClick={() => navigate("/homepage")}>
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
        </div>
        <h1 className="company-name">Netcon Technologies</h1>
        <div className="user-section" onClick={toggleTooltip}>
          <img src={userIcon} alt="User Icon" className="user-icon" />
          {isTooltipVisible && (
            <div className="user-info-tooltip">
              <p>{userInfo.fullName}</p>
              <p>{userInfo.email}</p>
              <p>{userInfo.department}</p>
              <button className="logout-button" onClick={async () => await auth.signOut()}>Logout</button>
            </div>
          )}
        </div>
        <button className="back-button" onClick={() => window.history.back()}>&larr; Back</button>
      </div>
      <div className="content-container">
        <div className="sidebar">
          {filteredButtonData.map((button, index) => (
            <div
              key={index}
              className={`sidebar-item ${selectedService === button ? "active" : ""}`}
              onClick={() => handleServiceClick(button)}
            >
              <i className={button.icon}></i> {/* Icon before the title */}
              <span className="sidebar-title">{button.title}</span>
              <i className="fa-solid fa-arrow-right sidebar-arrow"></i> {/* Right arrow icon */}
            </div>
            
          ))}
        </div>
        <div className="content">
          {selectedService ? (
            <>
              <h2>{selectedService.title}</h2>
              {!subButtonCategory ? (
                <div className="win">
                  <img src={selectedService.image} alt={selectedService.title} className="content-image" />
                  <p>{selectedService.content}</p>
                </div>
              ) : null}

              {selectedService.title === "Monitoring" ? (
                <div className="monitoring-content">
                  <button
                    onClick={() => window.open(selectedService.path, "_blank", "noopener,noreferrer")}
                  >
                    Open Monitoring
                  </button>
                  <br /><br />
                  <div className="monitoring-content">
                    <h2>NoC</h2>
                    <div className="win">
                      <img src={noc} alt="NoC" className="content-image" />
                      <p>
                        The Network Operations Center (NoC) is responsible for monitoring and managing network performance and security. It ensures optimal operation of the network infrastructure, detects issues, and provides timely solutions to maintain seamless service delivery.
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(selectedService.path, "_blank", "noopener,noreferrer")}
                    >
                      Open NoC
                    </button>
                  </div>
                </div>
              ) : selectedService.title === "Dashboard" ? (
                <div className="dashboard-service-content">
                  {!subButtonCategory ? (
                    <div className="dashboard-logos-container">
                      <div className="dashboard-logo-item" onClick={() => handleSubButtonClick('customer')}>
                        <img src={customerLogo} alt="Customer Logo" />
                        <p>Customer</p>
                      </div>
                      <div className="dashboard-logo-item" onClick={() => handleSubButtonClick('manager')}>
                        <img src={managerLogo} alt="Manager Logo" />
                        <p>Manager</p>
                      </div>
                      <div className="dashboard-logo-item" onClick={() => handleSubButtonClick('admin')}>
                        <img src={adminLogo} alt="Admin Logo" />
                        <p>Admin</p>
                      </div>
                    </div>
                  ) : (
                    <div className="sub-buttons-container">
                      {subButtons[subButtonCategory].map((subButton, index) => (
                        <button
                          key={index}
                          className="sub-button"
                          onClick={() => showModal(subButton.pdf)}
                        >
                          {subButton.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="service-content">
                  <button onClick={() => window.open(selectedService.path, "_blank", "noopener,noreferrer")}>
                    Open {selectedService.title}
                  </button>
                </div>
              )}
            </>
          ) : (
            <h1>Welcome to Netcon CMP</h1>
          )}
        </div>
      </div>

      {isModalVisible && selectedPdf && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <Document file={selectedPdf} onLoadError={console.error}>
              <Page pageNumber={1} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;