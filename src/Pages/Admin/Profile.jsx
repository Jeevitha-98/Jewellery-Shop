import React, { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdmin } from "../../Context/AdminContext";
import { toast } from "react-toastify";
import API from "../../Services/api";
import profileIconImage from "../../Assests/Profileicon Image.jpg";

export default function Profile() {
  // Extract custom state mutator functions directly from your unified admin container context
  const { profile, setProfile, refreshDashboardData } = useAdmin();

  const [formData, setFormData] = useState({
    business_name: "",
    mobile: "",
    location: "",
    business_type: ""
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

  const currentRole = (localStorage.getItem("role") || profile?.role || "admin").trim().toLowerCase();

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || profile.name || "",
        mobile: profile.mobile || "",
        location: profile.location || "",
        business_type: profile.business_type || ""
      });
    }
  }, [profile]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || profile.name || "",
        mobile: profile.mobile || "",
        location: profile.location || "",
        business_type: profile.business_type || ""
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.business_name || !formData.mobile) {
      toast.error("Business name and mobile number fields are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await API.put(`/admin/profile/update`, formData);

      // FIXED: Force immediate state sync into context memory fields so layout transforms trigger instantly
      if (response.data || response.status === 200) {
        if (setProfile) {
          setProfile((prev) => ({ ...prev, ...formData }));
        }

        toast.success("Account profile metrics saved to MySQL database!");
        setIsOpen(false);

        if (refreshDashboardData) {
          await refreshDashboardData();
        }
      }
    } catch (err) {
      console.error("Database sync rollback fault:", err);
      toast.error("Failed to commit profile updates down to SQL rows.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill out all credential verification fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New matching password configurations do not match.");
      return;
    }

    setIsPasswordSaving(true);

    try {
      const response = await API.put(`/admin/profile/password`, {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      });

      if (response.data || response.status === 200) {
        toast.success("Security credentials updated inside MySQL ledger successfully!");
        setIsPasswordOpen(false);

        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      console.error("Password modification process fault:", err);

      toast.error(
        err.response?.data?.detail ||
          "Verification failed: Incorrect current password."
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  let accentColor = "#3b82f6";
  let designationLabel = "Master Platform Administrator";
  let displayContextTitle = "Admin Profile";

  if (currentRole === "supplier") {
    accentColor = "#8b5cf6";
    designationLabel = "Verified Supply Chain Distributor";
    displayContextTitle = "Supplier Profile";
  } else if (currentRole === "vendor") {
    accentColor = "#10b981";
    designationLabel = "Registered Marketplace Merchant";
    displayContextTitle = "Vendor Profile";
  }

  return (
    <PageContainer>
      <style>{`
        .profile-header-wrapper {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          margin-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
          text-align: left;
        }

        .profile-main-heading {
          margin: 0 0 6px 0;
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .profile-sub-heading {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
        }

        .profile-grid-container {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: 32px;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .profile-left-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: fit-content;
        }

        .profile-dark-card {
          background-color: #111827;
          padding: 36px 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border: 1px solid #1f2937;
          box-sizing: border-box;
          width: 100%;
        }

        .profile-avatar-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.15);
          object-fit: cover;
          margin-bottom: 18px;
          background-color: #1f2937;
        }

        .profile-dark-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .profile-dark-subtitle {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
        }

        .profile-details-card {
          background: #ffffff;
          padding: 36px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
        }

        .profile-panel-title {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }

        .profile-info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          border-radius: 12px;
          background-color: #f8fafc;
          margin-bottom: 14px;
          border: 1px solid #f1f5f9;
          box-sizing: border-box;
          text-align: left;
        }

        .profile-info-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .profile-info-value {
          font-size: 15px;
          color: #0f172a;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .profile-grid-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 640px) {
          .profile-details-card {
            padding: 24px;
          }

          .profile-main-heading {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="profile-header-wrapper">
        <h2 className="profile-main-heading">{displayContextTitle}</h2>

        <p className="profile-sub-heading">
          View login registration parameters, change master credential strings,
          and modify your merchant file details.
        </p>
      </div>

      <div className="profile-grid-container">
        <div className="profile-left-panel">
          <div className="profile-dark-card">
            <img
              src={profileIconImage}
              alt="Account Avatar"
              className="profile-avatar-img"
            />

            <h3 className="profile-dark-title">
              {profile?.business_name || profile?.name || "Workspace Profile"}
            </h3>

            <p className="profile-dark-subtitle">
              ({profile?.user_id || "Verifying..."})
            </p>
          </div>

          <Button
            onClick={handleEdit}
            variant="primary"
            style={{
              width: "100%",
              height: "44px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "10px",
              backgroundColor: accentColor,
              borderColor: accentColor
            }}
          >
            Edit Profile Details
          </Button>

          <Button
            onClick={() => setIsPasswordOpen(true)}
            variant="secondary"
            style={{
              width: "100%",
              height: "44px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "10px",
              borderColor: "#cbd5e1",
              color: "#334155",
              background: "#ffffff"
            }}
          >
            🔄 Change Account Password
          </Button>
        </div>

        <div className="profile-details-card">
          <h3 className="profile-panel-title">
            📋 Active Directory Credentials
          </h3>

          <div className="profile-info-item">
            <span className="profile-info-label">
              User Access Token ID (Used at Login)
            </span>

            <span className="profile-info-value">
              {profile?.user_id || "Loading Registry ID..."}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Mobile Contact String
            </span>

            <span className="profile-info-value">
              {profile?.mobile || "Not Linked"}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Display Registered Company Name
            </span>

            <span className="profile-info-value">
              {profile?.business_name || profile?.name || "Not Set"}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Market Business Classification
            </span>

            <span className="profile-info-value">
              {profile?.business_type || "Merchant Hub Provider"}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Warehouse Operational Region
            </span>

            <span className="profile-info-value">
              {profile?.location || "Not Provided"}
            </span>
          </div>

          <div className="profile-info-item">
            <span
              className="profile-info-label"
            >
              Security Assignment Level
            </span>

            <span
              className="profile-info-value"
              style={{ color: accentColor }}
            >
              {designationLabel}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!isSaving) setIsOpen(false);
        }}
        title="Modify Corporate Registration Details"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "8px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <Input
            label="Display Registered Company Name"
            name="business_name"
            value={formData.business_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_name: e.target.value
              })
            }
          />

          <Input
            label="Mobile Contact String"
            name="mobile"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobile: e.target.value
              })
            }
          />

          <Input
            label="Business Classification Type"
            name="business_type"
            value={formData.business_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_type: e.target.value
              })
            }
          />

          <Input
            label="Warehouse Operational Region"
            name="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value
              })
            }
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "12px"
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                backgroundColor: accentColor,
                borderColor: accentColor
              }}
            >
              {isSaving ? "Syncing rows..." : "Save Modifications"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordOpen}
        onClose={() => {
          if (!isPasswordSaving) setIsPasswordOpen(false);
        }}
        title="Modify Account Password String"
      >
        <form
          onSubmit={handleChangePassword}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "8px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <Input
            label="Current Verification Password"
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                oldPassword: e.target.value
              })
            }
            required
          />

          <Input
            label="New Target Password String"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value
              })
            }
            required
          />

          <Input
            label="Confirm New Password Config"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value
              })
            }
            required
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "12px"
            }}
          >
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsPasswordOpen(false)}
              disabled={isPasswordSaving}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={isPasswordSaving}
              style={{
                backgroundColor: "#0f172a",
                borderColor: "#0f172a"
              }}
            >
              {isPasswordSaving
                ? "Hashing string..."
                : "Confirm Security Overwrites"}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}