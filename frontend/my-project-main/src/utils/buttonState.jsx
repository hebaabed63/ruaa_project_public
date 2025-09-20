// Function to return button state (disabled + color)
export function getButtonState(isDisabled) {
  return {
    disabled: isDisabled,
    className: isDisabled
      ? "bg-[#9ab6c9] cursor-not-allowed"
      : "bg-[#4682B4] hover:bg-[#002147]",
  };
}
