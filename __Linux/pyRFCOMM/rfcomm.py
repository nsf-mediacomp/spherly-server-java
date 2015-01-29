def getRFCOMM():
	import platform
	os = platform.system()
	if os == 'Darwin': #platform is OSX, use lightblue
		import LightBlueRFCOMM
		return LightBlueRFCOMM.RFCOMM()
	else: # platform is Linux or Windows, use Bluez
		import BluezRFCOMM
		return BluezRFCOMM.RFCOMM()
