import React from "react";
import { FooterLink2 } from "../../data/footer-links";

import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

function Footer() {
  return (
    <div className="bg-richblack-800">
      <div className="flex flex-row gap-8 justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14 border-b mb-10">
        {/* section -  1 */}
        <div className="w-[50%] flex flex-row justify-between">
          <div className="flex flex-col">
            <div>
              <img src={Logo} alt="logo" />
            </div>
            <h1 className="text-richblack-50 font-semibold text-[16px]">
              Company
            </h1>

            <div className="flex flex-col">
              {["About", "Careers", "Affiliates"].map((ele, i) => {
                return (
                  <div
                    key={i}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.toLowerCase()}>{ele}</Link>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 text-lg">
              <FaFacebook />
              <FaGoogle />
              <FaTwitter />
              <FaYoutube />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-richblack-50 font-semibold text-[16px]">
              Resources
            </h1>

            {Resources.map((ele, i) => {
              return (
                <div
                  key={i}
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                </div>
              );
            })}

            <h1 className="text-richblack-50 font-semibold text-[16px]">
              Support
            </h1>

            <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
              <Link to="/help-center">Help Center</Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-richblack-50 font-semibold text-[16px]">
              Plans
            </h1>

            {Plans.map((ele, i) => {
              return (
                <div
                  key={i}
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                </div>
              );
            })}
            <h1 className="text-richblack-50 font-semibold text-[16px]">
              Community
            </h1>

            {Community.map((ele, i) => {
              return (
                <div
                  key={i}
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* section - 2 */}
        <div className="w-[50%] flex flex-row justify-evenly">
          {FooterLink2.map((element, index) => {
            return (
              <div key={index} className="flex flex-col">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  {element.title}
                </h1>
                {element.links.map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.link}>{ele.title}</Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            Made with ❤️ CodeHelp © 2023 Studynotion
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
