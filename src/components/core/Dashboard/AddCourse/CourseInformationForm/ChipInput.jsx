import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

function ChipInput({ label, name, placeholder, errors, register, setValue }) {
  const [chips, setChips] = useState([]);
  const { editCourse, course } = useSelector((state) => state.course);

  useEffect(() => {
    if (editCourse) {
      // console.log(course)
      setChips(course?.tag);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, chips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      const chipValue = event.target.value.trim();
      if (chipValue && !chips.includes(chipValue)) {
        const newChip = [...chips, chipValue];
        setChips(newChip);
        event.target.value = "";
      }
    }
  };

  const handleDeleteChip = (chip) => {
    console.log("delte activate");
    // const newChips = chips.filter((_, index) => index !== chipIndex)
    const Updatedchips = chips.filter((s) => s !== chip);
    setChips(Updatedchips);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(chip)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          type="text"
          id={name}
          name={name}
          placeholder={placeholder}
          className="form-style w-full"
          onKeyDown={handleKeyDown}
        />
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

export default ChipInput;
