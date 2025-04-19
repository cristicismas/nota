const setPageOverflow = (overflow) => {
  if (typeof document === "undefined") return;

  if (overflow) {
    document.body.classList.remove("overflow-hidden");
  } else {
    document.body.classList.add("overflow-hidden");
  }
};

export default setPageOverflow;
