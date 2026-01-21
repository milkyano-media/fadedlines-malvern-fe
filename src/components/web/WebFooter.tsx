import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "@/assets/web/icons/logo.svg";
import Instagram from "@/assets/web/icons/Instagram.svg";
import Tiktok from "@/assets/web/icons/Tiktok.svg";
import Maps from "@/assets/web/icons/Maps.svg";
import GoogleReview from "@/assets/web/icons/GoogleReview.svg";
import { useParameterValue } from "@/hooks/useParameter";

interface OpeningTime {
    day: string;
    hour: string;
}

const WebFooter: React.FC = () => {
    // Fetch footer parameters
    const googleAddressParameter = useParameterValue<string>("contact.google_maps_url", "https://g.co/kgs/sdqFwMj");
    const googleReviewParameter = useParameterValue<string>("contact.google_review_url", "https://shorturl.at/2UR17");
    const addressParameter = useParameterValue<string>(
        "contact.address",
        "163 GLENFERRIE RD, MALVERN 3144, VICTORIA"
    );
    const instagramUrlParameter = useParameterValue<string>(
        "contact.instagram_url",
        "https://www.instagram.com/fadedlinesmalvern"
    );
    const openingHoursParameter = useParameterValue<string>(
        "contact.business_hours",
        `[{"day":"Monday","hour":"12 PM - 6 PM"},{"day":"Tuesday","hour":"12 PM - 8 PM"},{"day":"Wednesday","hour":"12 PM - 8 PM"},{"day":"Thursday","hour":"10 AM - 8 PM"},{"day":"Friday","hour":"10 AM - 8 PM"},{"day":"Saturday","hour":"9 AM - 5 PM"},{"day":"Sunday","hour":"10 AM - 2 PM"}]`
    );
    const [openingHours, setOpeningHours] = useState<[OpeningTime]>();

    useEffect(() => {
        try {
            const parsedOpeningHoursParameter = JSON.parse(openingHoursParameter);
            setOpeningHours(parsedOpeningHoursParameter);
        } catch (err) {
            // ignored
        }
    }, [openingHoursParameter]);

    return (
        <footer className="flex flex-col">
            <section className="relative z-10">
                <div className="container mx-auto pt-0 pb-4 md:py-12 flex flex-col md:flex-row justify-center relative z-0">
                    <div className="flex flex-col pb-12 md:py-0 gap-10">
                        <img
                            src={Logo}
                            alt="barber shop faded lines"
                            className="w-[20rem] h-auto"
                        />
                        <div className="flex flex-col gap-4 relative z-[99999999]">
                            <h4 className="text-sm font-poppins font-medium">Visit us on:</h4>
                            <ul className="flex gap-4 font-light relative z-40">
                                <li>
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
                                </li>

                                <li>
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
                                </li>

                                <li>
                                    <a
                                        href={googleAddressParameter}
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
                                </li>

                                <li>
                                    <a
                                        href={googleReviewParameter}
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
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full md:w-2/3 mx-auto gap-4 md:gap-0 text-sm mr-6">
                        <div className="flex flex-col gap-4 relative z-40">
                            <h3 className="text-[#33FF00]">Pages</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400">
                                <li>
                                    <Link to="/" className="hover:text-white">
                                        HOME
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="hover:text-white">
                                        GALLERY
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about-us" className="hover:text-white">
                                        ABOUT US
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/careers" className="hover:text-white">
                                        CAREERS
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-white">
                                        CONTACT US
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-[#33FF00] mb-4">Address</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400 mb-10">
                                <li>
                                    <Link
                                        to={googleAddressParameter}
                                        target="_blank"
                                        className="hover:text-white"
                                    >
                                        {addressParameter}
                                    </Link>
                                </li>
                            </ul>
                            <h3 className="text-[#33FF00] mb-4">Hours</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400">
                                {openingHours &&
                                    openingHours.map((oh) => (
                                        <li key={oh.day}>
                                            <Link
                                                to={googleAddressParameter}
                                                target="_blank"
                                                className="hover:text-white"
                                            >
                                                {oh.day} {oh.hour}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default WebFooter;
