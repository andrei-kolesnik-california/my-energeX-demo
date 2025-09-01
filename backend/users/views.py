# views with SignupView and LoginView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]       
    authentication_classes = []          

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "full_name": user.first_name,
                "email": user.email,
            },
            status=201,
        )