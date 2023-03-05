import React, { useState } from "react";
import { Button } from "react-bootstrap";
import RemainingAttemptsContext from "../contexts/RemainingAttemptsContext";

function ScoreTracker(props: any) {
  // @ts-ignore
  const [remainingAttempts, setRemainingAttempts] = useContext(
    RemainingAttemptsContext
  );

  return (
    <div>
      <p>Remaining Attemps: {props.remainingAttemmps}</p>
    </div>
  );
}

export default ScoreTracker;
