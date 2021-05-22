-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2021 at 12:24 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ibook_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_table`
--

CREATE TABLE IF NOT EXISTS `admin_table` (
  `ADMIN_ID` int(100) NOT NULL AUTO_INCREMENT,
  `ADMIN_NAME` varchar(100) NOT NULL,
  `ADMIN_EMAIL` varchar(100) NOT NULL,
  `ADMIN_PASS` varchar(100) NOT NULL,
  `ADMIN_ICON` mediumtext NOT NULL,
  `ADMIN_CONTACT` varchar(255) NOT NULL,
  `ADMIN_ADDRESS` varchar(40) NOT NULL,
  `ADMIN_CREATED_DATE` datetime(6) NOT NULL,
  `ADMIN_MODIFIED_DATE` datetime(6) NOT NULL,
  PRIMARY KEY (`ADMIN_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `admin_table`
--

INSERT INTO `admin_table` (`ADMIN_ID`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASS`, `ADMIN_ICON`, `ADMIN_CONTACT`, `ADMIN_ADDRESS`, `ADMIN_CREATED_DATE`, `ADMIN_MODIFIED_DATE`) VALUES
(1, 'IBOOKADMIN', 'ibookadmin@gmail.com', '123123', 'DORAEMON.jpg', '09302955637', '221B Baker St.', '2020-11-03 10:33:35.170257', '2021-01-21 14:17:00.646000');

-- --------------------------------------------------------

--
-- Table structure for table `books_table`
--

CREATE TABLE IF NOT EXISTS `books_table` (
  `BOOK_ID` int(100) NOT NULL AUTO_INCREMENT,
  `BOOK_TITLE` varchar(100) NOT NULL,
  `BOOK_AUTHOR` varchar(100) NOT NULL,
  `BOOK_COVER` varchar(10000) NOT NULL,
  `BOOK_FILE` longblob NOT NULL,
  `BOOK_PRICE` int(50) NOT NULL,
  `BOOK_DESC` varchar(1000) NOT NULL,
  `BOOK_CATEGORY` varchar(100) NOT NULL,
  `BOOK_CREATED_DATE` datetime(6) NOT NULL,
  `BOOK_MODIFIED_DATE` datetime(6) NOT NULL,
  PRIMARY KEY (`BOOK_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=48 ;

--
-- Dumping data for table `books_table`
--

INSERT INTO `books_table` (`BOOK_ID`, `BOOK_TITLE`, `BOOK_AUTHOR`, `BOOK_COVER`, `BOOK_FILE`, `BOOK_PRICE`, `BOOK_DESC`, `BOOK_CATEGORY`, `BOOK_CREATED_DATE`, `BOOK_MODIFIED_DATE`) VALUES
(1, 'Life of PiIIIII', 'Yann MartelIIII', 'The Kite Runner.jpg', '', 350, 'After deciding to sell their zoo in India and move to Canada, Santosh and Gita Patel board a freighter with their sons and a few remaining animals. Tragedy strikes when a terrible storm sinks the ship, leaving the Patels'' teenage son, Pi (Suraj Sharma), as the only human survivor. However, Pi is not alone; a fearsome Bengal tiger has also found refuge aboard the lifeboat. As days turn into weeks and weeks drag into months, Pi and the tiger must learn to trust each other if both are to survive.', 'Action and Adventure', '2020-12-05 20:10:26.166000', '2021-01-21 14:06:45.709000'),
(2, 'The Bourne Identity', 'Robert Ludlum', 'The Bourne Identity.jpg', '', 300, 'The Bourne Identity is a 1980 spy fiction thriller by Robert Ludlum that tells the story of Jason Bourne, a man with remarkable survival abilities who has retrograde amnesia, and must seek to discover his true identity.', 'Action and Adventure', '2020-12-05 20:17:29.466000', '2020-12-05 20:17:29.466000'),
(3, 'Matilda', 'Roald Dahl', 'Matilda.jpg', '', 250, 'This is the story of a sweet bright little girl named Matilda, who is a child of wondrous intelligence. But unfortunately she is different from the rest of her family. Ignored at home all the time, Matilda escapes into a world of reading, exercising her mind so much she develops telekinetic powers.\r\n', 'Childrens Fiction', '2020-12-05 20:22:33.071000', '2020-12-05 20:22:33.071000'),
(4, 'Winnie-the-Pooh', 'A. A. Milne', 'Winnie the Pooh.png', '', 280, 'It is the first volume of stories about Winnie-the-Pooh, written by A. A. Milne and illustrated by E. H. Shepard. The book focuses on the adventures of a teddy bear called Winnie-the-Pooh and his friends Piglet, a small toy pig; Eeyore, a toy donkey; Owl, a live owl; and Rabbit, a live rabbit.', 'Childrens Fiction', '2020-12-05 20:28:42.407000', '2020-12-05 20:28:42.407000'),
(5, 'Captain Underpants', 'Dav Pilkey', 'Captain Underpants.jpg', '', 300, 'The adventures of Captain Underpants / the first epic novel by Dav Pilkey ; with color by Jose Garibaldi. When George and Harold hypnotize their principal into thinking that he is the superhero Captain Underpants, he leads them to the lair of the nefarious Dr. Diaper, where they must defeat his evil robot henchmen.', 'Comic and Graphic Novel', '2020-12-05 20:36:31.208000', '2020-12-05 20:36:31.208000'),
(6, 'Batman: The Killing Joke', 'Allan Moore', 'Batman - The Killing Joke.jpg', '', 350, 'When the Joker escapes prison, Batman sets out to find him. Meanwhile, he kidnaps Commissioner Gordon, after paralyzing his daughter, in a bid to drive him insane.', 'Comic and Graphic Novel', '2020-12-05 20:39:10.540000', '2020-12-05 20:39:10.540000'),
(7, 'Macbeth', 'Shakespeare William', 'Macbeth.jpg', '', 350, 'Three witches tell the Scottish general Macbeth that he will be King of Scotland. Encouraged by his wife, Macbeth kills the king, becomes the new king, and kills more people out of paranoia. Civil war erupts to overthrow Macbeth, resulting in more death.', 'Drama', '2020-12-05 20:44:01.872000', '2020-12-05 20:44:01.872000'),
(8, 'The Kite Runner', 'Khaled Hosseini', 'The Kite Runner.jpg', '', 400, 'The Kite Runner is the story of Amir, a Sunni Muslim, who struggles to find his place in the world because of the aftereffects and fallout from a series of traumatic childhood events.', 'Drama', '2020-12-05 20:46:45.100000', '2020-12-05 20:46:45.100000'),
(9, 'Little Red Riding Hood', 'Charles Perrault', 'Little Red Riding Hood.jpg', '', 200, 'One beautiful autumn afternoon little Red Riding Hood is sent by her mother to take some goodies to Grandma. She repairs on her way, but grows tired and sits to rest under a tree. She stops and dreams the well-known story: How a wolf in the guise of a friendly dog came and asked her where she was going.', 'Fairy Tale', '2020-12-05 20:57:18.548000', '2020-12-05 20:57:18.548000'),
(10, 'Rapunzel', 'The Brothers Grimm', 'Rapunzel.jpg', '', 150, 'Rapunzel is a fairy tale about the love between a young prince and a girl with long, blond hair that conquered all of the Witch''s evil intentions. They were persistent in their intentions on being happy together, and the Witch was their biggest obstacle. Years passed by, and their love grew stronger.', 'Fairy Tale', '2020-12-05 20:59:07.209000', '2020-12-05 20:59:07.209000'),
(11, 'A Game of Thrones', 'George R. R. Martin', 'A Game of Thrones.jpg', '', 450, 'The principal story chronicles the power struggle for the Iron Throne among the great Houses of Westeros following the death of King Robert in A Game of Thrones. Robert''s heir apparent, the 13-year-old Joffrey, is immediately proclaimed king through the machinations of his mother, Queen Cersei Lannister.', 'Fantasy and Sci-Fi', '2020-12-05 21:03:16.040000', '2020-12-05 21:03:16.040000'),
(12, 'The Martian', 'Andy Weir', 'The Martian.jpg', '', 500, 'When astronauts blast off from the planet Mars, they leave behind Mark Watney (Matt Damon), presumed dead after a fierce storm. With only a meager amount of supplies, the stranded visitor must utilize his wits and spirit to find a way to survive on the hostile planet. Meanwhile, back on Earth, members of NASA and a team of international scientists work tirelessly to bring him home, while his crew mates hatch their own plan for a daring rescue mission.', 'Fantasy and Sci-Fi', '2020-12-05 21:05:19.428000', '2020-12-05 21:05:42.066000'),
(13, 'IT', 'Stephen King', 'IT.jpg', '', 450, 'It is a 1986 horror novel by American author Stephen King. It was his 22nd book, and his 17th novel written under his own name. The story follows the experiences of seven children as they are terrorized by an evil entity that exploits the fears of its victims to disguise itself while hunting its prey.', 'Horror and Thriller', '2020-12-05 21:07:42.139000', '2020-12-05 21:07:42.139000'),
(14, 'The Guest List', 'Lucy Foley', 'The Guest List.jpg', '', 400, 'When a storm traps the wedding party on the island, tensions ratchet up until someone winds up dead. With as much of an eye for high fashion and high-stakes secrets as it has for traditional crime novel structure and inspiration, THE GUEST LIST is a perfect reminder of why the classics never go out of style.', 'Horror and Thriller', '2020-12-05 21:11:12.175000', '2020-12-05 21:11:12.175000'),
(15, 'Gone Girl', 'Gillian Flynn', 'Gone Girl.jpg', '', 500, 'Nick Dunne is the main character of Gone Girl, a popular book written by Gillian Flynn. On the day of his fifth wedding anniversary, Nick Dunne returns to his home in North Carthage, Missouri only to find his wife Amy missing. Presents have already been wrapped and reservations have already been made.', 'Mystery', '2020-12-05 21:14:46.795000', '2020-12-05 21:14:46.795000'),
(16, 'Murder on the Orient Express', 'Agatha Christie', 'Murder on the Orient Express.jpg', '', 500, 'When a murder occurs on the train on which he''s travelling, celebrated detective Hercule Poirot is recruited to solve the case. Hercule Poirot, the best detective in the world, decides to travel on the Orient Express. The train accidentally gets stopped because of a small avalanche.', 'Mystery', '2020-12-05 21:18:14.897000', '2020-12-05 21:18:14.897000'),
(17, 'Eleanor and Park', 'Rainbow Rowell', 'Eleanor and Park.jpg', '', 350, 'Eleanor, a chubby 16-year-old girl with curly red hair, and Park, a half-Korean, 16-year-old boy, meet on a school bus on Eleanor''s first day at the school and gradually connect through comic books and mix tapes of ''80s music, sparking a love story. Park grows to love Eleanor and Eleanor learns to understand Park', 'Romance', '2020-12-05 21:22:21.401000', '2020-12-05 21:22:21.401000'),
(18, 'Me Before You', 'Jojo Moyes', 'Me Before You.jpg', '', 450, 'Young and quirky Louisa "Lou" Clark (Emilia Clarke) moves from one job to the next to help her family make ends meet. Her cheerful attitude is put to the test when she becomes a caregiver for Will Traynor (Sam Claflin), a wealthy young banker left paralyzed from an accident two years earlier. Will''s cynical outlook starts to change when Louisa shows him that life is worth living. As their bond deepens, their lives and hearts change in ways neither one could have imagined.', 'Romance', '2020-12-05 21:23:58.296000', '2020-12-05 21:23:58.296000'),
(19, 'All the bright places', 'Jennifer Niven', 'All the Bright Place.jpg', '', 400, 'After meeting each other, two people struggle with the emotional and physical scars of their past. They discover that even the smallest moments can mean something.', 'Young Adult', '2020-12-05 21:46:57.707000', '2020-12-05 21:46:57.707000'),
(20, 'Looking for Alaska', 'John Green', 'Looking for Alaska.jpg', '', 450, ' Miles Halter, a teenage boy obsessed with last words, leaves his normal high school in Florida to attend Culver Creek Preparatory High School in Alabama for his junior year. Miles'' reasoning for such a change is quoted by François Rabelais''s last words: "I go to seek a Great Perhaps."', 'Young Adult', '2020-12-05 21:48:44.161000', '2020-12-05 21:48:44.161000'),
(21, 'MockingjayYYYYYhh', 'Suzanne Collinssssss', 'tup.png', '', 500, 'The final book in the ground-breaking HUNGER GAMES trilogy, this new foiled edition of MOCKINGJAY is available. Against all odds, Katniss Everdeen has survived The Hunger Games twice. But now that she''s made it out of the bloody arena alive, she''s still not safe. The Capitol is angry. The Capitol wants revenge. Who do they think should pay for the unrest?', 'Action and Adventure', '2020-12-05 21:56:06.937000', '2021-01-20 23:51:01.375000'),
(22, 'Bloodline', 'Jess Lourey', '16. Bloodline.jpg', '', 400, 'In a tale inspired by real events, pregnant journalist Joan Harken is cautiously excited to follow her fiancé back to his Minnesota hometown. After spending a childhood on the move and chasing the screams and swirls of news-rich city life, she’s eager to settle down. Lilydale’s motto, “Come Home Forever,” couldn’t be more inviting. And yet, something is off in the picture-perfect village. The friendliness borders on intrusive. Joan can’t shake the feeling that every move she makes is being tracked. An archaic organization still seems to hold the town in thrall. So does the sinister secret of a little boy who vanished decades ago. And unless Joan is imagining things, a frighteningly familiar figure from her past is on watch in the shadows.', 'Horror and Thriller', '2020-12-06 00:50:31.389000', '2020-12-06 00:50:31.389000'),
(23, 'To All the Boys I''ve Loved Before', 'Jenny Han', 'To All the Boys I''ve Loved Before.jpg', '', 400, 'To All the Boys I''ve Loved before tells the story of Lara Jean Covey and her family, as they adjust to life after her older sister Margot moves to Scotland to attend college. Lara Jean has to cope with the fallout from her private love letters being mailed to all of her crushes without her sister''s advice to guide her.', 'Young Adult', '2020-12-06 14:03:50.201000', '2020-12-06 14:03:50.201000'),
(24, 'Boyfriend Material', 'Alexis Hall', 'Boyfriend Material.jpg', '', 399, 'Luc''s back in the public eye, and one compromising photo is enough to ruin everything. Luc has to find a nice, normal relationship...and Oliver Blackwood is as nice and normal as they come. He''s a barrister, an ethical vegetarian, and he''s never inspired a moment of scandal in his life. In other words: perfect boyfriend material. Unfortunately, apart from being gay, single, and really, really in need of a date for a big event, Luc and Oliver have nothing in common. ', 'Romance', '2020-12-06 14:05:11.181000', '2020-12-06 14:05:11.181000'),
(25, 'The Hate U Give', 'Angie Thomas', 'The Hate u give.jpg', '', 325, 'Sixteen-year-old Starr Carter moves between two worlds: the poor neighborhood where she lives and the fancy suburban prep school she attends. The uneasy balance between these worlds is shattered when Starr witnesses the fatal shooting of her childhood best friend Khalil at the hands of a police officer. Khalil was unarmed.', 'Young Adult', '2020-12-06 14:12:35.944000', '2020-12-06 14:12:35.944000'),
(26, 'Holding up the Universe', 'Jennifer Niven', 'Holding up the Universe.jpg', '', 400, 'The book is narrated in turns by Libby, famous for once being ''America''s Fattest Teen'' and starting high school after years of being home schooled, and Jack, who seems to be one of the popular kids but secretly suffers from Prospagnosia - the inability to recognise the faces of familiar people even those in this own.', 'Young Adult', '2020-12-06 14:15:00.761000', '2020-12-06 14:15:00.761000'),
(27, 'Pride', 'Jane Austen', 'Pride and Prejudice.jpg', '', 399, 'Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.', 'Romance', '2020-12-06 14:23:18.050000', '2020-12-10 13:46:29.031000'),
(28, 'The Adventures of Pinocchio', 'Carlo Collodi', 'TheAdventuresOfPinocchio.jpg', '', 200, 'A wooden puppet is crafted out of a magical piece of wood by Geppetto, a humble woodworker. To Geppetto’s surprise, the puppet comes to life. Thus begins the adventures of this magical puppet, Pinocchio. Geppetto takes the role of father to Pinocchio, and tries to stress the importance of his education. Pinocchio, however, is drawn into many mischievous adventures by his peers and others.', 'Childrens Fiction', '2021-01-12 18:12:17.967000', '2021-01-12 18:13:59.691000'),
(29, 'King Solomon’s Mines', 'Henry Rider Haggard', 'KingSolomonsMines.jpg', '', 400, 'It tells the tale of Allan Quatermain, an adventurer and hunter, who is approached by Sir Henry Curtis and Captain Good to help them find Curtis’ lost brother, who went missing while trying to find the fabled King Solomon’s Mines.', 'Action and Adventure', '2021-01-12 18:22:10.531000', '2021-01-12 18:23:17.912000'),
(30, 'The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'TheAdventuresOfSherlockHolmes.jpg', '', 400, 'The Adventures of Sherlock Holmes was the first collection of Sherlock Holmes short stories Conan Doyle published in book form. Some of the more well-known stories in this collection are “A Scandal in Bohemia,” in which Holmes comes up against a worthy opponent in the form of Irene Adler, whom Holmes forever after admiringly refers to as the woman; “The Redheaded League,” involving a bizarre scheme offering a well-paid sinecure to redheaded men; and “The Speckled Band,” in which Holmes and Watson save a young woman from a terrible death.', 'Mystery', '2021-01-12 21:37:34.807000', '2021-01-12 21:37:34.807000'),
(31, 'The Black Star Passes', 'John W. Campbell', 'TheBlackStarPasses.jpg', '', 400, 'In the year 2126, scientists Arcot and Morey chase a sky pirate—and invent the technology to travel through space. In the second story, the heroes travel to Venus and make first contact with an alien species. Finally, they must defend the solar system from invaders whose own star has long since gone dark.', 'Fantasy and Sci-Fi', '2021-01-12 21:40:20.017000', '2021-01-12 21:40:20.017000'),
(32, 'The Importance of Being Earnest', 'Oscar Wilde', 'TheImportanceOfBeingEarnest.jpg', '', 400, 'The Importance of Being Earnest is Oscar Wilde’s most popular play today, enduring thanks to its easy humor, witty dialog, and clever satire. It was also one of his more successful plays, despite its first run being prematurely ended after only 86 performances. The main characters pretend to be other people in order to escape social obligations, with the resulting confusion of identities driving the plot and the humor behind it.', 'Comic and Graphic Novel', '2021-01-12 21:42:11.449000', '2021-01-12 21:58:36.503000'),
(33, 'The Beetle', 'Richard Marsh', 'TheBeetle.jpg', '', 450, 'The Beetle was published in 1897, the same year as Dracula—and outsold it six to one that year. Like Dracula, the novel is steeped in the evil mysteries of an ancient horror: in this case, a mysterious ancient Egyptian creature bent on revenge.\r\nThe story is told through the sequential points of view of a group of middle-class Victorians who find themselves enmeshed in the creature’s plot. The creature, in the guise of an Egyptian man, appears in London seeking revenge against a popular member of Parliament. They soon find out that it can shape shift into other things, including women; that it can control minds and use hypnosis; and that it won’t stop at anything to get the revenge it seeks. The heroes are soon caught in a whirlwind of chase scenes, underground laboratories, secret cults, and more as they race to foil the creature.', 'Horror and Thriller', '2021-01-12 21:42:57.758000', '2021-01-12 21:42:57.758000'),
(34, 'Phantom of The Opera', 'Gaston Leroux', 'ThePhantomOfTheOpera.jpg', '', 500, 'Is the Opera truly host to so many supernatural phenomena, or could it be that the Angel and the Opera Ghost are in fact one and the same? And could it be also that he is far less angel than demon? And if so, will Christine realize her peril before it is too late?', 'Mystery', '2021-01-12 21:44:06.271000', '2021-01-12 21:44:06.271000'),
(35, 'Anne of Green Gables', 'L. M. Montgomery', 'AnneofGreenGables.jpg', '', 300, 'Anne of Green Gables established the career of Canadian writer Lucy Maud Montgomery. When Matthew Cuthbert sends away for an orphan boy to help on his farm, he is surprised to instead meet the captivatingly imaginative Anne Shirley. What ensues is one of the most enduringly popular coming-of-age stories, bringing the pastoral beauty of Prince Edward Island to the world.', 'Childrens Fiction', '2021-01-12 21:56:02.974000', '2021-01-12 21:56:27.289000'),
(36, 'Peter Pan and Wendy', 'J.M. Barrie', 'PeterPanandWendy.jpg', '', 300, 'Peter Pan, a young boy who refuses to grow up, takes Wendy to the lost boys on the fantasy island of the Neverland to be their mother. Wendy’s two brothers, John and Michael, accompany them on their many adventures, including skirmishes with the Native Americans who reside there, and battles with pirates, led by Pan’s nemesis Captain Hook, who is said to be feared even by Captain Flint and Long John Silver.', 'Fairy Tale', '2021-01-12 22:05:15.325000', '2021-01-12 22:14:37.870000'),
(37, 'Alice''s Adventures in Wonderland', 'Lewis Carroll', 'AlicesAdventuresinWonderland.jpg', '', 200, 'The Mad Hatter, the Duchess, the Cheshire Cat, the White Rabbit, the Caterpillar—all of these strange and familiar creatures appear in Alice, and the nonsensical style, memorable poems, and colorful set pieces are just as influential.', 'Fairy Tale', '2021-01-12 22:13:41.501000', '2021-01-12 22:13:41.501000'),
(38, 'Journey to the Center of the Earth', 'Jules Verne', 'JourneytotheCenteroftheEarth.jpg', '', 500, 'A classic science fiction novel by French writer Jules Verne, this work is one of the most well-known subterranean fictions to this day. It inspired many other similar works and adaptations. First published in 1864 in French as Voyage au centre de la Terre, it was quickly translated to English by several different publishers in the 1870s. The current edition was based on the translation by Frederick Amadeus Malleson that was published by Ward Lock & Co Ltd. in 1877.', 'Fantasy and Sci-Fi', '2021-01-12 22:22:27.638000', '2021-01-12 22:22:27.638000'),
(39, 'Pygmalion', 'George Bernard Shaw', 'Pygmalion.jpg', '', 450, 'The plot revolves around Professor Henry Higgins’ bet with a colleague over whether he can transform a low-class flower girl, Liza Doolittle, into the equivalent of a Duchess in just 6 months. Pygmalion was a Greek mythological figure who fell in love with a sculpture he had carved and was a popular theme in Victorian drama.', 'Drama', '2021-01-12 22:28:59.841000', '2021-01-12 22:28:59.841000'),
(40, 'Six Characters in Search of an Author', 'Luigi Pirandello', 'SixCharactersinSearchofanAuthor.jpg', '', 500, 'The plot features an acting company who have gathered to rehearse another play by Pirandello, when they’re interrupted by 6 “characters” who arrive in search of their author. They immediately clash with the manager who at first assumes they’re mad. But, as the play progresses, the manager slowly shifts his reality as the characters become more real than the actors.', 'Drama', '2021-01-12 22:31:16.005000', '2021-01-12 22:31:16.005000'),
(41, 'Jurgen', 'James Branch Cabell', 'Jurgen.jpg', '', 500, 'The novel is a witty, parodic send-up of the ideal of courtly love. Soon after publication, its bawdy style and double-entendre-laden dialog brought it to the attention of the New York Society for the Suppression of Vice, who promptly attempted to prosecute it for obscenity. After some years Cabell finally won the trial, and the publicity the trial brought made the book and Cabell famous. In his revised 1922 edition (on which this ebook is based) Cabell satirizes the Society in his Foreword, where Jurgen is placed on trial by the Philistines, overseen by a giant dung beetle as prosecutor.', 'Comic and Graphic Novel', '2021-01-12 22:34:45.783000', '2021-01-12 22:34:45.783000'),
(42, 'After You', 'Jojo', 'After You.jpg', '', 500, 'It continues the story of Louisa Clark after Will''s death. She is trying to move on. She was convinced by his motivation to change, so she moved to London and got a job in an airport bar. One night, she decides to go up the roof of her building to sit alone when someone from behind her talks to her.', 'Romance', '2021-01-21 14:07:40.670000', '2021-01-21 14:07:40.670000'),
(47, 'Final Project', 'Kenneth', '2.PNG', 0x46696e616c2050726f6a65637420666f7220495445322e706466, 200, 'sad', 'Action and Adventure', '2021-05-19 10:30:02.455000', '2021-05-19 10:30:02.455000');

-- --------------------------------------------------------

--
-- Table structure for table `checkout_items_table`
--

CREATE TABLE IF NOT EXISTS `checkout_items_table` (
  `USER_ID` int(11) NOT NULL,
  `CHECKOUT_ID` int(11) NOT NULL,
  `BOOK_ID` int(11) NOT NULL,
  `PAYMENT_DATE` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checkout_items_table`
--

INSERT INTO `checkout_items_table` (`USER_ID`, `CHECKOUT_ID`, `BOOK_ID`, `PAYMENT_DATE`) VALUES
(2, 43, 3, '2021-01-21 13:07:02'),
(2, 43, 4, '2021-01-21 13:07:02'),
(2, 44, 19, '2021-01-21 13:07:56'),
(2, 44, 1, '2021-01-21 13:07:56'),
(2, 44, 17, '2021-01-21 13:07:56'),
(2, 45, 5, '2021-01-21 13:12:48'),
(2, 45, 6, '2021-01-21 13:12:48'),
(2, 46, 7, '2021-01-21 13:40:38'),
(2, 46, 8, '2021-01-21 13:40:38'),
(4, 47, 21, '2021-01-21 13:51:35'),
(4, 47, 1, '2021-01-21 13:51:35'),
(4, 47, 2, '2021-01-21 13:51:35'),
(4, 48, 9, '2021-01-21 13:52:10'),
(4, 48, 10, '2021-01-21 13:52:10'),
(4, 49, 2, '2021-01-21 13:52:46'),
(4, 49, 36, '2021-01-21 13:52:46'),
(4, 50, 9, '2021-01-21 13:54:04'),
(4, 50, 10, '2021-01-21 13:54:04'),
(4, 50, 36, '2021-01-21 13:54:04'),
(4, 50, 37, '2021-01-21 13:54:04'),
(4, 51, 31, '2021-01-21 13:54:49'),
(4, 51, 1, '2021-01-21 13:54:49'),
(4, 51, 12, '2021-01-21 13:54:49'),
(2, 52, 1, '2021-01-21 14:18:11'),
(2, 52, 2, '2021-01-21 14:18:11'),
(2, 53, 3, '2021-01-21 14:18:57'),
(2, 53, 4, '2021-01-21 14:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `checkout_table`
--

CREATE TABLE IF NOT EXISTS `checkout_table` (
  `CHECKOUT_ID` int(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` int(100) NOT NULL,
  `PAYMENT_METHOD` varchar(20) NOT NULL,
  `PAYMENT_AMOUNT` decimal(11,0) NOT NULL,
  `PAYMENT_DATE` datetime NOT NULL,
  PRIMARY KEY (`CHECKOUT_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=54 ;

--
-- Dumping data for table `checkout_table`
--

INSERT INTO `checkout_table` (`CHECKOUT_ID`, `USER_ID`, `PAYMENT_METHOD`, `PAYMENT_AMOUNT`, `PAYMENT_DATE`) VALUES
(1, 2, 'GCash', '400', '2020-12-29 00:00:00'),
(2, 2, 'GCash', '350', '2020-12-29 00:00:00'),
(3, 2, 'Debit/Credit Card', '400', '2020-12-29 00:00:00'),
(4, 4, 'Gcash', '900', '2020-12-30 00:00:00'),
(5, 2, 'Gcash', '450', '2020-12-31 00:35:30'),
(6, 3, 'Gcash', '800', '2021-01-03 11:13:57'),
(7, 5, 'Debit/Credit Card', '350', '2021-01-04 08:42:25'),
(8, 6, 'Gcash', '150', '2021-01-06 23:04:38'),
(9, 2, 'Gcash', '280', '2021-01-07 00:32:23'),
(10, 5, 'Gcash', '150', '2021-01-07 00:50:37'),
(11, 3, 'Debit/Credit Card', '350', '2021-01-07 00:51:57'),
(12, 6, 'Gcash', '350', '2021-01-07 13:01:12'),
(42, 2, 'Gcash', '650', '2021-01-21 13:02:12'),
(43, 2, 'Gcash', '530', '2021-01-21 13:07:02'),
(44, 2, 'Debit/Credit Card', '1100', '2021-01-21 13:07:56'),
(45, 2, 'Gcash', '650', '2021-01-21 13:12:48'),
(46, 2, 'Gcash', '750', '2021-01-21 13:40:38'),
(47, 4, 'Gcash', '1150', '2021-01-21 13:51:35'),
(48, 4, 'Gcash', '350', '2021-01-21 13:52:10'),
(49, 4, 'Gcash', '600', '2021-01-21 13:52:46'),
(50, 4, 'Gcash', '850', '2021-01-21 13:54:04'),
(51, 4, 'Debit/Credit Card', '1350', '2021-01-21 13:54:49'),
(52, 2, 'Gcash', '650', '2021-01-21 14:18:11'),
(53, 2, 'Debit/Credit Card', '530', '2021-01-21 14:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users_table`
--

CREATE TABLE IF NOT EXISTS `users_table` (
  `USER_ID` int(10) NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(60) NOT NULL,
  `USER_EMAIL` varchar(60) NOT NULL,
  `USER_PASS` varchar(60) NOT NULL,
  `USER_ICON` varchar(10000) NOT NULL DEFAULT 'userIcon.png',
  `USER_CREATED_DATE` datetime(6) NOT NULL,
  `USER_MODIFIED_DATE` datetime(6) NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `users_table`
--

INSERT INTO `users_table` (`USER_ID`, `USER_NAME`, `USER_EMAIL`, `USER_PASS`, `USER_ICON`, `USER_CREATED_DATE`, `USER_MODIFIED_DATE`) VALUES
(1, 'test123', 'test123@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2020-12-07 10:11:35.556000', '2021-01-21 14:14:50.524000'),
(2, 'alexandra', 'alexandraloreinne.guzman@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'Batman - The Killing Joke.jpg', '2020-12-07 10:15:05.782000', '2021-01-21 14:15:20.491000'),
(3, 'chad', 'chadandreipagtalunan@tup.edu.ph', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2020-12-07 10:15:35.528000', '2021-01-21 14:14:50.524000'),
(4, 'tinoy', 'rustinangelo.bernardo@tup.edu.ph', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2020-12-07 10:16:03.302000', '2021-01-21 14:14:50.524000'),
(5, 'gab', 'gabrielandre.tagawa@tup.edu.ph', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2020-12-07 10:16:48.051000', '2021-01-21 14:14:50.524000'),
(6, 'oyus', 'axelross.suyo@tup.edu.ph', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2020-12-07 10:17:11.736000', '2021-01-21 14:14:50.524000'),
(8, 'sherlock', 'sherlock@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2021-01-21 13:34:09.776000', '2021-01-21 14:14:50.524000'),
(9, 'john watso', 'john@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2021-01-21 13:35:22.898000', '2021-01-21 14:14:50.524000'),
(10, 'Jon snow', 'jonsnow@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2021-01-21 13:38:25.925000', '2021-01-21 14:14:50.524000'),
(11, 'Targaryen', 'targaryen@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2021-01-21 13:48:44.309000', '2021-01-21 14:14:50.524000'),
(12, 'hello', 'hello@gmail.com', '$2a$08$QfOWapnijtrt7Fl3J6Hz/uZmkNcUiCLLRjhxp1pVgnQt0n1jMvbW2', 'userIcon.png', '2021-01-21 14:13:42.939000', '2021-01-21 14:14:50.524000');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;