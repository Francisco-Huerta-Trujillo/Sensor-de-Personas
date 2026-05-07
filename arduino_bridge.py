import serial
import time
import requests

ARDUINO_PORT = "COM5"
BAUD_RATE = 9600
DELAY = 3
API_URL = "http://192.168.1.115:8000/ultimoarduino"

print("Conectando con Arduino...")
arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE)
time.sleep(2)
print("Arduino conectado")

while True:
    try:
        response = requests.get(API_URL, timeout=5)
        response.raise_for_status()
        data = response.json()

        personas = data.get("people_count_all", 0)
        print(f"\nEnviando: {personas} personas")

        mensaje = f"{personas}\n"
        arduino.write(mensaje.encode())

    except Exception as e:
        print("Error al leer del servicio web:", e)

    time.sleep(DELAY)