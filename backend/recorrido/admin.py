from django.contrib import admin

from .models import (
    CategoriaUnidad,
    TipoUnidad,
    Piso,
    ImageTipoUnidad,
    Unidad,
    HistorialEstadoUnidad,
    HistorialPrecioUnidad,
)

class ImageTipoUnidadInline(admin.TabularInline):
    model = ImageTipoUnidad
    extra = 1
    fields = ("image",)

class UnidadInline(admin.TabularInline):
    model = Unidad
    extra = 1

    fields = (
        "tipoUnidad",
        "estado",
        "precio",
        "moneda",
    )

@admin.register(CategoriaUnidad)
class CategoriaUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "nombre",
    )

    search_fields = (
        "nombre",
    )

@admin.register(TipoUnidad)
class TipoUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "codigo",
        "nombre",
        "categoria",
        "proyecto",
        "tipo",
        "superficie",
    )

    list_filter = (
        "categoria",
        "proyecto",
        "tipo",
    )

    search_fields = (
        "codigo",
        "nombre",
        "tipo",
    )

    inlines = [
        ImageTipoUnidadInline,
    ]

@admin.register(Piso)
class PisoAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "numero",
        "nombrePiso",
        "proyecto",
    )

    list_filter = (
        "proyecto",
    )

    search_fields = (
        "nombrePiso",
    )

    inlines = [
        UnidadInline,
    ]

@admin.register(ImageTipoUnidad)
class ImageTipoUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "tipoUnidad",
        "image",
    )

    list_filter = (
        "tipoUnidad",
    )

@admin.register(Unidad)
class UnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "tipoUnidad",
        "piso",
        "estado",
        "precio",
        "moneda",
    )

    list_filter = (
        "estado",
        "moneda",
        "tipoUnidad__categoria",
        "piso__proyecto",
    )

    search_fields = (
        "tipoUnidad__codigo",
        "tipoUnidad__nombre",
    )


@admin.register(HistorialEstadoUnidad)
class HistorialEstadoUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "unidad",
        "estado_anterior",
        "estado_nuevo",
        "usuario",
        "fecha",
    )

    list_filter = (
        "estado_anterior",
        "estado_nuevo",
        "fecha",
    )

    readonly_fields = (
        "fecha",
    )
    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(HistorialPrecioUnidad)
class HistorialPrecioUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "unidad",
        "precio_anterior",
        "precio_nuevo",
        "usuario",
        "fecha",
    )

    list_filter = (
        "fecha",
    )

    readonly_fields = (
        "fecha",
    )
    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

from django.contrib import admin
from django.utils.html import format_html

from .models import HistorialVentaUnidad


@admin.register(HistorialVentaUnidad)
class HistorialVentaUnidadAdmin(admin.ModelAdmin):

    list_display = (
        "unidad",
        "tipo_venta",
        "usuario",
        "fecha",
        "documento",
    )

    list_filter = (
        "tipoVenta",
        "fecha",
    )

    search_fields = (
        "unidad__id",
        "usuario__username",
    )

    ordering = ("-fecha",)

    def tipo_venta(self, obj):
        return obj.get_tipoVenta_display() if obj.tipoVenta else "-"
    tipo_venta.short_description = "Tipo de venta"

    def documento(self, obj):
        if obj.documentoVenta:
            return format_html(
                '<a href="{}" target="_blank">Ver documento</a>',
                obj.documentoVenta.url
            )
        return "-"
    documento.short_description = "Documento"

    # SOLO LECTURA
    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False