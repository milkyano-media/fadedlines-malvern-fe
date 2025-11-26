import BgHero2 from "@/assets/web/home/hero.svg";
import Facebook from "@/assets/web/icons/Facebook.svg";
import Instagram from "@/assets/web/icons/Instagram.svg";
import Logo from "@/assets/web/icons/logo.svg";
import Tiktok from "@/assets/web/icons/Tiktok.svg";
import Youtube from "@/assets/web/icons/Youtube.svg";
import { useFeatureFlag, useParameterValue } from "@/hooks/useParameter";
import { generateLink } from "@/pages/web/Home";
import { useTheme } from "@/ThemeProvider";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface OpeningTime {
    day: string;
    hour: string;
}

const WebFooter: React.FC = () => {
    // Fetch footer parameters
    const footerTagline = useParameterValue<string>("content.footer_tagline", "Your style, our passion");
    const { theme } = useTheme();
    const logoUrl = useParameterValue<string>("branding.logo", "");
    const logoUrlDark = useParameterValue<string>("branding.logo_dark", "");
    const currentLogo = theme === "dark" && logoUrlDark ? logoUrlDark : logoUrl || null;
    const googleAddressParameter = useParameterValue<string>("contact.google_maps_url", "https://g.co/kgs/sdqFwMj");
    const addressParameter = useParameterValue<string>(
        "contact.address",
        "163 GLENFERRIE RD; MALVERN 3144; VICTORIA"
    );
    const instagramUrlParameter = useParameterValue<string>(
        "contact.instagram_url",
        "https://www.instagram.com/fadedlinesmalvern"
    );
    const facebookUrlParameter = useParameterValue<string>(
        "contact.facebook_url",
        "https://www.facebook.com/p/Faded-Lines-Barbershop-100066737611092/"
    );
    const openingHoursParameter = useParameterValue<string>(
        "contact.business_hours",
        `[{"day":"Monday","hour":"12 PM - 6 PM"},{"day":"Tuesday","hour":"12 PM - 8 PM"},{"day":"Wednesday","hour":"12 PM - 8 PM"},{"day":"Thursday","hour":"10 AM - 8 PM"},{"day":"Friday","hour":"10 AM - 8 PM"},{"day":"Saturday","hour":"9 AM - 5 PM"},{"day":"Sunday","hour":"10 AM - 2 PM"}]`
    );
    const ctaTextParameter = useParameterValue<string>("content.cta_primary_text", "Book Now");
    const [openingHours, setOpeningHours] = useState<[OpeningTime]>();
    useEffect(() => {
        try {
            const parsedOpeningHoursParameter = JSON.parse(openingHoursParameter);
            setOpeningHours(parsedOpeningHoursParameter);
        } catch (err) {
            // ignored
        }
    }, [openingHoursParameter]);
    const bookEnabledParameter = useFeatureFlag("booking_enabled", true);
    const ctaStyle = function () {
        let result =
            "bg-[#454545] border-[0.5px] border-white text-2xl text-[var(--text-color-primary)] font-bold px-20 md:px-40 py-7 w-max self-center hover:bg-[#454545]/80 rounded-md transition-colors";

        if (!bookEnabledParameter) {
            result += " opacity-50 cursor-not-allowed";
        }

        return result;
    };

    return (
        <footer className="flex flex-col">
            <section className="flex flex-col justify-center items-center relative py-60">
                <img
                    alt="hero image"
                    width={500}
                    height={500}
                    src={BgHero2}
                    className="top-0 absolute w-full h-full object-cover -z-10"
                />
                <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-black/80 to-black/90" />
                <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
                    <div className="flex flex-col mb-6">
                        <h2>SAVE TIME AND</h2>
                        <h1 className="text-[var(--text-color-primary)]">BOOK NOW</h1>
                    </div>
                    <span className={ctaStyle()}>
                        {generateLink(ctaTextParameter, !bookEnabledParameter, "Booking Unavailable")}
                    </span>

                    <div className="flex gap-4 md:gap-10">
                        <p>
                            We served over <span className="text-[var(--text-color-primary)]">5000+</span>
                        </p>
                        <p className="flex gap-2">
                            Happy Customers+{" "}
                            <svg className="w-6" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.5 0.375C12.6075 0.375 9.77986 1.23274 7.37479 2.83976C4.96972 4.44677 3.0952 6.73089 1.98827 9.40325C0.881337 12.0756 0.591713 15.0162 1.15602 17.8532C1.72033 20.6902 3.11323 23.2961 5.15857 25.3414C7.20391 27.3868 9.80984 28.7797 12.6468 29.344C15.4838 29.9083 18.4244 29.6187 21.0968 28.5117C23.7691 27.4048 26.0532 25.5303 27.6602 23.1252C29.2673 20.7201 30.125 17.8926 30.125 15C30.1209 11.1225 28.5788 7.40492 25.8369 4.66309C23.0951 1.92125 19.3775 0.379095 15.5 0.375ZM15.5 27.375C13.0525 27.375 10.6599 26.6492 8.62482 25.2894C6.58977 23.9297 5.00363 21.9969 4.067 19.7357C3.13036 17.4745 2.8853 14.9863 3.36279 12.5858C3.84028 10.1852 5.01889 7.98023 6.74956 6.24955C8.48024 4.51888 10.6852 3.34027 13.0858 2.86278C15.4863 2.38529 17.9745 2.63036 20.2357 3.56699C22.497 4.50363 24.4297 6.08976 25.7894 8.12482C27.1492 10.1599 27.875 12.5525 27.875 15C27.8713 18.2809 26.5663 21.4264 24.2463 23.7463C21.9264 26.0663 18.7809 27.3713 15.5 27.375ZM8.75001 12.1875C8.75001 11.8537 8.84898 11.5275 9.0344 11.25C9.21983 10.9725 9.48338 10.7562 9.79173 10.6285C10.1001 10.5007 10.4394 10.4673 10.7667 10.5324C11.0941 10.5975 11.3947 10.7583 11.6307 10.9943C11.8668 11.2303 12.0275 11.5309 12.0926 11.8583C12.1577 12.1856 12.1243 12.5249 11.9966 12.8333C11.8688 13.1416 11.6525 13.4052 11.375 13.5906C11.0975 13.776 10.7713 13.875 10.4375 13.875C9.98995 13.875 9.56073 13.6972 9.24426 13.3807C8.9278 13.0643 8.75001 12.6351 8.75001 12.1875ZM22.25 12.1875C22.25 12.5213 22.151 12.8475 21.9656 13.125C21.7802 13.4025 21.5166 13.6188 21.2083 13.7465C20.8999 13.8743 20.5606 13.9077 20.2333 13.8426C19.9059 13.7775 19.6053 13.6167 19.3693 13.3807C19.1333 13.1447 18.9725 12.8441 18.9074 12.5167C18.8423 12.1894 18.8757 11.8501 19.0035 11.5417C19.1312 11.2334 19.3475 10.9698 19.625 10.7844C19.9025 10.599 20.2288 10.5 20.5625 10.5C21.0101 10.5 21.4393 10.6778 21.7557 10.9943C22.0722 11.3107 22.25 11.7399 22.25 12.1875ZM22.0995 18.9375C20.6525 21.4392 18.2464 22.875 15.5 22.875C12.7536 22.875 10.3489 21.4406 8.90188 18.9375C8.82048 18.8095 8.76583 18.6663 8.7412 18.5166C8.71658 18.3668 8.72249 18.2137 8.75859 18.0663C8.79469 17.9189 8.86022 17.7804 8.95125 17.659C9.04228 17.5376 9.15693 17.4359 9.28829 17.36C9.41965 17.284 9.56501 17.2355 9.71563 17.2172C9.86625 17.1989 10.019 17.2112 10.1647 17.2535C10.3105 17.2958 10.4461 17.3671 10.5636 17.4632C10.681 17.5592 10.7778 17.6781 10.8481 17.8125C11.8986 19.628 13.5495 20.625 15.5 20.625C17.4505 20.625 19.1014 19.6266 20.1505 17.8125C20.2997 17.554 20.5454 17.3654 20.8337 17.2882C21.1219 17.2109 21.429 17.2513 21.6875 17.4005C21.946 17.5497 22.1346 17.7954 22.2119 18.0836C22.2891 18.3719 22.2487 18.679 22.0995 18.9375Z"
                                    fill="var(--text-color-primary)"
                                />
                            </svg>
                        </p>
                    </div>
                </div>
            </section>

            <section className="relative z-10">
                <div className="container mx-auto py-12 flex flex-col md:flex-row  justify-between relative z-0">
                    <div className="flex flex-col pb-12 md:py-0 gap-10">
                        <div className="flex flex-col gap-3">
                            <img src={currentLogo || Logo} alt="barber shop faded lines" className="w-[20rem] h-auto" />
                            {footerTagline && <p className="text-sm text-stone-400 italic">{footerTagline}</p>}
                        </div>
                        <div className="flex flex-col gap-4 relative z-[99999999]">
                            <h4 className="text-sm font-poppins font-medium">Visit us on:</h4>
                            <ul className="flex gap-4 font-light relative z-40">
                                <li>
                                    <a
                                        href={instagramUrlParameter}
                                        className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 relative z-50"
                                    >
                                        <img alt="instagram" src={Instagram} className="w-12 h-auto" />
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href={facebookUrlParameter}
                                        className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 "
                                    >
                                        <img alt="Facebook" src={Facebook} className="w-12 h-auto" />
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.tiktok.com/@faded_lines"
                                        className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 "
                                    >
                                        <img alt="Tiktok" src={Tiktok} className="w-12 h-auto" />
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.youtube.com/@Faded_Lines"
                                        className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 "
                                    >
                                        <img alt="Youtube" src={Youtube} className="w-12 h-auto" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full md:w-2/3 gap-4 md:gap-0 text-sm">
                        <div className="flex flex-col gap-4 relative z-40">
                            <h3 className="text-[var(--text-color-primary)]">Pages</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400">
                                <li>
                                    <Link to="/" className="hover:text-white">
                                        HOME
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/barbers" className="hover:text-white">
                                        BARBERS
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="hover:text-white">
                                        GALLERY
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="hover:text-white">
                                        ABOUT US
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/careers" className="hover:text-white">
                                        CAREERS
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href=" https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services"
                                        className="hover:text-white"
                                    >
                                        CONTACT US
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-[var(--text-color-primary)] mb-4">Address</h3>
                            <ul className="flex flex-col font-light gap-2 text-stone-400 mb-10">
                                <li>
                                    <Link to={googleAddressParameter} target="_blank" className="hover:text-white">
                                        {addressParameter}
                                    </Link>
                                </li>
                            </ul>
                            <h3 className="text-[var(--text-color-primary)] mb-4">Hours</h3>
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
