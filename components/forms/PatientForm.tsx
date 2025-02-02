// PatientForm.tsx
// This component is responsible for rendering the patient registration form.
// It integrates with React Hook Form for form management and Zod for validation.

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

// This component handles the patient registration form submission
export const PatientForm = () => {
  // Get the router instance to navigate to other pages
  const router = useRouter();

  // State to track the form submission status
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<z.infer<typeof UserFormValidation>>({
    // Use Zod resolver for validation
    resolver: zodResolver(UserFormValidation),
    // Set default form values
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    // Set the form submission status to loading
    setIsLoading(true);

    try {
      // Create a new user object from the form values
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      // Create a new user using the createUser action
      const newUser = await createUser(user);

      // If the user is created successfully, navigate to the registration page
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      // Log any errors that occur during form submission
      console.log(error);
    }

    // Set the form submission status to not loading
    setIsLoading(false);
  };

  return (
    // Render the form using React Hook Form
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        {/* Render custom form fields */}
        <CustomFormField
          // Render a text input field for the user's name
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          // Render a text input field for the user's email
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          // Render a phone input field for the user's phone number
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        {/* Render the submit button */}
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
