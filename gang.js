$(document).ready(function () {
  // sweetAlert("title", "description", "error");
});

$("#btnSave").click(function () {
  cadastraLoja();
});

$("#btnConsultar").click(function () {
  var cep = $("#zipCode").val();
  validaCep(cep, function () {
    consultaCep(cep);
  });
});

function cadastraLoja() {
  var name = $("#storeName").val();
  var cnpj = $("#cnpj").val();
  var cep = $("#cep").val();

  var body = { name, cnpj, cep };

  validaCnpj(cnpj, function () {
    validaCep(cep, function () {
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://localhost:7021/Store",
        data: JSON.stringify(body),
        dataType: "json",
        timeout: 100000,
        success: function (data) {
          console.log("SUCCESS: ", data);
          display(data);
        },
        error: function (e) {
          console.log("ERROR: ", e);
          display(e);
        },
        done: function (e) {
          console.log("DONE");
        },
      });
    });
  });
}

function calculaDigitos(digitos, posicoes = 10, somaDigitos = 0) {
  digitos = digitos.toString();

  console.log("digitos lenght => ", digitos.length);
  for (var i = 0; i < digitos.length; i++) {
    somaDigitos = somaDigitos + digitos[i] * posicoes;
    posicoes = posicoes - 1;

    if (posicoes < 2) {
      posicoes = 9;
    }
  }

  somaDigitos = somaDigitos % 11;

  if (somaDigitos < 2) {
    somaDigitos = 0;
  } else {
    somaDigitos = 11 - somaDigitos;
  }

  var cnpj = digitos + somaDigitos;
  return cnpj;
}

function validaCnpj(valor, cb) {
  valor = valor.toString();
  valor = valor.replace(/[^0-9]/g, "");

  var cnpjOriginal = valor;
  var primeirosNumerosCnpj = valor.substr(0, 12);

  var calculo1 = calculaDigitos(primeirosNumerosCnpj, 5);
  var calculo2 = calculaDigitos(calculo1, 6);

  var confereCnpj = calculo2;

  if (cnpjOriginal === confereCnpj) {
    console.log("CNPJ Valido");
    cb();
    return true;
  }

  sweetAlert("ERRO", "CNPJ Invalido", "error");
  console.log("CNPJ Invalido");
  return false;
}

function validaCep(cep, cb) {
  var regex = /\d{5}-?\d{3}/gi;
  if (regex.test(cep) === true) {
    console.log("CEP Valido");
    cb();
    return true;
  }
  sweetAlert("ERRO", "CEP Invalido", "error");
  console.log("CEP invalido");
  return false;
}

function consultaCep(cep) {
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "https://viacep.com.br/ws/" + cep + "/json/",
    timeout: 100000,
    success: function (data) {
      console.log("SUCCESS: ", data);
      sweetAlert(
        "CEP Consultado",
        "Cidade: " + data.localidade + "   Rua: " + data.logradouro + "",
        "success"
      );
    },
    error: function (e) {
      console.log("ERROR: ", e);
    },
    done: function (e) {
      console.log("DONE");
    },
  });
}
