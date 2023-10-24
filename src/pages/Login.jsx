import React, { useContext, useEffect, useState } from "react";
import assets from "../assets";
import {
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link as LinkUI,
  Checkbox,
  Button as ButtonUI,
  Textarea,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SpinnerDotted } from "spinners-react";
import { RoomContext } from "../context/RoomContext";
import ScrollToTop from "../components/ScrollToTop";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLogin } = useContext(RoomContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //register
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isVisibleReg, setIsVisibleReg] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailRegError, setEmailRegError] = useState(false);
  const [identityError, setIdentityError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [passwordRegError, setPasswordRegError] = useState(false);
  const [isRegisCheck, setIsRegisCheck] = useState(false);
  const [isValidEmailReg, setIsValidEmailReg] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityReg = () => setIsVisibleReg(!isVisibleReg);

  // useEffect(() => {
  //   setIsRegisCheck(false)
  // },[isRegisCheck]);

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

      const apiURL = "http://localhost:8000/api/login";

      const requestBody = {
        email: email,
        password: password,
      };

      const response = await axios.post(apiURL, requestBody);

      if (response.status === 200) {
        toast.success("Login Successful", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        console.log("RESPONSE", JSON.stringify(response, null, 2));
        localStorage.setItem("token", response.data.auth.token);
        localStorage.setItem("email", response.data.data.email);
        const emailLocal = localStorage.getItem("email");
        console.log("EMAIL", emailLocal);
        setIsLogin(true);
        navigate("/");
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

  const handleRegister = async () => {
    try {
      if (
        !name &&
        !emailReg &&
        !identity &&
        !phone &&
        !address &&
        !passwordReg
      ) {
        setNameError(true);
        setEmailRegError(true);
        setIdentityError(true);
        setPhoneError(true);
        setAddressError(true);
        setPasswordRegError(true);
      }
      if (!name) {
        setNameError(true);
        return;
      }
      if (!emailReg) {
        setEmailRegError(true);
        return;
      }
      if (!identity) {
        setIdentityError(true);
        return;
      }
      if (!phone) {
        setPhoneError(true);
        return;
      }
      if (!address) {
        setAddressError(true);
        return;
      }
      if (!passwordReg) {
        setPasswordRegError(true);
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(emailReg)) {
        setIsValidEmailReg(true);
        return;
      }

      const apiURL = "http://localhost:8000/api/register";

      const requestBody = {
        nama: name,
        email: emailReg,
        no_identitas: identity,
        no_telepon: phone,
        alamat: address,
        role: "P",
        password: passwordReg,
      };

      const response = await axios.post(apiURL, requestBody);

      if (response.status === 200) {
        toast.success("Register Successful", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        console.log("RESPONSE", JSON.stringify(response, null, 2));
        setIsRegisCheck(true);
        onOpenChange(true);
        setName("");
        setEmailReg("");
        setIdentity("");
        setPhone("");
        setAddress("");
        setPasswordReg("");
      } else {
        toast.error("Register Failed", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Register Error", error);
      toast.error("Register Failed!", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
    }
  };

  return (
    <section>
      <ScrollToTop />
      <div className="h-[800px] lg:h-[860px] relative">
        <img
          className="object-cover w-full h-full"
          src={assets.HOTELBUILDING}
          alt=""
        />
        <div className="absolute h-full top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black/60">
          <div className="bg-[#111827] z-20 px-10 py-8 mt-20 w-[380px] rounded-lg text-center relative lg:w-[450px] lg:-mt-20">
            <img
              className="w-[60px] mx-auto my-auto"
              src={assets.LOGO_AJA}
              alt=""
            />
            <h3 className="h3 tracking-[2px] mt-3 text-white">Sign In</h3>
            <div className="flex flex-col w-full h-[200px] mt-8">
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
                errorMessage={
                  isValid
                    ? "Email cannot be empty"
                    : isValidEmail
                    ? "Please enter a valid email"
                    : ""
                }
                className="text-left"
              />
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
                className="text-left mt-4"
                errorMessage={isValidPassword ? "Password cannot be empty" : ""}
                endContent={
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
                }
              />
              <Link
                to={'/forgotPassword'}
                className={
                  isValidPassword || isValidEmail
                    ? `text-gray-300 text-[14px] text-right`
                    : `text-gray-300 text-[14px] text-right mt-4`
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
            <p className="text-gray-300 text-[14px] mt-6">
              Don't have an account?{" "}
              <button onClick={onOpen} className="font-semibold">
                Register
              </button>
            </p>

            {/* Modal Register */}
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              scrollBehavior="inside"
              placement="top-center"
              size="md"
              className="bg-[#1E2131] mt-10 lg:w-100"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 pt-10 text-center text-[30px] text-white font-primary tracking-[2px]">
                      <img
                        className="w-[50px] mx-auto my-auto"
                        src={assets.LOGO_AJA}
                        alt=""
                      />
                      Register
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        type="text"
                        label="Name"
                        color="default"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameError(false);
                        }}
                        errorMessage={nameError ? "Name cannot be empty" : ""}
                      />
                      <Input
                        type="email"
                        label="Email"
                        color="default"
                        value={emailReg}
                        onChange={(e) => {
                          setEmailReg(e.target.value);
                          setEmailRegError(false);
                          setIsValidEmailReg(false);
                        }}
                        errorMessage={
                          emailRegError
                            ? "Email cannot be empty"
                            : isValidEmailReg
                            ? "Please enter a valid email"
                            : ""
                        }
                      />
                      <Input
                        type="text"
                        label="Identity Number"
                        color="default"
                        value={identity}
                        onChange={(e) => {
                          setIdentity(e.target.value);
                          setIdentityError(false);
                        }}
                        errorMessage={
                          identityError ? "Identity Number cannot be empty" : ""
                        }
                      />
                      <Input
                        type="number-pad"
                        label="Phone Number"
                        color="default"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError(false);
                        }}
                        errorMessage={
                          phoneError ? "Phone Number cannot be empty" : ""
                        }
                      />
                      <Textarea
                        type="text"
                        label="Address"
                        color="default"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setAddressError(false);
                        }}
                        errorMessage={
                          addressError ? "Address cannot be empty" : ""
                        }
                      />
                      <Input
                        type={isVisibleReg ? "text" : "password"}
                        label="Password"
                        color="default"
                        value={passwordReg}
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibilityReg}
                          >
                            {isVisibleReg ? (
                              <AiFillEyeInvisible className="text-xl text-gray-700" />
                            ) : (
                              <AiFillEye className="text-xl text-gray-700" />
                            )}
                          </button>
                        }
                        onChange={(e) => {
                          setPasswordReg(e.target.value);
                          setPasswordRegError(false);
                        }}
                        errorMessage={
                          passwordRegError ? "Password cannot be empty" : ""
                        }
                      />
                    </ModalBody>
                    <ModalFooter className="justify-center">
                      <ButtonUI
                        onPress={() => {
                          handleRegister();
                        }}
                        className="w-full bg-[#D0C379]"
                      >
                        Register
                      </ButtonUI>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
