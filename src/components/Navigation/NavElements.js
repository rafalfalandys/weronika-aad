import NavItem from "./NavItem";
import styles from "./NavElements.module.scss";
import ToggleSwitch from "../UI/ToggleSwitch";
import { useContext } from "react";
import ContextUI from "../../store/context-ui";
import useFirebase from "../../hooks/use-firebase";
import { logout } from "../../helper/firebase";
// import { Link } from "react-router-dom";

function NavElements(props) {
  const { isEnglish, editMode } = useContext(ContextUI);
  const { user } = useFirebase();

  return (
    <ul className={styles.links}>
      <NavItem mobile={props.mobile} linkTo="/about">
        {isEnglish ? "About" : "O mnie"}
      </NavItem>
      <NavItem mobile={props.mobile} linkTo="/portfolio" hover={props.hover}>
        Porfolio
      </NavItem>
      {/* {props.mobile && (
        <div className={styles.sublinks}>
        <Link to="/portfolio/architecture" className={styles.sublink}>
        Architecture
        </Link>
        <Link to="/portfolio/photography" className={styles.sublink}>
        Photography
        </Link>
        </div>
      )} */}
      <NavItem mobile={props.mobile} linkTo="/contact">
        {isEnglish ? "Contact" : "Kontakt"}
      </NavItem>
      {editMode && (
        <NavItem mobile={props.mobile} linkTo={user ? "/edit-panel" : "/login"}>
          {isEnglish ? "Edit" : "Edycja"}
        </NavItem>
      )}
      {editMode && user && (
        <span className={styles["nav-item"]} onClick={logout}>
          {isEnglish ? "Logout" : "Wyloguj"}
        </span>
      )}
      <ToggleSwitch homeEdition={props.homeEdition} />
    </ul>
  );
}

export default NavElements;
