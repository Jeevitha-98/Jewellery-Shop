//import "./App.css";
//import Parent from "./Parent";
//import Map from "./Component/Map"
//import Studentcard from "./Studentcard";
//import RegistrationForm from "./Component/Registration form";
//import Stopwatch from "./Component/Stopwatch";
//import API from "./Component/API";
//import Minichatapp from "./Component/Minichatapp";
// import React, { useState } from "react";
//import { ThemeContext } from "./Component/ThemeContext";
//import Profile from "./Component/Profile";





/*export default function App() {
  const students=[
{id: "EHC001", name:"Jeevitha", Course:"Data Analytics", isActive:true},
{id: "EHC002", name:"Gokul", Course:"Back-End Developer", isActive:true},
{id: "EHC003", name:"Deepu", Course:"Front-End Developer", isActive:false},
{id: "EHC004", name:"Akash", Course:"Software Tester", isActive:true},
{id: "EHC005", name:"Kannan", Course:"Software Engineer", isActive:false},
  ];
  
  return (
    <div className="container">
      <h1>🎓 Student Dashboard</h1>
      <p className="count">Total Students: {students.length}</p>

      <div className="card-container">
        {students.map((student) => (
          <Studentcard key={student.id} student={student} />
        ))}
    
    </div>
    </div>
  );
}*/
/*
export default function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

const appStyle = {
  textAlign: "center",
  padding: "40px 20px",
  minHeight: "100vh",
  transition: "0.3s",
  background:
    theme === "light"
      ? "linear-gradient(to right, #e3f2fd, #fce4ec)"
      : "linear-gradient(to right, #1e1e2f, #121212)",
  color: theme === "light" ? "#000" : "#faf5f5",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "28px",
  marginBottom: "20px",
  color: theme === "light" ? "#d32f2f" : "#ff6b6b", 
};

const buttonStyle = {
  padding: "10px 20px",
  marginBottom: "50px",
  border: "none",
  background: "linear-gradient(45deg, #4caf50, #2e7d32)",
  color: theme === "light" ? "#fff" : "#fff",
  borderRadius: "25px",
  cursor: "pointer",
};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={appStyle}>
        <h1 style={{ color: theme === "light" ? "red" : "#ff6b6b" }}>
          Profile Upload & Theme Change</h1>

        <button onClick={toggleTheme} style={buttonStyle}>
          Toggle Theme
        </button>

        <Profile />
      </div>
    </ThemeContext.Provider>
  );
}
  */


//import UseReducerForm from "./Component/UseReducerForm";
//import XOGame from "./Component/XOGame";*/



/*
import React from "react";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";



const Home = () => <h2 style={styles.text}>🏠 Welcome to Home Page</h2>;
const About = () => <h2 style={styles.text}>ℹ️ About Us Page</h2>;
const Contact = () => <h2 style={styles.text}>📞 Contact Page</h2>;
const Profile = () => <h2 style={styles.text}>👤 User Profile Page</h2>;


const Services = () => {
  return (
    <div>
      <h2 style={styles.sectionTitle}>🛠 Services</h2>

      <div style={styles.subNav}>
        <Link to="web" style={styles.subLink}>Web</Link>
        <Link to="app" style={styles.subLink}>App</Link>
        <Link to="uiux" style={styles.subLink}>UI/UX</Link>
      </div>

      <Outlet />
    </div>
  );
};

const Web = () => <h3 style={styles.text}>🌐 Web Development</h3>;
const AppDev = () => <h3 style={styles.text}>📱 App Development</h3>;
const UIUX = () => <h3 style={styles.text}>🎨 UI/UX Design</h3>;



export default function App() {
  return (
    <Router>
      <div style={styles.container}>
        
       
        <h1 style={styles.title}>React Routing Task</h1>

       
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/services" style={styles.link}>Services</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
        </nav>

        <div style={styles.card}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            <Route path="/services" element={<Services />}>
              <Route index element={<h3 style={styles.text}>Select a service 👇</h3>} />
              <Route path="web" element={<Web />} />
              <Route path="app" element={<AppDev />} />
              <Route path="uiux" element={<UIUX />} />
            </Route>

            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}



const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    color: "#fff",
    marginBottom: "25px",
    fontSize: "32px",
    fontWeight: "bold",
  },

  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  link: {
    textDecoration: "none",
    padding: "10px 18px",
    background: "#ffffff",
    color: "#333",
    borderRadius: "25px",
    fontWeight: "600",
    transition: "0.3s",
  },

  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "700px",
    margin: "auto",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  text: {
    color: "#333",
  },

  sectionTitle: {
    marginBottom: "15px",
    color: "#444",
  },

  subNav: {
    marginBottom: "15px",
  },

  subLink: {
    margin: "0 10px",
    padding: "6px 12px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "15px",
    textDecoration: "none",
    fontSize: "14px",
  },
};
*/

