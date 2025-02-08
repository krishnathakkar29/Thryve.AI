import React, { useEffect, useState } from "react";
import defaultimg1 from "../assets/Vector.png";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/App";
import { useFileHandler } from "6pp";

function Profile() {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const queryClient = new QueryClient();

  const defaultImage = defaultimg1;
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [Details, setDetails] = useState({
    name: "Full Name Here",
    email: "Email id Here",
    role: "Intern",
    team: "Team --Force",
  });


  useEffect(() => {
    if (authUser) {
      console.log(authUser.user.name);
      setDetails({
        name: authUser.user.name || "",
        email: authUser.user.email || "",
        role: authUser.user.role || "Intern",
        team: authUser.user.team || "Team --Force",
      });
      setProfileImage(authUser.avatar || defaultImage);
    }
  }, [authUser]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (formData) => {
      console.log(formData);
      const response = await api.put("/api/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the authUser query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        formData.append("profileImage", reader.result);
      };
      reader.readAsDataURL(file)

      // const imageUrl = URL.createObjectURL(file);
      // setProfileImage(imageUrl);
      // console.log(imageUrl);

      // Prepare FormData with current authUser data
      const formData = new FormData();
      formData.append("name", Details.name); // Use current form data (or authUser.user.name if you want original data)
      formData.append("email", Details.email); // Use current form data (or authUser.user.email)
      formData.append("profileImage", profileImage);

      console.log(formData);

      // Trigger the mutation
      updateProfile(formData);
    }
  };

  const toggleEditField = (field) => {
    if (field === "name") {
      setIsEditingName((prev) => !prev);
    } else if (field === "email") {
      setIsEditingEmail((prev) => !prev);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // const handleSave = () => {
  //   console.log("Updated Details:", Details);
  // setIsEditingName(false);
  // setIsEditingEmail(false);
  // };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", Details.name);
    formData.append("email", Details.email);

    const profileImageInput = document.getElementById("profileImage");
    if (profileImageInput.files[0]) {
      formData.append("profileImage", profileImageInput.files[0]);
    }

    updateProfile(formData);

    setIsEditingEmail(false);
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FEFBF6] mt-0 py-6">
      <h2 className="text-lg font-semibold text-center mb-6 text-[#000000]">
        Edit Profile
      </h2>

      <div className="relative mb-6">
        <div className="h-28 w-28 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
          <img
            src={profileImage}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <label
          htmlFor="profileImage"
          className="absolute bottom-0 right-2 bg-[#0D578C] p-2 rounded-full cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 2.487a2.25 2.25 0 013.182 0l1.469 1.47a2.25 2.25 0 010 3.182l-8.25 8.25a4.5 4.5 0 01-1.897 1.133l-3.337.995a.75.75 0 01-.92-.92l.995-3.337a4.5 4.5 0 011.133-1.897l8.25-8.25z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 7.5L16.5 4.5"
            />
          </svg>
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="w-full max-w-2xl px-6 py-4 bg-[#FEFBF6]">
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="w-full">
              <p className="text-sm font-semibold">Name</p>
              {isEditingName ? (
                <input
                  type="text"
                  name="name"
                  value={Details.name}
                  onChange={handleInputChange}
                  className="text-sm w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#0D578C] text-[#0D578C]"
                />
              ) : (
                <p className="text-sm">{Details.name}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (isEditingName) {
                  handleSave();
                } else {
                  toggleEditField("name");
                }
              }}
              className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-[#0D578C] hover:bg-[#0B4670] rounded-full"
            >
              {isEditingName ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM12 8v8M8 12h8"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 2.487a2.25 2.25 0 013.182 0l1.469 1.47a2.25 2.25 0 010 3.182l-8.25 8.25a4.5 4.5 0 01-1.897 1.133l-3.337.995a.75.75 0 01-.92-.92l.995-3.337a4.5 4.5 0 011.133-1.897l8.25-8.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 7.5L16.5 4.5"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="w-full">
              <p className="text-sm font-semibold">Email</p>
              {isEditingEmail ? (
                <input
                  type="email"
                  name="email"
                  value={Details.email}
                  onChange={handleInputChange}
                  className="text-sm w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#0D578C] text-[#0D578C]"
                />
              ) : (
                <p className="text-sm">{Details.email}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (isEditingEmail) {
                  handleSave();
                } else {
                  toggleEditField("email");
                }
              }}
              className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-[#0D578C] hover:bg-[#0B4670] rounded-full"
            >
              {isEditingEmail ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM12 8v8M8 12h8"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 2.487a2.25 2.25 0 013.182 0l1.469 1.47a2.25 2.25 0 010 3.182l-8.25 8.25a4.5 4.5 0 01-1.897 1.133l-3.337.995a.75.75 0 01-.92-.92l.995-3.337a4.5 4.5 0 011.133-1.897l8.25-8.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 7.5L16.5 4.5"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold">Role</p>
            <p className="text-sm">{Details.role}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold">Team</p>
            <p className="text-sm">{Details.team}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
