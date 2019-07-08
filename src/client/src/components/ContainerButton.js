import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faStopCircle,
  faBan,
  faPlayCircle,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

export default ({ variant, onClick }) => {
  let icon;
  let color;
  if (variant === "open") {
    icon = faExternalLinkAlt;
    color = "green";
  } else if (variant === "start") {
    icon = faPlayCircle;
    color = "green";
  } else if (variant === "stop") {
    icon = faStopCircle;
    color = "red";
  } else if (variant === "kill") {
    icon = faBan;
    color = "red";
  } else if (variant === "remove") {
    icon = faTrashAlt;
    color = "red";
  }

  return (
    <span>
      <style>
        {`
                .icon:hover {
                    cursor: pointer;
                }
            `}
      </style>
      <OverlayTrigger
        key="top"
        placement="top"
        overlay={<Tooltip id={`tooltip-top`}>{variant}</Tooltip>}
      >
        <FontAwesomeIcon
          icon={icon}
          onClick={onClick}
          style={{ color }}
          size="lg"
          className="icon"
        />
      </OverlayTrigger>
    </span>
  );
};
