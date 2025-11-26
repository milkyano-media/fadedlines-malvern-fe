import Layout from "@/components/web/WebLayout";
import { Helmet } from "react-helmet-async";
import EmeraldFooter from "@/assets/web/emerald_footer_mobile.svg";
import EmeraldFooterRight from "@/assets/web/emerald_footer_right.svg";
import EmeraldFooterLeft from "@/assets/web/emerald_footer_left.svg";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy - Fadelines Barber Shop</title>
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
      <div className="flex flex-col text-stone-50 bg-black w-full relative tracking-wider">
        <img
          src={EmeraldFooter}
          alt="EmeraldFooter.svg"
          className="md:hidden block absolute bottom-[-10rem] md:bottom-[-26rem] z-0 left-0"
        />
        <img
          src={EmeraldFooterRight}
          alt="EmeraldFooter.svg"
          className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0"
        />
        <img
          src={EmeraldFooterLeft}
          alt="EmeraldFooter.svg"
          className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0"
        />

        <div className="prose-invert prose-headings:text-3xl prose-headings:py-4  max-w-none px-8 container prose-headings:font-bold prose-headings:text-stone-100 prose-p:font-extralight prose-ul:font-extralight prose-stone font-poppins leading-8 py-12 prose-ul:list-disc prose-ul:pl-12 pb-40 prose-p:text-stone-200 prose-ul:text-stone-200 prose-headings:pt-12">
          <h3>
            {" "}
            Privacy Policy for <br />{" "}
            <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text">
              Fadedlines Barbershop
            </span>
          </h3>

          <p>Effective Date: [Date]</p>

          <p>
            Thank you for visiting the Fadedlines Barbershop website. This
            Privacy Policy outlines how we collect, use, disclose, and safeguard
            your information when you visit our website.
          </p>

          <h4>Information We Collect</h4>

          <ul>
            <li>
              <b>Personal Information:</b> When you visit our website, we may
              collect personal information that you voluntarily provide to us,
              such as your name, email address, phone number, and any other
              details you submit through contact forms or when booking
              appointments online.
            </li>

            <li>
              <b> Usage Data:</b> We may automatically collect certain
              information about your visit to our website, including your IP
              address, browser type, referring/exit pages, and the pages you
              view. This information helps us analyze trends, administer the
              site, and improve our services.
            </li>

            <li>
              <b> Cookies and Tracking Technologies: </b>We use cookies and
              similar tracking technologies to enhance your experience on our
              website and to analyze how visitors use our site. You can control
              cookies through your browser settings and other tools. However,
              please note that disabling cookies may affect your ability to
              access certain features of our website.
            </li>
          </ul>

          <h4>Use of Information</h4>

          <p>We use the information we collect for the following purposes:</p>

          <ul>
            <li>
              To provide and manage our website, including processing
              appointments and inquiries.
            </li>
            <li>
              To communicate with you, respond to your inquiries, and provide
              customer support.
            </li>
            <li>
              To analyze and improve our website's performance and user
              experience.
            </li>
            <li>
              To comply with legal obligations and enforce our website policies.
            </li>
          </ul>
          <h4> Sharing of Information</h4>

          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties except as outlined below: [10:30 AM]
          </p>

          <ul>
            <li>
              {" "}
              Service Providers: We may share your information with third-party
              service providers who assist us in operating our website,
              conducting our business, or servicing you. These parties are
              contractually obligated to keep your information confidential and
              secure.
            </li>
            <li>
              {" "}
              Legal Compliance: We may disclose your information when required
              by law or to protect our rights, property, or safety or that of
              others.
            </li>
          </ul>
          <h4>Data Security</h4>
          <p>
            We implement reasonable security measures to protect your personal
            information from unauthorized access, use, alteration, or
            destruction. However, please be aware that no method of transmission
            over the internet or electronic storage is completely secure.
          </p>

          <h4> Your Rights</h4>

          <p>
            {" "}
            You have certain rights regarding your personal information under
            applicable data protection laws. These rights may include the right
            to access, correct, or delete your information. Please contact us
            using the information provided below to exercise these rights.
          </p>

          <h4> Links to Third-Party Websites</h4>

          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices or the content of these
            websites. We encourage you to read the privacy policies of these
            linked sites.
          </p>

          <h4> Children's Privacy</h4>

          <p>
            Our website is not directed at individuals under the age of 18. We
            do not knowingly collect personal information from children. If we
            learn that we have collected personal information from a child
            without parental consent, we will take steps to delete that
            information.
          </p>

          <h4>Changes to This Privacy Policy</h4>

          <p>
            {" "}
            We may update this Privacy Policy periodically to reflect changes in
            our practices or for other operational, legal, or regulatory
            reasons. We encourage you to review this policy periodically for any
            updates.
          </p>

          <h4>Contact Us</h4>

          <p>
            {" "}
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>

          <ul>
            <li>Fadedlines Barbershop</li>
            <li>163 GLENFERRIE RD, MALVERN 3144, VICTORIA</li>
            <li>dejan@fadedlinesbarbershop.com</li>
            <li>(03) 9002 1055 </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
