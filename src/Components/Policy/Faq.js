import React, { useEffect, useState } from "react";
import classes from "./Faq.module.css";
import { Collapse } from "antd";
import { getFaqService } from "../../Services/ApiService";

const Faq = () => {
  const { Panel } = Collapse;
  const [faq, setFaq] = useState([]);
  /**
   * Executes the specified effect function after the component has rendered.
   * Fetches the FAQ service data and updates the state with the response data.
   * @returns None
   */
  useEffect(() => {
    getFaqService()
      .then((response) => {
        if (response.data.status === 1) {
          setFaq(response.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const heading = (ques) => (
    <div>
      {ques} <i className="material-icons">expand_more</i>
    </div>
  );
  return (
    <>
      <div className={classes.faq_banner}>
        <h1 className={classes.heading_h1}>Hi, How Can We Help?</h1>
        <p className={classes.subhead}>
          Can’t find an answer? <span>Submit your question</span> to us
        </p>
      </div>
      <div className="bodycontentdiv">
        <div className={classes.faq}>
          <div className={classes.contentSec}>
            <Collapse accordion>
              {faq.map((ele, ind) => {
                return (
                  <Panel header={heading(ele.question)} key={ind}>
                    <div dangerouslySetInnerHTML={{ __html: ele.answer }} />
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
