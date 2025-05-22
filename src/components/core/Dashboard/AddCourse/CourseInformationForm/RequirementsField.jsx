import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirements, setRequirements] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
  }, []);

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList]);

  const handleAddRequirement = () => {
    if (requirements.length > 0 && requirements[0] !== " ") {
      console.log("requirements[0]", requirements[0]);
      const updatedList = [...requirementsList, requirements];
      setRequirementsList(updatedList);
      setRequirements("");
    }
  };

  const clearHandler = (indx) => {
    const updatedList = requirementsList.splice((indx, 1));
    setRequirementsList(updatedList);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label}
        <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirements}
          className="form-style w-full"
          onChange={(e) => {
            setRequirements(e.target.value);
          }}
        />
        <button
          type="button"
          className="font-semibold text-yellow-50"
          onClick={handleAddRequirement}
        >
          Add
        </button>
      </div>
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((req, indx) => (
            <li key={indx}>
              <span>{req}</span>
              <button
                type="button"
                onClick={() => clearHandler(indx)}
                className="ml-2 text-xs text-pure-greys-300 "
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

export default RequirementsField;
