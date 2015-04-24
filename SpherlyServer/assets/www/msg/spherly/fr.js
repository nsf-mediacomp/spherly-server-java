'use strict';

goog.provide('Blockly.Msg.fr');

goog.require('Blockly.Msg');

//---------------------------------------------------------------------
//------------------------ SPHERO UI MESSAGES--------------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERLY_TITLE = "Spherly: Programmer votre Sphero";
Blockly.Msg.LANGUAGE = "Langue";

Blockly.Msg.OPEN_PROJECT = "Ouvrir un projet";
Blockly.Msg.SELECT_XML_FILE = "Selectionnez fichier XML: ";
Blockly.Msg.CHOOSE_EXAMPLE = "Ou choisir un projet d'exemple: ";
Blockly.Msg.LOAD_PROJECT = "Ouvrir";
Blockly.Msg.EXAMPLE_TURNING = "Turning";
Blockly.Msg.EXAMPLE_ABOUT_FACE = "About Face";
Blockly.Msg.EXAMPLE_ABOUT_FACE_COLLISION = "About Face (Collision)";
Blockly.Msg.EXAMPLE_CALIBRATE = "Calibration Example";
Blockly.Msg.EXAMPLE_COLOR_CYCLE = "Color Cycle";
Blockly.Msg.EXAMPLE_ROLL_SQUARE = "Roll in a Square";
Blockly.Msg.EXAMPLE_ROLL_SQUARE_SPIRAL = "Roll in a Square (Spiral)";

Blockly.Msg.SAVE_PROJECT = "Enregistrer";
Blockly.Msg.SAVE_PROJECT_DOWNLOAD_BLOCKS = "Sauver Projet / Télécharger Blocs";
Blockly.Msg.FILENAME = "Fichier: ";
Blockly.Msg.SPHEROPROJECT_XML = "SpheroProject.xml";

Blockly.Msg.CONNECT = "Connecter";
Blockly.Msg.CONNECT_HOVER = "Essayez de se connecter au Sphero dont l'adresse est spécifiée dans le champ à gauche.";
Blockly.Msg.DISCONNECT = "Déconnecter";
Blockly.Msg.SLEEP = "Mise en veille";
Blockly.Msg.ATTEMPTING_CONNECTION = function(spheroAddress){
	return "tentative de connexion avec Sphero<br/>à l'adresse: "+spheroAddress;
};
Blockly.Msg.CONNECTION_FAILED = "Impossible de se connecter<br/><br/>Sphero est peut-être éteint, ou est-il connecté à un autre périphérique ?<br/><br/>Si ce n'est pas le cas, essayez de vous connecter à nouveau !";
Blockly.Msg.NOT_CONNECTED = "Non Connecté";
Blockly.Msg.NOT_CONNECTED_MESSAGE = "Sphero n'est pas connecté.";
Blockly.Msg.CONNECTION_SUCCESSFUL = "La connexion à Sphero a réussi.";
Blockly.Msg.CONNECTED = "Connecté";

Blockly.Msg.SEARCHING_FOR_DEVICES = "recherche des périphériques";
Blockly.Msg.DEVICES_FOUND = "périphériques trouvés:";
Blockly.Msg.CANCEL = "Annuler";
Blockly.Msg.OK = "OK";
Blockly.Msg.SELECT_ADDRESS = "Sélectionnez l'adresse";
Blockly.Msg.SELECT_ADDRESS_HOVER = "Affiche une liste de Spheros. Choisissez-en un de la liste pour récupérer son adresse de sorte à pouvoir le <span style='font-weight:bold;color:#555555;'>Connecter</span>.";
Blockly.Msg.ERROR = "Erreur";

Blockly.Msg.CALIBRATE = "Calibrer";
Blockly.Msg.CALIBRATE_HOVER = "Sphero sera en mode calibrage (sa queue lumineuse sera allumée). Vous allez pouvoir faire tourner Sphero pour lui indiquer où se trouvera l'<span style='font-weight:bold;color:#001188;'>Avant</span>.";
Blockly.Msg.CALIBRATE_MESSAGE = "Tournez Sphero pour le calibrer.<br/>La direction de la LED bleue est l'opposé de ce que Sphero considère comme l'<span style='font-weight:bold;color:#001188;'>Avant</span>.";
Blockly.Msg.END_CALIBRATE = "Fin Calibrage";

Blockly.Msg.RUN_PROGRAM = "Exécuter Programme";
Blockly.Msg.RESET_PROGRAM = "Réinitialiser Programme";
Blockly.Msg.STOP = "Arrêtez";

//---------------------------------------------------------------------
//------------------------BLOCK TOOLBOX TITLES-------------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERO_EVENTS = "Sphero Evénements";
Blockly.Msg.SPHERO_COMMANDS = "Commandes Sphero";
Blockly.Msg.LOGIC = "Logique";
Blockly.Msg.LOOPS = "Boucles";
Blockly.Msg.MATH = "Math";
Blockly.Msg.LISTS = "Listes";
Blockly.Msg.COLOUR = "Couleur";
Blockly.Msg.VARIABLES = "Variables";
Blockly.Msg.FUNCTIONS = "Fonctions";

