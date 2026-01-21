import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarberResponse,
  BarberServices,
  ServicesResponse,
} from "@/interfaces/BookingInterface";
import { getAllBarber, getAllService } from "@/utils/barberApi";
import { getTeamMembersDisplayOrder } from "@/utils/dashboardApi";
import Spinner from "../web/Spinner";
import Logo from "@/components/react-svg/logo";
import { ChevronDown, ChevronUp } from "lucide-react";

import Rayhan from "@/assets/web/barbers/booking-list/rayhan-book.jpeg";
import Anthony from "@/assets/web/barbers/booking-list/anthony-book.jpeg";
import Jay from "@/assets/web/barbers/booking-list/jay-book.svg";
import Wyatt from "@/assets/web/barbers/booking-list/wyatt-book.svg";
import Emman from "@/assets/web/barbers/booking-list/emman-book.svg";
import Christos from "@/assets/web/barbers/booking-list/christos-book.svg";
import Josh from "@/assets/web/barbers/booking-list/josh-book.png";
import Niko from "@/assets/web/barbers/booking-list/niko-book.svg";
import Noah from "@/assets/web/barbers/booking-list/noah-book.png";
import Amir from "@/assets/web/barbers/booking-list/amir-book.svg";
import FadedlinesFallback from "@/assets/web/barbers/booking-list/fadedlines.png";
// import Hero from "@/assets/web/home/hero.svg";

