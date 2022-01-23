import ReactTimeAgo from "react-time-ago";

const TimeAgo = ({ timestamp }) => {
  // Accepts UNIX timestamp, so need to multiply by 1000 to get timestamp in ms
  var date = new Date(parseInt(timestamp * 1000));
  return <ReactTimeAgo date={date} />;
};

export default TimeAgo;
