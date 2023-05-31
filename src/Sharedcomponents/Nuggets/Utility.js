import React, { useEffect, useState } from "react";
import classes from "./Nuggets.module.css";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { getNuggetContentAudioService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";

export const ReadoutSec = ({ nugget_id }) => {
  const token = useAuthToken();
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);

  const HandlegetNuggetContentAudio = () => {
    const formData = {
      token,
      nugget_id,
    };
    getNuggetContentAudioService(JSONtoformdata(formData)).then((res) => {
      if (res.data.status === 1) {
        const audioElement = new Audio(res.data.file_path);
        audioElement.id = nugget_id;
        setAudio(audioElement);
        audioElement.play();
        setisPlaying(nugget_id);
      } else {
        toast.error(res.data.msg);
      }
    });
  };

  const handleStopAudio = () => {
    if (audio) {
      audio.pause();
    }
    setisPlaying(null);
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", function () {
        audio.pause();
        setisPlaying(null);
      });
    }
  }, [audio]);

  return isPlaying === nugget_id ? (
    <div
      className={classes.readoutContainer}
      style={{ color: "red" }}
      onClick={() => {
        handleStopAudio();
      }}
    >
      <i class="material-symbols-outlined">mic_off</i>
      <p>Stop</p>
    </div>
  ) : (
    <div
      className={classes.readoutContainer}
      onClick={() => {
        HandlegetNuggetContentAudio();
      }}
    >
      <i className={classes.read_mic_icon}></i>
      <p>Read Out</p>
    </div>
  );
};
