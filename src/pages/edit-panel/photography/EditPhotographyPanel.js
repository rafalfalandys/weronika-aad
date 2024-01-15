import { Fragment } from "react";
import styles from "./EditPhotographyPanel.module.scss";
import Header from "../../../components/Header/Header";
import { Outlet, redirect } from "react-router-dom";
import { useContext } from "react";
import { URL } from "../../../config";
import ContextUI from "../../../store/context-ui";

function EditPhotographyPanel() {
  const { editMode, toggleEditMode, deletingMode, toggleDeletingMode } =
    useContext(ContextUI);

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
        <Outlet />
      </main>
    </Fragment>
  );
}

export default EditPhotographyPanel;

////////////////////////////////////////////////////////
/////////////////// action functions ///////////////////
////////////////////////////////////////////////////////

const buildImgsArr = async (data) => {
  const urls = data.getAll("url");
  const types = data.getAll("type");
  const thumbnails = data.getAll("thumbnail");
  const names = data.getAll("name");
  return urls.map((el, i) => {
    return {
      type: types[i],
      url: el,
      thumbnail: thumbnails[i],
      name: names[i],
    };
  });
};

const loadProject = async (project, token, method = "PATCH") => {
  await fetch(`${URL}/projects/${project.key}.json?auth=${token}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
};

export async function action({ request }) {
  const data = await request.formData();
  const token = await data.get("token");

  // updating order of projects
  if (data.has("projects")) {
    const projects = JSON.parse(data.get("projects"));

    projects.forEach(async (project, i) => {
      const updatedProject = { ...project, order: `${i}`.padStart(2, "0") };
      await loadProject(updatedProject, token);
    });

    return redirect("/architecture");
  }

  // editing/adding project
  if (data.has("title")) {
    const images = await buildImgsArr(data);
    const projectData = {
      location: data.get("location"),
      title: data.get("title"),
      tytul: data.get("tytul"),
      id: data.get("title").replaceAll(" ", "-").toLowerCase(),
      year: data.get("year"),
      role: data.get("role").split(", "),
      tags: data.get("tags").split(", "),
      description: data.get("description"),
      opis: data.get("opis"),
      key: data.get("key"),
      images: images,
    };

    await loadProject(projectData, token, request.method);
    console.log("project loaded");

    if (request.method === "POST") return null;
    else return redirect(`/architecture/${projectData.id}`);
  }

  // deleting projects
  if (request.method === "DELETE") {
    await fetch(`${URL}/projects/${data.get("key")}.json?auth=${token}`, {
      method: "DELETE",
    });
    return null;
  } else return null;
}
