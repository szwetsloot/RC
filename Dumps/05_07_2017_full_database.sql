/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : rowcoaching

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-07-05 12:35:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attributes
-- ----------------------------
DROP TABLE IF EXISTS `attributes`;
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of attributes
-- ----------------------------
INSERT INTO `attributes` VALUES ('1', 'RESISTOR.0603', '1k', '1');
INSERT INTO `attributes` VALUES ('2', 'CAPACITOR.0603', '1uF', '2');
INSERT INTO `attributes` VALUES ('3', 'RESISTOR.0603', '2k', '3');
INSERT INTO `attributes` VALUES ('4', 'RESISTOR.0603', '100k', '8');
INSERT INTO `attributes` VALUES ('5', 'RESISTOR.0603', '10k', '6');
INSERT INTO `attributes` VALUES ('6', 'RESISTOR.0603', '22', '7');
INSERT INTO `attributes` VALUES ('7', 'RESISTOR.0603', '5.6k', '5');
INSERT INTO `attributes` VALUES ('8', 'RESISTOR.0603', '536', '9');
INSERT INTO `attributes` VALUES ('9', 'CAPACITOR.0603', '4.7uF', '4');
INSERT INTO `attributes` VALUES ('10', 'CAPACITOR.1206', '220uF', '14');
INSERT INTO `attributes` VALUES ('11', 'CAPACITOR.0603', '100nF', '13');
INSERT INTO `attributes` VALUES ('12', 'CAPACITOR.0603', '10pF', '10');
INSERT INTO `attributes` VALUES ('13', 'CAPACITOR.0603', '10uF', '11');
INSERT INTO `attributes` VALUES ('14', 'CAPACITOR.0603', '33pF', '12');
INSERT INTO `attributes` VALUES ('15', '78646-3001', '78646-3001', '15');
INSERT INTO `attributes` VALUES ('16', 'ATMEGA328PB', 'ATMEGA328P-AU-TQFP32', '16');
INSERT INTO `attributes` VALUES ('17', 'BQ24090DGQR', 'BQ24090DGQR', '17');
INSERT INTO `attributes` VALUES ('18', 'CSTCE8M00G55-R0', 'CSTCE8M00G55-R0', '18');
INSERT INTO `attributes` VALUES ('19', 'FXOS8700CQR1', 'FXOS8700CQR1', '19');
INSERT INTO `attributes` VALUES ('20', 'MC60', 'MC60', '20');
INSERT INTO `attributes` VALUES ('21', 'MIC5504-3.3YM5-TR', 'MIC5504-3.3YM5-TR', '21');
INSERT INTO `attributes` VALUES ('22', 'MMBT3904LT1G', 'MMBT3904LT1G', '22');
INSERT INTO `attributes` VALUES ('23', 'PJ-015AH-SMT-TR', 'PJ-015AH-SMT-TR', '23');
INSERT INTO `attributes` VALUES ('24', 'LED.0603', 'RED', '25');
INSERT INTO `attributes` VALUES ('25', 'RGB0805', 'RGB0805', '26');
INSERT INTO `attributes` VALUES ('26', 'ANTENNA-CONN-U-FL(3P)', 'U-FL', '27');
INSERT INTO `attributes` VALUES ('27', 'PTS645', 'PTS645', '24');

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of components
-- ----------------------------
INSERT INTO `components` VALUES ('1', 'Resistor', '1k', '0603', 'ERJ-3GEYJ102V', ' 667-ERJ-3GEYJ102V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=ERJ-3GEYJ102Vvirtualkey66720000virtualkey667-ERJ-3GEYJ102V', '80', '100');
INSERT INTO `components` VALUES ('2', 'Capacitor', '1uF', '0603', ' GRM188R61A105KA61J', '81-GRM18R61A105KA61J', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM188R61A105KA61Jvirtualkey64800000virtualkey81-GRM18R61A105KA61J', '80', '0');
INSERT INTO `components` VALUES ('3', 'Resistor', '2k', '0603', ' ERJ-3GEYJ202V', ' 667-ERJ-3GEYJ202V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=ERJ-3GEYJ202Vvirtualkey66720000virtualkey667-ERJ-3GEYJ202V', '50', '0');
INSERT INTO `components` VALUES ('4', 'Capacitor', '4.7uF', '0603', 'ERJ-3GEYJ562V', '81-GRM188R60J475ME9J', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM188R60J475ME19Jvirtualkey64800000virtualkey81-GRM188R60J475ME9J', '50', '0');
INSERT INTO `components` VALUES ('5', 'Resistor', '5.6k', '603', 'ERJ-3GEYJ562V', '667-ERJ-3GEYJ562V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/ProductDetail/Panasonic/ERJ-3GEYJ562V/?qs=4WZYzuGhm5rI0p6w9vyUmw%3d%3d', '0', '1000');
INSERT INTO `components` VALUES ('6', 'Resistor', '10k', '603', 'ERJ-3EKF1002V\r\n', '667-ERJ-3EKF1002V\r\n', 'Mouser', 'Panasonic', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=ERJ-3EKF1002Vvirtualkey66720000virtualkey667-ERJ-3EKF1002V\r\n', '900', '0');
INSERT INTO `components` VALUES ('7', 'Resistor', '22', '603', 'ERJ-3GEYJ220V', '667-ERJ-3GEYJ220V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/ProductDetail/Panasonic/ERJ-3GEYJ220V/?qs=4WZYzuGhm5prSoYXnOTRkg%3d%3d', '0', '1000');
INSERT INTO `components` VALUES ('8', 'Resistor', '100k', '603', '\r\nERJ-3GEYJ104V', '667-ERJ-3GEYJ104V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/ProductDetail/Panasonic/ERJ-3GEYJ104V/?qs=66DK8nO8gJC7IhSuep78kw%3d%3d', '900', '0');
INSERT INTO `components` VALUES ('9', 'Resistor', '536', '603', 'ERJ-3EKF5360V', '667-ERJ-3EKF5360V', 'Mouser', 'Panasonic', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=ERJ-3EKF5360Vvirtualkey66720000virtualkey667-ERJ-3EKF5360V', '80', '100');
INSERT INTO `components` VALUES ('10', 'Capacitor', '10pF', '603', 'GRM1885C1H100JA01D', '81-GRM39C100D50', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM1885C1H100JA01Dvirtualkey64800000virtualkey81-GRM39C100D50', '60', '0');
INSERT INTO `components` VALUES ('11', 'Capacitor', '10uF', '603', '\r\nGRM188R60J106ME47D', '81-GRM188R60J106ME47', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM188R60J106ME47Dvirtualkey64800000virtualkey81-GRM188R60J106ME47', '80', '0');
INSERT INTO `components` VALUES ('12', 'Capacitor', '33pF', '603', 'GRM1885C1H330JA01D', '81-GRM39C330J50', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM1885C1H330JA01Dvirtualkey64800000virtualkey81-GRM39C330J50', '40', '465');
INSERT INTO `components` VALUES ('13', 'Capacitor', '100nF', '603', '\r\nGRM188R71C104KA01D', '81-GRM39X104K16', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=GRM188R71C104KA01Dvirtualkey64800000virtualkey81-GRM39X104K16', '400', '0');
INSERT INTO `components` VALUES ('14', 'Capacitor', '220uF', '1206', 'T490B227M006ATE300', '2688582', 'Farnell', 'KEMET', 'http://nl.farnell.com/kemet/t490b227m006ate300/cap-tantalum-220uf-6-3v-case-b/dp/2688582', '4', '20');
INSERT INTO `components` VALUES ('15', 'Connector', 'Micro sim card connector', '', '78646-3001', '538-78646-3001', 'Mouser', 'Molex', 'http://nl.mouser.com/ProductDetail/Molex/78646-3001/?qs=sGAEpiMZZMuJakaoiLiBpqcns0oUpG4X18A9PdUcy%252bQ%3d', '2', '20');
INSERT INTO `components` VALUES ('16', 'IC', ' ATMEGA328PB-AU', 'TQFP-32', ' ATMEGA328PB-AU', '556-ATMEGA328PB-AU', 'Mouser', 'Microchip Technology / Atmel', 'http://nl.mouser.com/ProductDetail/Microchip-Technology-Atmel/ATMEGA328PB-AU/?qs=sGAEpiMZZMvqv2n3s2xjsWT%2fOfaiuxUeMU%2feDJZBHWboTUGl9aysTg%3d%3d', '0', '25');
INSERT INTO `components` VALUES ('17', 'IC', 'Battery management 1A', 'HVSSOP-10', 'BQ24090DGQR', '595-BQ24090DGQR', 'Mouser', 'Texas instruments', 'http://nl.mouser.com/ProductDetail/Texas-Instruments/BQ24090DGQT/?qs=sGAEpiMZZMsfD%252bbMpEGFJeQPBA0atS9Yo7f3CLOYkrk%3d', '8', '10');
INSERT INTO `components` VALUES ('18', 'Resonator', '8MHz', '', 'CSTCE8M00G55-R0', '81-CSTCE8M00G55-R0', 'Mouser', 'Murata Electronics', 'http://nl.mouser.com/ProductDetail/Murata/CSTCE8M00G55-R0/?qs=%2fha2pyFadugMR2%2fN3NvY%2fcyJlgwZ9hyXdq2UbA2N7t9grZdFHB6DSw%3d%3d', '0', '25');
INSERT INTO `components` VALUES ('19', 'Sensor', '6 DOF - FXOS8700CQR1', 'QFN-16', 'FXOS8700CQR1', '841-FXOS8700CQR1', 'Mouser', 'NXP / Freescale', 'http://nl.mouser.com/ProductDetail/NXP/FXOS8700CQR1/?qs=%2fha2pyFadugqegMY3o6c2IGDqzIBlLu1lf1%2foHnM3B1hRQQ0%252bi2%252b%2fw%3d%3d', '0', '25');
INSERT INTO `components` VALUES ('20', 'IC', 'GPRS Unit', '', 'MC60', 'MC60', 'Top-electronics', 'Quectel Wireless Solutions', 'http://shop.top-electronics.eu/quad-band-gsmgprs-gnss-smt-module-p-17604.html', '0', '0');
INSERT INTO `components` VALUES ('21', 'IC', 'LDO 3.3v regulator', 'SOT 23-5', ' MIC5504-3.3YM5-TR', '998- MIC5504-3.3YM5-TR', 'Mouser', 'Microchip Technology / Micrel', 'http://nl.mouser.com/ProductDetail/Microchip/MIC5504-33YM5-TR/?qs=%2fha2pyFaduiQSwwJX7b6pPG5HoOt4HuL%2fi3xzYFEJnvNhOYJx3yuOz%2fwm%2f7g6yjh', '0', '25');
INSERT INTO `components` VALUES ('22', 'Transistor', 'NPN transistor', 'SOT-23-3', 'MMBT3904LT1G', '863- MMBT3904LT1G', 'ON Semiconductor', 'Mouser', 'http://nl.mouser.com/ProductDetail/ON-Semiconductor/MMBT3904LT1G/?qs=sGAEpiMZZMshyDBzk1%2fWi%2fPUgtclNldlheHc%252bMVjFj0%3d', '0', '100');
INSERT INTO `components` VALUES ('23', 'Connector', 'DC input', 'DC Input', 'PJ-015AH-SMT-TR', '490- PJ-015AH-SMT-TR', 'Mouser', 'CUI', 'http://nl.mouser.com/ProductDetail/CUI-Inc/PJ-015AH-SMT-TR/?qs=%2fha2pyFadujTqjR4hj3mCrtp9N5KLxwI2w8t8sh9A11KhrW9G6rdTA%3d%3d', '3', '25');
INSERT INTO `components` VALUES ('24', 'Connector', '13mm button', 'PTS645', ' PTS645SM13SMTR92 LFS', '611- PTS645SM13SMTR92', 'Mouser', 'C&K Components', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=PTS645SM13SMTR92_LFSvirtualkey61110000virtualkey611-PTS645SM13SMTR92', '1', '20');
INSERT INTO `components` VALUES ('25', 'LED', 'Red led', '0603', 'AP1608SRCPRV', '604-AP1608SRCPRV', 'Mouser', 'Kingbright', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=AP1608SRCPRVvirtualkey60400000virtualkey604-AP1608SRCPRV', '0', '100');
INSERT INTO `components` VALUES ('26', 'LED', 'RGB led', '0805', 'LTST-C19FD1WT', '859-LTST-C19FD1WT', 'Mouser', 'Lite-On', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=LTST-C19FD1WTvirtualkey57820000virtualkey859-LTST-C19FD1WT', '0', '100');
INSERT INTO `components` VALUES ('27', 'Connector', 'U.Fl', 'U.Fl', ' U.FL-R-SMT(10)', '798- U.FL-R-SMT1-', 'Mouser', 'Hirose Connector', 'http://nl.mouser.com/Search/ProductDetail.aspx?R=U.FL-R-SMT(10)virtualkey64550000virtualkey798-U.FL-R-SMT10', '0', '20');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES ('1', '0', 'Row 1', null, '1', null, null, '2017-06-22 11:28:08');
INSERT INTO `projects` VALUES ('2', '0', 'Row 4', null, '1', null, null, '2017-06-22 11:28:16');
INSERT INTO `projects` VALUES ('3', '0', 'RTS (Regatta tracking system)', null, '1', null, null, '2017-06-22 11:28:41');
INSERT INTO `projects` VALUES ('4', '3', 'Sailling', null, '1', null, null, '2017-06-22 11:40:37');
INSERT INTO `projects` VALUES ('5', '4', 'Simulation', null, '1', 'simulations', 'simulate_sail_event_v1', '2017-06-22 11:40:49');
INSERT INTO `projects` VALUES ('6', '4', 'ZeilwedstrijdvdToekomst', null, '1', 'ZVDTMain', 'index', '2017-07-03 07:49:59');
INSERT INTO `projects` VALUES ('7', '3', 'GPRS Unit', null, '4', '', '', '2017-07-05 08:31:57');

-- ----------------------------
-- Table structure for projects_components
-- ----------------------------
DROP TABLE IF EXISTS `projects_components`;
CREATE TABLE `projects_components` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  `required` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of projects_components
-- ----------------------------
INSERT INTO `projects_components` VALUES ('10', '7', '1', '4');
INSERT INTO `projects_components` VALUES ('11', '7', '2', '1');
INSERT INTO `projects_components` VALUES ('12', '7', '3', '2');
INSERT INTO `projects_components` VALUES ('13', '7', '4', '3');
INSERT INTO `projects_components` VALUES ('14', '7', '5', '4');
INSERT INTO `projects_components` VALUES ('15', '7', '6', '8');
INSERT INTO `projects_components` VALUES ('16', '7', '7', '3');
INSERT INTO `projects_components` VALUES ('17', '7', '8', '5');
INSERT INTO `projects_components` VALUES ('18', '7', '9', '1');
INSERT INTO `projects_components` VALUES ('19', '7', '10', '1');
INSERT INTO `projects_components` VALUES ('20', '7', '11', '1');
INSERT INTO `projects_components` VALUES ('21', '7', '12', '5');
INSERT INTO `projects_components` VALUES ('22', '7', '13', '10');
INSERT INTO `projects_components` VALUES ('23', '7', '14', '1');
INSERT INTO `projects_components` VALUES ('24', '7', '15', '1');
INSERT INTO `projects_components` VALUES ('25', '7', '16', '1');
INSERT INTO `projects_components` VALUES ('26', '7', '17', '1');
INSERT INTO `projects_components` VALUES ('27', '7', '18', '1');
INSERT INTO `projects_components` VALUES ('28', '7', '19', '1');
INSERT INTO `projects_components` VALUES ('29', '7', '20', '1');
INSERT INTO `projects_components` VALUES ('30', '7', '21', '1');
INSERT INTO `projects_components` VALUES ('31', '7', '22', '1');
INSERT INTO `projects_components` VALUES ('32', '7', '23', '1');
INSERT INTO `projects_components` VALUES ('33', '7', '25', '1');
INSERT INTO `projects_components` VALUES ('34', '7', '26', '1');
INSERT INTO `projects_components` VALUES ('35', '7', '27', '2');
INSERT INTO `projects_components` VALUES ('36', '7', '24', '1');

-- ----------------------------
-- Table structure for saillingathletes
-- ----------------------------
DROP TABLE IF EXISTS `saillingathletes`;
CREATE TABLE `saillingathletes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crew_id` int(11) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `gender` enum('f','m') DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of saillingathletes
-- ----------------------------
INSERT INTO `saillingathletes` VALUES ('1', '1', 'Fettje', 'Osinga', '', '32', null, 'FettjeOsinga-WVBraassemermeer.jpg');
INSERT INTO `saillingathletes` VALUES ('2', '1', 'Marleen ', 'Stavenuiter', '', '32', null, 'marleen-1.jpg');
INSERT INTO `saillingathletes` VALUES ('3', '1', 'Merel', 'bij de Leij', '', '27', null, 'foto_merel-1.jpg');
INSERT INTO `saillingathletes` VALUES ('4', '1', 'Tamar ', 'Meibergen', '', '22', null, 'tamar-1.jpg');
INSERT INTO `saillingathletes` VALUES ('5', '1', 'Milah', 'Wouters', '', '43', null, 'milah.jpg');
INSERT INTO `saillingathletes` VALUES ('6', '1', 'Mirthe', 'Kramer', '', '43', null, 'foto-mirthe.jpg');
INSERT INTO `saillingathletes` VALUES ('7', '1', 'Nathalia ', 'Nyeland', '', '44', null, 'nathalia.jpg');
INSERT INTO `saillingathletes` VALUES ('8', '1', 'Nova', 'Huppes', '', '26', null, 'NovaHuppes-WVAlmereCentraal.jpg');
INSERT INTO `saillingathletes` VALUES ('9', '1', 'Rikst', 'Dijkstra', '', '28', null, 'RikstDijkstra-WVAlmereCentraal.jpg');
INSERT INTO `saillingathletes` VALUES ('10', '1', 'Rixt', 'van der Ende', '', '25', null, 'foto_rixt.jpeg');
INSERT INTO `saillingathletes` VALUES ('11', '1', 'Rozan', 'Gilles', '', '34', null, 'rozan.jpg');
INSERT INTO `saillingathletes` VALUES ('12', '1', 'Sanne', 'Crum', '', '25', null, 'sannec.jpg');
INSERT INTO `saillingathletes` VALUES ('13', '1', 'Sanne', 'Crum', '', '25', null, 'sannec(1).jpg');
INSERT INTO `saillingathletes` VALUES ('14', '1', 'Sanne ', 'Akkerman', '', '21', null, 'Sannea.jpg');

-- ----------------------------
-- Table structure for saillingcrews
-- ----------------------------
DROP TABLE IF EXISTS `saillingcrews`;
CREATE TABLE `saillingcrews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `shortname` varchar(255) DEFAULT NULL,
  `club` int(11) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of saillingcrews
-- ----------------------------
INSERT INTO `saillingcrews` VALUES ('1', 'International Yacht Club Amsterdam', 'IYCA', null, 'De International Yacht Club Amsterdam is opgericht door een aantal fanatiek (zee-)zeilende zakenmensen uit Amsterdam en omstreken. De International Yacht Club Amsterdam is gevestigd in het 5-sterren Grand Hotel Amrâth aan de Prins Hendrikkade, in het centrum van Amsterdam. Dit statige pand stond vroeger bekend als het “Scheepvaarthuys” en is, gelegen aan de oevers van het IJ, dé ideale plek voor een gezellige, maritieme sociëteit.');
INSERT INTO `saillingcrews` VALUES ('2', 'Jachtclub Scheveningen', 'JS', null, 'Jachtclub Scheveningen is opgericht in 1973 en is daarmee de eerste Jachtclub die direct aan de Noordzee ligt. De jachtclub heeft ongeveer 600 leden, meest jachtzeilers. Het is dan ook niet verwonderlijk dat de meeste successen door leden behaald zijn op zee, zoals in de Fastnetrace (meerdere winnaars) de Arc, de Admirals Cup, de AZAB (Azoren and back) de Global Oceanrace de Whitbreadrace en natuurlijk de RORC North Sea Race.');
INSERT INTO `saillingcrews` VALUES ('3', 'KNZ&RV Muiden', 'KNZ&RV', null, 'De Koninklijke Nederlandsche Zeil- & Roeivereeniging is opgericht in 1847 en is de oudste watersportvereniging in Nederland. In haar geschiedenis heeft de KNZ&RV veelvuldig aan de wieg gestaan van belangrijke ontwikkelingen en initiatieven in de watersport. Het organiseren van wedstrijden is een belangrijke missie voor de vereniging. Daarnaast ondersteunt de Koninklijke waar mogelijk het gehandicapten-zeilen.');
INSERT INTO `saillingcrews` VALUES ('4', 'KWS Sneek', 'KWS', null, 'De Koninklijke Watersportvereniging Sneek is voor de meeste mensen vooral bekend als organisator van de Sneekweek. Nog steeds het grootste ‘in shore’ internationale zeilevenement van Europa. Maar de KWS organiseert nog meer zeilevenementen, van clubwedstrijden tot NK’s, EK’s en WK’s. Veel bekende zeilers zijn lid van de KWS, te denken valt aan Pieter-Jan Postma, Dirk de Ridder, Brechtje van der Werf, Thijs Kort, Erik Kort, Tom Otte en vele anderen.');
INSERT INTO `saillingcrews` VALUES ('5', 'KWV De Kaag', 'KWV', null, 'De vereniging is in 1910 opgericht met als doel het organiseren van zeil en roei wedstrijden. Bij de oprichting had de vereniging 59 leden. Inmiddels is het ledental gegroeid naar ongeveer 1600 leden. Wedstrijdzeilen is nog steeds een belangrijk onderdeel, maar ook motorbootvaarders en sloeproeiers maken tegenwoordig een belangrijk deel uit van de vereniging. De vereniging heeft op dit moment 3 jachthavens (met in totaal ongeveer 600 ligplaatsen). De trots is de Kaagsocieteit. Dit verenigingsgebouw staat vlak langs de plassen en is de uitvalbasis voor de landelijk bekende Kaagweek.');
INSERT INTO `saillingcrews` VALUES ('6', 'R.R. & Z.V. Maas en Roer', 'R.R. & Z.V. Maas en Roer', null, 'De Roermondse Roei- en Zeilvereniging Maas en Roer is opgericht in 1909 en kent 592 leden. De vereniging is actief in het wedstrijdzeilen en heeft vele successen behaald. Prestaties van diverse leden zijn o.a. 2 wereldkampioenen, 7 Nederlandse kampioenen en een Duits/Belgisch/Zwitsers kampioen. De kampioenschappen zijn o.a. gevaren in de H-Boot, Randmeer, Yngling, Europe, Optimist, Melges24 en ORC1.');
INSERT INTO `saillingcrews` VALUES ('7', 'WV Uitdam', 'WV Uitdam', null, 'WV Uitdam is nog steeds een vereniging die de wedstrijdorganisatie ter harte gaat. Niet meer, zoals voorheen, daadwerkelijk Wereldkampioenschappen en klasse-wedstrijden organiseren, maar assisteren bij andere evenementen. Het verstrekken van adviezen en indien noodzakelijk daadwerkelijke hulp. WV Uitdam is een vereniging die begrijpt dat een wedstrijdzeiler in veel gevallen geen binding heeft met zijn eigen club. Hij/zij is tenslotte meestal elders aan het wedstrijdzeilen. Voor dergelijke zeilers is er ook een plek bij Uitdam.');
INSERT INTO `saillingcrews` VALUES ('8', 'VWDTP', 'VWDTP', null, 'Vereniging Watersport De Twee Provincien (VWDTP), is een actieve vereniging in noorden van het land. Het Paterswoldsemeer is het thuiswater, aan de rand van Groningen.Het Paterswoldse meer ligt in zowel provincie Drenthe, als Groningen, vandaar de twee provincien. Met rond de 900 leden is het een grote actieve vereniging die zich met name richt op wedstrijdzeilen en opleiding van zowel de jeugd als volwassenen, zowel lokaal, als regionaal. De belangrijkste klassen zijn de laser, optimist, sailhorse, 16m2 en valk.');
INSERT INTO `saillingcrews` VALUES ('9', 'WV Almere Centraal', 'WV Almere Centraal', null, 'Opgericht in 1980 door een aantal fanatieke surfers van het eerste uur. Er werd gesurft bij het Zilverstrand. In 2012 is de vereniging begonnen met een nieuw progamma. Stimuleren van een dagelijks sport- en beweegaanbod voor scholieren. Ruim 300 kinderen tot 18 jaar hebben een surf clinic gevolgd. In 2012 is Almere Centraal ook uitgeroepen als beste club tijdens de North Sea Cup (Engeland, Noord Frankrijk, Belgie). Almere Centraal is de landskampioen Eredivisie Zeilen 2016.');
INSERT INTO `saillingcrews` VALUES ('10', 'WSV Almere Haven', 'WSV Almere Haven', null, 'De WSV Almere Haven heeft ruim 600 leden die actief met watersport bezig zijn. Hiervan is ongeveer de helft motorboot-vaarder en de andere helft zeiler. Door diverse commissies worden evenementen en wedstrijden georganiseerd. Waar motorbootvaarders zich richten op toer- en langere tochten, richten de zeilers zich meer op wedstrijden en toertochten in groeps-of teamverband.  Watersport Vereniging Almere Haven verzorgt vele evenementen voor alle leden.\r\nDe zeilers varen onder andere de Avondcompetitie, tijdens het seizoen wekelijks op dinsdag- of donderdagavond. Door de zeilcommissie van WSV Almere Haven worden ook regionale en landelijke wedstrijden worden georganiseerd.');
INSERT INTO `saillingcrews` VALUES ('11', 'WSV Flevomare', 'WSV Flevomare', null, 'WSV Flevomare uit Almere is opgericht op 11 maart 1992 en kent op dit moment 144 leden. Het merendeel van de leden van WSV Flevomare bezit een kajuitzeiljacht en zijn actief in de ORC-klassen. WSV Flevomare is organisator van de Almere Regatta.');
INSERT INTO `saillingcrews` VALUES ('12', 'WSV Giesbeek', 'WSV Giesbeek', null, 'WSV Giesbeek, de watersportvereniging van Giesbeek, werd op 5 november 1969 opgericht door een aantal enthousiaste watersporters. Gedurende haar bestaan heeft de vereniging een constante groei van het aantal leden gekend; tegenwoordig heeft Watersportvereniging Giesbeek ca. 1450 leden, een aantal dat ook heden ten dage nog steeds groeit. Zij behoort daarmee tot de vier grootste watersportverenigingen van Nederland.');
INSERT INTO `saillingcrews` VALUES ('13', 'WSHeeg', 'WSHeeg', null, 'WaterSportvereniging Heeg is opgericht in 1967 en kent op dit moment 450 leden. De WSHeeg kent meerdere Nederlands Kampioenen oa in de Randmeer, Olympiajol en op IFKS skûtsjes. Verder organiseert WSHeeg meerdere NK’s en in het bijzonder het Nederlands Studenten Kampioenschap.');
INSERT INTO `saillingcrews` VALUES ('14', 'WSV Het Witte Huis', 'HWH', null, '“Het Witte Huis” (HWH) is ontstaan in 1930 en sinds 1935 aangesloten bij het  Watersport Verbond . HWH behoort tot de 9 grootste wedstrijdgevende zeilverenigingen van Nederland met ca.300 leden. HWH kent een gezellig verenigingsleven waaraan vele leden hun steentje bijdragen met activiteiten die variëren van het geven van lessen aan de jeugd , het organiseren van grote zeilevenementen en HWH-wedstrijden, alsmede gecombineerde wedstrijden samen met de Loosdrechtse zusterverenigingen tot en met het runnen van het clubhuis.\r\nBij onze vereniging staat wedstrijdzeilen centraal. Mede daardoor telt HWH veel jonge (en oudere) talenten. Maar bovenal staat het plezier in het zeilen voorop!');
INSERT INTO `saillingcrews` VALUES ('15', 'Braassemermeer', 'Braassemermeer', null, 'Op 22 maart 1918 komt een aantal inwoners van Roelofarendsveen bijeen om een zeilvereniging op te richten met het doel wedstrijden te organiseren. Al in de zomer van het zelfde jaar worden de eerste wedstrijden door deze zeilvereniging, die de naam “Steeds Sneller” krijgt, daadwerkelijk georganiseerd. Eind 1922 wordt besloten de naam “Steeds Sneller” te wijzigen in Zeilvereniging Braassemermeer. Twee jaar later sluit de vereniging zich aan bij de “Verbondenen Zeilverenigingen” nu beter bekend als het KNWV en tevens wordt Koninklijke goedkeuring van de inmiddels opgemaakte statuten aangevraagd.');
INSERT INTO `saillingcrews` VALUES ('16', 'WV Breskens', 'WV Breskens', null, 'Watersportvereniging Breskens is een enthousiaste vereniging met bijna 400 leden. De haven ligt op loopafstand van het centrum en u ligt er lekker beschut. Watersportvereniging Breskens ondersteunt bij evenementen als United 4 Sailing, Tour de France à la Voile, Delta Combi en niet in de laatste plaats het Breskens Sailing Weekend. De Westerschelde is het zuidelijke zeewater van het Deltagebied tussen Zuid-Beveland en Zeeuws-Vlaanderen. De zeearm heeft een open verbinding met de Noordzee en de Schelde.');
INSERT INTO `saillingcrews` VALUES ('17', 'WSV Wolphaartsdijk', 'WSV Wolphaartsdijk', null, 'De Zeeuwse watersportvereniging WSV Wolphaartsdijk. De WSVW is een vereniging met ruim 900 leden die beschikt over 480 ligplaatsen aan het Veerse Meer, nabij Wolphaartsdijk. De WSVW werd opgericht op 13 maart 1961. De WSVW staat bekend als een “familiehaven”. Hoeveel jonge kinderen hebben al niet de eerste beginselen van het zeilen geleerd onder leiding van de trainers van de jeugdcommissie? Door de wedstrijdcommissie worden zowel in de zomer als in de winter clubwedstrijden georganiseerd.');
INSERT INTO `saillingcrews` VALUES ('18', 'Zeilteam Westeinder', 'Zeilteam Westeinder', null, 'Zeilteam Westeinder is een gecombineerd team van leden van WV de Nieuwe Meer en WV Aalsmeer.  Het team komt voort uit de stichting.Westeinder Zeilwedstrijden (WZW). Een stichting waarin een aantal lokale watersportverenigingen deelnemen. Via Westeinder Zeilwedstrijden bundelen de deelnemende verenigingen hun krachten op het gebied van de wedstrijdzeilsport. Al 70 jaar lang organiseert Westeinder Zeilwedstrijden wedstrijden op de Westeinderplassen; van de Combi Westeinder voor jeugdzeilers uit de regio Amsterdam tot Nederlandse Kampioenschappen en Grand Prix voor nationale en internationale klassen als de Regenboog en de Draak en rond- en platbodemwedstrijden.');

-- ----------------------------
-- Table structure for saillingr_egattas
-- ----------------------------
DROP TABLE IF EXISTS `saillingr_egattas`;
CREATE TABLE `saillingr_egattas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of saillingr_egattas
-- ----------------------------

-- ----------------------------
-- Table structure for trackers
-- ----------------------------
DROP TABLE IF EXISTS `trackers`;
CREATE TABLE `trackers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crew_id` int(11) DEFAULT NULL,
  `last_message` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `heading` double DEFAULT NULL,
  `roll_angle` double DEFAULT NULL,
  `pitch_angle` double DEFAULT NULL,
  `velocity` double DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `utm_north` double DEFAULT NULL,
  `utm_east` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trackers
-- ----------------------------
INSERT INTO `trackers` VALUES ('1', null, null, '2017-07-03 12:11:36', null, null, null, null, null, null, 'Bouy', null, null);

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