const barberImages: { [key: string]: string } = {
  RAYHAN: Rayhan,
  ANTHONY: Anthony,
  JAY: Jay,
  WYATT: Wyatt,
  EMMAN: Emman,
  CHRISTOS: Christos,
  JOSH: Josh,
  NIKO: Niko,
  NOAH: Noah,
  AMIR: Amir,
  // MUSTAFA: Hero,
};

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [barberServices, setBarberServices] = useState<BarberServices>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);
  const [teamMembersOrder, setTeamMembersOrder] = useState<any[] | null>(null);

  // Separate useEffect for team members order that doesn't depend on location
  useEffect(() => {
    const fetchTeamMembersOrder = async () => {
      try {
        const teamMembers = await getTeamMembersDisplayOrder();
        
        if (teamMembers?.data) {
          setTeamMembersOrder(teamMembers.data);
        }
      } catch (error) {
        // Keep teamMembersOrder as null to use fallback ordering
      }
    };

    fetchTeamMembersOrder();
  }, []); // Run once on mount

  useEffect(() => {
    const createDynamicSortOrder = (teamMembers: any[] | null): string[] => {
      if (teamMembers && teamMembers.length > 0) {
        // Create dynamic sort order based on displayOrder from BarberManagement
        const sorted = teamMembers
          .sort((a, b) => {
            const orderA = a.details?.displayOrder ?? 999;
            const orderB = b.details?.displayOrder ?? 999;
            return orderA - orderB;
          })
          .map((member) => {
            // Extract the first name in uppercase to match the barber images mapping
            const firstName = member.givenName?.toUpperCase();
            return firstName;
          })
          .filter(Boolean);
          
        return sorted;
      }
      
      // Fallback to hardcoded order if dashboard API is unavailable
      return [
        // "MUSTAFA",
        "LUCAS",
        "AMIR",
        "RAYHAN",
        "JAY",
        "NOAH",
        "EMMAN",
        "NIKO",
        "ANTHONY",
        "JOSH",
        // "CHRISTOS",
        // "WYATT",
      ];
    };

    const joinBarbersAndServices = (
      barbers: BarberResponse | undefined,
      services: ServicesResponse | undefined,
      specificBarber: string | null,
    ) => {
      const barberServices: BarberServices = { data: [] };
      const sortOrder = createDynamicSortOrder(teamMembersOrder);

      let sortedProfiles = barbers?.team_member_booking_profiles
        .filter((profile) => {
          const upperName = profile.display_name.toUpperCase();
          return sortOrder.some((name) => upperName.includes(name));
        })
        .sort((a, b) => {
          const aUpperName = a.display_name.toUpperCase();
          const bUpperName = b.display_name.toUpperCase();
          const aName = sortOrder.findIndex((name) =>
            aUpperName.includes(name),
          );
          const bName = sortOrder.findIndex((name) =>
            bUpperName.includes(name),
          );
          return aName - bName;
        });

      // Filter for a specific barber if provided
      if (specificBarber && specificBarber !== "book") {
        sortedProfiles = sortedProfiles?.filter((profile) =>
          profile.display_name
            .toUpperCase()
            .includes(specificBarber.toUpperCase()),
        );
      }

      if (sortedProfiles && services) {
        for (let i = 0; i < sortedProfiles.length; i++) {
          const servicesForBarber = services.objects.filter((service) =>
            service.item_data.variations.some((variation) =>
              variation.item_variation_data.team_member_ids?.includes(
                sortedProfiles[i].team_member_id,
              ),
            ),
          );

          barberServices.data.push({
            barber: sortedProfiles[i],
            services: servicesForBarber,
          });
        }
      }

      setBarberServices(barberServices);

      // Auto-expand if there's only one barber
      if (
        barberServices.data.length === 1 &&
        barberServices.data[0].barber.team_member_id
      ) {
        setExpandedBarber(barberServices.data[0].barber.team_member_id);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      
      const parts = location.pathname.split("/");

      // Determine which barber to show
      let specificBarber = null;
      let barber;
      let query;
      let type;

      // Handle different URL patterns
      parts[1] === "meta" ? (barber = parts[2]) : (barber = parts[1]);
      parts[1] === "meta" ? (type = "M") : (type = "O");

      const isBookingPath =
        parts.includes("book") || parts.includes("services");

      // Set the specific barber based on URL
      if (barber && barber !== "book" && isBookingPath) {
        specificBarber = barber;
      }

      // Determine query for API
      if (parts.length > 3) {
        barber === "dejan" ||
        barber === "anthony" ||
        barber === "christos" ||
        barber === "wyatt" ||
        barber === "noah" ||
        barber === "book"
          ? // barber === "mustafa"
            (query = "all")
          : (query = barber);
      } else {
        query = "";
      }

      const fetchedBarbers = await getAllBarber();
      const fetchedServices = await getAllService(query, type);

      // console.log(
      //   "DEBUG JSON",
      //   JSON.stringify({
      //     fetchedBarbers,
      //     fetchedServices,
      //   }),
      // );

      // console.log("DEBUG OBJECT", {
      //   fetchedBarbers,
      //   fetchedServices,
      // });

      // console.log(
      //   "TEAM MEMBERS:",
      //   fetchedBarbers.team_member_booking_profiles.map((profile) => ({
      //     id: profile.team_member_id,
      //     name: profile.display_name,
      //     bookable: profile.is_bookable,
      //   }))
      // );

      joinBarbersAndServices(fetchedBarbers, fetchedServices, specificBarber);
      setIsLoading(false);
    };

    fetchData();
  }, [location.pathname, teamMembersOrder]); // Re-run when team members order changes

  const handleBookNowClick = async (item: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      localStorage.removeItem("bookedItems");
      const updatedBookings = [item];
      localStorage.setItem("bookedItems", JSON.stringify(updatedBookings));
      const parts = location.pathname.split("/");
      const newPath = "/" + parts.slice(1, parts.length - 1).join("/");
      navigate(`${newPath}/appointment`);
    } catch (error) {
      console.error("Error booking the item:", error);
    }
  };

  const toggleBarberServices = (barberId: string) => {
    setExpandedBarber(expandedBarber === barberId ? null : barberId);
  };

  const getBarberImage = (displayName: string, teamMemberId?: string) => {
    // Priority 1: Check for uploaded image from backend
    if (teamMemberId && teamMembersOrder) {
      const teamMember = teamMembersOrder.find(
        (member: any) => member.squareId === teamMemberId
      );

      if (teamMember?.details?.profileImageUrl) {
        // Construct full URL for uploaded image
        const API_BASE_URL = import.meta.env.VITE_NEW_API || 'http://localhost:3001';
        return `${API_BASE_URL}${teamMember.details.profileImageUrl}`;
      }
    }

    // Priority 2: Check for static image by name
    const upperName = displayName.toUpperCase();
    for (const [key, value] of Object.entries(barberImages)) {
      if (upperName.includes(key)) {
        return value;
      }
    }

    // Priority 3: Return Fadedlines logo as final fallback
    return FadedlinesFallback;
  };

  /**
   * Get price description from variation, falling back to generating from price_money
   * @param variation - Service variation object
   * @returns Formatted price description string
   */
  const getPriceDescription = (variation: any) => {
    const priceDesc = variation.item_variation_data.price_description;

    // Return existing price_description if available
    if (priceDesc) {
      return priceDesc;
    }

    // Generate from price_money if price_description is null/undefined
    const priceMoney = variation.item_variation_data.price_money;
    if (priceMoney?.amount) {
      const dollars = (priceMoney.amount / 100).toFixed(2);
      const currency = priceMoney.currency || 'AUD';
      return `$${dollars} ${currency} + [15% Surcharge On Sundays]`;
    }

    return 'Price not available';
  };

  const extractPriceRange = (services: any[]) => {
    const prices = services
      .map((service) => {
        // Use helper to get price description (handles null/undefined)
        const priceDescription = getPriceDescription(service.item_data.variations[0]);
        const priceMatch = priceDescription?.match(/\$(\d+(\.\d{2})?)/);
        return priceMatch ? parseFloat(priceMatch[1]) : 0;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return "";

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`;
  };

  return (
    <section className="relative bg-[#010401] min-h-screen">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/home">
          <Logo className="w-48 md:w-[12rem] h-auto opacity-90" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="text-xl font-bold text-white">Loading data...</h3>
            <Spinner />
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {barberServices?.data.map((item) => (
              <div key={item.barber.team_member_id} className="relative">
                <div className="flex flex-col md:grid md:grid-cols-[300px,1fr] gap-6 md:gap-12">
                  {/* Barber Image Section */}
                  <div className="relative">
                    <div className="w-[90%] mx-auto md:w-[300px] h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                      <img
                        src={
                          getBarberImage(
                            item.barber.display_name,
                            item.barber.team_member_id
                          ) ?? undefined
                        }
                        alt={item.barber.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vertical Line - Hidden on mobile */}
                  <div className="hidden md:block absolute left-[300px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent ml-6" />

                  {/* Content Section */}
                  <div className="flex flex-col">
                    <h2 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">
                      {item.barber.display_name.split(" ")[0]}
                    </h2>
                    <p className="text-sm text-white mb-4">
                      {(() => {
                        // Try to extract Instagram handle in various formats
                        // Format 1: "(IG@username)" - with parentheses
                        const withParens = item.barber.display_name.match(/\(IG[^)]*\)/);
                        if (withParens) return withParens[0];

                        // Format 2: "IG@username)" - missing opening parenthesis
                        const missingOpen = item.barber.display_name.match(/IG[^)]*\)/);
                        if (missingOpen) return `${missingOpen[0]}`;

                        // Format 3: "IG@username" - no parentheses at all
                        const noParens = item.barber.display_name.match(/IG@\S+/);
                        if (noParens) return `${noParens[0]}`;

                        return "";
                      })()}
                    </p>

                    {/* Green Line */}
                    <div className="relative h-px w-full bg-green-500 mb-6">
                      <div className="absolute top-1 left-0 right-0 h-px bg-green-900" />
                    </div>

                    {/* Services Section */}
                    <div className="w-full">
                      <Button
                        onClick={() =>
                          toggleBarberServices(item.barber.team_member_id)
                        }
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white justify-between h-12 md:h-14 text-base md:text-lg rounded-lg"
                      >
                        <span className="flex flex-col items-start">
                          <span>View Services</span>
                          <span className="text-sm text-gray-400">
                            ({extractPriceRange(item.services)} AUD)
                          </span>
                        </span>
                        {expandedBarber === item.barber.team_member_id ? (
                          <ChevronUp className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        ) : (
                          <ChevronDown className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </Button>

                      {expandedBarber === item.barber.team_member_id && (
                        <div className="mt-4 space-y-4">
                          {item.services.map((service) => (
                            <div
                              key={service.id}
                              className="bg-zinc-900/30 rounded-lg p-4 md:p-6"
                            >
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
                                <div>
                                  <h3 className="text-white text-base md:text-lg font-medium">
                                    {service.item_data.name}
                                  </h3>
                                  <p className="text-zinc-400 text-sm mt-1">
                                    {getPriceDescription(service.item_data.variations[0])}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleBookNowClick(service)}
                                  className="bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] w-full md:w-auto min-w-[120px] h-12"
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookList;
