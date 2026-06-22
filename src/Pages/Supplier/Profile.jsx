import React, { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { useInventory } from "../../Context/Inventorycontext"; 
import { supplierService } from "../../Services/supplierService"; 
import { toast } from "react-toastify";
import profileIconImage from "../../Assests/Profileicon Image.jpg";

export default function Profile() {
  const { profile, refreshDashboardData } = useInventory();

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (e) => {
    if (e) e.stopPropagation();
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const response = await supplierService.updateProfileDetails(formData);

      if (response.status || response) {
        toast.success("Profile credentials updated successfully.");
        setIsOpen(false);

        if (refreshDashboardData) {
          await refreshDashboardData();
        }
      }
    } catch (err) {
      console.error("Failed to sync profile changes:", err);
      toast.error("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsPasswordSaving(true);

    try {
      const response = await supplierService.updatePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });

      if (response.status || response) {
        toast.success("Password updated successfully.");
        setIsPasswordOpen(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Password modification process fault:", err);
      toast.error(
        err.response?.data?.detail || "Failed to change password."
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const headerWrapperStyle = {
    fontFamily: "'Inter', sans-serif",
    marginBottom: "32px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "16px",
    textAlign: "left",
  };

  const mainHeadingStyle = {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em",
  };

  const subHeadingStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "400",
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  };

  const leftActionPanelStyle = {
    display: "flex",
    flexDirection: "column",
    height: "fit-content",
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
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #1f2937",
    boxSizing: "border-box",
    width: "100%",
  };

  const profileImageStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid rgba(255, 255, 255, 0.2)",
    objectFit: "cover",
    marginBottom: "16px",
    backgroundColor: "#1f2937",
  };

  const darkCardTitleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: "1.3",
  };

  const darkCardSubtitleStyle = {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#9ca3af",
    fontWeight: "500",
  };

  const detailsContainerStyle = {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: "0 0 24px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
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
    textAlign: "left",
  };

  const labelStyle = {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const valueStyle = {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "600",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalBodyStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    width: "440px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
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
    marginBottom: "16px",
  };

  const btnFlexStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  };

  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>My Profile</h2>
        <p style={subHeadingStyle}>
          Manage your supplier profile credentials and business location
          information.
        </p>
      </div>

      <div style={gridContainerStyle}>
        <div style={leftActionPanelStyle}>
          <div style={darkCardBoxStyle}>
            <img
              src={profileIconImage}
              alt="Supplier Avatar"
              style={profileImageStyle}
            />
            <h3 style={darkCardTitleStyle}>
              {profile?.business_name || "Loading..."}
            </h3>
            <p style={darkCardSubtitleStyle}>
              ID: {profile?.user_id || "Checking ID..."}
            </p>
          </div>

          <button
            onClick={handleEdit}
            style={{
              width: "100%",
              height: "44px",
              marginTop: "16px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Edit Profile Credentials
          </button>

          <button
            onClick={() => setIsPasswordOpen(true)}
            style={{
              width: "100%",
              height: "44px",
              marginTop: "14px",
              backgroundColor: "#ffffff",
              color: "#1f2937",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Change Security Password
          </button>
        </div>

        <div style={detailsContainerStyle}>
          <h3 style={titleStyle}>Business Specifications</h3>

          <div style={itemStyle}>
            <span style={labelStyle}>Business Name</span>
            <span style={valueStyle}>{profile?.business_name || "—"}</span>
          </div>

          <div style={itemStyle}>
            <span style={labelStyle}>Business Type</span>
            <span style={valueStyle}>{profile?.business_type || "—"}</span>
          </div>

          <div style={itemStyle}>
            <span style={labelStyle}>Location / Address</span>
            <span style={valueStyle}>{profile?.location || "—"}</span>
          </div>

          <div style={itemStyle}>
            <span style={labelStyle}>Mobile Number</span>
            <span style={valueStyle}>{profile?.mobile || "—"}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBodyStyle}>
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Update Credentials
            </h3>

            <form onSubmit={handleSave}>
              <label style={labelStyle}>Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Business Type</label>
              <input
                type="text"
                name="business_type"
                value={formData.business_type}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <div style={btnFlexStyle}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBodyStyle}>
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Change Password
            </h3>

            <form onSubmit={handleChangePassword}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                required
              />

              <div style={btnFlexStyle}>
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPasswordSaving}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {isPasswordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}