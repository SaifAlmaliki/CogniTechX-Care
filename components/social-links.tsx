'use client';
import {faFacebook, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const SocialMediaLinks = () => {
  return (
    <div className="flex flex-row gap-4">
      <a href="https://www.facebook.com/profile.php?id=100064241105829" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebook} size="1x" />
      </a>
      <a href="https://www.instagram.com/cognitechx/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} size="1x" />
      </a>
      <a href="https://www.linkedin.com/company/106037567/admin/dashboard/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} size="1x" />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
