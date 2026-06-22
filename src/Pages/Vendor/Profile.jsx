import React, { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { useVendor } from "../../Context/Vendorcontext";
import { vendorService } from "../../Services/vendorService";
import { toast } from "react-toastify";
import profileIconImage from "../../Assests/Profileicon Image.jpg"; 

export default function Profile() {
  const { profile, refreshVendorData } = useVendor();

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    location: "",
    mobile: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || "",
        business_type: profile.business_type || "",
        location: profile.location || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || "",
        business_type: profile.business_type || "",
        location: profile.location || "",
        mobile: profile.mobile || "",
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await vendorService.updateProfileDetails(formData);
      if (response.status || response) {
        toast.success("your changes are changed safely");
        setIsOpen(false);
        if (refreshVendorData) {
          await refreshVendorData();
        }
      }
    } catch (err) {
      console.error("Failed to sync profile changes down to server:", err);
      toast.error("Failed to commit profile updates to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsPasswordSaving(true);
    try {
      const response = await vendorService.updatePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      });
      if (response.status || response) {
        toast.success("your changes are changed safely");
        setIsPasswordOpen(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error("Password modification process fault:", err);
      toast.error(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const headerWrapperStyle = {
    fontFamily: "'Inter', sans-serif",
    marginBottom: "32px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "16px",
    textAlign: "left"
  };

  const mainHeadingStyle = {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  };

  const subHeadingStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "400"
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif"
  };

  const leftActionPanelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    height: "fit-content"
  };

  const darkCardBoxStyle = {
    backgroundColor: "#111827", 
    padding: "32px 24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #1f2937",
    boxSizing: "border-box",
    width: "100%"
  };

  const profileImageStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid rgba(255, 255, 255, 0.2)",
    objectFit: "cover",
    marginBottom: "16px",
    backgroundColor: "#1f2937"
  };

  const darkCardTitleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.01em",
    lineHeight: "1.3"
  };

  const darkCardSubtitleStyle = {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#9ca3af",
    fontWeight: "500"
  };

  const detailsContainerStyle = {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: "0 0 24px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const itemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    marginBottom: "12px",
    border: "1px solid #f1f5f9",
    boxSizing: "border-box",
    textAlign: "left"
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };

  const valueStyle = {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "600"
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const modalBodyStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    width: "440px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    textAlign: "left"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
    marginTop: "6px",
    marginBottom: "16px"
  };

  const labelFormStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569"
  };

  return (
    <PageContainer>
      <style>{`
        .profile-grid-container {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
        }
        .profile-details-box {
          padding: 36px !important;
        }

        @media (max-width: 768px) {
          .profile-grid-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .profile-details-box {
            padding: 24px 16px !important;
          }
        }
      `}</style>

      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>My Profile</h2>
        <p style={subHeadingStyle}>Manage your vendor profile credentials and business location information.</p>
      </div>

      <div className="profile-grid-container" style={gridContainerStyle}>
        <div style={leftActionPanelStyle}>
          <div style={darkCardBoxStyle}>
            <img src={profileIconImage} alt="Vendor Profile" style={profileImageStyle} />
            <h3 style={darkCardTitleStyle}>{profile?.business_name || "Loading..."}</h3>
            <p style={darkCardSubtitleStyle}>({profile?.user_id || "Checking ID..."})</p>
          </div>

          <button 
            onClick={handleEdit} 
            style={{ 
              width: "100%", height: "46px", backgroundColor: "#3b82f6", color: "#ffffff", 
              border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            Edit Profile Credentials
          </button>

          <button
            onClick={() => setIsPasswordOpen(true)}
            style={{
              width: "100%",
              height: "46px",
              backgroundColor: "#ffffff",
              color: "#1f2937",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            🔄 Change Password
          </button>
        </div>

        <div className="profile-details-box" style={detailsContainerStyle}>
          <h3 style={titleStyle}>
            <span style={{ fontSize: "20px" }}>📋</span> Profile Information
          </h3>
          
          <div style={itemStyle}>
            <span style={labelStyle}>User Access ID</span>
            <span style={valueStyle}>{profile?.user_id || "Verifying Access..."}</span>
          </div>
          
          <div style={itemStyle}>
            <span style={labelStyle}>Mobile Number</span>
            <span style={valueStyle}>{profile?.mobile || "Not Provided"}</span>
          </div>
          
          <div style={itemStyle}>
            <span style={labelStyle}>Registered Business</span>
            <span style={valueStyle}>{profile?.business_name || "Not Provided"}</span>
          </div>
          
          <div style={itemStyle}>
            <span style={labelStyle}>Business Category</span>
            <span style={valueStyle}>{profile?.business_type || "Not Provided"}</span>
          </div>
          
          <div style={itemStyle}>
            <span style={labelStyle}>Operation Location</span>
            <span style={valueStyle}>{profile?.location || "Not Provided"}</span>
          </div>
        </div>

        {isOpen && (
          <div style={modalOverlayStyle} onClick={() => setIsOpen(false)}>
            <div style={modalBodyStyle} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#0f172a" }}>
                Edit Profile Details
              </h3>

              <label style={labelFormStyle}>Business Name</label>
              <input type="text" value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} style={inputStyle} />

              <label style={labelFormStyle}>Business Category</label>
              <input type="text" value={formData.business_type} onChange={(e) => setFormData({ ...formData, business_type: e.target.value })} style={inputStyle} />

              <label style={labelFormStyle}>Operation Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={inputStyle} />

              <label style={labelFormStyle}>Mobile Number</label>
              <input type="text" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} style={inputStyle} />

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button onClick={() => setIsOpen(false)} style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer" }}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isPasswordOpen && (
          <div style={modalOverlayStyle} onClick={() => setIsPasswordOpen(false)}>
            <div style={modalBodyStyle} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#0f172a" }}>
                Change Password
              </h3>

              <label style={labelFormStyle}>Old Password</label>
              <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} style={inputStyle} />

              <label style={labelFormStyle}>New Password</label>
              <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={inputStyle} />

              <label style={labelFormStyle}>Confirm Password</label>
              <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={inputStyle} />

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button onClick={() => setIsPasswordOpen(false)} style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleChangePassword} disabled={isPasswordSaving} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "#111827", color: "#fff", cursor: "pointer" }}>
                  {isPasswordSaving ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}