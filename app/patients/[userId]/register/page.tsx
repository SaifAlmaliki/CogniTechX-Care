// This file represents the registration page for a patient.
// It retrieves user data based on the user ID from the URL and displays a registration form.

import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

// Define the Register component, which is an async function that takes SearchParamProps as an argument
const Register = async ({ params: { userId } }: SearchParamProps) => {
  // Retrieve user data based on the user ID from the URL
  const user = await getUser(userId);

  // Retrieve patient data based on the user ID from the URL
  const patient = await getPatient(userId);

  // If patient data is found, redirect to the new appointment page
  if (patient) redirect(`/patients/${userId}/new-appointment`);

  // Return the JSX content for the registration page
  return (
    // Use a container div with a flex layout to wrap the content
    <div className="flex h-screen max-h-screen">
      {/* Use a section element with a container class to wrap the main content */}
      <section className="remove-scrollbar container">
        {/* Use a div with a sub-container class to wrap the main content */}
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          {/* Display the logo image */}
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* Render the registration form, passing user data as props */}
          <RegisterForm user={user} />

          <p className="copyright py-12">© 2025 CarePluse</p>
        </div>
      </section>

      {/* Display a side image */}
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

// Export the Register component as the default export
export default Register;
