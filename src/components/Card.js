import React from 'react';
import appStyle from "../App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircle } from "@fortawesome/free-solid-svg-icons";

function Card(props) {
  const { full_name, svn_url, description, stargazers_count, language, license } = props;
  return (
    <li key={full_name} className={appStyle.card}>
      <a href={svn_url} className={appStyle.cardLink} target="_blank" rel="noopener noreferrer">
        <div>
          <h2 className={appStyle.cardTitle}>{full_name}</h2>
          <p className={appStyle.cardDesc}>{description}</p>
        </div>
        <div>
          <div className={appStyle.cardLabelContainer}>
          <span className={appStyle.cardLabel}>
            <FontAwesomeIcon icon={faStar} className={`${appStyle.cardIcon} ${appStyle.iconStar}`} />
            <span>{stargazers_count}</span>
          </span>
            <span className={appStyle.cardLabel}>
            <FontAwesomeIcon icon={faCircle} className={`${appStyle.cardIcon} ${appStyle.iconCircle}`} />
            <span>{language}</span>
          </span>
          </div>
          <div className={appStyle.cardFooter}>
            <span className={appStyle.cardFootNote}>{license? license.name: "No license specified"}</span>
          </div>
        </div>
      </a>
    </li>
  )
}

export default Card;
