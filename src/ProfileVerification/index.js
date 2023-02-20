import React from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { getDashboard } from "../Shared/Reduxfetcher";
import { removeSessionStorageData } from "../Store/Storage";
import classes from "./Profilverification.module.css";

const ProfileVerification = () => {
  const { pathname } = useLocation();
  const { isTwoStepVerified } = getDashboard();

  return (
    <>
      {!isTwoStepVerified && (
        <Nav variant="pills" className="flex-row" activeKey={pathname}>
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
            <Nav.Link eventKey="/verifyotp" as={Link} to="/verifyotp" disabled>
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
