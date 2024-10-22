import React from 'react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const GuestForm = ({ index, form, currentStep }) => {
  // Calculate additional services cost
  const calculateServicesCost = (formValues) => {
    let total = 0;
    if (formValues?.guests?.[index]?.taxiService) {
      total += 2000;
    }
    if (formValues?.guests?.[index]?.guideService) {
      total += 2000;
    }
    return total;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Guest {index + 1} Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`guests.${index}.firstName`}
            rules={{ 
              required: "First name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Please enter a valid name"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`guests.${index}.lastName`}
            rules={{ 
              required: "Last name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Please enter a valid name"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`guests.${index}.email`}
            rules={{ 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`guests.${index}.phone`}
            rules={{ 
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Enter phone number" 
                    maxLength={10}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`guests.${index}.gender`}
            rules={{ required: "Please select a gender" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`guests.${index}.age`}
            rules={{ 
              required: "Age is required",
              min: {
                value: 0,
                message: "Age must be positive"
              },
              max: {
                value: 120,
                message: "Please enter a valid age"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter age" 
                    min="0"
                    max="120"
                    onChange={(e) => field.onChange(+e.target.value)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Services */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold mb-3 mt-4">Additional Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`guests.${index}.taxiService`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Taxi Service (₹2000)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`guests.${index}.guideService`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Guide Service (₹2000)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Display service cost */}
            <div className="mt-4 text-right">
              <p className="text-sm text-gray-600">
                Additional Services Cost: ₹{calculateServicesCost(form.getValues())}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestForm;