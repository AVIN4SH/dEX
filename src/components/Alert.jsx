import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { myEventsSelector } from "../store/selectors";
import addressConfig from "../../utils/addressConfig.json";

const Alert = () => {
  const account = useSelector((state) => state.provider.account);
  const isPending = useSelector(
    (state) => state.exchange.transaction.isPending
  );
  const isError = useSelector((state) => state.exchange.transaction.isError);
  const network = useSelector((state) => state.provider.network);

  const alertRef = useRef(null);

  const events = useSelector(myEventsSelector);

  useEffect(() => {
    if ((events[0] || isPending || isError) && account) {
      alertRef.current.className = "alert";
    }
  }, [events, isPending, isError, account]);

  const removeHandler = async () => {
    alertRef.current.className = "alert--remove";
  };

  return (
    <div>
      {isPending ? (
        <div
          ref={alertRef}
          onClick={removeHandler}
          className="alert alert--remove"
        >
          <h1
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            Transaction Pending...
            <small>x</small>
          </h1>
        </div>
      ) : isError ? (
        <div
          ref={alertRef}
          onClick={removeHandler}
          className="alert alert--remove"
        >
          <h1
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            Transaction Will Fail
            <small>x</small>
          </h1>
        </div>
      ) : !isPending && events[0] ? (
        // here we also check if 1st event exists as its the latest one and we will display its transaction hash
        <div
          ref={alertRef}
          onClick={removeHandler}
          className="alert alert--remove"
        >
          <h1
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            Transaction Successful
            <small>x</small>
          </h1>
          <a
            href={
              addressConfig[network]
                ? `${addressConfig[network].explorerURL}/tx/${events[0].transactionHash}` // for test network it redirects to this
                : "#" // for localhost network it redirects to this
            }
            target="_blank"
            rel="noreferrer"
          >
            Explore - Transaction Hash:{" "}
            {events[0].transactionHash.slice(0, 6) +
              "..." +
              events[0].transactionHash.slice(60, 66)}
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
