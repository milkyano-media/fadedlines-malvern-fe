import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/web/Home';
import Gallery from '@/pages/web/Gallery';
import AboutUs from '@/pages/web/AboutUs';
import Careers from '@/pages/web/Careers';
import Contacts from '@/pages/web/Contacts';
import PrivacyPolicy from '@/pages/web/PrivacyPolicy';
import NotFound from '@/pages/web/NotFound';
import Register from '@/pages/auth/Register';
import AccountLayout from '@/pages/auth/AccountLayout';
import AccountProfile from '@/pages/auth/AccountProfile';
import AccountBookings from '@/pages/auth/AccountBookings';
import AccountSecurity from '@/pages/auth/AccountSecurity';
import VerifyOTP from '@/pages/auth/VerifyOTP';
import ChangePhoneNumber from '@/pages/auth/ChangePhoneNumber';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import { PublicRoute, ProtectedRoute } from '@/components/routes';
import { AdminRoute } from '@/components/routes/AdminRoute';
import { UnverifiedUserHandler } from '@/components/auth/UnverifiedUserHandler';

import JoshLanding from '@/pages/landing/JoshLanding';
import WyattLanding from '@/pages/landing/WyattLanding';
import RayhanLanding from '@/pages/landing/RayhanLanding';
import JayLanding from '@/pages/landing/JayLanding';
import NikoLanding from '@/pages/landing/NikoLanding';
import EmmanLanding from '@/pages/landing/EmmanLanding';
import DejanLanding from '@/pages/landing/DejanLanding';
import ChristosLanding from '@/pages/landing/ChristosLanding';
import AnthonyLanding from '@/pages/landing/AnthonyLanding';
import BookList from './components/book/BookList';
import BookAppointment from './components/book/BookAppointment';
import BookContactInfo from './components/book/BookContactInfo';
import ThankYou from './components/book/ThankYou';
import NoahLanding from './pages/landing/NoahLanding';
import AmirLanding from './pages/landing/AmirLanding';
import PageTracker from './components/analytics/PageTracker';
import ParameterManagement from './pages/admin/ParameterManagement';
import DynamicThemeExample from './components/web/DynamicThemeExample';

const webRoutes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'gallery', component: Gallery },
  { path: 'about-us', component: AboutUs },
  { path: 'careers', component: Careers },
  { path: 'contact', component: Contacts },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'register', component: Register },
  { path: 'verify-otp', component: VerifyOTP },
  { path: 'change-phone-number', component: ChangePhoneNumber },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'book/services', component: BookList },
  { path: 'book/appointment', component: BookAppointment },
  { path: 'book/contact-info', component: BookContactInfo },
  { path: 'book/thank-you', component: ThankYou }
];

const adminRoutes = [
  { path: 'admin/parameters', component: ParameterManagement },
  { path: 'admin/theme-example', component: DynamicThemeExample }
];

const metaWebRoutes = [
  { path: 'meta', component: Home },
  { path: 'meta/home', component: Home },
  { path: 'meta/gallery', component: Gallery },
  { path: 'meta/about-us', component: AboutUs },
  { path: 'meta/careers', component: Careers },
  { path: 'meta/contact', component: Contacts },
  { path: 'meta/privacy-policy', component: PrivacyPolicy },
  { path: 'meta/meta/book/services', component: BookList },
  { path: 'meta/book/appointment', component: BookAppointment },
  { path: 'meta/book/contact-info', component: BookContactInfo },
  { path: 'meta/book/thank-you', component: ThankYou }
];

const landingRoutes = [
  { path: 'anthony', component: AnthonyLanding },
  { path: 'christos', component: ChristosLanding },
  { path: 'dejan', component: DejanLanding },
  { path: 'emman', component: EmmanLanding },
  { path: 'jay', component: JayLanding },
  { path: 'josh', component: JoshLanding },
  { path: 'niko', component: NikoLanding },
  { path: 'rayhan', component: RayhanLanding },
  { path: 'wyatt', component: WyattLanding },
  { path: 'noah', component: NoahLanding },
  { path: 'amir', component: AmirLanding }
];

