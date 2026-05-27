import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingListButton from "@/components/book/BookingListButton";
import {
  BarberResponse,
  BarberServices,
  ServicesResponse,
  ServicesItem,
} from "@/interfaces/BookingInterface";
import { getAllBarber, getAllService } from "@/utils/barberApi";
import Spinner from "../web/Spinner";
import Logo from "@/components/react-svg/logo";
import { ChevronDown, ChevronUp } from "lucide-react";

import Josh from "@/assets/web/barbers/booking-list/josh-book.jpeg";
import John from "@/assets/web/barbers/booking-list/john-book.jpg";
import Mike from "@/assets/web/barbers/booking-list/mike-book.jpg";
import Humza from "@/assets/web/barbers/booking-list/humza-book.jpeg";
import Liem from "@/assets/web/barbers/booking-list/liem-book.jpeg";
import Roland from "@/assets/web/barbers/booking-list/roland-book.png";
import Nathan from "@/assets/web/barbers/booking-list/nathan-book.jpeg";
// import Lucas from "@/assets/web/barbers/booking-list/lucas-book.png"; // HIDDEN temporarily

import LineBottomBorder from "@/assets/book/line-bottom-border.svg";
import InstagramIcon from "@/assets/book/mdi_instagram.svg";

const HIDDEN_BARBERS = ["LUCAS", "MIKE"]; // Temporarily hidden

