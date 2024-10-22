import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import GuestForm from './GuestForm';
import AdditionalServices from './AdditionalServices';
import BookingSummary from './BookingSummary';

// ... (keep the schema definitions and constant values here)
const memberSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
    gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
    age: z.number().int().min(0, { message: "Age must be a positive number." }).max(120, { message: "Age must be less than 120." }),
  });

const bookingSchema = z.object({
    members: z.array(memberSchema),
    taxiRequired: z.boolean().optional(),
    guideRequired: z.boolean().optional(),
  });
  
const BookingForm = ({ numberOfMembers = 2, checkIn, checkOut }) => {
    // Define your constants here
    const BASE_PRICE = 100; // Set your actual base price
    const TAXI_PRICE = 20; // Set your actual taxi price
    const GUIDE_PRICE = 50; // Set your actual guide price
    const TAX_RATE = 0.1; // Set your actual tax rate (e.g., 10%)
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      members: Array(numberOfMembers).fill({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
      }),
      taxiRequired: false,
      guideRequired: false,
    },
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "members"
  });

const calculateTotalPrice = (data) => {
    const basePrice = data.members.length * BASE_PRICE;
    const taxiPrice = data.taxiRequired ? TAXI_PRICE : 0;
    const guidePrice = data.guideRequired ? GUIDE_PRICE : 0;
    const subtotal = basePrice + taxiPrice + guidePrice;
    const tax = subtotal * TAX_RATE;
    setTaxAmount(tax);
    return subtotal + tax;
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      setTotalPrice(calculateTotalPrice(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data) => {
    console.log(data, totalPrice);
    // Here you would typically send this data to your backend
  };

  const nextStep = async () => {
    const isValid = await form.trigger(`members.${currentStep}`);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, numberOfMembers));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Card className="w-full lg:w-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Booking Details</CardTitle>
          <CardDescription>Please provide details for your booking</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Progress value={(currentStep / (numberOfMembers + 1)) * 100} className="w-full" />
              
              <Tabs value={`guest-${currentStep}`} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  {fields.map((field, index) => (
                    <TabsTrigger
                      key={field.id}
                      value={`guest-${index}`}
                      disabled={currentStep !== index}
                      className="relative"
                    >
                      Guest {index + 1}
                      {form.formState.errors.members?.[index] && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2">
                          <AlertCircle className="h-3 w-3" />
                        </Badge>
                      )}
                      {!form.formState.errors.members?.[index] && form.getValues(`members.${index}.firstName`) && (
                        <Badge variant="secondary" className="absolute -top-2 -right-2">
                          <CheckCircle2 className="h-3 w-3" />
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {fields.map((field, index) => (
                  <GuestForm key={field.id} index={index} form={form} currentStep={currentStep} />
                ))}
              </Tabs>

              {currentStep === numberOfMembers && (
                <AdditionalServices form={form} />
              )}

              <div className="flex justify-between">
                {currentStep > 0 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    Previous
                  </Button>
                )}
                {currentStep < numberOfMembers && (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                )}
                {currentStep === numberOfMembers && (
                  <Button type="submit">
                    Complete Booking
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-full lg:w-1/3">
        <BookingSummary 
          checkIn={checkIn} 
          checkOut={checkOut} 
          numberOfMembers={numberOfMembers}
          totalPrice={totalPrice}
          taxAmount={taxAmount}
          form={form}
        />
      </div>
    </div>
  );
};

export default BookingForm;