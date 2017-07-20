-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Gegenereerd op: 20 jul 2017 om 21:39
-- Serverversie: 10.1.19-MariaDB
-- PHP-versie: 7.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rowcoaching`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `trackers`
--

CREATE TABLE `trackers` (
  `id` int(11) NOT NULL,
  `crew_id` int(11) DEFAULT NULL,
  `last_message` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `heading` double DEFAULT NULL,
  `roll_angle` double DEFAULT NULL,
  `pitch_angle` double DEFAULT NULL,
  `velocity` double DEFAULT NULL,
  `north` double DEFAULT NULL,
  `east` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `trackers`
--

INSERT INTO `trackers` (`id`, `crew_id`, `last_message`, `created`, `latitude`, `longitude`, `heading`, `roll_angle`, `pitch_angle`, `velocity`, `north`, `east`) VALUES
(1, NULL, NULL, '2017-07-03 12:11:36', 52.108036, 4.240228, 308, NULL, NULL, 5, 5773748.1278666, 585038.55009507),
(2, NULL, NULL, '2017-07-03 12:11:36', 52.108174, 4.240378, 234, NULL, NULL, 7, 5773873.2062148, 584884.23541583),
(3, NULL, NULL, '2017-07-03 12:11:36', 52.108991, 4.238468, 67, NULL, NULL, 6, 5773769.001214, 584922.34576499),
(4, NULL, '0000-00-00 00:00:00', '2017-07-03 12:11:36', 52.108036, 4.240228, 25804, 0, 0, 5, 5773779.3950746, 584929.15436072),
(5, NULL, '0000-00-00 00:00:00', '2017-07-03 12:11:36', 52.108174, 4.240378, 25942, 0, 0, 5, 5773790.727577, 584951.42275642),
(6, NULL, '0000-00-00 00:00:00', '2017-07-03 12:11:36', 52.108991, 4.238468, 25913, 0, 0, 6, 5773873.1780225, 584816.03125585),
(7, NULL, NULL, NULL, 52.106382, 4.2505, NULL, NULL, NULL, NULL, 5773608.01, 585642.2),
(8, NULL, NULL, NULL, 52.106657, 4.253492, NULL, NULL, NULL, NULL, 5773642.13, 585846.57),
(9, NULL, NULL, NULL, 52.106107, 4.253492, NULL, NULL, NULL, NULL, 585847.63, 5773580.96),
(10, NULL, NULL, NULL, 52.106757, 4.252767, NULL, NULL, NULL, NULL, 5773652.39, 585796.73),
(11, NULL, NULL, NULL, 52.106007, 4.252767, NULL, NULL, NULL, NULL, 5773568.98, 585798.17);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `trackers`
--
ALTER TABLE `trackers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `trackers`
--
ALTER TABLE `trackers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
