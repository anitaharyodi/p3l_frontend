import React, { useEffect, useState } from "react";
import assets from "../assets";
import {
  Avatar,
  AvatarIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { BiSolidPencil } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ScrollToTop from "../components/ScrollToTop";

const ProfileCustomer = () => {
  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const authToken = localStorage.getItem("token");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleNew, setIsVisibleNew] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);

  const {
    isOpen: profileModalOpen,
    onOpen: openProfileModal,
    onOpenChange: onProfileModalOpenChange,
    onClose: closeProfileModal,
  } = useDisclosure();
  const {
    isOpen: passwordModalOpen,
    onOpen: openPasswordModal,
    onOpenChange: onPasswordModalOpenChange,
    onClose: closePasswordModal,
  } = useDisclosure();

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/getProfile";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        const { data } = response.data;
        const { nama, email, no_identitas, no_telepon, alamat } =
          data.customers;
        setProfileData({
          name: nama,
          email,
          noIdentitas: no_identitas,
          noTelepon: no_telepon,
          alamat,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile data: ", error);
      });
  }, [authToken]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdateProfile = () => {
    const updatedData = {
      nama: profileData.name,
      email: profileData.email,
      no_identitas: profileData.noIdentitas,
      no_telepon: profileData.noTelepon,
      alamat: profileData.alamat,
      role: "P",
    };

    const apiURL = "http://localhost:8000/api/customer/updateProfile";
    axios
      .post(apiURL, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        setEditMode(false);
        onProfileModalOpenChange(true);
      })
      .catch((error) => {
        console.error("Error updating profile: ", error);
      });
  };

  const handleChangePassword = () => {
    const updatedData = {
      old_password: oldPassword,
      password: newPassword,
    };

    const apiURL = "http://localhost:8000/api/customer/changePassword";
    axios
      .post(apiURL, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Change Password successfully:", response.data);
        toast.success("Success Change Password", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onPasswordModalOpenChange(true);
      })
      .catch((error) => {
        console.error("Error change password: ", error);
      });
  };

  const { name, email, noIdentitas, noTelepon, alamat } = profileData;

  return (
    <section>
      <ScrollToTop/>
      <div className="relative h-[260px]">
        <img
          className="object-cover w-full h-full"
          src={assets.BGPROFILE}
          alt=""
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50"></div>
        <div className="container mx-auto flex flex-col items-center">
          <div className="rounded-full overflow-hidden w-[200px] h-[200px] -mt-[100px] relative">
            <Image
              src={assets.LOGOAJABG}
              alt="Profile"
              className="w-[200px] h-[200px] rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center mt-[100px]">
        <h1 className="text-2xl mt-4 font-semibold font-tertiary tracking-[2px] uppercase">
          {name}
        </h1>
        <p className="text-lg">{email}</p>
        <Button
          variant="bordered"
          className="font-semibold border-accent text-accent mt-4"
          onClick={openPasswordModal}
        >
          <BsPencilSquare /> Change Password
        </Button>
        <Card className="py-4 w-full h-full my-8">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-end text-right">
            {editMode ? (
              <Button
                variant="solid"
                className="font-semibold bg-accent text-white"
                onClick={openProfileModal}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="solid"
                className="font-semibold bg-accent text-white"
                onClick={handleEditClick}
              >
                <BiSolidPencil /> Edit
              </Button>
            )}
          </CardHeader>
          <CardBody className="overflow-visible py-2 flex flex-col">
            {editMode ? (
              <>
                <div className="mb-4">
                  <p className="font-semibold text-lg">Name</p>
                  {editMode ? (
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  ) : (
                    noIdentitas
                  )}
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-lg">Email</p>
                  {editMode ? (
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    noIdentitas
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            <div className="mb-4">
              <p className="font-semibold text-lg">Identity Number</p>
              {editMode ? (
                <Input
                  type="text"
                  value={noIdentitas}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      noIdentitas: e.target.value,
                    })
                  }
                />
              ) : (
                noIdentitas
              )}
            </div>
            <div className="mb-4">
              <p className="font-semibold text-lg">Phone Number</p>
              {editMode ? (
                <Input
                  type="text"
                  value={noTelepon}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      noTelepon: e.target.value,
                    })
                  }
                />
              ) : (
                noTelepon
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">Address</p>
              {editMode ? (
                <Input
                  type="text"
                  value={alamat}
                  onChange={(e) =>
                    setProfileData({ ...profileData, alamat: e.target.value })
                  }
                />
              ) : (
                alamat
              )}
            </div>
          </CardBody>
        </Card>

        {/* Modal Update Profile */}
        <Modal
          isOpen={profileModalOpen}
          onOpenChange={onProfileModalOpenChange}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Update Profile
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to update your profile? Any changes made
                will be saved.
              </p>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-tertiary h-[40px] rounded-md text-black"
                onClick={closeProfileModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary h-[40px] rounded-md "
                onClick={handleUpdateProfile}
              >
                Confirm
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Change Password */}
        <Modal
          isOpen={passwordModalOpen}
          onOpenChange={onPasswordModalOpenChange}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Change Password
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                <p className="font-semibold text-lg">Old Password</p>
                <Input
                  type={isVisible ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-2"
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
              <div className="mb-4">
                <p className="font-semibold text-lg">New Password</p>
                <Input
                  type={isVisibleNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityNew}
                    >
                      {isVisibleNew ? (
                        <AiFillEyeInvisible className="text-xl text-gray-700" />
                      ) : (
                        <AiFillEye className="text-xl text-gray-700" />
                      )}
                    </button>
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-tertiary h-[40px] rounded-md text-black"
                onClick={closePasswordModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary h-[40px] rounded-md"
                onClick={handleChangePassword}
              >
                Change
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
};

export default ProfileCustomer;
