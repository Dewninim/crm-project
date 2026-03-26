from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Contact
from .serializers import CompanySerializer, ContactSerializer
from core.permissions import IsAdminRole, IsManagerOrAbove, IsStaffOrAbove
from logs.utils import log_action

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'industry', 'country']
    filterset_fields = ['industry', 'country']

    def get_queryset(self):
        return Company.objects.filter(
            organization=self.request.user.organization,
            is_deleted=False
        )

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAdminRole()]
        if self.action in ['update', 'partial_update']:
            return [IsManagerOrAbove()]
        return [IsStaffOrAbove()]

    def perform_create(self, serializer):
        company = serializer.save(organization=self.request.user.organization)
        log_action(self.request.user, 'CREATE', 'Company', company.id)

    def perform_update(self, serializer):
        company = serializer.save()
        log_action(self.request.user, 'UPDATE', 'Company', company.id)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
        log_action(self.request.user, 'DELETE', 'Company', instance.id)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['full_name', 'email', 'role']
    filterset_fields = ['role', 'company']

    def get_queryset(self):
        return Contact.objects.filter(
            organization=self.request.user.organization,
            is_deleted=False
        )

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAdminRole()]
        if self.action in ['update', 'partial_update']:
            return [IsManagerOrAbove()]
        return [IsStaffOrAbove()]

    def perform_create(self, serializer):
        contact = serializer.save(organization=self.request.user.organization)
        log_action(self.request.user, 'CREATE', 'Contact', contact.id)

    def perform_update(self, serializer):
        contact = serializer.save()
        log_action(self.request.user, 'UPDATE', 'Contact', contact.id)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
        log_action(self.request.user, 'DELETE', 'Contact', instance.id)