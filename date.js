exports.getDate = function() {
  const today = new Date();
  /*const options = {
    weekday: "numeric",
    day: "numeric",
    month: "numeric"
  }*/
  return today; //.toLocaleDateString("en-EU", options);
}
