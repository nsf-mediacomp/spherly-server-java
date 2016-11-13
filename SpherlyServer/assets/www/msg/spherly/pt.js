'use strict';

goog.provide('Blockly.Msg.pt');

goog.require('Blockly.Msg');

//---------------------------------------------------------------------
//------------------------ SPHERO UI MESSAGES--------------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERLY_TITLE = "Spherly: Programe Seu Sphero";
Blockly.Msg.LANGUAGE = "Linguagem";

Blockly.Msg.OPEN_PROJECT = "Abrir projeto";
Blockly.Msg.SELECT_XML_FILE = "Escolha arquivo XML: ";
Blockly.Msg.CHOOSE_EXAMPLE = "Ou projeto exemplo: ";
Blockly.Msg.LOAD_PROJECT = "Carregar Projeto";
Blockly.Msg.EXAMPLE_TURNING = "Virando";
Blockly.Msg.EXAMPLE_ABOUT_FACE = "Face";
Blockly.Msg.EXAMPLE_ABOUT_FACE_COLLISION = "Face (Colisão)";
Blockly.Msg.EXAMPLE_CALIBRATE = "Exemplo de Calibração";
Blockly.Msg.EXAMPLE_COLOR_CYCLE = "Ciclo de Cores";
Blockly.Msg.EXAMPLE_ROLL_SQUARE = "Rolar em Quadrado";
Blockly.Msg.EXAMPLE_ROLL_SQUARE_SPIRAL = "Rolar em Quadrado (Espiral)";

Blockly.Msg.SAVE_PROJECT = "Salvar Projeto";
Blockly.Msg.SAVE_PROJECT_DOWNLOAD_BLOCKS = "Salvar Projeto / Baixar Blocos";
Blockly.Msg.FILENAME = "Nome do Arquivo: ";
Blockly.Msg.SPHEROPROJECT_XML = "SpheroProjeto.xml";

Blockly.Msg.CONNECT = "Conectar";
Blockly.Msg.CONNECT_HOVER = "Tentar conectar ao Sphero especificado pelo endereço na caixa de endereços à esquerda.";
Blockly.Msg.DISCONNECT = "Desconectar";
Blockly.Msg.SLEEP = "Dormir";
Blockly.Msg.ATTEMPTING_CONNECTION = function(spheroAddress){
	return "tentando conexão com Sphero<br/>no endereço: "+spheroAddress;
};
Blockly.Msg.CONNECTION_FAILED = "Conexão falhou<br/><br/>Talvez o Sphero esteja desligado, ou já conectado a algo?<br/><br/>If not, try connecting again!";
Blockly.Msg.NOT_CONNECTED = "Não Conectado";
Blockly.Msg.NOT_CONNECTED_MESSAGE = "Sphero não está conectado.";
Blockly.Msg.CONNECTION_SUCCESSFUL = "Conexão com Sphero bem sucedida.";
Blockly.Msg.CONNECTED = "Conectado";

Blockly.Msg.SEARCHING_FOR_DEVICES = "Procurando por dispositivos";
Blockly.Msg.DEVICES_FOUND = "Dispostivos encontrados";
Blockly.Msg.CANCEL = "Cancelar";
Blockly.Msg.OK = "OK";
Blockly.Msg.SELECT_ADDRESS = "Selecione Endereço";
Blockly.Msg.SELECT_ADDRESS_HOVER = "Mostra lista de Spheros. Selecione um da lista para pegar seu endereço para que você possa <span style='font-weight:bold;color:#555555;'>Conectar</span> to it.";
Blockly.Msg.ERROR = "Erro";

Blockly.Msg.CALIBRATE = "Calibrar";
Blockly.Msg.CALIBRATE_HOVER = "Sphero vai entrar em modo de calibração, onde o LED de trás ligará, e você pode apontar o Sphero para <span style='font-weight:bold;color:#001188;'>Frente</span> is.";
Blockly.Msg.CALIBRATE_MESSAGE = "Gire o Sphero para calibrar.<br/>A direção do LED azul é o oposto de onde o Sphero considera <span style='font-weight:bold;color:#001188;'>Frente</span>.";
Blockly.Msg.END_CALIBRATE = "Pronto!";

Blockly.Msg.RUN_PROGRAM = "Executar Programa";
Blockly.Msg.RESET_PROGRAM = "Resetar Programa";
Blockly.Msg.STOP = "Parar";

//---------------------------------------------------------------------
//------------------------BLOCK TOOLBOX TITLES-------------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERO_EVENTS = "Eventos Sphero";
Blockly.Msg.SPHERO_COMMANDS = "Comandos Sphero";
Blockly.Msg.LOGIC = "Lógica";
Blockly.Msg.LOOPS = "Laços";
Blockly.Msg.MATH = "Matemática";
Blockly.Msg.LISTS = "Listas";
Blockly.Msg.COLOUR = "Cor";
Blockly.Msg.VARIABLES = "Variáveis";
Blockly.Msg.FUNCTIONS = "Funções";

