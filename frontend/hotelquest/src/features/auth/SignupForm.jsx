import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormField from './FormField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignUpForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
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
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      tc: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!formData.tc) {
      toast.error('You must agree to the terms and conditions.', {
        position: "top-left",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }
  
    const payload = {
      ...formData,
      role,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', payload);
  
      if (response.data.status === 'success') {
        // Handle successful registration
        toast.success('Registration successful!', {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
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
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-left",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };
  // ... rest of the component remains the same


  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup value={role} onValueChange={setRole}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer" id="customer" />
              <Label htmlFor="customer">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hotel" id="hotel" />
              <Label htmlFor="hotel">Hotel</Label>
            </div>
          </RadioGroup>
        </div>
        <FormField label="Name" id="name" required value={formData.name} onChange={handleChange} />
        <FormField label="Email" id="email" type="email" required value={formData.email} onChange={handleChange} />
        <FormField label="Password" id="password" type="password" required value={formData.password} onChange={handleChange} />
        <FormField label="Confirm Password" id="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange} />

        {role === 'customer' && (
          <>
            <FormField label="Phone Number" id="phone_no" type="tel" required value={formData.phone_no} onChange={handleChange} />
            <FormField label="Address" id="address" required value={formData.address} onChange={handleChange} />
          </>
        )}
        {role === 'hotel' && (
          <>
            <FormField label="Description" id="description" value={formData.description} onChange={handleChange} />
            <FormField label="Address" id="address" required value={formData.address} onChange={handleChange} />
          </>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="tc" 
            checked={formData.tc}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="tc" className="text-sm">
            I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
          </Label>
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </>
  );
}