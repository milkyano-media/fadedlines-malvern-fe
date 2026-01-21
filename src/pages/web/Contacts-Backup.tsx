import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/web/Spinner";
import Layout from "@/components/web/WebLayout";
import { useParameterValue } from "@/hooks/useParameter";
import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, X } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function Contacts() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("loading");
    const emailParameter = useParameterValue<string>("contact.email", "Josh@fadedlinesmalvern.com");
    const phoneNumberParameter = useParameterValue<string>("contact.phone_number", "+6135 249 543");
    const instagramLinkParameter = useParameterValue<string>(
        "contact.instagram_url",
        "https://www.instagram.com/fadedlinesmalvern"
    );

    const sendEmail = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setStatus("loading");

        emailjs
            .send("service_8g1wzub", "template_36pulhw", values, "dVQ8-b1hMOSkncafw")
            .then(() => {
                setStatus("succeeded");
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            })
            .catch(() => {
                setStatus("failed");
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            });
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    return (
        <Layout>
            <Helmet>
                <title>Contact - Fadelines Barber Shop</title>
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
                <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-black/80 to-black" />
                <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
                    <div className="flex flex-col mb-12">
                        <h2>HAVE SOME</h2>
                        <h2 className="text-[var(--text-color-primary)]">QUESTIONS?</h2>
                    </div>

                    <svg className="w-7 mt-20" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                            fill="var(--primary-color)"
                        />
                    </svg>
                </div>
            </section>
            {/* {isLoading && <Spinner />} */}
            <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">Sending Email</AlertDialogTitle>
                        <AlertDialogDescription>
                            {status === "loading" ? (
                                <Spinner />
                            ) : status === "succeeded" ? (
                                <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                                    <div className="p-1  rounded-full border border-[#24FF00]">
                                        <Check className="h-24 w-auto md:h-24 md:w-24 text-[#24FF00] " />
                                    </div>
                                </div>
                            ) : status === "failed" ? (
                                <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                                    <div className="p-1  rounded-full border border-red-600">
                                        <X className="h-24 w-auto md:h-24 md:w-24 text-red-600 " />
                                    </div>
                                </div>
                            ) : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            <section className="container flex flex-col md:flex-row gap-10 mb-40 md:mb-80">
                <div className="md:w-1/2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(sendEmail)} className="w-full flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                        <FormLabel className="w-full flex justify-start">
                                            <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                First Name
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                placeholder="Johnathan"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                        <FormLabel className="w-full flex justify-start">
                                            <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                Last Name
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                placeholder="Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                        <FormLabel className="w-full flex justify-start">
                                            <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                Email
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                placeholder="mail@fade.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                        <FormLabel className="w-full flex justify-start">
                                            <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                Phone
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                placeholder="+12555"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="z-50">
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                            <FormLabel className="w-full flex justify-start">
                                                <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                    Leave us a message
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                    placeholder="Type Here..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                className="w-full bg-[var(--primary-color)] rounded-xl text-black py-7 text-xl"
                                type="submit"
                            >
                                CONTINUE
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="flex flex-col gap-4 md:w-1/2 items-center md:border-l-2 border-[#114330]">
                    <h3>OR GET IN TOUCH BY</h3>

                    <div className="flex flex-col gap-6">
                        <a
                            href={`https://mail.google.com/mail/u/0/?fs=1&to=${emailParameter}&su=Hello,+I+Want+to+Collaborate&body&bcc=%22&tf=cm`}
                            className="bg-[var(--primary-color)] text-black rounded-full p-4 flex gap-2 w-96"
                        >
                            <svg className="w-12" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="1.25"
                                    y="0.75"
                                    width="70.5"
                                    height="70.5"
                                    rx="35.25"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                />
                                <g clipPath="url(#clip0_257_3258)">
                                    <path
                                        d="M50.6328 22.2891H22.3672C21.3419 22.2902 20.3589 22.698 19.6339 23.423C18.9089 24.148 18.5011 25.131 18.5 26.1562V45.8438C18.5011 46.869 18.9089 47.852 19.6339 48.577C20.3589 49.302 21.3419 49.7098 22.3672 49.7109H50.6328C51.6581 49.7098 52.6411 49.302 53.3661 48.577C54.0911 47.852 54.4989 46.869 54.5 45.8438V26.1562C54.4989 25.131 54.0911 24.148 53.3661 23.423C52.6411 22.698 51.6581 22.2902 50.6328 22.2891ZM52.3906 26.1562V45.8438C52.3907 45.9292 52.3844 46.0145 52.3716 46.099L42.2312 36L52.3716 25.901C52.3844 25.9855 52.3907 26.0708 52.3906 26.1562ZM50.6328 24.3984C50.7137 24.3987 50.7945 24.4043 50.8747 24.4153L36.5 38.7302L22.1253 24.4153C22.2055 24.4043 22.2863 24.3987 22.3672 24.3984H50.6328ZM20.6284 46.099C20.6156 46.0145 20.6093 45.9292 20.6094 45.8438V26.1562C20.6093 26.0708 20.6156 25.9855 20.6284 25.901L30.7688 36L20.6284 46.099ZM22.3672 47.6016C22.2863 47.6013 22.2055 47.5957 22.1253 47.5847L32.2637 37.4885L35.7561 40.9662C35.9537 41.1628 36.2212 41.2732 36.5 41.2732C36.7788 41.2732 37.0463 41.1628 37.2439 40.9662L40.7363 37.4885L50.8747 47.5847C50.7945 47.5957 50.7137 47.6013 50.6328 47.6016H22.3672Z"
                                        fill="#000000"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_257_3258">
                                        <rect width="36" height="36" fill="white" transform="translate(18.5 18)" />
                                    </clipPath>
                                </defs>
                            </svg>

                            <div className="flex flex-col gap-2">
                                <p>Email: </p>
                                <sub>{emailParameter}</sub>
                            </div>
                        </a>
                        <a
                            href={`tel:${phoneNumberParameter.replace(" ", "")}`}
                            className="bg-[var(--primary-color)] text-black rounded-full p-4 flex gap-2 w-96"
                        >
                            <svg className="w-12" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="1.25"
                                    y="0.75"
                                    width="70.5"
                                    height="70.5"
                                    rx="35.25"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M28.9793 43.5139C24.3459 38.8805 21.0006 33.1126 19.478 26.7309C19.0061 24.7532 19.8108 22.7634 21.524 21.6688L25.5192 19.1162C25.7969 18.9387 26.1178 18.8428 26.4475 18.8428C26.6306 18.8428 26.8126 18.8726 26.9863 18.9305C27.4795 19.0951 27.8654 19.4722 28.0479 19.9586L30.9126 27.5917C31.1101 28.1177 31.0514 28.655 30.7461 29.1265L29.0812 31.6973C28.5917 32.4531 28.5866 33.3915 29.0679 34.1526C30.2457 36.0153 31.6364 37.7448 33.1944 39.3031C34.7524 40.8612 36.4819 42.2517 38.3445 43.4296C39.1058 43.911 40.0445 43.9059 40.8005 43.4163L43.3709 41.7514C43.8425 41.4459 44.3796 41.3881 44.9057 41.5854L52.5388 44.4495C53.0255 44.6321 53.4032 45.018 53.5676 45.5116C53.7313 46.0031 53.6602 46.5423 53.3816 46.9783L50.8287 50.9739C49.7342 52.6867 47.7443 53.4914 45.767 53.0196C39.3822 51.4961 33.6149 48.1494 28.9793 43.5139Z"
                                    fill="#000000"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M39.6717 27.3516C39.6717 26.8557 40.0737 26.454 40.5693 26.454C41.0652 26.454 41.4676 26.8557 41.4676 27.3516C41.4676 27.8471 41.0652 28.2492 40.5693 28.2492C40.0737 28.2492 39.6717 27.8471 39.6717 27.3516ZM48.8277 27.3516C48.8277 26.8557 49.2298 26.454 49.7253 26.454C50.2212 26.454 50.6233 26.8557 50.6233 27.3516C50.6233 27.8471 50.2212 28.2492 49.7253 28.2492C49.2297 28.2492 48.8277 27.8471 48.8277 27.3516ZM44.2497 27.3516C44.2497 26.8557 44.6517 26.454 45.1476 26.454C45.6432 26.454 46.0452 26.8557 46.0452 27.3516C46.0452 27.8471 45.6432 28.2492 45.1476 28.2492C44.6517 28.2492 44.2497 27.8471 44.2497 27.3516ZM36.9211 27.3516C36.9211 29.1438 37.487 30.8472 38.5585 32.2779C38.662 32.4159 38.6965 32.594 38.6513 32.7605L37.691 36.347L42.1967 35.1399C42.3032 35.1111 42.4167 35.1147 42.5212 35.1502C43.365 35.4338 44.2491 35.5777 45.1477 35.5777C49.6832 35.5777 53.3739 31.8874 53.3739 27.3515C53.3739 22.8153 49.6832 19.125 45.1477 19.125C40.6118 19.1251 36.9211 22.8154 36.9211 27.3516ZM36.3516 36.9972C36.3002 37.1912 36.3549 37.3982 36.4979 37.5402C36.6047 37.6474 36.748 37.7051 36.895 37.7051C36.9437 37.7051 36.9928 37.6987 37.0406 37.6858L42.3265 36.2697C43.2364 36.5573 44.1844 36.7029 45.1477 36.7029C50.3041 36.7029 54.499 32.5081 54.499 27.3516C54.499 22.1951 50.3041 18.0002 45.1476 18.0002C39.9908 18.0002 35.7959 22.1951 35.7959 27.3516C35.7959 29.2964 36.3831 31.1494 37.4956 32.7287L36.3516 36.9972ZM53.1447 46.8282C53.3802 46.459 53.4372 46.0122 53.3009 45.6018C53.1639 45.1915 52.8501 44.8678 52.4401 44.7141L44.807 41.8501C44.3642 41.6836 43.9206 41.732 43.5239 41.9887L40.9535 43.6536C40.1056 44.203 39.0487 44.2086 38.1943 43.6685C36.3221 42.4843 34.5726 41.0828 32.9957 39.5032C31.4164 37.9263 30.0146 36.1771 28.8303 34.3042C28.2903 33.4504 28.2959 32.3936 28.8452 31.5457L30.5101 28.9749C30.7675 28.5782 30.8153 28.1343 30.6494 27.6918L27.7847 20.0588C27.6314 19.6488 27.3074 19.3354 26.8974 19.1987C26.7504 19.1496 26.5985 19.1253 26.4476 19.1253C26.1766 19.1253 25.9075 19.203 25.6707 19.3546L21.6756 21.9071C20.0624 22.9374 19.3081 24.8057 19.7516 26.6669C21.2486 32.9386 24.5084 38.6958 29.1783 43.3163C33.8034 47.9908 39.5606 51.2506 45.8324 52.7473C47.6936 53.1912 49.5619 52.4362 50.5919 50.8237L53.1447 46.8282ZM52.8355 43.6607L45.2024 40.797C44.4238 40.5047 43.6105 40.5926 42.9122 41.0444L40.3418 42.7096C39.8595 43.0218 39.2813 43.0251 38.7963 42.7179C36.9935 41.5782 35.3094 40.2288 33.7914 38.7081C33.7914 38.7078 33.7914 38.7078 33.7908 38.7072C32.2702 37.1896 30.9214 35.5058 29.781 33.7032C29.4735 33.2176 29.4772 32.6398 29.7893 32.1574L31.4545 29.5866C31.9064 28.8884 31.9943 28.075 31.7027 27.2968L28.8379 19.6637C28.5646 18.9343 27.9867 18.376 27.2533 18.1312C26.5192 17.8867 25.7218 17.9869 25.0653 18.4065L21.0695 20.9591C19.047 22.2511 18.1006 24.594 18.6576 26.9279C20.203 33.404 23.5676 39.3477 28.3831 44.1117C33.1515 48.9316 39.0952 52.2961 45.5706 53.8413C46.0151 53.9474 46.4603 53.9988 46.8975 53.9988C48.7588 53.9988 50.4939 53.0667 51.5395 51.4294L54.0927 47.4342C54.5124 46.7774 54.6122 45.98 54.3674 45.2459C54.1235 44.5121 53.5643 43.9343 52.8355 43.6607Z"
                                    fill="#000000"
                                />
                            </svg>

                            <div className="flex flex-col gap-2">
                                <p>Phone: </p>
                                <sub>{phoneNumberParameter}</sub>
                            </div>
                        </a>
                        <a
                            href={instagramLinkParameter}
                            className="bg-[var(--primary-color)] text-black rounded-full p-4 flex gap-2 w-96"
                        >
                            <svg className="w-12" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="1.25"
                                    y="0.75"
                                    width="70.5"
                                    height="70.5"
                                    rx="35.25"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M30.2 21H42.8C47.6 21 51.5 24.9 51.5 29.7V42.3C51.5 44.6074 50.5834 46.8203 48.9518 48.4518C47.3203 50.0834 45.1074 51 42.8 51H30.2C25.4 51 21.5 47.1 21.5 42.3V29.7C21.5 27.3926 22.4166 25.1797 24.0482 23.5482C25.6797 21.9166 27.8926 21 30.2 21ZM29.9 24C28.4678 24 27.0943 24.5689 26.0816 25.5816C25.0689 26.5943 24.5 27.9678 24.5 29.4V42.6C24.5 45.585 26.915 48 29.9 48H43.1C44.5322 48 45.9057 47.4311 46.9184 46.4184C47.9311 45.4057 48.5 44.0322 48.5 42.6V29.4C48.5 26.415 46.085 24 43.1 24H29.9ZM44.375 26.25C44.8723 26.25 45.3492 26.4475 45.7008 26.7992C46.0525 27.1508 46.25 27.6277 46.25 28.125C46.25 28.6223 46.0525 29.0992 45.7008 29.4508C45.3492 29.8025 44.8723 30 44.375 30C43.8777 30 43.4008 29.8025 43.0492 29.4508C42.6975 29.0992 42.5 28.6223 42.5 28.125C42.5 27.6277 42.6975 27.1508 43.0492 26.7992C43.4008 26.4475 43.8777 26.25 44.375 26.25ZM36.5 28.5C38.4891 28.5 40.3968 29.2902 41.8033 30.6967C43.2098 32.1032 44 34.0109 44 36C44 37.9891 43.2098 39.8968 41.8033 41.3033C40.3968 42.7098 38.4891 43.5 36.5 43.5C34.5109 43.5 32.6032 42.7098 31.1967 41.3033C29.7902 39.8968 29 37.9891 29 36C29 34.0109 29.7902 32.1032 31.1967 30.6967C32.6032 29.2902 34.5109 28.5 36.5 28.5ZM36.5 31.5C35.3065 31.5 34.1619 31.9741 33.318 32.818C32.4741 33.6619 32 34.8065 32 36C32 37.1935 32.4741 38.3381 33.318 39.182C34.1619 40.0259 35.3065 40.5 36.5 40.5C37.6935 40.5 38.8381 40.0259 39.682 39.182C40.5259 38.3381 41 37.1935 41 36C41 34.8065 40.5259 33.6619 39.682 32.818C38.8381 31.9741 37.6935 31.5 36.5 31.5Z"
                                    fill="#000000"
                                />
                            </svg>

                            <div className="flex flex-col gap-2">
                                <p>Instagram Page: </p>
                                <sub>@fadedlinesmalvern</sub>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
