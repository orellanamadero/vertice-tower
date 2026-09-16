from django.contrib import admin

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


@admin.register(HeroStage)
class HeroStageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proyecto",
        "orden",
        "title",
        "video",
        "poster",
    )
    list_filter = ("proyecto",)
    search_fields = (
        "title",
        "subtitle",
        "proyecto__nombreProyecto",
    )
    ordering = ("proyecto", "orden")


@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proyecto",
        "ciudad",
        "direccion",
    )
    list_filter = ("ciudad",)
    search_fields = (
        "proyecto__nombreProyecto",
        "ciudad",
        "direccion",
    )


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proyecto",
        "numeroContacto",
        "correo",
    )
    search_fields = (
        "proyecto__nombreProyecto",
        "numeroContacto",
        "correo",
    )


@admin.register(Nosotros)
class NosotrosAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proyecto",
    )
    search_fields = (
        "proyecto__nombreProyecto",
    )


@admin.register(ImageNosotros)
class ImageNosotrosAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nosotros",
        "orden",
        "image",
    )
    list_filter = (
        "nosotros__proyecto",
    )
    ordering = (
        "nosotros",
        "orden",
    )


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proyecto",
        "nombres",
        "apellidos",
        "cargo",
    )
    list_filter = (
        "proyecto",
    )
    search_fields = (
        "nombres",
        "apellidos",
        "cargo",
        "proyecto__nombreProyecto",
    )

class ImageAvanceInline(admin.TabularInline):
    model = ImageAvance
    extra = 1


@admin.register(Avance)
class AvanceAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "proyecto",
        "mes",
        "anio",
        "porcentaje",
    )

    list_filter = (
        "proyecto",
        "anio",
        "mes",
    )

    search_fields = (
        "proyecto__nombreProyecto",
        "descripcion",
    )

    ordering = (
        "proyecto",
        "-anio",
        "-mes",
    )

    inlines = [
        ImageAvanceInline,
    ]


@admin.register(ImageAvance)
class ImageAvanceAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "avance",
        "imagen",
    )

    list_filter = (
        "avance__proyecto",
    )