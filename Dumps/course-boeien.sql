-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Gegenereerd op: 20 jul 2017 om 21:40
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
-- Tabelstructuur voor tabel `bouys`
--

CREATE TABLE `bouys` (
  `id` int(11) NOT NULL,
  `tracker_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `combination` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `prev` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `bouys`
--

INSERT INTO `bouys` (`id`, `tracker_id`, `type`, `combination`, `name`, `prev`, `order`) VALUES
(1, 9, 2, 0, '1', 3, 1),
(3, 7, 2, 0, '1', 1, 2),
(4, 10, 2, 0, '2A', 3, 3),
(5, 11, 2, 0, '2B', 3, 4),
(6, 8, 2, 0, '5', 3, 5);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `bouys`
--
ALTER TABLE `bouys`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `bouys`
--
ALTER TABLE `bouys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
