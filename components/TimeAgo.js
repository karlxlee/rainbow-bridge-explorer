import ReactTimeAgo from "react-time-ago";

const TimeAgo = ({ unixTimestamp }) => {
  // Multiply by 1000 to get timestamp in ms
  var date = new Date(parseInt(unixTimestamp * 1000));
  return <ReactTimeAgo date={date} />;
};

export default TimeAgo;
