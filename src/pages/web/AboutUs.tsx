import AboutUsJosh1 from "@/assets/web/about-us/about_us_josh_1.png";
import TiktokAboutUs from "@/assets/web/about-us/about_us_tiktok.png";
import dummy from "@/assets/web/about-us/dummy.svg";
import plus from "@/assets/web/about-us/plus.svg";
import BgHero2 from "@/assets/web/home/hero.svg";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Layout from "@/components/web/WebLayout";
import { useParameterValue } from "@/hooks/useParameter";
import { Facebook, Instagram, Tiktok, Youtube } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";

const SocialMediaLinks: React.FC = () => {
    const socialMedia = [
        {
            name: "Instagram",
            icon: Instagram,
            url: "https://www.instagram.com/fadedlinesmalvern",
        },
        {
            name: "Facebook",
            icon: Facebook,
            url: "https://www.facebook.com/p/Faded-Lines-Barbershop-100066737611092/",
        },
        {
            name: "Tittok",
            icon: Tiktok,
            url: "https://www.tiktok.com/@faded_lines",
        },
        {
            name: "Youtube",
            icon: Youtube,
            url: "https://www.youtube.com/@Faded_Lines",
        },
    ];

    return (
        <div className="flex space-x-4">
            {socialMedia.map((item, index) => (
                <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-[#42FF00] hover:text-[#6ed449]"
                >
                    <item.icon className="w-8 h-auto" />
                    <span className="sr-only">{item.name}</span>
                </a>
            ))}
        </div>
    );
};

export default function AboutUs() {
    // Fetch about us headline parameter
    const aboutUsHeadline = useParameterValue<string>("content.about_us_headline", "About Fadedlines");
    const addressParameter = useParameterValue<string>(
        "contact.address",
        "163 GLENFERRIE RD; MALVERN 3144; VICTORIA"
    );

    return (
        <Layout>
            <Helmet>
                <title>About Us - Fadelines Barber Shop</title>
                <meta
                    name="description"
                    content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
                />
                <meta property="og:title" content="Fadelines Barber Shop" />
                <meta
                    property="og:description"
                    content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
                />
                <meta property="og:image" content="URL to Fadelines' preview image" />
                <meta property="og:url" content="URL to Fadelines' website" />
                <meta name="twitter:card" content="summary_large_image" />
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
                        <h2 className="text-[var(--text-color-primary)]">{aboutUsHeadline}</h2>
                        <sub className="mt-6">{addressParameter}</sub>
                    </div>

                    <svg className="w-7 mt-20" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                            fill="var(--primary-color)"
                        />
                    </svg>
                </div>
            </section>

            <section className="container flex flex-col md:flex-row">
                <div className="md:w-1/3">
                    <img
                        alt="background about us"
                        src={AboutUsJosh1}
                        className="hover:scale-110 transform transition-transform ease-out duration-500 cursor-pointer delay-75"
                    />
                </div>
                <div className="md:w-max flex flex-col justify-center items-center">
                    <img width={500} height={500} alt="background about us" src={plus} />

                    <div className="flex flex-col md:flex-row gap-10 mt-10 md:mt-0 md:w-2/4">
                        <h2 className="w-full">
                            Hey, I'm <br />
                            <span className="text-[var(--text-color-primary)]">Josh</span>
                        </h2>
                        <p>
                            Faded Lines Barbershop wants to bring convivence back into peoples lives. With appointments
                            and Walk-ins. Prices determined by demand and experience.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container flex justify-center">
                <div className="border border-[var(--border-color)] rounded-xl flex flex-col gap-6 md:gap-10 justify-center text-center items-center p-10 md:p-20 md:w-2/3">
                    <svg width="60" height="51" viewBox="0 0 60 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.833496 0.5V9.65C3.46995 9.97708 5.72204 11.0115 7.58975 12.7542C9.34704 14.4979 10.721 16.7312 11.7095 19.4542C12.5877 22.0687 13.0272 24.901 13.0272 27.951H1.82308V50.5H24.8929V30.075C24.8929 23.5396 23.7939 18.2021 21.597 14.0625C19.2908 9.92292 16.3241 6.76354 12.6991 4.58542C9.07308 2.40625 5.11787 1.04375 0.833496 0.5ZM35.2731 0.5V9.65C37.8002 9.97708 39.997 11.0115 41.8647 12.7542C43.622 14.4979 44.995 16.7312 45.9845 19.4542C46.8627 22.0687 47.3022 24.901 47.3022 27.951H36.097V50.5H59.1668V30.075C59.1668 23.5396 58.0679 18.2021 55.871 14.0625C53.5637 9.92292 50.5981 6.76354 46.9731 4.58542C43.3997 2.4247 39.4148 1.03325 35.2731 0.5Z"
                            fill="var(--primary-color)"
                        />
                    </svg>

                    <h1 className="text-transparent bg-gradient-to-b from-[var(--primary-color)] to-[var(--primary-color-35)] bg-clip-text">
                        Not Luck Of <br />
                        The Draw.
                    </h1>

                    <p className="md:w-2/3">
                        Faded Lines Barbershop provides great services at a professional standard. Having clients feel
                        welcome where professional barbers create a clean & safe environment to work and be around.
                    </p>

                    <p className="md:w-2/3">
                        Specializing in all types of hair textures, we will ensure to have you feeling and leaving
                        confident. From traditional styled & dapper haircuts, to smooth razor shaves and close fades.
                    </p>

                    <p className="md:w-2/3">
                        Our team is committed to giving you a great service with an even better outcome to all your hair
                        necessities.
                    </p>
                </div>
            </section>

            <section className="flex flex-col md:flex-row relative px-4 tracking-wider md:justify-center md:items-center  gap-12 md:gap-0 md:py-24">
                <div className="md:w-4/12 flex flex-col gap-8 md:pl-24">
                    <h3 className="text-4xl flex flex-col font-extrabold w-8/12">
                        WE ARE WELL KNOWN ON
                        <span className="text-[var(--text-color-primary)]">TIKTOK</span>
                    </h3>
                    <p className="text-sm font-light md:w-8/12">
                        Still doubt our ability to create the best haircuts in Melbourne? Check our Tiktok and see for
                        yourself.
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="border absolute md:relative bottom-[.5rem] md:bottom-[1rem] w-max px-7 py-5 rounded-lg border-[var(--border-color)] hover:border-white text-[var(--primary-color)] bg-transparent backdrop-blur-md z-30 transform hover:scale-110 transition-transform duration-400 ease-in-out hover:shadow-md hover:bg-[#14FF00] hover:shadow-[#14FF00] text-xs md:text-base hover:text-white">
                                FOLLOW US
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col items-center justify-center">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="pb-2">Find Us Here</AlertDialogTitle>
                                <AlertDialogDescription className="py-4 flex justify-center">
                                    <SocialMediaLinks />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex items-center sm:justify-center w-full px-4">
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="w-10/12 md:w-fit flex self-center md:self-start">
                    <img alt="background about us" src={TiktokAboutUs} className="" />
                </div>
            </section>

            <section className="container flex flex-col gap-20 mb-40">
                <h2>
                    Where Haircuts <br />
                    Are Done Right.
                </h2>
                <img src={dummy} alt="" />
            </section>
        </Layout>
    );
}
