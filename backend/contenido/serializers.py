from rest_framework import serializers

from .models import (
    HeroStage,
    Ubicacion,
    Contacto,
)
from proyectos.models import Proyecto

class HeroStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroStage
        fields = [
            "id",
            "video",
            "videoURL",
            "poster",
            "imagenHero",
            "title",
            "subtitle",
            "button",
            "orden",
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