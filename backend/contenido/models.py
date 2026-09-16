from django.db import models

from proyectos.models import Proyecto


class HeroStage(models.Model):
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="hero_stages"
    )
    video = models.FileField(
        upload_to="proyecto/hero/videos/"
    )
    poster = models.ImageField(
        upload_to="proyecto/hero/posters/",
        blank=True,
        null=True
    )
    imagenHero = models.ImageField(
        upload_to="proyecto/hero/images/",
        blank=True,
        null=True
    )
    title = models.CharField(
        max_length=200,
        blank=True
    )
    subtitle = models.TextField(
        blank=True
    )
    button = models.CharField(
        max_length=100,
        blank=True
    )
    orden = models.PositiveIntegerField(
        default=0
    )
    class Meta:
        ordering = ["orden"]
    def __str__(self):
        return f"{self.proyecto.nombreProyecto} - Stage {self.orden}"

class Ubicacion(models.Model):
    proyecto = models.OneToOneField(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="ubicacion"
    )
    ciudad = models.CharField(
        max_length=100
    )
    direccion = models.CharField(
        max_length=255
    )
    imageUbicacion = models.ImageField(
        upload_to="proyecto/ubicacion/",
        blank=True,
        null=True
    )
    imageUbicacionMobile = models.ImageField(
        upload_to="proyecto/ubicacion/",
        blank=True,
        null=True
    )
    linkUbicacion = models.URLField(
        blank=True
    )
    iframeUbicacion = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"Ubicación - {self.proyecto.nombreProyecto}"


class Contacto(models.Model):
    proyecto = models.OneToOneField(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="contacto"
    )
    numeroContacto = models.CharField(
        max_length=30
    )
    correo = models.EmailField()
    whatsappLink = models.URLField(
        blank=True
    )
    imagecontacto = models.ImageField(
        upload_to="proyecto/contacto/",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Contacto - {self.proyecto.nombreProyecto}"


class Nosotros(models.Model):
    proyecto = models.OneToOneField(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="nosotros"
    )
    mision = models.TextField(
        blank=True
    )
    vision = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"Nosotros - {self.proyecto.nombreProyecto}"


class ImageNosotros(models.Model):
    nosotros = models.ForeignKey(
        Nosotros,
        on_delete=models.CASCADE,
        related_name="imagenes"
    )
    image = models.ImageField(
        upload_to="proyecto/nosotros/"
    )
    orden = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["orden"]

    def __str__(self):
        return f"Imagen Nosotros - {self.nosotros.proyecto.nombreProyecto}"


class Equipo(models.Model):
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="equipo"
    )
    nombres = models.CharField(
        max_length=100
    )
    apellidos = models.CharField(
        max_length=100
    )
    cargo = models.CharField(
        max_length=150
    )
    foto = models.ImageField(
        upload_to="proyecto/equipo/",
        blank=True,
        null=True
    )
    descripcion = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

class Avance(models.Model):
    MESES = [
        (1, "Enero"),
        (2, "Febrero"),
        (3, "Marzo"),
        (4, "Abril"),
        (5, "Mayo"),
        (6, "Junio"),
        (7, "Julio"),
        (8, "Agosto"),
        (9, "Septiembre"),
        (10, "Octubre"),
        (11, "Noviembre"),
        (12, "Diciembre"),
    ]
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name="avances"
    )
    mes = models.PositiveSmallIntegerField(
        choices=MESES
    )
    anio = models.PositiveIntegerField()
    porcentaje = models.PositiveSmallIntegerField(
        default=0
    )
    descripcion = models.TextField(
        blank=True
    )

    class Meta:
            ordering = ["anio", "mes"]
            constraints = [
                models.UniqueConstraint(
                    fields=["proyecto", "mes", "anio"],
                    name="avance_unico_por_mes"
                ),
            ]

    def __str__(self):
        nombre_mes = dict(self.MESES).get(self.mes)
        return f"{nombre_mes} {self.anio} - {self.porcentaje}%"


class ImageAvance(models.Model):
    avance = models.ForeignKey(
        Avance,
        on_delete=models.CASCADE,
        related_name="imagenes"
    )
    imagen = models.ImageField(
        upload_to="proyecto/avances/"
    )

    def __str__(self):
        return f"Imagen avance - {self.avance}"