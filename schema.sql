
DROP TABLE IF EXISTS TrcUser;
CREATE TABLE IF NOT EXISTS TrcUser
(
    userId TEXT PRIMARY KEY,
    tgId  TEXT,
    tgUsername  TEXT,
    refCode TEXT,
    refTgId TEXT,
    refTgUsername TEXT,
    totalRefPoint INTEGER,
    totalActionPoint INTEGER,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_user_tg_id ON TrcUser(tgId);
CREATE INDEX IF NOT EXISTS idx_trc_user_tg_username ON TrcUser(tgUsername);
CREATE INDEX IF NOT EXISTS idx_trc_user_ref_code ON TrcUser(refCode);
CREATE INDEX IF NOT EXISTS idx_trc_ref_by_tg_id ON TrcUser(refTgId);




DROP TABLE IF EXISTS TrcUserAddress;
CREATE TABLE IF NOT EXISTS TrcUserAddress
(
    addressId TEXT PRIMARY KEY,
    tgId TEXT,
    network TEXT,
    address TEXT,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_address_tg_id ON TrcUserAddress(tgId);
CREATE INDEX IF NOT EXISTS idx_trc_address_address ON TrcUserAddress(address);





DROP TABLE IF EXISTS TrcAction;
CREATE TABLE IF NOT EXISTS TrcAction
(
    actionId TEXT PRIMARY KEY,
    tgId TEXT,
    actionType TEXT,
    selfReward INTEGER,
    targetType TEXT,
    targetId TEXT,
    targetReward INTEGER,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_action_tg_id ON TrcAction(tgId);





DROP TABLE IF EXISTS TrcLog;
CREATE TABLE IF NOT EXISTS TrcLog
(
    logId TEXT PRIMARY KEY,
    tgId TEXT,
    opCode TEXT,
    logs TEXT,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_trc_log_tg_id ON TrcLog(tgId);






DROP TABLE IF EXISTS Customers;
CREATE TABLE IF NOT EXISTS Customers
(
    CustomerId INTEGER PRIMARY KEY,
    CompanyName TEXT,
    ContactName TEXT
);


INSERT INTO Customers (CustomerID, CompanyName, ContactName)
VALUES (1, 'Alfreds Futterkiste', 'Maria Anders1'),
       (4, 'Around the Horn', 'Thomas Hardy1'),
       (11, 'Bs Beverages', 'Victoria Ashworth1'),
       (13, 'Bs Beverages', 'Random Name1');
