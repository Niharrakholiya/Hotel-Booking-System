import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const TAXI_PRICE = 500;
const GUIDE_PRICE = 1000;

const AdditionalServices = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Services</h3>
      <FormField
        control={form.control}
        name="taxiRequired"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Taxi Transportation
              </FormLabel>
              <FormDescription>
                Add taxi service for an additional ₹{TAXI_PRICE}
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guideRequired"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Guide Service
              </FormLabel>
              <FormDescription>
                Add a guide for an additional ₹{GUIDE_PRICE}
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalServices;