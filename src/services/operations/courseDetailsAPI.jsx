import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";

import { courseEndpoints } from "../apis";

const { COURSE_CATEGORIES_API, EDIT_COURSE_API, CREATE_COURSE_API } =
  courseEndpoints;

export const fetchCourseCategories = async () => {
  let result = [];

  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);

    console.log("COURSE_CATEGORIES_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error("Could Not Fetch Course Categories");
    }

    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
