import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import StepWizard from "react-step-wizard";
import { IoMdArrowRoundBack, IoIosArrowBack } from "react-icons/io";
import {MdOutlineNavigateNext} from 'react-icons/md'
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { SpinnerDotted } from "spinners-react";
import ScrollToTop from "../../components/ScrollToTop";
import assets from "../../assets";

const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
};

const ForgotPasswordPegawai = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSendResetEmail = async () => {
    try {
      setIsLoading(true);
      const apiURL = "https://ah-project.my.id/api/password/reset/request";
      const requestBody = {
        email: email,
        role: "P",
      };

      const response = await axios.post(apiURL, requestBody);

      if (response.status == 200) {
        handleNext();
      } else {
        toast.error("Email not found!", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Forgot Password API Error:", error);
      toast.error("Email not found!", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      setIsLoading(false);
    }finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async () => {
    try {
      setIsLoading(true);
      const apiURL = "https://ah-project.my.id/api/password/reset";
      const requestBody = {
        email: email,
        role: "P",
        token: token,
        password: password,
      };

      console.log("TOKEN", token);
      const response = await axios.post(apiURL, requestBody);

      if (response.status == 200) {
        toast.success("Success reset password!", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        navigate("/admin");
      } else {
        toast.error("Token Invalid!", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Reset Password API Error:", error);
      toast.error("Token Invalid!", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      setIsLoading(false);
    }
  };

  return (
    <section>
      <ScrollToTop />
      <div className="h-screen lg:h-screen relative">
        <img
          className="object-cover w-full h-full"
          src={assets.BGPROFILE}
          alt=""
        />
        <div className="absolute h-full top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black/60">
          <div className="bg-[#E5E5E5] z-20 px-10 py-8 mt-20 w-[380px] rounded-lg text-center relative lg:w-[450px] lg:-mt-20">
            <StepWizard>
              <div>
                <div className="flex items-center mb-4">
                  <Link to={"/admin"}>
                    <IoMdArrowRoundBack className="mr-2 -mt-2 text-[20px] text-accent" />
                  </Link>

                  <h3 className="h3 text-left text-accent">Forgot Password</h3>
                </div>
                {step == 1 && (
                  <div>
                    <p className="font-tertiary font-semibold text-accent tracking-[2px] text-left mb-2 mt-10">
                      Enter your email to reset your password.
                    </p>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <button
                      className="btn btn-lg btn-primary h-[40px] rounded-md mx-auto mt-6"
                      onClick={handleSendResetEmail}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <SpinnerDotted color="white" className="h-5" />
                      ) : (
                        "Send reset email"
                      )}
                    </button>
                  </div>
                )}

                {step == 2 && (
                  <div>
                    <p className="text-accent text-[14px] text-left mb-2">
                      We've sent an email to the address you provided. Please
                      check your email.
                    </p>
                    <p className="font-tertiary font-semibold text-accent tracking-[2px] text-left mb-2 mt-6">
                      Input your token
                    </p>
                    <Input
                      type="numeric"
                      placeholder="Enter your token"
                      value={token}
                      onChange={handleTokenChange}
                      required
                    />
                  </div>
                )}

                {step == 3 && (
                  <div>
                    <p className="font-tertiary font-semibold text-accent tracking-[2px] text-left mb-2 mt-6">
                      Input New Password
                    </p>
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
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
                  </div>
                )}

                <div>
                  {step == 2 && (
                    <div className="flex justify-between mt-6">
                      
                      <button
                        className="btn btn-lg btn-tertiary h-[40px] rounded-md text-accent"
                        onClick={handlePrevious}
                      >
                        <IoIosArrowBack className="text-accent mr-2"/>
                        Previous
                      </button>
                      <button
                        className="btn btn-lg btn-primary h-[40px] rounded-md"
                        onClick={handleNext}
                      >
                        Next
                        <MdOutlineNavigateNext className="text-xl text-white"/>
                      </button>
                    </div>
                  )}
                  {step == 3 && (
                    <div className="flex justify-between mt-6">
                      <button
                        className="btn btn-lg btn-tertiary h-[40px] rounded-md text-accent"
                        onClick={handlePrevious}
                      >
                        <IoIosArrowBack className="text-accent mr-2"/>
                        Previous
                      </button>
                      <button
                        className="btn btn-lg btn-primary h-[40px] rounded-md"
                        onClick={handleSubmitNewPassword}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </StepWizard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPegawai;