/*import React, { useEffect, useState } from "react";


function UserDetails({ user }) {
  return (
    <div>
      <h2>User Details</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Website:</b> {user.website}</p>

      <h3>Address</h3>
      <p>{user.address.street}</p>
      <p>{user.address.suite}</p>
      <p>{user.address.city}</p>
      <p>{user.address.zipcode}</p>
    </div>
  );
}


export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
    
      <div style={styles.list}>
        <h2>Users</h2>
        {users.map((user) => (
          <p
            key={user.id}
            style={styles.userItem}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </p>
        ))}
      </div>

    
      <div style={styles.details}>
        {selectedUser ? (
          <UserDetails user={selectedUser} />
        ) : (
          <p>Select a user to see details</p>
        )}
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    gap: "30px",
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Arial",
  },

  list: {
    width: "35%",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  },

  userItem: {
    padding: "12px",
    borderBottom: "1px solid #334155",
    cursor: "pointer",
    transition: "0.3s",
  },

  userItemHover: {
    background: "#334155",
  },

  activeUser: {
    background: "#2563eb",
    borderRadius: "8px",
  },

  details: {
    width: "65%",
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  },
};*/

/*import React, { useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = form;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, form]);
    }

    setForm({ name: "", email: "" });
  };

  const handleEdit = (index) => {
    setForm(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredUsers = users.filter((_, i) => i !== index);
    setUsers(filteredUsers);

    if (editIndex === index) {
      setForm({ name: "", email: "" });
      setEditIndex(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>CRUD Operations Table</h1>

      
      <div style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.noData}>
                No Data Available
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={index}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(index)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(index)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },

  form: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    width: "200px",
  },

  button: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1e293b",
  },

  th: {
    padding: "14px",
    borderBottom: "2px solid #334155",
    textAlign: "center", 
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #334155",
    textAlign: "center", 
  },

  editBtn: {
    marginRight: "8px",
    padding: "6px 12px",
    background: "#22c55e",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};*/

