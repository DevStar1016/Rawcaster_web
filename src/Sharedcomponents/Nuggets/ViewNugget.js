/**
 * A React component that displays the details of a nugget.
 * @returns The rendered component.
 */
import React, { useEffect, useRef, useState } from "react";
import { getNuggetDetailService } from "../../Services/ApiService";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import {
  DecryptionString,
  JSONtoformdata,
  decodeHtml,
} from "../../Shared/Utility";
import { useNavigate, useParams } from "react-router";
import Post from "./Post";
import classes from "./Nuggets.module.css";
import { Spinner } from "react-bootstrap";
import { NuggetSEO, PollNuggetSEO } from "../../Components/SEO/SEOContent";
import Seo from "../../Components/SEO/Seo";
import { ListNuggetContext } from "../../Shared/Context";

const ViewNugget = () => {
  const { nugID } = useParams();
  const ReadSource = useRef(null);
  const ReadoutRef = useRef(null);
  const navigate = useNavigate();
  const nugget_id = nugID ? DecryptionString(nugID) : null;
  const Token = useAuthToken();
  const [NuggetData, setNuggetData] = useState({});
  const [audio, setAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(null);
  const [NuggetCount, setNuggetCount] = useState({
    my_nuggets: 0,
    favorites: 0,
  });

  /**
   * Retrieves the details of a nugget using the provided token and nugget ID.
   * @returns None
   */
  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: nugget_id,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        if (res.data.status === 1) {
          setNuggetData(res.data.nugget_detail);
        } else {
          // navigate(-1);
        }
      })
      .catch((err) => {
        // navigate(-1);
      });
  };

  useEffect(() => {
    if (Token) {
      getNuggetDetail();
    }
  }, [Token, nugget_id]);

  /**
   * Retrieves the original name of a nugget.
   * If the nugget has poll options, it returns the original name formatted for SEO using the PollNuggetSEO function.
   * If the nugget does not have poll options, it returns the original name formatted for SEO using the NuggetSEO function.
   * If the original user name is not available, it defaults to "Nugget".
   * @returns {string} The original name of the nugget formatted for SEO.
   */
  const getOriginalName = () => {
    if (NuggetData?.poll_option?.length !== 0) {
      return PollNuggetSEO(
        NuggetData?.original_user_name
          ? decodeHtml(NuggetData.original_user_name)
          : "Nugget"
      );
    } else {
      return NuggetSEO(
        NuggetData?.original_user_name
          ? decodeHtml(NuggetData.original_user_name)
          : "Nugget"
      );
    }
  };

  const ListNuggetData = {
    audio,
    setAudio,
    isPlaying,
    setisPlaying,
    ReadSource,
    ReadoutRef,
    setNuggetCount,
  };

  return (
    <ListNuggetContext.Provider value={ListNuggetData}>
      <div className={classes.viewDetailNugget}>
        <div className={classes.mainPost}>
          <Seo
            title={getOriginalName().title}
            description={getOriginalName().description}
          />
          {NuggetData ? (
            <Post
              index={0}
              isCommentShow={true}
              ele={NuggetData}
              muted={false}
              Opened={true}
              setmuted={(status) => {}}
              handleLike={(like) => {
                let tempData = { ...NuggetData };
                tempData = {
                  ...tempData,
                  liked: like === 1 ? true : false,
                  total_likes:
                    like === 1
                      ? tempData.total_likes + 1
                      : tempData.total_likes - 1,
                };
                setNuggetData(tempData);
              }}
              handleSave={(save) => {
                let tempData = { ...NuggetData };
                tempData = {
                  ...tempData,
                  saved: save === 1 ? true : false,
                };
                setNuggetData(tempData);
              }}
            />
          ) : (
            <div className={classes.LoadingSec}>
              <Spinner animation="border" color="#563662" />
            </div>
          )}
        </div>
      </div>
    </ListNuggetContext.Provider>
  );
};

export default ViewNugget;
