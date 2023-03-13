import React, { useState, useEffect, useRef, createRef } from "react";
import { toast } from "react-hot-toast";
import { pollVoteService } from "../../Services/ApiService";
import { useListNuggetContext } from "../../Shared/Context";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../Shared/Utility";
import styles from "./Multiplepoll.module.css";
import { animateAnswers, manageVote } from "./Utility";

const MultiplePoll = ({
  nugget_id,
  results,
  isVoted,
  isVotedId,
  VoteTiming,
  TotalVotes = 0,
}) => {
  const { getNuggetList } = useListNuggetContext();
  const [voted, setVoted] = useState(false);
  const Token = useAuthToken();
  const answerRefs = useRef(results.map(() => createRef()));
  const theme = {
    textColor: "black",
    backgroundColor: "rgb(255,255,255)",
    activeBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    inactiveBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    alignment: "center",
  };

  useEffect(() => {
    if (!isVoted) {
      const findIndex = results.findIndex((ele) => ele.option_id === isVotedId);
      if (findIndex !== -1) {
        animateAnswers(results, answerRefs, theme, undefined, findIndex);
        setVoted(true);
      }
    } else {
      animateAnswers(results, answerRefs, theme, undefined, 0);
      setVoted(true);
    }
  }, [results]);

  const getVotesTiming = () => {
    const [daysval, hoursval, minutesval] = VoteTiming.split(":");

    // Create a new Date object with the specified date/time
    const specifiedDate = new Date();
    specifiedDate.setDate(specifiedDate.getDate() + parseInt(daysval));
    specifiedDate.setHours(specifiedDate.getHours() + parseInt(hoursval));
    specifiedDate.setMinutes(specifiedDate.getMinutes() + parseInt(minutesval));

    const currentDate = new Date();

    const differenceInMs = specifiedDate - currentDate;

    const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (differenceInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const durationInSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60;
    const dayInSeconds = 24 * 3600; // seconds in a day

    const remainingDays = Math.floor(durationInSeconds / dayInSeconds);
    const remainingSeconds = durationInSeconds % dayInSeconds;
    const remainingHours = Math.floor(remainingSeconds / 3600);
    const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);

    let output = "";
    if (remainingDays > 0) {
      output += `${remainingDays} day${remainingDays > 1 ? "s" : ""}, `;
    }

    if (remainingHours > 0) {
      output += `${remainingHours} hour${remainingHours > 1 ? "s" : ""}, `;
    }

    output += `${remainingMinutes} minute${
      remainingMinutes > 1 ? "s" : ""
    } left`;

    return output;
  };

  const handlePoll = (item, index) => {
    let pollData = {
      token: Token,
      nugget_id: nugget_id,
      poll_option_id: item.option_id,
    };
    pollVoteService(JSONtoformdata(pollData))
      .then((res) => {
        if (res.data.status === 1) {
          getNuggetList().then((res) => {
            let findData = res.nuggets_list.find(
              (ele) => ele.nugget_id === nugget_id
            );
            if (findData) {
              manageVote(findData.poll_option, index, answerRefs, theme);
              setVoted(true);
            }
          });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
    <article className={styles.container}>
      {results.map((result, index) => (
        <div
          key={result.option_id}
          role="button"
          id={"mulAnswer" + result.option_id}
          className={
            voted ? styles.answer : styles.answer_hover + " " + styles.answer
          }
          style={{
            backgroundColor: voted ? "#FFFFFF" : "#F2718D",
          }}
          onClick={() => {
            if (!voted) {
              handlePoll(result, index);
            }
          }}
        >
          <div
            ref={answerRefs.current[index]}
            className={styles.answerInner}
            style={{
              textAlign: voted ? "start" : "center",
              width: "100%",
            }}
          >
            <p
              style={{
                borderRadius: 8,
                color: voted ? "#000" : "#FFF",
              }}
            >
              {result.option_name}
            </p>
          </div>
          {voted && (
            <span style={{ color: "#000" }}>{result.option_percentage}%</span>
          )}
        </div>
      ))}

      <div className={styles.detailSec}>
        <p>{TotalVotes} votes . {getVotesTiming()}</p>
      </div>
    </article>
    </>
  );
};

export default MultiplePoll;
