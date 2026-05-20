import React, { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Supplier Name",
    email: "supplier@example.com",
    mobile: "+91 9876543210",
    location: "Coimbatore",
    businessName: "ABC Traders",
    businessType: "Wholesale Supplier",
    role: "Supplier",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleEdit = () => {
    setFormData(user);
    setIsOpen(true);
  };

  const handleSave = () => {
    setUser(formData);
    setIsOpen(false);
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    boxSizing: "border-box",
  };

  const detailsContainerStyle = {
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "12px",
  };

  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f8fafc",
    fontSize: "14px",
    margin: 0,
  };

  const labelStyle = {
    color: "#64748b",
    fontWeight: "500",
  };

  const valueStyle = {
    color: "#0f172a",
    fontWeight: "600",
  };

  return (
    <PageContainer>
      <div>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          My Profile
        </h2>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" }}>
          Manage your supplier profile credentials and business location information.
        </p>
      </div>

      <div style={gridContainerStyle}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card title={user.role} value={user.name} icon="👤" />
          <Button onClick={handleEdit} variant="primary" style={{ width: "100%" }}>
            Edit Profile Credentials
          </Button>
        </div>

        <div style={detailsContainerStyle}>
          <h3 style={titleStyle}>Profile Information</h3>
          
          <div style={itemStyle}>
            <span style={labelStyle}>Full Name</span>
            <span style={valueStyle}>{user.name}</span>
          </div>
          <div style={itemStyle}>
            <span style={labelStyle}>Email Address</span>
            <span style={valueStyle}>{user.email}</span>
          </div>
          <div style={itemStyle}>
            <span style={labelStyle}>Mobile Number</span>
            <span style={valueStyle}>{user.mobile}</span>
          </div>
          <div style={itemStyle}>
            <span style={labelStyle}>Registered Business</span>
            <span style={valueStyle}>{user.businessName}</span>
          </div>
          <div style={itemStyle}>
            <span style={labelStyle}>Business Category</span>
            <span style={valueStyle}>{user.businessType}</span>
          </div>
          <div style={itemStyle}>
            <span style={labelStyle}>Operation Location</span>
            <span style={valueStyle}>{user.location}</span>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile Details">
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />

          <Input
            label="Business Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />

          <Input
            label="Business Type"
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
          />

          <Input
            label="Operation Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
            <Button onClick={() => setIsOpen(false)} variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary" style={{ flex: 1 }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
