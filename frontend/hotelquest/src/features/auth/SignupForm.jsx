import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormField from './FormField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpForm() {
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
  
    console.log('Payload before sending:', JSON.stringify(payload)); // Log the payload
  
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', payload);
  

      console.log('Server response:', response.data); // Log server response

      if (response.data.status === 'success') {
        toast.success('Registration successful!', {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
        // Redirect or perform other actions
      } else {
        toast.error(`Registration failed: ${response.data.message}`, {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error during registration:', error); // Log any errors
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`, {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
      }
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
