// cadastro/static/cadastro/js/itemlocacao.js
document.addEventListener("DOMContentLoaded", function () {
    function updateRowTotals(row) {
        let quantidade = row.querySelector("[name$='quantidade']");
        let valorUnitario = row.querySelector("[name$='valor_unitario']");
        let valorTotal = row.querySelector("[name$='valor_total']");

        if (quantidade && valorUnitario && valorTotal) {
            let qtd = parseFloat(quantidade.value) || 0;
            let unit = parseFloat(valorUnitario.value) || 0;
            valorTotal.value = (qtd * unit).toFixed(2);
        }

        // Atualiza total da locacao
        let totalLocacaoField = document.querySelector("#id_valor_total");
        if (totalLocacaoField) {
            let total = 0;
            document.querySelectorAll("input[name$='valor_total']").forEach(function (input) {
                total += parseFloat(input.value) || 0;
            });
            totalLocacaoField.value = total.toFixed(2);
        }
    }

    document.querySelectorAll("tr.form-row").forEach(function (row) {
        let quantidade = row.querySelector("[name$='quantidade']");
        let valorUnitario = row.querySelector("[name$='valor_unitario']");

        if (quantidade) quantidade.addEventListener("input", function () { updateRowTotals(row); });
        if (valorUnitario) valorUnitario.addEventListener("input", function () { updateRowTotals(row); });
    });
});
