from rest_framework import serializers
from django.db import transaction
from pathlib import Path
from django.core.files.base import ContentFile

from .models import (
    Piso,
    TipoUnidad,
    ImageTipoUnidad,
    Unidad,
    HistorialEstadoUnidad,
    HistorialPrecioUnidad,
    CategoriaUnidad,
    HistorialVentaUnidad
)

class CategoriaUnidadSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoriaUnidad

        fields = [
            "id",
            "nombre",
        ] 

class ImageTipoUnidadSerializer(serializers.ModelSerializer):

    class Meta:
        model = ImageTipoUnidad

        fields = [
            "id",
            "image",
        ]

class TipoUnidadSerializer(serializers.ModelSerializer):

    galeria = ImageTipoUnidadSerializer(
        many=True,
        read_only=True
    )

    categoriaNombre = serializers.CharField(
        source="categoria.nombre",
        read_only=True
    )

    class Meta:
        model = TipoUnidad

        fields = [
            "id",
            "proyecto",
            "codigo",
            "nombre",
            "categoria",
            "categoriaNombre",
            "tipo",
            "superficie",
            "dormitorios",
            "banos",
            "sala",
            "lavanderia",
            "cocina",
            "comedor",
            "render3D",
            "planoTecnico",
            "frame",
            "tour360",
            "path",
            "x",
            "y",
            "galeria",
            "fichaTecnica"
        ]

class UnidadSerializer(serializers.ModelSerializer):

    tipoUnidad = TipoUnidadSerializer(
        read_only=True
    )

    tipoMoneda = serializers.CharField(
        source="get_moneda_display",
        read_only=True
    )

    numeroPiso = serializers.IntegerField(
        source="piso.numero",
        read_only=True
    )

    estadoNombre = serializers.CharField(
        source="get_estado_display",
        read_only=True
    )
    tipoVentaNombre = serializers.CharField(
        source="get_tipoVenta_display",
        read_only=True
    ) 

    class Meta:
        model = Unidad

        fields = [
            "id",
            "piso",
            "numeroPiso",
            "tipoUnidad",
            "estado",
            "estadoNombre",
            "precio",

            # Valor numérico para editar
            "moneda",

            # Texto para mostrar
            "tipoMoneda",

            # Datos de venta
            "tipoVenta",
            "documentoVenta",
            "tipoVentaNombre",
        ]
        
class UnidadEstadoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Unidad
        fields = ["estado"]

    def update(self, instance, validated_data):
        estado_anterior = instance.estado
        estado_nuevo = validated_data["estado"]

        if estado_anterior != estado_nuevo:
            instance.estado = estado_nuevo
            instance.save()

            HistorialEstadoUnidad.objects.create(
                unidad=instance,
                estado_anterior=estado_anterior,
                estado_nuevo=estado_nuevo,
                usuario=self.context["request"].user
            )

        return instance

class UnidadPrecioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Unidad
        fields = ["precio"]

    def update(self, instance, validated_data):

        precio_anterior = instance.precio
        precio_nuevo = validated_data["precio"]

        if precio_anterior != precio_nuevo:

            instance.precio = precio_nuevo
            instance.save()

            HistorialPrecioUnidad.objects.create(
                unidad=instance,
                precio_anterior=precio_anterior,
                precio_nuevo=precio_nuevo,
                usuario=self.context["request"].user
            )

        return instance

class PisoSerializer(serializers.ModelSerializer):

    unidades = UnidadSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Piso

        fields = [
            "id",
            "numero",
            "nombrePiso",
            "imagePiso",
            "unidades",
        ]

class HistorialEstadoUnidadSerializer(serializers.ModelSerializer):
    unidad_id = serializers.IntegerField(
        source="unidad.id",
        read_only=True
    )

    unidad_codigo = serializers.CharField(
        source="unidad.tipoUnidad.codigo",
        read_only=True
    )

    numero_piso = serializers.IntegerField(
        source="unidad.piso.numero",
        read_only=True
    )

    nombre_piso = serializers.CharField(
        source="unidad.piso.nombrePiso",
        read_only=True
    )

    usuario_nombre = serializers.CharField(
        source="usuario.username",
        read_only=True
    )

    estado_anterior_nombre = serializers.CharField(
        source="get_estado_anterior_display",
        read_only=True
    )

    estado_nuevo_nombre = serializers.CharField(
        source="get_estado_nuevo_display",
        read_only=True
    )

    tipo_venta_nombre = serializers.CharField(
        source="venta.get_tipoVenta_display",
        read_only=True,
        allow_null=True
    )

    documento_venta = serializers.SerializerMethodField(
        source="venta.documentoVenta",
        read_only=True,
        allow_null=True
    )

    def get_documento_venta(self, obj):
        if not obj.venta:
            return None

        if not obj.venta.documentoVenta:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.venta.documentoVenta.url
            )

        return obj.venta.documentoVenta.url
    
    class Meta:
            model = HistorialEstadoUnidad
            fields = [
                "id",
                "unidad_id",
                "unidad_codigo",
                "numero_piso",
                "nombre_piso",
                "estado_anterior",
                "estado_nuevo",
                "estado_anterior_nombre",
                "estado_nuevo_nombre",
                "tipo_venta_nombre",
                "documento_venta",
                "usuario_nombre",
                "fecha",
            ]

