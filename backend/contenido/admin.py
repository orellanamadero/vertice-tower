from django.contrib import admin

from .models import (
    HeroStage,
    Ubicacion,
    Contacto,
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