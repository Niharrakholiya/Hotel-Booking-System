// LoginForm.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormField from "./FormField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import Cookies from "js-cookie";

export default function LoginForm() {
    const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", formData);
      console.log("Login response:", response.data);
  
      if (response.data.status === "success") {
        // Store JWT token in cookies
        Cookies.set('jwt_token', response.data.token, { expires: 7 }); // Expires in 7 days
  
        toast.success("Login successful!", {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
  
        navigate("/");
  
        // Call login function to set authenticated state
        login(response.data.token);
      } else {
        toast.error(`Login failed: ${response.data.message}`, {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.", {
        position: "top-left",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Password"
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </>
  );
}
