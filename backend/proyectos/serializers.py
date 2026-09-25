from rest_framework import serializers
from django.contrib.auth.models import User, Group

from .models import Empresa, Proyecto
from recorrido.serializers import (
    PisoSerializer,
    TipoUnidadSerializer,
    UnidadSerializer,
)
from contenido.serializers import (
    HeroStageSerializer,
    NosotrosSerializer,
    EquipoSerializer,
    UbicacionSerializer,
    ContactoSerializer,
)

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = [
            "id",
            "nameEmpresa",
            "logoEmpresa",
            "faviconEmpresa",
            "celular",
            "correo",
            "whatsapp",
            "facebook",
            "instagram",
            "tiktok",
        ]


class ProyectoSerializer(serializers.ModelSerializer):
    empresa = EmpresaSerializer(read_only=True)
    ubicacion = UbicacionSerializer(
        read_only=True
    )
    contacto = ContactoSerializer(
        read_only=True
    )
    pisos = PisoSerializer(
        many=True,
        read_only=True
    )
    tipoUnidad = TipoUnidadSerializer(
        many=True,
        read_only=True
    )
    unidad=UnidadSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model = Proyecto
        fields = [
            "id",
            "empresa",
            "nombreProyecto",
            "logoProyecto",
            "faviconProyecto",
            "descripcion",
            "estado",
            "brochure",
            "viewBox",
            
            "ubicacion",
            "contacto",

            "pisos",
            "tipoUnidad",
            "unidad",
        ]

class ProyectoBaseSerializer(serializers.ModelSerializer):

    empresa = EmpresaSerializer(read_only=True)

    class Meta:
        model = Proyecto
        fields = [
            "id",
            "empresa",
            "nombreProyecto",
            "logoProyecto",
            "descripcion",
            "estado",
            "brochure",
        ]

class NosotrosPageSerializer(serializers.ModelSerializer):

    nosotros = NosotrosSerializer(
        read_only=True
    )

    equipo = EquipoSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Proyecto
        fields = [
            "nosotros",
            "equipo",
        ]

class ProyectoHeroSerializer(serializers.ModelSerializer):

    hero = HeroStageSerializer(
        source="hero_stages",
        many=True,
        read_only=True
    )

    class Meta:
        model = Proyecto
        fields = [
            "id",
            "nombreProyecto",
            "logoProyecto",
            "hero",
        ]

class UsuarioSerializer(serializers.ModelSerializer):

    groups = serializers.SerializerMethodField()

    password = serializers.CharField(
        write_only=True,
        required=False
    )

    group = serializers.CharField(
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "is_active",
            "groups",
            "group",
        ]

    def get_groups(self, obj):
        return [
            group.name
            for group in obj.groups.all()
        ]

    def capitalizar_nombre(self, texto):
        return " ".join(
            palabra.capitalize()
            for palabra in texto.strip().split()
        )

    def create(self, validated_data):

        password = validated_data.pop(
            "password",
            None
        )

        group_name = validated_data.pop(
            "group",
            None
        )

        validated_data["first_name"] = self.capitalizar_nombre(
            validated_data.get("first_name", "")
        )

        validated_data["last_name"] = self.capitalizar_nombre(
            validated_data.get("last_name", "")
        )

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        if group_name:

            group = Group.objects.get(
                name=group_name
            )

            user.groups.add(group)

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop(
            "password",
            None
        )

        group_name = validated_data.pop(
            "group",
            None
        )

        # Capitalizar nombre y apellido
        if "first_name" in validated_data:

            validated_data["first_name"] = (
                self.capitalizar_nombre(
                    validated_data["first_name"]
                )
            )

        if "last_name" in validated_data:

            validated_data["last_name"] = (
                self.capitalizar_nombre(
                    validated_data["last_name"]
                )
            )

        # Actualizar campos
        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value
            )

        # Cambiar contraseña
        if password:

            instance.set_password(
                password
            )

        instance.save()

        # Cambiar grupo
        if group_name:

            group = Group.objects.get(
                name=group_name
            )

            instance.groups.clear()
            instance.groups.add(group)

        return instance