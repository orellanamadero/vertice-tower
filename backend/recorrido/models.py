from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from proyectos.models import Proyecto
from django.core.exceptions import ValidationError

def piso_image_path(instance, filename):
    return f"proyecto/pisos/{instance.numero}/{filename}"

def unidad_render_path(instance, filename):
    return f"proyecto/unidades/{instance.codigo}/render/{filename}"

def unidad_plano_path(instance, filename):
    return f"proyecto/unidades/{instance.codigo}/plano/{filename}"

def unidad_frame_path(instance, filename):
    return f"proyecto/unidades/{instance.codigo}/frame/{filename}"

def unidad_galeria_path(instance, filename):
    return f"proyecto/unidades/{instance.tipoUnidad.codigo}/galeria/{filename}"

def tipo_unidad_ficha_path(instance, filename):
    return f"proyecto/unidades/{instance.codigo}/ficha/{filename}"

class CategoriaUnidad(models.Model):
    nombre = models.CharField(
        max_length=100,
        unique=True
    )
    def __str__(self):
        return self.nombre

class TipoUnidad(models.Model):
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="tipos_unidad"
    )
    codigo = models.CharField(
        max_length=20
    )
    nombre = models.CharField(
        max_length=100
    )
    categoria = models.ForeignKey(
        CategoriaUnidad,
        on_delete=models.PROTECT,
        related_name="tipos_unidad"
    )
    tipo = models.CharField(
        max_length=100
    )
    superficie = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    dormitorios = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    banos = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    sala = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    lavanderia = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    cocina = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    comedor = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    render3D = models.ImageField(
        upload_to=unidad_render_path,
        blank=True,
        null=True
    )
    planoTecnico = models.ImageField(
        upload_to=unidad_plano_path,
        blank=True,
        null=True
    )
    frame = models.ImageField(
        upload_to=unidad_frame_path,
        blank=True,
        null=True
    )
    tour360 = models.URLField(
        blank=True,
        null=True
    )
    fichaTecnica = models.ImageField(
        upload_to=tipo_unidad_ficha_path,
        blank=True,
        null=True
    )
    path = models.TextField(
        blank=True,
        null=True
    )
    x = models.FloatField(
        null=True,
        blank=True
    )
    y = models.FloatField(
        null=True,
        blank=True
    )
    def __str__(self):
        return self.codigo
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["proyecto", "codigo"],
                name="unique_codigo_tipo_unidad_proyecto"
            )
        ]
    
class Piso(models.Model):
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="pisos"
    )
    numero = models.IntegerField()
    nombrePiso = models.CharField(
        max_length=100
    )
    imagePiso = models.ImageField(
        upload_to=piso_image_path
    )
    def __str__(self):
        return self.nombrePiso
    
class ImageTipoUnidad(models.Model):
    tipoUnidad = models.ForeignKey(
        TipoUnidad,
        on_delete=models.CASCADE,
        related_name="galeria"
    )
    image = models.ImageField(
        upload_to=unidad_galeria_path
    )
    def __str__(self):
        return f"Imagen {self.tipoUnidad.codigo}"

class Unidad(models.Model):
    ESTADOS=[
        (1, "Disponible"),
        (2, "Vendido"),
        (3, "Reservado"),
    ]
    MONEDAS=[
        (1, "$US"),
        (2, "BOB")
    ]
    TIPO_VENTA_CHOICES = [
        (1, "Pago total al contado"),
        (2, "Anticipo / Reserva"),
        (3, "Pagos parciales / Escalonados"),
        (4, "Venta a plazos / Con reserva de propiedad"),
        (5, "Crédito hipotecario (Bancario)"),
    ]
    piso = models.ForeignKey(
        Piso,
        on_delete=models.CASCADE,
        related_name="unidades"
    )
    tipoUnidad = models.ForeignKey(
        TipoUnidad,
        on_delete=models.PROTECT,
        related_name="unidades"
    )
    estado = models.PositiveSmallIntegerField(
        choices=ESTADOS,
        default=1
    )
    precio = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    moneda = models.PositiveSmallIntegerField(
        choices=MONEDAS,
        null=True,
        blank=True
    )
    tipoVenta = models.PositiveSmallIntegerField(
        choices=TIPO_VENTA_CHOICES,
        null=True,
        blank=True,
    )
    documentoVenta = models.FileField(
        upload_to="proyecto/ventas/",
        null=True,
        blank=True,
    ) 
    class Meta:
        permissions = [
            ("cambiar_estado_unidad", "Puede cambiar estado de unidad"),
            ("ver_historial_unidad", "Puede ver historial de unidades"),
    ] 
        
    def __str__(self):
        return f"{self.tipoUnidad.codigo} - {self.piso.nombrePiso}"
    
    def clean(self):
        super().clean()
        es_area_comun = (
            self.tipoUnidad
            and self.tipoUnidad.categoria
            and self.tipoUnidad.categoria.nombre.upper() == "AREA COMUN"
        )
        if es_area_comun:
            self.precio = None
            self.moneda = None
        else:
            if not self.moneda:
                raise ValidationError({
                    "moneda": "Debe seleccionar una moneda."
                })

class HistorialEstadoUnidad(models.Model):
    unidad = models.ForeignKey(
        Unidad,
        on_delete=models.CASCADE,
        related_name="historial_estados"
    )
    estado_anterior = models.PositiveSmallIntegerField(
        choices=Unidad.ESTADOS
    )
    estado_nuevo = models.PositiveSmallIntegerField(
        choices=Unidad.ESTADOS
    )
    venta = models.ForeignKey(
        "HistorialVentaUnidad",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cambio_estado"
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    fecha = models.DateTimeField(
        auto_now_add=True
    )

class HistorialPrecioUnidad(models.Model):
    unidad = models.ForeignKey(
        Unidad,
        on_delete=models.CASCADE,
        related_name="historial_precios"
    )
    precio_anterior = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    precio_nuevo = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    fecha = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return (
            f"{self.unidad} - "
            f"{self.precio_anterior} → "
            f"{self.precio_nuevo}"
        )

class HistorialVentaUnidad(models.Model):
    unidad = models.ForeignKey(
        Unidad,
        on_delete=models.CASCADE,
        related_name="historial_ventas"
    )
    tipoVenta = models.PositiveSmallIntegerField(
        choices=Unidad.TIPO_VENTA_CHOICES,
        null=True,
        blank=True,
    )
    documentoVenta = models.FileField(
        upload_to="proyecto/historial_ventas/"
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    fecha = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Documento histórico - Unidad {self.unidad.id}"