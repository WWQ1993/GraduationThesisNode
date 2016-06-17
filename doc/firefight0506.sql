# Host: localhost  (Version: 5.6.21-log)
# Date: 2016-05-06 19:25:55
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

INSERT INTO `mconclusion` VALUES (11,NULL,0.88380,0.23792,0.59131),(12,NULL,0.99414,0.92672,0.95793),(13,NULL,0.99300,0.94859,0.96765),(14,NULL,0.99751,0.94627,0.97078),(15,NULL,0.99695,0.94130,0.96778);

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
# Structure for table "t_firehouse"
#

DROP TABLE IF EXISTS `t_firehouse`;
CREATE TABLE `t_firehouse` (
  `Id` varchar(11) NOT NULL DEFAULT '',
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(10240) DEFAULT NULL,
  `peopleNum` int(11) DEFAULT NULL,
  `devices` varchar(10240) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "t_firehouse"
#

INSERT INTO `t_firehouse` VALUES ('B0FFFWEOIF','天津空港物流加工区消防支队(第二消防站)','天津市东丽区中环西路南100米',850,'水罐消防车:10,抢险救援车:5,云梯消防车:8,高喷车:3,云梯车:3,灌水消防车:5'),('B0FFG4QIAU','天津市公安消防总队河东支队特勤一队','天津市河东区万新村天山路',550,'水罐消防车:6,抢险救援车:5,云梯消防车:10,泡沫消防车:2,,灌水消防车:5,高喷车:3,云梯车:3,防化消防车:5'),('B0FFG8OCGG','西青消防支队','天津市西青区京福公路北50米',960,'水罐消防车:6,抢险救援车:10,云梯消防车:10,灌水消防车:3,登高车:3,照明车:3,防化消防车:5'),('B0FFG8UHMD','天津港公安局消防支队','天津市滨海新区二号路与新港二号路交叉口东50米',0,''),('B0FFG8UHMN','天津港公安局消防支队一大队','天津市滨海新区二号路与新港二号路交叉口东50米',420,'水罐消防车:6,抢险救援车:10,云梯消防车:10,照明车:2,,灌水消防车:3,高喷车:3,云梯车:3'),('B0FFG8V6HP','公安消防局河西支队','天津市河西区怒江道与玛钢路交叉口西北50米',1020,'水罐消防车:6,抢险救援车:10,云梯消防车:10,登高车:3,灌水消防车:5,高喷车:3,云梯车:3'),('B0FFG99X3E','东丽区公安消防支队','天津市东丽区先锋路北50米',990,'水罐消防车:6,抢险救援车:10,云梯消防车:10,泡沫消防车:4,灌水消防车:5,照明车:3'),('B0FFG9CVFR','红桥区公安消防支队西站中队','天津市红桥区南运河北路与闸桥北路交叉口西南100米',850,'水罐消防车:6,抢险救援车:10,云梯消防车:10,照明车:1,防化消防车:5'),('B0FFG9GBR2','津南区津沽路津南消防支队','天津市津南区雅深路4号',1120,'水罐消防车:6,抢险救援车:5,云梯消防车:10,,灌水消防车:3,登高车:3,高喷车:3,云梯车:3,防化消防车:5,泡沫消防车:2'),('B0FFGC01Z7','南开消防支队','天津市南开区灵隐道和三潭路交汇处',1100,'水罐消防车:6,抢险救援车:10,云梯消防车:10,防化消防车:4,灌水消防车:2'),('B0FFGFT2T5','天津市公安消防总队泉丰路中队','天津市武清区',32,'水罐消防车:6,抢险救援车:5,云梯消防车:10,泡沫消防车:2,照明车:1,灌水消防车:5,防化消防车:5'),('B0FFGH2HAH','蓟县消防队','天津市蓟县津围公路',550,'水罐消防车:6,抢险救援车:10,云梯消防车:10,灌水消防车:5,高喷车:3,云梯车:3,照明车:3'),('B0FFGHAIUF','天津市和平区公安消防支队','天津市和平区鞍山道129号',1030,'水罐消防车:6,抢险救援车:10,云梯消防车:10,,灌水消防车:3,登高车:3,照明车:3,泡沫消防车:4'),('B0FFGHRW0G','消防支队','天津市滨海新区厂西路附近',1150,'水罐消防车:6,抢险救援车:10,云梯消防车:10,泡沫消防车:3,灌水消防车:2,高喷车:3,云梯车:3,防化消防车:5'),('B0FFGI6MSB','天津市公安消防总队第45中队','天津市西青区南开华苑小区飞鸿路与华苑路交口',1028,'水罐消防车:6,抢险救援车:10,云梯消防车:10,防化消防车:2,泡沫消防车:4,登高车:5,防化消防车:5'),('B0FFGI7KHJ','天津市西青区中北镇专职消防队','天津市西青区红彤路30号',410,'水罐消防车:6,抢险救援车:10,云梯消防车:10,登高车:3,灌水消防车:5'),('B0FFGJKBF8','天津消防大港支队','天津市滨海新区西环路999号',1350,'水罐消防车:6,抢险救援车:10,云梯消防车:10,灌水消防车:3,防化消防车:5,,泡沫消防车:4'),('B0FFGLKPXI','消防和平支队','天津市和平区新兴路与四平西道交口',920,'水罐消防车:6,抢险救援车:10,云梯消防车:10,泡沫消防车:2,灌水消防车:5,登高车:3'),('B0FFGPIJTE','公安消防教导大队','天津市北辰区小淀镇津榆公路222号',550,'水罐消防车:3,抢险救援车:10,云梯消防车:10,灌水消防车:5,高喷车:3,云梯车:3,照明车:3'),('B0FFGPJ23T','外滩消防中队','天津市滨海新区新华路1384号',32,'水罐消防车:6,抢险救援车:5,云梯消防车:10,登高车:3,灌水消防车:5,高喷车:3,云梯车:3'),('B0FFGPJAA6','华安消防职业培训学校消防讲堂消防局','天津市南开区南马路708号',0,''),('B0FFGS6YOA','国家固定灭火系统与耐火构建质量监督检验中心','天津市西青区富兴路2号',0,''),('B0FFGVUVVE','公安消防大队','天津市津南区咸水沽镇海河教育园雅观路9号',500,'水罐消防车:6,抢险救援车:10,云梯消防车:10,登高车:3,灌水消防车:5,高喷车:3,云梯车:3,防化消防车:5'),('B0FFGVVVS4','杨柳青消防队','天津市西青区杨柳镇柳丽路38号',500,'水罐消防车:6,抢险救援车:10,云梯消防车:10,防化消防车:3,登高车:3');

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

INSERT INTO `t_firetype` VALUES (21,'一般性建筑火灾',211,1.00000,0.90000),(22,'高层建筑火灾',221,1.00000,0.90000),(23,'地下空间火灾',2301,1.00000,0.90000),(24,'油类火灾',2401,1.00000,0.90000),(25,'一般气体火灾',2501,1.00000,0.90000),(26,'毒气火灾',2601,1.00000,0.90000),(27,'露天堆场火灾',2701,1.00000,0.90000),(28,'交通工具火灾',2801,1.00000,0.90000),(29,'一般性火灾',2901,1.00000,0.90000);

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

INSERT INTO `t_input` VALUES (12701,12,'爆炸',1.00000,0.90000),(13701,13,'爆炸',1.00000,0.90000),(14701,14,'爆炸',1.00000,0.90000),(15701,15,'爆炸',1.00000,0.90000);

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
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8;

#
# Data for table "t_learn"
#

INSERT INTO `t_learn` VALUES (182,152,'大于-10000-立方米',153,'大于5次',15,1.00000,0.81492),(183,143,'大于5次',144,'发展期',14,1.00000,0.83192),(184,152,'大于-10000-立方米',154,'发展期',15,0.95524,0.72322),(185,153,'大于5次',154,'发展期',15,1.00000,0.82191),(186,132,'少于-5000-立方米',134,'发展期',13,1.00000,0.91752),(187,141,'少于-1000-平米',144,'发展期',14,1.00000,0.77962),(188,141,'少于-1000-平米',14502,'迅猛',14,1.00000,0.61832),(189,144,'发展期',14502,'迅猛',14,1.00000,0.78461),(190,154,'发展期',15502,'迅猛',15,1.00000,0.80198),(191,141,'少于-1000-平米',14601,'大于10',14,1.00000,0.44751),(192,144,'发展期',14601,'大于10',14,1.00000,0.76415),(193,14502,'迅猛',14601,'大于10',14,1.00000,0.66868),(194,121,'少于-300-平米',12501,'小',12,1.00000,0.61832),(195,111,'少于-100-平米',113,'少于3次',11,0.96355,0.87451),(196,154,'发展期',15501,'严峻',15,1.00000,0.82070),(197,15501,'严峻',15502,'迅猛',15,1.00000,0.51276),(198,132,'少于-5000-立方米',133,'大于3次且小于5次',13,0.91250,0.59016),(199,133,'大于3次且小于5次',134,'发展期',13,1.00000,0.94682),(200,111,'少于-100-平米',11501,'较小',11,0.85714,0.55752),(201,123,'大于3次且小于5次',12601,'小于5',12,1.00000,0.67513),(202,132,'少于-5000-立方米',13502,'迅速',13,1.00000,0.72437),(203,134,'发展期',13502,'迅速',13,1.00000,0.86277),(204,121,'少于-300-平米',123,'大于3次且小于5次',12,0.92031,0.95362),(205,121,'少于-300-平米',124,'初期',12,1.00000,0.83078),(206,123,'大于3次且小于5次',124,'初期',12,0.85748,0.65326),(207,114,'初期',11501,'较小',11,0.60000,0.23077),(208,121,'少于-300-平米',12502,'快',12,1.00000,0.50199),(209,124,'初期',12502,'快',12,0.60000,0.30918),(210,122,'少于-3000-立方米',123,'大于3次且小于5次',12,0.88280,0.86656),(211,121,'少于-300-平米',122,'少于-3000-立方米',12,0.92796,0.92886),(212,133,'大于3次且小于5次',13502,'迅速',13,1.00000,0.88807),(213,121,'少于-300-平米',12601,'小于5',12,0.81674,0.73335),(214,122,'少于-3000-立方米',12601,'小于5',12,0.84901,0.62890),(215,131,'少于-600-平米',132,'少于-5000-立方米',13,1.00000,0.66298),(216,151,'大于-1000-平米',152,'大于-10000-立方米',15,1.00000,0.91384),(217,124,'初期',12601,'小于5',12,1.00000,0.04623),(218,141,'少于-1000-平米',143,'大于5次',14,1.00000,0.39379),(219,122,'少于-3000-立方米',12502,'快',12,1.00000,0.36602),(220,12502,'快',12601,'小于5',12,0.83336,0.07864),(221,122,'少于-3000-立方米',12602,'小于5',12,1.00000,0.53490),(222,12502,'快',12602,'小于5',12,0.89725,0.52153),(223,11501,'较小',11603,'0',11,1.00000,0.44751),(224,122,'少于-3000-立方米',12603,'0',12,1.00000,0.44751),(225,12502,'快',12603,'0',12,1.00000,0.44751),(226,12601,'小于5',12603,'0',12,1.00000,0.44751),(227,12602,'小于5',12603,'0',12,1.00000,0.44751),(228,122,'少于-3000-立方米',12701,'爆炸',12,1.00000,0.52654),(229,12502,'快',12701,'爆炸',12,1.00000,0.44751),(230,12601,'小于5',12701,'爆炸',12,1.00000,0.68042),(231,12602,'小于5',12701,'爆炸',12,1.00000,0.49121),(232,12603,'0',12701,'爆炸',12,1.00000,0.44751),(233,134,'发展期',13701,'爆炸',13,1.00000,0.61832),(234,141,'少于-1000-平米',14701,'爆炸',14,1.00000,0.44751),(235,143,'大于5次',14701,'爆炸',14,1.00000,0.44751),(236,144,'发展期',14701,'爆炸',14,1.00000,0.56725),(237,153,'大于5次',15701,'爆炸',15,1.00000,0.44751),(238,154,'发展期',15701,'爆炸',15,1.00000,0.52026),(239,131,'少于-600-平米',133,'大于3次且小于5次',13,1.00000,0.53403),(240,111,'少于-100-平米',112,'少于-1000-立方米',11,0.93662,0.63859),(241,112,'少于-1000-立方米',11501,'较小',11,0.80000,0.11531),(242,143,'大于5次',14603,'大于3人以上',14,1.00000,0.44751),(243,144,'发展期',14603,'大于3人以上',14,0.80000,0.38650),(244,112,'少于-1000-立方米',113,'少于3次',11,0.70000,0.28005),(245,111,'少于-100-平米',114,'初期',11,1.00000,0.31034),(246,112,'少于-1000-立方米',114,'初期',11,0.70000,0.20000),(247,113,'少于3次',114,'初期',11,1.00000,0.31034),(248,111,'少于-100-平米',11601,'0',11,1.00000,0.44751),(249,13502,'迅速',13603,'小于3人',13,1.00000,0.76529),(250,151,'大于-1000-平米',153,'大于5次',15,1.00000,0.81742),(251,151,'大于-1000-平米',15501,'严峻',15,1.00000,0.57157),(252,152,'大于-10000-立方米',15501,'严峻',15,1.00000,0.52666),(253,153,'大于5次',15501,'严峻',15,1.00000,0.49782),(254,143,'大于5次',14502,'迅猛',14,1.00000,0.34449),(255,151,'大于-1000-平米',15502,'迅猛',15,1.00000,0.49563),(256,152,'大于-10000-立方米',15502,'迅猛',15,1.00000,0.46652),(257,153,'大于5次',15502,'迅猛',15,1.00000,0.44898),(258,123,'大于3次且小于5次',12501,'小',12,1.00000,0.55601),(259,15602,'20人以上',15603,'大于10人',15,1.00000,0.61832),(260,121,'少于-300-平米',12701,'爆炸',12,1.00000,0.56725),(261,142,'少于-10000-立方米',14701,'爆炸',14,1.00000,0.61832),(262,15602,'20人以上',15701,'爆炸',15,1.00000,0.61832),(263,15603,'大于10人',15701,'爆炸',15,1.00000,0.54807),(264,151,'大于-1000-平米',154,'发展期',15,0.91133,0.34169),(265,142,'少于-10000-立方米',144,'发展期',14,1.00000,0.23720),(266,133,'大于3次且小于5次',13501,'大',13,1.00000,0.44751),(267,134,'发展期',13501,'大',13,1.00000,0.44751),(268,13501,'大',13502,'迅速',13,1.00000,0.13896),(269,131,'少于-600-平米',134,'发展期',13,1.00000,0.37616),(270,122,'少于-3000-立方米',12501,'小',12,1.00000,0.20040),(271,131,'少于-600-平米',13502,'迅速',13,1.00000,0.24468),(272,12501,'小',12601,'小于5',12,1.00000,0.01902),(273,123,'大于3次且小于5次',12602,'小于5',12,1.00000,0.18593),(274,12501,'小',12602,'小于5',12,1.00000,0.18593),(275,131,'少于-600-平米',13603,'小于3人',13,1.00000,0.37082),(276,133,'大于3次且小于5次',13603,'小于3人',13,1.00000,0.37082),(277,134,'发展期',13603,'小于3人',13,1.00000,0.37082),(278,123,'大于3次且小于5次',12701,'爆炸',12,1.00000,0.17275),(279,12501,'小',12701,'爆炸',12,1.00000,0.17275),(280,131,'少于-600-平米',13701,'爆炸',13,1.00000,0.44751),(281,133,'大于3次且小于5次',13701,'爆炸',13,1.00000,0.44751),(282,13502,'迅速',13701,'爆炸',13,1.00000,0.28712),(283,13603,'小于3人',13701,'爆炸',13,1.00000,0.28712),(284,14502,'迅猛',14602,'10人以上',14,1.00000,0.44751),(285,14502,'迅猛',14701,'爆炸',14,1.00000,0.22125),(286,14602,'10人以上',14701,'爆炸',14,1.00000,0.22125),(287,15502,'迅猛',15701,'爆炸',15,1.00000,0.12496),(288,123,'大于3次且小于5次',12502,'快',12,1.00000,0.11602);

#
# Structure for table "t_operator"
#

DROP TABLE IF EXISTS `t_operator`;
CREATE TABLE `t_operator` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL,
  `md` varchar(30) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "t_operator"
#

INSERT INTO `t_operator` VALUES (1,'n','e4uWWtS8oOQatR3nsxNjoQ==','n');

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

#
# Data for table "t_similarity"
#

INSERT INTO `t_similarity` VALUES (32,14,'四级火灾',15,'五级火灾',0.99597,0.96606),(33,13,'三级火灾',14,'四级火灾',0.99981,0.96705),(34,13,'三级火灾',15,'五级火灾',0.99503,0.96635),(35,12,'二级火灾',13,'三级火灾',0.98496,0.97869),(36,11,'一级火灾',12,'二级火灾',0.89754,0.74483),(37,12,'二级火灾',14,'四级火灾',1.00000,0.75658),(38,12,'二级火灾',15,'五级火灾',1.00000,0.71344);

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

INSERT INTO `t_firelevel` VALUES (11,'一级火灾',1.00000,1.00000,111,112,113,114,11501,11502,11601,11602,11603,11701),(12,'二级火灾',1.00000,1.00000,121,122,123,124,12501,12502,12601,12602,12603,12701),(13,'三级火灾',1.00000,1.00000,131,132,133,134,13501,13502,13601,13602,13603,13701),(14,'四级火灾',1.00000,1.00000,141,142,143,144,14501,14502,14601,14602,14603,14701),(15,'五级火灾',1.00000,0.50000,151,152,153,154,15501,15502,15601,15602,15603,15701);

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

INSERT INTO `t_dispatch` VALUES (311,21,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(312,22,11,'25名-消防员','一辆水罐消防车','1.0','0.9'),(313,23,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(314,24,11,'25名-消防员','两辆防化消防车','1.0','0.9'),(315,25,11,'25名-消防员','一辆水罐消防车∩一辆泡沫消防车','1.0','0.9'),(316,26,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(317,27,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(318,28,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(319,29,11,'25名-消防员','两辆水罐消防车','1.0','0.9'),(321,21,12,'80名-消防员','五辆水罐消防车∩一辆抢险救援车∩一辆云梯消防车','1.0','0.9'),(322,22,12,'75名-消防员','四辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(323,23,12,'75名-消防员','六辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(324,24,12,'75名-消防员','四辆防化消防车∩一辆抢险救援车','1.0','0.9'),(325,25,12,'75名-消防员','三辆灌水消防车∩两辆泡沫消防车∩一辆抢险救援车','1.0','0.9'),(326,26,12,'80名-消防员',' 两辆灌水消防车∩ 两辆泡沫消防车∩一辆照明∩ 两辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(327,27,12,'25名-消防员','两辆水罐消防车','1.0','0.9'),(328,28,12,'25名-消防员','两辆水罐消防车','1.0','0.9'),(329,29,12,'25名-消防员','两辆水罐消防车','1.0','0.9'),(331,21,13,'180名-消防员','六辆水罐消防车∩一辆抢险救援车','1.0','0.9'),(332,22,13,'180名-消防员','八辆灌水消防车∩一辆抢险救援车∩一辆登高车','1.0','0.9'),(333,23,13,'220名-消防员','五辆灌水消防车∩三辆泡沫消防车∩ 两辆抢险救援车∩两辆照明车','1.0','0.9'),(334,24,13,'200名-消防员','四辆防化消防车∩四辆泡沫消防车∩一辆抢险救援车','1.0','0.9'),(335,25,13,'200名-消防员','八辆灌水消防车∩一辆抢险救援车','1.0','0.9'),(336,26,13,'220名-消防员',' 六辆防化消防车∩一辆抢险救援车','1.0','0.9'),(337,27,13,'220名-消防员','六辆水罐消防车∩两辆抢险救援车∩一辆高喷车','1.0','0.9'),(338,28,13,'220名-消防员','四辆水罐消防车∩四辆泡沫消防车∩两辆抢险救援车∩一辆照明车','1.0','0.9'),(339,29,13,'220名  -消防员','两辆灌水消防车','1.0','0.9'),(341,21,14,'450名-消防员','十二辆水罐消防车∩两辆抢险救援车','1.0','0.9'),(342,22,14,'550名-消防员','十二辆灌水消防车∩两辆抢险救援车∩两辆登高车','1.0','0.9'),(343,23,14,'550名-消防员','八辆灌水消防车∩四辆泡沫消防车∩两辆抢险救援车∩一辆照明车','1.0','0.9'),(344,24,14,'500名-消防员','六辆防化消防车∩六辆泡沫消防车∩二辆抢险救援车','1.0','0.9'),(345,25,14,'500名-消防员','十二辆灌水消防车∩两辆抢险救援车','1.0','0.9'),(346,26,14,'500名-消防员','十辆防化消防车∩两辆抢险救援车','1.0','0.9'),(347,27,14,'550名-消防员','十辆水罐消防车∩两辆抢险救援车∩两辆高喷车∩一辆云梯车','1.0','0.9'),(348,28,14,'550名-消防员',' 六辆水罐消防车∩六辆泡沫消防车∩六辆抢险救援车∩两辆照明车','1.0','0.9'),(349,29,14,'550名-消防员','两辆灌水消防车','1.0','0.9'),(351,21,15,'1000名-消防员','二十四辆水罐消防车∩两辆抢险救援车','1.0','0.9'),(352,22,15,'1000名-消防员','十六辆灌水消防车∩两辆抢险救援车∩两辆登高车','1.0','0.9'),(353,23,15,'1000名-消防员','十二辆灌水消防车∩四辆泡沫消防车∩ 两辆抢险救援车∩一辆照明车','1.0','0.9'),(354,24,15,'1000名-消防员','九辆防化消防车∩七辆泡沫消防车∩两辆抢险救援车','1.0','0.9'),(355,25,15,'1000名-消防员','十六辆灌水消防车∩两辆抢险救援车','1.0','0.9'),(356,26,15,'1000名-消防员','十六辆防化消防车∩三辆抢险救援车','1.0','0.9'),(357,27,15,'1000名-消防员','十四辆水罐消防车∩两辆抢险救援车∩两辆高喷车∩两辆云梯车','1.0','0.9'),(358,28,15,'1000名-消防员','八辆水罐消防车∩八辆泡沫消防车∩两辆抢险救援车∩两辆照明车','1.0','0.9'),(359,29,15,'1000名-消防员','两辆灌水消防车','1.0','0.9');

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
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

#
# Data for table "templearn"
#

INSERT INTO `templearn` VALUES (182,152,'大于-10000-立方米',153,'大于5次',15,1.00000,0.81492),(183,143,'大于5次',144,'发展期',14,1.00000,0.83192),(184,152,'大于-10000-立方米',154,'发展期',15,0.95524,0.72322),(185,153,'大于5次',154,'发展期',15,1.00000,0.82191),(186,132,'少于-5000-立方米',134,'发展期',13,1.00000,0.91752),(187,141,'少于-1000-平米',144,'发展期',14,1.00000,0.77962),(188,141,'少于-1000-平米',14502,'迅猛',14,1.00000,0.61832),(189,144,'发展期',14502,'迅猛',14,1.00000,0.78461),(190,154,'发展期',15502,'迅猛',15,1.00000,0.80198),(191,141,'少于-1000-平米',14601,'大于10',14,1.00000,0.44751),(192,144,'发展期',14601,'大于10',14,1.00000,0.76415),(193,14502,'迅猛',14601,'大于10',14,1.00000,0.66868),(194,121,'少于-300-平米',12501,'小',12,1.00000,0.61832),(195,111,'少于-100-平米',113,'少于3次',11,0.96355,0.87451),(196,154,'发展期',15501,'严峻',15,1.00000,0.82070),(197,15501,'严峻',15502,'迅猛',15,1.00000,0.51276),(198,132,'少于-5000-立方米',133,'大于3次且小于5次',13,0.91250,0.59016),(199,133,'大于3次且小于5次',134,'发展期',13,1.00000,0.94682),(200,111,'少于-100-平米',11501,'较小',11,0.85714,0.55752),(201,123,'大于3次且小于5次',12601,'小于5',12,1.00000,0.67513),(202,132,'少于-5000-立方米',13502,'迅速',13,1.00000,0.72437),(203,134,'发展期',13502,'迅速',13,1.00000,0.86277),(204,121,'少于-300-平米',123,'大于3次且小于5次',12,0.92031,0.95362),(205,121,'少于-300-平米',124,'初期',12,1.00000,0.83078),(206,123,'大于3次且小于5次',124,'初期',12,0.85748,0.65326),(207,114,'初期',11501,'较小',11,0.60000,0.23077),(208,121,'少于-300-平米',12502,'快',12,1.00000,0.50199),(209,124,'初期',12502,'快',12,0.60000,0.30918),(210,122,'少于-3000-立方米',123,'大于3次且小于5次',12,0.88280,0.86656),(211,121,'少于-300-平米',122,'少于-3000-立方米',12,0.92796,0.92886),(212,133,'大于3次且小于5次',13502,'迅速',13,1.00000,0.88807),(213,121,'少于-300-平米',12601,'小于5',12,0.81674,0.73335),(214,122,'少于-3000-立方米',12601,'小于5',12,0.84901,0.62890),(215,131,'少于-600-平米',132,'少于-5000-立方米',13,1.00000,0.66298),(216,151,'大于-1000-平米',152,'大于-10000-立方米',15,1.00000,0.91384),(217,124,'初期',12601,'小于5',12,1.00000,0.04623),(218,141,'少于-1000-平米',143,'大于5次',14,1.00000,0.39379),(219,122,'少于-3000-立方米',12502,'快',12,1.00000,0.36602),(220,12502,'快',12601,'小于5',12,0.83336,0.07864),(221,122,'少于-3000-立方米',12602,'小于5',12,1.00000,0.53490),(222,12502,'快',12602,'小于5',12,0.89725,0.52153),(223,11501,'较小',11603,'0',11,1.00000,0.44751),(224,122,'少于-3000-立方米',12603,'0',12,1.00000,0.44751),(225,12502,'快',12603,'0',12,1.00000,0.44751),(226,12601,'小于5',12603,'0',12,1.00000,0.44751),(227,12602,'小于5',12603,'0',12,1.00000,0.44751),(228,122,'少于-3000-立方米',12701,'爆炸',12,1.00000,0.52654),(229,12502,'快',12701,'爆炸',12,1.00000,0.44751),(230,12601,'小于5',12701,'爆炸',12,1.00000,0.68042),(231,12602,'小于5',12701,'爆炸',12,1.00000,0.49121),(232,12603,'0',12701,'爆炸',12,1.00000,0.44751),(233,134,'发展期',13701,'爆炸',13,1.00000,0.61832),(234,141,'少于-1000-平米',14701,'爆炸',14,1.00000,0.44751),(235,143,'大于5次',14701,'爆炸',14,1.00000,0.44751),(236,144,'发展期',14701,'爆炸',14,1.00000,0.56725),(237,153,'大于5次',15701,'爆炸',15,1.00000,0.44751),(238,154,'发展期',15701,'爆炸',15,1.00000,0.52026),(239,131,'少于-600-平米',133,'大于3次且小于5次',13,1.00000,0.53403),(240,111,'少于-100-平米',112,'少于-1000-立方米',11,0.93662,0.63859),(241,112,'少于-1000-立方米',11501,'较小',11,0.80000,0.11531),(242,143,'大于5次',14603,'大于3人以上',14,1.00000,0.44751),(243,144,'发展期',14603,'大于3人以上',14,0.80000,0.38650),(244,112,'少于-1000-立方米',113,'少于3次',11,0.70000,0.28005),(245,111,'少于-100-平米',114,'初期',11,1.00000,0.31034),(246,112,'少于-1000-立方米',114,'初期',11,0.70000,0.20000),(247,113,'少于3次',114,'初期',11,1.00000,0.31034),(248,111,'少于-100-平米',11601,'0',11,1.00000,0.44751),(249,13502,'迅速',13603,'小于3人',13,1.00000,0.76529),(250,151,'大于-1000-平米',153,'大于5次',15,1.00000,0.81742),(251,151,'大于-1000-平米',15501,'严峻',15,1.00000,0.57157),(252,152,'大于-10000-立方米',15501,'严峻',15,1.00000,0.52666),(253,153,'大于5次',15501,'严峻',15,1.00000,0.49782),(254,143,'大于5次',14502,'迅猛',14,1.00000,0.34449),(255,151,'大于-1000-平米',15502,'迅猛',15,1.00000,0.49563),(256,152,'大于-10000-立方米',15502,'迅猛',15,1.00000,0.46652),(257,153,'大于5次',15502,'迅猛',15,1.00000,0.44898),(258,123,'大于3次且小于5次',12501,'小',12,1.00000,0.55601),(259,15602,'20人以上',15603,'大于10人',15,1.00000,0.61832),(260,121,'少于-300-平米',12701,'爆炸',12,1.00000,0.56725),(261,142,'少于-10000-立方米',14701,'爆炸',14,1.00000,0.61832),(262,15602,'20人以上',15701,'爆炸',15,1.00000,0.61832),(263,15603,'大于10人',15701,'爆炸',15,1.00000,0.54807),(264,151,'大于-1000-平米',154,'发展期',15,0.91133,0.34169),(265,142,'少于-10000-立方米',144,'发展期',14,1.00000,0.23720),(266,133,'大于3次且小于5次',13501,'大',13,1.00000,0.44751),(267,134,'发展期',13501,'大',13,1.00000,0.44751),(268,13501,'大',13502,'迅速',13,1.00000,0.13896),(269,131,'少于-600-平米',134,'发展期',13,1.00000,0.37616),(270,122,'少于-3000-立方米',12501,'小',12,1.00000,0.20040),(271,131,'少于-600-平米',13502,'迅速',13,1.00000,0.24468),(272,12501,'小',12601,'小于5',12,1.00000,0.01902),(273,123,'大于3次且小于5次',12602,'小于5',12,1.00000,0.18593),(274,12501,'小',12602,'小于5',12,1.00000,0.18593),(275,131,'少于-600-平米',13603,'小于3人',13,1.00000,0.37082),(276,133,'大于3次且小于5次',13603,'小于3人',13,1.00000,0.37082),(277,134,'发展期',13603,'小于3人',13,1.00000,0.37082),(278,123,'大于3次且小于5次',12701,'爆炸',12,1.00000,0.17275),(279,12501,'小',12701,'爆炸',12,1.00000,0.17275),(280,131,'少于-600-平米',13701,'爆炸',13,1.00000,0.44751),(281,133,'大于3次且小于5次',13701,'爆炸',13,1.00000,0.44751),(282,13502,'迅速',13701,'爆炸',13,1.00000,0.28712),(283,13603,'小于3人',13701,'爆炸',13,1.00000,0.28712),(284,14502,'迅猛',14602,'10人以上',14,1.00000,0.44751),(285,14502,'迅猛',14701,'爆炸',14,1.00000,0.22125),(286,14602,'10人以上',14701,'爆炸',14,1.00000,0.22125),(287,15502,'迅猛',15701,'爆炸',15,1.00000,0.12496),(288,123,'大于3次且小于5次',12502,'快',12,1.00000,0.11602);

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

#
# Data for table "tempsimilarity"
#

INSERT INTO `tempsimilarity` VALUES (32,14,'四级火灾',15,'五级火灾',0.99595,0.96589),(33,13,'三级火灾',14,'四级火灾',0.99981,0.96672),(34,13,'三级火灾',15,'五级火灾',0.99500,0.96613),(35,12,'二级火灾',13,'三级火灾',0.98469,0.97832),(36,11,'一级火灾',12,'二级火灾',0.89754,0.74483),(37,12,'二级火灾',14,'四级火灾',1.00000,0.72278),(38,12,'二级火灾',15,'五级火灾',1.00000,0.68897);

#
# Procedure "clearConclusion"
#

DROP PROCEDURE IF EXISTS `clearConclusion`;
CREATE PROCEDURE `clearConclusion`()
BEGIN
	#Routine body goes here...
	 truncate table mconclusion;
	 truncate table t_input;
	 truncate table templearn;
	 truncate table tempsimilarity;
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

 
	

END;
