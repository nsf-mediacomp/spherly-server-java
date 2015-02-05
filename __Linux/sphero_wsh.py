from mod_pywebsocket import msgutil
import os
import sys
import json
from pyRFCOMM import rfcomm
import multiprocessing
import sphero
from sys import platform as _platform

def web_socket_do_extra_handshake(request):
	#the library wants this function to be here, but I don't think it needs to do anything for this project
	#accepts all handshakes
	pass

def web_socket_transfer_data(request):
	#function is called when a websocket connection is established
	sp = sphero.Sphero()
	print "Connected to Web-Client"
	while True:
		try:
			data = json.loads(msgutil.receive_message(request)) #read websocket and deserialize the JSON object
			command = data["command"] 
			listDevicesThread = None
			connectionThread = None
			if (command == "listDevices"):
				print 'list spheros'
				devices = sp.findSpheros()
				jDev = []
				for d in devices:
					jDev.append( {'name': d[1], 'address': d[0]} )
				print "found: ",jDev
				if len(jDev) == 0:
					print "Pair Sphero to computer via Bluetooth Manager first."
					print "Then, try to select address again."
				msgutil.send_message(request, json.dumps(jDev)) #serialize list into JSON and send over the socket
			elif (command == "cancelListDevices"):
				print "cancel device search"
				listDevicesThread.terminate()
				listDevicesThread = None
			elif (command == "connectToDevice"): 
				name = data["name"]
				address = data["address"]
				print "connect to: ",name, address
				try:
					sp.connect(address)
					msgutil.send_message(request, json.dumps( {'connected': True} ))
					print "connection successful"
				except Exception,e:
					print str(e)
					msgutil.send_message(request, json.dumps( {'connected': False} ))
					print "connection failed"
			elif (command == "cancelConnection"):
				print "cancel attempted connection"
				connectionThread.terminate()
				connectionThread = None
			elif (command == "disconnect"):
				try:
					sp.disconnect()
				except:
					pass
			elif (command == "setRGB"):
				sp.setRGB(data["red"], data["green"], data["blue"])
			elif (command == "roll"):
				if (data["speed"] < 0): data["speed"] = 0
				if (data["speed"] > 255): data["speed"] = 255
				sp.roll(data["heading"], data["speed"])
			elif (command == "rollForward"):
				if (data["speed"] < 0): data["speed"] = 0
				if (data["speed"] > 255): data["speed"] = 255
				sp.rollForward(data["speed"])
			elif (command == "turn"):
				sp.turn(data["direction"])
			elif (command == "setRotationRate"):
				sp.setRotationRate(data["rate"])
			elif (command == "stop"):
				sp.stop()
			elif (command == "sleep"):
				print "goodnight"
				sp.sleep()
			elif (command == "calibrateOn"):
				print "calibrate ON"
				sp.calibrate(True)
			elif (command == "calibrateOff"):
				print "calibrate OFF"
				sp.calibrate(False)
			elif (command == "setBackLED"):
				sp.setBackLED(data["value"])
			elif (command == "setCollisionDetection"):
				sp.enableCollisionDetection(data["value"])
				if (data["value"]):
					def onCollide():
						msgutil.send_message(request, json.dumps( {'collision': True} ))
					sp.setCollisionHandler(onCollide)
				else:
					sp.setCollisionHandler(None)
			elif (command == "clear"):
				sp.clearPacketNum()
				#if _platform == "linux" or _platform == "linux2": #LINUX
				#	os.system('cls')
				#elif _platform == "darwin": #OSX
				#	os.system('cls')
				#elif _platform == "win32" or _platform == "cygwin": #WINDOWS
				#	os.system('cls')
			else:
				print "TODO:",command
		except Exception, e:
			print str(e)
			print "connection to client broken"
			sp.disconnect()
			break
