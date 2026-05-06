from fastapi import FastAPI, Request
import json
from datetime import datetime
from database import SessionLocal, RegistroPersonas
from fastapi import FastAPI, Request
from database import SessionLocal, RegistroPersonas
#Cmd para correr python -m uvicorn main:app --host 0.0.0.0 --port 8000
app = FastAPI()

@app.post("/uplink")
async def recibir_datos(request: Request):
    data = await request.json()

    print("\n----- RAW DATA -----")
    print(json.dumps(data, indent=2))
    print("--------------------\n")

    # Datos del sensor
    people_count_all = data.get("people_count_all")
    people_count_max = data.get("people_count_max")
    region_count = data.get("region_count")

    # 🔥 Hora REAL del servidor
    timestamp_real = datetime.now()

    print(
        f"Personas actuales: {people_count_all} | "
        f"Máximo: {people_count_max if people_count_max is not None else 'N/A'} | "
        f"Región: {region_count} | "
        f"Hora real: {timestamp_real}"
    )

    # Guardar en BD
    if people_count_all is not None:
        db = SessionLocal()

        nuevo_registro = RegistroPersonas(
            people_count_all=people_count_all,
            people_count_max=people_count_max,
            region_count=region_count,
            timestamp=timestamp_real  # 👈 CAMBIO AQUÍ
        )

        db.add(nuevo_registro)
        db.commit()
        db.close()

    return {"status": "ok"}


@app.get("/registros")
def obtener_registros():
    db = SessionLocal()

    registros = db.query(RegistroPersonas).all()

    resultado = []
    for r in registros:
        resultado.append({
            "id": r.id,
            "people_count_all": r.people_count_all,
            "people_count_max": r.people_count_max,
            "region_count": r.region_count,
            "timestamp": str(r.timestamp)
        })

    db.close()
    return resultado