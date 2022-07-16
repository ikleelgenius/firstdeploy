-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2022 at 01:13 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `labcontroll`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `USERNAME` varchar(50) NOT NULL,
  `AD_NO` varchar(25) NOT NULL,
  `PASSWORD` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`USERNAME`, `AD_NO`, `PASSWORD`) VALUES
('MUHAMMEDIKLEEL', '123', '$2b$10$FdvGaAtUjkxx3AsBDDRzJOtAbuXADiAOaueL421JcimqAaE4rDQpe');

-- --------------------------------------------------------

--
-- Table structure for table `current_users`
--

CREATE TABLE `current_users` (
  `PC_NUMBER` varchar(50) NOT NULL,
  `AD_NO` varchar(50) DEFAULT NULL,
  `START_TIME` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `current_users`
--

INSERT INTO `current_users` (`PC_NUMBER`, `AD_NO`, `START_TIME`) VALUES
('ALBAYAN-PC1', '124', '04:17 PM'),
('ALBAYAN-PC2', NULL, NULL),
('ALBAYAN-PC3', NULL, NULL),
('ALBAYAN-PC4', NULL, NULL),
('ALBAYAN-PC5', NULL, NULL),
('ALBAYAN-PC6', NULL, NULL),
('ALBAYAN-PC7', NULL, NULL),
('ALBAYAN-PC8', NULL, NULL),
('ALBAYAN-PC9', NULL, NULL),
('ALBAYAN-PC10', NULL, NULL),
('ALBAYAN-PC11', NULL, NULL),
('ALBAYAN-PC12', NULL, NULL),
('ALBAYAN-PC13', NULL, NULL),
('ALBAYAN-PC14', NULL, NULL),
('ALBAYAN-PC15', NULL, NULL),
('ALBAYAN-PC16', NULL, NULL),
('ALBAYAN-PC17', NULL, NULL),
('ALBAYAN-PC18', NULL, NULL),
('ALBAYAN-PC19', NULL, NULL),
('ALBAYAN-PC20', NULL, NULL),
('ALBAYAN-PC21', NULL, NULL),
('ALBAYAN-PC22', NULL, NULL),
('ALBAYAN-PC23', NULL, NULL),
('ALBAYAN-PC24', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `AD_NO` varchar(20) NOT NULL,
  `NAME` varchar(200) NOT NULL,
  `PC_NO` varchar(50) NOT NULL,
  `START_TIME` varchar(50) NOT NULL,
  `END_TIME` varchar(50) NOT NULL,
  `DATE` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`AD_NO`, `NAME`, `PC_NO`, `START_TIME`, `END_TIME`, `DATE`) VALUES
('123', 'userone', 'ALBAYAN-PC4', '11:45 AM', '03:35 PM', 'Fri, Jul 15 2022'),
('123', 'userone', 'ALBAYAN-PC1', '03:38 PM', '03:48 PM', 'Fri, Jul 15 2022'),
('124', 'shaikhahmedmuhammedkoyalsafeeh', 'ALBAYAN-PC2', '03:47 PM', '03:48 PM', 'Fri, Jul 15 2022'),
('124', 'shaikhahmedmuhammedkoyalsafeeh', 'ALBAYAN-PC18', '03:47 PM', '03:48 PM', 'Fri, Jul 15 2022');

-- --------------------------------------------------------

--
-- Table structure for table `masterconfig`
--

CREATE TABLE `masterconfig` (
  `USERNAME` varchar(100) NOT NULL,
  `PASSWORD` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `masterconfig`
--

INSERT INTO `masterconfig` (`USERNAME`, `PASSWORD`) VALUES
('MUHAMMEDIKLEEL', '$2b$10$1spvMdWhZ8TB6HFXxp091O5uaGDAp0mNQHOLTSHfkbnmOgO4O5e2u');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `AD_NO` varchar(50) NOT NULL,
  `USERNAME` varchar(200) NOT NULL,
  `EMAIL` varchar(300) NOT NULL,
  `BATCH` varchar(50) NOT NULL,
  `PASSWORD` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`AD_NO`, `USERNAME`, `EMAIL`, `BATCH`, `PASSWORD`) VALUES
('123', 'userone', 'MUHAMMEDIKLEEL@GMAIL.COM', 'ITHIFAQ', '$2b$10$hGiQkIkvxVvLJklAoDVojuKNpX9KoK010xPKydV4e7XVnFe7fEVnK'),
('124', 'shaikhahmedmuhammedkoyalsafeeh', 'ikleelmuhammed@gmail.com', 'AL AYIN', '$2b$10$yPYY5tiFx1hr59MKsden7OCu9WhH/BhCUVhDhiYKZzojioAggykXm');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `current_users`
--
ALTER TABLE `current_users`
  ADD KEY `AD_NO` (`AD_NO`),
  ADD KEY `AD_NO_2` (`AD_NO`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD KEY `AD_NO` (`AD_NO`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`AD_NO`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `current_users`
--
ALTER TABLE `current_users`
  ADD CONSTRAINT `current_users_ibfk_1` FOREIGN KEY (`AD_NO`) REFERENCES `users` (`AD_NO`);

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`AD_NO`) REFERENCES `users` (`AD_NO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
