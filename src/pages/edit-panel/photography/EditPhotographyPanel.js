import { Fragment } from "react";
import styles from "./EditPhotographyPanel.module.scss";
import Header from "../../../components/Header/Header";
import { Form } from "react-router-dom";
import { useContext } from "react";
import { URL } from "../../../config";
import ContextUI from "../../../store/context-ui";
import ImagesPanel from "../../../components/edit-panel/ImagesPanel";
import { buildImgsArr } from "../../../helper/helper";
import useFirebase from "../../../hooks/use-firebase";

function EditPhotographyPanel() {
  const { editMode, toggleEditMode, deletingMode, toggleDeletingMode } =
    useContext(ContextUI);
  const { user } = useFirebase();

  return (
    <Fragment>
      <Header />
      <main className={styles.main}>
        <div className={styles.modes}>
          <h1 className={styles.modebtn} onClick={toggleEditMode}>
            Edit mode: <span>{`${editMode ? "on" : "off"}`}</span>
          </h1>
          <h1 className={styles.modebtn} onClick={toggleDeletingMode}>
            Delete mode: <span>{`${deletingMode ? "on" : "off"}`}</span>
          </h1>
        </div>
        <Form method="post">
          <ImagesPanel />
          <button type="submit">Wyślij</button>
          {user && (
            <input name="token" readOnly hidden value={user.accessToken} />
          )}
        </Form>
      </main>
    </Fragment>
  );
}

export default EditPhotographyPanel;

////////////////////////////////////////////////////////
/////////////////// action functions ///////////////////
////////////////////////////////////////////////////////

const updatePhotos = async (photos, token) => {
  await fetch(`${URL}/photos.json?auth=${token}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photos),
  });
};

export async function action({ request }) {
  const data = await request.formData();
  const token = await data.get("token");

  const images = await buildImgsArr(data);

  updatePhotos(images, token);

  return null;
}
