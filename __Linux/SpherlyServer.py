import sys
import sphero
import sphero_wsh
import standalone

sys.argv.extend(['-p', '8080'])

standalone._main()
