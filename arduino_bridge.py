import serial
import requests
import time

# =========================================
# MODIFICAR ESTO
# =========================================

# Puerto COM del Arduino
ARDUINO_PORT = "COM5"

# Velocidad serial (debe coincidir con Arduino)
BAUD_RATE = 9600

# URL de tu FastAPI
API_URL = "http://localhost:8000/ultimo"

# Cada cuántos segundos consultar
DELAY = 10

# =========================================


print("Conectando con Arduino...")

arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE)

time.sleep(2)

print("Arduino conectado")


while True:

    try:

        # Obtener datos del backend
        response = requests.get(API_URL)

        data = response.json()

        personas = data.get("people_count_all", 0)

        print(f"Personas detectadas: {personas}")

        # Enviar dato al Arduino
        mensaje = f"{personas}\n"

        arduino.write(mensaje.encode())

        print(f"Enviado al Arduino: {mensaje}")

    except Exception as e:

        print("ERROR:")
        print(e)

    time.sleep(DELAY)
