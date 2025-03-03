import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import Cookies from "js-cookie";

export default function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/user/login", formData);
      
      if (response.data.status === "success") {
        // Store JWT token in cookies
        Cookies.set('jwt_token', response.data.token, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'  
        });
        
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
        
        // Call login function to set authenticated state
        login(response.data.token);
        
        // Redirect to appropriate page based on user role
        const userRole = response.data.user?.role || 'customer';
        navigate(userRole === 'hotel' ? '/hotel-dashboard' : '/dashboard');
      } else {
        setError(response.data.message || "Login failed, please check your credentials");
        toast.error(`Login failed: ${response.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
      
      toast.error(error.response?.data?.message || "An error occurred during login", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToastContainer />
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full"
              autoComplete="email"
              required
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/forgot-password');
                }}
              >
                Forgot Password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full"
              autoComplete="current-password"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              navigate('/signup');
            }}
          >
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
