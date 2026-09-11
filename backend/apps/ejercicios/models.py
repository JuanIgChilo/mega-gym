from django.db import models


class Accesorio(models.Model):
    """RF.9: Accesorio/Elemento (Incluye: descripción)."""
    descripcion = models.CharField(max_length=200)

    def __str__(self):
        return self.descripcion


class Ejercicio(models.Model):
    """RF.8: Ejercicio (Incluye: nombre de ejercicio, URL ejercicio)."""
    nombre_ejercicio = models.CharField(max_length=150)
    url_ejercicio = models.URLField(blank=True, null=True)
    accesorios = models.ManyToManyField(Accesorio, blank=True, related_name="ejercicios")
    maquinas = models.ManyToManyField(
        "maquinas.Maquina", blank=True, related_name="ejercicios"
    )

    def __str__(self):
        return self.nombre_ejercicio


class Peso(models.Model):
    """RF.10: peso asociado a un ejercicio dentro de una rutina."""
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE, related_name="pesos")
    cantidad = models.IntegerField()


class Serie(models.Model):
    """RF.10: series de un ejercicio."""
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE, related_name="series")
    cantidad = models.IntegerField()


class Repeticion(models.Model):
    """RF.10: repeticiones asociadas a una serie."""
    serie = models.ForeignKey(Serie, on_delete=models.CASCADE, related_name="repeticiones")
    cantidad = models.IntegerField()
