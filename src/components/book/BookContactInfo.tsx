import { Button } from "@/components/ui/button";
import GradientTop from "@/assets/landing/book_circle_top.svg";
import GradientBottom from "@/assets/landing/book_circle_bottom.svg";
import Logo from "@/components/react-svg/logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import * as RPNInput from "react-phone-number-input";
import CancelationBar from "@/assets/book/cancelation_bar.svg";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Check, X } from "react-bootstrap-icons";
import Spinner from "@/components/web/Spinner";
import {
  postBooking
} from "@/utils/barberApi";
import { trackBookingCreated } from "@/utils/eventTracker";
import {
  BookingRequest,
  BookingResponse,
  CustomerRequest
} from "@/interfaces/BookingInterface";
import { BookingEventData } from "@/interfaces/EventInterface";
import { isValidPhoneNumber } from "react-phone-number-input";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import { checkPhoneExists } from "@/utils/authApi";

const BookContactInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("loading");
  const [isChecked, setIsChecked] = useState(false);
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const booking_origin = localStorage.getItem("booking_origin") || undefined;
  const [showLoginModal, setShowLoginModal] = useState(false);
  // const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

  const { isAuthenticated, user } = useAuth();

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === "meta") {
      if (parts[2] === "book") return `/meta/${route}`;
      else return `/meta/${parts[2]}/${route}`;
    } else {
      if (parts[1] === "book") return `/${route}`;
      else return `/${parts[1]}/${route}`;
    }
  };

  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  interface ContactInfo {
    monthName?: string;
    day?: number;
    dayName?: string;
    month?: number;
    time?: string;
  }

  const navigate = useNavigate();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const formSchema = z.object({
    given_name: z.string().min(1, { message: "Given name is required" }),
    family_name: z.string().min(1, { message: "Family name is required" }),
    email_address: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    phone_number: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    appointment_note: z.string().optional()
  });
  let bookedItems = [];
  let formattedDate = "";
  let dateObject: ContactInfo = {};

  try {
    const bookedItemsString = localStorage.getItem("bookedItems");
    if (bookedItemsString) {
      bookedItems = JSON.parse(bookedItemsString);
    }
  } catch (error) {
    console.error("Error parsing bookedItems from local storage:", error);
  }

  try {
    formattedDate = localStorage.getItem("formattedDate") || "";
  } catch (error) {
    console.error("Error retrieving formattedDate from local storage:", error);
  }

  try {
    const dateObjectString = localStorage.getItem("dateObject");
    if (dateObjectString) {
      dateObject = JSON.parse(dateObjectString);
    } else {
      dateObject = {};
    }
  } catch (error) {
    console.error("Error retrieving dateObject from local storage:", error);
    dateObject = {};
  }

  const selectedAppointmentString = localStorage.getItem("selectedAppointment");
  let appointmentEndTime = "";
  let cancelTime = "";
  let startPeriod = "";
  let selectedTime = "";

  if (selectedAppointmentString) {
    const [time, modifier] = selectedAppointmentString.split(" ");
    // eslint-disable-next-line prefer-const
    let [startHour, startMinute] = time.split(":").map(Number);
    startPeriod = modifier.toUpperCase();
    selectedTime = time;

    if (modifier === "pm" && startHour !== 12) {
      startHour += 12;
    } else if (modifier === "am" && startHour === 12) {
      startHour = 0;
    }

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const serviceDuration =
      bookedItems[0].item_data.variations[0].item_variation_data
        .service_duration;
    const endDate = new Date(startDate.getTime() + serviceDuration);

    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const formattedStartHour = startHour % 12 || 12;
    const formattedEndHour = endHour % 12 || 12;
    const endPeriod = endHour >= 12 ? "PM" : "AM";

    const formattedStartTime = `${formattedStartHour}:${startMinute
      .toString()
      .padStart(2, "0")}`;
    const formattedEndTime = `${formattedEndHour}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    appointmentEndTime = `${formattedStartTime} ${startPeriod} – ${formattedEndTime} ${endPeriod} GMT+10`;
    localStorage.setItem("thankYouTime", appointmentEndTime);
    const tempCancelTime = `${formattedStartTime} ${startPeriod}`;

    const adjustTime = (
      timeString: string,
      hoursToSubtract: number
    ): string => {
      const [time, modifier] = timeString.split(" ");
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }
      hours -= hoursToSubtract;
      if (hours < 0) {
        hours = 24 + hours;
      }
      const newModifier = hours >= 12 ? "PM" : "AM";
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${hours}:${formattedMinutes} ${newModifier}`;
    };
    cancelTime = adjustTime(tempCancelTime, 2);
  }
  const amount =
    bookedItems[0].item_data.variations[0].item_variation_data.price_money
      .amount;
  const formattedAmount = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(amount / 100);
  const amountInDollars = amount / 100;
  const twoPercent = amountInDollars * 0.02;
  const total = amountInDollars + twoPercent;

  const submitTrackEvent = async (
    valuesWithIdempotencyKey: CustomerRequest,
    bookingInfo: BookingResponse
  ) => {
    try {
      // Create rich booking event data
      const bookingEventData: BookingEventData = {
        // Booking information
        bookingId: bookingInfo.booking.id,
        amount: total,

        // Customer information
        customer: {
          id: bookingInfo.booking.customer_id,
          name: `${valuesWithIdempotencyKey.given_name} ${valuesWithIdempotencyKey.family_name}`,
          email: valuesWithIdempotencyKey.email_address,
          phone: valuesWithIdempotencyKey.phone_number,
          isNewCustomer: false // All authenticated users are existing customers
        },

        // Team member information
        teamMember: {
          id: bookingInfo.booking.appointment_segments[0].team_member_id,
          name: localStorage.getItem("barber_name") || "Team Member"
        },

        // Service information
        service: {
          name: bookedItems[0]?.item_data?.name || "Service",
          duration:
            bookingInfo.booking.appointment_segments[0].duration_minutes,
          price: amount
        },

        // Booking details
        startAt: bookingInfo.booking.start_at,
        createdAt: bookingInfo.booking.created_at,
        status: bookingInfo.booking.status,

        // Additional context
        customerNote: bookingInfo.booking.customer_note || "",
        source: booking_origin || "Organic"
      };

      // Track the booking event
      await trackBookingCreated(bookingEventData);
    } catch (error) {
      console.error("Error tracking booking event:", error);
    }
  };

  const submitContactForm = async (values: z.infer<typeof formSchema>) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // setShowAuthRequiredModal(true);
      handleSignIn();
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { appointment_note, ...restValues } = values;
    const valuesWithIdempotencyKey: CustomerRequest = {
      ...restValues,
      idempotency_key: uuidv4()
    };

    setIsLoading(true);
    setStatus("loading");
    try {
      const blockedEmails = ["achy.ac@gmail.com"];
      const blockedPhoneNumbers = ["402666885", "+61402666885"];
      const normalizedPhone = valuesWithIdempotencyKey.phone_number.replace(
        /^\+61/,
        ""
      );

      if (
        blockedEmails.includes(
          valuesWithIdempotencyKey.email_address.toLowerCase()
        ) ||
        blockedPhoneNumbers.includes(valuesWithIdempotencyKey.phone_number) ||
        blockedPhoneNumbers.includes(normalizedPhone)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("Booking failed due to blocked credentials");
      }

      let customerId;
      
      // Simple flow: authenticated users already have Square customer ID
      if (isAuthenticated && user) {
        customerId = user.id;
      } else {
        // This shouldn't happen since booking requires authentication
        throw new Error("Authentication required for booking");
      }
      
      if (!customerId) {
        throw new Error("Customer ID is missing from the response.");
      }

      // Store the Square customer ID for all users
      // This is needed for the thank you page analytics
      try {
        localStorage.setItem("customer_id", customerId);
      } catch (error) {
        console.error("Error storing customer ID:", error);
      }

      let appointment_segments;
      let location_id;
      let start_at;
      try {
        appointment_segments = JSON.parse(
          localStorage.getItem("appointmentSegment") || "[]"
        );
      } catch (error) {
        console.error(
          "Error parsing appointmentSegment from local storage:",
          error
        );
      }
      try {
        location_id = JSON.parse(localStorage.getItem("locationId") || "");
      } catch (error) {
        console.error("Error parsing locationId from local storage:", error);
      }
      try {
        start_at = localStorage.getItem("appointmentStartAt");
      } catch (error) {
        console.error(
          "Error parsing appointmentStartAt from local storage:",
          error
        );
      }
      const handlePurchase = () => {
        localStorage.setItem("purchase_value", total.toString());
        localStorage.setItem("new_customer", "false"); // Always false for authenticated users
        localStorage.setItem("booking_id", booking.booking.id);
        localStorage.setItem(
          "barber_id",
          booking.booking.appointment_segments[0].team_member_id
        );
      };
      // Build enhanced appointment note if booking for someone else
      let enhancedNote = values.appointment_note?.toString() || "";
      
      if (isAuthenticated && user) {
        // Helper to normalize phone numbers for comparison
        const normalizePhone = (phone: string) => {
          if (!phone) return '';
          // Remove spaces, dashes, parentheses, and normalize country code
          return phone.replace(/[\s\-()]/g, '').replace(/^\+61/, '0').replace(/^61/, '0');
        };
        
        // Check if the form data differs from the authenticated user's data
        const isBookingForSomeoneElse = 
          values.given_name !== user.firstName ||
          values.family_name !== user.lastName ||
          normalizePhone(values.phone_number) !== normalizePhone(user.phoneNumber) ||
          (values.email_address && values.email_address !== user.email);
          
        if (isBookingForSomeoneElse) {
          // Add the actual contact person's information to the notes
          const contactInfoParts = [
            `Booking for: ${values.given_name} ${values.family_name}`,
            `Phone: ${values.phone_number}`
          ];
          
          if (values.email_address) {
            contactInfoParts.push(`Email: ${values.email_address}`);
          }
          
          const contactInfo = contactInfoParts.join('\n');
          enhancedNote = enhancedNote 
            ? `${contactInfo}\nNote: ${enhancedNote}`
            : contactInfo;
        }
      }
      
      const bookingPayload: BookingRequest = {
        booking: {
          start_at: start_at,
          location_id: location_id,
          appointment_segments: appointment_segments,
          customer_id: customerId,
          customer_note: enhancedNote
        }
      };
      const booking: BookingResponse = await postBooking(
        bookingPayload,
        booking_origin || "Organic"
      );
      await submitTrackEvent(
        valuesWithIdempotencyKey,
        booking
      );
      handlePurchase();
      setStatus("succeeded");
      setTimeout(() => {
        setIsLoading(false);
        const thankYouPath = generateRoute("book/thank-you");
        navigate(thankYouPath);
      }, 1500);
    } catch (error) {
      setStatus("failed");
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      console.error("Error:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      given_name: "",
      family_name: "",
      email_address: "",
      phone_number: "+61" as RPNInput.Value,
      appointment_note: ""
    }
  });

  // Auto-fill form when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue("given_name", user.firstName || "");
      form.setValue("family_name", user.lastName || "");
      form.setValue("email_address", user.email || "");
      form.setValue("phone_number", user.phoneNumber || "");
    } else {
      // Load saved form data from localStorage for unauthenticated users
      const savedFormData = localStorage.getItem("booking_form_data");
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          form.setValue("given_name", parsedData.given_name || "");
          form.setValue("family_name", parsedData.family_name || "");
          form.setValue("email_address", parsedData.email_address || "");
          form.setValue("phone_number", parsedData.phone_number || "+61");
          form.setValue("appointment_note", parsedData.appointment_note || "");
        } catch (error) {
          console.error("Error loading saved form data:", error);
        }
      }
    }
  }, [isAuthenticated, user, form]);

  // Save form data to localStorage when it changes (for unauthenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      const subscription = form.watch((formData) => {
        localStorage.setItem("booking_form_data", JSON.stringify(formData));
      });
      return () => subscription.unsubscribe();
    }
  }, [form, isAuthenticated]);

  // Check if phone number exists when user types
  const handlePhoneBlur = async () => {
    const phoneNumber = form.getValues("phone_number");
    if (phoneNumber && isValidPhoneNumber(phoneNumber) && !isAuthenticated) {
      try {
        const exists = await checkPhoneExists(phoneNumber as string);
        if (exists) {
          // Phone exists, show login modal with a message
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error("Error checking phone:", error);
      }
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Form will be auto-filled by the useEffect
  };

  // Handle Create Account button in auth required modal
  // const handleCreateAccount = () => {
  //   // setShowAuthRequiredModal(false);
  //   // Store return URL to come back after registration
  //   localStorage.setItem("auth_return_url", window.location.pathname);
  //   navigate(`/register?redirect=${encodeURIComponent(window.location.pathname)}`);
  // };

  // Handle Sign In button in auth required modal
  const handleSignIn = () => {
    // setShowAuthRequiredModal(false);
    setShowLoginModal(true);
  };

  return (
    <section className="relative bg-[#010401] flex flex-col p-4  items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0">
      <div className="flex flex-col justify-center items-center absolute left-6 top-6">
        <Link to={"/home"}>
          <Logo className="w-48 md:w-[12rem] h-auto opacity-90 " />
        </Link>
      </div>
      <img
        src={GradientTop}
        alt="gradient top"
        className="absolute top-0 right-0 w-5/12 "
      />
      <img
        src={GradientBottom}
        alt="gradient top"
        className="absolute bottom-0 left-0 w-8/12 "
      />

      <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Creating Booking
            </AlertDialogTitle>
            <AlertDialogDescription>
              {status === "loading" ? (
                <Spinner />
              ) : status === "succeeded" ? (
                <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                  <div className="p-1  rounded-full border border-[#24FF00]">
                    <Check className="h-24 w-auto md:h-24 md:w-24 text-[#24FF00] " />
                  </div>
                </div>
              ) : status === "failed" ? (
                <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                  <div className="p-1  rounded-full border border-red-600">
                    <X className="h-24 w-auto md:h-24 md:w-24 text-red-600 " />
                  </div>
                </div>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <section className="flex flex-col  relative z-40 w-full pt-12 md:pt-0">
        <div className="flex flex-col">
          <div className="text-center w-full text-stone-200 text-sm py-2">
            <h3 className="text-lg font-medium ">Checkout</h3>
            <p className="font-extralight">
              Appointment held for {selectedTime} {startPeriod}
            </p>
          </div>
          <div className="relative  h-8 w-full px-4">
            <hr className="absolute top-0 left-1/2 -translate-x-1/2 w-[15rem] h-[3px] bg-[#42FF00] transform  z-10" />
            <hr className="absolute top-[1px] left-0 w-full h-[2px] bg-[#038101] z-0 opacity-50" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitContactForm)}
            className="grid  grid-cols-1 md:grid-cols-3 pt-4 gap-y-12 md:gap-0"
          >
            <div className="flex flex-col gap-4 col-span-2 mr-4">
              <div className="flex justify-between">
                {isAuthenticated && user && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      Signed in as {user.firstName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowLoginModal(true)}
                      className="text-sm text-gray-400 hover:text-white p-0 h-auto"
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>

              {/* COMMENTED OUT FOR FUTURE FEATURE - Login prompt for unauthenticated users */}
              {/* {!isAuthenticated && (
                <div className="col-span-2">
                  <div className="bg-amber-900/20 border border-amber-600/50 rounded-lg p-3">
                    <p className="text-xs text-amber-200 mb-2">
                      <strong>Login Required:</strong> You need to create an account to
                      book appointments. It will save time on future bookings.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs border-[#04C600] text-[#04C600] hover:bg-[#04C600] hover:text-white"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Sign In
                      </Button>
                      <Link
                        to={`/register?redirect=${encodeURIComponent(window.location.pathname)}`}
                        className="flex-1"
                        onClick={() => {
                          localStorage.setItem(
                            "auth_return_url",
                            window.location.pathname
                          );
                        }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-xs bg-[#04C600] text-white hover:bg-[#03A000] border-[#04C600]"
                        >
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )} */}

              <h3 className="text-sm font-medium">Contact Info</h3>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          className="[&_input]:h-10 [&_input]:border-stone-500"
                          {...field}
                          value={field.value as RPNInput.Value}
                          onBlur={() => {
                            field.onBlur();
                            handlePhoneBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <hr className="h-[2px] opacity-50 bg-[#048301] w-full my-6" />
                <div className="grid grid-cols-2 gap-4 w-full justify-between z-50">
                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-transparent w-full border border-stone-500 rounded-lg"
                            placeholder="First name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="family_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-transparent w-full border border-stone-500 rounded-lg"
                            placeholder="Last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 w-full justify-between z-50 pt-4">
                  <FormField
                    control={form.control}
                    name="email_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-transparent w-full border border-stone-500 rounded-md"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <hr className="h-[2px] opacity-50 bg-[#048301] w-full my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm">Appointment Note</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddClick}
                      className="text-xs text-gray-400 hover:text-white p-0 h-auto"
                    >
                      {showForm ? "Remove" : "Add"}
                    </Button>
                  </div>
                  {showForm && (
                    <FormField
                      control={form.control}
                      name="appointment_note"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="bg-transparent w-full border border-stone-500 rounded-md text-sm"
                              placeholder="Enter appointment note"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <hr className="h-[2px] opacity-50 bg-[#048301] w-full my-4" />
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-sm">Cancellation Policy</h3>
                    <div className="flex flex-col gap-2 relative mt-2">
                      <h4 className="text-xs relative right-[-10rem] md:right-[-28rem] font-light text-stone-950 bg-[#04C600] rounded-full w-fit px-3 py-0.5 opacity-90">
                        Cancel Before {dateObject.day} {dateObject.monthName}
                      </h4>
                      <img
                        src={CancelationBar}
                        alt="cancel before"
                        className="h-8"
                      />
                    </div>
                  </div>
                  <p className="text-xs font-light opacity-80">
                    Please cancel or reschedule before {cancelTime} on{" "}
                    {dateObject.time}. After that, you may be charged a
                    cancellation fee.{" "}
                    <a className="text-[#04C600] underline">See full policy</a>
                  </p>
                  
                </div>
              </div>
            </div>
            <div className="flex flex-col px-4 ">
              <h3 className="text-sm font-medium">Appointment Summary</h3>
              <div className="flex flex-col gap-2 border-[1px] border-b-0 border-t border-stone-400 p-4 pl-8 pr-6 rounded-t-xl text-sm mt-4 ">
                <h4 className=" text-lg pb-2">{formattedDate}</h4>
                <div className="flex flex-col  gap-2 text-xs font-light">
                  <p>{appointmentEndTime}</p>
                  <p>Est. due at appointment: A${total}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 justify-between border border-stone-400 p-4 pl-8 pr-6   text-sm items-center">
                <h4 className="col-span-2 text-lg">
                  {bookedItems[0].item_data.name}
                </h4>
                <p className="text-xs justify-self-end font-light">
                  A{formattedAmount}
                </p>
              </div>
              <div className="flex flex-col gap-4 border border-stone-400 p-4 pl-8 pr-6  text-sm">
                <div className="w-full grid grid-cols-3">
                  <p className="text-xs col-span-2  font-light">Subtotal</p>
                  <p className="text-xs justify-self-end font-light">
                    A{formattedAmount}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p className="text-xs col-span-2 font-light">Taxes</p>
                  <p className="text-xs justify-self-end font-light">
                    A${twoPercent}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p className="text-xs col-span-2 font-light">Total</p>
                  <p className="text-xs justify-self-end font-light">
                    A${total}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 justify-between border border-stone-400 p-4 pl-8 pr-6 rounded-b-xl text-sm">
                <div className="w-full grid grid-cols-3">
                  <p className="text-xs col-span-2 font-light">Due Today</p>
                  <p className="text-xs justify-self-end font-light">A$0.00</p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p className="text-xs col-span-2 font-light">
                    Due at Appointment{" "}
                  </p>
                  <p className="text-xs justify-self-end font-light">
                    A${total}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-stone-900/50 border border-stone-700 rounded-lg p-3 mt-5">
                    <input
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-stone-500 bg-transparent checked:bg-[#04C600] checked:border-[#04C600] focus:ring-2 focus:ring-[#04C600] focus:ring-offset-0 cursor-pointer"
                      type="checkbox"
                      id="terms"
                      onChange={handleCheckboxChange}
                      checked={isChecked}
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-gray-200 leading-relaxed cursor-pointer select-none"
                    >
                      I have read and agreed to the cancellation policy of
                      Fadedlines barbershop.
                    </label>
                  </div>
              <Button
                onClick={() => {
                  localStorage.setItem("purchase_value", total.toString());
                }}
                variant={"ghost"}
                type="submit"
                disabled={!isChecked}
                className=" w-full bg-[#036901] mt-10 h-fit py-4 rounded-xl font-light"
              >
                Book an Appointment
              </Button>
            </div>
          </form>
        </Form>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        onForgotPassword={() => {
          setShowLoginModal(false);
          navigate('/forgot-password');
        }}
        contextMessage={
          isAuthenticated 
            ? "Sign in to a different account" 
            : "Please sign in to complete your booking"
        }
      />

      {/* Auth Required Modal */}
      {/* <AlertDialog
        open={showAuthRequiredModal}
        onOpenChange={setShowAuthRequiredModal}
      >
        <AlertDialogContent className="sm:max-w-md bg-[#010401] border border-stone-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-center text-white">
              Account Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-gray-300">
                You need to create an account to book appointments. It will save
                time on future bookings.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-[#036901] hover:bg-[#025501] text-white"
                >
                  Create Account
                </Button>
                <Button
                  onClick={handleSignIn}
                  variant="outline"
                  className="w-full border-stone-700 hover:bg-stone-900"
                >
                  Sign In to Existing Account
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog> */}
    </section>
  );
};

export default BookContactInfo;
