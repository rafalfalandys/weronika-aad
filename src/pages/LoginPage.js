import { Fragment, useContext } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";

import styles from "./Contact.module.scss";
import ContextUI from "../store/context-ui";
import LoginForm from "../components/LoginForm";
import { login } from "../helper/firebase";

function LoginPage() {
  const { isEnglish } = useContext(ContextUI);

  return (
    <Fragment>
      <Header />
      <main className={styles.main}>
        <h1>{isEnglish ? "Login" : "Zaloguj się"}</h1>
        <LoginForm />
      </main>
      <Footer />
    </Fragment>
  );
}

export default LoginPage;

export async function action({ request }) {
  try {
    const data = await request.formData();

    const email = data.get("email");
    const password = data.get("password");

    login(email, password);

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
