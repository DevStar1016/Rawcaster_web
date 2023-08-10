function manageVote(results: Array<any>, item: any, refs: any, theme: any) {
  animateAnswers(results, refs, theme, item);
}

function animateAnswers(
  results: Array<any>,
  refs: any,
  theme: any,
  index: number
) {
  const answers: any[] = [];
  let restOfAnswers: any[] = [];

  for (const result of results) {
    if (index !== undefined) {
      result.option_id !== index && restOfAnswers.push(result);
    } else {
      restOfAnswers = results;
    }
    const findIndex = results.findIndex(
      (ele) => ele.option_id === result.option_id
    );
    const answerBuffer = refs?.current[findIndex]?.current;
    answerBuffer && answers.push(answerBuffer);
  }

  if (index !== undefined) {
    // animate clicked answer
    if (answers[index]) {
      answers[index]?.animate(
        [
          { width: 0, easing: "ease-out", backgroundColor: "white" },
          {
            width: `${results[index].option_percentage}%`,
            easing: "ease-out",
            background: `${theme?.activeBg}`,
          },
        ],
        500
      );
      answers[index].style.width = `${results[index].option_percentage}%`;
      if (theme?.mainColor) answers[index].style.background = theme?.activeBg;
    }
  }

  // animate rest of answers (not clicked)
  restOfAnswers.map((ele: any, index: number) => {
    if (answers[index]) {
      answers[index]?.animate(
        [
          { width: 0, easing: "ease-out", backgroundColor: "white" },
          {
            width: `${ele.option_percentage}%`,
            easing: "ease-out",
            background: theme?.activeBg,
          },
        ],
        500
      );
      answers[index].style.width = `${ele.option_percentage}%`;
      answers[index].style.background = theme?.activeBg;
    }
  });
}

export { manageVote, animateAnswers };
