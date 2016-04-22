# Host: localhost  (Version: 5.6.21-log)
# Date: 2016-04-22 19:36:47
# Generator: MySQL-Front 5.3  (Build 5.16)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "mconclusion"
#

DROP TABLE IF EXISTS `mconclusion`;
CREATE TABLE `mconclusion` (
  `conclusion` int(11) NOT NULL,
  `conclusionName` varchar(45) DEFAULT NULL,
  `f` float(45,5) DEFAULT NULL,
  `c` float(45,5) DEFAULT NULL,
  `e` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`conclusion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "mconclusion"
#

INSERT INTO `mconclusion` VALUES (12,NULL,0.97219,0.75114,0.85468),(13,NULL,1.00000,0.89503,0.94752),(14,NULL,1.00000,0.86020,0.93010),(15,NULL,1.00000,0.82774,0.91387);

#
# Structure for table "t_area"
#

DROP TABLE IF EXISTS `t_area`;
CREATE TABLE `t_area` (
  `AreaId` int(11) NOT NULL,
  `AreaName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`AreaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_area"
#

INSERT INTO `t_area` VALUES (111,'少于-100-平米'),(121,'少于-300-平米'),(131,'少于-600-平米'),(141,'少于-1000-平米'),(151,'大于-1000-平米');

#
# Structure for table "t_callingtime"
#

DROP TABLE IF EXISTS `t_callingtime`;
CREATE TABLE `t_callingtime` (
  `CallingTimeId` int(11) NOT NULL,
  `CallingTimeName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`CallingTimeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_callingtime"
#

INSERT INTO `t_callingtime` VALUES (113,'少于3次'),(123,'大于3次且小于5次'),(133,'大于3次且小于5次'),(143,'大于5次'),(153,'大于5次');

#
# Structure for table "t_comburent"
#

DROP TABLE IF EXISTS `t_comburent`;
CREATE TABLE `t_comburent` (
  `ComburentId` int(11) NOT NULL,
  `ComburentName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ComburentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_comburent"
#

INSERT INTO `t_comburent` VALUES (211,'居民住宅'),(212,'仓库'),(221,'高于二十四米的建筑物'),(2101,'居民住宅'),(2102,'仓库'),(2103,'工厂'),(2104,'企业'),(2105,'商场'),(2106,'集贸市场'),(2107,'宾馆'),(2108,'酒店'),(2109,'娱乐场所'),(2301,'地铁'),(2302,'隧道'),(2303,'地下商场'),(2401,'石油化工单位 '),(2402,'储油罐'),(2403,'油类运输工具'),(2501,'天然气输送管道'),(2502,'存气罐'),(2503,'气体运输工具'),(2601,'特殊气体单位'),(2701,'粮食仓库'),(2702,'木材场'),(2703,'稻草场'),(2801,'火车'),(2802,'船舶'),(2803,'飞机'),(2804,'汽车'),(2901,'电器'),(2902,'单体汽车'),(2903,'垃圾');

#
# Structure for table "t_conclusion"
#

DROP TABLE IF EXISTS `t_conclusion`;
CREATE TABLE `t_conclusion` (
  `conclusion` int(11) NOT NULL DEFAULT '0',
  `f` float(45,5) DEFAULT NULL,
  `c` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`conclusion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_conclusion"
#

INSERT INTO `t_conclusion` VALUES (13,1.00000,0.89503),(332,1.00000,0.72497);

#
# Structure for table "t_danger"
#

DROP TABLE IF EXISTS `t_danger`;
CREATE TABLE `t_danger` (
  `DangerId` int(11) NOT NULL,
  `DangerName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`DangerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_danger"
#

INSERT INTO `t_danger` VALUES (11701,'无'),(12701,'爆炸'),(13701,'爆炸'),(14701,'爆炸'),(15701,'爆炸');

#
# Structure for table "t_deathtoll"
#

DROP TABLE IF EXISTS `t_deathtoll`;
CREATE TABLE `t_deathtoll` (
  `DeathTollId` int(11) NOT NULL,
  `DeathTollName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`DeathTollId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_deathtoll"
#

INSERT INTO `t_deathtoll` VALUES (11603,'0'),(12603,'0'),(13603,'小于3人'),(14603,'大于3人以上'),(15603,'大于10人');

#
# Structure for table "t_fire"
#

DROP TABLE IF EXISTS `t_fire`;
CREATE TABLE `t_fire` (
  `fireId` int(11) NOT NULL,
  `fireName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`fireId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_fire"
#

INSERT INTO `t_fire` VALUES (11501,'较小'),(12501,'小'),(13501,'大'),(14501,'很大'),(15501,'严峻');

#
# Structure for table "t_firetype"
#

DROP TABLE IF EXISTS `t_firetype`;
CREATE TABLE `t_firetype` (
  `FireTypeId` int(11) NOT NULL,
  `FireTypeName` varchar(45) DEFAULT NULL,
  `ComburentId` int(11) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`FireTypeId`),
  KEY `fk_comburent_idx` (`ComburentId`),
  CONSTRAINT `fk_comburent` FOREIGN KEY (`ComburentId`) REFERENCES `t_comburent` (`ComburentId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_firetype"
#

INSERT INTO `t_firetype` VALUES (21,'一般性建筑火灾',211,1.00000,0.90000),(22,'高层建筑火灾',221,1.00000,0.90000),(23,'地下空间火灾',2301,1.00000,0.90000),(24,'油类火灾',2401,1.00000,0.90000),(25,'一般气体火灾',2501,1.00000,0.90000),(26,'毒气火灾',2601,1.00000,0.90000),(27,'露天堆场火灾',2701,1.00000,0.90000),(28,'交通工具火灾',2801,1.00000,0.90000),(29,'一般性火灾',2901,1.00000,0.90000),(273553,'露天堆场火灾',2701,1.00000,0.90000);

#
# Structure for table "t_injuredpeople"
#

DROP TABLE IF EXISTS `t_injuredpeople`;
CREATE TABLE `t_injuredpeople` (
  `InjuredPeopleId` int(11) NOT NULL,
  `InjuredPeopleName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`InjuredPeopleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_injuredpeople"
#

INSERT INTO `t_injuredpeople` VALUES (11602,'0'),(12602,'小于5'),(13602,'小于10'),(14602,'10人以上'),(15602,'20人以上');

#
# Structure for table "t_input"
#

DROP TABLE IF EXISTS `t_input`;
CREATE TABLE `t_input` (
  `input` int(11) NOT NULL DEFAULT '0',
  `conclusion` int(11) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `f` float(45,5) DEFAULT NULL,
  `c` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`input`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_input"
#

INSERT INTO `t_input` VALUES (131,13,'少于-600-平米',1.00000,0.90000),(132,13,'少于-5000-立方米',1.00000,0.90000);

#
# Structure for table "t_learn"
#

DROP TABLE IF EXISTS `t_learn`;
CREATE TABLE `t_learn` (
  `leanrId` int(11) NOT NULL AUTO_INCREMENT,
  `Condition1` int(11) DEFAULT NULL,
  `Description1` varchar(45) DEFAULT NULL,
  `Condition2` int(11) DEFAULT NULL,
  `Description2` varchar(45) DEFAULT NULL,
  `Conclusion` int(11) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`leanrId`)
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8;

#
# Data for table "t_learn"
#

INSERT INTO `t_learn` VALUES (182,152,'大于-10000-立方米',153,'大于5次',15,1.00000,0.61832),(183,143,'大于5次',144,'发展期',14,1.00000,0.80198),(184,152,'大于-10000-立方米',154,'发展期',15,1.00000,0.61832),(185,153,'大于5次',154,'发展期',15,1.00000,0.80198),(186,132,'少于-5000-立方米',134,'发展期',13,1.00000,0.91326),(187,141,'少于-1000-平米',144,'发展期',14,1.00000,0.76415),(188,141,'少于-1000-平米',14502,'迅猛',14,1.00000,0.61832),(189,144,'发展期',14502,'迅猛',14,1.00000,0.78461),(190,154,'发展期',15502,'迅猛',15,1.00000,0.80198),(191,141,'少于-1000-平米',14601,'大于10',14,1.00000,0.44751),(192,144,'发展期',14601,'大于10',14,1.00000,0.76415),(193,14502,'迅猛',14601,'大于10',14,1.00000,0.66868),(194,121,'少于-300-平米',12501,'小',12,1.00000,0.61832),(195,111,'少于-100-平米',113,'少于3次',11,1.00000,0.67990),(196,154,'发展期',15501,'严峻',15,1.00000,0.81203),(197,15501,'严峻',15502,'迅猛',15,1.00000,0.28712),(198,132,'少于-5000-立方米',133,'大于3次且小于5次',13,0.91250,0.59016),(199,133,'大于3次且小于5次',134,'发展期',13,1.00000,0.94319),(200,111,'少于-100-平米',11501,'较小',11,1.00000,0.44751),(201,123,'大于3次且小于5次',12601,'小于5',12,1.00000,0.66715),(202,132,'少于-5000-立方米',13502,'迅速',13,1.00000,0.72437),(203,134,'发展期',13502,'迅速',13,1.00000,0.85397),(204,121,'少于-300-平米',123,'大于3次且小于5次',12,0.91947,0.95314),(205,121,'少于-300-平米',124,'初期',12,1.00000,0.82111),(206,123,'大于3次且小于5次',124,'初期',12,0.85748,0.65326),(207,114,'初期',11501,'较小',11,0.60000,0.23077),(208,121,'少于-300-平米',12502,'快',12,1.00000,0.50199),(209,124,'初期',12502,'快',12,0.60000,0.30918),(210,122,'少于-3000-立方米',123,'大于3次且小于5次',12,0.87127,0.85532),(211,121,'少于-300-平米',122,'少于-3000-立方米',12,0.92306,0.92440),(212,133,'大于3次且小于5次',13502,'迅速',13,1.00000,0.87937),(213,121,'少于-300-平米',12601,'小于5',12,0.80000,0.71591),(214,122,'少于-3000-立方米',12601,'小于5',12,0.80000,0.56127),(215,131,'少于-600-平米',132,'少于-5000-立方米',13,1.00000,0.61832);

#
# Structure for table "t_operator"
#

DROP TABLE IF EXISTS `t_operator`;
CREATE TABLE `t_operator` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL,
  `sex` varchar(2) DEFAULT NULL,
  `age` int(5) DEFAULT NULL,
  `identityCard` varchar(30) DEFAULT NULL,
  `workdate` datetime DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL,
  `admin` bit(1) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "t_operator"
#

INSERT INTO `t_operator` VALUES (1,'n',NULL,NULL,'e4uWWtS8oOQatR3nsxNjoQ==',NULL,NULL,b'1','n');

#
# Structure for table "t_similarity"
#

DROP TABLE IF EXISTS `t_similarity`;
CREATE TABLE `t_similarity` (
  `SimilarityId` int(11) NOT NULL AUTO_INCREMENT,
  `Level1` int(11) DEFAULT NULL,
  `Description1` varchar(45) DEFAULT NULL,
  `Level2` int(11) DEFAULT NULL,
  `Description2` varchar(45) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`SimilarityId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

#
# Data for table "t_similarity"
#

INSERT INTO `t_similarity` VALUES (32,14,'四级火灾',15,'五级火灾',1.00000,0.95626),(33,13,'三级火灾',14,'四级火灾',1.00000,0.96108),(34,13,'三级火灾',15,'五级火灾',1.00000,0.96227),(35,12,'二级火灾',13,'三级火灾',0.97219,0.96012),(36,11,'一级火灾',12,'二级火灾',0.84081,0.63960);

#
# Structure for table "t_spreading"
#

DROP TABLE IF EXISTS `t_spreading`;
CREATE TABLE `t_spreading` (
  `SpreadingId` int(11) NOT NULL,
  `SpreadingName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`SpreadingId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_spreading"
#

INSERT INTO `t_spreading` VALUES (11502,'无'),(12502,'快'),(13502,'迅速'),(14502,'迅猛'),(15502,'迅猛');

#
# Structure for table "t_stage"
#

DROP TABLE IF EXISTS `t_stage`;
CREATE TABLE `t_stage` (
  `StageId` int(11) NOT NULL,
  `StageName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`StageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_stage"
#

INSERT INTO `t_stage` VALUES (114,'初期'),(124,'初期'),(134,'发展期'),(144,'发展期'),(154,'发展期');

#
# Structure for table "t_trappedpeople"
#

DROP TABLE IF EXISTS `t_trappedpeople`;
CREATE TABLE `t_trappedpeople` (
  `TrappedPeopleId` int(11) NOT NULL,
  `TrappedPeopleName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`TrappedPeopleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_trappedpeople"
#

INSERT INTO `t_trappedpeople` VALUES (11601,'0'),(12601,'小于5'),(13601,'小于10'),(14601,'大于10'),(15601,'大于15');

#
# Structure for table "t_volume"
#

DROP TABLE IF EXISTS `t_volume`;
CREATE TABLE `t_volume` (
  `VolumeId` int(11) NOT NULL,
  `VolumeName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`VolumeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_volume"
#

INSERT INTO `t_volume` VALUES (112,'少于-1000-立方米'),(122,'少于-3000-立方米'),(132,'少于-5000-立方米'),(142,'少于-10000-立方米'),(152,'大于-10000-立方米');

#
# Structure for table "t_firelevel"
#

DROP TABLE IF EXISTS `t_firelevel`;
CREATE TABLE `t_firelevel` (
  `FireLevelid` int(11) NOT NULL,
  `FireLevelName` varchar(45) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  `Areaid` int(11) NOT NULL,
  `VolumeId` int(11) NOT NULL,
  `CallingTimeId` int(11) NOT NULL,
  `StageId` int(11) NOT NULL,
  `FireId` int(11) NOT NULL,
  `SpreadingId` int(11) NOT NULL,
  `TrappedpeopleId` int(11) NOT NULL,
  `InjuredPeopleId` int(11) NOT NULL,
  `DeathTollid` int(11) NOT NULL,
  `Dangerid` int(11) NOT NULL,
  PRIMARY KEY (`FireLevelid`),
  KEY `fk_area_idx` (`Areaid`),
  KEY `fk_volume_idx` (`VolumeId`),
  KEY `fk_callingtime_idx` (`CallingTimeId`),
  KEY `fk_fire_idx` (`FireId`),
  KEY `fk_stage_idx` (`StageId`),
  KEY `fk_fire_idx1` (`FireId`),
  KEY `fk_stage_idx1` (`SpreadingId`),
  KEY `fk_trappedpeople_idx` (`TrappedpeopleId`),
  KEY `fk_injuredpeople_idx` (`InjuredPeopleId`),
  KEY `fk_death_idx` (`DeathTollid`),
  KEY `fk_danger_idx` (`Dangerid`),
  KEY `fk_danger_idx1` (`Dangerid`),
  CONSTRAINT `fk_area` FOREIGN KEY (`Areaid`) REFERENCES `t_area` (`AreaId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_callingtime` FOREIGN KEY (`CallingTimeId`) REFERENCES `t_callingtime` (`CallingTimeId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_danger` FOREIGN KEY (`Dangerid`) REFERENCES `t_danger` (`DangerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_death` FOREIGN KEY (`DeathTollid`) REFERENCES `t_deathtoll` (`DeathTollId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_fire` FOREIGN KEY (`FireId`) REFERENCES `t_fire` (`fireId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_injuredpeople` FOREIGN KEY (`InjuredPeopleId`) REFERENCES `t_injuredpeople` (`InjuredPeopleId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_spreading` FOREIGN KEY (`SpreadingId`) REFERENCES `t_spreading` (`SpreadingId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_stage` FOREIGN KEY (`StageId`) REFERENCES `t_stage` (`StageId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_trappedpeople` FOREIGN KEY (`TrappedpeopleId`) REFERENCES `t_trappedpeople` (`TrappedPeopleId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_volume` FOREIGN KEY (`VolumeId`) REFERENCES `t_volume` (`VolumeId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_firelevel"
#

INSERT INTO `t_firelevel` VALUES (11,'一级火灾',1.00000,1.00000,111,112,113,114,11501,11502,11601,11602,11603,11701),(12,'二级火灾',1.00000,1.00000,121,122,123,124,12501,12502,12601,12602,12603,12701),(13,'三级火灾',1.00000,1.00000,131,132,133,134,13501,13502,13601,13602,13603,13701),(14,'四级火灾',1.00000,1.00000,141,142,143,144,14501,14502,14601,14602,14603,14701),(15,'五级火灾',1.00000,1.00000,151,152,153,154,15501,15502,15601,15602,15603,15701);

#
# Structure for table "t_dispatch"
#

DROP TABLE IF EXISTS `t_dispatch`;
CREATE TABLE `t_dispatch` (
  `DispatchId` int(10) NOT NULL,
  `TypeId` int(50) DEFAULT NULL,
  `LevelId` int(50) DEFAULT NULL,
  `FireFighterNum` varchar(100) DEFAULT NULL,
  `Equipment` varchar(100) DEFAULT NULL,
  `Frequency` varchar(45) DEFAULT NULL,
  `Confidence` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`DispatchId`),
  KEY `kf_type_idx` (`TypeId`),
  KEY `fk_level_idx` (`LevelId`),
  CONSTRAINT `fk_level` FOREIGN KEY (`LevelId`) REFERENCES `t_firelevel` (`FireLevelid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `kf_type` FOREIGN KEY (`TypeId`) REFERENCES `t_firetype` (`FireTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_dispatch"
#

INSERT INTO `t_dispatch` VALUES (311,21,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(312,22,11,'二十五名-消防员','一辆水罐消防车','1.0','0.9'),(313,23,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(314,24,11,'二十五名-消防员','两辆防化消防车','1.0','0.9'),(315,25,11,'二十五名-消防员','一辆水罐消防车∩一辆泡沫消防车','1.0','0.9'),(316,26,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(317,27,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(318,28,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(319,29,11,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(321,21,12,'八十名-消防员','五辆水罐消防车∩一辆抢险救援车∩一辆云梯消防车','1.0','0.9'),(322,22,12,'七十名-消防员','四辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(323,23,12,'七十五名-消防员','六辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(324,24,12,'七十五名-消防员','四辆防化消防车∩一辆抢险救援车','1.0','0.9'),(325,25,12,'七十五名-消防员','三辆灌水消防车∩两辆泡沫消防车∩一辆抢险救援车','1.0','0.9'),(326,26,12,'八十名-消防员',' 两辆灌水消防车∩ 两辆泡沫消防车∩一辆照明∩ 两辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(327,27,12,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(328,28,12,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(329,29,12,'二十五名-消防员','两辆水罐消防车','1.0','0.9'),(331,21,13,'一百八十名-消防员','六辆水罐消防车∩一辆抢险救援车','1.0','0.9'),(332,22,13,'二百二十名-消防员','八辆灌水消防车∩一辆抢险救援车∩一辆登高车','1.0','0.9'),(333,23,13,'二百二十名-消防员','五辆灌水消防车∩三辆泡沫消防车∩ 两辆抢险救援车∩两辆照明车','1.0','0.9'),(334,24,13,'二百名-消防员','四辆防化消防车∩四辆泡沫消防车∩一辆抢险救援车','1.0','0.9'),(335,25,13,'二百名-消防员','八辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(336,26,13,'二百二十名-消防员',' 六辆防化消防车∩一辆抢险救援车','1.0','0.9'),(337,27,13,'二百二十名-消防员','六辆水罐消防车∩两辆抢险救援车∩一辆高喷车','1.0','0.9'),(338,28,13,'二百二十名-消防员','四辆水罐消防车∩四辆泡沫消防车∩两辆抢险救援车∩一辆照明车','1.0','0.9'),(339,29,13,'二百二十名  -消防员','xx','1.0','0.9'),(341,21,14,'四百五十名-消防员','十二辆水罐消防车∩两辆抢险救援车','1.0','0.9'),(342,22,14,'五百五十名-消防员','十二辆灌水消防车∩两辆抢险救援车∩两辆登高车','1.0','0.9'),(343,23,14,'五百五十名-消防员','八辆灌水消防车∩四辆泡沫消防车∩两辆抢险救援车∩一辆照明车','1.0','0.9'),(344,24,14,'五百名-消防员','六辆防化消防车∩六辆泡沫消防车∩二辆抢险救援车','1.0','0.9'),(345,25,14,'五百名-消防员','十二辆灌水消防车∩两辆抢险救援车','1.0','0.9'),(346,26,14,'五百名-消防员','十辆防化消防车∩两辆抢险救援车','1.0','0.9'),(347,27,14,'五百五十名-消防员','十辆水罐消防车∩两辆抢险救援车∩两辆高喷车∩一辆云梯车','1.0','0.9'),(348,28,14,'五百五十名-消防员',' 六辆水罐消防车∩六辆泡沫消防车∩六辆抢险救援车∩两辆照明车','1.0','0.9'),(349,29,14,'五百五十名-消防员','xx','1.0','0.9'),(351,21,15,'一千名-消防员','二十四辆水罐消防车∩两辆抢险救援车','1.0','0.9'),(352,22,15,'一千名-消防员','十六辆灌水消防车∩两辆抢险救援车∩两辆登高车','1.0','0.9'),(353,23,15,'一千名-消防员','十二辆灌水消防车∩四辆泡沫消防车∩ 两辆抢险救援车∩一辆照明车','1.0','0.9'),(354,24,15,'一千名-消防员','九辆防化消防车∩七辆泡沫消防车∩两辆抢险救援车','1.0','0.9'),(355,25,15,'一千名-消防员','十六辆灌水消防车∩两辆抢险救援车','1.0','0.9'),(356,26,15,'一千名-消防员','十六辆防化消防车∩三辆抢险救援车','1.0','0.9'),(357,27,15,'一千名-消防员','十四辆水罐消防车∩两辆抢险救援车∩两辆高喷车∩两辆云梯车','1.0','0.9'),(358,28,15,'一千名-消防员','八辆水罐消防车∩八辆泡沫消防车∩两辆抢险救援车∩两辆照明车','1.0','0.9'),(359,29,15,'一千名-消防员','xx','1.0','0.9');

#
# Structure for table "templearn"
#

DROP TABLE IF EXISTS `templearn`;
CREATE TABLE `templearn` (
  `leanrId` int(11) NOT NULL AUTO_INCREMENT,
  `Condition1` int(11) DEFAULT NULL,
  `Description1` varchar(45) DEFAULT NULL,
  `Condition2` int(11) DEFAULT NULL,
  `Description2` varchar(45) DEFAULT NULL,
  `Conclusion` int(11) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`leanrId`)
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

#
# Data for table "templearn"
#

INSERT INTO `templearn` VALUES (182,152,'大于-10000-立方米',153,'大于5次',15,1.00000,0.61832),(183,143,'大于5次',144,'发展期',14,1.00000,0.80198),(184,152,'大于-10000-立方米',154,'发展期',15,1.00000,0.61832),(185,153,'大于5次',154,'发展期',15,1.00000,0.80198),(186,132,'少于-5000-立方米',134,'发展期',13,1.00000,0.91326),(187,141,'少于-1000-平米',144,'发展期',14,1.00000,0.76415),(188,141,'少于-1000-平米',14502,'迅猛',14,1.00000,0.61832),(189,144,'发展期',14502,'迅猛',14,1.00000,0.78461),(190,154,'发展期',15502,'迅猛',15,1.00000,0.80198),(191,141,'少于-1000-平米',14601,'大于10',14,1.00000,0.44751),(192,144,'发展期',14601,'大于10',14,1.00000,0.76415),(193,14502,'迅猛',14601,'大于10',14,1.00000,0.66868),(194,121,'少于-300-平米',12501,'小',12,1.00000,0.61832),(195,111,'少于-100-平米',113,'少于3次',11,1.00000,0.67990),(196,154,'发展期',15501,'严峻',15,1.00000,0.81203),(197,15501,'严峻',15502,'迅猛',15,1.00000,0.28712),(198,132,'少于-5000-立方米',133,'大于3次且小于5次',13,0.91250,0.59016),(199,133,'大于3次且小于5次',134,'发展期',13,1.00000,0.94319),(200,111,'少于-100-平米',11501,'较小',11,1.00000,0.44751),(201,123,'大于3次且小于5次',12601,'小于5',12,1.00000,0.66715),(202,132,'少于-5000-立方米',13502,'迅速',13,1.00000,0.72437),(203,134,'发展期',13502,'迅速',13,1.00000,0.85397),(204,121,'少于-300-平米',123,'大于3次且小于5次',12,0.91947,0.95314),(205,121,'少于-300-平米',124,'初期',12,1.00000,0.82111),(206,123,'大于3次且小于5次',124,'初期',12,0.85748,0.65326),(207,114,'初期',11501,'较小',11,0.60000,0.23077),(208,121,'少于-300-平米',12502,'快',12,1.00000,0.50199),(209,124,'初期',12502,'快',12,0.60000,0.30918),(210,122,'少于-3000-立方米',123,'大于3次且小于5次',12,0.87127,0.85532),(211,121,'少于-300-平米',122,'少于-3000-立方米',12,0.92306,0.92440),(212,133,'大于3次且小于5次',13502,'迅速',13,1.00000,0.87937),(213,121,'少于-300-平米',12601,'小于5',12,0.80000,0.71591),(214,122,'少于-3000-立方米',12601,'小于5',12,0.80000,0.56127),(215,131,'少于-600-平米',132,'少于-5000-立方米',13,1.00000,0.44751);

#
# Structure for table "tempsimilarity"
#

DROP TABLE IF EXISTS `tempsimilarity`;
CREATE TABLE `tempsimilarity` (
  `SimilarityId` int(11) NOT NULL AUTO_INCREMENT,
  `Level1` int(11) DEFAULT NULL,
  `Description1` varchar(45) DEFAULT NULL,
  `Level2` int(11) DEFAULT NULL,
  `Description2` varchar(45) DEFAULT NULL,
  `Frequency` float(45,5) DEFAULT NULL,
  `Confidence` float(45,5) DEFAULT NULL,
  PRIMARY KEY (`SimilarityId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

#
# Data for table "tempsimilarity"
#

INSERT INTO `tempsimilarity` VALUES (32,14,'四级火灾',15,'五级火灾',1.00000,0.95626),(33,13,'三级火灾',14,'四级火灾',1.00000,0.96108),(34,13,'三级火灾',15,'五级火灾',1.00000,0.96227),(35,12,'二级火灾',13,'三级火灾',0.97219,0.96012),(36,11,'一级火灾',12,'二级火灾',0.84081,0.63960);

#
# Procedure "clearConclusion"
#

DROP PROCEDURE IF EXISTS `clearConclusion`;
CREATE PROCEDURE `clearConclusion`()
BEGIN
	#Routine body goes here...
	 truncate table mconclusion;
	 truncate table t_input;
	 truncate table t_conclusion;
	 truncate table tempLearn;
	 truncate table tempSimilarity;
END;

#
# Procedure "findMax"
#

DROP PROCEDURE IF EXISTS `findMax`;
CREATE PROCEDURE `findMax`()
BEGIN
	DECLARE done INT;
	DECLARE maxE FLOAT;
	DECLARE cConclu INTEGER;
	DECLARE cF FLOAT;
	DECLARE cC FLOAT;
	DECLARE cE FLOAT;
	DECLARE mCluCursor CURSOR FOR SELECT f,c FROM mconclusion;
	DECLARE mCursor CURSOR FOR SELECT e FROM mconclusion;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
	
	SET done = 0;
	OPEN mCluCursor;
	mCluLoop:LOOP
	FETCH mCluCursor INTO cF,cC;
		IF (done = 1) THEN LEAVE mCluLoop; END IF;
		SET cE = cC*(cF-0.5)+0.5;
		UPDATE mconclusion
		SET e = cE
		WHERE f = cF AND c = cC;

	END LOOP mCluLoop;
	CLOSE mCluCursor;

	SET maxE = 0;
	SET done = 0;
	OPEN mCursor;
	mLoop:LOOP
	FETCH mCursor INTO cE;
		IF (done = 1) THEN LEAVE mLoop; END IF;
		IF maxE<cE THEN
			SET maxE = cE;
		END IF;

	END LOOP mLoop;
	CLOSE mCursor;
	
	INSERT INTO t_conclusion
	SELECT conclusion,f,c
	FROM mconclusion
	WHERE mconclusion.e = maxE;
	

END;
