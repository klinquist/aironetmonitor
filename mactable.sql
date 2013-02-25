SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `mactable`
-- ----------------------------
DROP TABLE IF EXISTS `mactable`;
CREATE TABLE `mactable` (
  `mac` varchar(14) NOT NULL,
  `lastseen` int(16) NOT NULL,
  `devicename` varchar(128) NOT NULL,
  `report` varchar(1) NOT NULL,
  PRIMARY KEY (`mac`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `mactable`
-- ----------------------------
BEGIN;
INSERT INTO `mactable` VALUES ('d023.dbab.0000', '2012-09-20 10:46:53', 'Your iPhone!', 'N');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
