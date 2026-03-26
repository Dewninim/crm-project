from rest_framework import serializers
from .models import Company, Contact

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['organization', 'created_at']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ['organization', 'created_at']

    def validate_phone(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone must contain only digits.")
        if value and not (8 <= len(value) <= 15):
            raise serializers.ValidationError("Phone must be 8 to 15 digits.")
        return value

    def validate(self, data):
        company = data.get('company')
        email = data.get('email')
        instance = self.instance
        qs = Contact.objects.filter(
            company=company,
            email=email,
            is_deleted=False
        )
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                {"email": "Email must be unique within the same company."}
            )
        return data