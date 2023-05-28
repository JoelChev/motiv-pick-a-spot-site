import React from "react";

import logo from "../../assets/images/logo.png";

import classNames from "classnames";

const logoCell = "logoCell";

export default function LogoCell() {
  return (
    <div className={classNames(`${logoCell}`)}>
      <div className={classNames(`${logoCell}__image-container`)}>
        <img
          className={classNames(`${logoCell}__image`)}
          src={logo}
          alt="Motiv Fitness Inc."
        />
      </div>
    </div>
  );
}
