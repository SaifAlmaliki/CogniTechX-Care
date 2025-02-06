// File Overview:
// This file defines the RequestSuccess component, which is responsible for rendering the success page after an appointment request is submitted.
// It displays the appointment details and a success message to the user.

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

/**
 * RequestSuccess component
 *
 * This component is responsible for rendering the success page after an appointment request is submitted.
 * It displays the appointment details and a success message to the user.
 *
 * @param {SearchParamProps} props - The component props
 * @param {string} props.searchParams.appointmentId - The appointment ID
 * @param {string} props.params.userId - The user ID
 * @returns {JSX.Element} The success page component
 */
const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  // Extract appointmentId from search parameters
  const appointmentId = (searchParams?.appointmentId as string) || "";

  // Fetch the appointment details using the appointmentId
  const appointment = await getAppointment(appointmentId);

  // Find the doctor associated with the appointment
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    // Container element for the success page
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        {/* Logo link to homepage */}
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        {/* Success message section */}
        <section className="flex flex-col items-center">
          {/* Success GIF */}
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          {/* Success message */}
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          {/* Confirmation message */}
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        {/* Appointment details section */}
        <section className="request-details">
          {/* Appointment details header */}
          <p>Requested appointment details: </p>
          {/* Doctor information */}
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          {/* Appointment schedule */}
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        {/* New appointment button */}
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        {/* Copyright information */}
        <p className="copyright"> 2025 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
