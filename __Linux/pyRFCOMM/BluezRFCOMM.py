import bluetooth

class RFCOMM:
	def __init__(self):
		self.socket = None
	def findDevices(self):
		return bluetooth.discover_devices(lookup_names=True)
	def connect(self, address):
		services = bluetooth.find_service(uuid = '1101', address = address)
		port = services[0]["port"]
		name = services[0]["name"]
		host = services[0]["host"]
		self.socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
		self.socket.connect((host, port))
	def disconnect(self):
		if (self.isConnected()):
			self.socket.close()
		self.socket = None
	def isConnected(self):
		return self.socket != None
	def write(self, data):
		return self.socket.send(data)
	def read(self, length):
		return self.socket.recv(length)
