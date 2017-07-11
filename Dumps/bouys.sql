/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : rowcoaching

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-07-11 14:30:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bouys
-- ----------------------------
DROP TABLE IF EXISTS `bouys`;
CREATE TABLE `bouys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tracker_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `combination` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `prev` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of bouys
-- ----------------------------
INSERT INTO `bouys` VALUES ('1', '4', '2', '0', '1', '3', '1');
INSERT INTO `bouys` VALUES ('3', '6', '2', '0', '2', '1', '2');
