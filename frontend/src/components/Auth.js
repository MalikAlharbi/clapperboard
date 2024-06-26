import React, { useEffect, useState } from "react";
import { signIn, signUp, forgotPassword } from "../ApiRequest";
import { MdMarkEmailUnread, MdMarkEmailRead } from "react-icons/md";
import Loading from "./Loading";
import { GiClapperboard } from "react-icons/gi";
export default function Auth(props) {
  const { authRef } = props;
  const [login, setIsLogin] = useState(true);
  const [forgotWindow, setForgotWindow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successSignUp, setSuccessSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const authButtons = (currentWindow, forgotWindow) => {
    if (!loading) {
      if (forgotWindow)
        return (
          <button
            className="inline-flex bg-blue-600 items-center justify-center w-full py-2 rounded-full text-xl text-center text-white font-montserrat"
            type="submit"
            onClick={handleForgot}
          >
            {currentWindow}
          </button>
        );
      else
        return (
          <button
            className="inline-flex bg-blue-600 items-center justify-center w-full py-2 rounded-full text-xl text-center text-white font-montserrat"
            type="submit"
          >
            {currentWindow}
          </button>
        );
    }
    else
      return (
        <p className="inline-flex bg-blue-600 items-center justify-center w-full py-2 rounded-full text-xl text-center text-white font-montserrat">
          <Loading color={"green"} />
        </p>
      );
  };
  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await signIn(username, password, rememberMe);
      if (response.success) {
        location.replace("/");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await signUp(username, email, password, rememberMe);
      if (response.success) {
        setSuccessSignUp(true);
      } else {
        setError(response?.error);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await forgotPassword(email);
    if (response.success)
      setSuccessSignUp(true);
    else
      setError(response.message);


    setLoading(false);
  };



  useEffect(() => {
    if (props.login != null) setIsLogin(props.login);
  }, []);

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
    setRememberMe(false);
  }, [login, forgotWindow, successSignUp]);




  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 justify-center items-center pl-10 pr-10 max-h-2xl h-screen w-screen grid place-items-center overflow-y-scroll">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>
      <div
        ref={authRef}
        className="bg-gray-900 py-10 px-10 rounded-xl w-[370px] z-10"
      >
           <a
          href="/"
          className="flex items-center p-6 "
        >
            <GiClapperboard size={35} color="white" />
          <span className="text-2xl ml-2 font-semibold text-red-600">
          clapperboard
          </span>
        </a>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        {successSignUp ? (
          <div className="flex items-center">
            <MdMarkEmailUnread size={80} />
            <p className="text-sm font-bold text-green-600 p-2">
              We've sent email verification to your email. Verify to continue!
            </p>
          </div>
        ) : forgotWindow ? (
          <form onSubmit={handleForgot}>
            <label htmlFor="email" className="font-bold text-lg text-white">
              Enter your account email
            </label>
            <br />
            <input
              required
              type="email"
              id="email"
              name="email"
              className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <br />
            {authButtons("Send email reset", true)}
          </form>
        ) : (
          <form
            className="space-y-2 md:space-y-2"
            onSubmit={login ? handleSignIn : handleSignUp}
          >
            <label htmlFor="username" className="font-bold text-lg text-white">
              Username
            </label>
            <br />
            <input
              required
              type="text"
              id="username"
              name="username"
              className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
              placeholder="name@company.com"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            {!login && (
              <>
                <label htmlFor="email" className="font-bold text-lg text-white">
                  Email
                </label>
                <br />
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <br />
              </>
            )}

            <label htmlFor="password" className="font-bold text-lg text-white">
              Password
            </label>
            <br />
            <input
              required
              type="password"
              id="password"
              name="password"
              className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />

            {login ? (
              // Render login form
              <>
                <div class="inline items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 border rounded dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => {
                      setRememberMe(event.target.checked);
                    }}
                  />
                  <label
                    for="remember"
                    class="ml-2 text-sm font-medium text-white"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="ml-5 text-sm font-bold text-blue-500 hover:underline"
                  onClick={() => setForgotWindow(true)}
                >
                  Forgot password?
                </a>
                <br />
                {authButtons("Login")}

                <br />
                <p className="text-sm font-light text-white mt-3">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </a>
                </p>
              </>
            ) : (
              // Render sign up form
              <>
                <br />
                {authButtons("Sign Up")}
                <br />
                <p className="text-sm font-light text-white mt-3">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    onClick={() => setIsLogin(true)}
                  >
                    Sign in
                  </a>
                </p>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
