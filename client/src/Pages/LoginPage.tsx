import Login from "../Components/Auth/Login";
import { ILoginPageProps } from "../Interfaces/interfaces";

const LoginPage = ({ updateLoggedIn }: ILoginPageProps) => {
  return <Login updateLoggedIn={updateLoggedIn} />;
};

export default LoginPage;
