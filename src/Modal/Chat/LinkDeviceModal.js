/**
 * A modal component that displays a QR code and instructions for linking a device to Rawcaster Web chat.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @returns The LinkDeviceModal component.
 */
import { Modal, QRCode } from "antd";
import { useEffect, useState } from "react";
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

  /**
   * Generates an encrypted string by making a request to the GenerateQRtokenService API
   * with the user's token. The encrypted string is then set using the setEncryptedString
   * function. If the request is successful and the status is 1, the QR data is retrieved
   * using the getQrData function and the isError state is set to false. If the request fails,
   * the isError state is set to true. Finally, the isLoading state is set to false.
   * @returns None
   */
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

  /**
   * Retrieves QR data by generating an encrypted string after a delay of 120 seconds.
   * @returns None
   */
  const getQrData = () => {
    setTimeout(() => {
      generateEncryptedString();
    }, 120000);
  };

  /**
   * Runs the generateEncryptedString function once when the component is mounted.
   * @returns None
   */
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
