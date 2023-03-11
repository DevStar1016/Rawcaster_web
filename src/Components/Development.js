import React, { useState } from "react";
import MultiplePoll from "../UIComponents/MultiplePoll/MultiplePoll";

const Development = () => {
  const [VoteData, setVoteData] = useState();
  const [Values, setValues] = useState([
    {
      option_id: 11,
      option_name: "Yes",
      option_percentage: 25.0,
    },
    {
      option_id: 12,
      option_name: "No",
      option_percentage: 75.0,
    },
  ]);

  return (
    <div className="w-25 mt-5 pt-5 m-auto">
      <MultiplePoll
        question={"What you wanna ask?"}
        results={Values}
        onVote={(item, results) => {
          console.log(item, results);
          setVoteData(item);
          setValues(results);
        }}
        isVoted={false}
        isVotedId={VoteData?.id || ""}
        VoteTiming={"2:13:22"}
      />
    </div>
  );
};

export default Development;
