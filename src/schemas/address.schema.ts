import { z } from "zod";

export const customerAddressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State or province is required"),
  postalCode: z.string().min(2, "Postal/ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});

export type CustomerAddressFormData = z.infer<typeof customerAddressSchema>;
