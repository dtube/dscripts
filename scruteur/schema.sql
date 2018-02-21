-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.30-MariaDB - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             9.4.0.5174
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for dtube
CREATE DATABASE IF NOT EXISTS `dtube` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `dtube`;

-- Dumping structure for table dtube.cbr
CREATE TABLE IF NOT EXISTS `cbr` (
  `id` int(11) NOT NULL,
  `benefactor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permlink` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reward` float DEFAULT NULL,
  `stamp` datetime DEFAULT NULL,
  `rewardcur` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rewardsp` float DEFAULT NULL,
  `videohash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snaphash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spritehash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video480hash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video720hash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video1080hash` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidsearch` int(11) NOT NULL DEFAULT '0',
  `paidstorage` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
