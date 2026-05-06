from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime
from database import SessionLocal, RegistroPersonas

# Cmd para correr: python -m uvicorn main:app --host 0.0.0.0 --port 8000
app = FastAPI()

# 🔌 CORS — permite que el frontend en el navegador haga fetch a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambia "*" por la URL exacta de tu frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/uplink")
async def recibir_datos(request: Request):
    data = await request.json()

    print("\n----- RAW DATA -----")
    print(json.dumps(data, indent=2))
    print("--------------------\n")

    people_count_all = data.get("people_count_all")
    people_count_max = data.get("people_count_max")
    region_count     = data.get("region_count")
    timestamp_real   = datetime.now()

    print(
        f"Personas actuales: {people_count_all} | "
        f"Máximo: {people_count_max if people_count_max is not None else 'N/A'} | "
        f"Región: {region_count} | "
        f"Hora real: {timestamp_real}"
    )

    if people_count_all is not None:
        db = SessionLocal()
        nuevo_registro = RegistroPersonas(
            people_count_all=people_count_all,
            people_count_max=people_count_max,
            region_count=region_count,
            timestamp=timestamp_real
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


# 🆕 Endpoint extra: solo el último registro (más eficiente para polling)
@app.get("/ultimo")
def obtener_ultimo():
    db = SessionLocal()
    registro = db.query(RegistroPersonas).order_by(RegistroPersonas.id.desc()).first()
    db.close()
    if not registro:
        return {"people_count_all": 0, "timestamp": str(datetime.now())}
    return {
        "people_count_all": registro.people_count_all,
        "people_count_max": registro.people_count_max,
        "region_count":     registro.region_count,
        "timestamp":        str(registro.timestamp)
    }