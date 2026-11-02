import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

PRODUCTOS_DB = [
    {"codigo": 1, "descripcion": "Coca cola", "precio": 2.33},
    {"codigo": 2, "descripcion": "Fanta", "precio": 1.7}
]

@csrf_exempt
def lista_productos(request):
    if request.method == 'GET':
        return JsonResponse(PRODUCTOS_DB, safe=False)

    elif request.method == 'POST':
        datos = json.loads(request.body)
        nuevo_producto = {
            "codigo": int(datos.get("codigo")),
            "descripcion": str(datos.get("descripcion")),
            "precio": float(datos.get("precio"))
        }
        PRODUCTOS_DB.append(nuevo_producto)
        return JsonResponse(nuevo_producto, status=201)