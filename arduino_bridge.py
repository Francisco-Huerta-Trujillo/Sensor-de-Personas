import serial
import time

# =========================================
# MODIFICAR ESTO
# =========================================

# Puerto COM del Arduino
ARDUINO_PORT = "COM5"

# Debe coincidir con Serial.begin()
BAUD_RATE = 9600

# Tiempo entre pruebas
DELAY = 3

# =========================================


print("Conectando con Arduino...")

arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE)

time.sleep(2)

print("Arduino conectado")

# =========================================
# DATOS SIMULADOS
# =========================================

datos_simulados = [
    2,
    4,
    7,
    9,
    12,
    15,
    3,
    1,
    11
]

# =========================================

while True:

    for personas in datos_simulados:

        print(f"\nEnviando: {personas} personas")

        mensaje = f"{personas}\n"

        arduino.write(mensaje.encode())

        time.sleep(DELAY)