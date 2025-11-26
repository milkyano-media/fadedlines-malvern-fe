import { Button } from '@/components/ui/button';
import GradientTop from '@/assets/landing/book_circle_top.svg';
import GradientBottom from '@/assets/landing/book_circle_bottom.svg';
import {
  ClockHistory,
  ChevronRight,
  ReplyFill,
  XCircleFill
} from 'react-bootstrap-icons';
import Logo from '@/components/react-svg/logo';
import { Link, useLocation } from 'react-router-dom';
import CancelationBar from '@/assets/book/cancelation_bar.svg';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { useGtm } from '../hooks/UseGtm';
import { BarberDetailResponse, ServicesItem } from '@/interfaces/BookingInterface';
import { getBarberDetail, cancelBooking, getBookingDetails, getAvailability, rescheduleBooking } from '@/utils/barberApi';
import { getCustomerId } from '@/utils/authApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import moment from 'moment-timezone';
import { Calendar } from '@/components/ui/calendar';
import { useParameterValue } from '@/hooks/useParameter';

interface TimeOfDay {
  title: string;
  appointments: {
    start_at: string;
    readable_time: string;
  }[];
}

const ThankYouPage = () => {
  const location = useLocation();
  const { sendEvent } = useGtm();
  const { toast } = useToast();
  const [barberName, setBarberName] = useState<string>('');
  const [thankYouTime, setThankYouTime] = useState<string>('');

  // Fetch booking success parameters
  const bookingSuccessTitle = useParameterValue<string>('content.booking_success_title', 'Thanks For Booking');
  const bookingSuccessMessage = useParameterValue<string>('content.booking_success_message', 'Your Appointment is Coming Up');

  // Calendar helper function
  const generateCalendarUrls = () => {
    const startDateTime = localStorage.getItem('appointmentStartAt');
    const serviceName = (bookedItems as ServicesItem[])[0]?.item_data?.name || 'Appointment';
    const location = 'Fadedlines Barbershop, 163 GLENFERRIE RD, MALVERN 3144, VICTORIA';
    
    if (!startDateTime) return null;

    // Calculate end time (assume 90 minutes duration as default)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 90 * 60000); // 90 minutes later
    
    // Format dates for URLs
    const formatDateForUrl = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startFormatted = formatDateForUrl(startDate);
    const endFormatted = formatDateForUrl(endDate);
    
    const title = encodeURIComponent(`${serviceName} with ${barberName}`);
    const details = encodeURIComponent(`Appointment at ${location}`);
    const locationEncoded = encodeURIComponent(location);

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${locationEncoded}`,
      
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startFormatted}&enddt=${endFormatted}&body=${details}&location=${locationEncoded}`,
      
      apple: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${startFormatted}
DTEND:${endFormatted}
SUMMARY:${decodeURIComponent(title)}
DESCRIPTION:${decodeURIComponent(details)}
LOCATION:${decodeURIComponent(locationEncoded)}
END:VEVENT
END:VCALENDAR`,
      
      yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startFormatted}&et=${endFormatted}&desc=${details}&in_loc=${locationEncoded}`
    };
  };

  const handleCalendarClick = (provider: string) => {
    const urls = generateCalendarUrls();
    if (!urls) return;

    const url = urls[provider as keyof typeof urls];
    if (provider === 'apple') {
      // For Apple calendar, create a download link
      const blob = new Blob([url.replace('data:text/calendar;charset=utf8,', '')], {
        type: 'text/calendar;charset=utf-8'
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'appointment.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const handleThankYouPage = async () => {
      if (location.pathname.includes('thank-you')) {
        const tempPurchaseValue = localStorage.getItem('purchase_value');
        const purchaseValue = tempPurchaseValue
          ? JSON.parse(tempPurchaseValue)
          : null;

        const tempNewCustomer = localStorage.getItem('new_customer');
        const newCustomer = tempNewCustomer
          ? JSON.parse(tempNewCustomer)
          : null;

        const bookingId = localStorage.getItem('booking_id');
        const sendedBookingId =
          localStorage.getItem('sended_booking_id') || undefined;
        const customerId = getCustomerId();
        const barberId = localStorage.getItem('barber_id');

        const booking_origin = localStorage.getItem('utm_source') || undefined;
        const utm_source = localStorage.getItem('utm_source') || undefined;
        const utm_medium = localStorage.getItem('utm_medium') || undefined;
        const utm_campaign = localStorage.getItem('utm_campaign') || undefined;
        const utm_content = localStorage.getItem('utm_content') || undefined;

        const firstVisitSource = localStorage.getItem('first_visit_source');
        const lastVisitSource = localStorage.getItem('last_visit_source');
        const customerSource = localStorage.getItem('customer_source');

        const firstVisitData = firstVisitSource
          ? JSON.parse(firstVisitSource)
          : {};
        const lastVisitData = lastVisitSource
          ? JSON.parse(lastVisitSource)
          : {};
        const customerSourceData = customerSource
          ? JSON.parse(customerSource)
          : {};

        try {
          if (bookingId && customerId && barberId) {
            // let influence = 'organic(0%)';
            // Determine influence based on tracking data
            if (lastVisitData.fbclid && lastVisitData.utm_source) {
              // influence = 'strongly influenced by ads(75-100%)';
            } else if (lastVisitData.fbclid) {
              // influence = 'significantly influenced by ads(50-75%)';
            } else if (firstVisitData.fbclid || customerSourceData.fbclid) {
              // influence = 'partially influenced by ads(25-50%)';
            }

            // const recordData = {
            //   bookingId,
            //   customerId,
            //   barberId,
            //   source:
            //     lastVisitData.utm_source ||
            //     firstVisitData.utm_source ||
            //     'organic',
            //   campaign:
            //     lastVisitData.utm_campaign || firstVisitData.utm_campaign,
            //   content: lastVisitData.utm_content || firstVisitData.utm_content,
            //   medium: lastVisitData.utm_medium || firstVisitData.utm_medium,
            //   influence,
            //   newCustomer: localStorage.getItem('new_customer') === 'true'
            // };

            if (bookingId !== sendedBookingId) {
              sendEvent({
                booking_id: bookingId,
                origin: booking_origin,
                source: utm_source,
                medium: utm_medium,
                campaign: utm_campaign,
                content: utm_content,
                event: 'purchase_event',
                value: purchaseValue,
                new_customer: newCustomer,
                Currency: 'AUD'
              });
            }
            // await postUtmRecord(recordData);
            localStorage.setItem('sended_booking_id', bookingId);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    handleThankYouPage();
  }, [location.pathname, sendEvent]);

  useEffect(() => {
    const fetchBarberDetail = async () => {
      const appointmentSegmentString =
        localStorage.getItem('appointmentSegment');

      const timeData = localStorage.getItem('thankYouTime');
      if (timeData) {
        setThankYouTime(timeData);
      }
      if (appointmentSegmentString) {
        const appointmentSegment = JSON.parse(appointmentSegmentString);
        const barberDetail: BarberDetailResponse = await getBarberDetail(
          appointmentSegment[0].team_member_id
        );
        setBarberName(
          `${barberDetail.team_member.given_name} ${barberDetail.team_member.family_name}`
        );
      }
    };

    fetchBarberDetail();
  }, []);

  interface ContactInfo {
    monthName?: string;
    day?: number;
    dayName?: string;
    month?: number;
  }
  const [dialog, setDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [, setAvailabilityByDate] = useState<any[]>([]);
  const [allAvailabilities, setAllAvailabilities] = useState<any[]>([]);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    const bookingId = localStorage.getItem('booking_id');
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Booking ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Get current booking details to get version
      const bookingDetails = await getBookingDetails(bookingId);
      
      // Cancel the booking
      await cancelBooking(bookingId, bookingDetails.version);
      
      toast({
        title: "Success",
        description: "Your appointment has been cancelled successfully.",
      });
      setCancelDialog(false);
      
      // Optionally redirect or update UI
      // window.location.href = '/';
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load available slots for reschedule (multiple days)
  const loadAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const appointmentSegmentString = localStorage.getItem('appointmentSegment');
      if (!appointmentSegmentString) return;

      const appointmentSegment = JSON.parse(appointmentSegmentString);
      const serviceVariationId = appointmentSegment[0]?.service_variation_id;
      
      if (!serviceVariationId) return;

      // Get today's date
      const today = new Date();
      const startAt = new Date(today);
      startAt.setDate(today.getDate() + 1); // Start from tomorrow
      
      // Get end date (30 days from now)
      const endAt = new Date(today);
      endAt.setDate(today.getDate() + 30);

      const availabilityData = {
        service_variation_id: serviceVariationId,
        start_at: moment.tz(startAt, "Australia/Sydney").format(),
        end_at: moment.tz(endAt, "Australia/Sydney").format()
      };

      const availability = await getAvailability(availabilityData);
      const availabilities = availability.availabilities || [];
      
      setAllAvailabilities(availabilities);
      
      // Calculate unavailable dates
      const unavailable = [];
      for (let i = 0; i <= 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const hasAvailability = checkAvailabilityByDate(checkDate, availabilities);
        if (!hasAvailability) {
          unavailable.push(new Date(checkDate));
        }
      }
      setUnavailableDates(unavailable);
      
      // Set initial date to tomorrow or first available date
      const firstAvailable = availabilities[0];
      if (firstAvailable) {
        const firstDate = new Date(firstAvailable.start_at);
        setSelectedDate(firstDate);
        findAvailabilityByDate(firstDate, availabilities);
      }
      
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast({
        title: "Error",
        description: "Error loading available time slots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Check if a date has availability
  const checkAvailabilityByDate = (date: Date, availabilities: any[] = allAvailabilities) => {
    const dateAEST = moment.tz(date, 'Australia/Sydney').startOf('day');
    return availabilities.some((item: { start_at: string }) => {
      const itemDate = moment.tz(item.start_at, 'Australia/Sydney').startOf('day');
      return dateAEST.isSame(itemDate, 'day');
    });
  };

  // Find availability for a specific date
  const findAvailabilityByDate = (date: Date, availabilities: any[] = allAvailabilities) => {
    const dateAEST = moment.tz(date, 'Australia/Sydney').startOf('day');
    const results = availabilities.filter((item: { start_at: string }) => {
      const itemDate = moment.tz(item.start_at, 'Australia/Sydney').startOf('day');
      return dateAEST.isSame(itemDate, 'day');
    });
    
    setAvailabilityByDate(results);
    setAvailableSlots(results);
    return results;
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setSelectedNewSlot(''); // Reset selected time slot
    findAvailabilityByDate(date);
  };

  // Group slots by time of day (similar to BookAppointment)
  const groupSlotsByTimeOfDay = (): TimeOfDay[] => {
    const timesOfDay: TimeOfDay[] = [
      { title: "Morning", appointments: [] },
      { title: "Afternoon", appointments: [] },
      { title: "Evening", appointments: [] }
    ];

    availableSlots.forEach(slot => {
      const startAt = new Date(slot.start_at);
      const hour = startAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', hour12: false });

      let timeOfDayIndex;
      if (parseInt(hour) < 12) timeOfDayIndex = 0;
      else if (parseInt(hour) >= 12 && parseInt(hour) < 17) timeOfDayIndex = 1;
      else timeOfDayIndex = 2;

      const readableTime = startAt.toLocaleString('en-AU', { 
        timeZone: 'Australia/Sydney', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      });

      timesOfDay[timeOfDayIndex].appointments.push({
        start_at: slot.start_at,
        readable_time: readableTime
      });
    });

    return timesOfDay;
  };

  // Handle reschedule booking
  const handleRescheduleBooking = async () => {
    setRescheduleDialog(true);
    await loadAvailableSlots();
  };

  // Confirm reschedule
  const confirmReschedule = async () => {
    if (!selectedNewSlot) {
      toast({
        title: "Error",
        description: "Please select a new time slot",
        variant: "destructive",
      });
      return;
    }

    const bookingId = localStorage.getItem('booking_id');
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Booking ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const appointmentSegmentString = localStorage.getItem('appointmentSegment');
      const appointmentSegment = JSON.parse(appointmentSegmentString || '[]');

      const rescheduleData = {
        start_at: selectedNewSlot,
        appointment_segments: appointmentSegment
      };

      await rescheduleBooking(bookingId, rescheduleData);
      
      toast({
        title: "Success",
        description: "Your appointment has been rescheduled successfully!",
      });
      setRescheduleDialog(false);
      
      // Update localStorage with new time
      localStorage.setItem('appointmentStartAt', selectedNewSlot);
      
      // Refresh the page to show updated info
      window.location.reload();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  let bookedItems: ServicesItem[] = [];
  let formattedDate = '';
  let dateObject: ContactInfo = {};

  try {
    const bookedItemsString = localStorage.getItem('bookedItems');
    if (bookedItemsString) {
      bookedItems = JSON.parse(bookedItemsString);
    }
  } catch (error) {
    console.error('Error parsing bookedItems from local storage:', error);
  }

  try {
    formattedDate = localStorage.getItem('formattedDate') || '';
  } catch (error) {
    console.error('Error retrieving formattedDate from local storage:', error);
  }

  try {
    const dateObjectString = localStorage.getItem('dateObject');
    if (dateObjectString) {
      dateObject = JSON.parse(dateObjectString);
    } else {
      dateObject = {};
    }
  } catch (error) {
    console.error('Error retrieving dateObject from local storage:', error);
    dateObject = {};
  }

  const selectedAppointmentString = localStorage.getItem('selectedAppointment');

  let CancelTime;

  if (selectedAppointmentString) {
    const [time, modifier] = selectedAppointmentString.split(' ');
    // eslint-disable-next-line prefer-const
    let [startHour, startMinute] = time.split(':').map(Number);

    if (modifier === 'pm' && startHour !== 12) {
      startHour += 12;
    } else if (modifier === 'am' && startHour === 12) {
      startHour = 0;
    }

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const startPeriod = startHour >= 12 ? 'PM' : 'AM';

    let cancelHour = startDate.getHours() - 2;
    let cancelPeriod = startPeriod;

    if (cancelHour < 0) {
      cancelHour += 24;
    }

    if (cancelHour >= 12) {
      cancelPeriod = 'PM';
    } else {
      cancelPeriod = 'AM';
    }

    const formattedCancelHour = cancelHour % 12 || 12;
    const formattedCancelTime = `${formattedCancelHour}:${startMinute
      .toString()
      .padStart(2, '0')}`;
    CancelTime = `${formattedCancelTime} ${cancelPeriod}`;
  }

  return (
    <section className='relative bg-[#010401] flex flex-col p-4 py-32 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0'>
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={'/home'}>
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img
        src={GradientTop}
        alt='gradient top'
        className='absolute top-0 right-0 w-5/12 '
      />
      <img
        src={GradientBottom}
        alt='gradient top'
        className='absolute bottom-0 left-0 w-8/12 '
      />
      <AlertDialog open={dialog} onOpenChange={setDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center'>
              Check Email
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className='w-8/12 h-full flex justify-center items-center text-lg py-4 text-center mx-auto'>
                <h4>
                  {' '}
                  Please check your email for cancelation and resechedule
                </h4>
              </div>{' '}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex sm:justify-center sm:items-center  w-full'>
            <AlertDialogCancel>Continue</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <AlertDialogContent className="bg-[#010401] border border-stone-400">
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center text-stone-200 text-xl'>
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className='w-full h-full flex justify-center items-center text-lg py-6 text-center mx-auto'>
                <h4 className='text-stone-300'>
                  Are you sure you want to cancel your appointment? This action cannot be undone.
                </h4>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex sm:justify-center sm:items-center w-full gap-4 pt-4 border-t border-stone-600'>
            <AlertDialogCancel 
              disabled={isProcessing}
              className='bg-transparent text-stone-300 border-stone-500 hover:bg-stone-700 hover:text-stone-200'
            >
              Keep Appointment
            </AlertDialogCancel>
            <Button 
              onClick={handleCancelBooking}
              disabled={isProcessing}
              variant="destructive"
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <AlertDialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
        <AlertDialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#010401] border border-stone-400">
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center text-stone-200 text-xl'>
              Reschedule Appointment
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className='w-full flex flex-col gap-6 py-6 text-stone-300'>
                
                {isLoadingSlots ? (
                  <div className='flex justify-center items-center py-12'>
                    <div className='text-center'>
                      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4'></div>
                      <p className='text-stone-400 text-lg'>Loading available dates and times...</p>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Calendar Section */}
                    <div className='space-y-4'>
                      <h3 className='text-stone-200 font-medium text-lg text-center'>Select New Date</h3>
                      <div className='flex justify-center'>
                        <Calendar
                          mode="single"
                          className="rounded-md border-none p-0 text-stone-200"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          fromDate={new Date()}
                          disabled={unavailableDates}
                          modifiers={{
                            available: (date) => checkAvailabilityByDate(date),
                          }}
                          modifiersStyles={{
                            available: { 
                              backgroundColor: 'rgba(3, 105, 1, 0.2)',
                              color: '#42FF00'
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Time Selection Section */}
                    <div className='space-y-4'>
                      <h3 className='text-stone-200 font-medium text-lg text-center'>
                        {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date first"}
                      </h3>
                      
                      {selectedDate ? (
                        availableSlots.length === 0 ? (
                          <p className='text-center text-stone-400 py-8'>No available times for this date.</p>
                        ) : (
                          <div className='space-y-6 max-h-80 overflow-y-auto pr-2'>
                            {groupSlotsByTimeOfDay().map(timeOfDay => (
                              timeOfDay.appointments.length > 0 && (
                                <div key={timeOfDay.title} className='space-y-3'>
                                  <h4 className='text-stone-300 font-medium'>{timeOfDay.title}</h4>
                                  <div className='flex gap-2 flex-wrap'>
                                    {timeOfDay.appointments.map((appointment, index) => (
                                      <Button
                                        key={index}
                                        variant={selectedNewSlot === appointment.start_at ? "default" : "outline"}
                                        className={`
                                          text-xs h-fit py-2 px-3 rounded transition-all
                                          ${selectedNewSlot === appointment.start_at 
                                            ? 'bg-[#036901] text-stone-50 border-[#036901]' 
                                            : 'bg-transparent text-stone-300 border-stone-500 hover:bg-[#036901] hover:text-stone-50 hover:border-[#036901]'
                                          }
                                        `}
                                        onClick={() => setSelectedNewSlot(appointment.start_at)}
                                      >
                                        {appointment.readable_time}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        )
                      ) : (
                        <p className='text-center text-stone-400 py-8'>Please select a date to see available times.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex sm:justify-center sm:items-center w-full gap-4 pt-4 border-t border-stone-600'>
            <AlertDialogCancel 
              disabled={isProcessing}
              className='bg-transparent text-stone-300 border-stone-500 hover:bg-stone-700 hover:text-stone-200'
            >
              Cancel
            </AlertDialogCancel>
            <Button 
              onClick={confirmReschedule}
              disabled={isProcessing || !selectedNewSlot}
              className='bg-[#036901] hover:bg-[#028001] text-stone-50'
            >
              {isProcessing ? 'Rescheduling...' : 'Confirm Reschedule'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className='relative z-40 w-full'>
        <section className='flex flex-col gap-2 pb-4 text-stone-200 relative w-full'>
          <div className='text-start w-full text-stone-200 text-sm py-2'>
            <h3 className='text-lg lg:text-xl font-medium '>
              {bookingSuccessTitle}
            </h3>
            <p className='font-extralight'>{bookingSuccessMessage}</p>
          </div>
          <div className='relative  h-8 w-full px-4'>
            <hr className='absolute top-0 left-0  w-[15rem] h-[3px] bg-[#42FF00] transform  z-10' />
            <hr className='absolute top-[1px] left-0 w-full h-[2px] bg-[#038101] z-0 opacity-50' />
          </div>
        </section>
        <section className='flex flex-col gap-12 mx-auto w-full md:w-8/12'>
          <div>
            <div className='border border-stone-400 rounded-t-xl p-6 px-12 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg'>{formattedDate}</h3>
                <p className='text-xs font-light text-stone-400 pl-4'>
                  {thankYouTime}
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg'>{bookedItems[0].item_data.name}</h3>
                <p className='text-xs font-light text-stone-400 pl-4'>
                  With {barberName}
                </p>
              </div>
            </div>
            <div className='rounded-b-xl px-4 pt-10 pb-4 border border-stone-400'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className=' w-full text-xl bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light'>
                    Add to Calendar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleCalendarClick('google')}>
                    📅 Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCalendarClick('outlook')}>
                    📅 Outlook Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCalendarClick('apple')}>
                    📅 Apple Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCalendarClick('yahoo')}>
                    📅 Yahoo Calendar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className='grid grid-cols-3 py-2 gap-x-4 pt-4'>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Button
                    onClick={handleRescheduleBooking}
                    className=' w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light'
                  >
                    <ClockHistory className='text-stone-50 w-6 h-auto' />
                  </Button>
                  Reschedule
                </div>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Button
                    onClick={() => setCancelDialog(true)}
                    className=' w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light'
                  >
                    <XCircleFill className='text-stone-50 w-6 h-auto' />
                  </Button>
                  Cancel
                </div>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Link to={'/barbers'} className='w-full h-full'>
                    <Button className=' w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light'>
                      <ReplyFill className='text-stone-50 w-6 h-auto' />
                    </Button>
                  </Link>
                  Rebook
                </div>
              </div>
            </div>
          </div>
          <div className='border border-stone-400 rounded-xl p-4 px-6 pt-6 flex flex-col gap-4'>
            <h3 className='text-lg md:text-xl font-medium px-8'>Location</h3>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44520.783413964426!2d145.06891445638522!3d-37.904472621963905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66bc0e74de7c9%3A0x58d6bfb2ed811b32!2sFaded%20Lines%20Barbershop%20Oakleigh!5e0!3m2!1sen!2sid!4v1720231134790!5m2!1sen!2sid'
              className='w-full rounded-xl'
              frameBorder='0'
              style={{ border: 0 }}
              allowFullScreen={true}
              aria-hidden={false}
              tabIndex={0}
            />
            <div className=' p-4 px-8 flex justify-between gap-4'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-sm md:text-xl'>Fadedlines Barbershop</h3>
                <p className='text-xs font-light text-stone-400'>
                  163 GLENFERRIE RD, MALVERN 3144, VICTORIA
                </p>
              </div>
              <Button className='rounded bg-stone-700 '>
                <a
                  href='https://www.google.com/maps/place/55+Portman+St,+Oakleigh+VIC+3166,+Australia/@-37.900189,145.0890531,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66a58f1383555:0x436afa9ac943981!8m2!3d-37.900189!4d145.091628!16s%2Fg%2F11bw42v9sv?entry=ttu'
                  target='_blank'
                  className='w-full h-full'
                >
                  <ChevronRight className='fill-white' />
                </a>
              </Button>
            </div>
          </div>
          <div className='border border-stone-400 rounded-xl py-8 px-12 flex flex-col gap-2'>
            <h3 className='text-lg font-medium'>Payment</h3>
            <p className='text-base font-light text-stone-400'>
              payment is due at your appointment
            </p>
          </div>
          <div className='border border-stone-400 rounded-xl p-8 md:py-6 md:px-12 flex flex-col gap-4'>
            <div className='flex flex-col gap-8 text-sm'>
              <div>
                <h3 className='font-medium text-xl pb-6 md:pb-0 md:text-base lg:text-xl'>
                  Cancellation Policy
                </h3>
                <div className='flex flex-col gap-4 relative'>
                  <h4 className='text-xs md:text-md relative right-[-55%] lg:right-[-60%] font-light text-stone-950 bg-[#04C600] rounded-full w-fit px-4 py-1 opacity-90 flex gap-1'>
                    Cancel Before
                    <span>
                      {dateObject.dayName}, {dateObject.monthName}{' '}
                      {dateObject.day}
                    </span>
                  </h4>
                  <img src={CancelationBar} alt='cancel before' />
                </div>
              </div>
              <p className='text-xs md:text-base font-extralight opacity-80'>
                Please cancel or reschedule before {CancelTime} on{' '}
                <span>
                  {dateObject.dayName}, {dateObject.monthName} {dateObject.day}
                </span>
                . After that, you may be charged a cancellation fee.{' '}
                <a className='text-[#04C600] underline'>See full policy</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ThankYouPage;
