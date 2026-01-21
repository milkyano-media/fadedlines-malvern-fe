import { Button } from "@/components/ui/button";
import CardStack from "@/components/web/CardStack";
import CarauselGallery from "@/components/web/OurWorks";
import Layout from "@/components/web/WebLayout";
import { useFeatureFlag, useParameterValue } from "@/hooks/useParameter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";

export default function GalleriesPage() {
    const ctaTextParameter = useParameterValue<string>("content.cta_primary_text", "Book Now");
    const bookEnabledParameter = useFeatureFlag("booking_enabled", true);

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

    const generateLink = (text: string): JSX.Element => {
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

        if (customize) {
            return <Link to={bookLink}>{text}</Link>;
        } else {
            return <a href={squareLink}>{text}</a>;
        }
    };

    const { scrollYProgress } = useScroll();
    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <Layout>
            <Helmet>
                <title>Gallery - Fadelines Barber Shop</title>
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

            <div className="flex flex-col text-stone-50 bg-black w-full relative mt-10 bg-theme-bg">
                <section className="py-12 pt-32 px-0 container pr-0  md:pr-4 relative z-30 flex gap-12 justify-center items-center flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-10/12 flex flex-col justify-end md:pb-24 h-full">
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-wider flex flex-col md:gap-2 text-center md:text-right">
                            <span className="text-[var(--text-color-secondary)]">BE OUR NEXT</span>
                            <span className="text-transparent bg-[var(--text-color-primary)] bg-clip-text">
                                MASTERPIECE
                            </span>
                        </h3>
                        <Button
                            className="bg-[#454545] border-[0.5px] border-white text-2xl text-[var(--text-color-primary)] font-bold px-16 py-7 w-max self-center md:self-end mt-6 hover:bg-[#454545]/80"
                            disabled={!bookEnabledParameter}
                        >
                            {generateLink(ctaTextParameter)}
                        </Button>
                    </div>
                    <div className="relative w-full min-h-[25rem] md:min-h-[40rem]">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="w-full h-full flex justify-end md:justify-center items-center rotate-[10deg] md:rotate-[12deg]">
                                <CardStack />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50 pointer-events-none"></div>
                    </div>
                </section>

                <div className=" w-full flex justify-center py-12 relative">
                    <div className="h-40 w-[1px] bg-[var(--primary-color-20)] z-0" />
                    <motion.div
                        className="absolute h-[18rem] w-[2px] bg-gradient-to-b from-[var(--primary-color-20)] to-[var(--primary-color-50)] shadow-tiny shadow-[var(--primary-color-50)] origin-top z-10"
                        style={{ scaleY }}
                    />
                </div>

                <section className="relative z-[99999999] pb-[10rem] md:pb-[30rem] pt-12">
                    <section className=" w-full relative flex flex-col items-center text-center  container">
                        <div className="w-full px-4 md:px-0 flex flex-col gap-4 ">
                            <h3 className="text-[var(--text-color-secondary)] text-2xl md:text-3xl tracking-wider font-extrabold w-full md:w-1/3 mx-auto font-poppins">
                                WE'VE DONE ALL
                                <br />
                                <span className="text-transparent bg-[var(--text-color-primary)] bg-clip-text">
                                    YOU EVER NEED
                                </span>
                            </h3>
                        </div>
                    </section>

                    <section className="relative z-[99999] flex flex-col gap-2  py-4 container mx-0 max-w-none px-0">
                        <CarauselGallery />
                    </section>
                </section>
            </div>
        </Layout>
    );
}
