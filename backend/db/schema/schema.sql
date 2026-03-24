CREATE TABLE athletes (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    grade   TINYINT NOT NULL,
    pr_time VARCHAR(10),
    events  VARCHAR(255)
);

CREATE TABLE meets (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    date     DATE NOT NULL,
    location VARCHAR(150)
);

CREATE TABLE results (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    meet_id    INT NOT NULL,
    time       VARCHAR(10),
    place      INT,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id)    REFERENCES meets(id)
);
