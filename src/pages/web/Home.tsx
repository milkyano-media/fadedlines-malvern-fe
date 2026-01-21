import Layout from "@/components/web/WebLayout";
import { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import BookNowButton from "@/components/web/BookNowButton";
import BgHero2 from "@/assets/web/home/hero.svg";
import Logo from "@/assets/web/icons/logo.svg";
import Instagram from "@/assets/web/icons/Instagram.svg";
import Tiktok from "@/assets/web/icons/Tiktok.svg";
import Maps from "@/assets/web/icons/Maps.svg";
import GoogleReview from "@/assets/web/icons/GoogleReview.svg";
import useEmblaCarousel from "embla-carousel-react";
import { useParameterValue } from "@/hooks/useParameter";

// Preview images (for large preview)
import Josh from "@/assets/web/barbers/josh.png";

// Gallery images (for grid thumbnails)
import JoshGallery from "@/assets/web/barbers/barbers-gallery/josh.png";

// CTA Button SVGs - Barber-specific
import JoshCTA from "@/assets/web/barbers/cta-button/josh.svg";
import JoshCTAHover from "@/assets/web/barbers/cta-button/josh-hover.svg";

export const generateLink = (text: string, disabled: boolean = false, disabledText: string = ""): JSX.Element => {
  const customize: boolean = true;
  const squareLink: string =
    "https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services";

  let bookLink: string;
  const parts = location.pathname.split("/");
  if (parts[1] === "meta") {
    bookLink = `/meta/book/services`;
  } else {
    bookLink = "/book/services";
  }

  if (disabled) {
    return <span>{disabledText || text}</span>;
  }

  if (customize) {
    return <Link to={bookLink}>{text}</Link>;
  } else {
    return <a href={squareLink}>{text}</a>;
  }
};

export default function Home() {
  localStorage.removeItem("booking_source");

  const location = useLocation();

  // Fetch parameters
  const instagramUrlParameter = useParameterValue<string>(
    "contact.instagram_url",
    "https://www.instagram.com/fadedlinesmalvern"
  );
  const googleMapsUrlParameter = useParameterValue<string>(
    "contact.google_maps_url",
    "https://g.co/kgs/sdqFwMj"
  );

  // Gallery state management
  const [selectedBarber, setSelectedBarber] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const previewImageRef = useRef<HTMLDivElement>(null);
  const bookNowButtonRef = useRef<HTMLDivElement>(null);

  // Embla Carousel setup with infinite loop
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
  });

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const fbclid = queryParams.get("fbclid");
  const ttclid = queryParams.get("ttclid");
  const gclid = queryParams.get("gclid");

  const trackingData = {
    utm_source: queryParams.get("utm_source"),
    utm_medium: queryParams.get("utm_medium"),
    utm_campaign: queryParams.get("utm_campaign"),
    utm_content: queryParams.get("utm_content"),
    fbclid: queryParams.get("fbclid"),
  };

  localStorage.setItem("booking_source", JSON.stringify(trackingData));

  if (trackingData.fbclid && trackingData.utm_source) {
    localStorage.setItem("customer_source", JSON.stringify(trackingData));
  }

  localStorage.setItem("utm_source", queryParams.get("utm_source") || "None");
  localStorage.setItem("utm_medium", queryParams.get("utm_medium") || "None");
  localStorage.setItem(
    "utm_campaign",
    queryParams.get("utm_campaign") || "None",
  );
  localStorage.setItem("utm_content", queryParams.get("utm_content") || "None");

  if (fbclid) {
    localStorage.setItem("booking_origin", "facebook");
  } else if (ttclid) {
    localStorage.setItem("booking_origin", "tiktok");
  } else if (gclid) {
    localStorage.setItem("booking_origin", "google");
  } else {
    localStorage.setItem("booking_origin", "organic");
  }

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === "meta") {
      return `/meta${route}`;
    } else {
      return route;
    }
  };

  const barberSvgs = [
    {
      svg: Josh,
      thumbnail: JoshGallery,
      link: generateRoute("/josh"),
      landing: true,
    },
  ];

  // CTA Button mapping for each barber
  const barberCTAButtons = [
    { normal: JoshCTA, hover: JoshCTAHover },      // 0: Josh
  ];

  // Transform barberSvgs into gallery-friendly format
  const galleryBarbers = barberSvgs.map((barber, index) => ({
    image: barber.svg, // For preview/placeholder
    thumbnail: barber.thumbnail, // For grid thumbnails
    name: barber.link.split('/').pop()?.toUpperCase() || `BARBER ${index + 1}`,
    link: barber.link,
    landing: barber.landing,
  }));

  // Embla: Sync selected slide with state
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedBarber(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handler for hero Book Now button - scroll to gallery Book Now
  const handleHeroBookNowClick = () => {
    if (bookNowButtonRef.current) {
      const isMobile = window.innerWidth < 768;
      const yOffset = isMobile ? -550 : -700;
      const y = bookNowButtonRef.current.getBoundingClientRect().top +
                window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Interaction handlers for gallery
  const handleThumbnailClick = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Use Embla to scroll to the selected index
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }

    // Smooth scroll to preview with offset
    setTimeout(() => {
      if (previewImageRef.current) {
        // Responsive offset: mobile vs desktop
        const isMobile = window.innerWidth < 768; // Tailwind 'md' breakpoint
        const yOffset = isMobile ? -220 : -150; // Mobile needs more offset
        const y = previewImageRef.current.getBoundingClientRect().top +
                  window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNameClick = (index: number) => {
    // Use Embla to scroll to the selected index
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }

    // Scroll to preview
    setTimeout(() => {
      if (previewImageRef.current) {
        // Responsive offset: mobile vs desktop
        const isMobile = window.innerWidth < 768; // Tailwind 'md' breakpoint
        const yOffset = isMobile ? -220 : -150; // Mobile needs more offset
        const y = previewImageRef.current.getBoundingClientRect().top +
                  window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  useEffect(() => {
    // Create a new style element
    const style = document.createElement("style");

    // Define the animation
    style.innerHTML = `
        @keyframes move {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
        }`;

    // Append the style element to the document head
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Layout gap="gap-0">
      <Helmet>
        <title>Home - Fadelines Barber Shop</title>
        <meta
          name="description"
          content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
        />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta
          property="og:description"
          content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
        />
        <meta property="og:img" content="URL to Fadelines' preview img" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_img" />
      </Helmet>

      <section className="flex flex-col justify-center items-center relative pt-28 md:pt-40">
        <img
          alt="hero image"
          width={500}
          height={500}
          src={BgHero2}
          className="top-0 absolute w-full h-full object-cover -z-10"
        />
        <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-black/80 to-black" />
        <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
          <div className="flex flex-col">
            <img
              src={Logo}
              alt="Fadedlines Barber Shop"
              className="w-[20rem] md:w-[25rem] h-auto"
            />
          </div>
          <BookNowButton onClick={handleHeroBookNowClick} className="px-14 md:px-16 py-4 md:py-5" />

          <div className="flex gap-4 mt-4">
            <a
              href={instagramUrlParameter}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
              }}
            >
              <img alt="Instagram" src={Instagram} className="w-12 h-auto" />
            </a>
            <a
              href="https://www.tiktok.com/@faded_lines"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
              }}
            >
              <img alt="TikTok" src={Tiktok} className="w-12 h-auto" />
            </a>
            <a
              href={googleMapsUrlParameter}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
              }}
            >
              <img alt="Google Maps" src={Maps} className="w-12 h-auto" />
            </a>
            <a
              href="https://shorturl.at/2UR17"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))';
              }}
            >
              <img alt="Google Review" src={GoogleReview} className="w-12 h-auto" />
            </a>
          </div>

          <svg
            className="w-7 mt-8 md:mt-12"
            viewBox="0 0 55 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
              fill="#33FF00"
            />
          </svg>
        </div>
      </section>

      <section className="relative z-20 w-full flex flex-col justify-center md:max-w-screen-xl mx-auto pt-0 pb-0 md:pt-2 md:pb-[4rem] mb-[-2rem] md:mb-0">
        <div className="container mx-auto px-2 md:px-8 scale-[90%] md:scale-100 origin-top">

          {/* BARBER NAME CAROUSEL HEADER */}
          <div
            ref={emblaRef}
            className="relative overflow-hidden mb-6 md:mb-8 pt-2 pb-[5px]"
          >
            <div className="flex items-center justify-center">
              {galleryBarbers.map((barber, index) => {
                return (
                  <div
                    key={index}
                    className="flex-[0_0_auto] min-w-0 px-2 md:px-4"
                  >
                    <button
                      onClick={() => handleNameClick(index)}
                      className={`relative flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6 py-1 transition-all duration-500 cursor-pointer ${
                        selectedBarber === index
                          ? "text-[#33FF00]"
                          : "text-stone-500"
                      }`}
                    >
                  {/* Thumbnail Image */}
                  <div className={`w-20 h-20 md:w-32 md:h-32 rounded-md overflow-hidden ${
                    selectedBarber === index
                      ? "ring-2 ring-[#33FF00]"
                      : ""
                  }`}>
                    <img
                      src={barber.thumbnail}
                      alt={barber.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Barber Name with underline wrapper */}
                  <div className="relative pb-0">
                    <span className="text-lg md:text-4xl font-bold font-poppins whitespace-nowrap">
                      {barber.name}
                    </span>

                    {/* GREEN UNDERLINE for active */}
                    {selectedBarber === index && (
                      <div className="absolute bottom-[-8px] md:bottom-[-10px] left-0 right-0 h-[2px] md:h-[4px] bg-[#33FF00]"></div>
                    )}
                  </div>

                  {/* DIMMED GREEN SPOTLIGHT GRADIENT EFFECT - From Bottom Up */}
                  {selectedBarber === index && (
                    <>
                      {/* Main spotlight layer - narrower and positioned below */}
                      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                        <div
                          className="absolute left-1/2 -translate-x-1/2"
                          style={{
                            width: '180%',
                            height: '250%',
                            bottom: '-15%',
                            background: "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(51,255,0,0.35) 0%, rgba(51,255,0,0.22) 15%, rgba(51,255,0,0.12) 30%, rgba(51,255,0,0.05) 50%, rgba(51,255,0,0) 75%)",
                            filter: "blur(18px)",
                          }}
                        />
                      </div>
                      {/* Secondary glow layer - even narrower */}
                      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                        <div
                          className="absolute left-1/2 -translate-x-1/2"
                          style={{
                            width: '140%',
                            height: '200%',
                            bottom: '-10%',
                            background: "radial-gradient(ellipse 70% 45% at 50% 100%, rgba(51,255,0,0.3) 0%, rgba(51,255,0,0.18) 25%, rgba(51,255,0,0.08) 45%, rgba(51,255,0,0) 70%)",
                            filter: "blur(10px)",
                          }}
                        />
                      </div>
                    </>
                  )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN PREVIEW IMAGE */}
          <div
            ref={previewImageRef}
            className="max-w-[240px] md:max-w-sm mx-auto mb-4 md:mb-8 overflow-hidden rounded-xl shadow-lg aspect-[0.7]"
          >
            <img
              key={selectedBarber}
              src={galleryBarbers[selectedBarber].image}
              alt={galleryBarbers[selectedBarber].name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* GREEN DIVIDER LINE WITH CTA BUTTON */}
          <div ref={bookNowButtonRef} className="w-full max-w-screen-md mx-auto mb-4 md:mb-6 relative flex items-center justify-center">
            <div className="absolute w-full h-[2px] bg-[#33FF00]"></div>
            <div className="relative z-10 px-4 bg-black">
              <Link to={`${generateRoute(`/${galleryBarbers[selectedBarber].name.toLowerCase()}/book/services`)}`}>
                <img
                  src={isButtonHovered ? barberCTAButtons[selectedBarber].hover : barberCTAButtons[selectedBarber].normal}
                  alt={`Book With ${galleryBarbers[selectedBarber].name}`}
                  className="w-auto cursor-pointer h-[90px] md:h-[130px]"
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                />
              </Link>
            </div>
          </div>

          {/* THUMBNAIL GRID (centered for single barber) */}
          <div className="max-w-screen-md mx-auto relative px-1 md:px-0">
            <div className="flex justify-center gap-4 md:gap-9">
              {galleryBarbers.map((barber, index) => (
                <div
                  key={index}
                  onClick={(e) => handleThumbnailClick(index, e)}
                  className={`w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-md md:rounded-lg transition-all duration-200 cursor-pointer relative ${
                    selectedBarber === index
                      ? "ring-2 md:ring-4 ring-[#33FF00] scale-100"
                      : "hover:opacity-80 hover:scale-105"
                  }`}
                >
                <img
                  src={barber.thumbnail}
                  alt={barber.name}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
              </div>
              ))}
            </div>

            {/* Grid Pattern Divider Lines */}
            {/* Vertical line between column 1 and 2 */}
            <div className="absolute top-0 left-[33.33%] w-[1px] md:w-[2px] h-full bg-[#33FF00] pointer-events-none" style={{ transform: 'translateX(-0.5px)' }}></div>

            {/* Vertical line between column 2 and 3 */}
            <div className="absolute top-0 left-[66.66%] w-[1px] md:w-[2px] h-full bg-[#33FF00] pointer-events-none" style={{ transform: 'translateX(-0.5px)' }}></div>

            {/* Horizontal line after row 1 (33.33% down) - Commented out because it cuts through photo with single barber */}
            {/* <div className="absolute left-0 top-[33.33%] w-full h-[1px] md:h-[2px] bg-[#33FF00] pointer-events-none" style={{ transform: 'translateY(-0.5px)' }}></div> */}

            {/* Horizontal line after row 2 (66.66% down) - Commented out because it cuts through photo with single barber */}
            {/* <div className="absolute left-0 top-[66.66%] w-full h-[1px] md:h-[2px] bg-[#33FF00] pointer-events-none" style={{ transform: 'translateY(-0.5px)' }}></div> */}
          </div>

        </div>
      </section>
    </Layout>
  );
}
