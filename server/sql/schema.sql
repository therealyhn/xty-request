CREATE TABLE IF NOT EXISTS requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  track_id VARCHAR(64) NOT NULL,
  track_title VARCHAR(255) NOT NULL,
  track_artist VARCHAR(255) NOT NULL,
  track_album VARCHAR(255) NOT NULL,
  track_cover VARCHAR(512) NOT NULL,
  track_preview VARCHAR(512) NOT NULL,
  track_link VARCHAR(512) NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  message VARCHAR(255) DEFAULT '',
  status ENUM('new', 'played', 'declined') NOT NULL DEFAULT 'new',
  request_ip VARCHAR(64) DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
