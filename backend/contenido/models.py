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
    videoURL = models.URLField(
        blank=True,
        null=True
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