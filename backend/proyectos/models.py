from django.db import models


class Empresa(models.Model):
    nameEmpresa = models.CharField(max_length=100)
    logoEmpresa = models.ImageField(
        upload_to="empresa/",
        blank=True,
        null=True
    )
    faviconEmpresa = models.ImageField(
        upload_to="empresa/",
        blank=True,
        null=True
    )
    celular = models.CharField(
        max_length=30,
        blank=True
    )
    correo = models.EmailField(
        blank=True
    )
    whatsapp = models.CharField(
        max_length=30,
        blank=True
    )
    facebook = models.URLField(
        blank=True
    )
    instagram = models.URLField(
        blank=True
    )
    tiktok = models.URLField(
        blank=True
    )

    def __str__(self):
        return self.nameEmpresa


class Proyecto(models.Model):
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name="proyectos"
    )
    nombreProyecto = models.CharField(
        max_length=150
    )
    logoProyecto = models.ImageField(
        upload_to="proyecto/logo/",
        blank=True,
        null=True
    )
    faviconProyecto = models.ImageField(
        upload_to="proyecto/logo/",
        blank=True,
        null=True
    )
    descripcion = models.TextField(
        blank=True
    )
    estado = models.CharField(
        max_length=50
    )
    brochure = models.FileField(
        upload_to="proyecto/brochure/",
        blank=True,
        null=True
    )
    viewBox = models.CharField(
        max_length=100,
    )

    def __str__(self):
        return self.nombreProyecto