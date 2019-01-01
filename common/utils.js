const padNumber = num => (num > 9 ? num.toString() : "0" + num);

const getDateString = date => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());

  return `${year}-${month}-${day}`;
};

const setNoDecimals = (number, noOfDecimals, roundMethod) => {
  return (
    roundMethod(number * Math.pow(10.0, noOfDecimals)) /
    Math.pow(10.0, noOfDecimals)
  );
};

export function getMonthName(index) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

export { padNumber, getDateString, setNoDecimals };