//---------------------------------------------------------------------
//------------------------ SPHERO BLOCK MESSAGES-----------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERO_GOSPHERO_URL = "http://www.gosphero.com";
Blockly.Msg.SPHERO_API_HELPURL = 'http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/bootloader-and-sphero.html';
Blockly.Msg.SPHERO_WAIT_HELPURL = 'http://www.w3schools.com/jsref/met_win_settimeout.asp';

Blockly.Msg.SPHERO_RUN_TITLE = "Lorsque Programme s'exécute";
Blockly.Msg.SPHERO_RUN_TOOLTIP = "Le bloc qui va contenir le code à exécuter lorsque the bouton Exécuter Programme est appuyé.";
Blockly.Msg.SPHERO_EVENT_COLLISION = "Lorsque Sphero heurte quelque chose";
Blockly.Msg.SPHERO_EVENT_STOP = "Lorsque Programme s'arrête";
Blockly.Msg.SPHERO_EVENT_END = "Lorsque programme Sphero terminé";
Blockly.Msg.SPHERO_EVENT_TOOLTIP = "Les blocs seront exécutés lorsque l'évènement spécifié se produit.";

Blockly.Msg.SPHERO_COLLISION_HELPURL = "http://orbotixinc.github.io/Sphero-Docs/docs/collision-detection/index.html";
Blockly.Msg.SPHERO_COLLISION_TITLE = "Lorsque Sphero Heurte quelque chose";
Blockly.Msg.SPHERO_COLLISION_TOOLTIP = "Le bloc qui contient le code à exécuter lorsque Sphero entre en collision avec quelque chose.";
Blockly.Msg.SPHERO_SETBACKLED_TITLE = "mettre luminosité de la queue à";
Blockly.Msg.SPHERO_SETBACKLED_TOOLTIP = "Change la LED de la queue de Sphero pour avoir la luminosité spécifiée. Sphero a une LED dans sa queue qui permet d'identifier l'avant de l'arrière (l'avant est l'opposé de la queue lumineuse).";
Blockly.Msg.SPHERO_SETRGB_TITLE = "changer couleur Sphero à";
Blockly.Msg.SPHERO_SETRGB_TOOLTIP = "Changer la couleur des LEDs de Sphero dans la couleur spécifiée.";
Blockly.Msg.SPHERO_CALIBRATECOMMAND_TITLE = "calibrer Sphero pour";
Blockly.Msg.SPHERO_CALIBRATECOMMAND_TOOLTIP = "Sphero va entrer en mode calibrage pendant le nombre de secondes spécifié pour permettre à l'utilisateur d'orienter Sphero dans la direction souhaitée.";
Blockly.Msg.SPHERO_ROLL_TITLE = 'Sphero roule dans la direction';
Blockly.Msg.SPHERO_ROLL_TOOLTIP = "Dire à Sphero de rouler dans la direction donnée. La direction est une position en degré allant de 0 à 359 degrés, et est relative à la dernière direction calibrée dans Sphero (contrôlé par le robot et non par la commande TOURNER).";
Blockly.Msg.SPHERO_ROLLFORWARD_TITLE = 'Sphero roule en avant';
Blockly.Msg.SPHERO_ROLLFORWARD_TOOLTIP = "Dire à Sphero de rouler en avant. Il roulera dans la direction et à la vitesse récemment défini. La vitesse par défaut est autour de 200 cm/s";
Blockly.Msg.SPHERO_TURN_TITLE = 'tourner Sphero';
Blockly.Msg.SPHERO_TURN_TITLE_2 = "degrés pour";
Blockly.Msg.SPHERO_TURN_DEGREES = "degrés";
Blockly.Msg.SPHERO_TURN_TOOLTIP = "Tourner Sphero d'un certain nombre de degrés (0 à 360). Sphero retiendra les précédentes commandes TOURNER, et chaque tour est relatif à l'orientation actuelle. Par exemple : tourner de 180 degrés, puis tourner de nouveau à 180 degrés remettra Sphero dans sa position initiale.";
Blockly.Msg.SPHERO_SETSTABILIZATION_TITLE = 'stabilizer Sphero';
Blockly.Msg.SPHERO_SETSTABILIZATION_TOOLTIP = 'Dire à Sphero d\'activer ou de désactiver la stabilisation. Activé par défaut. Lorsque c\'est désactivé, Sphero ne tentera pas de se stabiliser de lui-même et n\'acceptera pas les commandes ROULER ou TOURNER.';
Blockly.Msg.SPHERO_SETSPEED_TITLE = 'régler vitesse Sphero';
Blockly.Msg.SPHERO_SETSPEED_TOOLTIP = "Régler la vitesse de Sphero en pourcentage. La vitesse minimale est à 0% et la vitesse maximale est à 100%";
Blockly.Msg.SPHERO_STOP_TITLE = 'arrêter Sphero';
Blockly.Msg.SPHERO_STOP_TOOLTIP = "Dire à Sphero de cesser de rouler.";
Blockly.Msg.SPHERO_WAIT_TITLE = "attendre";
Blockly.Msg.SPHERO_WAIT_SECONDS = "secondes";
Blockly.Msg.SPHERO_WAIT_TOOLTIP = "Attendre le temps spécifié en secondes avant d'exécuter la commande de bloc suivante.";