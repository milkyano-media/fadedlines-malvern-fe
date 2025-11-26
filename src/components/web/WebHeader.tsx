// TEMPORARILY HIDDEN - Imports for login functionality
// import { LoginModal } from "@/components/auth/LoginModal";
import Logo from "@/components/react-svg/logo";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
// import { useAuth } from "@/hooks/useAuth";
import { useFeatureFlag, useParameterValue } from "@/hooks/useParameter";
import { generateLink } from "@/pages/web/Home";
import { useTheme } from "@/ThemeProvider";
// import { LogOut, Settings, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { Button } from "../ui/button";

interface NavLinkProps {
    to: string;
    label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
    const location = useLocation();

    return (
        <li className="my-4">
            <Link
                to={to}
                className={`text-2xl font-light hover:text-white ${location.pathname === to ? "text-white" : ""}`}
            >
                {label}
            </Link>
        </li>
    );
};

const links = [
    { to: "/", label: "Home" },
    { to: "/barbers", label: "Barbers" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about-us", label: "About Us" },
    { to: "/careers", label: "Careers" },
    { to: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // TEMPORARILY HIDDEN - Login state and auth
    // const [showLoginModal, setShowLoginModal] = useState(false);
    const location = useLocation();
    // const navigate = useNavigate();
    // const { isAuthenticated, user, logout } = useAuth();

    // Fetch logo parameters
    const { theme } = useTheme();
    const logoUrl = useParameterValue<string>("branding.logo", "");
    const logoUrlDark = useParameterValue<string>("branding.logo_dark", "");

    // Use dark logo if theme is dark and dark logo exists, otherwise use regular logo, fallback to Logo component
    const currentLogo = theme === "dark" && logoUrlDark ? logoUrlDark : logoUrl || null;

    const ctaTextParameter = useParameterValue<string>("content.cta_primary_text", "Book Now");
    const bookEnabledParameter = useFeatureFlag("booking_enabled", true);

    const generateRoute = (route: string): string => {
        const parts = location.pathname.split("/");
        if (parts[1] === "meta") {
            return `/meta${route}`;
        } else {
            return route;
        }
    };

    const [height, setHeight] = useState(0);
    const headerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (headerRef.current) {
            setHeight(headerRef.current.offsetHeight);
        }

        const handleResize = () => {
            if (headerRef.current) {
                setHeight(headerRef.current.offsetHeight);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const ctaStyle = function() {
        let result =
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/80 text-black h-9 px-8 py-5";

        if (!bookEnabledParameter) {
            result += ` opacity-50 cursor-not-allowed`;
        }

        return result;
    }

    return (
        <header
            ref={headerRef}
            className="text-white shadow-lg shadow-[--shadow-color] border-b-[0.5px] border-[var(--border-color)] z-50 py-4 sticky top-0"
            style={{
                marginBottom: `-${height}px`,
                background: "linear-gradient(180deg, rgba(3, 18, 13, 0.75) 14.29%, rgba(3, 18, 13, 0.6) 100%)",
            }}
        >
            <div className="container mx-auto flex justify-between items-center relative border-none px-2 md:px-4">
                <h1 className="text-2xl font-bold text-transparent hidden ">Barber Shop</h1>
                <div className="flex flex-col justify-center items-center">
                    <Link to={generateRoute("/home")}>
                        {currentLogo ? (
                            <img src={currentLogo} alt="logo" className="w-48 md:w-36 h-auto opacity-90" />
                        ) : (
                            <Logo className="w-48 md:w-36 h-auto opacity-90 " />
                        )}
                    </Link>
                </div>
                <nav className="hidden lg:block sticky top-0">
                    <ul className="flex text-white/80">
                        <li>
                            <Link
                                to={generateRoute("/home")}
                                className={`text-md uppercase font-bold px-4 hover:text-white ${
                                    location.pathname === "/" ? "text-white" : ""
                                }`}
                            >
                                HOME
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={generateRoute("/barbers")}
                                className={`text-md uppercase font-bold px-4 hover:text-white ${
                                    location.pathname === "/barbers" ? "text-white" : ""
                                }`}
                            >
                                BARBERS
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={generateRoute("/gallery")}
                                className={`text-md uppercase font-bold px-4 hover:text-white ${
                                    location.pathname === "/gallery" ? "text-white" : ""
                                }`}
                            >
                                GALLERY
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={generateRoute("/about-us")}
                                className={`text-md uppercase font-bold px-4 hover:text-white ${
                                    location.pathname === "/about-us" ? "text-white" : ""
                                }`}
                            >
                                ABOUT US
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={generateRoute("/careers")}
                                className={`text-md uppercase font-bold px-4 hover:text-white ${
                                    location.pathname === "/careers" ? "text-white" : ""
                                }`}
                            >
                                Careers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={generateRoute("/contact")}
                                className={`text-md uppercase font-bold   px-4 hover:text-white ${
                                    location.pathname === "/contact" ? "text-white" : ""
                                }`}
                            >
                                CONTACT
                            </Link>
                        </li>
                    </ul>
                </nav>
                <nav className="hidden xl:flex gap-4 items-center">
                    {/* TEMPORARILY HIDDEN - Login button */}
                    {/* {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{user.firstName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-[#0a0a0a] border border-stone-700 z-[9999] shadow-lg shadow-black/50"
                                sideOffset={5}
                            >
                                <DropdownMenuLabel className="text-stone-300 font-medium">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-stone-700" />
                                <DropdownMenuItem asChild>
                                    <Link to="/account" className="flex items-center cursor-pointer hover:bg-stone-900">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Account Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-stone-700" />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="flex items-center cursor-pointer text-red-400 hover:text-red-400 focus:text-red-400 hover:bg-red-950/30"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <Button
                                variant="ghost"
                                onClick={() => setShowLoginModal(true)}
                                className="text-white hover:bg-white/10"
                            >
                                Log In
                            </Button>
                        </div>
                    )} */}
                    <span className={ctaStyle()}>
                        {generateLink(ctaTextParameter, !bookEnabledParameter, "Booking Unavailable")}
                    </span>
                </nav>
                <nav className="xl:hidden flex flex-col justify-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger aria-label="open menu" />

                        {!isMenuOpen ? (
                            <button>
                                <svg
                                    className="w-12"
                                    viewBox="0 0 36 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.15625 14.0625H27.8438C29.6531 14.0625 31.125 12.5906 31.125 10.7812C31.125 8.97188 29.6531 7.5 27.8438 7.5H10.9688C10.71 7.5 10.5 7.71 10.5 7.96875C10.5 8.2275 10.71 8.4375 10.9688 8.4375H27.8438C29.1356 8.4375 30.1875 9.48937 30.1875 10.7812C30.1875 12.0731 29.1356 13.125 27.8438 13.125H8.15625C6.86437 13.125 5.8125 12.0731 5.8125 10.7812C5.8125 9.48937 6.86437 8.4375 8.15625 8.4375C8.415 8.4375 8.625 8.2275 8.625 7.96875C8.625 7.71 8.415 7.5 8.15625 7.5C6.34688 7.5 4.875 8.97188 4.875 10.7812C4.875 12.5906 6.34688 14.0625 8.15625 14.0625Z"
                                        fill="#EFFAF4"
                                    />
                                    <path
                                        d="M27.8438 15.9375H10.9688C10.71 15.9375 10.5 16.1475 10.5 16.4062C10.5 16.665 10.71 16.875 10.9688 16.875H27.8438C29.1356 16.875 30.1875 17.9269 30.1875 19.2188C30.1875 20.5106 29.1356 21.5625 27.8438 21.5625H8.15625C6.86437 21.5625 5.8125 20.5106 5.8125 19.2188C5.8125 17.9269 6.86437 16.875 8.15625 16.875C8.415 16.875 8.625 16.665 8.625 16.4062C8.625 16.1475 8.415 15.9375 8.15625 15.9375C6.34688 15.9375 4.875 17.4094 4.875 19.2188C4.875 21.0281 6.34688 22.5 8.15625 22.5H27.8438C29.6531 22.5 31.125 21.0281 31.125 19.2188C31.125 17.4094 29.6531 15.9375 27.8438 15.9375Z"
                                        fill="#EFFAF4"
                                    />
                                    <path
                                        d="M8.15625 14.0625H27.8438C29.6531 14.0625 31.125 12.5906 31.125 10.7812C31.125 8.97188 29.6531 7.5 27.8438 7.5H10.9688C10.71 7.5 10.5 7.71 10.5 7.96875C10.5 8.2275 10.71 8.4375 10.9688 8.4375H27.8438C29.1356 8.4375 30.1875 9.48937 30.1875 10.7812C30.1875 12.0731 29.1356 13.125 27.8438 13.125H8.15625C6.86437 13.125 5.8125 12.0731 5.8125 10.7812C5.8125 9.48937 6.86437 8.4375 8.15625 8.4375C8.415 8.4375 8.625 8.2275 8.625 7.96875C8.625 7.71 8.415 7.5 8.15625 7.5C6.34688 7.5 4.875 8.97188 4.875 10.7812C4.875 12.5906 6.34688 14.0625 8.15625 14.0625Z"
                                        fill="#EFFAF4"
                                    />
                                    <path
                                        d="M27.8438 15.9375H10.9688C10.71 15.9375 10.5 16.1475 10.5 16.4062C10.5 16.665 10.71 16.875 10.9688 16.875H27.8438C29.1356 16.875 30.1875 17.9269 30.1875 19.2188C30.1875 20.5106 29.1356 21.5625 27.8438 21.5625H8.15625C6.86437 21.5625 5.8125 20.5106 5.8125 19.2188C5.8125 17.9269 6.86437 16.875 8.15625 16.875C8.415 16.875 8.625 16.665 8.625 16.4062C8.625 16.1475 8.415 15.9375 8.15625 15.9375C6.34688 15.9375 4.875 17.4094 4.875 19.2188C4.875 21.0281 6.34688 22.5 8.15625 22.5H27.8438C29.6531 22.5 31.125 21.0281 31.125 19.2188C31.125 17.4094 29.6531 15.9375 27.8438 15.9375Z"
                                        fill="#EFFAF4"
                                    />
                                    <g filter="url(#filter0_f_516_5384)">
                                        <path
                                            d="M8.15625 14.0625H27.8438C29.6531 14.0625 31.125 12.5906 31.125 10.7812C31.125 8.97188 29.6531 7.5 27.8438 7.5H10.9688C10.71 7.5 10.5 7.71 10.5 7.96875C10.5 8.2275 10.71 8.4375 10.9688 8.4375H27.8438C29.1356 8.4375 30.1875 9.48937 30.1875 10.7812C30.1875 12.0731 29.1356 13.125 27.8438 13.125H8.15625C6.86437 13.125 5.8125 12.0731 5.8125 10.7812C5.8125 9.48937 6.86437 8.4375 8.15625 8.4375C8.415 8.4375 8.625 8.2275 8.625 7.96875C8.625 7.71 8.415 7.5 8.15625 7.5C6.34688 7.5 4.875 8.97188 4.875 10.7812C4.875 12.5906 6.34688 14.0625 8.15625 14.0625Z"
                                            fill="#EFFAF4"
                                        />
                                        <path
                                            d="M27.8438 15.9375H10.9688C10.71 15.9375 10.5 16.1475 10.5 16.4062C10.5 16.665 10.71 16.875 10.9688 16.875H27.8438C29.1356 16.875 30.1875 17.9269 30.1875 19.2188C30.1875 20.5106 29.1356 21.5625 27.8438 21.5625H8.15625C6.86437 21.5625 5.8125 20.5106 5.8125 19.2188C5.8125 17.9269 6.86437 16.875 8.15625 16.875C8.415 16.875 8.625 16.665 8.625 16.4062C8.625 16.1475 8.415 15.9375 8.15625 15.9375C6.34688 15.9375 4.875 17.4094 4.875 19.2188C4.875 21.0281 6.34688 22.5 8.15625 22.5H27.8438C29.6531 22.5 31.125 21.0281 31.125 19.2188C31.125 17.4094 29.6531 15.9375 27.8438 15.9375Z"
                                            fill="#EFFAF4"
                                        />
                                        <path
                                            d="M8.15625 14.0625H27.8438C29.6531 14.0625 31.125 12.5906 31.125 10.7812C31.125 8.97188 29.6531 7.5 27.8438 7.5H10.9688C10.71 7.5 10.5 7.71 10.5 7.96875C10.5 8.2275 10.71 8.4375 10.9688 8.4375H27.8438C29.1356 8.4375 30.1875 9.48937 30.1875 10.7812C30.1875 12.0731 29.1356 13.125 27.8438 13.125H8.15625C6.86437 13.125 5.8125 12.0731 5.8125 10.7812C5.8125 9.48937 6.86437 8.4375 8.15625 8.4375C8.415 8.4375 8.625 8.2275 8.625 7.96875C8.625 7.71 8.415 7.5 8.15625 7.5C6.34688 7.5 4.875 8.97188 4.875 10.7812C4.875 12.5906 6.34688 14.0625 8.15625 14.0625Z"
                                            fill="#EFFAF4"
                                        />
                                        <path
                                            d="M27.8438 15.9375H10.9688C10.71 15.9375 10.5 16.1475 10.5 16.4062C10.5 16.665 10.71 16.875 10.9688 16.875H27.8438C29.1356 16.875 30.1875 17.9269 30.1875 19.2188C30.1875 20.5106 29.1356 21.5625 27.8438 21.5625H8.15625C6.86437 21.5625 5.8125 20.5106 5.8125 19.2188C5.8125 17.9269 6.86437 16.875 8.15625 16.875C8.415 16.875 8.625 16.665 8.625 16.4062C8.625 16.1475 8.415 15.9375 8.15625 15.9375C6.34688 15.9375 4.875 17.4094 4.875 19.2188C4.875 21.0281 6.34688 22.5 8.15625 22.5H27.8438C29.6531 22.5 31.125 21.0281 31.125 19.2188C31.125 17.4094 29.6531 15.9375 27.8438 15.9375Z"
                                            fill="#EFFAF4"
                                        />
                                    </g>
                                    <defs>
                                        <filter
                                            id="filter0_f_516_5384"
                                            x="0.75"
                                            y="3.375"
                                            width="34.5"
                                            height="23.25"
                                            filterUnits="userSpaceOnUse"
                                            colorInterpolationFilters="sRGB"
                                        >
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feBlend
                                                mode="normal"
                                                in="SourceGraphic"
                                                in2="BackgroundImageFix"
                                                result="shape"
                                            />
                                            <feGaussianBlur
                                                stdDeviation="2.0625"
                                                result="effect1_foregroundBlur_516_5384"
                                            />
                                        </filter>
                                    </defs>
                                </svg>
                            </button>
                        ) : (
                            <button>
                                <svg
                                    className="w-10"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.5686 37.5813C12.0678 37.5813 11.5656 37.3909 11.1847 37.01L4.72951 30.5548C3.96647 29.7917 3.96647 28.5513 4.72951 27.7883L11.1847 21.3317C11.4391 21.0774 11.4391 20.6639 11.1847 20.4096L4.72951 13.953C3.96647 13.19 3.96647 11.9496 4.72951 11.1865L11.1847 4.7313C11.9465 3.96956 13.1895 3.96956 13.9512 4.7313L18.5634 9.34217C18.8178 9.59652 18.8178 10.01 18.5634 10.2643C18.3091 10.5187 17.8956 10.5187 17.6412 10.2643L13.0291 5.65217C12.7747 5.39782 12.3612 5.39782 12.1069 5.65217L5.65168 12.1074C5.39734 12.3617 5.39734 12.7752 5.65168 13.0296L12.1069 19.4861C12.476 19.8565 12.6808 20.3483 12.6808 20.87C12.6808 21.3917 12.4773 21.8835 12.1082 22.2539L5.65299 28.7104C5.39864 28.9648 5.39864 29.3783 5.65299 29.6326L12.1082 36.0878C12.3626 36.3422 12.776 36.3422 13.0304 36.0878L19.4869 29.6326C20.2252 28.8943 21.5152 28.8943 22.2534 29.6326L28.7099 36.0878C28.9643 36.3422 29.3778 36.3422 29.6321 36.0878L36.0873 29.6326C36.3417 29.3783 36.3417 28.9648 36.0873 28.7104L29.6321 22.2539C29.263 21.8848 29.0595 21.393 29.0595 20.87C29.0595 20.347 29.263 19.8565 29.6321 19.4861L36.0873 13.0296C36.3417 12.7752 36.3417 12.3617 36.0873 12.1074L29.6321 5.65217C29.3778 5.39782 28.9643 5.39782 28.7099 5.65217L21.6639 12.6983C21.4095 12.9526 20.996 12.9526 20.7417 12.6983C20.4873 12.4439 20.4873 12.0304 20.7417 11.7761L27.7878 4.73C28.5495 3.96826 29.7925 3.96826 30.5543 4.73L37.0095 11.1852C37.7726 11.9483 37.7726 13.1887 37.0095 13.9517L30.5543 20.4083C30.2999 20.6626 30.2999 21.0761 30.5543 21.3304L37.0095 27.787C37.7726 28.55 37.7726 29.7904 37.0095 30.5535L30.5543 37.0087C29.7925 37.7704 28.5495 37.7704 27.7878 37.0087L21.3312 30.5535C21.0769 30.2991 20.6634 30.2991 20.4091 30.5535L13.9526 37.0087C13.5704 37.3909 13.0695 37.5813 12.5686 37.5813Z"
                                        fill="var(--primary-color)"
                                    />
                                    <path
                                        d="M12.5686 37.5813C12.0678 37.5813 11.5656 37.3909 11.1847 37.01L4.72951 30.5548C3.96647 29.7917 3.96647 28.5513 4.72951 27.7883L11.1847 21.3317C11.4391 21.0774 11.4391 20.6639 11.1847 20.4096L4.72951 13.953C3.96647 13.19 3.96647 11.9496 4.72951 11.1865L11.1847 4.7313C11.9465 3.96956 13.1895 3.96956 13.9512 4.7313L18.5634 9.34217C18.8178 9.59652 18.8178 10.01 18.5634 10.2643C18.3091 10.5187 17.8956 10.5187 17.6412 10.2643L13.0291 5.65217C12.7747 5.39782 12.3612 5.39782 12.1069 5.65217L5.65168 12.1074C5.39734 12.3617 5.39734 12.7752 5.65168 13.0296L12.1069 19.4861C12.476 19.8565 12.6808 20.3483 12.6808 20.87C12.6808 21.3917 12.4773 21.8835 12.1082 22.2539L5.65299 28.7104C5.39864 28.9648 5.39864 29.3783 5.65299 29.6326L12.1082 36.0878C12.3626 36.3422 12.776 36.3422 13.0304 36.0878L19.4869 29.6326C20.2252 28.8943 21.5152 28.8943 22.2534 29.6326L28.7099 36.0878C28.9643 36.3422 29.3778 36.3422 29.6321 36.0878L36.0873 29.6326C36.3417 29.3783 36.3417 28.9648 36.0873 28.7104L29.6321 22.2539C29.263 21.8848 29.0595 21.393 29.0595 20.87C29.0595 20.347 29.263 19.8565 29.6321 19.4861L36.0873 13.0296C36.3417 12.7752 36.3417 12.3617 36.0873 12.1074L29.6321 5.65217C29.3778 5.39782 28.9643 5.39782 28.7099 5.65217L21.6639 12.6983C21.4095 12.9526 20.996 12.9526 20.7417 12.6983C20.4873 12.4439 20.4873 12.0304 20.7417 11.7761L27.7878 4.73C28.5495 3.96826 29.7925 3.96826 30.5543 4.73L37.0095 11.1852C37.7726 11.9483 37.7726 13.1887 37.0095 13.9517L30.5543 20.4083C30.2999 20.6626 30.2999 21.0761 30.5543 21.3304L37.0095 27.787C37.7726 28.55 37.7726 29.7904 37.0095 30.5535L30.5543 37.0087C29.7925 37.7704 28.5495 37.7704 27.7878 37.0087L21.3312 30.5535C21.0769 30.2991 20.6634 30.2991 20.4091 30.5535L13.9526 37.0087C13.5704 37.3909 13.0695 37.5813 12.5686 37.5813Z"
                                        fill="var(--primary-color)"
                                    />
                                </svg>
                            </button>
                        )}
                        <SheetContent side={"top"}>
                            <SheetHeader>
                                <SheetDescription>
                                    <ul className="flex flex-col text-stone-600 ">
                                        {links.map((link) => (
                                            <NavLink key={link.to} to={link.to} label={link.label} />
                                        ))}
                                        {/* TEMPORARILY HIDDEN - Login button in mobile menu */}
                                        {/* Separator line */}
                                        {/* <li className="my-4">
                                            <div className="w-full h-[0.5px] bg-stone-700/50"></div>
                                        </li> */}
                                        {/* Login/Account section styled as navigation link */}
                                        {/* <li className="my-4">
                                            {isAuthenticated && user ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-xl font-light text-stone-400">
                                                        <User className="w-5 h-5" />
                                                        <span>{user.firstName}</span>
                                                    </div>
                                                    <button
                                                        onClick={logout}
                                                        className="text-2xl font-light hover:text-white transition-colors block"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-3 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            setShowLoginModal(true);
                                                        }}
                                                        className="w-full text-xl font-normal text-white/90 border border-white/20 hover:border-white/40 hover:text-white px-4 py-2.5 rounded-md transition-all"
                                                    >
                                                        Login
                                                    </button>
                                                    <Link
                                                        to="/register"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="w-full text-xl font-normal text-[var(--primary-color)] border border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-black px-4 py-2.5 rounded-md transition-all block text-center"
                                                    >
                                                        Register
                                                    </Link>
                                                </div>
                                            )}
                                        </li> */}
                                    </ul>
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </nav>
            </div>

            {/* TEMPORARILY HIDDEN - Login Modal */}
            {/* <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onForgotPassword={() => {
                    setShowLoginModal(false);
                    navigate("/forgot-password");
                }}
            /> */}
        </header>
    );
};

export default Header;
