import React, { useContext, useState } from "react";
import assets from "../../assets";
import { Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { SpinnerDotted } from "spinners-react";
import { toast } from "react-toastify";
import axios from "axios";
import { RoomContext } from "../../context/RoomContext";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { setIsLoginPegawai } = useContext(RoomContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      if (!email && !password) {
        setIsValid(true);
        setIsValidPassword(true);
        setIsLoading(false);
        return;
      } else if (!password) {
        setIsValidPassword(true);
        setIsLoading(false);
        return;
      } else if (!email) {
        setIsValid(true);
        setIsLoading(false);
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        setIsValidEmail(true);
        setIsLoading(false);
        return;
      }

      const apiURL = "https://ah-project.my.id/api/loginPegawai";

      const requestBody = {
        email: email,
        password: password,
      };

      const response = await axios.post(apiURL, requestBody);

      if (response.status == 200) {
        toast.success("Login Successful", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        console.log("RESPONSE", JSON.stringify(response, null, 2));
        localStorage.setItem("tokenPegawai", response.data.auth.token);
        localStorage.setItem("role", response.data.data.role);
        localStorage.setItem("emailPegawai", response.data.data.email);
        localStorage.setItem("idPegawai", response.data.data.id);
        const emailLocal = localStorage.getItem("emailPegawai");
        const getRole = localStorage.getItem("role");
        console.log("EMAIL", getRole);
        setIsLoginPegawai(true);
        {getRole == 'Admin' ? (
          navigate("/home/room")
        ) : 
          navigate("/home")
        }
      } else {
        toast.error("Login Failed", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Login Error", error);
      toast.error("Login Failed! Invalid Email or Password", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="h-screen relative">
        <img
          className="object-cover w-full h-full"
          src={assets.BGPROFILE}
          alt=""
        />
        <div className="absolute h-full top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black/60">
          <div className="bg-[#E5E5E5] z-20 px-10 py-8 mt-20 w-[380px] rounded-lg text-center relative lg:w-[450px] lg:-mt-20">
            <img
              className="w-[60px] mx-auto my-auto"
              src={assets.LOGO_AJA}
              alt=""
            />
            <h3 className="h3 tracking-[2px] mt-3 text-[#A37D4C]">
              Employee Sign In
            </h3>
            <div className="flex flex-col w-full h-[200px] mt-8">
              <div className="relative">
                <Input
                  type="email"
                  label="Email"
                  labelPlacement="inside"
                  color="default"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsValid(false);
                    setIsValidEmail(false);
                  }}
                  className="border-1 border-accent rounded-xl w-full"
                />
                {isValid || isValidEmail ? (
                  <p className="text-red-500 text-[13px] text-left mb-2">
                    {" "}
                    {isValid
                      ? "Email cannot be empty"
                      : isValidEmail
                      ? "Please enter a valid email"
                      : ""}
                  </p>
                ) : null}
              </div>

              <div className="relative mt-4">
                <Input
                  type={isVisible ? "text" : "password"}
                  label="Password"
                  labelPlacement="inside"
                  color="default"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsValidPassword(false);
                  }}
                  className="border-1 border-accent rounded-xl w-full"
                />
                {isValidPassword ? (
                  <p className="text-red-500 text-[13px] text-left">
                    Password cannot be empty
                  </p>
                ) : null}
                <div className="absolute top-0 right-2 mt-5">
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <AiFillEyeInvisible className="text-xl text-gray-700" />
                    ) : (
                      <AiFillEye className="text-xl text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
              <Link
                to={"/forgotPassPegawai"}
                className={
                  isValidPassword || isValidEmail
                    ? `text-accent text-[14px] text-right`
                    : `text-accent text-[14px] text-right mt-4`
                }
              >
                Forgot Password?
              </Link>
            </div>

            <button
              className={
                isValid || isValidEmail
                  ? `btn btn-lg btn-primary h-[40px] w-full rounded-md mx-auto mt-5`
                  : `btn btn-lg btn-primary h-[40px] w-full rounded-md mx-auto -mt-3`
              }
              onClick={() => {
                handleLogin();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <SpinnerDotted color="white" className="h-5" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginAdmin;
