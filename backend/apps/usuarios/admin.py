from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Comentario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "apellido", "dni", "rol", "estado")
    fieldsets = UserAdmin.fieldsets + (
        ("Datos Mega Gym", {"fields": ("dni", "apellido", "fecha_nacimiento", "rol", "estado", "profesor_asignado")}),
    )


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ("usuario", "fecha")
