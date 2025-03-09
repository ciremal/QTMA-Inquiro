export const filterInputLabelStyles = () => ({
  "&.MuiInputLabel-root": {
    transform: "translate(0.875rem, 0.5em) scale(1)",
  },
  "&.MuiInputLabel-shrink": {
    transform: "translate(0.875rem, -0.375rem) scale(0.75)",
  },
});

export const filterInputSelectStyles = (theme: string | undefined) => ({
  height: "2.5rem",
  // Styling the border
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "2rem",
    borderColor:
      theme === "dark" ? "var(--primaryGray)" : "var(--primaryLightGray)",
  },
  // Styling the border on hover
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme === "dark" ? "white" : "#1976D2",
  },
  // Styling the inside of the component
  "& .MuiSelect-select": {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    color: theme === "dark" ? "var(--primaryLightGray)" : "var(--primaryGray)",
  },
  // Styling the dropdown icon
  "& .MuiSelect-icon": {
    color: theme === "dark" ? "var(--primaryLightGray)" : "var(--primaryGray)",
  },
});
