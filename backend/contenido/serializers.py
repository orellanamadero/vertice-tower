from rest_framework import serializers

from .models import (
    HeroStage,
    Ubicacion,
    Contacto,
    Nosotros,
    ImageNosotros,
    Equipo,
    Avance,
    ImageAvance,
)
from proyectos.models import Proyecto

class HeroStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroStage
        fields = [
            "id",
            "video",
            "poster",
            "imagenHero",
            "title",
            "subtitle",
            "button",
            "orden",
        ]


class ImageNosotrosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageNosotros
        fields = [
            "id",
            "image",
            "orden",
        ]


class NosotrosSerializer(serializers.ModelSerializer):
    imagenes = ImageNosotrosSerializer(many=True, read_only=True)
    class Meta:
        model = Nosotros
        fields = [
            "id",
            "mision",
            "vision",
            "imagenes",
        ]


class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = [
            "id",
            "nombres",
            "apellidos",
            "cargo",
            "foto",
            "descripcion",
        ]

class ImageAvanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAvance
        fields = [
            "id",
            "imagen",
        ]


class AvanceSerializer(serializers.ModelSerializer):
    imagenes = ImageAvanceSerializer(many=True, read_only=True)
    nombreMes = serializers.CharField(
        source="get_mes_display",
        read_only=True
    )

    class Meta:
        model = Avance
        fields = [
            "id",
            "mes",
            "nombreMes",
            "anio",
            "porcentaje",
            "descripcion",
            "imagenes",
        ]


class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = [
            "id",
            "ciudad",
            "direccion",
            "imageUbicacion",
            "imageUbicacionMobile",
            "linkUbicacion",
            "iframeUbicacion",
        ]
class ProyectoNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            "id",
            "nombreProyecto",
        ]

class ContactoSerializer(serializers.ModelSerializer):
    proyecto = ProyectoNombreSerializer(read_only=True)
    class Meta:
        model = Contacto
        fields = [
            "id",
            "numeroContacto",
            "correo",
            "whatsappLink",
            "imagecontacto",
            "proyecto",
        ]