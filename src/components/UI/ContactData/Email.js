import { textCommon } from "../../../assets/texts";
import styles from "./Contact.module.scss";

import { Mail } from "@swiftcarrot/react-ionicons";

function Email(props) {
  return (
    <div className={styles.contact} style={{ height: `${props.height}` }}>
      <Mail />
      <p>{textCommon.email}</p>
    </div>
  );
}

export default Email;
