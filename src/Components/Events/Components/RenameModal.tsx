import { Input, Modal } from "antd";
import styles from "./RenameModal.module.css";
import { FormikProps, useFormik } from "formik";
import { useLayoutContect } from "../../../Layouts/EventLayout";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";

interface MyValues {
  name: string;
}

const RenameModal = ({ open, ele, close, success }) => {
  const { EventData }: any = useLayoutContect();
  const { values, handleChange, handleSubmit }: FormikProps<MyValues> =
    useFormik<MyValues>({
      initialValues: {
        name: "",
      },
      onSubmit: (val) => {
        HandleRename(val);
      },
    });

  const HandleRename = (val: MyValues) => {
    ChimesendMessage(
      {
        ...val,
        refId: EventData?.reference_id,
        hostId: EventData?.original_user_id,
        userId: ele?.userId,
      },
      CHIME_SOCKET_EVENTS.RENAME_USER
    );
    success();
  };

  const handleClose = () => {
    close();
  };
  return (
    <Modal
      title={`Rename ${ele?.name}`}
      open={open}
      onOk={() => handleSubmit()}
      onCancel={handleClose}
      maskStyle={{
        backgroundColor: "rgba(240, 248, 255, 0.052)",
      }}
    >
      <div className={styles.inputContainer}>
        <Input
          placeholder="Enter Name..."
          value={values.name}
          onChange={handleChange("name")}
        />
      </div>
    </Modal>
  );
};

export default RenameModal;
