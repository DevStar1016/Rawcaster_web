import React from "react";
import classes from "./FirstSteps.module.css";

export default function FirstSteps() {
  return (
    <div className={classes.firstfullSec}>
      <h1>Rawcaster - First Steps </h1>

      <div className={classes.mainContainer}>
        <div className={classes.boxSec}>
          <div className="leftSec">
            <p>
              &emsp; Welcome to Rawcaster; the one stop platform for all your
              social media activities. Here you can post your Nuggets, host or
              participate in a virtual video conference event, and also have an
              end-to-end encrypted conversation with your connections using our
              chat feature in the mobile app. All these features are in one
              platform to help you connect with your fans, friends and the world
              in a most efficient way. To get the best of this platform, we
              recommend you spend a few minutes to customize your dashboard to
              suite your preferences. Here are a few things we recommend:{" "}
            </p>
          </div>
          <div className="rightSec">
            <img src="" />
          </div>
        </div>

        <div className={classes.boxSec}>
          <h2>
            <span className="material-icons">settings</span> General settings
          </h2>
          <p>
            &emsp; Go to settings to choose who sees your phone number,
            location, date of birth, bio data, and online status. You can also
            select the kind of Nuggets you want to see. Right now, you can only
            see Nuggets from Rawcaster, but you may want to see the posts from
            other people like your influencers, connections, public or some
            specific group or individuals in Rawcaster. Many people schedule
            their virtual events in Rawcaster and these scheduled events appear
            on your dashboard by default, you might want to limit the type of
            events that appear on your dashboard by choosing from the “Event
            Display Option”.{" "}
          </p>
        </div>

        <div className={classes.boxSec}>
          <h2>
            <span className="material-icons">notifications</span> Notifications
          </h2>
          <p>
            &emsp; We like to notify you when a conversation, post or scheduled
            event of interest is posted. You can limit the notification method
            according to your preference. You have different notification
            options to choose from, by default, notification would be by email
            and Push to your mobile device.. Event Settings: Rawcaster has
            default settings for your video conference events. We recommend that
            you adjust the settings to your preferences. Especially we recommend
            that you add your own default banner for your events. If you are a
            premium member, you can also change the media to any video or sound
            you want your event participants to watch or hear while they wait
            for you in the waiting room.
          </p>
        </div>

        <div className={classes.boxSec}>
          <h2>
            <span className="material-icons">person</span> Profile settings
          </h2>
          <p>
            &emsp; Another important thing you need to consider is to set your
            profile information to help your connections find you in Rawcaster.
            Add your profile photo and a preferred banner for your profile page.
            A default bio has being auto generated for you using your signup
            information; you can also change it to anything you want.
          </p>
        </div>

        <div className={classes.boxSec}>
          <h2>
            <span className="material-icons">feed</span> Posting Nuggets
          </h2>
          <p>
            &emsp; Finally, Rawcaster will be most beneficial to you when you
            build a network of fans; one of the easiest ways to do that is by
            posting to the public, very good Nuggets that everyone wants to read
            or see. Each person that enjoys your Nuggets would likely add you as
            their influencer. Ok, that’s all for now. Let’s start RAW CASTING!
          </p>
        </div>
      </div>
    </div>
  );
}
