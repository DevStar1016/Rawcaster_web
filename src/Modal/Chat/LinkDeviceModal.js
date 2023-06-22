import { Modal, QRCode } from "antd";
import { AES } from "crypto-js";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import classes from "./Chat.module.css";
import RawcasterLogo from "../../Assets/Icons/svg/qr_logo.svg";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { GenerateQRtokenService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";

const LinkDeviceModal = ({ open, close }) => {
  const [encryptedString, setEncryptedString] = useState("Loading...");
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const token = useAuthToken();

  const generateEncryptedString = () => {
    const userData = {
      token,
    };
    GenerateQRtokenService(JSONtoformdata(userData))
      .then(({ data }) => {
        if (data.status === 1) {
          setEncryptedString(data.qr_token);
          getQrData();
          setisError(false);
        } else {
          setisError(true);
        }
      })
      .catch(() => {
        setisError(true);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const getQrData = () => {
    setTimeout(() => {
      generateEncryptedString();
    }, 120000);
  };

  useEffect(() => {
    generateEncryptedString();
  }, []);

  return (
    <>
      <Modal
        title={<h1 className={classes.heading}>Use Chat in Rawcaster Web </h1>}
        open={open}
        footer={null}
        onCancel={close}
        width={800}
        centered
      >
        <div className={classes.linkContainer}>
          <Row>
            <Col sm={8}>
              <ol className={classes.editableSec}>
                <li>Open Rawcaster on your mobile</li>
                <li>Login to your Rawcaster account</li>
                <li>Go to chat section and click on the QR icon</li>
                <li>Point your phone to this screen to capture the QR code</li>
              </ol>
            </Col>
            <Col sm={4}>
              <div className={classes.qrSec}>
                <QRCode
                  errorLevel={"L"}
                  status={
                    isLoading ? "loading" : isError ? "expired" : "active"
                  }
                  value={encryptedString}
                  icon={RawcasterLogo}
                  iconSize={25}
                  size={200}
                  className={classes.qrcode}
                  onRefresh={() => generateEncryptedString()}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default LinkDeviceModal;
