import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BASE_PRICE = 1000;
const TAXI_PRICE = 500;
const GUIDE_PRICE = 1000;

const BookingSummary = ({ checkIn, checkOut, numberOfMembers, totalPrice, taxAmount, form }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your booking details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold">Check-in:</p>
          <p>{checkIn}</p>
        </div>
        <div>
          <p className="font-semibold">Check-out:</p>
          <p>{checkOut}</p>
        </div>
        <div>
          <p className="font-semibold">Total length of stay:</p>
          <p>1 night</p>
        </div>
        <Separator />
        <div>
          <CardTitle className="text-lg mb-2">Your price summary</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base price:</span>
              <span>₹{BASE_PRICE * numberOfMembers}</span>
            </div>
            {form.watch('taxiRequired') && (
              <div className="flex justify-between">
                <span>Taxi service:</span>
                <span>₹{TAXI_PRICE}</span>
              </div>
            )}
            {form.watch('guideRequired') && (
              <div className="flex justify-between">
                <span>Guide service:</span>
                <span>₹{GUIDE_PRICE}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Taxes and fees:</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;