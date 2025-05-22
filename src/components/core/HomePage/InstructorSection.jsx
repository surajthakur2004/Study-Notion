import React from "react";
import instructor from "../../../assets/Images/Instructor.png";
import HighLightText from "./HighLightText";
import CTAbutton from "./CTAbutton";
import { FaArrowRight } from "react-icons/fa";

function InstructorSection() {
  return (
    <div className=" flex flex-row gap-20 items-center mt-16">
      <div className="w-[50%]">
        <img
          src={instructor}
          alt="Instructor image"
          className=" shadow-white"
        />
      </div>

      <div className="flex flex-col gap-10 w-[50%]">
        <div className="text-4xl font-semibold ">
          Become an
          <br />
          <HighLightText text={" Instructor"} />
        </div>
        <p className="font-medium text-[16px] w-[80%] text-richblack-300">
          Instructors from around the world teach millions of students on
          StudyNotion. We provide the tools and skills to teach what you love.
        </p>

        <div className="w-fit">
          <CTAbutton active={true} linkto={"/signup"}>
            <div className="flex flex-row gap-2 items-center">
              Start Teaching Today <FaArrowRight />
            </div>
          </CTAbutton>
        </div>
      </div>
    </div>
  );
}

export default InstructorSection;
