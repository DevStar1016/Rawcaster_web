import React from "react";
import { Link } from "react-router-dom";
import classes from "./Homepage.module.css";

import thumblogo from "../../Assets/Images/svg/Fav-Rawcaster.svg";

import mainlogowhite from "../../Assets/Images/svg/logo-white.svg";
// import { Carousel } from '@trendyol-js/react-carousel';

const Homepage = () => {
  return (
    <div>
      <div className={classes.welcomeSec}>
        <div className={classes.welcomeSec2}>
          <div className={classes.leftSec}>
            <div className={classes.contentSec}>
              <img
                className={classes.onlyMob}
                src={require("../../Assets/Images/png/welcome-img.png")}
              />
              <h1>
                The one-stop <span>platform</span> for all your social media
                needs
              </h1>
              <p>
                The first platform that gives you a space to chat, talk, host
                and participate in live events virtually and at the same time
                allows you to share with the whole world, very small pieces or
                tidbit of treasures in your mind.
              </p>
              <Link className={classes.getStarted} to="/home">
                Explore Rawcaster
              </Link>
            </div>
          </div>
          <div className={classes.rightSec}>
            <img src={require("../../Assets/Images/png/welcome-img.png")} />
          </div>
        </div>
      </div>

      {/* Live Talk Show */}
      <div className={classes.homeContent}>
        <div className={classes.imgSec}>
          <img src={require("../../Assets/Images/png/live-talk-show.png")} />
        </div>
        <div className={classes.textSec}>
          <img src={thumblogo} />
          <h2>Live Talk Show</h2>
          <p>
            As in a typical TV or Radio talk show, you can stream a live event
            with the Rawcaster public or your fans with live audience reactions
            on the event. Participants are only on listen mode but can be
            enabled by host to speak or ask a question at any time. Rawcaster
            allows you to host this event in either audio only or video.
          </p>
          <p>
            When the occasion calls for it, you can also capture and stream a
            live event with the click of a button.
          </p>
          <Link className={classes.getStarted} to="/signup">
            Get Started
          </Link>
        </div>
      </div>

      {/* Event */}

      <div className={`${classes.homeContent} ${classes.desEvent}`}>
        <div className={classes.imgSec}>
          <img
            src={require("../../Assets/Images/png/signupwithmobile-intro.png")}
          />
        </div>
        <div className={classes.textSec}>
          <img src={thumblogo} />
          <h2>Events</h2>
          <p>
            Take your scheduled events live to your invited guests or make it
            open to the public whether they are members of Rawcaster or not. It
            is as simple as sharing the event link to anyone you want to
            participate.
          </p>
          <p>
            Rawcaster allows you to configure your meeting to either allow
            anyone to join or restrict it to a select few. Break out rooms,
            schmoozing, online chats, voting are some of the features Rawcaster
            provides with this feature.
          </p>
          <Link className={classes.getStarted} to="/signup">
            Get Started
          </Link>
        </div>
      </div>

      {/* Live Talk Show */}
      <div className={classes.homeContent}>
        <div className={classes.imgSec}>
          <img src={require("../../Assets/Images/png/post-nuggets.png")} />
        </div>
        <div className={classes.textSec}>
          <img src={thumblogo} />
          <h2>Post Nuggets</h2>
          <p>
            Share the precious thoughts and tidbits that are in your mind with
            your fans, special connections, or the public. Add some videos or
            photos to convey your message.
          </p>
          <p>
            Nuggets are probably your best tool to make new fans. As you post
            interesting Nuggets, you create appetite for your readers and they
            would want to follow you along.
          </p>
          <Link className={classes.getStarted} to="/signup">
            Get Started
          </Link>
        </div>
      </div>

      <div className={classes.platform}>
        <h1>One platform, endless potential</h1>
        <h5>
          with Rawcaster Influencers, bloggers, writers, photographers can
          collaborate with their fans easily
        </h5>
        <div className={classes.textSec}>
          <img src={require("../../Assets/Images/png/nuggets.png")} />
          <h3>Nuggets</h3>
          <p>
            These are small pieces or tidbit of thoughts in your mind or an
            image (video or picture) that you want to share with one or more
            connected persons.
          </p>
        </div>
        <div className={classes.textSec}>
          <img src={require("../../Assets/Images/png/event-hosting.png")} />
          <h3>Event Hosting</h3>
          <p>
            From the comfort of your home to when you are on the road; Rawcaster
            allows you to host or attend important events and meetings like you
            were there.{" "}
          </p>
        </div>
        <div className={classes.textSec}>
          <img src={require("../../Assets/Images/png/live-chat.png")} />
          <h3>Live Chatting</h3>
          <p>
            Chat allows you to have an end-to-end encrypted conversation by
            text, video or audio with one or more people at the same time.{" "}
          </p>
        </div>
        <div className={classes.btnSec}>
          <Link className={classes.getStarted} to="/signup">
            Get Started for free
          </Link>
        </div>
      </div>

      <div className={classes.platform}>
        <h1>Rawcaster unique features</h1>
        <h5>
          The first platform that gives you a space to chat, talk, host and
          participate in live events virtually
        </h5>
        <img src={require("../../Assets/Images/png/rawcaster_window.png")} />
      </div>

      <div className={classes.founder}>
        <div className={classes.msgBox}>
          <img
            className={classes.bgShape}
            src={require("../../Assets/Images/svg/bg-elemtns.svg")}
          />
          {/* <img className={classes.profileImg} src={require("../../assets/home/profile-img.png")} /> */}
          <p>
            <img className={classes.smLogo} src={mainlogowhite} />
            <br />
            <br />
            “Rawcaster is a platform created to appeal to young and educated
            people whose lifestyle, activities and social profile give them
            influence over many others who look to them as role models.
            Rawcaster is built to offer these influencers every tool they need
            to interact with their fans and for the fans to interact with each
            other”
            <br />
            <br />- Godfrey (Co-founder)
          </p>
        </div>
      </div>

      <div className={classes.downloadApp}>
        <div className={classes.textSec}>
          <div className={classes.centerBox}>
            <img
              className={classes.Rlogo}
              src={require("../../Assets/Images/png/ricon.png")}
            />
            <h4>Download Apps</h4>
            <p>
              Please download the Rawcaster app from Google Play store and APP
              store.
            </p>
            <a
              target="_blank"
              href="https://apps.apple.com/in/app/rawcaster-com/id1547774638"
            >
              <img
                className={classes.appImg}
                src={require("../../Assets/Images/png/app-store.png")}
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.rawcaster"
              target="_blank"
            >
              <img
                className={classes.appImg}
                src={require("../../Assets/Images/png/play-store.png")}
              />
            </a>
          </div>
        </div>
        <div className={classes.imgSec}>
          <img src={require("../../Assets/Images/png/download-app.png")} />
        </div>
      </div>

      <div className={classes.platform}>
        <div className={classes.bgart}>
          <h1>Are you Ready to try out Rawcaster?</h1>
          <h5>
            Start scaling your customer support, and, collaborate better with
            your team
          </h5>
          <div className={classes.btnSec}>
            <Link className={classes.getStarted} to="/signup">
              Get Started for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
