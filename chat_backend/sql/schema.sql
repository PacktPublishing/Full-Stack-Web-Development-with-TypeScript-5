CREATE TABLE "user"
(
    id          SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name        VARCHAR(500)                           NOT NULL,
    email       VARCHAR(200)                           NOT NULL,
    password    VARCHAR(500)                           NOT NULL
);

CREATE UNIQUE INDEX "user_email_key"
    ON "user" (email);

CREATE TABLE "chat"
(
    id          SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ownerId"   INT                                    NOT NULL REFERENCES "user"
        ON UPDATE CASCADE ON DELETE CASCADE,
    name        VARCHAR(1000)                          NOT NULL
);

CREATE TABLE "message"
(
    id          SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "chatId"    INT                                    NOT NULL REFERENCES "chat"
        ON UPDATE CASCADE ON DELETE CASCADE,
    type        VARCHAR(100)                           NOT NULL,
    message     TEXT                                   NOT NULL
);
