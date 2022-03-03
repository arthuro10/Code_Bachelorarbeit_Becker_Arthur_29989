import React, { useState, useEffect, useContext } from "react";
import { Button, Progress } from 'semantic-ui-react'


const ProgressFunc = ({ _percent }) => {
  const [percent,setPercent] = useState(_percent)


  return (
      <div>
        <Progress percent={percent} indicating />
      </div>
    )

}

export default ProgressFunc;
