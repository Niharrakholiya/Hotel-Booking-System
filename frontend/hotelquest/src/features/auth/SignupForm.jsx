import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignUpForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_no: '',
    address: '',
    description: '',
    tc: false,
  });

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? !prev[id] : value,
    }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      tc: checked,
    }));
    
    if (errors.tc) {
      setErrors(prev => ({ ...prev, tc: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    // Role-specific validations
    if (role === 'customer' && !formData.phone_no) {
      newErrors.phone_no = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Terms and conditions
    if (!formData.tc) {
      newErrors.tc = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form', {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }
    
    setLoading(true);
    
    const payload = {
      ...formData,
      role,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', payload);
  
      if (response.data.status === 'success') {
        toast.success('Registration successful!', {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });

        // Set the JWT token and update authentication state
        if (response.data.token) {
          login(response.data.token);
          
          // Redirect based on role and profile completion
          if (role === 'hotel' && !response.data.profileCompleted) {
            navigate('/complete-profile');
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error('No token received from server');
        }
      } else {
        toast.error(`Registration failed: ${response.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (label, id, type = "text", required = false) => {
    return (
      <div className="space-y-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {type === 'textarea' ? (
          <Textarea
            id={id}
            value={formData[id]}
            onChange={handleChange}
            className={`w-full ${errors[id] ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder={`Enter your ${label.toLowerCase()}`}
            rows={4}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={formData[id]}
            onChange={handleChange}
            className={`w-full ${errors[id] ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        )}
        {errors[id] && (
          <p className="text-sm text-red-500 mt-1">{errors[id]}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToastContainer />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Account Type <span className="text-red-500">*</span>
            </Label>
            
            {/* Custom styled role selector that looks like toggle buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`flex items-center justify-center p-3 rounded-md cursor-pointer border-2 transition-all ${
                  role === 'customer' 
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleRoleChange('customer')}
              >
                Customer
              </div>
              <div 
                className={`flex items-center justify-center p-3 rounded-md cursor-pointer border-2 transition-all ${
                  role === 'hotel' 
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleRoleChange('hotel')}
              >
                Hotel
              </div>
            </div>
          </div>

          {renderFormField("Name", "name", "text", true)}
          {renderFormField("Email", "email", "email", true)}
          {renderFormField("Password", "password", "password", true)}
          {renderFormField("Confirm Password", "password_confirmation", "password", true)}

          {role === 'customer' && renderFormField("Phone Number", "phone_no", "tel", true)}
          {renderFormField("Address", "address", "text", true)}
          {role === 'hotel' && renderFormField("Description", "description", "textarea")}

          {/* Terms and Conditions checkbox with clickable checkbox */}
<div className="mt-6">
  <div className={`flex items-center p-3 border rounded-md ${errors.tc ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
    <div className="flex-shrink-0 mr-3 relative">
      {/* Custom styled checkbox appearance */}
      <div 
        className={`w-5 h-5 flex items-center justify-center rounded border ${formData.tc ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
        onClick={() => handleCheckboxChange(!formData.tc)}
      >
        {formData.tc && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
      {/* Real checkbox that's accessible but visually hidden */}
      <Checkbox 
        id="tc" 
        checked={formData.tc}
        onCheckedChange={handleCheckboxChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-5 h-5 z-10"
      />
    </div>
    <Label 
      htmlFor="tc" 
      className="cursor-pointer text-sm font-medium"
    >
      I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
    </Label>
  </div>
  {errors.tc && (
    <p className="text-sm text-red-500 mt-1">{errors.tc}</p>
  )}
</div>
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a 
            href="/login" 
            className="text-blue-600 hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}