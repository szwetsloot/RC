/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : rowcoaching

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-06-29 09:39:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for clubs
-- ----------------------------
DROP TABLE IF EXISTS `clubs`;
CREATE TABLE `clubs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `federation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of clubs
-- ----------------------------

-- ----------------------------
-- Table structure for components
-- ----------------------------
DROP TABLE IF EXISTS `components`;
CREATE TABLE `components` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `footprint` varchar(255) DEFAULT NULL,
  `MPN` varchar(255) DEFAULT NULL,
  `SPN` varchar(255) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `available` int(10) DEFAULT NULL,
  `on_order` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of components
-- ----------------------------

-- ----------------------------
-- Table structure for crews
-- ----------------------------
DROP TABLE IF EXISTS `crews`;
CREATE TABLE `crews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `shortname` varchar(255) DEFAULT NULL,
  `combination` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of crews
-- ----------------------------

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `emailadres` varchar(255) DEFAULT NULL,
  `adres` varchar(255) DEFAULT NULL,
  `postalcode` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `kvk` varchar(255) DEFAULT NULL,
  `btw` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of customers
-- ----------------------------

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `version` int(255) DEFAULT NULL,
  `controller` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES ('1', '0', 'Row 1', null, '1', null, null, '2017-06-22 11:28:08');
INSERT INTO `projects` VALUES ('2', '0', 'Row 4', null, '1', null, null, '2017-06-22 11:28:16');
INSERT INTO `projects` VALUES ('3', '0', 'RTS (Regatta tracking system)', null, '1', null, null, '2017-06-22 11:28:41');
INSERT INTO `projects` VALUES ('4', '3', 'Sailling', null, '1', null, null, '2017-06-22 11:40:37');
INSERT INTO `projects` VALUES ('5', '4', 'Simulation', null, '1', 'simulations', 'simulate_sail_event_v1', '2017-06-22 11:40:49');

-- ----------------------------
-- Table structure for projects_components
-- ----------------------------
DROP TABLE IF EXISTS `projects_components`;
CREATE TABLE `projects_components` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  `required` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of projects_components
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'Sybren', '$2y$10$VyRLw2RIrT4Cl7LsHlM9Re9tJCvLjq4.hUugwZMhHkXSCNZ3RhSze');
INSERT INTO `users` VALUES ('2', 'Bram', null);
