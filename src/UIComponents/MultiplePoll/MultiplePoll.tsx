import moment from "moment";
import React, { useState, useEffect, useRef, createRef } from "react";
import { useDispatch } from "react-redux";
import { pollVoteService } from "../../Services/ApiService";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  getRawcaserToken,
  isAccountValid,
  JSONtoformdata,
  utctoUserTimezone,
} from "../../Shared/Utility";
import {
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import styles from "./Multiplepoll.module.css";
import { getCookieData } from "../../Store/Storage";

type prop = {
  nugget_id: number;
  results: Array<any>;
  isVoted?: boolean;
  isVotedId: boolean;
  VoteTiming: string;
  TotalVotes?: any;
  created_date: any;
};
const MultiplePoll = ({
  nugget_id,
  results,
  isVoted = false,
  isVotedId,
  VoteTiming,
  TotalVotes = 0,
  created_date,
}: prop) => {
  const [pollVotedData, setpollVotedData] = useState({
    isVoted: false,
    votedOptionID: "",
  });
  const { userSettings } = useAuth();
  const LoginUserData = useAuthData();
  const dispatch = useDispatch();
  const Token = useAuthToken();

  const getTotalVotes = (votedId = pollVotedData.votedOptionID) => {
    return votedId ? parseInt(TotalVotes) + 1 : TotalVotes;
  };

  const getPollOptions = (votedId: any = pollVotedData.votedOptionID): any => {
    let tempPollOptions = [...results].map((item) => {
      let votes = item.votes;
      if (votedId === item.option_id) {
        votes = parseInt(item.votes) + 1;
      }
      let tempdata = parseInt(votes) / parseInt(getTotalVotes(votedId));
      let calculateVotes = tempdata * 100;

      return {
        ...item,
        votes,
        option_percentage:
          votes && parseInt(getTotalVotes(votedId))
            ? parseFloat(calculateVotes.toString()).toFixed(2)
            : item?.option_percentage
            ? item.option_percentage.toFixed(2)
            : "0.00",
      };
    });
    return [...tempPollOptions];
  };

  const answerRefs = useRef(getPollOptions().map(() => createRef()));

  const theme = {
    textColor: "black",
    backgroundColor: "rgb(241 240 240)",
    activeBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    inactiveBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    alignment: "center",
  };

  const getVotesTiming = () => {
    if (userSettings) {
      const [daysval, hoursval, minutesval] = VoteTiming.split(":");
      const utcString = moment(created_date, "YYYY-MM-DD HH:mm:ss")
        .add(daysval, "days")
        .add(hoursval, "hours")
        .add(minutesval, "minutes");

      const momenttimezone = require("moment-timezone");
      const currentTime = momenttimezone.utc().format("YYYY-MM-DD HH:mm:ss");
      const now = moment(currentTime, "YYYY-MM-DD HH:mm:ss");
      //@ts-ignore
      let timeDiff: number = utcString - now;
      let dur = moment.duration(timeDiff);
      const remainingDays = dur.days();
      const remainingHours = dur.hours();
      const remainingMinutes = dur.minutes();
      let output = "";
      if (remainingDays > 0) {
        output += `${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
        if (remainingMinutes > 0 && remainingHours === 0) {
          output += ` `;
        }
      }

      if (remainingHours > 0) {
        if (remainingDays > 0) {
          output += ` `;
        }
        output += `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
        if (remainingMinutes > 0) {
          output += ` `;
        }
      }

      if (remainingMinutes > 0) {
        output += `${remainingMinutes} minute${
          remainingMinutes > 1 ? "s" : ""
        } `;
      }
      if (output !== "") {
        output += ` left`;
      }
      return output ? output : null;
    }
    return true;
  };

  const handlePoll = (item: any, index: number) => {
    let pollData = {
      token: Token,
      nugget_id: nugget_id,
      poll_option_id: item.option_id,
    };
    pollVoteService(JSONtoformdata(pollData))
      .then((res) => {})
      .catch((err) => {});
  };

  useEffect(() => {
    if (!getVotesTiming() && userSettings) {
      animateAnswers(-1);
      setpollVotedData({
        isVoted: true,
        votedOptionID: "",
      });
    } else if (!Token && !getCookieData("rawcaster_user_token")) {
      setpollVotedData({
        isVoted: true,
        votedOptionID: "",
      });
    } else if (isVoted) {
      animateAnswers(-1);
      setpollVotedData({
        isVoted: true,
        votedOptionID: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, userSettings, isVoted]);

  function animateAnswers(index: number, id?: any) {
    const getValidPercentage = (val: any) => {
      if (parseInt(val) > 100) {
        return 100;
      } else {
        return parseInt(val);
      }
    };
    const answers: any[] = [];
    let restOfAnswers: any[] = [];

    for (const result of getPollOptions(id)) {
      if (index !== undefined) {
        result.option_id !== index && restOfAnswers.push(result);
      } else {
        restOfAnswers = getPollOptions(id);
      }
      const findIndex = getPollOptions(id).findIndex(
        (ele: any) => ele.option_id === result.option_id
      );
      const answerBuffer = answerRefs?.current[findIndex]?.current;
      answerBuffer && answers.push(answerBuffer);
    }

    if (index !== undefined) {
      if (answers[index]) {
        answers[index]?.animate(
          [
            { width: 0, easing: "ease-out", backgroundColor: "white" },
            {
              width: `${parseInt(
                getPollOptions(id)[index].option_percentage
              )}%`,
              easing: "ease-out",
              background: `${theme?.activeBg}`,
            },
          ],
          500
        );
        answers[index].style.width = `${parseInt(
          getPollOptions(id)[index].option_percentage
        )}%`;
        // if (theme?.mainColor) answers[index].style.background = theme?.activeBg;
      }
    }

    // animate rest of answers (not clicked)
    // eslint-disable-next-line array-callback-return
    restOfAnswers.map((ele, index) => {
      if (answers[index]) {
        answers[index]?.animate(
          [
            { width: 0, easing: "ease-out", backgroundColor: "white" },
            {
              width: `${getValidPercentage(ele.option_percentage)}%`,
              easing: "ease-out",
              background: theme?.activeBg,
            },
          ],
          500
        );
        answers[index].style.width = `${getValidPercentage(
          ele.option_percentage
        )}%`;
        answers[index].style.background = theme?.activeBg;
      }
    });
  }

  return (
    <>
      <article className={styles.container}>
        {getPollOptions().map((result: any, index: number) => (
          <div
            key={result.option_id}
            role="button"
            id={"mulAnswer" + result.option_id}
            className={
              pollVotedData.isVoted
                ? styles.answer
                : styles.answer_hover + " " + styles.answer
            }
            style={{
              backgroundColor:
                pollVotedData.isVoted || !getVotesTiming()
                  ? "rgb(241 240 240)"
                  : "#F2718D",
            }}
            onClick={() => {
              if (!pollVotedData.isVoted && getVotesTiming()) {
                if (getRawcaserToken()) {
                  if (isAccountValid(LoginUserData)) {
                    setTimeout(() => {
                      animateAnswers(-1, result?.option_id);
                    }, 1000);
                    setpollVotedData({
                      isVoted: true,
                      votedOptionID: result.option_id,
                    });
                    handlePoll(result, index);
                  } else {
                    dispatch(
                      handleprofileVerifyModalShow({
                        show: true,
                        msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                      })
                    );
                  }
                } else {
                  dispatch(handleloginModalShow(true));
                }
              }
            }}
          >
            <div
              ref={answerRefs?.current[index]}
              className={styles.answerInner}
              style={{
                textAlign:
                  pollVotedData.isVoted || !getVotesTiming()
                    ? "start"
                    : "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  // borderRadius: 8,
                  color:
                    pollVotedData.isVoted || !getVotesTiming()
                      ? "#000"
                      : "#FFF",
                }}
              >
                {result.option_name}
              </p>
            </div>
            {(pollVotedData.isVoted || !getVotesTiming()) && (
              <span style={{ color: "#000" }}>{result.option_percentage}%</span>
            )}
          </div>
        ))}

        <div className={styles.detailSec}>
          <p>
            {getTotalVotes()} votes {getVotesTiming() ? "." : ""}{" "}
            {getVotesTiming()}
          </p>
        </div>
      </article>
    </>
  );
};

export default MultiplePoll;
