Originally written by Robert Smyly

-Overview
	Spherly includes a web based IDE for developing programs, and a local light
	weight server the accepts commands from the IDE and sends them to a Sphero
	robot.
	For code that I have written, I'll provide an overview in this document
	and more detail in the files themselves as comments. For code that I didn't
	write, I'll also provide an overview here, and then provide a source of
	more detailed information.
	Also, for those who are continuing the project, I appologize for the quality	of some of the code. It's currently in a transition, so many parts were
	hastily changed or neglected.
	
-tutorial.txt
	Text file describing the instruction of installing necessary python components to run the Spherly server

-sphero.py
	This file contains a class that represents a sphero robot. It is able to
	discover, connect to, and control a sphero. Only a relatively small set of 
	sphero's commands have been implemented, but they're probably the only ones
	that will be needed for this project.
	The sphero api can be found at: http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/index.html

-sphero_wsh.py
	This is the handler for the websocket server. This is where the code that
	accepts commands from the IDE and forwards them to sphero goes. This file
	has been started as part of a transition to websockets from AJAX, and is not	complete, but there's enough in there to serve as an example on how to
	continue.

-standalone.py
	This is the actual websocket server. It's from the pywebsocket package
	which will need to be installed for this to work. You also may need to
	replace this copy with the one the results from the building of that
	package. I'm not sure if this one ends up being built the same on every
	platform. The module and its documentation can be found at 
	https://code.google.com/p/pywebsocket/

-pyRFCOMM
	This is a package that provides a thin wrapper over the libraries that are
	used for bluetooth communication on Linux, Windows, and OS X. When sphero.py
	imports it, it selects the correct library and uses that for bluetooth
	communication
