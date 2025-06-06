import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn";
import { updateProfile } from "../../../../services/operations/settingAPI";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    console.log("data :- ", data);
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="lable-style">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={user?.firstName}
                id="firstName"
                placeholder="Enter Fisrt Name"
                className="form-style"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="lable-style">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={user?.lastName}
                placeholder="Enter Last Name"
                className="form-style"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="lable-style">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-style"
                id="dateOfBirth"
                placeholder="Select your date of birth"
                defaultValue={user?.additonalDetails?.dateOfBirth}
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please Enter your Date Of Birth",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
              />
              {errors.dateOfBirth && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.dateofbirth.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="lable-style">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="form-style"
                defaultValue={user?.additonalDetails?.gender}
                {...register("gender", { required: true })}
              >
                {genders.map((gender, index) => (
                  <option value={gender} key={index}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Date of Birth.
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="contactNumber" className="lable-style">
                Contact Number
              </label>
              <input
                type="number"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter your Phone Number"
                className="form-style"
                defaultValue={user?.additonalDetails?.contactNumber}
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Enter Your Contact Number",
                  },
                  maxLength: {
                    value: 12,
                    message: "Invalid Contact Number > 12",
                  },
                  minLength: {
                    value: 10,
                    message: "Invalid Contact Number < 10",
                  },
                })}
              />
              {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="lable-style">
                About
              </label>

              <input
                type="text"
                placeholder="Enter Bio details"
                name="about"
                id="about"
                className="form-style"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save"></IconBtn>
        </div>
      </form>
    </>
  );
}

export default EditProfile;
