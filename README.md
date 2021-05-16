# iBOOK-Website
Requirement in Business Intelligence and IT Electives 2 (Formerly created by group of Alexandra Guzman)

Pre-requisites:
1) VS Code (or atom)
2) Google Chrome (or any browser)
3) Copy of the code - git clone this repository (run "git clone https://github.com/nakataken/iBOOK-Website.git" sa cmd kung saan directory nyo gusto)
5) node.js 
6) node packages (run "npm install" to install all packages included in package.json), kahit later nyo na gawin 
7) wamp & mysql - https://sourceforge.net/projects/wampserver/
8) copy of database file (ibook_db.sql), yung sinend ni alex
9) import database file to your phpmyadmin. follow steps below:
  * start first wamp server
  * left click the icon of wamp server on bottom right of your window
  * click start all services
  * left click again the icon of wamp server on bottom right of your window
  * click phpmyadmin
  * kapag naopen na yung phpmyadmin, pa-create ng new database. "ibook_db" yung name.
  * then select nyo yung ibook_db, pa-access nung import tab. bandang sa taas lang yung, pang-6th na tab.
  * then sa file to import, click choose file, then select nyo yung file na sinend ni alex. (ibook_db.sql) then click nyo yung go sa bottom left.

Instructions: (Gawin nyo to after nyo magawa yung above)
1) Open VS Code, then add project folder sa workspace if di nyo pa na-add.
2) Open Wamp server, then start all services
3) Go to vs code, create new terminal (ctrl+shift+tapos katabi ng 1) sa directory ng project folder.
  * e.g. C:/iBook-Website>
4) run "npm install" IF DI NYO PA NAGAGAWA
  * e.g. C:/iBook-Website> npm install
6) run "nodemon app", then magsstart na dapat yung session
  * e.g. C:/iBook-Website> nodemon app
8) open nyo yung browser, then access nyo yung "localhost:8080". 

P.S Chat nalang kayo if may naging problem
* localhost:8080 - para maaccess yung system
* localhost/phpmyadmin - para maaccess yung db
* ctrl + c lang para materminate yung session sa terminal ng vs code
