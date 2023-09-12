import { Input, Modal } from "antd";
import styles from "./RenameModal.module.css";
import { FormikProps, useFormik } from "formik";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { EventContextProp } from "./types";
import { useEventRoomContext } from "../../../Shared/Context";
import * as yup from "yup";
interface MyValues {
  name: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required(`Please input your Valid name!`),
});

const RenameModal = ({ open, ele, close, success }) => {
  const { EventData }: EventContextProp = useEventRoomContext();
  const {
    values,
    handleChange,
    handleSubmit,
    touched,
    errors,
  }: FormikProps<MyValues> = useFormik<MyValues>({
    initialValues: {
      name: ele.name,
    },
    validationSchema,
    onSubmit: (val) => {
      HandleRename(val);
    },
  });

  /**
   * Handles the renaming of a user by sending a message to the Chime server with the updated user information.
   * @param {MyValues} val - The updated user values.
   * @returns None
   */
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
        {touched.name && <p className="ErrTxt ms-1 mt-1">{errors?.name}</p>}
      </div>
    </Modal>
  );
};

export default RenameModal;
