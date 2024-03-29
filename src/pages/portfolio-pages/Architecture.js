import { useContext, useEffect } from "react";
import styles from "./Architecture.module.scss";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import ProjectCard from "../../components/portfolio/ProjectCard";
import Filters from "../../components/portfolio/Filters";
import { URL } from "../../config";
import { useCallback } from "react";
import ContextUI from "../../store/context-ui";
import ContextProjects from "../../store/context-projects";
// import useFirebase from "../../hooks/use-firebase";
// import { photosData } from "../../store/photos";

function Architecture() {
  const { isEnglish, hideModal } = useContext(ContextUI);
  const {
    curImgHandler,
    curProject,
    curProjects,
    curProjectsHandler,
    filters,
    sorting,
  } = useContext(ContextProjects);
  const loadedProjects = useLoaderData();
  const location = useLocation().pathname;

  ////////////// BACKUP LOADER ///////////////////
  // const { user } = useFirebase();
  // const onClickHandler = () => {
  //   if (user) {
  //     photosData.forEach((photo) => {
  //       fetch(`${URL}/photos.json?auth=${user.accessToken}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(photo),
  //       });
  //     });
  //   }
  // };

  // here comes a function, instead of simple array, because without useCallback VSC was screaming for dependencies in useEffect below

  const filterProjects = useCallback(() => {
    return loadedProjects
      .filter((project) => {
        if (filters.length === 0) return project;
        return filters
          .map((filter) => project.tags?.some((tag) => tag === filter))
          .reduce((acc, boolean) => acc || boolean);
      })
      .sort((a, b) => {
        if (sorting === "year") {
          return (
            // if year is xxxx - xxxx then pick the later date
            b.year.split(" - ")[b.year.split("-").length - 1] -
            a.year.split(" - ")[a.year.split("-").length - 1]
          );
        }
        if (sorting === "year-reverse")
          // if year is xxxx - xxxx then pick the earlier date
          return a.year.split(" - ")[0] - b.year.split(" - ")[0];
        else return a.order - b.order;
      });
  }, [filters, loadedProjects, sorting]);

  // setting current projects context, so from detailed projects view, I only browse filtered ones
  useEffect(() => {
    curProjectsHandler(filterProjects());
  }, [filters, filterProjects, curProjectsHandler]);

  // set big image to 0 after mounting component anytime we enter this page
  useEffect(() => {
    curImgHandler(0);
  }, [curImgHandler, location]);

  // hiding modal window because if man enter detailed project, than click back to projects, and than jump to another project - it opens with modal on
  useEffect(() => {
    hideModal();
  }, [curProject, hideModal]);

  const projectCards = curProjects.map((project) => (
    <Link to={project.id} className={styles.tile} key={project.id}>
      <ProjectCard
        url={project.images[0].url}
        thumbnail={project.images[0].thumbnail}
        title={project.title}
        tytul={project.tytul}
        year={project.year}
        location={project.location}
        description={(!isEnglish && project.opis) || project.description}
      />
    </Link>
  ));

  return (
    <>
      <Header />
      <Outlet />
      {location === "/architecture" && (
        <main className={styles.main}>
          <Filters />
          {/* <h1 onClick={onClickHandler}>Load backup</h1> */}
          <div className={styles.tiles}>{projectCards}</div>
        </main>
      )}
      <Footer />
    </>
  );
}
export default Architecture;

export async function loader() {
  const response = await fetch(`${URL}projects.json`);
  if (!response.ok) {
    throw new Error(`Something went wrong (${response.status})`);
  }
  const data = await response.json();

  const projectsArr = [];
  for (const key in data) {
    projectsArr.push({ ...data[key], key });
  }

  return projectsArr;
}
