import React from "react";
import Seo from "./Seo";
import {
  Appdownload,
  CookiesPolicy,
  Dashboard,
  FAQ,
  ForgotPassword,
  Membership,
  OTPVerification,
  Privacypolicy,
  Referal,
  ResetPassword,
  SelectInfluencers,
  Settings,
  Signin,
  Support,
  TermsandConditions,
} from "./SEOContent";
import { useLocation } from "react-router";

const HelmetComponent = () => {
  const location = useLocation();

  const getSeoContent = () => {
    switch (location.pathname) {
      case "/dashboard":
        return Dashboard;
      case "/login":
        return Signin;
      case "/signup":
        return Signin;
      case "/signupwithmobile":
        return Signin;
      case "/signupwithemail":
        return Signin;
      case "/setpassword":
        return ResetPassword;
      case "/forgotpassword":
        return ForgotPassword;
      case "/verifyotp":
        return OTPVerification;
      case "/privacypolicy":
        return Privacypolicy;
      case "/termsandconditions":
        return TermsandConditions;
      case "/cookiespolicy":
        return CookiesPolicy;
      case "/support":
        return Support;
      case "/faq":
        return FAQ;
      case "/appdownloadscreen":
        return Appdownload;
      case "/referel":
        return Referal;
      case "/selectinfluencers":
        return SelectInfluencers;
      case "/membership":
        return Membership;
      case "/setting":
        return Settings;
      default:
        return null;
    }
  };
  return getSeoContent() ? (
    <Seo
      title={getSeoContent().title}
      description={getSeoContent().description}
    />
  ) : null;
};

export default HelmetComponent;
