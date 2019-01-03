export function padNumber(num) {
  return (num > 9 ? num.toString() : "0" + num)
};

export function getDateString(date) {
  let year = date.getFullYear();
  let month = padNumber(date.getMonth() + 1);
  let day = padNumber(date.getDate());
  return `${year}-${month}-${day}`;
};

export function setNoDecimals(number, noOfDecimals, roundMethod) {
  return (
    roundMethod(number * Math.pow(10.0, noOfDecimals)) /
    Math.pow(10.0, noOfDecimals)
  );
};

export function getMonthName(index) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}