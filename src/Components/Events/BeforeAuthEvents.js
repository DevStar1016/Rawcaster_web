import { Link } from "react-router-dom";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { removeSessionStorageData } from "../../Store/Storage";
import classes from "./Events.module.css";
import React from "react";
import { IS_CHIME_ENABLE } from "../../Shared/Constant";

const BeforeAuthEvents = () => {
  const loginUserData = useAuthData();
  return (
    <>
      {/* BEFORE LOGIN START */}

      <>
        {loginUserData === null && (
          <>
            <div className={classes.loginSec}>
              <p>Log in to follow creators, like video, and view comments.</p>
              <Link
                className={classes.btn}
                to="/login"
                onClick={() => {
                  removeSessionStorageData("influencerData");
                }}
              >
                Login/Signup
              </Link>
            </div>

            {IS_CHIME_ENABLE && (
              <div className={classes.eventStatic}>
                <h1>Create a new event</h1>
                <div className={classes.list}>
                  <img
                    src={require("../../Assets/Images/png/eventpic.png")}
                    alt="eventpic"
                  />
                  <Link
                    to="/login"
                    onClick={() => {
                      removeSessionStorageData("influencerData");
                    }}
                  >
                    Login/Signup to continue{" "}
                    <span className="material-icons">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </>

      {/* END */}
    </>
  );
};

export default BeforeAuthEvents;
