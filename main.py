from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/uplink")
async def recibir_datos(request: Request):
    data = await request.json()

    print("\n----- DATOS DEL GATEWAY -----")
    print(data)
    print("-----------------------------\n")

    # aquí puedes extraer info útil
    try:
        payload = data.get("data", {})
        print("Personas:", payload.get("people"))
    except:
        pass

    return {"status": "ok"}
