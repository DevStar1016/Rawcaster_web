/**
 * A React component that renders a profile verification page.
 * @returns The rendered profile verification page.
 */
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { removeSessionStorageData } from "../../../Store/Storage";
import classes from "./Profilverification.module.css";

const ProfileVerification = () => {
  const { pathname } = useLocation();
  const [eventKey, seteventKey] = useState(pathname);
  const { isVeifyEnabled } = useDispatch();
  const loginUserData = useAuthData();

  useEffect(() => {
    seteventKey(pathname);
  }, [pathname]);

  return (
    <>
      {loginUserData?.acc_verify_status === 0 && (
        <Nav variant="pills" className="flex-row" activeKey={eventKey}>
          <Nav.Item className={`${classes.navbarItem} profilenavbar`}>
            <Nav.Link
              eventKey="/profile"
              as={Link}
              to="/profile"
              onClick={() => {
                removeSessionStorageData("verifyCountDown");
              }}
            >
              Step 1: Update profile
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className={`${classes.navbarItem} profilenavbar`}>
            <Nav.Link
              eventKey="/verifyotp"
              as={Link}
              to="/verifyotp"
              disabled={!isVeifyEnabled}
            >
              Step 2: Verify your email
            </Nav.Link>
          </Nav.Item>
        </Nav>
      )}
      <Outlet />
    </>
  );
};

export default ProfileVerification;
