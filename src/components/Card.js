import React from 'react';
import cardStyle from "./Card.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircle } from "@fortawesome/free-solid-svg-icons";

function Card(props) {
  const { full_name, svn_url, description, stargazers_count, language, license } = props;
  return (
    <li key={full_name} className={cardStyle.card}>
      <a href={svn_url} className={cardStyle.cardLink} target="_blank" rel="noopener noreferrer">
        <div>
          <h2 className={cardStyle.cardTitle}>{full_name}</h2>
          <p className={cardStyle.cardDesc}>{description}</p>
        </div>
        <div>
          <div className={cardStyle.cardLabelContainer}>
          <span className={cardStyle.cardLabel}>
            <FontAwesomeIcon icon={faStar} className={`${cardStyle.cardIcon} ${cardStyle.iconStar}`} />
            <span>{stargazers_count}</span>
          </span>
            <span className={cardStyle.cardLabel}>
            <FontAwesomeIcon icon={faCircle} className={`${cardStyle.cardIcon} ${cardStyle.iconCircle}`} />
            <span>{language}</span>
          </span>
          </div>
          <div className={cardStyle.cardFooter}>
            <span className={cardStyle.cardFootNote}>{license? license.name: "No license specified"}</span>
          </div>
        </div>
      </a>
    </li>
  )
}

export default Card;
