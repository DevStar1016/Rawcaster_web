import { Col, Row } from "antd";
import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import classes from "./Influencers.module.css";
import influencerdiamond from "../../Assets/Images/svg/influencers-diamond.svg";
import { Link } from "react-router-dom";


const SelectInfluencers = () => {
  return (
    <div className="mainWrapper innerContent">
      <div className={classes.headerSec}>
        <h1>Welcome Danii - Select your influencers</h1>
        <div className={classes.btnSec}>
          <button>Skip this</button>
        </div>
      </div>
      <div className={classes.influencerContainer}>
          <Row>
            <Col md={16} xs={24}>
              <div className={classes.filterSec}>
              <InputGroup className="mb-3">
                <Form.Control className={classes.inSearch}
                  placeholder="Search Influencer by name"
                  aria-label="Search Influencer by name"
                />
                  <InputGroup.Text className={classes.searchIcon}><span class="material-icons">search</span></InputGroup.Text>
                </InputGroup>
            </div>
          </Col>
          <Col md={8} xs={24}>

          </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>Selected Influencers (03)</Col>
            <Col sm={12} className="text-end">Become a Fan <span className={`material-icons ${classes.rightarrow}`}>arrow_forward</span></Col>
          </Row>

          <Row gutter={15}>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                  <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                  <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
            <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img className={classes.profileimg} src={require("../../Assets/Images/png/influencer.png")}/>
                    <img className={classes.diamond} src={influencerdiamond}/>
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>David Thompson <span className={classes.author}>Priest</span></p>
                  <p className={classes.desc}>
                  Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit. Donec suscipit ex condim entum ante egestas suscipit
                  <span className={classes.readmore}>read more</span>
                  </p>
                 <Link className={classes.fanBtn}>Become a Fan <span class="material-icons">arrow_forward</span></Link>
                </div>
            </Col>
          </Row>

      </div>
    </div>
  );
};

export default SelectInfluencers;
