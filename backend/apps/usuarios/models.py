from django.contrib.auth.models import AbstractUser
from django.db import models


class EstadoUsuario(models.TextChoices):
    """<<enum: EstadoUsuario>> Estado = Activo, Inactivo (ver Diagrama de Clases de Diseño)"""
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"


class RolUsuario(models.TextChoices):
    ALUMNO = "alumno", "Alumno"
    PROFESOR = "profesor", "Profesor"


class Usuario(AbstractUser):
    """
    Clase Usuario del Diagrama de Clases de Diseño.
    Se especializa en Alumno / Profesor (RF.1, RF.2, RF.3, RF.26).
    Login del alumno: por DNI (ver mockups). Login del profesor: usuario/clave.
    """
    dni = models.CharField(max_length=10, unique=True)
    apellido = models.CharField(max_length=150)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    rol = models.CharField(max_length=10, choices=RolUsuario.choices)
    estado = models.CharField(
        max_length=10, choices=EstadoUsuario.choices, default=EstadoUsuario.ACTIVO
    )
    # RF.4: asociar un usuario (alumno) con un profesor
    profesor_asignado = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="alumnos_asignados",
        limit_choices_to={"rol": RolUsuario.PROFESOR},
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["dni", "apellido", "email"]

    def __str__(self):
        return f"{self.first_name} {self.apellido} ({self.dni})"

    @property
    def es_alumno(self):
        return self.rol == RolUsuario.ALUMNO

    @property
    def es_profesor(self):
        return self.rol == RolUsuario.PROFESOR


class Comentario(models.Model):
    """RF.24, RF.25: comentarios creados por el alumno, visibles por alumno y profesor."""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="comentarios")
    comentario = models.TextField()
    fecha = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha"]

    def __str__(self):
        return f"Comentario de {self.usuario} - {self.fecha}"
