import BgHero2 from "@/assets/web/home/hero.svg";
import { Button } from "@/components/ui/button";
import Layout from "@/components/web/WebLayout";
import { useParameterValue } from "@/hooks/useParameter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";

interface Barbers {
    imageUrl: string;
    link: string;
    landing: boolean;
}

export default function Barbers() {
    localStorage.removeItem("booking_source");

    const location = useLocation();

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
    localStorage.setItem("utm_campaign", queryParams.get("utm_campaign") || "None");
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

    const generateLink = () => {
        const squareLink: string =
            "https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services";

        let bookLink: string;
        const parts = location.pathname.split("/");
        if (parts[1] === "meta") {
            bookLink = `/meta/book/services`;
        } else {
            bookLink = "/book/services";
        }

        const customize: boolean = true;
        if (customize) {
            return bookLink;
        } else {
            return squareLink;
        }
    };
    const barbersParameter = useParameterValue<string>(
        "content.barber_list",
        JSON.stringify([
            {
                imageUrl: "https://s3.milkyano.com/milkyano/fadedlines-oakleigh/barbers/josh.png",
                link: generateRoute("/josh"),
                landing: true,
            },
        ])
    );
    const [barbers, setBarbers] = useState<[Barbers]>();

    useEffect(() => {
        setBarbers(JSON.parse(barbersParameter));
    }, [barbersParameter]);

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
        <Layout>
            <Helmet>
                <title>Barbers - Fadelines Barber Shop</title>
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

            <section className="flex flex-col justify-center items-center relative pt-40">
                <img
                    alt="hero image"
                    width={500}
                    height={500}
                    src={BgHero2}
                    className="top-0 absolute w-full h-full object-cover -z-10"
                />
                <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-black/80 to-black" />
                <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
                    <div className="flex flex-col mb-12">
                        <h2>MEET OUR</h2>
                        <h2 className="text-[var(--text-color-primary)]">BARBERS</h2>
                    </div>

                    <svg className="w-7 mt-20" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                            fill="var(--primary-color)"
                        />
                    </svg>
                </div>
            </section>

            <section className="w-full min-h-screen flex  justify-center md:max-w-screen-xl   mx-auto md:py-24 pb-[12rem] md:pb-[4rem] mb-12 relative">
                <div className="w-full flex flex-wrap mx-auto justify-center items-center px-4 md:px-0">
                    {barbers &&
                        barbers.map((barber, index) => (
                            <Link
                                to={barber.landing ? barber.link : generateLink()}
                                key={index}
                                className="w-full md:w-[300px] py-6 flex flex-col justify-center items-center relative mx-10"
                            >
                                <img
                                    src={barber.imageUrl}
                                    alt={`Svg ${index}`}
                                    className="transition-transform duration-500 ease-in-out hover:scale-110 z-30 px-4 md:px-0 mb-12"
                                />
                                <Button className="border absolute md:relative bottom-[.5rem] md:bottom-[1rem] px-7 py-5 rounded-lg border-[var(--border-color)] hover:border-white text-[var(--primary-color)] bg-transparent backdrop-blur-md z-30 transform hover:scale-110 transition-transform duration-400 ease-in-out hover:shadow-md hover:bg-[#14FF00] hover:shadow-[#14FF00] text-xs md:text-base hover:text-white">
                                    LEARN MORE
                                </Button>
                            </Link>
                        ))}
                </div>
            </section>
        </Layout>
    );
}
