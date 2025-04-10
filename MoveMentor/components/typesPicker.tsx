import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View } from "react-native";
import PropTypes from "prop-types";

// This will be the workout type picker
interface WorkoutTypePickerProps {
  selectedWorkouts: string[]; // Explicitly type as an array of strings
  setSelectedWorkouts: React.Dispatch<React.SetStateAction<string[]>>; // Function to update selected workouts
  styles: { [key: string]: any }; // Define styles as an object
  isDarkMode?: boolean; // Optional boolean
  theme?: {
    darkText: string;
    darkInput: string;
    darkBorder: string;
    darkCard: string;
  }; // Optional theme object
}

const WorkoutTypePicker: React.FC<WorkoutTypePickerProps> = ({
  selectedWorkouts,
  setSelectedWorkouts,
  styles,
  isDarkMode = false,
  theme = {
    darkText: "#ffffff",
    darkInput: "rgba(0, 0, 0, 0.1)",
    darkBorder: "rgba(0, 0, 0, 0.3)",
    darkCard: "#333333",
  },
}) => {
  const [open, setOpen] = useState(false);

  // Workout type options
  const items = [
    { label: "Arms", value: "arms" },
    { label: "Chest", value: "chest" },
    { label: "Legs", value: "legs" },
    { label: "Glutes", value: "glutes" },
    { label: "Abs", value: "abs" },
    { label: "HIIT", value: "hiit" },
    { label: "Fat Burn", value: "fat_burn" },
    { label: "Endurance", value: "endurance" },
    { label: "Functional Training", value: "functional_training" },
    { label: "Stretching", value: "stretching" },
    { label: "Balance", value: "balance" },
    { label: "Yoga", value: "yoga" },
    { label: "Pilates", value: "pilates" },
    { label: "Back", value: "back" },
    { label: "Full Body", value: "full_body" },
  ];

  // Determine colors based on the theme
  const textColor = isDarkMode ? "#FFFFFF" : "#333";
  const backgroundColor = isDarkMode ? "rgba(51, 51, 51, 0.8)" : "#fff";
  const borderColor = isDarkMode ? "rgba(80, 80, 80, 0.8)" : "#ccc";
  const labelColor = isDarkMode ? "#FFFFFF" : "#000";
  const dropdownTextColor = isDarkMode ? "#FFFFFF" : "#000";
  const tickColor = isDarkMode ? "#fff" : "#000";
  const arrowColor = isDarkMode ? "#FFFFFF" : "black";
  const listItemBgColor = isDarkMode ? "rgba(51, 51, 51, 0.9)" : "#fff";
  const listItemSelectedBgColor = isDarkMode
    ? "rgba(80, 80, 80, 0.9)"
    : "rgba(0, 0, 0, 0.1)";

  return (
    <View style={{ zIndex: 1000, marginBottom: open ? 160 : 30 }}>
      <DropDownPicker
        multiple
        min={0}
        max={5}
        open={open}
        value={selectedWorkouts}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedWorkouts} // update array
        placeholder="Select workout types"
        listMode="MODAL"
        style={{
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        }}
        textStyle={{
          color: dropdownTextColor,
        }}
        dropDownContainerStyle={{
          borderColor: borderColor,
          backgroundColor: listItemBgColor,
        }}
        labelStyle={{
          color: labelColor,
        }}
        selectedItemContainerStyle={{
          backgroundColor: listItemSelectedBgColor,
        }}
        placeholderStyle={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
        }}
      />
    </View>
  );
};

WorkoutTypePicker.propTypes = {
  selectedWorkouts: PropTypes.array.isRequired,
  setSelectedWorkouts: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
};

export default WorkoutTypePicker;
