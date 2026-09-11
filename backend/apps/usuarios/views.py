from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario, Comentario, EstadoUsuario
from .serializers import UsuarioSerializer, UsuarioCreateSerializer, ComentarioSerializer
from .permissions import EsProfesor


class UsuarioViewSet(viewsets.ModelViewSet):
    """RF.1, RF.2, RF.3, RF.4: CRUD de usuarios. Alta reservada al profesor."""
    queryset = Usuario.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy", "list"]:
            return [EsProfesor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Usuario.objects.all()
        rol = self.request.query_params.get("rol")
        if rol:
            qs = qs.filter(rol=rol)
        return qs

    def create(self, request, *args, **kwargs):
        if request.data.get("rol") == "profesor" and not request.user.is_superuser:
            raise PermissionDenied(
                "Solo el administrador del sistema puede dar de alta profesores."
            )
        return super().create(request, *args, **kwargs)


class ComentarioViewSet(viewsets.ModelViewSet):
    """RF.24, RF.25: comentarios. Crea el Alumno, visualizan Alumno y Profesor."""
    serializer_class = ComentarioSerializer

    def get_queryset(self):
        user = self.request.user
        if user.es_profesor:
            return Comentario.objects.all()
        return Comentario.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_alumno(request):
    """
    Login del alumno por DNI (ver mockup 'Ingrese su DNI o credencial de socio').
    RF: acceso mediante DNI a información personal.
    """
    dni = request.data.get("dni")
    if not dni:
        return Response({"detail": "Debe ingresar un DNI."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        usuario = Usuario.objects.get(dni=dni, rol="alumno")
    except Usuario.DoesNotExist:
        return Response(
            {"detail": "No se encontraron datos para ese DNI."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if usuario.estado != EstadoUsuario.ACTIVO:
        return Response(
            {"detail": "El usuario se encuentra inactivo. Contacte a su profesor."},
            status=status.HTTP_403_FORBIDDEN,
        )

    refresh = RefreshToken.for_user(usuario)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "usuario": UsuarioSerializer(usuario).data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mi_perfil(request):
    """RF.29: el usuario ve su estado de actividad (Activo/Inactivo)."""
    return Response(UsuarioSerializer(request.user).data)


