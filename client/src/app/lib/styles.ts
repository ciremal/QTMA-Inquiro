export const filterInputLabelStyles = () => ({
  "&.MuiInputLabel-root": {
    transform: "translate(0.875rem, 0.5em) scale(1)",
  },
  "&.MuiInputLabel-shrink": {
    transform: "translate(0.875rem, -0.375rem) scale(0.75)",
  },
});

export const filterInputSelectStyles = () => ({
  height: "2.5rem",
  // Styling the border
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "2rem",
    borderColor: "var(--primaryGray)",
  },
  // Styling the border on hover
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  // Styling the inside of the component
  "& .MuiSelect-select": {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    color: "var(--primaryLightGray)",
  },
  // Styling the dropdown icon
  "& .MuiSelect-icon": {
    color: "var(--primaryLightGray)",
  },
});