/*import React, { useReducer, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import About from "./Component/About"; 
import Services from "./Component/Services";
import Contact from "./Component/Contact";
import Profile1 from "./Component/Profile1"; 

/* ================= CONTEXT ================= */
/*export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
};

/* ================= HEADER ================= */
/*const Header = () => (
  <header style={styles.header}>
    <h2 style={{ color: "#fff", margin: 0 }}>YazhBakes</h2>
    <nav style={styles.nav}>
      <Link style={styles.link} to="/">Home</Link>
      <Link style={styles.link} to="/about">About</Link>
      <Link style={styles.link} to="/services">Services</Link>
      <Link style={styles.link} to="/contact">Contact</Link>
      <Link style={styles.link} to="/profile">Profile</Link>
    </nav>
  </header>
);

/* ================= HOME ================= */
/*const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const handleOrder = () => {
    dispatch({ type: "INCREMENT" });
    navigate("/profile");
  };

  return (
    <div>
      {/* BANNER */
      /*<div style={styles.banner}>
        <div style={styles.overlay}></div>
        <h1 style={styles.bannerText}>Welcome to YazhBakes 🍰</h1>
        <p style={styles.bannerSub}>
          Freshly baked happiness delivered daily with love and care.  
          Experience premium taste crafted with quality ingredients.  
          Every bite is designed to create sweet memories.  
          Your celebration starts with our creations.
        </p>
        <button style={styles.orderBtn} onClick={handleOrder}>
          Order Now
        </button>
      </div>

      {/* SERVICES */
      /*<div style={styles.container}>
        <h2>Our Services</h2>
        <p style={styles.subText}>
          We provide a wide range of bakery services tailored for every occasion.  
          From small celebrations to grand events, we handle everything.  
          Our team ensures quality, taste, and creative presentation.  
          Customer satisfaction is always our top priority.
        </p>

        <div style={styles.cardContainer}>
          {["Custom Cakes","Wedding Cakes","Cupcakes","Cookies","Party Orders","Delivery"].map((s, i) => (
            <div key={i} style={styles.serviceCard}>
              <h3 style={{ marginBottom: "10px" }}>{s}</h3>
              <div style={styles.cardContent}>
                <p>High quality ingredients used.</p>
                <p>Creative and unique designs.</p>
                <p>Perfect for every occasion.</p>
                <p>Customer satisfaction guaranteed.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHO WE ARE */
      /*<div style={styles.aboutSection}>
        <div style={styles.aboutText}>
          <h2>Who We Are</h2>
          <p>
            YazhBakes is built on passion, creativity, and love for baking.  
            We believe every celebration deserves something special and sweet.  
            Our team focuses on quality ingredients and unique designs.  
            We aim to deliver happiness through every bite we create.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
          style={styles.aboutImg}
        />
      </div>

      {/* TESTIMONIALS */
     /* <div style={styles.testimonialSection}>
        <h2 style={{ marginBottom: "25px" }}>Testimonials</h2>

        <div style={styles.testimonialWrapper}>
          <div className="scrollTrack" style={styles.testimonialTrack}>
            {[
              ["Amazing taste and design!", "Priya"],
              ["Best bakery service!", "Arun"],
              ["Loved every bite!", "Meena"],
              ["Highly recommended!", "Karthik"]
            ].map((t, i) => (
              <div key={i} style={styles.testimonialCard}>
                <p>"{t[0]}"</p>
                <h4>- {t[1]}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



/* ================= FOOTER ================= */
/*const Footer = () => (
  <footer style={styles.footer}>
    <h3>YazhBakes</h3>
    <p>Delivering happiness through baking.</p>
    <div style={styles.iconRow}>
      <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" style={styles.icon}/>
      <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook.png" style={styles.icon}/>
      <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" style={styles.icon}/>
    </div>
    <p>📍 Coimbatore | 📞 9876543210 | 📧 yazhbakes@gmail.com</p>
     <p style={{ marginTop: "10px", fontSize: "14px", opacity: 0.7 }}>
    © {new Date().getFullYear()} YazhBakes. All Rights Reserved.
  </p>
  </footer>
);*/

/* ================= APP ================= */
/*const App = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Header />

        <div style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About styles={styles} />} /> 
            <Route path="/services" element={<Services styles={styles} />} /> 
            <Route path="/contact" element={<Contact styles={styles} />} />
            <Route path="/profile" element={<Profile1 styles={styles} />} />
          </Routes>
        </div>

        <Footer />
      </Router>

      <style>
        {`
        .scrollTrack {
          display: flex;
          animation: scrollLeft 12s linear infinite;
        }
        .scrollTrack:hover {
          animation-play-state: paused;
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        `}
      </style>
    </AppContext.Provider>
  );
};
*/

