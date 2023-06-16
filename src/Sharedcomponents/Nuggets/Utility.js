import React, { useEffect, useState } from "react";
import classes from "./Nuggets.module.css";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { getNuggetContentAudioService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { useListNuggetContext } from "../../Shared/Context";
import { useDispatch } from "react-redux";
import { handleNuggetReadoutUrlUpdate } from "../../Store/Redux/Reducer/NuggetsReducer";
import axios from "axios";

let isRequestCancel = false;

export const ReadoutSec = ({ nugget_id, readout_url = null }) => {
  const token = useAuthToken();
  const dispatch = useDispatch();
  const { audio, setAudio, isPlaying, setisPlaying, ReadSource } =
    useListNuggetContext();
  const [isFetchingurl, setisFetchingurl] = useState(false);

  const HandlegetNuggetContentAudio = () => {
    if (ReadSource.current) {
      isRequestCancel = true;
      ReadSource.current.cancel("Request Cancelled");
    }
    ReadSource.current = axios.CancelToken.source();

    if (audio) {
      audio.pause();
      setAudio(null);
      setisPlaying(false);
    }

    if (readout_url) {
      const audioElement = new Audio(readout_url);
      audioElement.id = nugget_id;
      setAudio(audioElement);
      audioElement.play();
      setisPlaying(nugget_id);
      return;
    }

    setisFetchingurl(true);
    const formData = {
      token,
      nugget_id,
    };
    getNuggetContentAudioService(JSONtoformdata(formData))
      .then((res) => {
        if (res.data.status === 1) {
          if (audio) {
            audio.pause();
            setAudio(null);
            setisPlaying(false);
          }
          const NuggetData = {
            nugget_id,
            readout_url: res.data.file_path,
          };
          dispatch(handleNuggetReadoutUrlUpdate(NuggetData));
          const audioElement = new Audio(res.data.file_path);
          audioElement.id = nugget_id;
          setAudio(audioElement);
          audioElement.play();
          setisPlaying(nugget_id);
        } else {
          toast.error(res.data.msg);
        }
      })
      .finally(() => {
        ReadSource.current = null;
        setisFetchingurl(false);
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

    return () => {
      if (ReadSource.current) {
        isRequestCancel = true;
        ReadSource.current.cancel("Request Cancelled");
      }
      if (audio) {
        audio.pause();
        setisPlaying(null);
      }
    };
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
    <>
      {isFetchingurl ? (
        <p className={`mx-2 ${classes.fetchingSec}`}>
          <div class="dot_typing"></div>
        </p>
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
      )}
    </>
  );
};
