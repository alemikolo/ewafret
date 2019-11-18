$(document).ready(function() {
  $(".alert-error").each(function() {
    if ($(this).text() == "") {
      $(this).remove();
    }
  });

  $(".validable").bind("focusout", ValidateForm);

  function ValidateForm(event = null, paramField = null) {
    // ValidateParams constructor
    function oValidateParams(regexp, nullMonit, errorMonit) {
      this.regexp = regexp;
      this.nullMonit = nullMonit;
      this.errorMonit = errorMonit;
    }
    var oValidateSettings = {
      name: new oValidateParams(
        /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ -\']{1,60}$/,
        "Prosimy wprowadzić imię i nazwisko.",
        "Prosimy wprowadzić imię i nazwisko, korzystając wyłącznie z liter, myślnika i apostrofu."
      ),
      //"surname": new oValidateParams(/^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ -\']{1,30}$/, 'Prosimy wprowadzić nazwisko.', 'Prosimy wprowadzić nazwisko, korzystając wyłącznie z liter, myślnika i apostrofu.'),
      //  "company":  new oValidateParams(/^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ0-9,.)-:(!? \']{1,100}$/,'Prosimy wprowadzić nazwę firmy.','Prosimy nazwę firmy, korzystając wyłącznie z liter, cyfr oraz znaków ,.)-:(!?\'.'),
      email: new oValidateParams(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/,
        "Prosimy wprowadzić adres e-mail.",
        "Prosimy wprowadzić poprawny adres e-mail."
      ),
      //  "phone": new oValidateParams(/^[0-9]{9}$/ ,'Prosimy wprowadzić numer telefonu.','Prosimy wprowadzić poprawny numer telefonu.'),
      subject: new oValidateParams(
        /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ0-9,.)-:(!? \']{1,500}$/,
        "Prosimy wprowadzić temat wiadomości.",
        "Prosimy wprowadzić temat wiadomości, korzystając wyłącznie z liter, cyfr oraz znaków ,.)-:(!?'."
      ),
      content: new oValidateParams(
        /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ0-9,.)-:(!? \'\n]{1,2000}$/,
        "Prosimy wprowadzić treść wiadomości.",
        "Prosimy wprowadzić temat wiadomości, korzystając wyłącznie z liter, cyfr oraz znaków ,.)-:(!?'."
      ),
      rodo: new oValidateParams(
        undefined,
        'Prosimy zaznaczyć pole: "Zapoznałem się z informacją o przetwarzaniu danych."',
        'Niepoprawna wartość pola: "Zapoznałem się z informacją o przetwarzaniu danych."'
      )
    };

    var oField = event === null ? paramField : $(this);
    var sFieldName = oField.attr("name");

    function getErrorDiv(field) {
      if (oField.next().hasClass("alert-error")) {
        oField.next().remove();
      }

      if (
        oField
          .next()
          .next()
          .hasClass("alert-error")
      ) {
        oField
          .next()
          .next()
          .remove();
      }

      if (
        oField.attr("id") === "rodo" &&
        $("#rodo-input")
          .next()
          .hasClass("alert-error")
      ) {
        $("#rodo-input")
          .next()
          .remove();
      }
    }

    getErrorDiv(oField);

    function ValidateInput(field) {
      var fieldValue = getValidatingValue(oField);
      var bIsValid = true;
      if (fieldValue !== "") {
        var sName = field.attr("name");
        var sParam = oValidateSettings[sName].regexp;
        bIsValid = sParam ? sParam.test(fieldValue) : !!fieldValue;
      }
      return bIsValid;
    }

    function getValidatingValue(field) {
      return field.attr("type") === "checkbox"
        ? field.prop("checked")
        : $.trim(field.val());
    }

    if (oField.hasClass("required")) {
      var fieldValue = getValidatingValue(oField);
      if (!fieldValue && fieldValue !== 0) {
        oField.data("valid", false);
        if (
          oField.attr("type") === "checkbox" &&
          oField.attr("id") !== "rodo"
        ) {
          oField
            .addClass("error")
            .next()
            .after(
              '<div class="alert-error">' +
                oValidateSettings[sFieldName].nullMonit +
                "</div>"
            );
        } else if (
          oField.attr("type") === "checkbox" &&
          oField.attr("id") === "rodo"
        ) {
          oField.addClass("error");
          $("#rodo-input").after(
            '<div class="alert-error">' +
              oValidateSettings[sFieldName].nullMonit +
              "</div>"
          );
        } else {
          oField
            .addClass("error")
            .after(
              '<div class="alert-error">' +
                oValidateSettings[sFieldName].nullMonit +
                "</div>"
            );
        }
        return;
      }
    }
    if (!ValidateInput(oField)) {
      oField
        .addClass("error")
        .after(
          '<div class="alert-error">' +
            oValidateSettings[sFieldName].errorMonit +
            "</div>"
        );
      oField.data("valid", false);
    } else {
      oField.removeClass("error");
      oField.data("valid", true);
    }
  }

  $("#submit").on("click", function(event) {
    var bDataValid = true;
    if (!$("#robot").is(":checked")) {
      $(".validable").each(function() {
        var oField = $(this);
        if (oField.data("valid") === undefined) {
          ValidateForm(null, oField);
        }
        if (
          oField.next().hasClass("alert-error") ||
          oField
            .next()
            .next()
            .hasClass("alert-error")
        ) {
          bDataValid = false;
        }
      });
    } else {
      bDataValid = false;
    }

    return bDataValid;
  });
});