const barberImages: { [key: string]: string } = {
  JOSH: Josh,
  JOHN: John,
  MIKE: Mike,
  HUMZA: Humza,
  LIEM: Liem,
  ROLAND: Roland,
  NATHAN: Nathan,
  // HIDDEN: LUCAS: Lucas,
};

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [barberServices, setBarberServices] = useState<BarberServices>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Fixed joinBarbersAndServices function
    const joinBarbersAndServices = (
      barbers: BarberResponse | undefined,
      services: ServicesResponse | undefined,
      specificBarber: string | null,
    ) => {
      const barberServices: BarberServices = { data: [] };

      const sortOrder = [
        "JOSH",
      ];

      // 1. Use all available profiles
      let sortedProfiles = barbers?.team_member_booking_profiles ?? [];

      // 2. Filter out hidden barbers
      sortedProfiles = sortedProfiles.filter(
        (profile) =>
          !HIDDEN_BARBERS.some((hidden) =>
            profile.display_name.toUpperCase().includes(hidden),
          ),
      );

      // 3. Filter for a specific barber if provided
      if (specificBarber && specificBarber !== "book") {
        sortedProfiles = sortedProfiles.filter((profile) =>
          profile.display_name
            .toUpperCase()
            .includes(specificBarber.toUpperCase()),
        );
      }

      // 4. Sort based on predefined sortOrder, unknowns go to bottom
      sortedProfiles = sortedProfiles.sort((a, b) => {
        const aIndex = sortOrder.findIndex((name) =>
          a.display_name.toUpperCase().includes(name),
        );
        const bIndex = sortOrder.findIndex((name) =>
          b.display_name.toUpperCase().includes(name),
        );
        const aSort = aIndex !== -1 ? aIndex : 999;
        const bSort = bIndex !== -1 ? bIndex : 999;
        return aSort - bSort;
      });

      // 5. Match services with each barber
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

    const specialBarbers = ["dejan", "anthony", "christos", "wyatt", "noah"];

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

      const fetchedBarbers = await getAllBarber();

      if (!specificBarber) {
        // Generic /book/services: fetch per-barber services for accurate filtering
        const sortOrder = ["JOSH"];
        const profiles = (fetchedBarbers?.team_member_booking_profiles ?? []).filter(
          (profile) =>
            !HIDDEN_BARBERS.some((hidden) =>
              profile.display_name.toUpperCase().includes(hidden),
            ),
        );

        const sortedProfiles = [...profiles].sort((a, b) => {
          const aIndex = sortOrder.findIndex((name) =>
            a.display_name.toUpperCase().includes(name),
          );
          const bIndex = sortOrder.findIndex((name) =>
            b.display_name.toUpperCase().includes(name),
          );
          return (aIndex !== -1 ? aIndex : 999) - (bIndex !== -1 ? bIndex : 999);
        });

        const servicesPromises = sortedProfiles.map((profile) => {
          const barberFirstName = profile.display_name.split(" ")[0].toLowerCase();
          const barberQuery = specialBarbers.includes(barberFirstName)
            ? "all"
            : barberFirstName;
          return getAllService(barberQuery, type);
        });

        const allServicesResults = await Promise.all(servicesPromises);

        const barberServicesResult: BarberServices = { data: [] };

        for (let i = 0; i < sortedProfiles.length; i++) {
          const profile = sortedProfiles[i];
          const services = allServicesResults[i];
          const servicesForBarber = services.objects.filter((service) =>
            service.item_data.variations.some((variation) =>
              variation.item_variation_data.team_member_ids?.includes(
                profile.team_member_id,
              ),
            ),
          );
          barberServicesResult.data.push({ barber: profile, services: servicesForBarber });
        }

        setBarberServices(barberServicesResult);

        if (
          barberServicesResult.data.length === 1 &&
          barberServicesResult.data[0].barber.team_member_id
        ) {
          setExpandedBarber(barberServicesResult.data[0].barber.team_member_id);
        }
      } else {
        // Barber-specific route: existing logic
        if (parts.length > 3) {
          barber === "dejan" ||
          barber === "anthony" ||
          barber === "christos" ||
          barber === "wyatt" ||
          barber === "noah" ||
          barber === "book"
            ? (query = "all")
            : (query = barber);
        } else {
          query = "";
        }

        const fetchedServices = await getAllService(query, type);
        joinBarbersAndServices(fetchedBarbers, fetchedServices, specificBarber);
      }

      setIsLoading(false);
    };

    console.log(barberServices);
    fetchData();
  }, [location.pathname]);

  const handleBookNowClick = async (item: ServicesItem, teamMemberId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      localStorage.removeItem("bookedItems");

      // Filter to only the variation that belongs to this specific barber
      // so BookAppointment uses the correct service_variation_id for availability
      const barberVariations = item.item_data.variations.filter((v) =>
        v.item_variation_data.team_member_ids?.includes(teamMemberId),
      );
      const itemWithCorrectVariation = {
        ...item,
        item_data: {
          ...item.item_data,
          variations: barberVariations.length > 0 ? barberVariations : item.item_data.variations,
        },
      };

      localStorage.setItem("bookedItems", JSON.stringify([itemWithCorrectVariation]));
      localStorage.setItem("bookedTeamMemberId", teamMemberId);
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

  const getBarberImage = (displayName: string) => {
    const upperName = displayName.toUpperCase();
    for (const [key, value] of Object.entries(barberImages)) {
      if (upperName.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const extractPriceRange = (services: ServicesItem[]) => {
    const prices = services
      .map((service) => {
        const priceAmount = service.item_data.variations[0].item_variation_data.price_money.amount;
        // Convert from cents to dollars
        return priceAmount / 100;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return "";

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`;
  };

  const cleanDisplayName = (name: string): string => {
    // Remove (Available Now), (AvailableNow), (O), (M), surcharge text and any extra spaces
    return name
      .replace(/\(Available Now\)/gi, "")
      .replace(/\(AvailableNow\)/gi, "")
      .replace(/\(O\)/g, "")
      .replace(/\(M\)/g, "")
      .replace(/\+\s*\[15%\s*Surcharge\s*On\s*Sundays\]/gi, "")
      .trim()
      .replace(/\s+/g, " "); // Replace multiple spaces with single space
  };

  const formatPrice = (priceAmount: number): string => {
    // Convert from cents to dollars
    const dollars = priceAmount / 100;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <section className="relative bg-[#010401] min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black px-6 py-4 flex justify-center md:justify-start border-b border-[#1CFF21] md:border-b-0">
        <Link to="/home">
          <Logo className="w-48 md:w-[12rem] h-auto opacity-90" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-8rem)] md:pt-16">
            <h3 className="text-xl font-bold text-white">Loading data...</h3>
            <Spinner />
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {barberServices?.data.map((item) => (
              <div key={item.barber.team_member_id} className="relative">
                <div className="flex flex-col md:grid md:grid-cols-[380px,1fr] gap-6 md:gap-12">
                  {/* Barber Image Section */}
                  <div className="relative">
                    {/* Mobile: Card with green border and info overlay */}
                    <div className="md:hidden w-[85%] mx-auto relative">
                      {/* Green border container with curved bottom */}
                      <div className="relative rounded-[20px] overflow-visible ring-1 ring-[#1CFF21]">
                        <div className="relative rounded-[20px] overflow-hidden bg-black">
                        {/* Image */}
                        <div className="aspect-[1/1] overflow-hidden">
                          <img
                            src={getBarberImage(item.barber.display_name) ?? undefined}
                            alt={item.barber.display_name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info section with green background at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#063307]/80 px-5 py-4 rounded-b-[18px]">
                          <h2 className="text-[32px] font-extrabold font-inter text-white uppercase mb-1.5">
                            {item.barber.display_name.split(" ")[0]}
                          </h2>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={InstagramIcon}
                                alt="Instagram"
                                className="w-[14px] h-[14px]"
                              />
                              <p className="text-[13px] font-medium font-inter text-white/90">
                                {(() => {
                                  const ig =
                                    item.barber.display_name
                                      .match(/@[^\s(]+/)?.[0] || "";
                                  return ig;
                                })()}
                              </p>
                            </div>
                            <span className="text-xs text-[#00FF00] border border-[#00FF00] px-2 py-1 rounded-full">
                              Available Now
                            </span>
                          </div>
                        </div>
                        </div>

                        {/* Curved bottom border with glow effect */}
                        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-56">
                          <img
                            src={LineBottomBorder}
                            alt=""
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Card with green border and info overlay (same as mobile) */}
                    <div className="hidden md:block w-[380px] mx-auto relative">
                      {/* Green border container with curved bottom */}
                      <div className="relative rounded-[20px] overflow-visible ring-1 ring-[#1CFF21]">
                        <div className="relative rounded-[20px] overflow-hidden bg-black">
                          {/* Image */}
                          <div className="aspect-[3/4] overflow-hidden">
                            <img
                              src={getBarberImage(item.barber.display_name) ?? undefined}
                              alt={item.barber.display_name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info section with green background at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 bg-[#063307]/80 px-5 py-4 rounded-b-[18px]">
                            <h2 className="text-[32px] font-extrabold font-inter text-white uppercase mb-1.5">
                              {item.barber.display_name.split(" ")[0]}
                            </h2>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={InstagramIcon}
                                  alt="Instagram"
                                  className="w-[14px] h-[14px]"
                                />
                                <p className="text-[13px] font-medium font-inter text-white/90">
                                  {(() => {
                                    const ig =
                                      item.barber.display_name
                                        .match(/@[^\s(]+/)?.[0] || "";
                                    return ig;
                                  })()}
                                </p>
                              </div>
                              <span className="text-xs text-[#00FF00] border border-[#00FF00] px-2 py-1 rounded-full">
                                Available Now
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Curved bottom border with glow effect */}
                        <div className="absolute -bottom-[11.5px] left-1/2 -translate-x-1/2 w-56">
                          <img
                            src={LineBottomBorder}
                            alt=""
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col">

                    {/* Services Section */}
                    <div className="w-full">
                      {/* Desktop: Dropdown Button */}
                      <Button
                        onClick={() =>
                          toggleBarberServices(item.barber.team_member_id)
                        }
                        className="hidden md:flex w-full bg-black hover:bg-zinc-900 text-white justify-between h-14 md:h-16 py-4 md:py-5 border border-[#1CFF21] rounded-lg"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg md:text-xl font-semibold">View Services</span>
                          <span className="text-sm md:text-base text-gray-400">
                            {extractPriceRange(item.services)} AUD
                          </span>
                        </span>
                        {expandedBarber === item.barber.team_member_id ? (
                          <ChevronUp className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        ) : (
                          <ChevronDown className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </Button>

                      {/* Mobile: 2-Column Grid - Always Visible */}
                      <div className="md:hidden w-[85%] mx-auto grid grid-cols-2 gap-3">
                        {item.services.map((service) => (
                          <div
                            key={service.id}
                            className="bg-zinc-900/30 p-3 flex flex-col gap-2 border border-[#1CFF21] rounded-lg"
                          >
                            <div className="flex-1">
                              <h3 className="text-white text-xs font-bold font-inter text-center">
                                {cleanDisplayName(service.item_data.name)}
                              </h3>
                              <p className="text-zinc-400 text-xs mt-1 text-center">
                                {formatPrice(
                                  service.item_data.variations[0]
                                    .item_variation_data.price_money.amount
                                )}
                              </p>
                            </div>
                            <BookingListButton
                              onClick={() => handleBookNowClick(service, item.barber.team_member_id)}
                              className="w-full h-10 text-xs"
                            >
                              BOOK NOW
                            </BookingListButton>
                          </div>
                        ))}
                      </div>

                      {/* Desktop: Expandable Service List */}
                      {expandedBarber === item.barber.team_member_id && (
                        <div className="hidden md:block">
                          {item.services.map((service) => (
                            <div
                              key={service.id}
                              className="bg-black border-b border-[#1CFF21]"
                            >
                              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:py-6 md:pl-6 md:pr-0">
                                <div className="flex-1 md:min-w-0">
                                  <h3 className="text-white text-base md:text-lg font-medium font-inter text-center md:text-left">
                                    {cleanDisplayName(service.item_data.name)}
                                  </h3>
                                  <p className="text-zinc-400 text-sm mt-1 text-center md:text-left">
                                    {formatPrice(
                                      service.item_data.variations[0]
                                        .item_variation_data.price_money.amount
                                    )}
                                  </p>
                                </div>
                                <BookingListButton
                                  onClick={() => handleBookNowClick(service, item.barber.team_member_id)}
                                  className="w-full md:w-52 md:h-14 md:flex-shrink-0 whitespace-nowrap"
                                >
                                  BOOK NOW
                                </BookingListButton>
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
