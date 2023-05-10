import React from "react";
import classes from "./ImageTypeDropdown.module.scss"


const ImageTypeDropdown = props => {
  return(
    <div className={classes.Dropdown}>
    <h1>Which type of crop is shown in the image?</h1>
    <label className={classes.Options}htmlFor="availableOptions">Please choose one of the available options: </label>
    <select id="availableOptions" name="availableOptions" 
            value={props.selected || ""} onChange={props.onChange}>
            <option value=""></option>
            {Object.entries(props.options).map(([key, option]) => (
              <option key={key} value={option.value}>{option.label}</option>
            ))}
    </select>
    </div>
  )
}
export default ImageTypeDropdown