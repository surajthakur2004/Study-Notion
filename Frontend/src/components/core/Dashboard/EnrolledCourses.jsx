import React, { useEffect, useState } from "react";
import { getUserEnrolledCourse } from "../../../services/operations/profileAPI";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";

function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);

  const [enrolledCourse, setEnrolledCourse] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    async () => {
      try {
        const res = await getUserEnrolledCourse(token);
        setEnrolledCourse(res);
      } catch (error) {
        console.log("Could not fetched enrolled course", error);
      }
    };
    setLoading(false);
  }, []);
  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Course</div>

      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourse.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {enrolledCourse.map((course, index) => (
            <div key={index} className="flex rounded-t-lg bg-richblack-800 ">
              <div>
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default EnrolledCourses;
