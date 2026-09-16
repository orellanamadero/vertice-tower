from io import BytesIO
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User, Group
from .permissions import EsAdministrador
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from rest_framework.permissions import BasePermission

from .models import Proyecto
from .serializers import (
    ProyectoSerializer,
    NosotrosPageSerializer,
    ProyectoHeroSerializer,
    ProyectoBaseSerializer,
    UsuarioSerializer
)
from contenido.models import (
    Avance, Ubicacion, Contacto
)
from contenido.serializers import (
    AvanceSerializer,
    UbicacionSerializer,
    ContactoSerializer,
)
from recorrido.serializers import (
    UnidadSerializer, UnidadEstadoSerializer, HistorialEstadoUnidadSerializer, UnidadPrecioSerializer, HistorialPrecioUnidadSerializer, UnidadEdicionSerializer,HistorialVentaUnidad,
)
from recorrido.models import (
    Unidad, HistorialEstadoUnidad, HistorialPrecioUnidad,
)


class ProyectoListView(generics.ListAPIView):
    queryset = Proyecto.objects.select_related("empresa").all()
    serializer_class = ProyectoSerializer

class ProyectoRecorridoView(generics.RetrieveAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

class ProyectoBaseView(generics.RetrieveAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoBaseSerializer

class ProyectoNosotrosView(generics.RetrieveAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = NosotrosPageSerializer

class ProyectoHeroView(generics.RetrieveAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoHeroSerializer

class ProyectoAvancesView(generics.ListAPIView):
    serializer_class = AvanceSerializer
    def get_queryset(self):
        return Avance.objects.filter(
            proyecto_id=self.kwargs["pk"]
        )

class ProyectoUbicacionView(generics.RetrieveAPIView):
    serializer_class = UbicacionSerializer
    def get_queryset(self):
        return Ubicacion.objects.filter(
            proyecto_id=self.kwargs["pk"]
        )

class ProyectoContactoView(generics.RetrieveAPIView):
    serializer_class = ContactoSerializer
    def get_queryset(self):
        return Contacto.objects.filter(
            proyecto_id=self.kwargs["pk"]
        )

class UnidadListView(generics.ListAPIView):
    queryset = Unidad.objects.select_related(
        "piso",
        "tipoUnidad"
    )
    serializer_class = UnidadSerializer
    permission_classes = [IsAuthenticated]

class UnidadEstadoUpdateView(generics.UpdateAPIView):
    queryset = Unidad.objects.all()
    serializer_class = UnidadEstadoSerializer
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions
    ]

class UnidadPrecioUpdateView(generics.UpdateAPIView):

    queryset = Unidad.objects.all()

    serializer_class = UnidadPrecioSerializer

    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions
    ]

class HistorialEstadoUnidadListView(APIView):

    permission_classes = [
        EsAdministrador
    ]

    def get(self, request):

        historial_estados = HistorialEstadoUnidad.objects.select_related(
            "unidad__tipoUnidad",
            "unidad__piso",
            "usuario",
            "venta"
        )

        historial_precios = HistorialPrecioUnidad.objects.select_related(
            "unidad__tipoUnidad",
            "unidad__piso",
            "usuario"
        )

        estados = HistorialEstadoUnidadSerializer(
            historial_estados,
            many=True
        ).data

        precios = HistorialPrecioUnidadSerializer(
            historial_precios,
            many=True
        ).data

        historial = []

        for registro in estados:

            historial.append({
                **registro,
                "tipo": "estado",
            })

        for registro in precios:

            historial.append({
                **registro,
                "tipo": "precio",
            })

        historial.sort(
            key=lambda registro: registro["fecha"],
            reverse=True
        )

        return Response(historial)

class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "groups": [
                group.name
                for group in request.user.groups.all()
            ],
        })
    
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("username")
    serializer_class = UsuarioSerializer
    permission_classes = [
        IsAuthenticated,
        EsAdministrador
    ]
    def perform_create(self, serializer):
        user = serializer.save()
        grupo = self.request.data.get("group")
        if grupo:
            group = Group.objects.get(name=grupo)
            user.groups.add(group)

class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [
        IsAuthenticated,
        EsAdministrador
    ]

BASE_DIR = Path(__file__).resolve().parent.parent

pdfmetrics.registerFont(
    TTFont(
        "Hilmar-SemiBold",
        BASE_DIR / "fonts" / "Hilmar-SemiBold.ttf"
    )
)

pdfmetrics.registerFont(
    TTFont(
        "Hilmar-SemiBold",
        BASE_DIR / "fonts" / "Hilmar-SemiBold.ttf"
    )
)
class UnidadFichaTecnicaView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, pk):

        unidad = get_object_or_404(
            Unidad.objects.select_related(
                "piso",
                "tipoUnidad",
                "piso__proyecto",
            ),
            pk=pk
        )

        tipo_unidad = unidad.tipoUnidad

        if not tipo_unidad.fichaTecnica:
            return HttpResponse(
                "Esta unidad no tiene una ficha técnica configurada.",
                status=404
            )

        IMAGE_WIDTH = 2548
        IMAGE_HEIGHT = 4340

        PAGE_WIDTH = 595.28

        PAGE_HEIGHT = (
            PAGE_WIDTH * IMAGE_HEIGHT / IMAGE_WIDTH
        )

        SCALE = PAGE_WIDTH / IMAGE_WIDTH

        piso = unidad.piso.numero
        codigo = tipo_unidad.codigo
        precio = unidad.precio

        moneda = dict(
            Unidad.MONEDAS
        ).get(
            unidad.moneda,
            ""
        )

        buffer = BytesIO()

        pdf = canvas.Canvas(
            buffer,
            pagesize=(
                PAGE_WIDTH,
                PAGE_HEIGHT
            )
        )

        imagen = ImageReader(
            tipo_unidad.fichaTecnica.path
        )

        pdf.drawImage(
            imagen,
            0,
            0,
            width=PAGE_WIDTH,
            height=PAGE_HEIGHT
        )

        precio_x = 390 * SCALE
        precio_y = PAGE_HEIGHT - (3985 * SCALE)

        pdf.setFillColor(
            HexColor("#FFFFFF")
        )

        pdf.setFont(
            "Hilmar-SemiBold",
            70 * SCALE
        )

        pdf.drawString(
            precio_x,
            precio_y,
            f"{precio:,.2f} {moneda}"
        )

        piso_x = 2330 * SCALE
        piso_y = PAGE_HEIGHT - (260 * SCALE)

        pdf.setFont("Hilmar-SemiBold",150 * SCALE)

        pdf.drawString(
            piso_x,
            piso_y,
            f"{piso}"
        )

        pdf.showPage()
        pdf.save()

        buffer.seek(0)

        response = HttpResponse(
            buffer.getvalue(),
            content_type="application/pdf"
        )

        response["Content-Disposition"] = (
            f'attachment; '
            f'filename="fichaTecnica-{codigo}-Piso{piso}.pdf"'
        )

        return response
    
class PuedeEditarUnidad(BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        return (
            request.user.groups.filter(
                name__in=["ADMINISTRADOR", "ASESOR"]
            ).exists()
        )

class UnidadEdicionUpdateView(generics.UpdateAPIView):
    queryset = Unidad.objects.all()
    serializer_class = UnidadEdicionSerializer
    permission_classes = [
        IsAuthenticated,
        PuedeEditarUnidad
    ]

class TipoVentaOpcionesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response([
            {
                "id": valor,
                "nombre": nombre
            }
            for valor, nombre in Unidad.TIPO_VENTA_CHOICES
        ])