const bookRoutes = [
  { path: 'anthony/book/services', component: BookList },
  { path: 'christos/book/services', component: BookList },
  { path: 'dejan/book/services', component: BookList },
  { path: 'emman/book/services', component: BookList },
  { path: 'jay/book/services', component: BookList },
  { path: 'josh/book/services', component: BookList },
  { path: 'niko/book/services', component: BookList },
  { path: 'rayhan/book/services', component: BookList },
  { path: 'wyatt/book/services', component: BookList },
  { path: 'noah/book/services', component: BookList },
  { path: 'amir/book/services', component: BookList }
];

const appointmentRoutes = [
  { path: 'anthony/book/appointment', component: BookAppointment },
  { path: 'christos/book/appointment', component: BookAppointment },
  { path: 'dejan/book/appointment', component: BookAppointment },
  { path: 'emman/book/appointment', component: BookAppointment },
  { path: 'jay/book/appointment', component: BookAppointment },
  { path: 'josh/book/appointment', component: BookAppointment },
  { path: 'niko/book/appointment', component: BookAppointment },
  { path: 'rayhan/book/appointment', component: BookAppointment },
  { path: 'wyatt/book/appointment', component: BookAppointment },
  { path: 'noah/book/appointment', component: BookAppointment },
  { path: 'amir/book/appointment', component: BookAppointment }
  // { path: "mustafa/book/appointment", component: BookAppointment },
];

const contactInfoRoutes = [
  { path: 'anthony/book/contact-info', component: BookContactInfo },
  { path: 'christos/book/contact-info', component: BookContactInfo },
  { path: 'dejan/book/contact-info', component: BookContactInfo },
  { path: 'emman/book/contact-info', component: BookContactInfo },
  { path: 'jay/book/contact-info', component: BookContactInfo },
  { path: 'josh/book/contact-info', component: BookContactInfo },
  { path: 'niko/book/contact-info', component: BookContactInfo },
  { path: 'rayhan/book/contact-info', component: BookContactInfo },
  { path: 'wyatt/book/contact-info', component: BookContactInfo },
  { path: 'noah/book/contact-info', component: BookContactInfo },
  { path: 'amir/book/contact-info', component: BookContactInfo }
];

const ThankYouRoutes = [
  { path: 'anthony/book/thank-you', component: ThankYou },
  { path: 'christos/book/thank-you', component: ThankYou },
  { path: 'dejan/book/thank-you', component: ThankYou },
  { path: 'emman/book/thank-you', component: ThankYou },
  { path: 'jay/book/thank-you', component: ThankYou },
  { path: 'josh/book/thank-you', component: ThankYou },
  { path: 'niko/book/thank-you', component: ThankYou },
  { path: 'rayhan/book/thank-you', component: ThankYou },
  { path: 'wyatt/book/thank-you', component: ThankYou },
  { path: 'noah/book/thank-you', component: ThankYou },
  { path: 'amir/book/thank-you', component: ThankYou }
];

const AppRoutes: React.FC = () => {
  // Helper function to wrap component with appropriate route guard
  const wrapWithRouteGuard = (path: string, Component: React.ComponentType): React.ReactElement => {
    // Public routes that should redirect if authenticated
    if (path === 'register') {
      return <PublicRoute><Component /></PublicRoute>;
    }
    // Protected routes that require authentication
    if (path === 'account') {
      return <ProtectedRoute><Component /></ProtectedRoute>;
    }
    // All other routes are public
    return <Component />;
  };

  return (
    <Router>
      <PageTracker />
      <UnverifiedUserHandler />
      <Routes>
        {/* LANDING ROUTES */}
        {landingRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* BOOKING ROUTES */}
        {bookRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* APPOINTMENT ROUTES */}
        {appointmentRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* THANK YOU ROUTES */}
        {ThankYouRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* WEB ROUTE */}
        {webRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={wrapWithRouteGuard(path, Component)} />
            <Route path={`/meta/${path}`} element={wrapWithRouteGuard(path, Component)} />
          </React.Fragment>
        ))}

        {/* META WEB ROUTE */}
        {metaWebRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* ADMIN ROUTES - Protected with AdminRoute */}
        {adminRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <AdminRoute>
                <Component />
              </AdminRoute>
            }
          />
        ))}

        {/* ACCOUNT ROUTES - Protected with nested sub-routes */}
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/account/profile" />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="bookings" element={<AccountBookings />} />
          <Route path="security" element={<AccountSecurity />} />
        </Route>

        {/* NOT FOUND ROUTE */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
