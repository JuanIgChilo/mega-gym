from rest_framework.permissions import BasePermission


class EsProfesor(BasePermission):
    """RNF.4: acceso limitado a la información según los roles establecidos."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.es_profesor
        )


class EsAlumno(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.es_alumno
        )


class EsProfesorOAlumnoPropio(BasePermission):
    """El profesor ve todo; el alumno solo sus propios datos."""
    def has_object_permission(self, request, view, obj):
        if request.user.es_profesor:
            return True
        # obj puede ser Usuario o tener atributo usuario
        target = obj if hasattr(obj, "es_alumno") else getattr(obj, "usuario", None)
        return target == request.user

class EsSuperAdmin(BasePermission):
    """Solo el dueño del sistema (superusuario) puede dar de alta profesores."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )