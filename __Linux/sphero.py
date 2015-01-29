from pyRFCOMM import rfcomm
import thread

class Sphero:
	def __init__(self):
		self.comm = rfcomm.getRFCOMM()
		self.packetNumber = 0
		self.isConnected = False
		
		self.onCollision = None #callback to be used when a collision is detected
		self.heading = 0
	def findSpheros(self, filter=True):
		devices = self.comm.findDevices()
		if filter == False:
			return devices
		spheros = []
		for device in devices:
			if "Sphero" in device[1]:
				spheros.append(device)
		return spheros
	def connect(self, address):
		self.comm.connect(address)
		self.isConnected = True
		self.startListening()
		
		self.onCollision = None
		self.heading = 0
		self.setHeading(0)
	def disconnect(self):
		self.isConnected = False
		self.comm.disconnect()
	def isConnected(self):
		self.isConnected = self.comm.isConnected()
		return self.isConnected
	def incPacketNum(self):
		self.packetNumber += 1
		self.packetNumber %= 256
	def clearPacketNum(self):
		self.packetNumber = 0
	def buildCommand(self, device, command, data, answer=False): 
		#encodes the command and parameters into the protocol used by sphero
		sop1 = 255
		sop2 = 254
		if answer:
			sop2 += 1
		did = device
		cid = command
		seq = self.packetNumber
		self.incPacketNum()
		dlen = len(data) + 1
		data = data
		dataSum = 0
		for d in data:
			dataSum += d
		chk = (did + cid + seq + dlen + dataSum) % 256
		chk ^= 0xFF
		packet = bytearray([sop1, sop2, did, cid, seq, dlen])
		for d in data:
			packet.append(d)
		packet.append(chk)
		return packet
	def setRGB(self, red, green, blue):
		device = 0x02
		command = 0x20
		flag = 0
		data = bytearray([red, green, blue, flag])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def rollForward(self, speed, state=1):
		self.roll(self.heading, speed, state)
	def roll(self, heading, speed, state=1):
		print "heading:",heading," speed:",speed
		device = 0x02
		command = 0x30
		lsbHeading = heading % 256
		msbHeading = heading >> 8
		data = bytearray([speed, msbHeading, lsbHeading, state])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def turn(self, direction):
		self.heading += direction
		self.heading = self.heading % 360
		#self.setHeading(self.heading)
		self.roll(self.heading, 0, 1) #??? Does this work
	def setRotationRate(self, rate):
		print "set rotation:",rate
		device = 0x02
		command = 0x03
		data = bytearray([rate])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def setStabilization(self, flag):
		device = 0x02
		command = 0x02
		flag_byte = 0
		if (flag):
			flag_byte = 1
		data = bytearray([flag_byte])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def calibrate(self, flag):
		if (flag):
			self.setRGB(0, 0, 0)
			self.setBackLED(127)
			self.resetHeading()
			self.setStabilization(False)
		else:
			self.setBackLED(0)
			self.setRGB(127, 127, 127)
			self.resetHeading()
			self.setStabilization(True)
	def stop(self):
		self.roll(self.heading,0)
	def sleep(self):
		device = 0x00
		command = 0x22
		data = bytearray([0x00, 0x00, 0x00, 0x00, 0x00])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def resetHeading(self):
		self.setHeading(0)
	def setHeading(self, heading):
		self.heading = heading
		device = 0x02
		command = 0x01
		lsbHeading = heading % 256
		msbHeading = heading >> 8
		data = bytearray([msbHeading, lsbHeading])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def setBackLED(self, brightness):
		device = 0x02
		command = 0x21
		data = bytearray([brightness])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def setCollisionHandler(self, function):
		self.onCollision = function
	def enableCollisionDetection(self, enable=True):
		device = 0x02
		command = 0x12
		if enable:
			method = 0x01
		else:
			method = 0x00
		Xt = 0x56 #play with these values
		Yt = 0x56 #this one too
		Xspd = 0x64
		Yspd = 0x64
		dead = 100
		data = bytearray([method, Xt, Xspd, Yt, Yspd, dead])
		packet = self.buildCommand(device, command, data)
		self.comm.write(bytes(packet))
	def startListening(self):
		def readComm(length):
			#ideally, self.com.read would guarantee a read length that was given to it, but it doesn't.
			packet = self.comm.read(length)
			while (len(packet) < length):
				packet += (self.comm.read(length - len(packet)))
			return packet
	
		#start a new thread to listen for packets that indicate a collision
		def listen():
			print "begin listening\n"
			fullheader = []
			while self.isConnected:
				try:
					header = readComm(5)
					
					print "got a packet!, length:", len(header)
					
					#sphero response packet: http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/packet-structures.html
					#OKAY NOW LET'S PROCESS THE PACKET
					
					if ord(header[1]) == 0xff: #response packet
						dlen = ord(header[4])
						print "response. reading:", dlen
						readComm(dlen)
					elif ord(header[1]) == 0xfe: #async packet
						print "async"
						idCode = ord(header[2])
						if idCode == 0x07: #collision detection
							print "collision detected"
							if self.onCollision != None:
								self.onCollision()
						msbDlen = ord(header[3]) << 8
						lsbDlen = ord(header[4])
						dlen = msbDlen + lsbDlen
						print "reading:",dlen
						readComm(dlen)
				except Exception, e: 
					print "error:",str(e) #what is error return without exception set?
					pass
			print "end listening...\n"
		thread.start_new_thread(listen, ())
