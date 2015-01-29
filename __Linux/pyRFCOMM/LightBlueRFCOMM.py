import lightblue

class RFCOMM:
	def __init__(self):
		self.socket = None
	def findDevices(self):
		devices = lightblue.finddevices()
		ret = []
		for device in devices:
			ret.append( (device[0], device[1]) )
		return ret
	def connect(self, address):
		s = lightblue.socket()
		s.connect( (address, 1) )
		self.socket = s
	def disconnect(self):
		if (self.isConnected()):
			self.socket.close()
		self.socket = None
	def isConnected():
		return self.socket != None
	def write(self, data):
		return self.socket.send(data)
	def read(self, length):
		return self.socket.recv(length)
