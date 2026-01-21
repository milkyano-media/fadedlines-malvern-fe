import EmergencyAlert from "@/components/web/EmergencyAlert";
import PromotionalBanner from "@/components/web/PromotionalBanner";
import WebFooter from "@/components/web/WebFooter";
import WebHeader from "@/components/web/WebHeader";
import React, { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGtm } from "../hooks/UseGtm";

interface WebLayoutProps {
    children: ReactNode;
    gap?: string;
}

const WebLayout: React.FC<WebLayoutProps> = ({ children, gap = "gap-40" }) => {
    const location = useLocation();
    const { sendEvent } = useGtm();

    useEffect(() => {
        sendEvent({
            event: "route_event",
            path: location.pathname,
        });

        // window.scrollTo(0, 0);
    }, [location.pathname, sendEvent]);

    return (
        <div className={`font-poppins`}>
            <h1 className="hidden">Faded Lines Barber Shop</h1>
            {/* Promotional banner - appears at very top when enabled */}
            <PromotionalBanner />
            {/* Emergency alert - appears below promotional banner when message is set */}
            <EmergencyAlert />
            <WebHeader />
            <main className={`flex flex-col ${gap}`}>{children}</main>
            <WebFooter />
        </div>
    );
};

export default WebLayout;
