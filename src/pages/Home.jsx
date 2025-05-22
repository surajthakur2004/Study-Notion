import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighLightText from "../components/core/HomePage/HighLightText";
import CTAbutton from "../components/core/HomePage/CTAbutton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguagueSection from "../components/core/HomePage/LearningLanguagueSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";

function Home() {
  return (
    <div>
      {/*Section1  */}
      <div
        className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
          text-white justify-between"
      >
        <Link to={"/signup"} className="mt-6">
          <div
            className=" group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
          transition-all duration-200 hover:scale-95 w-fit"
          >
            <div
              className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
              transition-all duration-200 group-hover:bg-richblack-900"
            >
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with <HighLightText text={" Coding Skills"} />
        </div>

        <div className=" mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAbutton active={true} linkto={"/signup"}>
            Learn More
          </CTAbutton>

          <CTAbutton active={false} linkto={"/login"}>
            Book a Demo
          </CTAbutton>
        </div>

        <div className="mx-3 my-12 shadow-blue-200">
          <video src={Banner} muted loop autoPlay></video>
        </div>

        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your <HighLightText text={" coding potential"} /> with
                our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
            codeColor={"text-yellow-25"}
          ></CodeBlocks>
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighLightText text={" coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead,give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson"
            }
            ctabtn1={{
              btnText: "Continue lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
            codeColor={"text-blue-300"}
          />
        </div>

        <ExploreMore />
      </div>

      {/* section -2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        {/* bg-image with buttons */}
        <div className="homepage_bg h-[310px] ">
          <div className=" w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto ">
            <div className="h-[150px]"></div>

            <div className="flex flex-row gap-7 text-white ">
              <CTAbutton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAbutton>

              <CTAbutton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAbutton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col justify-between gap-7 items-center">
          {/* skill you need && learn more btn section */}
          <div className="flex flex-row gap-5 mb-10 mt-[95px]">
            {/* skills you need section */}
            <div className="w-[45%] text-4xl font-semibold">
              Get the skill you need for a
              <HighLightText text={" job that is in demand"} />
            </div>

            {/* learn more btn section  */}
            <div className=" flex flex-col gap-10 w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is dedicated its own terms. Today,to be a
                competitive specialist requires more than professional skills
              </div>
              <div>
                <CTAbutton active={true} linkto={"/signup"}>
                  Learn More
                </CTAbutton>
              </div>
            </div>
          </div>

          <TimeLineSection />
          <LearningLanguagueSection />
        </div>
      </div>

      {/* section -3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <InstructorSection />

        <h2 className="text-center text-4xl font-semobold mt-10">
          Review from Other Learners
        </h2>
        {/* Review Slider here */}
        {/* <ReviewSlider /> */}
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default Home;