class HistorialPrecioUnidadSerializer(serializers.ModelSerializer):

    unidad_codigo = serializers.CharField(
        source="unidad.tipoUnidad.codigo",
        read_only=True
    )

    numero_piso = serializers.IntegerField(
        source="unidad.piso.numero",
        read_only=True
    )

    nombre_piso = serializers.CharField(
        source="unidad.piso.nombrePiso",
        read_only=True
    )

    usuario_nombre = serializers.CharField(
        source="usuario.username",
        read_only=True
    )

    class Meta:
        model = HistorialPrecioUnidad

        fields = [
            "id",
            "unidad_codigo",
            "numero_piso",
            "nombre_piso",
            "precio_anterior",
            "precio_nuevo",
            "usuario_nombre",
            "fecha",
        ]

class UnidadEdicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = [
            "precio",
            "moneda",
            "estado",
            "tipoVenta",
            "documentoVenta",
        ]
    def validate(self, attrs):
        usuario = self.context["request"].user
        if not usuario.groups.filter(
            name="ADMINISTRADOR"
        ).exists():
            if "precio" in attrs or "moneda" in attrs:
                raise serializers.ValidationError({
                    "permiso":
                    "Solo un administrador puede modificar el precio o la moneda."
                })
        estado_anterior = self.instance.estado
        estado_nuevo = attrs.get(
            "estado",
            estado_anterior
        )
        documento_nuevo = attrs.get(
            "documentoVenta"
        )
        documento_actual = self.instance.documentoVenta
        if estado_nuevo in [2, 3]:
            tipo_venta = attrs.get(
                "tipoVenta",
                self.instance.tipoVenta
            )
            if not tipo_venta:
                raise serializers.ValidationError({
                    "tipoVenta":
                    "Debe seleccionar el tipo de venta."
                })
            if (
                estado_anterior != estado_nuevo
                and not documento_nuevo
            ):
                raise serializers.ValidationError({
                    "documentoVenta":
                    "Debe adjuntar el documento de respaldo."
                })
            if (
                estado_anterior == estado_nuevo
                and not documento_nuevo
                and not documento_actual
            ):
                raise serializers.ValidationError({
                    "documentoVenta":
                    "Debe adjuntar el documento de respaldo."
                })

        elif estado_nuevo == 1:
            attrs["tipoVenta"] = None
        return attrs

    def validate_documentoVenta(self, value):
        if value:
            if value.content_type != "application/pdf":
                raise serializers.ValidationError(
                    "El documento debe estar en formato PDF."
                )
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "El documento no puede superar los 5 MB."
                )
        return value

    def update(self, instance, validated_data):
        estado_anterior = instance.estado
        precio_anterior = instance.precio
        estado_nuevo = validated_data.get(
            "estado",
            instance.estado
        )
        precio_nuevo = validated_data.get(
            "precio",
            instance.precio
        )
        usuario = self.context["request"].user
        with transaction.atomic():
            documento_anterior = instance.documentoVenta
            instance = super().update(
                instance,
                validated_data
            )
            historial_documento = None
            if (
                estado_anterior != estado_nuevo
                and estado_nuevo in [2, 3]
            ):
                if instance.documentoVenta:
                    archivo = instance.documentoVenta
                    archivo.open("rb")
                    contenido = archivo.read()
                    nombre = Path(
                        archivo.name
                    ).name
                    historial_documento = (
                        HistorialVentaUnidad.objects.create(
                            unidad=instance,
                            tipoVenta=instance.tipoVenta,
                            usuario=usuario
                        )
                    )
                    historial_documento.documentoVenta.save(
                        nombre,
                        ContentFile(contenido),
                        save=True
                    )
                    archivo.close()
            if estado_anterior != estado_nuevo:
                HistorialEstadoUnidad.objects.create(
                    unidad=instance,
                    estado_anterior=estado_anterior,
                    estado_nuevo=estado_nuevo,
                    venta=historial_documento,
                    usuario=usuario
                )
            if precio_anterior != precio_nuevo:
                HistorialPrecioUnidad.objects.create(
                    unidad=instance,
                    precio_anterior=precio_anterior,
                    precio_nuevo=precio_nuevo,
                    usuario=usuario
                )
            if (
                estado_anterior != 1
                and estado_nuevo == 1
            ):
                if documento_anterior:
                    documento_anterior.delete(
                        save=False
                    )
                instance.documentoVenta = None
                instance.tipoVenta = None
                instance.save(
                    update_fields=[
                        "documentoVenta",
                        "tipoVenta"
                    ]
                )
        return instance