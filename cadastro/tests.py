from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Cliente, Equipamento, Locacao, ItemLocacao, AuditLog
from datetime import date, timedelta


class ClienteModelTest(TestCase):
    def test_criar_cliente(self):
        cliente = Cliente.objects.create(
            nome_razao="Empresa XPTO",
            tipo_pessoa="J",
            cpf_cnpj="12345678000199",
            email="teste@empresa.com",
            telefone="11999999999",
            endereco="Rua das Flores, 100"
        )
        self.assertEqual(str(cliente), "Empresa XPTO (12345678000199)")
        self.assertEqual(Cliente.objects.count(), 1)


class EquipamentoModelTest(TestCase):
    def test_criar_equipamento(self):
        equipamento = Equipamento.objects.create(
            nome="Caixa de Som",
            descricao="Caixa de som JBL",
            quantidade_total=10,
            quantidade_disponivel=10,
            preco_unitario=100.00
        )
        self.assertEqual(str(equipamento), "Caixa de Som (10/10)")
        self.assertEqual(equipamento.preco_unitario, 100.00)


class LocacaoModelTest(TestCase):
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome_razao="Cliente Teste",
            tipo_pessoa="F",
            cpf_cnpj="12345678901"
        )
        self.equipamento = Equipamento.objects.create(
            nome="Projetor",
            quantidade_total=5,
            quantidade_disponivel=5,
            preco_unitario=200
        )

    def test_criar_locacao_com_item(self):
        locacao = Locacao.objects.create(
            cliente=self.cliente,
            data_inicio=date.today(),
            data_fim=date.today() + timedelta(days=2),
        )
        item = ItemLocacao.objects.create(
            locacao=locacao,
            equipamento=self.equipamento,
            quantidade=2
        )

        # Estoque deve diminuir
        self.equipamento.refresh_from_db()
        self.assertEqual(self.equipamento.quantidade_disponivel, 3)

        # Total da locação deve atualizar
        locacao.refresh_from_db()
        self.assertEqual(locacao.valor_total, item.valor_total)

    def test_nao_permitir_estoque_insuficiente(self):
        locacao = Locacao.objects.create(
            cliente=self.cliente,
            data_inicio=date.today(),
            data_fim=date.today() + timedelta(days=2),
        )
        with self.assertRaises(ValidationError):
            ItemLocacao.objects.create(
                locacao=locacao,
                equipamento=self.equipamento,
                quantidade=10  # maior que estoque
            )

    def test_devolver_estoque_ao_excluir_item(self):
        locacao = Locacao.objects.create(
            cliente=self.cliente,
            data_inicio=date.today(),
            data_fim=date.today() + timedelta(days=2),
        )
        item = ItemLocacao.objects.create(
            locacao=locacao,
            equipamento=self.equipamento,
            quantidade=2
        )

        item.delete()
        self.equipamento.refresh_from_db()
        self.assertEqual(self.equipamento.quantidade_disponivel, 5)


class AuditLogTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="teste", password="1234")
        self.client.force_login(self.user)

    def test_log_criado_ao_criar_cliente(self):
        cliente = Cliente.objects.create(
            nome_razao="Auditado",
            tipo_pessoa="F",
            cpf_cnpj="98765432100"
        )
        logs = AuditLog.objects.filter(modelo="Cliente")
        self.assertTrue(logs.exists())
        self.assertEqual(logs.first().acao, "CREATE")

    def test_log_criado_ao_deletar_cliente(self):
        cliente = Cliente.objects.create(
            nome_razao="Auditado",
            tipo_pessoa="F",
            cpf_cnpj="98765432100"
        )
        cliente.delete()
        logs = AuditLog.objects.filter(modelo="Cliente", acao="DELETE")
        self.assertTrue(logs.exists())
