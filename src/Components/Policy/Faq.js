import React, { useEffect, useState } from "react";
import classes from "./Faq.module.css";
import { Collapse } from "antd";
import { getFaqService } from "../../Services/ApiService";

const Faq = () => {
  const { Panel } = Collapse;
  const [faq, setFaq] = useState([]);
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

              {/* <Panel header={heading} key="2">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>
                    <Panel header={heading} key="3">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="4">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="5">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="6">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="7">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="8">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                   
                    <Panel header={heading} key="9">   
                    <p>
                    Purchase token is a permission granted to a user to make a purchase with his points in Myluckyzone.com. Each person you refer earns you a bonus token valid for a purchase from the open sales category. Each 5 persons you refer earns you an elite token valid to make a purchase from the elite category you belong to.
                    </p>                 
                    </Panel>                    */}
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
