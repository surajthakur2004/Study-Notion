import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighLightText from "./HighLightText";
import CourseCard from "./CourseCard";

function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(HomePageExplore[0].tag);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  let result;
  const setMyCards = (value) => {
    setCurrentTab(value);
    result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="text-4xl font-semibold text-center my-10">
        Unlock the
        <HighLightText text={" Power of Code"} />
        <p className=" text-richblack-300 text-lg font-semibold mt-1">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* tabs section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {HomePageExplore.map((ele, index) => {
          return (
            <div
              className={`px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 text-[16px] flex flex-row items-center gap-2
              ${
                currentTab === ele.tag
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              }`}
              key={index}
              onClick={() => setMyCards(ele.tag)}
            >
              {ele.tag}
            </div>
          );
        })}
      </div>

      <div className="h-[250px]"></div>
      {/* card section  */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[40%] lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMore;
