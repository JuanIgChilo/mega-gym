import io
from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

from apps.usuarios.permissions import EsProfesor
from .models import Descuento, Socio
from .serializers import DescuentoSerializer, SocioSerializer


class DescuentoViewSet(viewsets.ModelViewSet):
    """RF.21: crear y modificar descuentos (solo Profesor)."""
    queryset = Descuento.objects.all()
    serializer_class = DescuentoSerializer
    permission_classes = [EsProfesor]


class SocioViewSet(viewsets.ModelViewSet):
    """RF.27, RF.28: agregar/modificar/visualizar socios y su estado."""
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer

    def get_permissions(self):
        if self.request.method not in ("GET", "HEAD", "OPTIONS"):
            return [EsProfesor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.es_profesor:
            return Socio.objects.all()
        return Socio.objects.filter(usuario=user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def certificado_socio_activo(request):
    """
    RF.30, RF.31: generar y descargar en PDF el certificado de socio activo.
    Datos a mostrar: Nombre y apellido, DNI, estado, último vencimiento membresía.
    """
    try:
        socio = request.user.socio
    except Socio.DoesNotExist:
        return Response({"detail": "El usuario no tiene un registro de socio asociado."}, status=404)

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    ancho, alto = A4

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, alto - 80, "Mega Gym - Certificado de Socio Activo")

    pdf.setFont("Helvetica", 12)
    datos = [
        f"Nombre y apellido: {socio.nombre} {socio.apellido}",
        f"DNI: {socio.dni}",
        f"Estado: {socio.get_estado_display()}",
        f"Último vencimiento de membresía: {socio.fecha_vencimiento.strftime('%d/%m/%Y')}",
    ]
    y = alto - 140
    for linea in datos:
        pdf.drawString(50, y, linea)
        y -= 25

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return FileResponse(
        buffer, as_attachment=True, filename=f"certificado_socio_{socio.dni}.pdf"
    )
