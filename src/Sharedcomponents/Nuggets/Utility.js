import { useEffect, useState } from "react";
import classes from "./Nuggets.module.css";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { getNuggetContentAudioService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import {
  useListNuggetContext,
  useMainContext,
  useSingleNuggetContext,
} from "../../Shared/Context";
import { useDispatch } from "react-redux";
import {
  handleNuggetReadoutUrlUpdate,
  handleNuggetTranslateUpdate,
} from "../../Store/Redux/Reducer/NuggetsReducer";

/**
 * A component that displays a readout section for a nugget.
 * @param {string} nugget_id - The ID of the nugget.
 * @param {string|null} [readout_url=null] - The URL of the readout audio file.
 * @returns The readout section component.
 */
export const ReadoutSec = ({ nugget_id, readout_url = null }) => {
  const { player, setplayer, PlayerSource } = useMainContext();
  const token = useAuthToken();
  const dispatch = useDispatch();
  const { audio, setAudio, isPlaying, setisPlaying } = useListNuggetContext();
  const { ReadoutRef } = useListNuggetContext();
  const [isFetchingurl, setisFetchingurl] = useState(false);

  const handleplayaudio = (url) => {
    if (player && player.id !== nugget_id) {
      player.pause();
    }
    const audioElement = new Audio(url);
    audioElement.id = nugget_id;
    setAudio(audioElement);
    setplayer(audioElement);
    setisPlaying(nugget_id);
    audioElement.play();
  };

  const HandlegetNuggetContentAudio = () => {
    if (ReadoutRef.current) {
      ReadoutRef.current.abort("Request Cancelled");
    }
    ReadoutRef.current = new AbortController();

    if (audio) {
      audio.pause();
      setAudio(null);
      setisPlaying(false);
    }

    if (readout_url) {
      handleplayaudio(readout_url);
      return;
    }

    setisFetchingurl(true);
    const formData = {
      token,
      nugget_id,
    };
    getNuggetContentAudioService(JSONtoformdata(formData), {
      signal: ReadoutRef.current.signal,
    })
      .then((res) => {
        if (res?.data?.status === 1) {
          if (audio) {
            audio.pause();
            setAudio(null);
            setisPlaying(false);
          }
          const NuggetData = {
            nugget_id,
            readout_url: res?.data?.file_path,
          };
          dispatch(handleNuggetReadoutUrlUpdate(NuggetData));
          handleplayaudio(res?.data?.file_path);
        } else {
          if (res?.data?.msg) {
            toast.error(res?.data?.msg);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        PlayerSource.current = null;
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
      audio.addEventListener("pause", () => {
        audio.pause();
      });
    }

    // return () => {
    //   if (ReadSource.current) {
    //     isRequestCancel = true;
    //     ReadSource.current.cancel("Request Cancelled");
    //   }
    // };
  }, [audio]);

  return isPlaying === nugget_id ? (
    <div
      className={classes.readoutContainer}
      style={{ color: "red" }}
      onClick={() => {
        handleStopAudio();
      }}
    >
      <i className="material-symbols-outlined">mic_off</i>
      <p>Stop</p>
    </div>
  ) : (
    <>
      {isFetchingurl ? (
        <p className={`mx-2 ${classes.fetchingSec}`}>
          <div className="dot_typing"></div>
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

/**
 * Component that displays a button to toggle between the original text and translated text.
 * @param {string} nugget_id - The ID of the nugget.
 * @param {string} [translate_text=null] - The translated text.
 * @returns JSX element that renders the translation button.
 */
export const SeeTranslate = ({ nugget_id, translate_text = null }) => {
  const { PlayerSource } = useMainContext();
  const token = useAuthToken();
  const dispatch = useDispatch();
  const { isTranslate, setisTranslate } = useSingleNuggetContext();
  const [isFetching, setisFetching] = useState(false);

  const getTranslatedText = () => {
    if (translate_text) {
      setisTranslate(true);
    } else {
      setisFetching(true);
      const formData = {
        token,
        nugget_id: nugget_id,
        translation_type: 2,
      };
      getNuggetContentAudioService(
        JSONtoformdata(formData)
        // PlayerSource.current.token
      )
        .then((res) => {
          if (res.data.status === 1 && res.data.translation) {
            dispatch(
              handleNuggetTranslateUpdate({
                nugget_id: nugget_id,
                translate_text: res.data.translation,
              })
            );
            setisTranslate(true);
          } else {
            toast.error(res.data.msg);
          }
        })
        .finally(() => {
          setisFetching(false);
        });
    }
  };
  return (
    <div
      className={classes.translationTxt}
      onClick={() => {
        if (isTranslate) {
          setisTranslate(false);
        } else {
          getTranslatedText();
        }
      }}
    >
      {isFetching ? (
        <p className={`mx-2 ${classes.fetchingSec}`}>
          <div className="dot_typing"></div>
        </p>
      ) : (
        <>
          <span className="material-symbols-rounded">g_translate</span>
          See {isTranslate ? "Original" : "Translation"}
        </>
      )}
    </div>
  );
};