/* ================= STYLES ================= */
/*const styles = {
  body: {
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
},

  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "#222",
    zIndex: 1000,
    boxSizing: "border-box"
  },

  nav: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  },

  link: {
    color: "#fff",
    marginLeft: "15px",
    textDecoration: "none",
    whiteSpace: "nowrap"
  },

  banner: {
    height: "320px",
    background: "url('https://images.unsplash.com/photo-1551024601-bec78aea704b') center/cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    position: "relative"
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)"
  },

  bannerText: { color: "#fff", zIndex: 1 },

  bannerSub: {
    color: "#fff",
    zIndex: 1,
    maxWidth: "600px",
    textAlign: "center"
  },

  orderBtn: {
    zIndex: 1,
    padding: "12px 25px",
    background: "#ff4d6d",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  container: { padding: "40px", textAlign: "center" },

  subText: { maxWidth: "700px", margin: "10px auto 30px" },

  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "25px"
  },

  serviceCard: {
    background: "#333",
    color: "#fff",
    padding: "20px",
    width: "250px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "230px",
    textAlign: "center"
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },

  aboutSection: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "40px",
    flexWrap: "wrap"
  },

  aboutText: { maxWidth: "500px" },

  aboutImg: { width: "300px", borderRadius: "10px" },

  testimonialSection: {
    background: "#111",
    color: "#fff",
    padding: "40px",
    textAlign: "center"
  },

  testimonialWrapper: { overflow: "hidden" },

  testimonialTrack: { display: "flex", gap: "20px" },

  testimonialCard: {
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "50px",
    minWidth: "250px"
  },

  footer: {
    background: "#111",
    color: "#fff",
    padding: "30px",
    textAlign: "center"
  },

  iconRow: {
    margin: "15px 0"
  },

  icon: {
    width: "30px",
    margin: "0 10px",
    cursor: "pointer"
  },

  button: {
    padding: "10px",
    margin: "5px",
    background: "#333",
    color: "#fff"
  },

 
  sectionBox: {
    background: "#222",
    color: "#fff",
    padding: "25px",
    borderRadius: "10px",
    margin: "20px auto",
    maxWidth: "900px",
    textAlign: "left"
  },

  flexRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px"
  },

  infoCard: {
    background: "#333",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px"
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "1.8"
  },

  timeline: {
    paddingLeft: "20px",
    lineHeight: "1.8"
  }
};

export default App; */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InventoryProvider } from "./Context/Inventorycontext";
import { VendorProvider } from "./Context/Vendorcontext";

import Login from "./Dashboard/Login";

import SupplierLayout from "./Layout/SupplierLayout";
import DashboardHome from "./pages/Supplier/DashboardHome";
import StockList from "./pages/Supplier/StockList";
import AddProduct from "./pages/Supplier/AddProduct";
import Profile from "./pages/Supplier/Profile";
import VendorRequests from "./pages/Supplier/VendorRequest";

import VendorLayout from "./Layout/VendorLayout";
import VendorDashboardHome from "./pages/Vendor/DashboardHome";
import BrowseProducts from "./pages/Vendor/BrowseProducts";
import MyOrders from "./pages/Vendor/MyOrders";
import RequestProduct from "./pages/Vendor/productRequest";
import VendorProfile from "./pages/Vendor/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/supplier/dashboard/*" 
          element={
            <InventoryProvider>
              <SupplierLayout />
            </InventoryProvider>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="stock-list" element={<StockList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="profile" element={<Profile />} />
          <Route path="vendor-request" element={<VendorRequests />} />
          <Route path="vendor-requests" element={<VendorRequests />} />
        </Route>

        <Route 
          path="/vendor/dashboard/*" 
          element={
            <VendorProvider>
              <VendorLayout />
            </VendorProvider>
          }
        >
          <Route index element={<VendorDashboardHome />} />
          <Route path="browse-products" element={<BrowseProducts />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="request-product" element={<RequestProduct />} />
          <Route path="profile" element={<VendorProfile />} />
        </Route>

        <Route path="/pages/Supplier/DashboardHome" element={<Navigate to="/supplier/dashboard" replace />} />
        <Route path="/pages/Supplier/StockList" element={<Navigate to="/supplier/dashboard/stock-list" replace />} />
        <Route path="/pages/Supplier/AddProduct" element={<Navigate to="/supplier/dashboard/add-product" replace />} />
        <Route path="/pages/Supplier/Profile" element={<Navigate to="/supplier/dashboard/profile" replace />} />
        <Route path="/pages/Supplier/VendorRequest" element={<Navigate to="/supplier/dashboard/vendor-requests" replace />} />

        <Route path="/pages/Vendor/DashboardHome" element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="/pages/Vendor/BrowseProducts" element={<Navigate to="/vendor/dashboard/browse-products" replace />} />
        <Route path="/pages/Vendor/MyOrders" element={<Navigate to="/vendor/dashboard/my-orders" replace />} />
        <Route path="/pages/Vendor/productRequest" element={<Navigate to="/vendor/dashboard/request-product" replace />} />
        <Route path="/pages/Vendor/Profile" element={<Navigate to="/vendor/dashboard/profile" replace />} />
       
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