//---------------------------------------------------------------------
//------------------------ SPHERO BLOCK MESSAGES-----------------------
//---------------------------------------------------------------------
Blockly.Msg.SPHERO_GOSPHERO_URL = "http://www.gosphero.com";
Blockly.Msg.SPHERO_API_HELPURL = 'http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/bootloader-and-sphero.html';
Blockly.Msg.SPHERO_WAIT_HELPURL = 'http://www.w3schools.com/jsref/met_win_settimeout.asp';

Blockly.Msg.SPHERO_RUN_TITLE = "Quando Executar Programa é clicado";
Blockly.Msg.SPHERO_RUN_TOOLTIP = "Bloco que contém qual código executar quando o botão Executar Programa é pressionado.";
Blockly.Msg.SPHERO_EVENT_COLLISION = "Quando o Sphero colidir em algo";
Blockly.Msg.SPHERO_EVENT_STOP = "Quando Pare é clicado";
Blockly.Msg.SPHERO_EVENT_END = "Quando o programa terminar";
Blockly.Msg.SPHERO_EVENT_TOOLTIP = "Blocos aqui vão ser executados quando o evento especifico ocorrer.";

Blockly.Msg.SPHERO_COLLISION_HELPURL = "http://orbotixinc.github.io/Sphero-Docs/docs/collision-detection/index.html";
Blockly.Msg.SPHERO_COLLISION_TITLE = "Quando o Sphero colidir em algo";
Blockly.Msg.SPHERO_COLLISION_TOOLTIP = "Bloco que contém qual código executar quando o Sphero colidir em algo.";
Blockly.Msg.SPHERO_SETBACKLED_TITLE = "mudar brilho do LED traseiro do Sphero para";
Blockly.Msg.SPHERO_SETBACKLED_TOOLTIP = "Muda a o LED trazeiro do Sphero para um brilho específico. O LED trazeiro indica para onde o Sphero está apontado (para frente é oposto ao LED).";
Blockly.Msg.SPHERO_SETRGB_TITLE = "mudar cor do sphero";
Blockly.Msg.SPHERO_SETRGB_TOOLTIP = "Muda a cor dos LEDs do Sphero par uma cor específica.";
Blockly.Msg.SPHERO_CALIBRATECOMMAND_TITLE = "calibrar sphero por";
Blockly.Msg.SPHERO_CALIBRATECOMMAND_TOOLTIP = "Sphero entra em modo de calibração por um número específico de segundos para permirir que o usuário o aponte a uma direção desejada.";
Blockly.Msg.SPHERO_ROLL_TITLE = 'sphero rolar para a direção';
Blockly.Msg.SPHERO_ROLL_TOOLTIP = "Diz os Sphero para rolar em uma direção. A direção é uma posição em graus de 0 a 359, e é relativa a última direção calibrada (contorlada pelo robô, não pelo bloco VIRE).";
Blockly.Msg.SPHERO_ROLLFORWARD_TITLE = 'sphero rola a frente';
Blockly.Msg.SPHERO_ROLLFORWARD_TOOLTIP = "Faz o Sphero rolar à frente. O robô vai rolar na direção mais recente, e na velocidade mais recente. Velocidade padrão é 200 cm/s";
Blockly.Msg.SPHERO_TURN_TITLE = 'sphero vire';
Blockly.Msg.SPHERO_TURN_TITLE_2 = "graus por";
Blockly.Msg.SPHERO_TURN_DEGREES = "graus";
Blockly.Msg.SPHERO_TURN_TOOLTIP = "Vira o Sphero um certo número de graus (0 a 360). O Sphero vai se lembrar de comandos de virar anteriores, então cada virar é relativo a onde o Sphero está apontando. Por exemplo: virar 180 graus e depois virar 180 graus fará o Sphero apontar na mesma direção de antes.";
Blockly.Msg.SPHERO_SETSTABILIZATION_TITLE = 'sphero estabilizar';
Blockly.Msg.SPHERO_SETSTABILIZATION_TOOLTIP = 'Liga ou desliga a estabilização do Sphero. Ligado por padrão. Quando desligado, Sphero não vai tentar estabilizar-se logo não aceitará comandos rolar ou virar.';
Blockly.Msg.SPHERO_SETSPEED_TITLE = 'sphero definir velocidade';
Blockly.Msg.SPHERO_SETSPEED_TOOLTIP = "Define a velocidade do Sphero como porcentagem. Mínimo é 0% e máximo é 100%";
Blockly.Msg.SPHERO_STOP_TITLE = 'sphero pare de rolar';
Blockly.Msg.SPHERO_STOP_TOOLTIP = "Faz Sphero para de rolar à frente.";
Blockly.Msg.SPHERO_WAIT_TITLE = "espere";
Blockly.Msg.SPHERO_WAIT_SECONDS = "segundos";
Blockly.Msg.SPHERO_WAIT_TOOLTIP = "Pausa por número específico de segundos antes de executar o próximo comando/bloco.";