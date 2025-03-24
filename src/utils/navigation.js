import { paths } from "src/routes/paths";

export const redirectToSignIn = () => {
  window.location.href = paths.auth.signIn;
};